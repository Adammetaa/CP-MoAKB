import { STAGE_PROVENANCE, resolveMockUser, validateFieldName } from "./field-core.js";
import { FieldService, GuidanceService, LocationService, MapService, StageService, WeatherService, WorkspaceRepository, loadFieldConfiguration } from "./field-services.js";

const root = document.querySelector("#field-app");
const repository = new WorkspaceRepository(window.localStorage);
const fieldService = new FieldService(repository);
const locationService = new LocationService(navigator.geolocation, repository);
const mapService = new MapService();
const guidanceService = new GuidanceService();
const weatherService = new WeatherService();

let configuration = null;
let stageService = null;
let route = "loading";
let gpsState = null;
let weatherState;
let notice = null;
let formError = null;
let selectedFieldId = null;
let draft = createDraft();
let mapDrag = null;

function createDraft() {
  const location = repository.load().location_context;
  return {
    step: 1, name: "", mode: "tap", layer: "satellite",
    base: { latitude: location?.latitude ?? 13.7563, longitude: location?.longitude ?? 100.5018 },
    mapOffset: { x: 0, y: 0 }, points: [], closed: false, date: "", variety: "", plantingMethod: "",
    stageEstimate: null, stageChoice: STAGE_PROVENANCE.SYSTEM_ESTIMATED, overrideCmpStage: "",
  };
}

function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
function workspace() { return repository.load(); }
function currentUser() { const state = workspace(); return state.users.find((user) => user.user_id === state.active_user_id) ?? null; }
function selectedField() { const state = workspace(); const id = selectedFieldId ?? state.selected_field_id; return state.fields.find((field) => field.field_id === id) ?? null; }
function thaiDate(value) { if (!value) return "ยังไม่ระบุ"; return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)); }
function formatArea(area) { return area ? `${area.rai.toFixed(area.rai < 10 ? 2 : 1)} ไร่` : "0.00 ไร่"; }
function cropAge(field) { const date = field.planting_date ?? field.expected_planting_date; return date && stageService ? stageService.calculate_crop_age(date) : null; }

function brandMarkup(compact = false) {
  return `<a class="workspace-brand ${compact ? "compact" : ""}" href="#home" data-route="home" aria-label="SP Assistant หน้าหลัก"><span class="workspace-brand-mark" aria-hidden="true">🌾</span><span><strong>SP <em>Assistant</em></strong><small>ผู้ช่วยชาวนา เพื่ออนาคตของการผลิต</small></span></a>`;
}

function appHeader({ back = null, bell = false } = {}) {
  const user = currentUser();
  return `<header class="app-header"><div class="app-header-inner">${back ? `<button class="icon-button back-button" type="button" data-route="${back}" aria-label="ย้อนกลับ">←</button>` : ""}${brandMarkup(true)}<div class="header-actions">${bell ? `<button class="icon-button notification-button" type="button" data-action="notifications" aria-label="การแจ้งเตือน">♢<span>3</span></button>` : ""}<button class="profile-avatar" type="button" data-route="profile" aria-label="โปรไฟล์ของ ${escapeHtml(user?.display_name)}">👨🏽‍🌾</button></div></div></header>`;
}

function bottomNavigation(active) {
  const items = [["home", "⌂", "หน้าหลัก"], ["fields", "▦", "แปลง"], ["investigate", "▢", "แชท"], ["learn", "▤", "เรียนรู้"], ["profile", "♙", "โปรไฟล์"]];
  return `<nav class="field-bottom-nav" aria-label="เมนูหลัก">${items.map(([id, icon, label]) => `<button type="button" class="${active === id ? "active" : ""}" data-route="${id}"><span aria-hidden="true">${icon}</span>${label}</button>`).join("")}</nav>`;
}

function renderLoading() { root.innerHTML = `<main class="state-view"><div class="loading-orb">🌾</div><h1>กำลังเตรียมพื้นที่ทำงาน</h1><p>โหลดข้อมูลแปลงและบริการที่จำเป็น…</p></main>`; }

function renderLogin() {
  root.innerHTML = `<main class="login-view" aria-labelledby="login-title"><section class="login-shell"><div class="login-brand">${brandMarkup()}</div><div class="login-intro"><h1 id="login-title">ผู้ช่วยคู่ใจของชาวนา</h1><p>วางแผนการปลูก ติดตามผลผลิต และรับคำแนะนำที่แม่นยำ</p></div><form class="login-card" data-login-form novalidate><div class="form-message ${formError ? "error" : ""}" ${formError ? "" : "hidden"}>${escapeHtml(formError)}</div><label for="username">ชื่อผู้ใช้</label><div class="input-with-icon"><span aria-hidden="true">♙</span><input id="username" name="username" autocomplete="username" placeholder="SPA1 / CA1 / AG1" required></div><p class="field-help">ตัวอย่างชื่อผู้ใช้: SPA1 / CA1 / AG1</p><label for="password">รหัสผ่าน</label><div class="input-with-icon"><span aria-hidden="true">▣</span><input id="password" name="password" type="password" autocomplete="current-password" placeholder="รหัสผ่าน" required><button type="button" data-action="toggle-password" aria-label="แสดงรหัสผ่าน">◉</button></div><button class="primary-action" type="submit">เข้าสู่ระบบ</button><button class="login-help" type="button" data-action="forgot-password">▣ ลืมรหัสผ่าน</button><p class="prototype-hint">รุ่นต้นแบบสำหรับทดสอบภายใน · รหัสผ่านใดก็ได้ที่ไม่เว้นว่าง</p></form></section></main>`;
}

function renderGps() {
  const status = gpsState?.status ?? "REQUESTING";
  const content = status === "REQUESTING" ? { icon: "◎", title: "อนุญาตตำแหน่งเพื่อดูแลแปลงได้แม่นขึ้น", copy: "SP Assistant กำลังขอสิทธิ์ตำแหน่งสำหรับจัดกึ่งกลางแผนที่ สภาพอากาศ และบริบทความเสี่ยงในอนาคต" } : status === "AVAILABLE" ? { icon: "✓", title: "รับตำแหน่งปัจจุบันแล้ว", copy: `ความแม่นยำโดยประมาณ ±${Math.round(gpsState.accuracy)} เมตร ตำแหน่งถูกเก็บไว้ในอุปกรณ์นี้` } : { icon: "⌁", title: "ใช้งานต่อได้โดยไม่เปิดตำแหน่ง", copy: gpsState?.message ?? "คุณสามารถกำหนดแปลงบนแผนที่ด้วยตนเองได้ทุกเมื่อ" };
  root.innerHTML = `<main class="permission-view"><section class="permission-card"><div class="permission-icon ${status.toLowerCase()}">${content.icon}</div><p class="eyebrow">ตั้งค่าเริ่มต้น</p><h1>${content.title}</h1><p>${content.copy}</p><div class="permission-benefits"><span>☀ <strong>สภาพอากาศ</strong></span><span>⌖ <strong>จัดกึ่งกลางแผนที่</strong></span><span>◌ <strong>บริบทพื้นที่</strong></span></div>${status === "REQUESTING" ? `<div class="loading-line"><span></span></div><button class="secondary-action" type="button" data-action="gps-skip">ข้ามไปก่อน</button>` : `<button class="primary-action" type="button" data-route="home">ไปหน้าหลัก</button>${status !== "AVAILABLE" ? `<button class="secondary-action" type="button" data-action="gps-retry">ลองขอตำแหน่งอีกครั้ง</button>` : ""}`}</section></main>`;
}

function weatherMarkup() {
  if (weatherState === undefined) return `<article class="weather-card loading-card"><span class="skeleton short"></span><span class="skeleton"></span></article>`;
  if (weatherState.status !== "AVAILABLE") return `<article class="weather-card unavailable"><div><strong>สภาพอากาศไม่พร้อมใช้งาน</strong><small>เปิดตำแหน่งเพื่อรับข้อมูลบริบทพื้นที่</small></div><button type="button" data-action="weather-refresh" aria-label="ลองใหม่">↻</button></article>`;
  const updated = new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date(weatherState.updated_at));
  return `<article class="weather-card"><div class="weather-main"><span class="weather-icon">🌤️</span><span><strong>${weatherState.temperature}°C</strong><small>${escapeHtml(weatherState.condition)}</small></span></div><div class="weather-wind"><span>〰</span><strong>${weatherState.wind_speed} ${weatherState.unit}</strong></div><div class="weather-update"><small>อัปเดตล่าสุด</small><strong>${updated}</strong><button type="button" data-action="weather-refresh" aria-label="รีเฟรชสภาพอากาศ">↻</button></div></article>`;
}

function fieldCardMarkup(field) {
  const age = cropAge(field);
  const ageLabel = age?.state === "PLANNED" ? `อีก ${age.days_until_planting} วันถึงวันปลูก` : age ? `${age.crop_age_days} วัน` : "ยังไม่ระบุ";
  return `<article class="selected-field-card"><div class="field-card-visual"><span class="field-label">✓ แปลงที่เลือกอยู่</span><div class="rice-scene"><span>🌾</span><span>🌾</span><span>🌾</span><span>🌾</span></div></div><div class="field-card-body"><div class="field-card-title"><div><h2>${escapeHtml(field.name)} <span class="favorite">★</span></h2><small>ID: ${escapeHtml(field.field_id.slice(0, 18))}</small></div><button class="icon-button" type="button" data-field-open="${field.field_id}" aria-label="เปิดรายละเอียดแปลง">›</button></div><dl class="field-facts"><div><dt>🌾 พันธุ์ข้าว</dt><dd>${escapeHtml(field.variety || "ยังไม่ระบุ")}</dd></div><div><dt>🍃 อายุข้าว</dt><dd>${ageLabel}</dd></div><div><dt>▦ วันที่ปลูก</dt><dd>${thaiDate(field.planting_date ?? field.expected_planting_date)}</dd></div><div><dt>🌱 ระยะการเจริญเติบโต</dt><dd>${escapeHtml(field.current_crop_stage?.label ?? "ยังไม่ประเมิน")}</dd></div></dl><div class="cmp-row"><span>▣ ระยะตามการจัดการ (CMP)</span><strong>${escapeHtml(field.current_cmp_stage?.label ?? field.current_cmp_stage?.stage_id ?? "ยังไม่ประเมิน")}</strong></div></div></article>`;
}

function emptyFieldMarkup() {
  return `<section class="empty-field-card"><div class="empty-illustration">⌖<span>＋</span></div><p class="eyebrow">เริ่มต้นใช้งาน</p><h2>สร้างแปลงแรกของคุณ</h2><p>วาดขอบเขตแปลงเพียงไม่กี่จุด แล้วระบบจะช่วยคำนวณพื้นที่และระยะการปลูกให้</p><button class="primary-action" type="button" data-action="create-field">＋ สร้างแปลงใหม่</button><small>คุณยังอ่านเนื้อหาและใช้แชทได้โดยไม่ต้องสร้างแปลง</small></section>`;
}

function renderHome() {
  const user = currentUser(); const fields = fieldService.list_fields(user.user_id); const field = selectedField() ?? fields[0] ?? null;
  if (field && !selectedFieldId) selectedFieldId = field.field_id;
  const guidance = guidanceService.get_guidance(field);
  root.innerHTML = `${appHeader({ bell: true })}<main class="app-main home-main"><section class="home-hero"><div><p class="eyebrow">FIELD INTELLIGENCE WORKSPACE</p><h1>สวัสดีครับ คุณ${escapeHtml(user.display_name)} <span>👋</span></h1><p>${field ? "วันนี้มาดูแลแปลงของคุณให้พร้อมกัน" : "เริ่มจากสร้างแปลงแรก หรือสำรวจความรู้สำหรับฤดูกาลนี้"}</p></div>${weatherMarkup()}</section>${notice ? `<div class="toast-message">${escapeHtml(notice)}</div>` : ""}${field ? `<section class="home-field">${fieldCardMarkup(field)}<div class="field-cta-row"><button class="primary-action" type="button" data-action="create-field">＋ สร้างแปลงใหม่</button><button class="secondary-action" type="button" data-field-open="${field.field_id}">⌖ ดูแผนที่แปลง</button></div></section>` : emptyFieldMarkup()}<section class="today-section"><header class="section-heading"><div><p class="eyebrow">รายการภาคสนาม</p><h2>${field ? "วันนี้ควรตรวจอะไรบ้าง" : "เริ่มเรียนรู้ได้ทันที"}</h2></div><button type="button" data-route="learn">ดูทั้งหมด ›</button></header><div class="guidance-grid">${guidance.map((item, index) => `<button class="guidance-card tone-${index + 1}" type="button" ${field ? `data-route="investigate"` : `data-route="learn"`}><span>${["🌱", "💧", "✎"][index] ?? "▤"}</span><strong>${escapeHtml(item.title)}</strong><small>${field ? "แตะเพื่อเริ่มตรวจ" : "เปิดศูนย์เรียนรู้"}</small></button>`).join("")}</div></section>${field ? `<section class="tip-card"><span>💡</span><div><strong>เคล็ดลับวันนี้</strong><p>บันทึกสิ่งที่สังเกตเห็นตามจริง และแยกข้อสังเกตออกจากสาเหตุที่ยังไม่ยืนยัน</p></div></section>` : ""}</main>${bottomNavigation("home")}`;
  if (weatherState === undefined) refreshWeather();
}

function renderFields() {
  const user = currentUser(); const fields = fieldService.list_fields(user.user_id);
  root.innerHTML = `${appHeader({ back: "home" })}<main class="app-main list-main"><div class="page-heading"><div><p class="eyebrow">ข้อมูลที่บันทึกในอุปกรณ์</p><h1>แปลงของฉัน</h1><p>แปลงแต่ละรายการใช้รหัสเฉพาะ ไม่อ้างอิงชื่อแปลงเป็นตัวตน</p></div><button class="primary-action compact-action" type="button" data-action="create-field">＋ สร้างแปลง</button></div>${fields.length ? `<div class="field-list">${fields.map((field) => `<button type="button" class="field-list-item" data-field-open="${field.field_id}"><span class="mini-map">⌖</span><span><strong>${escapeHtml(field.name)}</strong><small>${formatArea(field.area)} · ${escapeHtml(field.current_cmp_stage?.label ?? "ยังไม่ประเมิน")}</small><em>${escapeHtml(field.field_id)}</em></span><b>›</b></button>`).join("")}</div>` : emptyFieldMarkup()}</main>${bottomNavigation("fields")}`;
}

function mapToolbarMarkup() {
  return `<div class="map-mode-switch" role="group" aria-label="วิธีวาดแปลง"><button type="button" class="${draft.mode === "tap" ? "active" : ""}" data-map-mode="tap"><span>☝</span><strong>แตะบนแผนที่</strong><small>แตะทีละจุดเพื่อกำหนดมุมแปลง</small></button><button type="button" class="${draft.mode === "center" ? "active" : ""}" data-map-mode="center"><span>⌖</span><strong>ใช้ตำแหน่งกึ่งกลาง</strong><small>เลื่อนแผนที่แล้วเพิ่มจุด</small></button></div>`;
}

function mapSvgMarkup() {
  const polygon = draft.points.map((point) => `${point.x * 100},${point.y * 100}`).join(" ");
  const shape = draft.closed ? `<polygon points="${polygon}" fill="rgba(173,214,73,.34)" stroke="#d5f05a" stroke-width="1.1" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : `<polyline points="${polygon}" fill="none" stroke="#d5f05a" stroke-width="1.1" vector-effect="non-scaling-stroke"/>`;
  return `<svg class="polygon-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${draft.points.length > 1 ? shape : ""}${draft.points.map((point, index) => `<circle cx="${point.x * 100}" cy="${point.y * 100}" r="1.8" fill="#fff" stroke="#14643d" stroke-width=".8" vector-effect="non-scaling-stroke"/><text x="${point.x * 100 + 2.4}" y="${point.y * 100 - 2}" fill="#fff" font-size="4">${index + 1}</text>`).join("")}</svg>`;
}

function currentDraftGeometry() {
  if (draft.points.length < 3) return null;
  try { const polygon = mapService.create_polygon(draft.points); return { polygon, centroid: mapService.calculate_centroid(polygon), area: mapService.calculate_area(polygon) }; } catch { return null; }
}

function renderCreateField() {
  root.innerHTML = `${appHeader({ back: draft.step === 1 ? "home" : "create" })}<main class="create-main"><header class="create-heading"><h1>สร้างแปลงใหม่</h1><ol class="stepper"><li class="${draft.step >= 1 ? "active" : ""}"><span>1</span>วาดแปลง</li><li class="${draft.step >= 2 ? "active" : ""}"><span>2</span>ข้อมูลแปลง</li><li class="${draft.step >= 3 ? "active" : ""}"><span>3</span>บันทึก</li></ol></header>${draft.step === 1 ? renderMapStep() : draft.step === 2 ? renderDetailsStep() : renderSavedStep()}</main>${bottomNavigation("fields")}`;
  if (draft.step === 2) updateStagePreview();
}

function renderMapStep() {
  const geometry = currentDraftGeometry();
  return `<section class="map-step"><div class="map-instructions"><h2>วิธีวาดแปลง <small>(เลือกวิธีที่ถนัด)</small></h2>${mapToolbarMarkup()}</div>${formError ? `<div class="form-message error">${escapeHtml(formError)}</div>` : ""}<div class="map-canvas ${draft.layer} ${draft.mode === "center" ? "center-mode" : ""}" data-map-canvas style="--map-x:${draft.mapOffset.x}px;--map-y:${draft.mapOffset.y}px"><div class="map-grid"></div>${mapSvgMarkup()}${draft.mode === "center" ? `<div class="center-crosshair" aria-hidden="true">⌾</div>` : ""}<div class="map-hint">${draft.closed ? "ขอบเขตแปลงปิดแล้ว" : draft.mode === "tap" ? "แตะบนแผนที่เพื่อเพิ่มจุดมุมแปลง" : "ลากแผนที่ให้จุดที่ต้องการอยู่ใต้เป้า"}</div><div class="map-controls"><button type="button" data-map-action="location">⌾<span>ตำแหน่งปัจจุบัน</span></button><button type="button" data-map-action="layer">▱<span>ชั้นข้อมูล</span></button><button type="button" data-map-action="undo" ${draft.points.length ? "" : "disabled"}>↶<span>ย้อนกลับ</span></button><button type="button" data-map-action="clear" ${draft.points.length ? "" : "disabled"}>⌫<span>ล้างแปลง</span></button></div>${draft.mode === "center" && !draft.closed ? `<button class="add-center-point" type="button" data-map-action="add-center">⌖ <strong>เพิ่มจุดที่ตำแหน่งนี้</strong><small>จุดที่ ${draft.points.length + 1}</small></button>` : ""}<div class="map-area-badge">🌾 ${geometry ? formatArea(geometry.area) : "เพิ่มอย่างน้อย 3 จุด"}</div></div><section class="map-bottom-sheet"><div class="sheet-handle"></div><label for="field-name">ชื่อแปลง <b>*</b></label><div class="field-name-row"><input id="field-name" maxlength="50" value="${escapeHtml(draft.name)}" placeholder="เช่น นาบ้านทุ่งทอง, แปลงนาข้าวปี 2569"><span>${draft.name.length} / 50</span></div><p class="field-help">ตั้งชื่อให้สั้นและจำง่าย รองรับภาษาไทย อังกฤษ ตัวเลข เว้นวรรค - _ และวงเล็บ</p><div class="area-summary"><span>ขนาดพื้นที่โดยประมาณ</span><strong>${geometry ? `${formatArea(geometry.area)} (${geometry.area.hectares.toFixed(2)} เฮกตาร์)` : "ยังคำนวณไม่ได้"}</strong></div><p class="soft-warning">ⓘ พื้นที่เป็นค่าประมาณจากจุดที่วาด คุณสามารถแก้ไขจุดก่อนบันทึกได้</p><div class="sheet-actions"><button class="secondary-action" type="button" data-map-action="finish" ${draft.points.length >= 3 && !draft.closed ? "" : "disabled"}>ปิดรูปแปลง</button><button class="primary-action" type="button" data-action="map-next" ${draft.closed ? "" : "disabled"}>ถัดไป</button></div></section></section>`;
}

function renderDetailsStep() {
  const stages = configuration?.stage_rules ?? [];
  return `<section class="details-step"><div class="details-card"><header><span class="section-icon">▣</span><div><h2>ข้อมูลสำคัญของแปลง</h2><p>กรอกเท่าที่จำเป็น ระบบจะคำนวณอายุและระยะให้อัตโนมัติ</p></div></header>${formError ? `<div class="form-message error">${escapeHtml(formError)}</div>` : ""}<form data-details-form novalidate><div class="form-grid"><label>ชื่อแปลง <b>*</b><input name="name" maxlength="50" value="${escapeHtml(draft.name)}" required><small>สูงสุด 50 ตัวอักษร</small></label><label>วันที่ปลูก / วันที่คาดว่าจะปลูก <b>*</b><input name="date" type="date" value="${escapeHtml(draft.date)}" required><small>เลือกวันที่ในอนาคตได้</small></label><label>พันธุ์ข้าว <b>*</b><input name="variety" value="${escapeHtml(draft.variety)}" placeholder="กรอกพันธุ์ข้าว" required></label><label>วิธีปลูก <b>*</b><select name="plantingMethod" required><option value="">เลือกวิธีปลูก</option>${(configuration?.planting_methods ?? []).map((item) => `<option value="${item.id}" ${draft.plantingMethod === item.id ? "selected" : ""}>${escapeHtml(item.label_th)}</option>`).join("")}</select></label></div><section class="stage-calculation" data-stage-preview><div class="loading-line"><span></span></div></section><section class="stage-confirm"><p>ระยะข้าวที่ระบบประเมินถูกต้องหรือไม่?</p><div class="confirm-actions"><button type="button" class="${draft.stageChoice === STAGE_PROVENANCE.USER_CONFIRMED ? "selected" : ""}" data-stage-choice="confirm">✓ ถูกต้อง</button><button type="button" class="${draft.stageChoice === "UNSURE" ? "selected unsure" : ""}" data-stage-choice="unsure">? ยังไม่แน่ใจ</button><button type="button" class="${draft.stageChoice === STAGE_PROVENANCE.USER_OVERRIDDEN ? "selected edit" : ""}" data-stage-choice="edit">✎ แก้ไข</button></div>${draft.stageChoice === STAGE_PROVENANCE.USER_OVERRIDDEN ? `<label class="override-stage">เลือกระยะข้าวเอง<select name="overrideCmpStage"><option value="">เลือกระยะ</option>${stages.map((item) => `<option value="${item.stage_id}" ${draft.overrideCmpStage === item.stage_id ? "selected" : ""}>${item.stage_id} · ${escapeHtml(item.label_th)}</option>`).join("")}</select></label>` : ""}</section><div class="details-actions"><button class="secondary-action" type="button" data-action="details-back">ย้อนกลับ</button><button class="primary-action" type="submit">บันทึกข้อมูลและดูคำแนะนำ</button></div></form></div></section>`;
}

function renderSavedStep() {
  const field = selectedField();
  return `<section class="saved-state"><div class="success-mark">✓</div><p class="eyebrow">บันทึกในอุปกรณ์นี้แล้ว</p><h1>สร้างแปลงสำเร็จ</h1><p><strong>${escapeHtml(field?.name)}</strong> พร้อมใช้งาน ข้อมูลจะยังอยู่เมื่อรีเฟรชหน้า</p><div class="saved-facts"><span><small>พื้นที่</small><strong>${formatArea(field?.area)}</strong></span><span><small>ระยะ CMP</small><strong>${escapeHtml(field?.current_cmp_stage?.label)}</strong></span><span><small>ที่มาระยะ</small><strong>${escapeHtml(field?.stage_provenance)}</strong></span></div><button class="primary-action" type="button" data-field-open="${field?.field_id}">เปิดพื้นที่ทำงานแปลง</button><button class="secondary-action" type="button" data-route="home">กลับหน้าหลัก</button></section>`;
}

function polygonPreview(field) {
  const coordinates = field.polygon.coordinates[0].slice(0, -1); const lngs = coordinates.map((item) => item[0]), lats = coordinates.map((item) => item[1]);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs), minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const points = coordinates.map(([lng, lat]) => `${10 + ((lng - minLng) / (maxLng - minLng || 1)) * 80},${90 - ((lat - minLat) / (maxLat - minLat || 1)) * 80}`).join(" ");
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${points}" fill="rgba(173,214,73,.42)" stroke="#d5f05a" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}

function renderFieldDetail() {
  const field = selectedField(); if (!field) { route = "fields"; render(); return; }
  const age = cropAge(field);
  root.innerHTML = `${appHeader({ back: "home", bell: true })}<main class="app-main field-detail-main"><section class="field-detail-hero"><div class="field-detail-map">${polygonPreview(field)}<span>⌖</span><strong>${formatArea(field.area)}</strong></div><div class="field-detail-summary"><p class="eyebrow">แปลงที่เลือกอยู่ · ${escapeHtml(field.field_id)}</p><h1>${escapeHtml(field.name)} <span>★</span></h1><dl><div><dt>พันธุ์ข้าว</dt><dd>${escapeHtml(field.variety)}</dd></div><div><dt>${age.state === "PLANNED" ? "กำหนดปลูก" : "อายุข้าว"}</dt><dd>${age.state === "PLANNED" ? `อีก ${age.days_until_planting} วัน` : `${age.crop_age_days} วัน`}</dd></div><div><dt>วิธีปลูก</dt><dd>${escapeHtml((configuration?.planting_methods ?? []).find((item) => item.id === field.planting_method)?.label_th ?? field.planting_method)}</dd></div><div><dt>วันที่อ้างอิง</dt><dd>${thaiDate(field.planting_date ?? field.expected_planting_date)}</dd></div></dl></div></section><section class="stage-workspace"><div><p class="eyebrow">ระยะปัจจุบัน</p><h2>🌱 ${escapeHtml(field.current_crop_stage.label)}</h2><p>${escapeHtml(field.current_cmp_stage.stage_id)} · ${escapeHtml(field.stage_provenance)}</p></div><span class="stage-badge">${escapeHtml(field.current_cmp_stage.label)}</span></section><section class="workspace-actions"><button class="primary-action" type="button" data-route="investigate">⌕ เริ่มตรวจสุขภาพแปลง</button><button class="secondary-action" type="button" data-route="home">⌂ ดูคำแนะนำวันนี้</button></section><section class="identity-card"><h2>ข้อมูลอ้างอิงแปลง</h2><dl><div><dt>รหัสแปลง</dt><dd>${escapeHtml(field.field_id)}</dd></div><div><dt>รหัสฤดูปลูก</dt><dd>${escapeHtml(field.season_id)}</dd></div><div><dt>จุดกึ่งกลาง</dt><dd>${field.centroid.latitude.toFixed(6)}, ${field.centroid.longitude.toFixed(6)}</dd></div><div><dt>พื้นที่คำนวณ</dt><dd>${field.area.square_meters.toFixed(0)} ตร.ม. · ค่าประมาณ</dd></div></dl></section></main>${bottomNavigation("fields")}`;
}

function renderLearn() {
  root.innerHTML = `${appHeader({ back: "home" })}<main class="app-main simple-page"><p class="eyebrow">LEARNING CENTER</p><h1>ศูนย์เรียนรู้</h1><p>เข้าถึงองค์ความรู้ที่ผ่านการกำกับ โดยแยกความรู้ หลักฐาน และการตัดสินใจออกจากกันอย่างชัดเจน</p><div class="learning-grid"><a href="../knowledge-explorer/rice-disease-corpus.html"><span>🍃</span><strong>องค์ความรู้โรคข้าว</strong><small>เรียนรู้เพื่อสังเกต ไม่ใช่วินิจฉัยจากภาพเดียว</small></a><a href="../knowledge-explorer/rice-insect-corpus.html"><span>🪲</span><strong>องค์ความรู้แมลง</strong><small>สำรวจหลักฐานและข้อจำกัด</small></a><a href="../knowledge-explorer/rice-weed-corpus.html"><span>🌱</span><strong>องค์ความรู้วัชพืช</strong><small>ค้นหาจากลักษณะที่สังเกตเห็น</small></a><a href="../knowledge-explorer/crop-protection-management.html"><span>▤</span><strong>การจัดการและกลไก</strong><small>ตรวจสอบอำนาจและแหล่งที่มา</small></a></div></main>${bottomNavigation("learn")}`;
}

function renderProfile() {
  const user = currentUser();
  root.innerHTML = `${appHeader({ back: "home" })}<main class="app-main simple-page"><div class="profile-card"><div class="large-avatar">👨🏽‍🌾</div><p class="eyebrow">บัญชีต้นแบบ</p><h1>${escapeHtml(user.display_name)}</h1><p>${escapeHtml(user.username)} · ${escapeHtml(user.role)}</p><dl><div><dt>รหัสผู้ใช้</dt><dd>${escapeHtml(user.user_id)}</dd></div><div><dt>โหมดเข้าสู่ระบบ</dt><dd>${escapeHtml(user.session.authentication_mode)}</dd></div></dl><button class="secondary-action" type="button" data-action="logout">ออกจากระบบ</button></div></main>${bottomNavigation("profile")}`;
}

function renderInvestigate() { root.innerHTML = `<button class="legacy-return" type="button" data-route="home">← กลับหน้าหลักแปลง</button>`; }
function renderError() { root.innerHTML = `<main class="state-view"><div class="error-state-icon">!</div><h1>เตรียมพื้นที่ทำงานไม่สำเร็จ</h1><p>${escapeHtml(formError ?? "เกิดข้อผิดพลาดที่ไม่คาดคิด")}</p><button class="primary-action compact-action" type="button" data-action="reload">ลองใหม่</button></main>`; }

function render() {
  document.body.dataset.route = route;
  if (route === "loading") renderLoading(); else if (route === "login") renderLogin(); else if (route === "gps") renderGps(); else if (route === "home") renderHome(); else if (route === "fields") renderFields(); else if (route === "create") renderCreateField(); else if (route === "field-detail") renderFieldDetail(); else if (route === "learn") renderLearn(); else if (route === "profile") renderProfile(); else if (route === "investigate") renderInvestigate(); else renderError();
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function refreshWeather() { weatherState = await weatherService.get_weather(locationService.get_current_location()); if (route === "home") renderHome(); }
async function requestGps() { gpsState = { status: "REQUESTING" }; renderGps(); gpsState = await locationService.request_location(); weatherState = undefined; if (route === "gps") renderGps(); }
function persistUser(user) { const state = workspace(); state.users = state.users.filter((item) => item.user_id !== user.user_id); state.users.push(user); state.active_user_id = user.user_id; repository.save(state); }

function updateStagePreview() {
  const target = root.querySelector("[data-stage-preview]"); if (!target) return;
  if (!draft.date) { target.innerHTML = `<p class="stage-placeholder">ⓘ เลือกวันที่ ระบบจะแสดงอายุข้าว ระยะ และ CMP โดยอัตโนมัติ</p>`; return; }
  if (!stageService) { target.innerHTML = `<p class="stage-placeholder error">ไม่สามารถโหลดแบบจำลองระยะข้าวได้</p>`; return; }
  draft.stageEstimate = stageService.calculate_crop_stage(draft.date); const age = stageService.calculate_crop_age(draft.date);
  target.innerHTML = `<header><strong>ข้อมูลที่ระบบคำนวณอัตโนมัติ</strong><span>อ้างอิง ${escapeHtml(draft.stageEstimate.model_version)}</span></header><div class="stage-result-grid"><div><small>อายุข้าว</small><strong>${age.state === "PLANNED" ? `อีก ${age.days_until_planting} วันถึงวันปลูก` : `${age.crop_age_days} วัน`}</strong></div><div><small>ระยะข้าว</small><strong>${escapeHtml(draft.stageEstimate.crop_stage_label)}</strong></div><div><small>ระยะตาม CMP</small><strong>${escapeHtml(draft.stageEstimate.cmp_stage)}</strong></div></div><p>ค่าประเมินจากวันที่ปลูก วิธีปลูก และแบบจำลองที่กำกับไว้ ไม่ได้บันทึกเป็นข้อมูลที่ผู้ใช้กรอกเอง</p>`;
}

function setMapPoint(x, y) { if (draft.closed) return; const longitude = draft.base.longitude + (x - 0.5) * 0.012; const latitude = draft.base.latitude + (0.5 - y) * 0.009; draft.points.push({ x, y, latitude, longitude }); formError = null; renderCreateField(); }
function updateDraftFromDetailsForm(form) { const data = new FormData(form); draft.name = String(data.get("name") ?? ""); draft.date = String(data.get("date") ?? ""); draft.variety = String(data.get("variety") ?? "").trim(); draft.plantingMethod = String(data.get("plantingMethod") ?? ""); draft.overrideCmpStage = String(data.get("overrideCmpStage") ?? draft.overrideCmpStage); }

root.addEventListener("input", (event) => {
  if (event.target.id === "field-name") { draft.name = event.target.value; const counter = event.target.parentElement.querySelector("span"); if (counter) counter.textContent = `${draft.name.length} / 50`; }
  if (event.target.closest("[data-details-form]")) { updateDraftFromDetailsForm(event.target.form); if (event.target.name === "date") { draft.stageChoice = STAGE_PROVENANCE.SYSTEM_ESTIMATED; draft.overrideCmpStage = ""; updateStagePreview(); } }
});

root.addEventListener("submit", (event) => {
  if (event.target.matches("[data-login-form]")) {
    event.preventDefault(); const data = new FormData(event.target);
    try { const user = resolveMockUser(data.get("username"), data.get("password")); persistUser(user); formError = null; route = "gps"; render(); requestGps(); } catch (error) { formError = error.message; renderLogin(); }
  }
  if (event.target.matches("[data-details-form]")) {
    event.preventDefault(); updateDraftFromDetailsForm(event.target);
    try {
      const checkedName = validateFieldName(draft.name); if (!checkedName.valid) throw new Error(checkedName.error); if (!draft.date) throw new Error("กรุณาระบุวันที่ปลูกหรือวันที่คาดว่าจะปลูก"); if (!draft.variety) throw new Error("กรุณาระบุพันธุ์ข้าว"); if (!draft.plantingMethod) throw new Error("กรุณาเลือกวิธีปลูก");
      const geometry = currentDraftGeometry(); if (!geometry || !draft.closed) throw new Error("กรุณาปิดรูปแปลงก่อนบันทึก");
      let stage = stageService.calculate_crop_stage(draft.date); if (draft.stageChoice === STAGE_PROVENANCE.USER_CONFIRMED) stage = stageService.confirm_crop_stage(stage);
      if (draft.stageChoice === STAGE_PROVENANCE.USER_OVERRIDDEN) { const override = configuration.stage_rules.find((item) => item.stage_id === draft.overrideCmpStage); if (!override) throw new Error("กรุณาเลือกระยะข้าวที่ต้องการแก้ไข"); stage = stageService.override_crop_stage(stage, override.crop_stage, override.stage_id, override.label_th); }
      const age = stageService.calculate_crop_age(draft.date);
      const field = fieldService.create_field({ owner_user_id: currentUser().user_id, name: checkedName.value, ...geometry, crop: "rice", variety: draft.variety, planting_method: draft.plantingMethod, planting_date: age.state === "PLANTED" ? draft.date : null, expected_planting_date: age.state === "PLANNED" ? draft.date : null, current_crop_stage: { code: stage.crop_stage, label: stage.crop_stage_label, model_version: stage.model_version, basis: stage.basis }, current_cmp_stage: { stage_id: stage.cmp_stage, label: configuration.stage_rules.find((item) => item.stage_id === stage.cmp_stage)?.label_th ?? stage.crop_stage_label, model_version: stage.model_version }, stage_provenance: stage.provenance });
      selectedFieldId = field.field_id; draft.step = 3; formError = null; notice = "บันทึกแปลงเรียบร้อยแล้ว"; renderCreateField();
    } catch (error) { formError = error.message; renderCreateField(); }
  }
});

root.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) { event.preventDefault(); const next = routeTarget.dataset.route; if (next === "create" && route === "create" && draft.step > 1) draft.step -= 1; else route = next; formError = null; render(); return; }
  const fieldTarget = event.target.closest("[data-field-open]"); if (fieldTarget) { selectedFieldId = fieldTarget.dataset.fieldOpen; fieldService.select_field(selectedFieldId); route = "field-detail"; render(); return; }
  const mode = event.target.closest("[data-map-mode]"); if (mode) { draft.mode = mode.dataset.mapMode; renderCreateField(); return; }
  const mapAction = event.target.closest("[data-map-action]")?.dataset.mapAction;
  if (mapAction === "location") { const location = locationService.get_current_location(); if (location?.status === "AVAILABLE") { draft.base = { latitude: location.latitude, longitude: location.longitude }; notice = "จัดกึ่งกลางที่ตำแหน่งปัจจุบันแล้ว"; } else formError = "ยังไม่มีตำแหน่งปัจจุบัน คุณสามารถวาดบนแผนที่ต่อได้"; renderCreateField(); return; }
  if (mapAction === "layer") { draft.layer = draft.layer === "satellite" ? "terrain" : "satellite"; renderCreateField(); return; }
  if (mapAction === "undo") { draft.points.pop(); draft.closed = false; renderCreateField(); return; }
  if (mapAction === "clear") { draft.points = []; draft.closed = false; renderCreateField(); return; }
  if (mapAction === "add-center") { setMapPoint(0.5, 0.5); return; }
  if (mapAction === "finish") { if (draft.points.length >= 3) { draft.closed = true; formError = null; renderCreateField(); } return; }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "toggle-password") { const input = root.querySelector("#password"); input.type = input.type === "password" ? "text" : "password"; return; }
  if (action === "forgot-password") { formError = "ระบบกู้รหัสผ่านจะเปิดให้ใช้งานในรุ่นถัดไป"; renderLogin(); return; }
  if (action === "gps-skip") { gpsState = { status: "SKIPPED", message: "ข้ามการใช้ตำแหน่งแล้ว คุณยังใช้งานส่วนอื่นได้" }; route = "home"; render(); return; }
  if (action === "gps-retry") { requestGps(); return; }
  if (action === "weather-refresh") { weatherState = undefined; renderHome(); refreshWeather(); return; }
  if (action === "notifications") { notice = "ศูนย์แจ้งเตือนพื้นที่จะเปิดใน Execution Block ถัดไป"; renderHome(); return; }
  if (action === "create-field") { draft = createDraft(); formError = null; notice = null; route = "create"; render(); return; }
  if (action === "map-next") { const checked = validateFieldName(draft.name); if (!checked.valid) { formError = checked.error; renderCreateField(); return; } if (!draft.closed) { formError = "กรุณาปิดรูปแปลงก่อนดำเนินการต่อ"; renderCreateField(); return; } draft.name = checked.value; draft.step = 2; formError = null; renderCreateField(); return; }
  if (action === "details-back") { draft.step = 1; renderCreateField(); return; }
  if (action === "logout") { const state = workspace(); state.active_user_id = null; repository.save(state); selectedFieldId = null; route = "login"; render(); return; }
  if (action === "reload") { window.location.reload(); return; }
  const stageChoice = event.target.closest("[data-stage-choice]")?.dataset.stageChoice; if (stageChoice) { draft.stageChoice = stageChoice === "confirm" ? STAGE_PROVENANCE.USER_CONFIRMED : stageChoice === "edit" ? STAGE_PROVENANCE.USER_OVERRIDDEN : "UNSURE"; renderCreateField(); return; }
  const map = event.target.closest("[data-map-canvas]"); if (map && draft.mode === "tap" && !event.target.closest("button")) { const bounds = map.getBoundingClientRect(); setMapPoint(Math.max(0.04, Math.min(0.96, (event.clientX - bounds.left) / bounds.width)), Math.max(0.06, Math.min(0.82, (event.clientY - bounds.top) / bounds.height))); }
});

root.addEventListener("pointerdown", (event) => { const map = event.target.closest("[data-map-canvas]"); if (!map || draft.mode !== "center" || event.target.closest("button")) return; mapDrag = { x: event.clientX, y: event.clientY, width: map.clientWidth, height: map.clientHeight }; map.setPointerCapture(event.pointerId); });
root.addEventListener("pointermove", (event) => { const map = event.target.closest("[data-map-canvas]"); if (!map || !mapDrag || draft.mode !== "center") return; const dx = event.clientX - mapDrag.x, dy = event.clientY - mapDrag.y; draft.mapOffset.x += dx; draft.mapOffset.y += dy; draft.base.longitude -= dx * 0.000012; draft.base.latitude += dy * 0.000009; draft.points.forEach((point) => { point.x += dx / mapDrag.width; point.y += dy / mapDrag.height; }); map.style.setProperty("--map-x", `${draft.mapOffset.x}px`); map.style.setProperty("--map-y", `${draft.mapOffset.y}px`); mapDrag.x = event.clientX; mapDrag.y = event.clientY; });
root.addEventListener("pointerup", () => { const wasDragging = Boolean(mapDrag); mapDrag = null; if (wasDragging && route === "create" && draft.step === 1) renderCreateField(); }); root.addEventListener("pointercancel", () => { mapDrag = null; });

async function boot() { renderLoading(); try { configuration = await loadFieldConfiguration(); stageService = new StageService(configuration); route = currentUser() ? "home" : "login"; render(); } catch (error) { formError = error.message; route = "error"; render(); } }
boot();
