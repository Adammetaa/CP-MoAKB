import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = await readFile(resolve(root, "index.html"), "utf8");
const legacyHtml = await readFile(resolve(root, "legacy.html"), "utf8");
const styles = await readFile(resolve(root, "assets", "styles.css"), "utf8");
const chatStyles = await readFile(resolve(root, "assets", "chat.css"), "utf8");
const polishStyles = await readFile(resolve(root, "assets", "polish.css"), "utf8");
const app = await readFile(resolve(root, "assets", "app.js"), "utf8");
const decisionGates = await readFile(resolve(root, "assets", "decision-gates.js"), "utf8");
const decisionAuthority = await readFile(resolve(root, "assets", "decision-authority.js"), "utf8");
const fieldApp = await readFile(resolve(root, "assets", "field-app.js"), "utf8");
const fieldCore = await readFile(resolve(root, "assets", "field-core.js"), "utf8");
const fieldServices = await readFile(resolve(root, "assets", "field-services.js"), "utf8");
const fieldStyles = await readFile(resolve(root, "assets", "field-shell.css"), "utf8");
const prototypeLogin = await readFile(resolve(root, "assets", "prototype-login.js"), "utf8");
const routeInteractions = await readFile(resolve(root, "assets", "route-interactions.js"), "utf8");
const investigationConfig = JSON.parse(await readFile(resolve(root, "assets", "investigation-config.json"), "utf8"));
const fieldConfig = JSON.parse(await readFile(resolve(root, "assets", "field-config.json"), "utf8"));
const failures = [];

for (const required of [
  "SP Assistant", "chat-shell", "welcome-message", "สวัสดีครับ", "วันนี้พบอะไรในแปลง?",
  "เพิ่มรูปภาพ", "ข้อมูลแปลง", "เริ่มตรวจสอบ", "<noscript>",
  "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ", "../knowledge-explorer/rice-disease-corpus.html",
]) if (!legacyHtml.includes(required)) failures.push(`legacy.html missing: ${required}`);

for (const required of [
  "message-timeline", "USER_TEXT", "USER_IMAGE", "ASSISTANT_MESSAGE", "SYSTEM / EVIDENCE",
  "attachment-menu", "data-camera-action", "data-gallery-action", "data-detail-sheet",
  "Photo received ≠ Photo analyzed", "Candidate Knowledge ≠ Diagnosis",
  "CONTROL FAILURE ≠ RESISTANCE", "requestSubmit()", "sendButton.disabled",
  "composer-collapsed", "composer-expanded", "composer-summary", "composer-collapse",
  "readingOlderMessages", "activelyEditing", "updateComposerSummary",
  "detectInputRecovery", "renderInputRecovery", "timestamp-toggle", "jump-latest",
  "positionAttachmentMenu", "commitPendingImages", "resizeComposerText",
]) if (!app.includes(required)) failures.push(`app.js missing chat contract: ${required}`);

for (const prohibited of [
  "XMLHttpRequest", "WebSocket", "EventSource", "sendBeacon", "localStorage", "sessionStorage",
  "indexedDB", "FormData", "base64", "FileReader", "Google Drive", "Supabase", "Firebase", "S3", "R2",
]) if (app.includes(prohibited)) failures.push(`app.js contains prohibited capability: ${prohibited}`);

const fetchCalls = app.match(/fetch\(/g) ?? [];
if (fetchCalls.length !== 1 || !app.includes("api.open-meteo.com")) failures.push("only the governed Open-Meteo request may use fetch");
for (const required of ["URL.createObjectURL", "URL.revokeObjectURL", 'imageInput.value = ""', "pagehide"]) {
  if (!app.includes(required)) failures.push(`app.js missing local-image boundary: ${required}`);
}
for (const required of ["--green:#165c3b", "--gold:#d4a017", ":focus-visible", "@media(max-width:820px)", "prefers-reduced-motion"]) {
  if (!styles.includes(required)) failures.push(`styles.css missing design requirement: ${required}`);
}
for (const required of [".chat-composer", ".user-turn", ".assistant-turn", ".attachment-menu", "bottom:52px", "100dvh"]) {
  if (!chatStyles.includes(required)) failures.push(`chat.css missing true-chat requirement: ${required}`);
}
for (const required of ['font-family:"Prompt"', ".system-turn", ".warning-turn", "position:fixed!important", "z-index:65", "prefers-reduced-motion", ".jump-latest", ".reply-context"]) {
  if (!polishStyles.includes(required)) failures.push(`polish.css missing freeze requirement: ${required}`);
}
if (/<form\b[^>]*(?:action|method)=/i.test(html) || /<form\b[^>]*(?:action|method)=/i.test(legacyHtml)) failures.push("forms must remain local and non-network-submittable");
if (!html.includes('<html lang="th">') || !html.includes('content="noindex,nofollow"') || !legacyHtml.includes('<html lang="th">')) failures.push("Thai-first or indexing boundary missing");
for (const required of ["field-app", "field-shell.css", "Field Intelligence Workspace", "type=\"module\""]) {
  if (!html.includes(required)) failures.push(`index.html missing field backbone: ${required}`);
}
for (const prohibited of ["class=\"workspace\"", "chat-shell", "data-problem", "assets/styles.css", "assets/app.js"]) {
  if (html.includes(prohibited)) failures.push(`index.html contains legacy surface: ${prohibited}`);
}
for (const required of ["class=\"workspace\"", "chat-shell", "data-problem", "assets/styles.css", "assets/app.js?v=legacy-isolated-1"]) {
  if (!legacyHtml.includes(required)) failures.push(`legacy.html missing isolated legacy surface: ${required}`);
}
for (const prohibited of ["id=\"field-app\"", "field-shell.css", "field-app.js"]) {
  if (legacyHtml.includes(prohibited)) failures.push(`legacy.html contains Field Workspace surface: ${prohibited}`);
}
for (const required of ["field-shell.css?v=fixed-login-1", "field-app.js?v=login-route-fix-1"]) {
  if (!html.includes(required)) failures.push(`index.html missing fixed-login cache key: ${required}`);
}
if (!fieldApp.includes('prototype-login.js?v=fixed-login-1')) failures.push("field-app.js missing fixed prototype login module");
if (!fieldApp.includes('route-interactions.js?v=login-route-fix-1')) failures.push("field-app.js missing scoped route interaction module");
if (!fieldApp.includes("document.body.dataset.currentRoute = route")) failures.push("field-app.js missing diagnostic current-route attribute");
if (fieldApp.includes("document.body.dataset.route = route")) failures.push("field-app.js must not expose body as a delegated data-route target");
if (!routeInteractions.includes("root.contains(routeTarget)")) failures.push("route interactions must reject targets outside #field-app");
const loginView = fieldApp.match(/function renderLogin\(\)[\s\S]*?function renderGps\(\)/)?.[0] ?? "";
for (const required of ['name="password"', 'type="password"', "เข้าสู่ระบบ", "สำหรับทดสอบภายใน"]) {
  if (!loginView.includes(required)) failures.push(`Login missing minimal access control: ${required}`);
}
for (const prohibited of ["username", "ชื่อผู้ใช้", "toggle-password", "forgot-password", "ลืมรหัสผ่าน", "aria-pressed"]) {
  if (loginView.includes(prohibited)) failures.push(`Login contains removed control: ${prohibited}`);
}
for (const required of ["prototype-spa-001", 'username: "SPA1"', 'display_name: "ผู้ใช้งานทดสอบ"', 'role: "SPA"', 'submittedPassword !== "1234"', "กรุณากรอกรหัสผ่าน", "รหัสผ่านไม่ถูกต้อง", 'nextRoute: "gps"', "state.active_user_id = user.user_id"]) {
  if (!prototypeLogin.includes(required)) failures.push(`prototype-login.js missing fixed access contract: ${required}`);
}
for (const required of ["MODEL_CONTRACTS", "RELATIONSHIP_BACKBONE", "stage_provenance", "field_id", "decision_log_id"]) {
  if (!fieldCore.includes(required)) failures.push(`field-core.js missing contract: ${required}`);
}
for (const required of ["class FieldService", "class LocationService", "class MapService", "class StageService", "class GuidanceService", "class InvestigationService", "class EvidenceService", "class ConversationService", "class KnowledgeService", "class DecisionService", "class ExplanationService", "class LLMGateway"]) {
  if (!fieldServices.includes(required)) failures.push(`field-services.js missing service: ${required}`);
}
for (const required of ["assert_field_context", "assert_case_context", "assert_conversation_context", "get_guidance", "start_case", "submit_observation", "finish_case", "save_case_summary", "list_case_history", "get_management_options", "select_management_option", "PHOTO_RECEIVED", "selection_only", "field_action_performed"]) {
  if (!fieldServices.includes(required)) failures.push(`field-services.js missing Block 2 boundary: ${required}`);
}
for (const required of ["data-login-form", "data-map-mode=\"tap\"", "data-map-mode=\"center\"", "SYSTEM_ESTIMATED", "USER_CONFIRMED", "USER_OVERRIDDEN", "expected_planting_date"]) {
  if (!fieldApp.includes(required)) failures.push(`field-app.js missing workflow: ${required}`);
}
for (const required of ["เริ่มตรวจสุขภาพแปลง", "ถาม SP Assistant", "finish-inspection", "data-inspection-photo", "data-management-select", "save-decision", "data-case-open", "FIELD_SCOPED"]) {
  if (!fieldApp.includes(required)) failures.push(`field-app.js missing Block 2 workflow: ${required}`);
}
for (const prohibited of ["api.openai.com", "OPENAI_API_KEY", ".setItem(", ".getItem("]) {
  if (fieldApp.includes(prohibited)) failures.push(`field-app.js contains prohibited coupling: ${prohibited}`);
}
for (const required of [".login-view", ".map-mode-switch", ".map-canvas", ".field-bottom-nav", "@media (max-width:820px)", ":focus-visible", "prefers-reduced-motion"]) {
  if (!fieldStyles.includes(required)) failures.push(`field-shell.css missing reusable/mobile foundation: ${required}`);
}
for (const required of [".field-workspace-header", ".guidance-row", ".inspection-composer", ".camera-control", ".summary-overview", ".management-option", "@media (max-width:520px)"]) {
  if (!fieldStyles.includes(required)) failures.push(`field-shell.css missing Block 2 mobile workflow: ${required}`);
}
const expectedCmpLabels = ["ระยะคุมเลน", "ระยะคุมฆ่า", "ระยะหว่านปุ๋ยครั้งที่ 1", "ระยะพ่นยาหลังหว่านปุ๋ยครั้งที่ 1", "ระยะหว่านปุ๋ยครั้งที่ 2", "ระยะพ่นยาหลังหว่านปุ๋ยครั้งที่ 2", "ระยะหว่านปุ๋ยครั้งที่ 3", "ระยะพ่นยากัดหางปลาทู", "ระยะพ่นยารับรวง หรือข้าวก้ม"];
if (JSON.stringify(fieldConfig.stage_rules.map((rule) => rule.label_th)) !== JSON.stringify(expectedCmpLabels)) failures.push("field-config.json must expose the exact nine CMP presentation labels");
for (const domain of ["INSECT", "WEED", "DISEASE"]) if (!investigationConfig.flows.some((flow) => flow.domain === domain)) failures.push(`investigation-config.json missing generic flow: ${domain}`);
for (const status of ["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED", "UNAVAILABLE"]) if (!fieldCore.includes(status)) failures.push(`field-core.js missing guidance status: ${status}`);
if (investigationConfig.management_options.some((option) => option.option_class === "CHEMICAL_REVIEW")) failures.push("Block 2 local configuration must not force a chemical option");
if (!fieldServices.includes("ยังไม่มีข้อมูลเพียงพอให้ระบบชี้ทางเลือกเดียว")) failures.push("field-services.js missing bounded single-suggestion message");
for (const required of ["bounded-case-projection/v1", "REQUIRED_TO_DISTINGUISH", "SUFFICIENT_FOR_PROVISIONAL_IDENTIFICATION", "PROVISIONAL_IDENTIFICATION", "SEVERITY_EVIDENCE_INSUFFICIENT", "NO_ACTION_DETERMINATION_SUPPORTED", "MANAGEMENT_REMAINS_BLOCKED", "chemicalRecommendation: \"BLOCKED\"", "thresholds: []", "CONTROL FAILURE ≠ RESISTANCE", "governed-management-option-selection/v1", "NO_ACTION_CURRENTLY_JUSTIFIED", "authority-blocked", "commercialPreferenceUsed: false", "taskCreated: false", "automaticLearning: false"]) {
  if (!decisionGates.includes(required)) failures.push(`decision-gates.js missing scientific boundary: ${required}`);
}
for (const required of ["action-crop-target-use-authority/v1", "Economic Threshold", "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION", "REFERENCE_EVIDENCE_ONLY", "REGISTRATION_IDENTITY_MATCH_ONLY", "CHEMICAL_REVIEW_BLOCKED", "eligibleOptions: []", "completeCropTargetUseChains: 0", "preserve exact mixture identity"]) {
  if (!decisionAuthority.includes(required)) failures.push(`decision-authority.js missing authority boundary: ${required}`);
}
if (failures.length) throw new Error(`SP Assistant verification failed:\n${failures.join("\n")}`);
console.log("SP Assistant verified: isolated Field Workspace and legacy documents, governed details, no backend, Thai-first and mobile-safe");
