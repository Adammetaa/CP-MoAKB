const TILE_SIZE = 256;
const MAX_LATITUDE = 85.05112878;

export const DEFAULT_MAP_TILE_CONFIG = Object.freeze({
  url_template: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution_html: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  min_zoom: 3,
  max_zoom: 19,
});

export function resolveMapTileConfig(runtimeConfig = globalThis.__CPMOAKB_MAP_CONFIG) {
  return { ...DEFAULT_MAP_TILE_CONFIG, ...(runtimeConfig ?? {}) };
}

export function projectWebMercator(latitude, longitude, zoom) {
  const limitedLatitude = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, Number(latitude)));
  const scale = TILE_SIZE * 2 ** zoom;
  const sine = Math.sin(limitedLatitude * Math.PI / 180);
  return {
    x: (Number(longitude) + 180) / 360 * scale,
    y: (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * scale,
  };
}

export function unprojectWebMercator(x, y, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const longitude = x / scale * 360 - 180;
  const latitude = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / scale))) * 180 / Math.PI;
  return { latitude, longitude };
}

const GOOGLE_MAPS_KEY_URL = new URL("./google-maps-key.local.txt", import.meta.url);
let googleMapsPromise;

export async function loadGoogleMaps() {
  if (globalThis.google?.maps) return globalThis.google.maps;
  if (googleMapsPromise) return googleMapsPromise;
  googleMapsPromise = (async () => {
    const response = await fetch(GOOGLE_MAPS_KEY_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Google Maps local key is not configured");
    const apiKey = (await response.text()).trim();
    if (!apiKey || apiKey.startsWith("YOUR_")) throw new Error("Google Maps local key is empty");
    await new Promise((resolve, reject) => {
      const callbackName = `__cpmoakbGoogleMapsReady${Date.now()}`;
      const script = document.createElement("script");
      globalThis[callbackName] = () => { delete globalThis[callbackName]; resolve(); };
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}&v=weekly&loading=async`;
      script.async = true;
      script.onerror = () => { delete globalThis[callbackName]; reject(new Error("Google Maps failed to load")); };
      document.head.append(script);
    });
    return globalThis.google.maps;
  })();
  return googleMapsPromise;
}

export class GoogleSatelliteMapAdapter {
  constructor(container, maps) { this.container = container; this.maps = maps; this.overlays = []; this.listeners = []; }

  mount({ center, zoom = 17, points = [], closed = false, mode = "tap", onMapClick, onViewportChange } = {}) {
    this.mode = mode; this.onMapClick = onMapClick; this.onViewportChange = onViewportChange;
    this.container.classList.add("real-map-surface", "google-satellite-map");
    this.container.innerHTML = "";
    this.map = new this.maps.Map(this.container, {
      center: { lat: Number(center.latitude), lng: Number(center.longitude) }, zoom: Number(zoom), mapTypeId: "satellite",
      disableDefaultUI: true, clickableIcons: false, keyboardShortcuts: false, gestureHandling: "greedy", tilt: 0,
    });
    this.listeners.push(this.map.addListener("click", (event) => {
      if (this.mode === "tap") this.onMapClick?.({ latitude: event.latLng.lat(), longitude: event.latLng.lng() });
    }));
    this.listeners.push(this.map.addListener("idle", () => {
      const mapCenter = this.map.getCenter();
      this.onViewportChange?.({ center: { latitude: mapCenter.lat(), longitude: mapCenter.lng() }, zoom: this.map.getZoom() });
    }));
    this._draw(points, closed);
    return this;
  }

  _draw(points, closed) {
    const path = points.map((point) => ({ lat: Number(point.latitude), lng: Number(point.longitude) }));
    if (path.length > 1) {
      const Shape = closed ? this.maps.Polygon : this.maps.Polyline;
      const shape = new Shape({ map: this.map, paths: closed ? path : undefined, path: closed ? undefined : path, strokeColor: "#dfff62", strokeOpacity: 1, strokeWeight: 4, fillColor: "#6f992d", fillOpacity: .34, clickable: false });
      this.overlays.push(shape);
    }
    path.forEach((position, index) => {
      const marker = new this.maps.Marker({ map: this.map, position, label: { text: String(index + 1), color: "#075f36", fontWeight: "800" }, icon: { path: this.maps.SymbolPath.CIRCLE, fillColor: "#ffffff", fillOpacity: 1, strokeColor: "#075f36", strokeWeight: 4, scale: 9 }, clickable: false });
      this.overlays.push(marker);
    });
  }

  getCenter() { const center = this.map.getCenter(); return { latitude: center.lat(), longitude: center.lng() }; }
  destroy() { this.listeners.forEach((listener) => listener.remove()); this.overlays.forEach((overlay) => overlay.setMap(null)); this.listeners = []; this.overlays = []; }
}

export async function createPreferredMapAdapter(container) {
  try { return new GoogleSatelliteMapAdapter(container, await loadGoogleMaps()); }
  catch { return new BrowserMapAdapter(container); }
}

export async function mountGoogleFieldPreview(container, coordinates) {
  let maps;
  try { maps = await loadGoogleMaps(); }
  catch {
    if (!container?.isConnected || !coordinates?.length) return null;
    const points = coordinates.map(([longitude, latitude]) => ({ latitude:Number(latitude), longitude:Number(longitude) }));
    const center = { latitude:points.reduce((sum, point) => sum + point.latitude, 0) / points.length, longitude:points.reduce((sum, point) => sum + point.longitude, 0) / points.length };
    const fallback = new BrowserMapAdapter(container);
    fallback.mount({ center, zoom:16, points, closed:true, mode:"preview" });
    return () => fallback.destroy();
  }
  if (!container?.isConnected) return null;
  const path = coordinates.map(([longitude, latitude]) => ({ lat: Number(latitude), lng: Number(longitude) }));
  const mapSurface = document.createElement("div");
  mapSurface.className = "google-field-preview-map";
  container.prepend(mapSurface);
  const map = new maps.Map(mapSurface, { mapTypeId: "satellite", disableDefaultUI: true, clickableIcons: false, gestureHandling: "none", keyboardShortcuts: false, tilt: 0 });
  const polygon = new maps.Polygon({ map, paths: path, strokeColor: "#dfff62", strokeOpacity: 1, strokeWeight: 3, fillColor: "#6f992d", fillOpacity: .25, clickable: false });
  const bounds = new maps.LatLngBounds();
  path.forEach((point) => bounds.extend(point));
  map.fitBounds(bounds, 16);
  return () => { polygon.setMap(null); mapSurface.remove(); };
}

function escapeAttribute(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

export class BrowserMapAdapter {
  constructor(container, tileConfig = resolveMapTileConfig()) {
    this.container = container;
    this.tileConfig = tileConfig;
    this.center = { latitude: 13.7563, longitude: 100.5018 };
    this.zoom = 17;
    this.points = [];
    this.closed = false;
    this.mode = "tap";
    this.onMapClick = null;
    this.onViewportChange = null;
    this.drag = null;
    this.frame = null;
    this.tileLoaded = false;
  }

  mount({ center, zoom = 17, points = [], closed = false, mode = "tap", onMapClick, onViewportChange } = {}) {
    this.center = { ...this.center, ...(center ?? {}) };
    this.zoom = Math.max(this.tileConfig.min_zoom, Math.min(this.tileConfig.max_zoom, Number(zoom)));
    this.points = points;
    this.closed = closed;
    this.mode = mode;
    this.onMapClick = onMapClick;
    this.onViewportChange = onViewportChange;
    this.container.classList.add("real-map-surface");
    this.container.innerHTML = `<div class="real-map-fallback"><strong>กำลังโหลดแผนที่จริง…</strong><small>ต้องเชื่อมต่ออินเทอร์เน็ตเพื่อดูรายละเอียดพื้นที่</small></div><div class="real-map-tiles" aria-hidden="true"></div><svg class="real-map-polygon" aria-label="ขอบเขตแปลงที่วาด"></svg><div class="real-map-attribution">${this.tileConfig.attribution_html}</div>`;
    this.tilePane = this.container.querySelector(".real-map-tiles");
    this.polygonLayer = this.container.querySelector(".real-map-polygon");
    this.fallback = this.container.querySelector(".real-map-fallback");
    this._bindEvents();
    if (globalThis.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.scheduleRender());
      this.resizeObserver.observe(this.container);
    }
    this.render();
    return this;
  }

  destroy() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    this.container?.removeEventListener("pointerdown", this.handlePointerDown);
    this.container?.removeEventListener("pointermove", this.handlePointerMove);
    this.container?.removeEventListener("pointerup", this.handlePointerUp);
    this.container?.removeEventListener("pointercancel", this.handlePointerCancel);
  }

  getCenter() { return { ...this.center }; }

  setZoom(zoom) {
    this.zoom = Math.max(this.tileConfig.min_zoom, Math.min(this.tileConfig.max_zoom, Number(zoom)));
    this.onViewportChange?.({ center: this.getCenter(), zoom: this.zoom });
    this.render();
  }

  scheduleRender() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => { this.frame = null; this.render(); });
  }

  render() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    const centerWorld = projectWebMercator(this.center.latitude, this.center.longitude, this.zoom);
    const left = centerWorld.x - width / 2;
    const top = centerWorld.y - height / 2;
    const firstTileX = Math.floor(left / TILE_SIZE);
    const lastTileX = Math.floor((left + width) / TILE_SIZE);
    const firstTileY = Math.floor(top / TILE_SIZE);
    const lastTileY = Math.floor((top + height) / TILE_SIZE);
    const tileCount = 2 ** this.zoom;
    const fragment = document.createDocumentFragment();

    for (let tileY = firstTileY; tileY <= lastTileY; tileY += 1) {
      if (tileY < 0 || tileY >= tileCount) continue;
      for (let tileX = firstTileX; tileX <= lastTileX; tileX += 1) {
        const wrappedX = ((tileX % tileCount) + tileCount) % tileCount;
        const image = document.createElement("img");
        image.alt = "";
        image.draggable = false;
        image.decoding = "async";
        image.src = this.tileConfig.url_template
          .replace("{z}", String(this.zoom))
          .replace("{x}", String(wrappedX))
          .replace("{y}", String(tileY));
        image.style.left = `${tileX * TILE_SIZE - left}px`;
        image.style.top = `${tileY * TILE_SIZE - top}px`;
        image.addEventListener("load", () => {
          if (!this.tileLoaded) {
            this.tileLoaded = true;
            this.container.classList.add("tiles-ready");
          }
        }, { once: true });
        image.addEventListener("error", () => image.remove(), { once: true });
        fragment.append(image);
      }
    }
    this.tilePane.replaceChildren(fragment);
    this._renderPolygon(centerWorld, width, height);
  }

  _renderPolygon(centerWorld, width, height) {
    const screenPoints = this.points.map((point) => {
      const world = projectWebMercator(point.latitude, point.longitude, this.zoom);
      return { x: width / 2 + world.x - centerWorld.x, y: height / 2 + world.y - centerWorld.y };
    });
    const pointsValue = screenPoints.map((point) => `${point.x},${point.y}`).join(" ");
    const shape = screenPoints.length > 1
      ? `<${this.closed ? "polygon" : "polyline"} points="${pointsValue}" ${this.closed ? 'fill="rgba(112,153,45,.34)"' : 'fill="none"'} stroke="#dfff62" stroke-width="3" stroke-linejoin="round"/>`
      : "";
    const markers = screenPoints.map((point, index) => `<g><circle cx="${point.x}" cy="${point.y}" r="9" fill="#fff" stroke="#11613b" stroke-width="4"/><text x="${point.x + 13}" y="${point.y - 11}" fill="#fff" stroke="rgba(0,0,0,.45)" stroke-width="2" paint-order="stroke" font-size="15" font-weight="800">${index + 1}</text></g>`).join("");
    this.polygonLayer.setAttribute("viewBox", `0 0 ${width} ${height}`);
    this.polygonLayer.innerHTML = `${shape}${markers}`;
  }

  _bindEvents() {
    this.handlePointerDown = (event) => {
      if (event.target.closest("button,a,input,select,textarea")) return;
      this.drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, centerWorld: projectWebMercator(this.center.latitude, this.center.longitude, this.zoom) };
      this.container.setPointerCapture(event.pointerId);
      this.container.classList.add("is-dragging");
    };
    this.handlePointerMove = (event) => {
      if (!this.drag || event.pointerId !== this.drag.pointerId) return;
      const worldX = this.drag.centerWorld.x - (event.clientX - this.drag.startX);
      const worldY = this.drag.centerWorld.y - (event.clientY - this.drag.startY);
      this.center = unprojectWebMercator(worldX, worldY, this.zoom);
      this.scheduleRender();
    };
    this.handlePointerUp = (event) => {
      if (!this.drag || event.pointerId !== this.drag.pointerId) return;
      const moved = Math.hypot(event.clientX - this.drag.startX, event.clientY - this.drag.startY);
      this.drag = null;
      this.container.classList.remove("is-dragging");
      this.onViewportChange?.({ center: this.getCenter(), zoom: this.zoom });
      if (moved <= 6 && this.mode === "tap") {
        const rect = this.container.getBoundingClientRect();
        const centerWorld = projectWebMercator(this.center.latitude, this.center.longitude, this.zoom);
        const worldX = centerWorld.x + event.clientX - rect.left - rect.width / 2;
        const worldY = centerWorld.y + event.clientY - rect.top - rect.height / 2;
        this.onMapClick?.(unprojectWebMercator(worldX, worldY, this.zoom));
      }
    };
    this.handlePointerCancel = () => { this.drag = null; this.container.classList.remove("is-dragging"); };
    this.container.addEventListener("pointerdown", this.handlePointerDown);
    this.container.addEventListener("pointermove", this.handlePointerMove);
    this.container.addEventListener("pointerup", this.handlePointerUp);
    this.container.addEventListener("pointercancel", this.handlePointerCancel);
  }
}

export function describeMapPoint(point) {
  return `${escapeAttribute(Number(point.latitude).toFixed(6))}, ${escapeAttribute(Number(point.longitude).toFixed(6))}`;
}
