import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = await readFile(resolve(root, "index.html"), "utf8");
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
const failures = [];

for (const required of [
  "SP Assistant", "chat-shell", "welcome-message", "สวัสดีครับ", "วันนี้พบอะไรในแปลง?",
  "เพิ่มรูปภาพ", "ข้อมูลแปลง", "เริ่มตรวจสอบ", "<noscript>",
  "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ", "../knowledge-explorer/rice-disease-corpus.html",
]) if (!html.includes(required)) failures.push(`index.html missing: ${required}`);

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
if (/<form\b[^>]*(?:action|method)=/i.test(html)) failures.push("forms must remain local and non-network-submittable");
if (!html.includes('<html lang="th">') || !html.includes('content="noindex,nofollow"')) failures.push("Thai-first or indexing boundary missing");
for (const required of ["field-app", "field-shell.css", "Field Intelligence Workspace", "type=\"module\""]) {
  if (!html.includes(required)) failures.push(`index.html missing field backbone: ${required}`);
}
for (const required of ["MODEL_CONTRACTS", "RELATIONSHIP_BACKBONE", "stage_provenance", "field_id", "decision_log_id"]) {
  if (!fieldCore.includes(required)) failures.push(`field-core.js missing contract: ${required}`);
}
for (const required of ["class FieldService", "class LocationService", "class MapService", "class StageService", "class GuidanceService", "class InvestigationService", "class EvidenceService", "class ConversationService", "class KnowledgeService", "class DecisionService", "class ExplanationService", "class LLMGateway"]) {
  if (!fieldServices.includes(required)) failures.push(`field-services.js missing service: ${required}`);
}
for (const required of ["data-login-form", "data-map-mode=\"tap\"", "data-map-mode=\"center\"", "SYSTEM_ESTIMATED", "USER_CONFIRMED", "USER_OVERRIDDEN", "expected_planting_date"]) {
  if (!fieldApp.includes(required)) failures.push(`field-app.js missing workflow: ${required}`);
}
for (const prohibited of ["api.openai.com", "OPENAI_API_KEY", ".setItem(", ".getItem("]) {
  if (fieldApp.includes(prohibited)) failures.push(`field-app.js contains prohibited coupling: ${prohibited}`);
}
for (const required of [".login-view", ".map-mode-switch", ".map-canvas", ".field-bottom-nav", "@media (max-width:820px)", ":focus-visible", "prefers-reduced-motion"]) {
  if (!fieldStyles.includes(required)) failures.push(`field-shell.css missing reusable/mobile foundation: ${required}`);
}
for (const required of ["bounded-case-projection/v1", "REQUIRED_TO_DISTINGUISH", "SUFFICIENT_FOR_PROVISIONAL_IDENTIFICATION", "PROVISIONAL_IDENTIFICATION", "SEVERITY_EVIDENCE_INSUFFICIENT", "NO_ACTION_DETERMINATION_SUPPORTED", "MANAGEMENT_REMAINS_BLOCKED", "chemicalRecommendation: \"BLOCKED\"", "thresholds: []", "CONTROL FAILURE ≠ RESISTANCE", "governed-management-option-selection/v1", "NO_ACTION_CURRENTLY_JUSTIFIED", "authority-blocked", "commercialPreferenceUsed: false", "taskCreated: false", "automaticLearning: false"]) {
  if (!decisionGates.includes(required)) failures.push(`decision-gates.js missing scientific boundary: ${required}`);
}
for (const required of ["action-crop-target-use-authority/v1", "Economic Threshold", "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION", "REFERENCE_EVIDENCE_ONLY", "REGISTRATION_IDENTITY_MATCH_ONLY", "CHEMICAL_REVIEW_BLOCKED", "eligibleOptions: []", "completeCropTargetUseChains: 0", "preserve exact mixture identity"]) {
  if (!decisionAuthority.includes(required)) failures.push(`decision-authority.js missing authority boundary: ${required}`);
}
if (failures.length) throw new Error(`SP Assistant verification failed:\n${failures.join("\n")}`);
console.log("SP Assistant verified: true chat, governed details, local images, no backend, Thai-first and mobile-safe");
