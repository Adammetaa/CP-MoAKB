import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_MAP_TILE_CONFIG, GoogleSatelliteMapAdapter, projectWebMercator, resolveMapTileConfig, unprojectWebMercator } from "../assets/browser-map-adapter.js";

test("Web Mercator conversion round-trips a Thai field location", () => {
  const source = { latitude: 13.7563, longitude: 100.5018 };
  const projected = projectWebMercator(source.latitude, source.longitude, 17);
  const restored = unprojectWebMercator(projected.x, projected.y, 17);
  assert.ok(Math.abs(restored.latitude - source.latitude) < 1e-9);
  assert.ok(Math.abs(restored.longitude - source.longitude) < 1e-9);
});

test("Google Satellite adapter remains available behind local-key loading", () => {
  assert.equal(typeof GoogleSatelliteMapAdapter, "function");
});

test("map tile provider is visibly attributed and runtime configurable", () => {
  assert.match(DEFAULT_MAP_TILE_CONFIG.url_template, /^https:\/\/tile\.openstreetmap\.org/);
  assert.match(DEFAULT_MAP_TILE_CONFIG.attribution_html, /OpenStreetMap contributors/);
  const custom = resolveMapTileConfig({ url_template: "https://maps.example/{z}/{x}/{y}.png", max_zoom: 18 });
  assert.equal(custom.url_template, "https://maps.example/{z}/{x}/{y}.png");
  assert.equal(custom.max_zoom, 18);
  assert.equal(custom.min_zoom, DEFAULT_MAP_TILE_CONFIG.min_zoom);
});
