import { CONVERSATION_SCOPES, PHOTO_EVIDENCE_BOUNDARY, STAGE_PROVENANCE, createStableId, validateFieldName } from "./field-core.js?v=fixed-login-1";
import { BROWSER_COMPATIBILITY_AUTHORITY, ConversationService, DecisionService, EvidenceService, FieldService, GuidanceService, InvestigationService, LLMGateway, LocationService, MapService, StageService, WeatherService, WorkspaceRepository, loadFieldConfiguration, loadInvestigationConfiguration } from "./field-services.js?v=real-weather-2";
import { loginToPrototypeWorkspace } from "./prototype-login.js?v=fixed-login-1";
import { findOwnedRouteTarget } from "./route-interactions.js?v=login-route-fix-1";
import { createPreferredMapAdapter, mountGoogleFieldPreview } from "./browser-map-adapter.js?v=google-satellite-3";
import { ServerLLMAdapter } from "./server-llm-adapter.js?v=server-ai-1";
import { ServerWorkspaceAdapter } from "./server-workspace-adapter.js?v=pilot-data-1";
import { ServerKnowledgeAdapter } from "./server-knowledge-adapter.js?v=knowledge-pilot-1";
import { InvestigationCaptureAdapter, InvestigationDraftRepository, ServerInvestigationAdapter } from "./investigation-capture-adapter.js?v=capture-adapter-1";

const FIELD_RUNTIME_KEY = "__cpmoakbFieldWorkspaceRuntime";
if (!window[FIELD_RUNTIME_KEY]) {
window[FIELD_RUNTIME_KEY] = { initialized_at: new Date().toISOString() };

const root = document.querySelector("#field-app");
root.dataset.runtimeOwner = "field-workspace";
root.dataset.browserStateAuthority = BROWSER_COMPATIBILITY_AUTHORITY.authority;
const developmentMode = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname) || new URLSearchParams(location.search).has("debug");
function assertSingleRuntimeDocument() {
  if (!developmentMode) return;
  const roots = document.querySelectorAll("#field-app");
  const owners = document.querySelectorAll("[data-runtime-owner]");
  console.debug("SP Assistant active runtime owners:", owners.length);
  console.assert(roots.length === 1, "SP Assistant: normal page must contain exactly one #field-app");
  console.assert(owners.length === 1 && owners[0] === root, "SP Assistant: multiple runtime owners detected");
  console.assert(!document.querySelector(".workspace"), "SP Assistant: legacy workspace must not exist on normal routes");
}
assertSingleRuntimeDocument();
const serverWorkspace = new ServerWorkspaceAdapter();
const serverKnowledge = new ServerKnowledgeAdapter();
const repository = new WorkspaceRepository(window.localStorage, "cpmoakb.field-workspace.v1");
const investigationDrafts = new InvestigationDraftRepository(window.localStorage);
const investigationCapture = new InvestigationCaptureAdapter({ draftRepository:investigationDrafts, server:new ServerInvestigationAdapter() });
const fieldService = new FieldService(repository);
const locationService = new LocationService(navigator.geolocation, repository);
const mapService = new MapService();
const weatherService = new WeatherService();
const llmGateway = new LLMGateway(new ServerLLMAdapter());

let configuration = null, workflowConfiguration = null;
let stageService = null;
let guidanceService = null, investigationService = null, evidenceService = null, conversationService = null, decisionService = null;
let route = "loading";
let gpsState = null;
let weatherState;
let notice = null;
let formError = null;
let selectedFieldId = null;
let draft = createDraft();
let activeMapAdapter = null;
let activeFieldPreviewCleanups = [];
let activeCaseId = null, activeConversationId = null, selectedManagementOptionId = null;
let chatPending = false, chatRetryText = null;
let pilotSummary = null, dataCatalog = null;
let knowledgeResults = [], knowledgeQuery = "", knowledgeDomain = "", knowledgeLoading = false, knowledgeError = null, knowledgeSummary = null, knowledgeSummaryPending = false, feedbackNotice = null;
let companyProgram = null, companyProgramPending = false, companyProgramError = null;
let feedbackReturnRoute = "home";
let activeInvestigationDraftId = null, governedInvestigationBundle = null;

function createDraft() {
  const location = repository.load().location_context;
  return {
    step: 1, name: "", mode: "tap", zoom: 17,
    base: { latitude: location?.latitude ?? 13.7563, longitude: location?.longitude ?? 100.5018 },
    points: [], closed: false, date: "", variety: "", plantingMethod: "",
    stageEstimate: null, stageChoice: STAGE_PROVENANCE.SYSTEM_ESTIMATED, overrideCmpStage: "",
  };
}

function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
function workspace() { return repository.load(); }
function currentUser() { const state = workspace(); return state.users.find((user) => user.user_id === state.active_user_id) ?? null; }
function selectedField() { const state = workspace(), user = currentUser(), id = selectedFieldId ?? state.selected_field_id; return state.fields.find((field) => field.field_id === id && field.owner_user_id === user?.user_id) ?? null; }
function thaiDate(value) { if (!value) return "ยังไม่ระบุ"; return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)); }
function formatArea(area) { return area ? `${area.rai.toFixed(area.rai < 10 ? 2 : 1)} ไร่` : "0.00 ไร่"; }
function cropAge(field) { const date = field.planting_date ?? field.expected_planting_date; return date && stageService ? stageService.calculate_crop_age(date) : null; }
function fieldContext(field = selectedField()) { const user = currentUser(); if (!user || !field) throw new Error("กรุณาเลือกแปลง"); return { user_id: user.user_id, field_id: field.field_id, season_id: field.season_id }; }
function caseContext(caseId = activeCaseId, field = selectedField()) { return { ...fieldContext(field), case_id: caseId }; }
function conversationContext(conversationId = activeConversationId, caseId = activeCaseId, field = selectedField()) { return { ...fieldContext(field), case_id: caseId ?? undefined, conversation_id: conversationId }; }
function domainIcon(domain) { return ({ INSECT: "🪲", WEED: "🌱", DISEASE: "🍃", ABIOTIC: "💧" })[domain] ?? "⌕"; }
function domainLabel(domain) { return ({ INSECT: "แมลง", WEED: "วัชพืช", DISEASE: "อาการพืช", ABIOTIC: "สภาพแวดล้อม" })[domain] ?? domain; }
function loadCompanyProgram() {
  if (companyProgram || companyProgramPending) return;
  companyProgramPending = true; companyProgramError = null;
  serverKnowledge.companyProgram().then((value) => { companyProgram = value; companyProgramPending = false; if (["summary","learn"].includes(route)) render(); }).catch((error) => { companyProgramError = error.message; companyProgramPending = false; if (["summary","learn"].includes(route)) render(); });
}
function companyStageMarkup(stage, { compact = false } = {}) {
  if (!stage) return `<div class="program-state">${companyProgramPending ? "กำลังเปิดสูตรมาตรฐานบริษัท…" : escapeHtml(companyProgramError || "ยังไม่มีสูตรที่ตรงกับระยะนี้")}</div>`;
  return `<article class="company-program-card ${compact ? "compact" : ""}"><header><span>🌾</span><div><small>ข้อมูลอ้างอิงบริษัท · REFERENCE ONLY · ${escapeHtml(stage.stage_id)}</small><h3>${escapeHtml(stage.label)}</h3><p>${escapeHtml(stage.timing)} · ${escapeHtml(stage.objective)}</p></div></header><div class="program-products">${stage.items.map(([name,rate]) => `<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(rate)}</span></div>`).join("")}</div><details><summary>ดูข้อมูลอ้างอิงต้นทาง</summary><dl class="program-drone"><div><dt>XAG P100 / P100 Pro</dt><dd>${escapeHtml(stage.drone.p100)}</dd></div><div><dt>XAG P60</dt><dd>${escapeHtml(stage.drone.p60)}</dd></div><div><dt>ค่าลมในเอกสารต้นทาง</dt><dd>${escapeHtml(stage.drone.source_wind_limit)}</dd></div></dl><ul>${stage.checks.map((check) => `<li>${escapeHtml(check)}</li>`).join("")}</ul><p>อ้างอิง PDF หน้า ${stage.source_pages.join(", ")}</p></details><ul class="program-warning"><li>ข้อมูลอ้างอิง ≠ คำแนะนำสำหรับเคส</li><li>แหล่งข้อมูลบริษัท ≠ อำนาจกำกับตามทะเบียน</li><li>อัตราในสูตร/ประวัติ ≠ อัตราสำหรับเคส</li><li>ระยะข้าวตรงกัน ≠ ได้รับอนุญาตให้ใช้</li></ul></article>`;
}

function companyCaseBoundaryMarkup() {
  return `<section class="company-program-section company-program-blocked"><header><div><p class="eyebrow">COMPANY REFERENCE · NOT CASE-ACTIONABLE</p><h2>ข้อมูลสูตรบริษัทถูกแยกจากคำแนะนำสำหรับเคส</h2></div><span>🔒 F1 Authority Required</span></header><p>ข้อมูลสูตรบริษัทมีอยู่ในคลังอ้างอิง แต่ยังไม่สามารถใช้เป็นคำแนะนำสำหรับเคสนี้ได้ จนกว่าจะผ่าน Need-for-Action, F1 Chemical Review และการตรวจสอบสิทธิ์การใช้ตามทะเบียนแบบ ข้าว × เป้าหมาย × วิธีใช้ ที่เป็นปัจจุบัน</p><p class="program-warning">ระยะข้าวตรงกันเพียงอย่างเดียวไม่เปิดเผยผลิตภัณฑ์ อัตรา หรือค่าการใช้งานในเคสนี้</p></section>`;
}

function brandMarkup(compact = false) {
  return `<a class="workspace-brand ${compact ? "compact" : ""}" href="#home" data-route="home" aria-label="SP Assistant หน้าหลัก"><span class="workspace-brand-mark" aria-hidden="true">🌾</span><span><strong>SP <em>Assistant</em></strong><small>ผู้ช่วยชาวนา เพื่ออนาคตของการผลิต</small></span></a>`;
}

function appHeader({ back = null, bell = false } = {}) {
  const user = currentUser();
  const degraded = serverWorkspace.status === "DEGRADED_CACHE" ? `<div class="server-state-warning" role="status">กำลังใช้ข้อมูล cache · การเปลี่ยนแปลงยังไม่ยืนยันบน server</div>` : "";
  return `<header class="app-header"><div class="app-header-inner">${back ? `<button class="icon-button back-button" type="button" data-route="${back}" aria-label="ย้อนกลับ">←</button>` : ""}${brandMarkup(true)}<div class="header-actions"><button class="icon-button feedback-header-button" type="button" data-action="open-feedback" aria-label="ส่ง Feedback">✎</button>${bell ? `<button class="icon-button notification-button" type="button" data-action="notifications" aria-label="การแจ้งเตือน">♢<span>3</span></button>` : ""}<button class="profile-avatar" type="button" data-route="profile" aria-label="โปรไฟล์ของ ${escapeHtml(user?.display_name)}">👨🏽‍🌾</button></div></div>${degraded}</header>`;
}

function bottomNavigation(active) {
  const items = [["home", "⌂", "หน้าหลัก"], ["fields", "▦", "แปลง"], ["free-chat", "▢", "แชท"], ["learn", "▤", "เรียนรู้"], ["profile", "♙", "โปรไฟล์"]];
  return `<nav class="field-bottom-nav" aria-label="เมนูหลัก">${items.map(([id, icon, label]) => `<button type="button" class="${active === id ? "active" : ""}" data-route="${id}"><span aria-hidden="true">${icon}</span>${label}</button>`).join("")}</nav>`;
}

function renderLoading() { root.innerHTML = `<main class="state-view"><div class="loading-orb">🌾</div><h1>กำลังเตรียมพื้นที่ทำงาน</h1><p>โหลดข้อมูลแปลงและบริการที่จำเป็น…</p></main>`; }

function renderLogin() {
  root.innerHTML = `<main class="login-view" aria-labelledby="login-title"><section class="login-shell"><div class="login-brand"><div class="workspace-brand" aria-label="SP Assistant"><span class="workspace-brand-mark" aria-hidden="true">🌾</span><span><strong>SP <em>Assistant</em></strong><small>ผู้ช่วยชาวนา เพื่ออนาคตของการผลิต</small></span></div></div><div class="login-intro"><h1 id="login-title">ผู้ช่วยคู่ใจของชาวนา</h1><p>พื้นที่ทดสอบภายในสำหรับ Field Intelligence Workspace</p></div><form class="login-card" data-login-form novalidate><div class="form-message ${formError ? "error" : ""}" ${formError ? "" : "hidden"}>${escapeHtml(formError)}</div><label for="password">รหัสผ่าน</label><div class="input-with-icon"><span aria-hidden="true">▣</span><input id="password" name="password" type="password" autocomplete="current-password" placeholder="รหัสผ่าน" required></div><button class="primary-action" type="submit">เข้าสู่ระบบ</button><p class="prototype-hint">สำหรับทดสอบภายใน</p></form></section></main>`;
}

function renderGps() {
  const status = gpsState?.status ?? "REQUESTING";
  const content = status === "REQUESTING" ? { icon: "◎", title: "อนุญาตตำแหน่งเพื่อดูแลแปลงได้แม่นขึ้น", copy: "SP Assistant กำลังขอสิทธิ์ตำแหน่งสำหรับจัดกึ่งกลางแผนที่ สภาพอากาศ และบริบทความเสี่ยงในอนาคต" } : status === "AVAILABLE" ? { icon: "✓", title: "รับตำแหน่งปัจจุบันแล้ว", copy: `ความแม่นยำโดยประมาณ ±${Math.round(gpsState.accuracy)} เมตร ตำแหน่งถูกเก็บไว้ในอุปกรณ์นี้` } : { icon: "⌁", title: "ใช้งานต่อได้โดยไม่เปิดตำแหน่ง", copy: gpsState?.message ?? "คุณสามารถกำหนดแปลงบนแผนที่ด้วยตนเองได้ทุกเมื่อ" };
  root.innerHTML = `<main class="permission-view"><section class="permission-card"><div class="permission-icon ${status.toLowerCase()}">${content.icon}</div><p class="eyebrow">ตั้งค่าเริ่มต้น</p><h1>${content.title}</h1><p>${content.copy}</p><div class="permission-benefits"><span>☀ <strong>สภาพอากาศ</strong></span><span>⌖ <strong>จัดกึ่งกลางแผนที่</strong></span><span>◌ <strong>บริบทพื้นที่</strong></span></div>${status === "REQUESTING" ? `<div class="loading-line"><span></span></div><button class="secondary-action" type="button" data-action="gps-skip">ข้ามไปก่อน</button>` : `<button class="primary-action" type="button" data-route="home">ไปหน้าหลัก</button>${status !== "AVAILABLE" ? `<button class="secondary-action" type="button" data-action="gps-retry">ลองขอตำแหน่งอีกครั้ง</button>` : ""}`}</section></main>`;
}

function weatherMarkup() {
  if (weatherState === undefined) return `<article class="weather-card loading-card"><span class="skeleton short"></span><span class="skeleton"></span></article>`;
  if (weatherState.status !== "AVAILABLE") return `<article class="weather-card unavailable"><div><strong>สภาพอากาศไม่พร้อมใช้งาน</strong><small>${weatherState.reason === "LOCATION_REQUIRED" ? "เปิดตำแหน่งหรือเลือกแปลงเพื่อรับข้อมูลบริบทพื้นที่" : "เชื่อมต่อข้อมูลอากาศไม่สำเร็จ กรุณาลองใหม่"}</small></div><button type="button" data-action="weather-refresh" aria-label="ลองใหม่">↻</button></article>`;
  const updated = new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date(weatherState.updated_at));
  return `<article class="weather-card" title="ข้อมูลแบบจำลองบริเวณแปลง ไม่ใช่เซนเซอร์ภายในแปลง"><div class="weather-main"><span class="weather-icon">${weatherState.icon ?? "🌤️"}</span><span><strong>${weatherState.temperature.toFixed(1)}°C</strong><small>${escapeHtml(weatherState.condition)}</small></span></div><div class="weather-wind"><span>〰</span><strong>${weatherState.wind_speed.toFixed(1)} ${weatherState.unit}</strong></div><div class="weather-update"><small>${weatherState.target?.field_id ? "บริเวณแปลง · Open-Meteo" : "ตำแหน่งปัจจุบัน · Open-Meteo"}</small><strong>${updated}</strong><button type="button" data-action="weather-refresh" aria-label="รีเฟรชสภาพอากาศ">↻</button></div></article>`;
}

function fieldCardMarkup(field) {
  const age = cropAge(field);
  const ageLabel = age?.state === "PLANNED" ? `อีก ${age.days_until_planting} วันถึงวันปลูก` : age ? `${age.crop_age_days} วัน` : "ยังไม่ระบุ";
  return `<article class="selected-field-card"><div class="field-card-visual" data-field-satellite-preview="${field.field_id}"><span class="field-label">✓ แปลงที่เลือกอยู่</span><div class="rice-scene"><span>🌾</span><span>🌾</span><span>🌾</span><span>🌾</span></div></div><div class="field-card-body"><div class="field-card-title"><div><h2>${escapeHtml(field.name)} <span class="favorite">★</span></h2><small>ID: ${escapeHtml(field.field_id.slice(0, 18))}</small></div><button class="icon-button" type="button" data-field-open="${field.field_id}" aria-label="เปิดรายละเอียดแปลง">›</button></div><dl class="field-facts"><div><dt>🌾 พันธุ์ข้าว</dt><dd>${escapeHtml(field.variety || "ยังไม่ระบุ")}</dd></div><div><dt>🍃 อายุข้าว</dt><dd>${ageLabel}</dd></div><div><dt>▦ วันที่ปลูก</dt><dd>${thaiDate(field.planting_date ?? field.expected_planting_date)}</dd></div><div><dt>🌱 ระยะการเจริญเติบโต</dt><dd>${escapeHtml(field.current_crop_stage?.label ?? "ยังไม่ประเมิน")}</dd></div></dl><div class="cmp-row"><span>▣ ระยะตามการจัดการ (CMP)</span><strong>${escapeHtml(field.current_cmp_stage?.label ?? field.current_cmp_stage?.stage_id ?? "ยังไม่ประเมิน")}</strong></div></div></article>`;
}

function emptyFieldMarkup() {
  return `<section class="empty-field-card"><div class="empty-illustration">⌖<span>＋</span></div><p class="eyebrow">เริ่มต้นใช้งาน</p><h2>สร้างแปลงแรกของคุณ</h2><p>วาดขอบเขตแปลงเพียงไม่กี่จุด แล้วระบบจะช่วยคำนวณพื้นที่และระยะการปลูกให้</p><button class="primary-action" type="button" data-action="create-field">＋ สร้างแปลงใหม่</button><small>คุณยังอ่านเนื้อหาและใช้แชทได้โดยไม่ต้องสร้างแปลง</small></section>`;
}

function renderHome() {
  const user = currentUser(); const fields = fieldService.list_fields(user.user_id); const field = selectedField() ?? fields[0] ?? null;
  if (field && !selectedFieldId) selectedFieldId = field.field_id;
  const guidance = field ? guidanceService.get_guidance(fieldContext(field), { previous_cases: workspace().cases.filter((item) => item.field_id === field.field_id), weather: weatherState }) : [{ title: "เรียนรู้การบันทึกข้อมูลแปลง", short_instruction: "เริ่มจากข้อสังเกตที่เห็นจริง", domain: "ABIOTIC" }];
  root.innerHTML = `${appHeader({ bell: true })}<main class="app-main home-main"><section class="home-hero"><div><p class="eyebrow">FIELD INTELLIGENCE WORKSPACE</p><h1>สวัสดีครับ คุณ${escapeHtml(user.display_name)} <span>👋</span></h1><p>${field ? "วันนี้มาดูแลแปลงของคุณให้พร้อมกัน" : "เริ่มจากสร้างแปลงแรก หรือสำรวจความรู้สำหรับฤดูกาลนี้"}</p></div>${weatherMarkup()}</section>${notice ? `<div class="toast-message">${escapeHtml(notice)}</div>` : ""}${field ? `<section class="home-field">${fieldCardMarkup(field)}<div class="field-cta-row"><button class="primary-action" type="button" data-field-open="${field.field_id}">เปิดพื้นที่ทำงานแปลง</button><button class="secondary-action" type="button" data-action="create-field">＋ สร้างแปลงใหม่</button></div></section>` : emptyFieldMarkup()}<section class="today-section"><header class="section-heading"><div><p class="eyebrow">รายการภาคสนาม</p><h2>${field ? "วันนี้ควรตรวจอะไรบ้าง" : "เริ่มเรียนรู้ได้ทันที"}</h2></div>${field ? `<button type="button" data-field-open="${field.field_id}">ดูทั้งหมด ›</button>` : `<button type="button" data-route="learn">ดูทั้งหมด ›</button>`}</header><div class="guidance-grid">${guidance.slice(0, 3).map((item, index) => `<button class="guidance-card tone-${index + 1} ${item.status === "COMPLETED" ? "completed" : ""}" type="button" ${field ? `data-field-open="${field.field_id}"` : `data-route="learn"`}><span>${domainIcon(item.domain)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.short_instruction ?? "เปิดเพื่อดูรายละเอียด")}</small></button>`).join("")}</div></section>${field ? `<section class="tip-card"><span>💡</span><div><strong>เคล็ดลับวันนี้</strong><p>${escapeHtml(guidanceService.get_tip(fieldContext(field))?.text_th ?? "บันทึกสิ่งที่เห็นตามจริง")}</p></div></section>` : ""}</main>${bottomNavigation("home")}`;
  if (field) mountFieldSatellitePreviews([field]);
  if (weatherState === undefined) refreshWeather();
}

function renderFields() {
  const user = currentUser(); const fields = fieldService.list_fields(user.user_id);
  root.innerHTML = `${appHeader({ back: "home" })}<main class="app-main list-main"><div class="page-heading"><div><p class="eyebrow">ข้อมูลที่บันทึกในอุปกรณ์</p><h1>แปลงของฉัน</h1><p>แปลงแต่ละรายการใช้รหัสเฉพาะ ไม่อ้างอิงชื่อแปลงเป็นตัวตน</p></div><button class="primary-action compact-action" type="button" data-action="create-field">＋ สร้างแปลง</button></div>${fields.length ? `<div class="field-list">${fields.map((field) => `<button type="button" class="field-list-item" data-field-open="${field.field_id}"><span class="mini-map" data-field-satellite-preview="${field.field_id}">⌖</span><span><strong>${escapeHtml(field.name)}</strong><small>${formatArea(field.area)} · ${escapeHtml(field.current_cmp_stage?.label ?? "ยังไม่ประเมิน")}</small><em>${escapeHtml(field.field_id)}</em></span><b>›</b></button>`).join("")}</div>` : emptyFieldMarkup()}</main>${bottomNavigation("fields")}`;
  mountFieldSatellitePreviews(fields);
}

function mapToolbarMarkup() {
  return `<div class="map-mode-switch" role="group" aria-label="วิธีวาดแปลง"><button type="button" class="${draft.mode === "tap" ? "active" : ""}" data-map-mode="tap"><span class="map-mode-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M9 4v14l4-3 5 11 5-3-5-10h6L9 4Z"/></svg></span><strong>แตะบนแผนที่</strong><small>แตะทีละจุดเพื่อกำหนดมุมแปลง</small></button><button type="button" class="${draft.mode === "center" ? "active" : ""}" data-map-mode="center"><span class="map-mode-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="7"/><path d="M16 2v6m0 16v6M2 16h6m16 0h6"/></svg></span><strong>ใช้ตำแหน่งกึ่งกลาง</strong><small>เลื่อนแผนที่แล้วเพิ่มจุดใต้เป้า</small></button></div>`;
}

function currentDraftGeometry() {
  if (draft.points.length < 3) return null;
  try { const polygon = mapService.create_polygon(draft.points); return { polygon, centroid: mapService.calculate_centroid(polygon), area: mapService.calculate_area(polygon) }; } catch { return null; }
}

function renderCreateField() {
  activeMapAdapter?.destroy(); activeMapAdapter = null;
  root.innerHTML = `${appHeader({ back: draft.step === 1 ? "home" : "create" })}<main class="create-main"><header class="create-heading"><h1>สร้างแปลงใหม่</h1><ol class="stepper"><li class="${draft.step >= 1 ? "active" : ""}"><span>1</span>วาดแปลง</li><li class="${draft.step >= 2 ? "active" : ""}"><span>2</span>ข้อมูลแปลง</li><li class="${draft.step >= 3 ? "active" : ""}"><span>3</span>บันทึก</li></ol></header>${draft.step === 1 ? renderMapStep() : draft.step === 2 ? renderDetailsStep() : renderSavedStep()}</main>${bottomNavigation("fields")}`;
  if (draft.step === 1) mountDraftMap();
  if (draft.step === 2) updateStagePreview();
}

function renderMapStep() {
  const geometry = currentDraftGeometry();
  return `<section class="map-step"><div class="map-instructions"><h2>วิธีวาดแปลง <small>(เลือกวิธีที่ถนัด)</small></h2>${mapToolbarMarkup()}</div>${formError ? `<div class="form-message error">${escapeHtml(formError)}</div>` : ""}<div class="map-canvas ${draft.mode === "center" ? "center-mode" : ""}" data-map-canvas><div class="real-map-mount" data-real-map></div>${draft.mode === "center" ? `<div class="center-crosshair" aria-hidden="true"><span></span></div>` : ""}<div class="map-hint">${draft.closed ? "✓ ปิดพื้นที่แล้ว สามารถแก้ไขหรือไปขั้นถัดไป" : draft.mode === "tap" ? "แตะบนแผนที่เพื่อเพิ่มจุดมุมแปลง" : "เลื่อนแผนที่ให้ตำแหน่งอยู่ใต้เป้า แล้วกดเพิ่มจุด"}</div><div class="map-controls"><button type="button" data-map-action="location" aria-label="ไปตำแหน่งปัจจุบัน"><b aria-hidden="true">◎</b><span>ตำแหน่งปัจจุบัน</span></button><button type="button" data-map-action="zoom-in" aria-label="ขยายแผนที่"><b aria-hidden="true">＋</b><span>ขยาย</span></button><button type="button" data-map-action="zoom-out" aria-label="ย่อแผนที่"><b aria-hidden="true">−</b><span>ย่อ</span></button><button type="button" data-map-action="undo" ${draft.points.length ? "" : "disabled"} aria-label="ย้อนกลับจุดล่าสุด"><b aria-hidden="true">↶</b><span>ย้อนจุดล่าสุด</span></button><button type="button" data-map-action="clear" ${draft.points.length ? "" : "disabled"} aria-label="ล้างพื้นที่"><b aria-hidden="true">×</b><span>ล้างพื้นที่</span></button></div>${draft.mode === "center" && !draft.closed ? `<button class="add-center-point" type="button" data-map-action="add-center"><strong>＋ เพิ่มจุดที่ตำแหน่งนี้</strong><small>จุดที่ ${draft.points.length + 1}</small></button>` : ""}${draft.points.length >= 3 ? `<button class="finish-area-button ${draft.closed ? "closed" : ""}" type="button" data-map-action="${draft.closed ? "reopen" : "finish"}">${draft.closed ? "✎ แก้ไขขอบเขต" : "✓ ปิดพื้นที่"}</button>` : ""}<div class="map-area-badge">${geometry ? `ประมาณ ${formatArea(geometry.area)}` : "เพิ่มอย่างน้อย 3 จุด"}</div></div><section class="map-bottom-sheet"><div class="sheet-handle"></div><label for="field-name">ชื่อแปลง <b>*</b></label><div class="field-name-row"><input id="field-name" maxlength="50" value="${escapeHtml(draft.name)}" placeholder="เช่น นาบ้านทุ่งทอง, แปลงนาข้าวปี 2569"><span>${draft.name.length} / 50</span></div><p class="field-help">ตั้งชื่อให้สั้นและจำง่าย เพื่อค้นหาและจัดการแปลงได้สะดวก</p><div class="area-summary"><span>ขนาดพื้นที่โดยประมาณ</span><strong>${geometry ? `${formatArea(geometry.area)} (${geometry.area.hectares.toFixed(2)} เฮกตาร์)` : "ยังคำนวณไม่ได้"}</strong></div><p class="soft-warning">ⓘ คำนวณจากพิกัดจริงบนแผนที่ ควรตรวจขอบเขตก่อนบันทึก</p><div class="sheet-actions"><button class="secondary-action" type="button" data-route="home">ยกเลิก</button><button class="primary-action" type="button" data-action="map-next" ${draft.closed ? "" : "disabled"}>ถัดไป</button></div></section></section>`;
}

async function mountDraftMap() {
  const container = root.querySelector("[data-real-map]");
  if (!container) return;
  container.innerHTML = `<div class="real-map-fallback"><strong>กำลังเตรียมภาพถ่ายดาวเทียม…</strong><small>หาก Google Maps ไม่พร้อม ระบบจะใช้แผนที่สำรอง</small></div>`;
  const adapter = await createPreferredMapAdapter(container);
  if (!container.isConnected || !root.contains(container)) { adapter.destroy?.(); return; }
  activeMapAdapter = adapter.mount({
    center: draft.base,
    zoom: draft.zoom,
    points: draft.points,
    closed: draft.closed,
    mode: draft.mode,
    onMapClick: (point) => { if (!draft.closed) addDraftPoint(point); },
    onViewportChange: ({ center, zoom }) => { draft.base = center; draft.zoom = zoom; },
  });
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
  clearFieldSatellitePreviews();
  const field = selectedField(); if (!field) { route = "fields"; render(); return; }
  const age = cropAge(field), context = fieldContext(field), state = workspace();
  const guidance = guidanceService.get_guidance(context, { recent_activities: state.activities.filter((item) => item.field_id === field.field_id), previous_cases: state.cases.filter((item) => item.field_id === field.field_id), weather: weatherState });
  const pending = guidance.filter((item) => item.status === "PENDING" || item.status === "IN_PROGRESS"), completed = guidance.filter((item) => item.status === "COMPLETED" || item.status === "SKIPPED"), history = investigationService.list_case_history(context);
  const ageLabel = age.state === "PLANNED" ? `อีก ${age.days_until_planting} วันถึงวันปลูก` : `อายุข้าว ${age.crop_age_days} วัน`;
  root.innerHTML = `${appHeader({ back: "home", bell: true })}<main class="app-main field-workspace-main"><section class="field-workspace-header"><div class="field-context-copy"><p class="eyebrow">แปลงที่เลือกอยู่ · ${escapeHtml(field.field_id)}</p><h1>${escapeHtml(field.name)} <span>★</span></h1><div class="field-context-facts"><span>🌾 ${escapeHtml(field.variety)}</span><span>▦ ${thaiDate(field.planting_date ?? field.expected_planting_date)}</span><span>🍃 ${ageLabel}</span></div><div class="cmp-primary"><small>ระยะ CMP ปัจจุบัน</small><strong>${escapeHtml(field.current_cmp_stage.label)}</strong><span>${escapeHtml(field.current_crop_stage.label)} · ${escapeHtml(field.stage_provenance)}</span></div></div><div class="workspace-map-weather"><div class="workspace-mini-map" data-field-satellite-preview>${polygonPreview(field)}<span>⌖</span><small>${formatArea(field.area)}</small></div>${weatherMarkup()}</div></section><section class="workspace-guidance"><header class="section-heading"><div><p class="eyebrow">สิ่งที่ควรตรวจวันนี้</p><h2>รายการตรวจตามบริบทแปลง</h2></div><span class="pending-count">${pending.length} รายการรอตรวจ</span></header><div class="guidance-list">${pending.map((item) => `<button class="guidance-row ${item.status.toLowerCase()}" type="button" data-guidance-start="${item.guidance_item_id}"><span class="guidance-domain">${domainIcon(item.domain)}</span><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.short_instruction)}</small><em>${escapeHtml(item.reason)}</em></span><b>${item.status === "IN_PROGRESS" ? "ทำต่อ ›" : "เริ่ม ›"}</b></button>`).join("") || `<div class="empty-inline">✓ ตรวจรายการที่แนะนำครบแล้ว</div>`}${completed.length ? `<details class="completed-guidance"><summary>ตรวจแล้ว ${completed.length} รายการ</summary>${completed.map((item) => `<button type="button" data-guidance-start="${item.guidance_item_id}" disabled><span>✓</span><span><strong>${escapeHtml(item.title)}</strong><small>${thaiDate(item.completed_at?.slice(0,10))}</small></span></button>`).join("")}</details>` : ""}</div><div class="workspace-actions"><button class="primary-action" type="button" data-action="start-full-inspection" ${pending.length ? "" : "disabled"}>⌕ เริ่มตรวจสุขภาพแปลง</button><button class="secondary-action" type="button" data-action="open-investigation-capture">＋ บันทึกหลักฐานที่พบ</button><button class="secondary-action" type="button" data-action="open-free-chat">▢ ถาม SP Assistant</button></div></section><section class="tip-card"><span>💡</span><div><strong>เคล็ดลับวันนี้</strong><p>${escapeHtml(guidanceService.get_tip(context)?.text_th ?? "บันทึกสิ่งที่เห็นตามจริง")}</p></div></section><section class="case-history"><header class="section-heading"><div><p class="eyebrow">CASE HISTORY</p><h2>ประวัติการตรวจแปลง</h2></div><span>${history.length} เคส</span></header>${history.length ? `<div class="history-list">${history.map((item) => `<button type="button" data-case-open="${item.case_id}"><span class="history-icon">${domainIcon(item.domain)}</span><span><strong>${domainLabel(item.domain)} · ${item.status === "COMPLETED" ? "ตรวจเสร็จแล้ว" : "กำลังตรวจ"}</strong><small>${new Intl.DateTimeFormat("th-TH", { dateStyle:"medium", timeStyle:"short" }).format(new Date(item.created_at))}</small><em>${escapeHtml(item.summary?.candidate_interpretation ?? "ยังไม่มีสรุป")}</em>${item.decision_log ? `<mark>เลือก: ${escapeHtml(item.decision_log.option_class)}</mark>` : ""}</span><b>›</b></button>`).join("")}</div>` : `<div class="empty-history"><span>▤</span><p>ยังไม่มีประวัติการตรวจในแปลงนี้</p></div>`}</section></main>${bottomNavigation("fields")}`;
  mountFieldSatellitePreviews([field]);
  if (weatherState === undefined) refreshWeather();
}

function latestInvestigationDraft(field=selectedField()) {
  if(!field)return null; return investigationDrafts.list().filter((item)=>item.scope?.field_id===field.field_id&&item.scope?.season_id===field.season_id&&item.state!=="ABANDONED").sort((a,b)=>b.updated_at.localeCompare(a.updated_at))[0]??null;
}

function draftStateLabel(draft){ return ({DRAFT_LOCAL:"ฉบับร่างในเครื่อง",PENDING_SYNC:"รอส่งขึ้น server",SYNCING:"กำลังส่ง",SYNCED:"ยืนยันบน server แล้ว",SYNC_FAILED:"ส่งไม่สำเร็จ",CONFLICT:"ข้อมูลบน server เปลี่ยนแล้ว",ABANDONED:"ยกเลิกแล้ว"})[draft?.state]??"ยังไม่มีฉบับร่าง"; }

function renderInvestigationCapture(){
  const field=selectedField(); if(!field){route="fields";render();return;} const context=fieldContext(field); let active=activeInvestigationDraftId&&activeInvestigationDraftId!=="NEW"?investigationDrafts.get(activeInvestigationDraftId):null; if(!active&&activeInvestigationDraftId!=="NEW"){active=latestInvestigationDraft(field);activeInvestigationDraftId=active?.draft_id??null;}
  const stage=governedInvestigationBundle?.stage_assessment,cropStage=stage?.crop_stage?.code??stage?.crop_stage?.label??null,serverObservation=governedInvestigationBundle?.observations?.find((item)=>item.observation_id===(active?.observation?.observation_id??active?.record_id))??governedInvestigationBundle?.observations?.at(-1),severity=governedInvestigationBundle?.evidence?.find((item)=>item.evidence_type==="SEVERITY_MEASUREMENT"&&item.observation_id===serverObservation?.observation_id);
  const stateClass=active?.state?.toLowerCase().replaceAll("_","-")??"empty",localNote=active?.mode==="UPDATE"?active.record?.note:active?.observation?.note;
  const status=active?`<section class="capture-status ${stateClass}"><strong>${escapeHtml(draftStateLabel(active))}</strong><small>${escapeHtml(active.authority)}</small>${active.error_code?`<p>${escapeHtml(active.error_code)} · ${escapeHtml(active.error_message)}</p>`:""}${active.state==="SYNC_FAILED"?`<button type="button" data-action="retry-investigation-sync">ลองส่งอีกครั้ง</button>`:""}${active.state==="CONFLICT"?`<p>ฉบับร่าง “${escapeHtml(localNote)}” ยังเก็บอยู่และไม่ได้เขียนทับ server</p><button type="button" data-action="refresh-investigation-conflict">โหลดข้อมูล server เพื่อทบทวน</button>${active.authoritative_bundle?`<button type="button" data-action="reapply-investigation-draft">นำฉบับร่างไปใช้ใหม่หลังทบทวน</button>`:""}`:""}</section>`:"";
  const authoritative=governedInvestigationBundle?`<section class="authoritative-capture"><header><div><p class="eyebrow">SERVER-AUTHORITATIVE BUNDLE</p><h2>ข้อมูลที่ยืนยันจาก server</h2></div><span>revision ${serverObservation?.revision??"—"}</span></header><dl><div><dt>StageAssessment</dt><dd>${escapeHtml(cropStage??"ยังไม่มีข้อมูล")}</dd></div><div><dt>Observation</dt><dd>${escapeHtml(serverObservation?.note??"ยังไม่มี")}</dd></div><div><dt>อุบัติการณ์ที่ server คำนวณ</dt><dd>${severity?.derived_percent!=null?`${escapeHtml(severity.derived_percent)}%`:"—"}</dd></div></dl><p>ค่าที่คำนวณและ provenance ใช้จาก bundle นี้ ไม่ใช้ค่าที่คำนวณใน browser</p></section>`:`<section class="capture-status sync-failed"><strong>ยังโหลด bundle จาก server ไม่ได้</strong><p>ฉบับร่างยังเป็นข้อมูลในเครื่องและไม่ถือว่า persisted</p></section>`;
  const updateForm=serverObservation?`<form class="capture-update-form" data-investigation-update-form><h2>แก้ไขบันทึกอย่างปลอดภัย</h2><p>ส่งพร้อม expected revision ${serverObservation.revision}; หาก server เปลี่ยนแล้ว ระบบจะเก็บฉบับร่างและแจ้ง conflict</p><textarea name="note" maxlength="2000" required>${escapeHtml(serverObservation.note??"")}</textarea><button class="secondary-action" type="submit">บันทึกด้วย revision check</button></form>`:"";
  root.innerHTML=`${appHeader({back:"field-detail"})}<main class="app-main capture-main"><header class="capture-heading"><p class="eyebrow">GOVERNED INVESTIGATION CAPTURE</p><h1>บันทึกสิ่งที่พบใน ${escapeHtml(field.name)}</h1><p>Observation ≠ Interpretation · ข้อมูลในเครื่องเป็น draft จนกว่า server จะยืนยัน</p></header>${status}${authoritative}${active?.state==="SYNCED"?`<button class="secondary-action" type="button" data-action="new-investigation-draft">＋ สร้าง Observation ใหม่</button>${updateForm}`:`<form class="capture-form" data-investigation-capture-form><label>สิ่งที่สังเกตเห็น<textarea name="note" maxlength="2000" required placeholder="เช่น ข้าวเหลืองตรงนี้">${escapeHtml(active?.observation?.note??"")}</textarea></label><label>เวลาที่สังเกต<input type="datetime-local" name="observed_at" value="${new Date().toISOString().slice(0,16)}" required></label><div class="capture-grid"><label>รูปแบบพื้นที่<select name="spatial_pattern"><option value="">ไม่บันทึก</option><option value="PATCH">PATCH · เป็นหย่อม</option><option value="SCATTERED">SCATTERED · กระจาย</option><option value="UNKNOWN">ยังไม่ทราบ</option></select></label><label>ขอบเขต<select name="field_extent"><option value="LOCAL">LOCAL</option><option value="VERY_LOCAL">VERY_LOCAL</option><option value="UNKNOWN">ยังไม่ทราบ</option></select></label><label>ส่วนของพืช<select name="plant_part"><option value="">ไม่บันทึก morphology</option><option value="LEAF_SHEATH">LEAF_SHEATH</option><option value="LEAF_BLADE">LEAF_BLADE</option><option value="UNKNOWN">ยังไม่ทราบ</option></select></label><label>ลักษณะที่เห็น<select name="phenotype"><option value="">ไม่บันทึก morphology</option><option value="YELLOWING">YELLOWING</option><option value="LESION">LESION</option></select></label><label>จำนวนกอ/หน่อที่ได้รับผล<input type="number" min="0" name="affected" inputmode="numeric"></label><label>จำนวนที่ตรวจทั้งหมด<input type="number" min="1" name="observed" inputmode="numeric"></label><label>สภาพน้ำในจุดที่พบ<select name="water_state"><option value="">ไม่บันทึก</option><option value="DEEP_PONDED">DEEP_PONDED</option><option value="PONDED">PONDED</option><option value="MOIST">MOIST</option><option value="UNKNOWN">ยังไม่ทราบ</option></select></label><label>ชื่อผลิตภัณฑ์ตามที่รายงาน<input name="reported_product_name" placeholder="เว้นว่างได้หากไม่มีเหตุการณ์"></label></div>${formError?`<p class="form-message error">${escapeHtml(formError)}</p>`:""}<button class="primary-action" type="submit">เก็บ draft และส่งขึ้น server</button><p class="capture-boundary">ไม่มีการวินิจฉัย จัดอันดับ Candidate หรือแนะนำสาร/ผลิตภัณฑ์ในขั้นตอนนี้</p></form>`}</main>${bottomNavigation("fields")}`;
}

function clearFieldSatellitePreviews() { activeFieldPreviewCleanups.forEach((cleanup) => cleanup?.()); activeFieldPreviewCleanups = []; }
async function mountFieldSatellitePreviews(fields) {
  clearFieldSatellitePreviews();
  for (const field of fields) {
    const container = root.querySelector(`[data-field-satellite-preview="${field.field_id}"]`) ?? (fields.length === 1 ? root.querySelector("[data-field-satellite-preview]") : null);
    if (!container) continue;
    try { const cleanup = await mountGoogleFieldPreview(container, field.polygon.coordinates[0].slice(0, -1)); if (cleanup) activeFieldPreviewCleanups.push(cleanup); }
    catch { /* Keep the existing local polygon/illustration fallback. */ }
  }
}

function ensureCaseConversation(context) {
  const state = workspace();
  let conversation = state.conversations.find((item) => item.case_id === context.case_id && item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id);
  if (!conversation) conversation = conversationService.create_conversation(context, CONVERSATION_SCOPES.CASE_SCOPED);
  activeConversationId = conversation.conversation_id;
  return conversation;
}

function startInspection(guidanceItemId) {
  const field = selectedField(), context = fieldContext(field), guidance = guidanceService.get_guidance(context), item = guidance.find((entry) => entry.guidance_item_id === guidanceItemId);
  if (!item || !["PENDING", "IN_PROGRESS"].includes(item.status)) throw new Error("รายการตรวจไม่พร้อมใช้งาน");
  const existing = workspace().cases.find((entry) => entry.user_id === context.user_id && entry.field_id === context.field_id && entry.season_id === context.season_id && entry.guidance_item_id === item.guidance_item_id && entry.status === "OPEN");
  if (existing) {
    activeCaseId = existing.case_id;
    ensureCaseConversation(caseContext());
    route = "inspection";
    render();
    return;
  }
  guidanceService.update_status(context, item.guidance_item_id, "IN_PROGRESS");
  const record = investigationService.start_case(context, { guidance_item_id: item.guidance_item_id, inspection_flow: item.inspection_flow });
  activeCaseId = record.case_id;
  const conversation = ensureCaseConversation(caseContext());
  const question = investigationService.get_next_question(caseContext());
  if (question) conversationService.append_message(conversationContext(conversation.conversation_id, record.case_id), { role: "ASSISTANT", content: question.prompt_th, message_type: "QUESTION" });
  route = "inspection"; render();
}

function renderInspection() {
  const field = selectedField(); if (!field || !activeCaseId) { route = "field-detail"; render(); return; }
  const context = caseContext(), caseRecord = investigationService.get_case(context), question = investigationService.get_next_question(context), state = workspace();
  const observations = state.observations.filter((item) => item.case_id === activeCaseId), evidence = evidenceService.get_evidence({ ...context, conversation_id: activeConversationId }), flow = workflowConfiguration.flows.find((item) => item.flow_id === caseRecord.inspection_flow);
  const progress = flow?.questions.length ? Math.round((observations.length / flow.questions.length) * 100) : 0;
  root.innerHTML = `${appHeader({ back: "field-detail" })}<main class="inspection-main"><section class="inspection-context"><div><p class="eyebrow">กำลังตรวจ · ${domainLabel(caseRecord.domain)}</p><h1>${escapeHtml(field.name)}</h1><span>${escapeHtml(field.current_cmp_stage.label)} · ${escapeHtml(field.field_id)}</span></div><button class="finish-inspection" type="button" data-action="finish-inspection">จบการตรวจ</button></section><div class="inspection-progress"><span style="width:${progress}%"></span></div><section class="inspection-thread">${observations.map((item) => `<article class="inspection-answer"><small>${escapeHtml(flow?.questions.find((q) => q.question_id === item.question_id)?.prompt_th ?? item.question_id)}</small><p>${item.uncertain ? "? " : ""}${escapeHtml(item.original_text || item.value || "ข้ามคำถาม")}</p></article>`).join("")}${evidence.map((item) => `<article class="photo-evidence-message"><span>▧</span><div><strong>PHOTO RECEIVED</strong><p>${escapeHtml(item.file_name || "ภาพจากผู้ใช้")} · ยังไม่ได้วิเคราะห์ และยังไม่ใช่การยืนยันสาเหตุ</p></div></article>`).join("")}${question ? `<article class="current-question"><div class="assistant-badge">SP</div><div><p class="eyebrow">คำถามที่ ${observations.length + 1} จาก ${flow.questions.length}</p><h2>${escapeHtml(question.prompt_th)}</h2><div class="suggestion-chips">${question.suggestions.map((option) => `<button type="button" data-inspection-response="${option.value}">${escapeHtml(option.label)}</button>`).join("")}${question.allow_skip ? `<button type="button" class="skip-chip" data-inspection-response="SKIP">ข้ามตอนนี้</button>` : ""}</div><p class="question-help">เลือกคำตอบ หรือพิมพ์สิ่งที่เห็นจริงได้เสมอ · รูปที่ส่งจะถูกบันทึกเป็นหลักฐานจากผู้ใช้เท่านั้น</p></div></article>` : `<article class="inspection-complete-card"><span>✓</span><h2>ตอบคำถามในชุดตรวจครบแล้ว</h2><p>กด “จบการตรวจ” เพื่อบันทึกเคสและดูสรุป</p></article>`}</section><form class="inspection-composer" data-inspection-form><label class="camera-control" aria-label="แนบรูป"><input type="file" accept="image/*" capture="environment" data-inspection-photo><span>▣</span></label><input name="observation" placeholder="พิมพ์สิ่งที่สังเกตเห็น…" ${question ? "" : "disabled"}><button type="submit" aria-label="ส่งคำตอบ" ${question ? "" : "disabled"}>↑</button></form></main>${bottomNavigation("fields")}`;
  if (observations.length) root.querySelector(".inspection-progress")?.insertAdjacentHTML("afterend", `<button class="undo-observation" type="button" data-action="undo-observation">↶ ย้อนแก้คำตอบล่าสุด</button>`);
}

function ensureSummary(context = caseContext()) {
  const existing = investigationService.get_case_summary(context); if (existing) return existing;
  const state = workspace(), caseRecord = investigationService.get_case(context), observations = state.observations.filter((item) => item.case_id === context.case_id), evidence = state.evidence.filter((item) => item.case_id === context.case_id), decision = decisionService.get_management_options(context);
  return investigationService.save_case_summary(context, { inspection_at: caseRecord.completed_at ?? caseRecord.created_at, domain: caseRecord.domain, observed_findings: observations.map((item) => ({ observation_id: item.observation_id, question_id: item.question_id, value: item.original_text || item.value, uncertain: item.uncertain, provenance: item.provenance })), evidence_summary: evidence.map((item) => ({ evidence_id: item.evidence_id, source_type: item.source_type, analysis_state: item.analysis_state, boundary: item.boundary })), candidate_interpretation: `การตรวจในหมวด${domainLabel(caseRecord.domain)}ยังไม่ยืนยันสาเหตุ`, uncertainty: observations.some((item) => item.uncertain || item.skipped) ? "มีข้อมูลที่ผู้ใช้ยังไม่แน่ใจหรือข้ามไว้" : "ยังไม่มีการยืนยันสาเหตุจากการตรวจนี้", need_for_action: decision.need_for_action, management_options: decision.options, suggestion_message: decision.suggestion_message, application_guidance: decisionService.application_guidance(), next_step: decision.need_for_action.state === "MORE_EVIDENCE_REQUIRED" ? "เก็บข้อสังเกตเพิ่มหรือนำหลักฐานให้ผู้เชี่ยวชาญทบทวน" : "ติดตามการเปลี่ยนแปลงและเปิดเคสใหม่เมื่อมีข้อมูลเพิ่ม", evidence_provenance: [...new Set(observations.map((item) => item.provenance).concat(evidence.flatMap((item) => item.lineage)))] });
}

function renderSummary() {
  const field = selectedField(); if (!field || !activeCaseId) { route = "field-detail"; render(); return; }
  const context = caseContext(), summary = ensureSummary(context), decisionLog = decisionService.get_decision_log(context), caseRecord = investigationService.get_case(context);
  const applicationMissing = summary.application_guidance.evidence_state === "UNAVAILABLE";
  root.innerHTML = `${appHeader({ back: "field-detail" })}<main class="app-main summary-main"><header class="summary-heading"><div><p class="eyebrow">สรุปหลังการตรวจ</p><h1>${escapeHtml(field.name)}</h1><p>${domainIcon(caseRecord.domain)} ${domainLabel(caseRecord.domain)} · ${new Intl.DateTimeFormat("th-TH", { dateStyle:"medium", timeStyle:"short" }).format(new Date(summary.inspection_at))}</p></div><span class="need-state">${escapeHtml(summary.need_for_action.state)}</span></header><section class="summary-overview"><article><small>ระยะ CMP</small><strong>${escapeHtml(field.current_cmp_stage.label)}</strong></article><article><small>ข้อสังเกต</small><strong>${summary.observed_findings.length} รายการ</strong></article><article><small>หลักฐานภาพ</small><strong>${summary.evidence_summary.length} รายการ</strong></article><article><small>สถานะเคส</small><strong>${escapeHtml(caseRecord.status)}</strong></article></section><section class="summary-card"><h2>สิ่งที่พบและความไม่แน่นอน</h2><p class="candidate-boundary">${escapeHtml(summary.candidate_interpretation)} · Candidate ≠ Diagnosis</p><ul>${summary.observed_findings.map((item) => `<li><span>${item.uncertain ? "?" : "✓"}</span>${escapeHtml(item.value || "ข้ามคำถาม")}</li>`).join("") || `<li>ยังไม่มีข้อสังเกต</li>`}</ul><p class="uncertainty-note">ⓘ ${escapeHtml(summary.uncertainty)}</p></section><section class="management-section"><header><p class="eyebrow">แนวทางการจัดการ</p><h2>ตัวเลือกที่ระบบอนุญาตให้พิจารณา</h2><p>${escapeHtml(summary.suggestion_message)}</p></header><div class="management-options">${summary.management_options.map((option) => `<button type="button" class="management-option ${selectedManagementOptionId === option.management_option_id || decisionLog?.management_option_id === option.management_option_id ? "selected" : ""}" data-management-select="${option.management_option_id}" ${option.eligibility_state === "eligible" ? "" : "disabled"}><span class="option-radio">${selectedManagementOptionId === option.management_option_id || decisionLog?.management_option_id === option.management_option_id ? "●" : "○"}</span><span><strong>${escapeHtml(option.title)}</strong><small>${escapeHtml(option.objective)}</small><em>เหตุผล: ${escapeHtml(option.why_shown)}</em><mark>${escapeHtml(option.eligibility_state)}</mark></span></button>`).join("")}</div><label class="decision-notes">หมายเหตุการเลือก (ไม่บังคับ)<textarea data-decision-notes placeholder="บันทึกเหตุผลของคุณ…">${escapeHtml(decisionLog?.notes ?? "")}</textarea></label><button class="primary-action" type="button" data-action="save-decision" ${selectedManagementOptionId || decisionLog ? "" : "disabled"}>${decisionLog ? "✓ บันทึกทางเลือกแล้ว" : "บันทึกทางเลือกที่เลือก"}</button><p class="selection-boundary">การเลือกนี้เป็น DecisionLog เท่านั้น · USER SELECTED OPTION ≠ FIELD ACTION PERFORMED</p></section><section class="summary-card application-boundary"><h2>ข้อมูลการใช้อุปกรณ์และการประยุกต์ใช้</h2><p>${applicationMissing ? "ยังไม่มีข้อมูลที่ผ่านการยืนยันในชุดความรู้ปัจจุบัน" : "มีข้อมูลที่ผ่านการกำกับ"}</p><dl><div><dt>วิธีและอุปกรณ์</dt><dd>${summary.application_guidance.application_method ?? "—"} / ${summary.application_guidance.equipment_type ?? "—"}</dd></div><div><dt>ปริมาณน้ำ / อัตราไหล</dt><dd>${summary.application_guidance.water_volume ?? "—"} / ${summary.application_guidance.flow_rate ?? "—"}</dd></div><div><dt>ความสูง / ความเร็ว / ความกว้างแนว</dt><dd>${summary.application_guidance.height ?? "—"} / ${summary.application_guidance.speed ?? "—"} / ${summary.application_guidance.swath_width ?? "—"}</dd></div></dl></section><section class="summary-card next-step"><h2>ขั้นตอนถัดไป</h2><p>${escapeHtml(summary.next_step)}</p><details><summary>ดูหลักฐานและที่มา</summary><p>${summary.evidence_provenance.map(escapeHtml).join(" · ") || "ไม่มีหลักฐานภายนอก"}</p><p>${PHOTO_EVIDENCE_BOUNDARY}</p></details></section><div class="summary-actions"><button class="secondary-action" type="button" data-route="field-detail">กลับไปหน้าแปลง</button><button class="primary-action" type="button" data-action="open-free-chat">ถาม SP Assistant</button></div></main>${bottomNavigation("fields")}`;
  root.querySelector(".application-boundary")?.insertAdjacentHTML("beforebegin", companyCaseBoundaryMarkup());
}

function ensureFieldConversation() {
  const context = fieldContext(); let conversation = conversationService.find_field_conversation(context);
  if (!conversation) conversation = conversationService.create_conversation(context, CONVERSATION_SCOPES.FIELD_SCOPED);
  activeConversationId = conversation.conversation_id; activeCaseId = null; return conversation;
}

function renderFreeChat() {
  const field = selectedField(); if (!field) { route = "fields"; render(); return; }
  const conversation = ensureFieldConversation(), context = conversationContext(conversation.conversation_id, null, field), messages = conversationService.list_messages(context);
  root.innerHTML = `${appHeader({ back: "field-detail" })}<main class="free-chat-main"><section class="chat-field-context"><span>✓ แปลงที่เลือกอยู่</span><strong>${escapeHtml(field.name)}</strong><small>${escapeHtml(field.current_cmp_stage.label)} · ${escapeHtml(field.field_id)}</small></section><p class="chat-boundary">คำตอบเป็นข้อมูลช่วยพิจารณา ไม่ใช่การยืนยันการวินิจฉัย</p><section class="free-chat-thread">${messages.length ? messages.map((message) => `<article class="free-message ${message.role.toLowerCase()}"><span>${message.role === "USER" ? "คุณ" : "SP"}</span><div><p>${escapeHtml(message.content)}</p>${message.evidence_id ? `<small>PHOTO RECEIVED · ยังไม่ได้วิเคราะห์</small>` : ""}<time>${new Intl.DateTimeFormat("th-TH", { hour:"2-digit", minute:"2-digit" }).format(new Date(message.created_at))}</time></div></article>`).join("") : `<article class="free-message assistant"><span>SP</span><div><p>สวัสดีครับ ถามเรื่องแปลงนี้ได้เลย หรือเริ่มการตรวจแบบมีขั้นตอนได้ครับ</p><small>คำตอบ AI จะถูกเก็บในบทสนทนาของแปลงและฤดูนี้</small></div></article>`}${chatPending ? `<article class="free-message assistant pending"><span>SP</span><div><p>กำลังประมวลผล…</p></div></article>` : ""}${chatRetryText ? `<button class="chat-retry" type="button" data-action="retry-chat">ลองใหม่โดยไม่ส่งข้อความซ้ำ</button>` : ""}<div class="chat-suggestions"><button type="button" data-action="start-full-inspection">⌕ เริ่มตรวจสุขภาพแปลง</button><button type="button" data-chat-prompt="ช่วยจัดสิ่งที่ควรสังเกตในแปลงนี้">สิ่งที่ควรสังเกต</button><button type="button" data-chat-prompt="ผมมีภาพจากแปลง">ส่งภาพจากแปลง</button></div></section><form class="free-chat-composer" data-free-chat-form><label class="camera-control" aria-label="แนบรูป"><input type="file" accept="image/*" capture="environment" data-chat-photo ${chatPending ? "disabled" : ""}><span>▣</span></label><input name="message" placeholder="พิมพ์ข้อความ…" required ${chatPending ? "disabled" : ""}><button type="submit" aria-label="ส่งข้อความ" ${chatPending ? "disabled" : ""}>↑</button></form></main>${bottomNavigation("free-chat")}`;
}

async function sendFieldChat(text, { appendUser = true } = {}) {
  if (chatPending || !text) return;
  const context = conversationContext(activeConversationId, null);
  if (appendUser) conversationService.append_message(context, { role:"USER", content:text, status:"SAVED" });
  chatPending = true; chatRetryText = null; renderFreeChat();
  const response = await llmGateway.chat({ scope:"FIELD_SCOPED", field_id:context.field_id, season_id:context.season_id, message:text });
  chatPending = false;
  conversationService.append_message(context, { role:"ASSISTANT", content:response.message, message_type:response.status, status:response.status === "AVAILABLE" ? "SAVED" : "FAILED", provider:response.provider, model:response.model, response_id:response.response_id, error_code:response.status === "AVAILABLE" ? null : "PROVIDER_UNAVAILABLE" });
  chatRetryText = response.status === "AVAILABLE" ? null : text; renderFreeChat();
}

function renderLearn() {
  loadCompanyProgram();
  if (!knowledgeSummary && !knowledgeSummaryPending) { knowledgeSummaryPending = true; serverKnowledge.summary().then((value) => { knowledgeSummary = value; knowledgeSummaryPending = false; if (route === "learn") renderLearn(); }).catch(() => { knowledgeSummaryPending = false; }); }
  const counts = Object.fromEntries((knowledgeSummary?.packages ?? []).map((item) => [item.domain, item.subjects]));
  const categoryMarkup = [["","⌕","ค้นทั้งหมด",Object.values(counts).reduce((sum, value) => sum + value, 0)],["DISEASE","🍃","โรคและอาการ",counts.DISEASE],["INSECT","🪲","แมลง",counts.INSECT],["WEED","🌱","วัชพืช",counts.WEED]].map(([id,icon,label,count]) => `<button type="button" class="knowledge-category ${knowledgeDomain === id ? "active" : ""}" data-knowledge-domain="${id}"><span>${icon}</span><strong>${label}</strong><small>${count ?? "…"} รายการ</small></button>`).join("");
  const resultMarkup = knowledgeLoading ? `<div class="knowledge-state">กำลังค้นข้อมูลที่ผ่านการทบทวน…</div>` : knowledgeError ? `<div class="knowledge-state error">${escapeHtml(knowledgeError)}</div>` : knowledgeResults.length ? `<div class="knowledge-results">${knowledgeResults.map((item) => `<article class="knowledge-result"><header><span>${domainIcon(item.domain)}</span><div><small>${escapeHtml(domainLabel(item.domain))} · ${escapeHtml(item.review_state)}</small><h2>${escapeHtml(item.name)}</h2>${item.english || item.scientific ? `<p>${escapeHtml([item.english,item.scientific].filter(Boolean).join(" · "))}</p>` : ""}</div></header><div class="knowledge-observation"><strong>สิ่งที่ใช้ช่วยสังเกต</strong><p>${escapeHtml(item.observation || "แหล่งข้อมูลไม่ได้ระบุข้อความสังเกตแบบย่อ")}</p>${item.context ? `<small>บริบท: ${escapeHtml(item.context)}</small>` : ""}</div><details><summary>ที่มาและข้อจำกัด</summary><p>${item.sources.map((source) => `${escapeHtml(source.label)} (${escapeHtml(source.id)})`).join("<br>")}</p><p>ตำแหน่งอ้างอิง: ${escapeHtml(Array.isArray(item.source_locators) ? item.source_locators.join(", ") : item.source_locators || "ไม่ระบุ")}</p><ul>${item.limitations.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul></details></article>`).join("")}</div>` : knowledgeQuery ? `<div class="knowledge-state">ไม่พบรายการที่ตรงกับ “${escapeHtml(knowledgeQuery)}” ลองใช้ชื่ออาการ แมลง โรค หรือวัชพืชที่สั้นลง</div>` : `<div class="knowledge-state">ลองค้นหาด้วยชื่ออาการ ชื่อสิ่งที่พบ หรือชื่อวัชพืช</div>`;
  root.innerHTML = `${appHeader({ back: "home" })}<main class="app-main simple-page learn-page page-enter"><section class="learn-hero"><div><p class="eyebrow">INTERNAL PILOT KNOWLEDGE</p><h1>ศูนย์เรียนรู้</h1><p>เริ่มจากสิ่งที่เห็น แล้วเชื่อมไปยังหลักฐานและการทบทวนอย่างเป็นขั้นตอน</p></div><span>▤</span></section><section class="knowledge-map" aria-labelledby="knowledge-map-title"><header><div><p class="eyebrow">KNOWLEDGE MAP</p><h2 id="knowledge-map-title">จากแปลงจริงไปสู่ความรู้ที่ตรวจสอบได้</h2></div><span class="map-status">ฉบับ Pilot</span></header><div class="knowledge-flow"><article><span>👁️</span><strong>1. สิ่งที่สังเกต</strong><small>อาการ ตำแหน่ง เวลา และภาพจากแปลง</small></article><i aria-hidden="true">→</i><article><span>🧩</span><strong>2. กลุ่มความรู้</strong><small>ข้าว · โรค · แมลง · วัชพืช · สภาพแวดล้อม</small></article><i aria-hidden="true">→</i><article><span>📚</span><strong>3. หลักฐาน</strong><small>ดูที่มา ข้อจำกัด และสถานะการทบทวน</small></article><i aria-hidden="true">→</i><article><span>✅</span><strong>4. ทีมยืนยัน</strong><small>บันทึกว่าใช้ได้ ข้อมูลไม่ตรง หรือต้องเพิ่ม</small></article></div><p class="flow-boundary">แผนภาพนี้ช่วยจัดลำดับการเรียนรู้ ไม่ใช่เส้นทางยืนยันการวินิจฉัยหรือสั่งให้ลงมือในแปลง</p></section><div class="knowledge-categories">${categoryMarkup}</div><form class="knowledge-search" data-knowledge-search-form><label><span>ค้นจากสิ่งที่พบในแปลง</span><input name="query" maxlength="120" value="${escapeHtml(knowledgeQuery)}" placeholder="เช่น ขอบใบแห้ง หรือ แมลงตัวเล็ก" required></label><input type="hidden" name="domain" value="${escapeHtml(knowledgeDomain)}"><button class="primary-action" type="submit" ${knowledgeLoading ? "disabled" : ""}>⌕ ค้นข้อมูล</button></form><p class="knowledge-boundary">ข้อมูลช่วยสังเกต ≠ การยืนยันการวินิจฉัย · ไม่มีอัตราใช้หรือคำแนะนำสารเคมีในผลค้นหา</p>${resultMarkup}<section class="pilot-feedback"><div><p class="eyebrow">TEAM REVIEW</p><h2>หน้านี้ช่วยทำงานได้ไหม?</h2><p>Feedback จะถูกเก็บในถังข้อมูล Pilot พร้อมหน้าที่รีวิว</p></div><div class="feedback-actions"><button type="button" data-feedback-rating="WORKS">✓ ใช้ได้</button><button type="button" data-feedback-rating="MISMATCH">! ข้อมูลไม่ตรง</button><button type="button" data-feedback-rating="NEEDS_DATA">＋ ต้องเพิ่มข้อมูล</button></div>${feedbackNotice ? `<p class="success-note">${escapeHtml(feedbackNotice)}</p>` : ""}</section><details class="legacy-learning"><summary>เปิดคลังความรู้ฉบับตรวจสอบรายละเอียด</summary><div class="learning-grid"><a href="../knowledge-explorer/rice-disease-corpus.html"><span>🍃</span><strong>องค์ความรู้โรคข้าว</strong><small>ดูหลักฐานและที่มา</small></a><a href="../knowledge-explorer/rice-insect-corpus.html"><span>🪲</span><strong>องค์ความรู้แมลง</strong><small>ดูหลักฐานและข้อจำกัด</small></a><a href="../knowledge-explorer/rice-weed-corpus.html"><span>🌱</span><strong>องค์ความรู้วัชพืช</strong><small>ค้นจากลักษณะที่สังเกต</small></a></div></details></main>${bottomNavigation("learn")}`;
  const programMarkup = companyProgram?.stages?.map((stage) => companyStageMarkup(stage, { compact:true })).join("") || companyStageMarkup(null);
  root.querySelector(".knowledge-categories")?.insertAdjacentHTML("beforebegin", `<section class="program-library"><header><div><p class="eyebrow">COMPANY RICE PROGRAM · REFERENCE ONLY</p><h2>คลังอ้างอิงสูตรบริษัทตาม 9 ระยะ CMP</h2><p>ผลิตภัณฑ์ อัตราต่อไร่ และค่าโดรนต่อไปนี้เป็นข้อมูลอ้างอิงต้นทาง ไม่ใช่คำแนะนำสำหรับเคสหรืออำนาจกำกับตามทะเบียน</p></div><span>🔒 NON-ACTIONABLE</span></header><div class="program-stage-list">${programMarkup}</div><p class="program-data-boundary">ข้อมูลชุดนี้แสดงเฉพาะใน Knowledge หลังล็อกอิน ไม่ถูกส่งไปยัง OpenAI และไม่เปลี่ยน F1, Decision หรือ Action</p></section>`);
}

function renderProfile() {
  const user = currentUser();
  root.innerHTML = `${appHeader({ back: "home" })}<main class="app-main simple-page"><div class="profile-card"><div class="large-avatar">👨🏽‍🌾</div><p class="eyebrow">บัญชีต้นแบบ</p><h1>${escapeHtml(user.display_name)}</h1><p>${escapeHtml(user.username)} · ${escapeHtml(user.role)}</p><dl><div><dt>รหัสผู้ใช้</dt><dd>${escapeHtml(user.user_id)}</dd></div><div><dt>โหมดเข้าสู่ระบบ</dt><dd>${escapeHtml(user.session.authentication_mode)}</dd></div></dl><button class="primary-action" type="button" data-action="open-pilot-diagnostics">สถานะ Internal Pilot</button><button class="secondary-action" type="button" data-action="logout">ออกจากระบบ</button></div></main>${bottomNavigation("profile")}`;
}

async function renderPilotDiagnostics() {
  root.innerHTML = `${appHeader({ back:"profile" })}<main class="app-main simple-page"><p class="eyebrow">INTERNAL PILOT</p><h1>สถานะระบบและถังข้อมูล</h1><div class="profile-card"><p>กำลังตรวจสอบ…</p></div></main>${bottomNavigation("profile")}`;
  try { [pilotSummary, dataCatalog] = await Promise.all([serverWorkspace.summary(), serverWorkspace.dataCatalog()]); root.innerHTML = `${appHeader({ back:"profile" })}<main class="app-main simple-page"><p class="eyebrow">INTERNAL PILOT</p><h1>สถานะระบบและถังข้อมูล</h1><div class="profile-card pilot-diagnostics"><dl><div><dt>ฐานข้อมูล</dt><dd>พร้อมใช้งาน</dd></div><div><dt>OpenAI</dt><dd>${pilotSummary.ai_configured ? "พร้อม" : "ยังไม่ตั้งค่า"} · ${escapeHtml(pilotSummary.model)}</dd></div><div><dt>แปลง / ฤดูปลูก</dt><dd>${pilotSummary.fields} / ${pilotSummary.seasons}</dd></div><div><dt>บทสนทนา / ข้อความ</dt><dd>${pilotSummary.conversations} / ${pilotSummary.messages}</dd></div><div><dt>เคส / หลักฐาน</dt><dd>${pilotSummary.cases} / ${pilotSummary.evidence}</dd></div><div><dt>Export ล่าสุด</dt><dd>${escapeHtml(pilotSummary.last_export_at ?? "ยังไม่มี")}</dd></div><div><dt>Backup ล่าสุด</dt><dd>${escapeHtml(pilotSummary.last_backup_at ?? "ยังไม่มี")}</dd></div></dl><section class="data-readiness"><h2>ความพร้อมของข้อมูลบนเว็บ</h2><p>Catalog ${escapeHtml(dataCatalog.catalog_version)} · อัปเดต ${escapeHtml(dataCatalog.updated_at)}</p>${dataCatalog.datasets.map((item) => `<article><strong>${escapeHtml(item.dataset_id)}</strong><span>${escapeHtml(item.status)}</span><small>${escapeHtml(item.limitations[0])}</small></article>`).join("")}</section><button class="primary-action" type="button" data-action="pilot-export">Export JSON/CSV</button><button class="secondary-action" type="button" data-action="pilot-backup">สร้าง Backup</button>${notice ? `<p class="success-note">${escapeHtml(notice)}</p>` : ""}</div></main>${bottomNavigation("profile")}`; } catch (error) { formError = error.message; renderError(); }
}

function renderFeedback() {
  const field = selectedField();
  root.innerHTML = `${appHeader({ back:feedbackReturnRoute })}<main class="app-main feedback-page page-enter"><p class="eyebrow">INTERNAL PILOT FEEDBACK</p><h1>บอกสิ่งที่ติดขัดจากการใช้งานจริง</h1><p>แนบภาพหน้าจอและอธิบายสิ่งที่เกิดขึ้น ระบบจะจัดหมวดเพื่อรวมประเด็นสำหรับพัฒนารอบถัดไป</p><form class="feedback-form" data-pilot-feedback-form><label>เกี่ยวกับเรื่องใด<select name="category" required><option value="">เลือกหมวด</option><option value="MAP">แผนที่ / GPS</option><option value="CHAT">แชท</option><option value="INSPECTION">ขั้นตอนตรวจแปลง</option><option value="SOLUTION">คำแนะนำโซลูชัน</option><option value="MOBILE_UI">การใช้งานบนมือถือ</option><option value="PERFORMANCE">ความเร็ว / การเชื่อมต่อ</option><option value="OTHER">เรื่องอื่น</option></select></label><label>ผลกระทบ<select name="rating" required><option value="MISMATCH">ใช้งานติดขัด / ไม่ตรง</option><option value="NEEDS_DATA">ต้องเพิ่มข้อมูลหรือขั้นตอน</option><option value="WORKS">ใช้ได้ แต่อยากเสนอเพิ่ม</option></select></label><label class="feedback-note">รายละเอียด<textarea name="note" maxlength="500" required placeholder="ทำอะไรอยู่ → เกิดอะไรขึ้น → คาดหวังให้เป็นอย่างไร"></textarea><small>สูงสุด 500 ตัวอักษร</small></label><label class="feedback-photo">แนบภาพ (ไม่บังคับ)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" capture="environment"><small>JPG, PNG หรือ WebP ไม่เกิน 6 MB</small></label><div class="feedback-context"><span>หน้าที่พบ: ${escapeHtml(feedbackReturnRoute)}</span><span>แปลง: ${escapeHtml(field?.name ?? "ไม่ได้เลือกแปลง")}</span></div>${formError ? `<p class="form-message error">${escapeHtml(formError)}</p>` : ""}<button class="primary-action" type="submit">ส่ง Feedback เข้าถังข้อมูล</button><button class="secondary-action" type="button" data-route="${feedbackReturnRoute}">ยกเลิก</button></form></main>${bottomNavigation("")}`;
}

function renderError() { root.innerHTML = `<main class="state-view"><div class="error-state-icon">!</div><h1>เตรียมพื้นที่ทำงานไม่สำเร็จ</h1><p>${escapeHtml(formError ?? "เกิดข้อผิดพลาดที่ไม่คาดคิด")}</p><button class="primary-action compact-action" type="button" data-action="reload">ลองใหม่</button></main>`; }

function render() {
  if (route !== "create" || draft.step !== 1) { activeMapAdapter?.destroy(); activeMapAdapter = null; }
  if (!['home', 'fields', 'field-detail'].includes(route)) clearFieldSatellitePreviews();
  document.body.removeAttribute("data-route");
  document.body.dataset.currentRoute = route;
  if (route === "feedback") { renderFeedback(); window.scrollTo({ top:0, behavior:"instant" }); return; }
  if (route === "loading") renderLoading(); else if (route === "login") renderLogin(); else if (route === "gps") renderGps(); else if (route === "home") renderHome(); else if (route === "fields") renderFields(); else if (route === "create") renderCreateField(); else if (route === "field-detail") renderFieldDetail(); else if (route === "investigation-capture") renderInvestigationCapture(); else if (route === "inspection") renderInspection(); else if (route === "summary") renderSummary(); else if (route === "free-chat") renderFreeChat(); else if (route === "learn") renderLearn(); else if (route === "profile") renderProfile(); else if (route === "pilot-diagnostics") renderPilotDiagnostics(); else renderError();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function weatherTarget() { const field = selectedField(); return field?.centroid ? { status: "AVAILABLE", latitude: field.centroid.latitude, longitude: field.centroid.longitude, source: "FIELD_CENTROID", field_id: field.field_id } : locationService.get_current_location(); }
async function refreshWeather() { weatherState = await weatherService.get_weather(weatherTarget()); const field = selectedField(); if (field && weatherState?.status === "AVAILABLE") { const state = workspace(); state.weather_snapshots.push({ weather_snapshot_id:createStableId("weather"), field_id:field.field_id, season_id:field.season_id, provider:weatherState.provider ?? "OPEN_METEO", observed_at:weatherState.observation_at ?? null, fetched_at:weatherState.updated_at ?? new Date().toISOString(), temperature:weatherState.temperature, wind:weatherState.wind_speed, description:weatherState.condition, status:"AVAILABLE" }); repository.save(state); } if (route === "home") renderHome(); else if (route === "field-detail") renderFieldDetail(); }
async function requestGps() { gpsState = { status: "REQUESTING" }; renderGps(); gpsState = await locationService.request_location(); weatherState = undefined; if (route === "gps") renderGps(); }
function updateStagePreview() {
  const target = root.querySelector("[data-stage-preview]"); if (!target) return;
  if (!draft.date) { target.innerHTML = `<p class="stage-placeholder">ⓘ เลือกวันที่ ระบบจะแสดงอายุข้าว ระยะ และ CMP โดยอัตโนมัติ</p>`; return; }
  if (!stageService) { target.innerHTML = `<p class="stage-placeholder error">ไม่สามารถโหลดแบบจำลองระยะข้าวได้</p>`; return; }
  draft.stageEstimate = stageService.calculate_crop_stage(draft.date); const age = stageService.calculate_crop_age(draft.date);
  target.innerHTML = `<header><strong>ข้อมูลที่ระบบคำนวณอัตโนมัติ</strong><span>อ้างอิง ${escapeHtml(draft.stageEstimate.model_version)}</span></header><div class="stage-result-grid"><div><small>อายุข้าว</small><strong>${age.state === "PLANNED" ? `อีก ${age.days_until_planting} วันถึงวันปลูก` : `${age.crop_age_days} วัน`}</strong></div><div><small>ระยะข้าว (หลังบ้าน)</small><strong>${escapeHtml(draft.stageEstimate.crop_stage_label)}</strong></div><div><small>ระยะตาม CMP</small><strong>${escapeHtml(draft.stageEstimate.cmp_stage_label)}</strong></div></div><p>ค่าประเมินจากวันที่ปลูก วิธีปลูก และแบบจำลองที่กำกับไว้ ไม่ได้บันทึกเป็นข้อมูลที่ผู้ใช้กรอกเอง</p>`;
}

function addDraftPoint(point) { if (draft.closed || !point) return; draft.points.push({ latitude: Number(point.latitude), longitude: Number(point.longitude) }); formError = null; renderCreateField(); }
function updateDraftFromDetailsForm(form) { const data = new FormData(form); draft.name = String(data.get("name") ?? ""); draft.date = String(data.get("date") ?? ""); draft.variety = String(data.get("variety") ?? "").trim(); draft.plantingMethod = String(data.get("plantingMethod") ?? ""); draft.overrideCmpStage = String(data.get("overrideCmpStage") ?? draft.overrideCmpStage); }

root.addEventListener("input", (event) => {
  if (event.target.id === "field-name") { draft.name = event.target.value; const counter = event.target.parentElement.querySelector("span"); if (counter) counter.textContent = `${draft.name.length} / 50`; }
  if (event.target.closest("[data-details-form]")) { updateDraftFromDetailsForm(event.target.form); if (event.target.name === "date") { draft.stageChoice = STAGE_PROVENANCE.SYSTEM_ESTIMATED; draft.overrideCmpStage = ""; updateStagePreview(); } }
});

root.addEventListener("submit", async (event) => {
  if(event.target.matches("[data-investigation-capture-form]")){
    event.preventDefault(); const data=new FormData(event.target),note=String(data.get("note")??"").trim(),observedRaw=String(data.get("observed_at")??""),pattern=String(data.get("spatial_pattern")??""),extent=String(data.get("field_extent")??"LOCAL"),plantPart=String(data.get("plant_part")??""),phenotype=String(data.get("phenotype")??""),affectedRaw=String(data.get("affected")??""),observedCountRaw=String(data.get("observed")??""),waterState=String(data.get("water_state")??""),reportedProduct=String(data.get("reported_product_name")??"").trim();
    try { if(!note)throw new Error("กรุณาบันทึกสิ่งที่สังเกตเห็น"); if((plantPart&&!phenotype)||(!plantPart&&phenotype))throw new Error("กรุณาเลือกทั้งส่วนของพืชและลักษณะที่เห็น"); if((affectedRaw&&!observedCountRaw)||(!affectedRaw&&observedCountRaw))throw new Error("กรุณากรอกทั้งจำนวนที่ได้รับผลและจำนวนที่ตรวจ"); const observedAt=new Date(observedRaw).toISOString(),evidence=[];
      if(pattern)evidence.push({record_type:"SPATIAL_EVIDENCE",record:{observed_at:observedAt,source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"SP1_SITE_SUPPORTED",review_state:"UNREVIEWED",payload:{observation_scope:pattern==="PATCH"?"PATCH":"LOCAL_SITE",geometry:pattern==="PATCH"?"PATCH":"UNKNOWN",field_positions:[],patterns:[pattern],field_extent:extent,direction:"UNKNOWN",affected_status:"AFFECTED",location_provenance:"USER_REPORTED"}}});
      if(plantPart&&phenotype)evidence.push({record_type:"MORPHOLOGY_EVIDENCE",record:{observed_at:observedAt,source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"MO0_REPORTED",review_state:"UNREVIEWED",payload:{plant_part:plantPart,primary_phenotypes:[phenotype],negative_evidence:[]}}});
      if(affectedRaw&&observedCountRaw)evidence.push({record_type:"SEVERITY_MEASUREMENT",record:{observed_at:observedAt,source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"SV2_COUNT_SUPPORTED",review_state:"UNREVIEWED",payload:{measurement_concept:"AFFECTED_TILLERS_PER_OBSERVED_TILLERS",numerator:Number(affectedRaw),denominator:Number(observedCountRaw),unit:"COUNT_RATIO",plant_part:"TILLER"}}});
      if(waterState)evidence.push({record_type:"WATER_CONTEXT",record:{observed_at:observedAt,source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"WT0_REPORTED",review_state:"UNREVIEWED",payload:{water_state:waterState,source:"FIELD_OBSERVED",source_confidence:"NOT_ASSESSED"}}});
      if(reportedProduct)evidence.push({record_type:"MANAGEMENT_EVENT",record:{event_type:"UNKNOWN_MANAGEMENT_EVENT",event_at:null,time_precision:"UNKNOWN",source:"USER_REPORTED",reported_product_name:reportedProduct,product_identity_confidence:"UNKNOWN"}});
      const draftRecord=investigationCapture.createDraft(fieldContext(),{note,observed_at:observedAt,evidence}); activeInvestigationDraftId=draftRecord.draft_id; formError=null; renderInvestigationCapture(); const synced=await investigationCapture.sync(draftRecord.draft_id); governedInvestigationBundle=synced.authoritative_bundle; renderInvestigationCapture();
    } catch(error){ formError=error.message; renderInvestigationCapture(); } return;
  }
  if(event.target.matches("[data-investigation-update-form]")){
    event.preventDefault(); const note=String(new FormData(event.target).get("note")??"").trim(),serverObservation=governedInvestigationBundle?.observations?.at(-1); try { if(!note||!serverObservation)throw new Error("ไม่พบ Observation ที่พร้อมแก้ไข"); const updateDraft=investigationCapture.createUpdateDraft(fieldContext(),serverObservation,{note}); activeInvestigationDraftId=updateDraft.draft_id; renderInvestigationCapture(); const synced=await investigationCapture.sync(updateDraft.draft_id); governedInvestigationBundle=synced.authoritative_bundle; renderInvestigationCapture(); } catch(error){formError=error.message;renderInvestigationCapture();} return;
  }
  if (event.target.matches("[data-pilot-feedback-form]")) {
    event.preventDefault(); const data = new FormData(event.target), file = data.get("photo"); formError = null;
    try {
      const upload = file?.size ? await serverWorkspace.uploadFeedbackImage(file) : null;
      await serverWorkspace.feedback({ route:feedbackReturnRoute, subject_id:activeCaseId ?? selectedField()?.field_id ?? null, rating:String(data.get("rating")), category:String(data.get("category")), note:String(data.get("note") ?? "").trim(), storage_key:upload?.storage_key ?? null });
      notice = "บันทึก Feedback แล้ว ข้อมูลจะรวมอยู่ใน Export และ Backup"; route = feedbackReturnRoute; render();
    } catch (error) { formError = error.message; renderFeedback(); }
    return;
  }
  if (event.target.matches("[data-knowledge-search-form]")) {
    event.preventDefault(); const data = new FormData(event.target); knowledgeQuery = String(data.get("query") ?? "").trim(); knowledgeDomain = String(data.get("domain") ?? ""); if (!knowledgeQuery) return;
    knowledgeLoading = true; knowledgeError = null; renderLearn();
    try { knowledgeResults = (await serverKnowledge.search(knowledgeQuery, knowledgeDomain)).results; } catch (error) { knowledgeResults = []; knowledgeError = error.message; }
    knowledgeLoading = false; renderLearn(); return;
  }
  if (event.target.matches("[data-login-form]")) {
    event.preventDefault();
    const password = event.target.elements.namedItem("password")?.value ?? "";
    try { const authenticated = await serverWorkspace.authenticate(password); const result = loginToPrototypeWorkspace(repository, authenticated.identity); const serverState = await serverWorkspace.pull(); if (serverState) { serverState.active_user_id = result.user.user_id; repository.import(serverState); } formError = null; route = result.nextRoute; render(); requestGps(); } catch (error) { formError = error.message; renderLogin(); }
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
      await repository.flush();
      selectedFieldId = field.field_id; draft.step = 3; formError = null; notice = "บันทึกในพื้นที่ทำงานแบบ Local Compatibility เท่านั้น ยังไม่ถือเป็นรายการที่ server ยืนยัน"; renderCreateField();
    } catch (error) { formError = error.message; renderCreateField(); }
  }
  if (event.target.matches("[data-inspection-form]")) {
    event.preventDefault();
    const question = investigationService.get_next_question(caseContext()), text = String(new FormData(event.target).get("observation") ?? "").trim();
    if (!question || !text) return;
    const observation = investigationService.submit_observation(caseContext(), { question_id: question.question_id, observation_type: question.observation_type, value: text, original_text: text, response_mode: "FREE_TEXT", conversation_id: activeConversationId, uncertain: false });
    const chatContext = conversationContext(activeConversationId, activeCaseId);
    conversationService.append_message(chatContext, { role: "USER", content: text, message_type: "OBSERVATION", observation_id: observation.observation_id });
    const next = investigationService.get_next_question(caseContext());
    if (next) conversationService.append_message(chatContext, { role: "ASSISTANT", content: next.prompt_th, message_type: "QUESTION" });
    event.target.reset(); renderInspection();
  }
  if (event.target.matches("[data-free-chat-form]")) {
    event.preventDefault();
    const text = String(new FormData(event.target).get("message") ?? "").trim(); if (!text) return;
    event.target.reset(); await sendFieldChat(text);
  }
});

root.addEventListener("click", async (event) => {
  const knowledgeCategory = event.target.closest("[data-knowledge-domain]");
  if (knowledgeCategory) { knowledgeDomain = knowledgeCategory.dataset.knowledgeDomain; knowledgeResults = []; knowledgeError = null; feedbackNotice = null; renderLearn(); root.querySelector('[data-knowledge-search-form] input[name="query"]')?.focus(); return; }
  const feedbackRating = event.target.closest("[data-feedback-rating]")?.dataset.feedbackRating;
  if (feedbackRating) { try { await serverWorkspace.feedback({ route:"learn", subject_id:knowledgeResults[0]?.record_id ?? null, rating:feedbackRating, note:knowledgeQuery || null }); feedbackNotice = "บันทึก Feedback เข้าถังข้อมูล Pilot แล้ว ขอบคุณครับ"; } catch (error) { feedbackNotice = error.message; } renderLearn(); return; }
  const routeTarget = findOwnedRouteTarget(event.target, root);
  if (routeTarget) { event.preventDefault(); const next = routeTarget.dataset.route; if (next === "create" && route === "create" && draft.step > 1) draft.step -= 1; else route = next; formError = null; render(); return; }
  const fieldTarget = event.target.closest("[data-field-open]"); if (fieldTarget) { const nextFieldId = fieldTarget.dataset.fieldOpen; if (selectedFieldId !== nextFieldId) weatherState = undefined; selectedFieldId = nextFieldId; fieldService.select_field(selectedFieldId, currentUser().user_id); route = "field-detail"; render(); return; }
  const historyTarget = event.target.closest("[data-case-open]");
  if (historyTarget) { activeCaseId = historyTarget.dataset.caseOpen; const record = investigationService.get_case(caseContext()); const conversation = workspace().conversations.find((item) => item.case_id === activeCaseId); activeConversationId = conversation?.conversation_id ?? null; route = record.status === "COMPLETED" ? "summary" : "inspection"; selectedManagementOptionId = decisionService.get_decision_log(caseContext())?.management_option_id ?? null; render(); return; }
  const guidanceTarget = event.target.closest("[data-guidance-start]"); if (guidanceTarget && !guidanceTarget.disabled) { try { startInspection(guidanceTarget.dataset.guidanceStart); } catch (error) { formError = error.message; renderFieldDetail(); } return; }
  const inspectionResponse = event.target.closest("[data-inspection-response]")?.dataset.inspectionResponse;
  if (inspectionResponse) {
    if (inspectionResponse === "OTHER") { const input = root.querySelector('[data-inspection-form] input[name="observation"]'); input.placeholder = "พิมพ์สิ่งที่พบจริง…"; input.focus(); return; }
    const question = investigationService.get_next_question(caseContext()), skipped = inspectionResponse === "SKIP", uncertain = inspectionResponse === "UNSURE";
    const observation = investigationService.submit_observation(caseContext(), { question_id: question.question_id, observation_type: question.observation_type, value: skipped ? null : inspectionResponse, original_text: skipped ? "ข้ามคำถาม" : question.suggestions.find((item) => item.value === inspectionResponse)?.label ?? inspectionResponse, response_mode: skipped ? "SKIP" : "SUGGESTION", conversation_id: activeConversationId, uncertain, skipped });
    const chatContext = conversationContext(activeConversationId, activeCaseId); conversationService.append_message(chatContext, { role: "USER", content: observation.original_text, message_type: "OBSERVATION" }); const next = investigationService.get_next_question(caseContext()); if (next) conversationService.append_message(chatContext, { role: "ASSISTANT", content: next.prompt_th, message_type: "QUESTION" }); renderInspection(); return;
  }
  const managementTarget = event.target.closest("[data-management-select]"); if (managementTarget && !managementTarget.disabled) { selectedManagementOptionId = managementTarget.dataset.managementSelect; renderSummary(); return; }
  const chatPrompt = event.target.closest("[data-chat-prompt]")?.dataset.chatPrompt; if (chatPrompt) { const input = root.querySelector('[data-free-chat-form] input[name="message"]'); input.value = chatPrompt; input.focus(); return; }
  const mode = event.target.closest("[data-map-mode]"); if (mode) { draft.mode = mode.dataset.mapMode; renderCreateField(); return; }
  const mapAction = event.target.closest("[data-map-action]")?.dataset.mapAction;
  if (mapAction === "location") { const location = locationService.get_current_location(); if (location?.status === "AVAILABLE") { draft.base = { latitude: location.latitude, longitude: location.longitude }; draft.zoom = Math.max(17, draft.zoom); notice = "จัดกึ่งกลางที่ตำแหน่งปัจจุบันแล้ว"; } else formError = "ยังไม่มีตำแหน่งปัจจุบัน คุณสามารถวาดบนแผนที่ต่อได้"; renderCreateField(); return; }
  if (mapAction === "zoom-in") { draft.zoom = Math.min(19, draft.zoom + 1); renderCreateField(); return; }
  if (mapAction === "zoom-out") { draft.zoom = Math.max(3, draft.zoom - 1); renderCreateField(); return; }
  if (mapAction === "undo") { draft.points.pop(); draft.closed = false; renderCreateField(); return; }
  if (mapAction === "clear") { draft.points = []; draft.closed = false; renderCreateField(); return; }
  if (mapAction === "add-center") { addDraftPoint(activeMapAdapter?.getCenter() ?? draft.base); return; }
  if (mapAction === "finish") { if (draft.points.length >= 3) { draft.closed = true; formError = null; renderCreateField(); } return; }
  if (mapAction === "reopen") { draft.closed = false; formError = null; renderCreateField(); return; }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if(action==="open-investigation-capture"){ const field=selectedField(); if(!field)return; activeInvestigationDraftId=latestInvestigationDraft(field)?.draft_id??null; governedInvestigationBundle=null; formError=null; route="investigation-capture"; render(); try { governedInvestigationBundle=await investigationCapture.loadBundle(fieldContext(field)); } catch(error){formError=error.message;} renderInvestigationCapture(); return; }
  if(action==="retry-investigation-sync"){ const synced=await investigationCapture.retry(activeInvestigationDraftId); governedInvestigationBundle=synced.authoritative_bundle; renderInvestigationCapture(); return; }
  if(action==="refresh-investigation-conflict"){ try { const refreshed=await investigationCapture.refresh(activeInvestigationDraftId); governedInvestigationBundle=refreshed.authoritative_bundle; } catch(error){formError=error.message;} renderInvestigationCapture(); return; }
  if(action==="reapply-investigation-draft"){ const conflicted=investigationDrafts.get(activeInvestigationDraftId),serverObservation=governedInvestigationBundle?.observations?.find((item)=>item.observation_id===conflicted?.record_id); if(!conflicted||!serverObservation){formError="ยังไม่มีข้อมูล server สำหรับทบทวน";renderInvestigationCapture();return;} const reapplied=investigationCapture.createUpdateDraft(fieldContext(),serverObservation,{note:conflicted.record.note}); activeInvestigationDraftId=reapplied.draft_id; const synced=await investigationCapture.sync(reapplied.draft_id); governedInvestigationBundle=synced.authoritative_bundle; renderInvestigationCapture(); return; }
  if(action==="new-investigation-draft"){ activeInvestigationDraftId="NEW"; formError=null; renderInvestigationCapture(); return; }
  if (action === "open-feedback") { feedbackReturnRoute = route === "feedback" ? "home" : route; formError = null; route = "feedback"; render(); return; }
  if (action === "open-pilot-diagnostics") { route = "pilot-diagnostics"; notice = null; render(); return; }
  if (action === "pilot-export") { const result = await serverWorkspace.exportData(); notice = `Export สำเร็จ: ${result.json_file}`; await renderPilotDiagnostics(); return; }
  if (action === "pilot-backup") { const result = await serverWorkspace.backup(); notice = `Backup สำเร็จ: ${result.backup_file}`; await renderPilotDiagnostics(); return; }
  if (action === "retry-chat" && chatRetryText) { await sendFieldChat(chatRetryText, { appendUser:false }); return; }
  if (action === "gps-skip") { gpsState = { status: "SKIPPED", message: "ข้ามการใช้ตำแหน่งแล้ว คุณยังใช้งานส่วนอื่นได้" }; route = "home"; render(); return; }
  if (action === "gps-retry") { requestGps(); return; }
  if (action === "weather-refresh") { weatherState = undefined; render(); refreshWeather(); return; }
  if (action === "notifications") { notice = "ศูนย์แจ้งเตือนพื้นที่จะเปิดใน Execution Block ถัดไป"; renderHome(); return; }
  if (action === "create-field") { draft = createDraft(); formError = null; notice = null; route = "create"; render(); return; }
  if (action === "start-full-inspection") { const field = selectedField(); if (!field) { route = "fields"; render(); return; } const pending = guidanceService.get_guidance(fieldContext(field)).find((item) => item.status === "PENDING" || item.status === "IN_PROGRESS"); if (pending) startInspection(pending.guidance_item_id); else { notice = "ตรวจรายการที่แนะนำครบแล้ว"; route = "field-detail"; render(); } return; }
  if (action === "open-free-chat") { if (!selectedField()) { route = "fields"; render(); return; } activeCaseId = null; ensureFieldConversation(); route = "free-chat"; render(); return; }
  if (action === "finish-inspection") { const context = caseContext(), caseRecord = investigationService.finish_case(context); if (caseRecord.guidance_item_id) guidanceService.update_status(fieldContext(), caseRecord.guidance_item_id, "COMPLETED"); ensureSummary(context); selectedManagementOptionId = null; route = "summary"; render(); return; }
  if (action === "undo-observation") { const removed = investigationService.undo_last_observation(caseContext()); notice = removed ? "ย้อนคำตอบล่าสุดแล้ว กรุณาตอบใหม่" : null; renderInspection(); return; }
  if (action === "save-decision") { const existing = decisionService.get_decision_log(caseContext()), optionId = selectedManagementOptionId ?? existing?.management_option_id, notes = root.querySelector("[data-decision-notes]")?.value ?? ""; if (!optionId) return; try { decisionService.select_management_option(caseContext(), optionId, notes); selectedManagementOptionId = optionId; notice = "บันทึก DecisionLog แล้ว โดยยังไม่ถือว่าได้ลงมือในแปลง"; renderSummary(); } catch (error) { formError = error.message; renderSummary(); } return; }
  if (action === "map-next") { const checked = validateFieldName(draft.name); if (!checked.valid) { formError = checked.error; renderCreateField(); return; } if (!draft.closed) { formError = "กรุณาปิดรูปแปลงก่อนดำเนินการต่อ"; renderCreateField(); return; } draft.name = checked.value; draft.step = 2; formError = null; renderCreateField(); return; }
  if (action === "details-back") { draft.step = 1; renderCreateField(); return; }
  if (action === "logout") { const state = workspace(); state.active_user_id = null; repository.save(state); selectedFieldId = null; route = "login"; render(); return; }
  if (action === "reload") { window.location.reload(); return; }
  const stageChoice = event.target.closest("[data-stage-choice]")?.dataset.stageChoice; if (stageChoice) { draft.stageChoice = stageChoice === "confirm" ? STAGE_PROVENANCE.USER_CONFIRMED : stageChoice === "edit" ? STAGE_PROVENANCE.USER_OVERRIDDEN : "UNSURE"; renderCreateField(); return; }
});

root.addEventListener("change", async (event) => {
  if (event.target.matches("[data-inspection-photo]")) {
    const file = event.target.files?.[0]; if (!file) return;
    const context = { ...caseContext(), conversation_id: activeConversationId }, lastObservation = workspace().observations.filter((item) => item.case_id === activeCaseId).at(-1);
    const upload = await serverWorkspace.uploadEvidence(file, context);
    const evidence = evidenceService.add_evidence(context, { observation_id: lastObservation?.observation_id ?? null, conversation_id: activeConversationId, source_type: "PHOTO_UPLOAD", file_name: file.name, storage_key:upload.storage_key, media_type: file.type, size_bytes: file.size, user_provenance: "USER_SUBMITTED_DURING_INSPECTION" });
    conversationService.append_message(conversationContext(activeConversationId, activeCaseId), { role: "USER", content: `ส่งภาพ ${file.name}`, message_type: "PHOTO", evidence_id: evidence.evidence_id });
    await llmGateway.analyze_image({ evidence_id: evidence.evidence_id });
    event.target.value = ""; renderInspection(); return;
  }
  if (event.target.matches("[data-chat-photo]")) {
    const file = event.target.files?.[0]; if (!file) return;
    const context = conversationContext(activeConversationId, null), upload = await serverWorkspace.uploadEvidence(file, context), evidence = evidenceService.add_evidence(context, { conversation_id: activeConversationId, source_type: "PHOTO_UPLOAD", file_name: file.name, storage_key:upload.storage_key, media_type: file.type, size_bytes: file.size, user_provenance: "USER_SUBMITTED_IN_FIELD_CHAT" });
    conversationService.append_message(context, { role: "USER", content: `ส่งภาพ ${file.name}`, message_type: "PHOTO", evidence_id: evidence.evidence_id });
    const result = await llmGateway.analyze_image({ evidence_id: evidence.evidence_id });
    conversationService.append_message(context, { role: "ASSISTANT", content: result.message, message_type: result.status });
    event.target.value = ""; renderFreeChat();
  }
});

async function boot() { renderLoading(); try { [configuration, workflowConfiguration] = await Promise.all([loadFieldConfiguration(), loadInvestigationConfiguration()]); stageService = new StageService(configuration); guidanceService = new GuidanceService(repository, workflowConfiguration); investigationService = new InvestigationService(repository, workflowConfiguration); evidenceService = new EvidenceService(repository); conversationService = new ConversationService(repository); decisionService = new DecisionService(repository, workflowConfiguration); const sessionReady = await serverWorkspace.hasSession(); if (sessionReady && currentUser()) { const serverState = await serverWorkspace.pull(); if (serverState) { serverState.active_user_id = currentUser().user_id; repository.import(serverState); } } else if (currentUser()) { const state = workspace(); state.active_user_id = null; repository.import(state); } route = currentUser() ? "home" : "login"; render(); } catch (error) { formError = error.message; route = "error"; render(); } }
boot();
}
