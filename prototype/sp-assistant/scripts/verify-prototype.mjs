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
const browserMapAdapter = await readFile(resolve(root, "assets", "browser-map-adapter.js"), "utf8");
const prototypeLogin = await readFile(resolve(root, "assets", "prototype-login.js"), "utf8");
const pilotAuth = await readFile(resolve(root, "pilot-auth.mjs"), "utf8");
const routeInteractions = await readFile(resolve(root, "assets", "route-interactions.js"), "utf8");
const serverAdapter = await readFile(resolve(root, "assets", "server-llm-adapter.js"), "utf8");
const serverWorkspaceAdapter = await readFile(resolve(root, "assets", "server-workspace-adapter.js"), "utf8");
const captureAdapter = await readFile(resolve(root, "assets", "investigation-capture-adapter.js"), "utf8");
const intelligenceRuntime = await readFile(resolve(root, "investigation-intelligence.mjs"), "utf8");
const guidanceRuntime = await readFile(resolve(root, "guidance-intelligence.mjs"), "utf8");
const guidanceDocumentation = await readFile(resolve(root, "GUIDANCE_INTELLIGENCE.md"), "utf8");
const visualEvidenceRuntime = await readFile(resolve(root, "visual-evidence.mjs"), "utf8");
const visualEvidenceDocumentation = await readFile(resolve(root, "VISUAL_EVIDENCE_RUNTIME.md"), "utf8");
const visualPerceptionRuntime = await readFile(resolve(root, "visual-perception.mjs"), "utf8");
const visualPerceptionDocumentation = await readFile(resolve(root, "VISUAL_PERCEPTION_ADAPTER.md"), "utf8");
const conversationRuntime = await readFile(resolve(root, "conversation-orchestrator.mjs"), "utf8");
const conversationDocumentation = await readFile(resolve(root, "GOVERNED_CONVERSATION_ORCHESTRATOR.md"), "utf8");
const managementRuntime = await readFile(resolve(root, "management-option-runtime.mjs"), "utf8");
const managementDocumentation = await readFile(resolve(root, "GOVERNED_MANAGEMENT_OPTION_RUNTIME.md"), "utf8");
const decisionActionOutcomeRuntime = await readFile(resolve(root, "decision-action-outcome-runtime.mjs"), "utf8");
const decisionActionOutcomeDocumentation = await readFile(resolve(root, "GOVERNED_DECISION_ACTION_OUTCOME_RUNTIME.md"), "utf8");
const followupReminderTimelineRuntime = await readFile(resolve(root, "followup-reminder-timeline-runtime.mjs"), "utf8");
const followupReminderTimelineDocumentation = await readFile(resolve(root, "GOVERNED_FOLLOWUP_REMINDER_TIMELINE_RUNTIME.md"), "utf8");
const spatialLocalPatternRuntime = await readFile(resolve(root, "spatial-local-pattern-runtime.mjs"), "utf8");
const spatialLocalPatternDocumentation = await readFile(resolve(root, "GOVERNED_SPATIAL_LOCAL_PATTERN_RUNTIME.md"), "utf8");
const learningKnowledgeGraphRuntime = await readFile(resolve(root, "learning-knowledge-graph-runtime.mjs"), "utf8");
const learningKnowledgeGraphDocumentation = await readFile(resolve(root, "GOVERNED_LEARNING_KNOWLEDGE_GRAPH_RUNTIME.md"), "utf8");
const candidateProvider = await readFile(resolve(root, "candidate-provider.mjs"), "utf8");
const candidateProviderPackage = JSON.parse(await readFile(resolve(root, "candidate-provider-package.json"), "utf8"));
const candidateProviderDocumentation = await readFile(resolve(root, "CANDIDATE_PROVIDER.md"), "utf8");
const pilotStore = await readFile(resolve(root, "pilot-store.mjs"), "utf8");
const serverRuntime = await readFile(resolve(root, "server.mjs"), "utf8");
const pilotHardeningRuntime = await readFile(resolve(root, "pilot-hardening-runtime.mjs"), "utf8");
const mobileFieldCaptureRuntime = await readFile(resolve(root, "mobile-field-capture-alpha.mjs"), "utf8");
const mobileFieldCaptureDocumentation = await readFile(resolve(root, "MOBILE_FIELD_CAPTURE_ALPHA.md"), "utf8");
const round0MobileChecklist = await readFile(resolve(root, "ROUND_0_MOBILE_FIELD_CAPTURE_CHECKLIST.md"), "utf8");
const pilotOperations = await readFile(resolve(root, "CONTROLLED_PILOT_OPERATIONS.md"), "utf8");
const pilotReadiness = JSON.parse(await readFile(resolve(root, "pilot-readiness-register.json"), "utf8"));
const investigationConfig = JSON.parse(await readFile(resolve(root, "assets", "investigation-config.json"), "utf8"));
const fieldConfig = JSON.parse(await readFile(resolve(root, "assets", "field-config.json"), "utf8"));
const failures = [];

for (const required of ["PILOT_HARDENING_RUNTIME_VERSION","PILOT_SCHEMA_VERSION","validatePilotConfiguration","preparePilotSchema","PilotHardeningService","CONTROLLED_PILOT_READY_CANDIDATE","PILOT_BLOCKED","REAL_FIELD_VALIDATION_NOT_RUN","RETENTION_POLICY_NOT_ESTABLISHED","SINGLE_PROCESS_SQLITE_LIMITATION"]) if (!pilotHardeningRuntime.includes(required)) failures.push(`pilot-hardening-runtime.mjs missing Step J contract: ${required}`);
for (const required of ["PILOT_PROFILE","PILOT_ALLOW_LAN","PILOT_AUTH_PASSWORD","/health","/readiness","Backup","restore","Incidents","REAL_FIELD_VALIDATION","NOT_RUN","not Production Certified","one application process"]) if (!pilotOperations.includes(required)) failures.push(`CONTROLLED_PILOT_OPERATIONS.md missing operator contract: ${required}`);
for (const required of ["/api/pilot/verified-backups","/api/pilot/restore-verifications","/api/pilot/validation-records","/api/pilot/operational-audit","/api/pilot/debt-register","FEATURE_DISABLED","CSRF_REJECTED","x-correlation-id","exportUser"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Step J API hardening: ${required}`);
if (pilotReadiness.real_field_validation !== "NOT_RUN" || pilotReadiness.production_certified !== false || pilotReadiness.readiness_gates.length < 19 || pilotReadiness.blocking_stop_conditions.length < 11) failures.push("pilot-readiness-register.json overclaims readiness or omits governed gates/stops");
for (const required of ["FIELD_CAPTURE_ALPHA","FIELD_CAPTURE_ALPHA_FEATURE_FLAGS","capture_only","public_base_url","secure_cookie","governed_learning_signals"]) if (!pilotHardeningRuntime.includes(required)) failures.push(`pilot-hardening-runtime.mjs missing M0A contract: ${required}`);
for (const required of ["UNANSWERED_QUESTION","INTERPRETATION_GAP","MISSING_EVIDENCE","USER_CORRECTION","FAILED_CONTROL_REPORT_CANDIDATE","PRODUCT_QUESTION","ACTIVE_INGREDIENT_QUESTION","MISSING_CANDIDATE","MISSING_MANAGEMENT_RELATIONSHIP","USEFUL_COMPLETED_CASE","learning_signal_is_evidence:false","automatic_promotion:false"]) if (!mobileFieldCaptureRuntime.includes(required)) failures.push(`mobile-field-capture-alpha.mjs missing bounded signal contract: ${required}`);
for (const required of ["OpenAI","server remains authoritative","A signal is never Evidence","No public deployment","Real field validation"]) if (!mobileFieldCaptureDocumentation.includes(required)) failures.push(`MOBILE_FIELD_CAPTURE_ALPHA.md missing boundary: ${required}`);
for (const required of ["360", "second device", "ไม่รู้", "B1 visual evidence", "Controlled Pilot profile", "authoritative timeline"]) if (!round0MobileChecklist.includes(required)) failures.push(`ROUND_0_MOBILE_FIELD_CAPTURE_CHECKLIST.md missing walkthrough: ${required}`);
for (const required of ["name=\"login_id\"","capture=\"environment\" data-chat-photo","governedRuntime.captureStatement(text)","serverWorkspace.logout()","captureOnly()"] ) if (!fieldApp.includes(required)) failures.push(`field-app.js missing mobile capture workflow: ${required}`);
for (const required of ["overflow-x:hidden","safe-area-inset-bottom","min-height:44px"]) if (!fieldStyles.includes(required)) failures.push(`field-shell.css missing M0A mobile safety: ${required}`);

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
for (const required of ["field-shell.css?v=capture-adapter-1", "field-app.js?v=r2a1-1"]) {
  if (!html.includes(required)) failures.push(`index.html missing fixed-login cache key: ${required}`);
}
if (!fieldApp.includes('prototype-login.js?v=fixed-login-1')) failures.push("field-app.js missing prototype login presentation module");
if (!fieldApp.includes('route-interactions.js?v=login-route-fix-1')) failures.push("field-app.js missing scoped route interaction module");
if (!fieldApp.includes("document.body.dataset.currentRoute = route")) failures.push("field-app.js missing diagnostic current-route attribute");
if (fieldApp.includes("document.body.dataset.route = route")) failures.push("field-app.js must not expose body as a delegated data-route target");
if (!routeInteractions.includes("root.contains(routeTarget)")) failures.push("route interactions must reject targets outside #field-app");
const loginView = fieldApp.match(/function renderLogin\(\)[\s\S]*?function renderGps\(\)/)?.[0] ?? "";
for (const required of ['name="password"', 'type="password"', "เข้าสู่ระบบ", "สำหรับทดสอบภายใน"]) {
  if (!loginView.includes(required)) failures.push(`Login missing minimal access control: ${required}`);
}
for (const required of ['name="login_id"', 'autocomplete="username"', "ชื่อผู้ใช้"]) if (!loginView.includes(required)) failures.push(`Login missing multi-user control: ${required}`);
for (const prohibited of ["toggle-password", "forgot-password", "ลืมรหัสผ่าน", "aria-pressed"]) {
  if (loginView.includes(prohibited)) failures.push(`Login contains removed control: ${prohibited}`);
}
for (const required of ["resolvePrototypeAccess(identity", "identity.user_id", 'authentication_mode: "PROTOTYPE_INTERNAL_ACCESS"', 'nextRoute: "gps"', "state.active_user_id = user.user_id"]) {
  if (!prototypeLogin.includes(required)) failures.push(`prototype-login.js missing server-resolved identity presentation contract: ${required}`);
}
for (const required of ["createPilotCredentialRegistry", '[\"login_id\",\"password\"]', "selected?.password", "selected.enabled", "publicIdentity(selected)"]) {
  if (!pilotAuth.includes(required)) failures.push(`pilot-auth.mjs missing server-owned credential binding: ${required}`);
}
if (prototypeLogin.includes('submittedPassword !== "1234"') || prototypeLogin.includes("prototype-spa-001")) failures.push("prototype-login.js must not retain fixed local credential or identity authority");
for (const required of ["MODEL_CONTRACTS", "RELATIONSHIP_BACKBONE", "stage_provenance", "field_id", "decision_log_id"]) {
  if (!fieldCore.includes(required)) failures.push(`field-core.js missing contract: ${required}`);
}
for (const required of ["class FieldService", "class LocationService", "class MapService", "class StageService", "class GuidanceService", "class InvestigationService", "class EvidenceService", "class ConversationService", "class KnowledgeService", "class DecisionService", "class ExplanationService", "class LLMGateway"]) {
  if (!fieldServices.includes(required)) failures.push(`field-services.js missing service: ${required}`);
}
for (const required of ["api.open-meteo.com/v1/forecast", "temperature_2m", "weather_code", "wind_speed_10m", "OPEN_METEO", "LOCATION_REQUIRED", "ไม่ใช่เซนเซอร์ภายในแปลง"]) {
  if (!fieldServices.includes(required)) failures.push(`field-services.js missing real weather contract: ${required}`);
}
if (!fieldApp.includes('source: "FIELD_CENTROID"') || !fieldApp.includes("บริเวณแปลง · Open-Meteo")) failures.push("field-app.js must request and label field-centroid weather");
for(const required of ["const serverLLM = new ServerLLMAdapter()","new LLMGateway(serverLLM)","new GovernedSpaRuntime({workspace:serverWorkspace,llm:serverLLM})"])if(!fieldApp.includes(required))failures.push(`field-app.js missing governed server adapter: ${required}`);
for (const required of ["/api/assistant/chat", "MIGRATION_REQUIRED", "/api/pilot/conversation-turns", "createConfiguredVisualPerceptionProvider", "field_id", "season_id"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing governed provider or legacy migration boundary: ${required}`);
if (serverAdapter.includes("api.openai.com") || serverAdapter.includes("OPENAI_API_KEY")) failures.push("browser server adapter must not contain provider URL or key");
for (const required of ["assert_field_context", "assert_case_context", "assert_conversation_context", "get_guidance", "start_case", "submit_observation", "finish_case", "save_case_summary", "list_case_history", "get_management_options", "select_management_option", "PHOTO_RECEIVED", "selection_only", "field_action_performed"]) {
  if (!fieldServices.includes(required)) failures.push(`field-services.js missing Block 2 boundary: ${required}`);
}
for (const required of ["DRAFT_LOCAL","PENDING_SYNC","SYNCING","SYNCED","SYNC_FAILED","CONFLICT","ABANDONED","LOCAL_DRAFT_ONLY","NETWORK_ERROR","VERSION_CONFLICT","expected_revision","request_id","authoritative_bundle"]) if (!captureAdapter.includes(required)) failures.push(`investigation-capture-adapter.js missing capture contract: ${required}`);
for (const prohibited of ["diagnosis","probability","recommendation","api.openai.com","OPENAI_API_KEY"]) if (captureAdapter.toLowerCase().includes(prohibited.toLowerCase())) failures.push(`investigation-capture-adapter.js contains prohibited inference/provider coupling: ${prohibited}`);
for (const required of ["data-investigation-capture-form","open-investigation-capture","retry-investigation-sync","refresh-investigation-conflict","reapply-investigation-draft","SERVER-AUTHORITATIVE BUNDLE","Observation ≠ Interpretation"]) if (!fieldApp.includes(required)) failures.push(`field-app.js missing thin investigation capture UX: ${required}`);
for (const required of ["request_id","expected_revision","IDEMPOTENT_REPLAY","error_code:code","PATCH","/api/pilot/investigation-records"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing safe investigation write contract: ${required}`);
for (const required of ["AUTHORITATIVE_INVESTIGATION_BUNDLE_ONLY","candidate_ordering","STABLE_IDENTIFIER_ONLY_NO_RANK","compatibilityDimensions","REQUIRED_BUT_MISSING","SUFFICIENT_FOR_NARROWING","next_best_evidence","FIELD_EVIDENCE_EXHAUSTED","original_system_assessment_preserved","source_bundle_hash","rule_version","rule_authority","rule_review_state","rule_hash"]) if (!intelligenceRuntime.includes(required)) failures.push(`investigation-intelligence.mjs missing Step C contract: ${required}`);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/\bprobability\s*:/i,/\bdiagnosis\s*:/i,/\brecommendation\s*:/i,/\bproduct\s*:/i,/\bactive_ingredient\s*:/i,/\brate\s*:/i]) if (prohibited.test(intelligenceRuntime)) failures.push(`investigation-intelligence.mjs contains prohibited provider, inference, or management field: ${prohibited}`);
for (const required of ["GovernedCandidateProvider","validateCandidateProviderPackage","MISSING_CANDIDATE_RELATIONSHIP","CONTESTED_RELATIONSHIP","TEST_ONLY_FIXTURE cannot load in normal runtime","triggering_evidence_refs","knowledge_relationship_refs","content_hash"]) if (!candidateProvider.includes(required)) failures.push(`candidate-provider.mjs missing governed provider contract: ${required}`);
for (const required of ["Candidate Provider","Nomination is not support","stable concept ID","User hypotheses","TEST_ONLY_FIXTURE","OpenAI","Explicit non-goals"]) if (!candidateProviderDocumentation.includes(required)) failures.push(`CANDIDATE_PROVIDER.md missing boundary: ${required}`);
if (candidateProviderPackage.manifest?.authority !== "GOVERNED_KNOWLEDGE_RELATIONSHIP" || candidateProviderPackage.manifest?.review_state !== "DOMAIN_APPROVED") failures.push("candidate provider production manifest must be governed and domain approved");
if (!Array.isArray(candidateProviderPackage.nomination_rules) || !candidateProviderPackage.nomination_rules.length || !Array.isArray(candidateProviderPackage.comparison_rules) || !candidateProviderPackage.comparison_rules.length) failures.push("candidate provider package must contain sparse nomination and comparison relationships");
if (JSON.stringify(candidateProviderPackage).includes("TEST_ONLY_FIXTURE")) failures.push("production candidate provider package must not contain TEST_ONLY_FIXTURE knowledge");
for (const prohibited of ["api.openai.com","OPENAI_API_KEY","pesticide_selection","product_ranking","rank_score","probability"] ) if (JSON.stringify(candidateProviderPackage).toLowerCase().includes(prohibited.toLowerCase())) failures.push(`candidate provider package contains prohibited capability: ${prohibited}`);
for (const required of ["assessInvestigation","getInvestigationAssessmentHistory","reviewInvestigationAssessment"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Investigation Intelligence service: ${required}`);
for (const required of ["/api/pilot/investigation-assessment","/api/pilot/investigation-assessment-history","/api/pilot/investigation-assessment-reviews"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Investigation Intelligence API: ${required}`);
for (const required of ["GUIDANCE_ENGINE_VERSION","EVIDENCE_COMPLETION","NO_ADDITIONAL_INSPECTION","ROOT_INSPECTION","INVESTIGATION_NEXT_BEST_EVIDENCE","ACTIVE_CASE_FOLLOW_UP","FIELD_EVIDENCE_EXHAUSTED","TEST_ONLY_FIXTURE cannot load in normal runtime","governed_guidance_items","governed_guidance_transitions","context_hash","semantic_key","completion_creates_evidence:false","openai_generation:false"]) if (!guidanceRuntime.includes(required)) failures.push(`guidance-intelligence.mjs missing Step D contract: ${required}`);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/fetch\s*\(/i,/\bscore\s*:/i,/\brank\s*:/i,/\bproduct\s*:/i,/\brate\s*:/i]) if (prohibited.test(guidanceRuntime)) failures.push(`guidance-intelligence.mjs contains prohibited provider, scoring, or management coupling: ${prohibited}`);
for (const required of ["getCurrentGovernedGuidance","getGovernedGuidanceHistory","transitionGovernedGuidance","getGovernedGuidanceDiagnostics"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Guidance Intelligence service: ${required}`);
for (const required of ["/api/pilot/guidance","/api/pilot/guidance-history","/api/pilot/guidance-actions","/api/pilot/guidance-diagnostics"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Guidance Intelligence API: ${required}`);
for (const required of ["Guidance is not Investigation","Guidance is not Evidence","Guidance is not Management","Guidance is not a Reminder","Guidance is not Diagnosis","Selection order","Stop conditions","Authenticated APIs","Explicit non-goals"]) if (!guidanceDocumentation.includes(required)) failures.push(`GUIDANCE_INTELLIGENCE.md missing governed boundary: ${required}`);
for (const required of ["VISUAL_EVIDENCE_RUNTIME_VERSION","VE0_RAW_IMAGE_ONLY","VE4_FIELD_LINKED_REVIEWED_VISUAL_EVIDENCE","qualityDimensions","observabilityStates","SEARCHED_NOT_FOUND requires an assessable appropriate view","VISUAL_VOCABULARY_GAP","TEST_ONLY_VISUAL_PERCEPTION_PROVIDER cannot load in normal runtime","scientific_amplification:false","training_eligible:false","raw_image_changes_candidate_state:false","governed_guidance_items","MORPHOLOGY_EVIDENCE"]) if (!visualEvidenceRuntime.includes(required)) failures.push(`visual-evidence.mjs missing Step B1 contract: ${required}`);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/fetch\s*\(/i,/\bquality_score\b/i,/\bprobability\s*:/i,/\bproduct\s*:/i,/\brate\s*:/i]) if (prohibited.test(visualEvidenceRuntime)) failures.push(`visual-evidence.mjs contains prohibited perception, scoring, or management coupling: ${prohibited}`);
for (const required of ["createImageEvidence","getImageEvidence","getVisualEvidenceBundle","addVisualAssessment","reviewVisualObservation","getNextVisualRequest"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Visual Evidence service: ${required}`);
for (const required of ["/api/pilot/visual-evidence","/api/pilot/visual-evidence-bundle","/api/pilot/visual-evidence-assessments","/api/pilot/visual-evidence-reviews","/api/pilot/visual-evidence-request"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Visual Evidence API: ${required}`);
for (const required of ["Image is not Diagnosis","Quality versus observability","Visible features and vocabulary","VE maturity and review lifecycle","Affected versus normal","Step D integration","Step C invalidation","TRAINING_ELIGIBLE","Perception provider boundary","Explicit non-goals"]) if (!visualEvidenceDocumentation.includes(required)) failures.push(`VISUAL_EVIDENCE_RUNTIME.md missing governed boundary: ${required}`);
for (const required of ["VISUAL_PERCEPTION_RUNTIME_VERSION","class VisualPerceptionProvider","class ManualStructuredVisualPerceptionProvider","class OpenAIVisualPerceptionProvider","TEST_ONLY_VISUAL_PERCEPTION_PROVIDER cannot load in normal runtime","visual_perception_requests","visual_perception_results","PERCEPTION_UNAVAILABLE","PROVIDER_POLICY_REJECTION","candidate_blind: true","automatic_on_upload: false","store: false","strict: true","IMAGE_FRAME_ONLY","proposal_is_investigation_evidence:false","training_eligible:false"]) if (!visualPerceptionRuntime.includes(required)) failures.push(`visual-perception.mjs missing Step B2 contract: ${required}`);
for (const required of ["requestVisualPerception","getVisualPerceptionResult","getVisualPerceptionHistory","getVisualPerceptionHealth"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Visual Perception service: ${required}`);
for (const required of ["/api/pilot/visual-perception","/api/pilot/visual-perception-history","/api/pilot/visual-perception-health","createConfiguredVisualPerceptionProvider"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Visual Perception API or provider boundary: ${required}`);
for (const required of ["Purpose and authority boundary","B1 versus B2 responsibility","Provider interface and types","Structured proposal contract","Allowed and forbidden outputs","Candidate-blind and minimum-context behavior","Request lifecycle, immutability, and idempotency","Failure handling and stop conditions","Human review, Step C, and Step D","Authenticated API and diagnostics","Explicit non-goals"]) if (!visualPerceptionDocumentation.includes(required)) failures.push(`VISUAL_PERCEPTION_ADAPTER.md missing governed boundary: ${required}`);
if (fieldApp.includes("visual-perception") || serverAdapter.includes("visual-perception")) failures.push("browser runtime must not directly invoke governed visual perception");
for (const required of ["CONVERSATION_ORCHESTRATOR_VERSION","class GovernedConversationOrchestrator","governed_conversations","governed_conversation_turns","FIELD_OBSERVATION","USER_HYPOTHESIS","MANAGEMENT_QUERY","DEEPER_WATER_CONTEXT","CONVERSATION_UNAVAILABLE","SERVER_PERSISTED_NON_EVIDENCE","REQUEST_EXPERT_REVIEW","NO_ADDITIONAL_ACTION","provider_scientific_authority:false","store:false","strict:true"]) if (!conversationRuntime.includes(required)) failures.push(`conversation-orchestrator.mjs missing Step E contract: ${required}`);
for (const prohibited of [/\bprobability\s*:/i,/\bdiagnosis\s*:/i,/\btreatment\s*:/i,/\bpesticide\s*:/i,/\bproduct\s*:/i,/\bdose\s*:/i,/\brate\s*:/i]) if (prohibited.test(conversationRuntime)) failures.push(`conversation-orchestrator.mjs contains prohibited scientific or management output field: ${prohibited}`);
for (const required of ["orchestrateConversationTurn","listGovernedConversations","getGovernedConversationHistory","rebuildGovernedConversationContext"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Governed Conversation service: ${required}`);
for (const required of ["/api/pilot/conversation-turns","/api/pilot/conversations","/api/pilot/conversation-history","/api/pilot/conversation-context","MIGRATION_REQUIRED"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing governed conversation API or legacy boundary: ${required}`);
for (const required of ["Purpose and product boundary","Server memory versus provider memory","Context resolution","Authoritative Context Package","Ask-the-system-first behavior","Intent and fact extraction","One answer, multiple governed evidence records","User hypotheses","Step C and Step D integration","B1/B2 integration","Provider and secret boundary","Failure and degraded mode","Legacy transition and UI preservation","Non-goals"]) if (!conversationDocumentation.includes(required)) failures.push(`GOVERNED_CONVERSATION_ORCHESTRATOR.md missing governed boundary: ${required}`);
if (!serverAdapter.includes("/api/pilot/conversation-turns") || !serverAdapter.includes("/api/pilot/conversations")) failures.push("browser adapter must use and resume governed server conversation memory");
if (serverAdapter.includes("/api/assistant/chat")) failures.push("browser adapter must not use the legacy free-form field chat endpoint");
for (const required of ["MANAGEMENT_OPTION_ENGINE_VERSION","NEED_FOR_ACTION_MODEL_VERSION","MANAGEMENT_SUITABILITY_MODEL_VERSION","SUFFICIENT_FOR_MANAGEMENT_OPTION_REVIEW","CONTINUE_MONITORING","CULTURAL_MANAGEMENT","MECHANICAL_MANAGEMENT","BIOLOGICAL_MANAGEMENT","CHEMICAL_REVIEW","EXPERT_REVIEW","NO_ACTION_CURRENTLY_JUSTIFIED","SUPPORTED_FOR_REVIEW","BLOCKED_BY_AUTHORITY","TEST_ONLY_FIXTURE cannot load in normal runtime","governed_management_reviews","governed_management_options","presentation_is_ranking:false","human_review_can_waive: false","resistance_inferred:false","field_action_created:false"]) if (!managementRuntime.includes(required)) failures.push(`management-option-runtime.mjs missing Step F1 contract: ${required}`);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/fetch\s*\(/i,/\bscore\s*:/i,/\brank\s*:/i,/\bactive_ingredient\s*:/i,/\bproduct\s*:/i,/\brate\s*:/i,/\bdose\s*:/i]) if (prohibited.test(managementRuntime)) failures.push(`management-option-runtime.mjs contains prohibited provider, ranking, or treatment field: ${prohibited}`);
for (const required of ["assessManagementOptions","getCurrentManagementReview","getManagementReviewHistory","getManagementReviewContext"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Management Option service: ${required}`);
for (const required of ["/api/pilot/management-options","/api/pilot/management-option-history","/api/pilot/management-review-context"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Management Option API: ${required}`);
for (const required of ["Purpose and authority boundary","Step C and Need-for-Action gate","Management Suitability runtime","Chemical two-key gate and Thai authority","Persistence, provenance, invalidation, and history","Step D, Step E, Field Action, and Human Review","Authenticated APIs","Explicit non-goals"]) if (!managementDocumentation.includes(required)) failures.push(`GOVERNED_MANAGEMENT_OPTION_RUNTIME.md missing governed boundary: ${required}`);
for (const required of ["getManagementOptions","getManagementOptionHistory","getManagementReviewContext"]) if (!serverWorkspaceAdapter.includes(required)) failures.push(`server-workspace-adapter.js missing Management Option read adapter: ${required}`);
for (const required of ["DECISION_ACTION_OUTCOME_ENGINE_VERSION","HUMAN_DECISION_SCHEMA_VERSION","MANAGEMENT_ACTION_SCHEMA_VERSION","OUTCOME_OBSERVATION_SCHEMA_VERSION","OUTCOME_REVIEW_SCHEMA_VERSION","SELECT_MANAGEMENT_OPTION","CONTINUE_MONITORING","NO_ACTION_CURRENTLY","REQUEST_EXPERT_REVIEW","CANCEL_PRIOR_DECISION","CONFIRMED","REVIEW_REQUIRED","SUPERSEDED","PLANNED","PERFORMED","T0","T1","T2","SUPPORTED","COMPARISON_LIMITED","NOT_COMPARABLE","UNKNOWN","governed_human_decisions","governed_management_actions","governed_outcome_observations","governed_outcome_comparisons","governed_outcome_reviews","field-action-handoff/v1","system_recommendation:false","efficacy_percentage:null","causal_effect:null","resistance:null","automatic_learning:false"]) if (!decisionActionOutcomeRuntime.includes(required)) failures.push(`decision-action-outcome-runtime.mjs missing Step F2 contract: ${required}`);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/fetch\s*\(/i,/efficacy_percentage:\s*(?!null)/i,/causal_effect:\s*(?!null)/i,/resistance:\s*(?!null)/i]) if (prohibited.test(decisionActionOutcomeRuntime)) failures.push(`decision-action-outcome-runtime.mjs contains prohibited provider or inferred conclusion: ${prohibited}`);
for (const required of ["createHumanDecision","getHumanDecisionHistory","createManagementAction","getManagementActionHistory","createOutcomeObservation","createOutcomeComparison","getGovernedOutcomeReview","getGovernedOutcomeReviewHistory","getDecisionActionOutcomeContext"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Decision Action Outcome service: ${required}`);
for (const required of ["/api/pilot/human-decisions","/api/pilot/human-decision-history","/api/pilot/management-actions","/api/pilot/management-action-history","/api/pilot/outcome-observations","/api/pilot/outcome-comparisons","/api/pilot/outcome-review","/api/pilot/outcome-review-history","/api/pilot/decision-action-outcome-context"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Step F2 API: ${required}`);
for (const required of ["Purpose and authority boundary","Human Selection and immutable Decision Snapshot","Management Action and historical facts","Outcome Observation, T0/T1/T2, and comparison","Persistence, provenance, history, and cross-device memory","Step E conversation integration","Authenticated APIs","Explicit non-goals"]) if (!decisionActionOutcomeDocumentation.includes(required)) failures.push(`GOVERNED_DECISION_ACTION_OUTCOME_RUNTIME.md missing governed boundary: ${required}`);
for (const required of ["createHumanDecision","getHumanDecisionHistory","createManagementAction","getManagementActionHistory","createOutcomeObservation","createOutcomeComparison","getOutcomeReview","getDecisionActionOutcomeContext"]) if (!serverWorkspaceAdapter.includes(required)) failures.push(`server-workspace-adapter.js missing Step F2 adapter: ${required}`);
for (const required of ["MANAGEMENT_SELECTION","ACTION_CONFIRMATION","OUTCOME_REPORT","server_explicit_f2_intent","CONFIRM_MANAGEMENT_DECISION","RECORD_MANAGEMENT_ACTION","RECORD_OUTCOME","decisionActionOutcomeService","performed_action_requires_explicit_timestamp:true","outcome_is_not_efficacy:true"]) if (!conversationRuntime.includes(required)) failures.push(`conversation-orchestrator.mjs missing Step F2 integration: ${required}`);
for (const required of ["FOLLOWUP_REMINDER_TIMELINE_ENGINE_VERSION","FOLLOWUP_PLAN_SCHEMA_VERSION","REMINDER_SCHEMA_VERSION","TIMELINE_SCHEMA_VERSION","EXACT_TIME","TIME_WINDOW","EVENT_RELATIVE","UNSCHEDULED","TIMING_NOT_ESTABLISHED","HUMAN_AUTHORED","SCHEDULED","DUE","ACKNOWLEDGED","IN_PROGRESS","COMPLETED","DISMISSED","CANCELLED","EXPIRED","SUPERSEDED","governed_follow_up_plans","governed_reminders","notificationEligibility","SERVER_AUTHORITATIVE_TIMELINE","delivery_attempted:false","case_resolved:false","evidence_created:false","outcome_created:false"]) if (!followupReminderTimelineRuntime.includes(required)) failures.push(`followup-reminder-timeline-runtime.mjs missing Step G contract: ${required}`);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/fetch\s*\(/i,/external_push/i,/sms_provider/i,/email_provider/i,/automatic_case_resolution\s*:\s*true/i]) if (prohibited.test(followupReminderTimelineRuntime)) failures.push(`followup-reminder-timeline-runtime.mjs contains prohibited provider, delivery, or resolution capability: ${prohibited}`);
for (const required of ["createGovernedFollowUpPlan","getGovernedFollowUpPlans","getGovernedFollowUpHistory","createGovernedReminder","actOnGovernedReminder","getGovernedReminderHistory","getDueGovernedReminders","getNotificationEligibility","getAuthoritativeTimeline","getFollowUpReminderContext"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Step G service: ${required}`);
for (const required of ["/api/pilot/follow-up-plans","/api/pilot/follow-up-history","/api/pilot/reminders","/api/pilot/reminder-actions","/api/pilot/reminder-history","/api/pilot/reminder-due","/api/pilot/timeline","/api/pilot/follow-up-reminder-context"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Step G API: ${required}`);
for (const required of ["createFollowUpPlan","getFollowUpPlans","getFollowUpHistory","createReminder","actOnReminder","getReminders","getReminderHistory","getDueReminders","getAuthoritativeTimeline","getFollowUpReminderContext"]) if (!serverWorkspaceAdapter.includes(required)) failures.push(`server-workspace-adapter.js missing Step G adapter: ${required}`);
for (const required of ["FOLLOW_UP_SCHEDULING","REMINDER_ACTION","server_explicit_g_intent","SCHEDULE_FOLLOW_UP","UPDATE_REMINDER","followupReminderService","timing_must_be_explicit_or_governed:true","reminder_completion_is_not_outcome:true"]) if (!conversationRuntime.includes(required)) failures.push(`conversation-orchestrator.mjs missing Step G integration: ${required}`);
for (const required of ["Purpose and authority boundary","A10 Follow-up Plan integration","Timing authority and modes","Reminder lifecycle and notification boundary","Authoritative timeline","Step E conversation integration","Persistence, ownership, and cross-device reconstruction","Authenticated APIs","Explicit non-goals"]) if (!followupReminderTimelineDocumentation.includes(required)) failures.push(`GOVERNED_FOLLOWUP_REMINDER_TIMELINE_RUNTIME.md missing governed boundary: ${required}`);
for (const required of ["SPATIAL_LOCAL_PATTERN_ENGINE_VERSION","CROSS_CASE_COMPARISON_SCHEMA_VERSION","LOCAL_PATTERN_CANDIDATE_SCHEMA_VERSION","LOCAL_PATTERN_ADJUDICATION_SCHEMA_VERSION","COMPARABLE","PARTIALLY_COMPARABLE","NOT_COMPARABLE","INSUFFICIENT_INFORMATION","NEEDS_HUMAN_REVIEW","SUFFICIENT_FOR_FURTHER_REVIEW","DEFERRED_PENDING_EVIDENCE","NEEDS_EXPERT_REVIEW","INSUFFICIENT_EVIDENCE","CONFLICTING_EVIDENCE","STALE_REVIEW_REQUIRED","METHOD_REQUIRED_BEFORE_STRONGER_INFERENCE","SAME_AUTHENTICATED_USER_ONLY","official_outbreak_status:\"NOT_EVALUATED\"","hidden_weighting:false","comparability_score:null","sufficiency_score:null","automatic_learning:false","governed_cross_case_comparisons","governed_local_pattern_candidates","governed_local_pattern_adjudications"]) if (!spatialLocalPatternRuntime.includes(required)) failures.push(`spatial-local-pattern-runtime.mjs missing Step H contract: ${required}`);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/fetch\s*\(/i,/OUTBREAK_CONFIRMED/i,/HIGH_RISK_AREA/i,/hotspot:\s*(?!null)/i,/risk_probability:\s*(?!null)/i,/efficacy_claim:\s*(?!null)/i,/resistance_claim:\s*(?!null)/i]) if (prohibited.test(spatialLocalPatternRuntime)) failures.push(`spatial-local-pattern-runtime.mjs contains prohibited provider or inference: ${prohibited}`);
for (const required of ["createCrossCaseComparison","getCrossCaseComparisons","createLocalPatternCandidate","getLocalPatternCandidates","createLocalPatternAdjudication","getLocalPatternAdjudications","getLocalPatternContext","getLocalPatternGaps","getSpatialPatternProjection"]) if (!pilotStore.includes(required)) failures.push(`pilot-store.mjs missing Step H service: ${required}`);
for (const required of ["/api/pilot/cross-case-comparisons","/api/pilot/local-pattern-candidates","/api/pilot/local-pattern-adjudications","/api/pilot/local-pattern-context","/api/pilot/local-pattern-gaps","/api/pilot/spatial-pattern-projection"]) if (!serverRuntime.includes(required)) failures.push(`server.mjs missing Step H API: ${required}`);
for (const required of ["createCrossCaseComparison","getCrossCaseComparisons","createLocalPatternCandidate","getLocalPatternCandidates","createLocalPatternAdjudication","getLocalPatternContext","getLocalPatternGaps","getSpatialPatternProjection"]) if (!serverWorkspaceAdapter.includes(required)) failures.push(`server-workspace-adapter.js missing Step H adapter: ${required}`);
for (const required of ["Server authority and history","Comparison and Candidate boundaries","Evidence sufficiency and adjudication","Spatial, privacy, and denominator boundaries","Step D, E, G, and I boundaries","APIs"]) if (!spatialLocalPatternDocumentation.includes(required)) failures.push(`GOVERNED_SPATIAL_LOCAL_PATTERN_RUNTIME.md missing governed boundary: ${required}`);
for (const required of ["LEARNING_KNOWLEDGE_GRAPH_ENGINE_VERSION","LEARNING_NOMINATION_SCHEMA_VERSION","REVIEWED_CASE_BUNDLE_SCHEMA_VERSION","KNOWLEDGE_ASSERTION_CANDIDATE_SCHEMA_VERSION","KNOWLEDGE_PROMOTION_SCHEMA_VERSION","KNOWLEDGE_GRAPH_SCHEMA_VERSION","THAI_LANGUAGE_MAPPING_GAP","FIELD_PATTERN_CANDIDATE","UNEXPECTED_OUTCOME","WORKING_KNOWLEDGE","CASE_EVIDENCE","FIELD_DERIVED_LOCAL_KNOWLEDGE","SCIENTIFIC_AUTHORITY","REGULATORY_AUTHORITY","MANUFACTURER_COMMERCIAL_SOURCE","IDENTITY_RESOLVED","INDEPENDENCE_REVIEWED","CORRECTIONS_CURRENT","CONFLICTS_WITH","STALE_REVIEW_REQUIRED","training_eligible:false","canonical_knowledge_changed:false","candidate_provider_changed:false","confidence_percentage:null","governed_learning_nominations","governed_reviewed_case_bundles","governed_knowledge_assertion_candidates","governed_knowledge_promotion_reviews"]) if (!learningKnowledgeGraphRuntime.includes(required)) failures.push("learning-knowledge-graph-runtime.mjs missing Step I contract: "+required);
for (const prohibited of [/api\.openai\.com/i,/OPENAI_API_KEY/i,/fetch\s*\(/i,/automatic_learning\s*:\s*true/i,/training_eligible\s*:\s*true/i,/canonical_knowledge_changed\s*:\s*true/i,/candidate_provider_changed\s*:\s*true/i,/confidence_percentage\s*:\s*(?!null)/i]) if (prohibited.test(learningKnowledgeGraphRuntime)) failures.push("learning-knowledge-graph-runtime.mjs contains prohibited learning or provider capability: "+prohibited);
for (const required of ["createLearningNomination","getLearningNominations","getKnowledgeGaps","getKnowledgeWorkQueue","createReviewedCaseBundle","getReviewedCaseBundles","createKnowledgeAssertionCandidate","getKnowledgeAssertionCandidates","createKnowledgePromotionReview","getKnowledgePromotionHistory","getUnifiedKnowledgeGraph","getUnifiedKnowledgeGraphContext"]) if (!pilotStore.includes(required)) failures.push("pilot-store.mjs missing Step I service: "+required);
for (const required of ["/api/pilot/learning-nominations","/api/pilot/learning-intent","/api/pilot/knowledge-gaps","/api/pilot/knowledge-work-queue","/api/pilot/reviewed-case-bundles","/api/pilot/knowledge-assertion-candidates","/api/pilot/knowledge-promotion-reviews","/api/pilot/knowledge-promotion-history","/api/pilot/knowledge-graph","/api/pilot/knowledge-graph-context"]) if (!serverRuntime.includes(required)) failures.push("server.mjs missing Step I API: "+required);
for (const required of ["createLearningNomination","getLearningNominations","getKnowledgeGaps","getKnowledgeWorkQueue","createReviewedCaseBundle","getReviewedCaseBundles","createKnowledgeAssertionCandidate","getKnowledgeAssertionCandidates","createKnowledgePromotionReview","getKnowledgePromotionHistory","getKnowledgeGraph","getKnowledgeGraphContext"]) if (!serverWorkspaceAdapter.includes(required)) failures.push("server-workspace-adapter.js missing Step I adapter: "+required);
for (const required of ["Purpose and permanent boundary","Server authority and lifecycle","Learning Inbox and nominations","Deterministic grouping and Knowledge Gap Register","Reviewed Case Bundle and independence","Entity, identity, and Assertion model","Source authority separation","Unified graph and conflicts","Promotion gates and Domain Review","Canonical, runtime, regulatory, and manufacturer boundaries","Step H, F2, and Step E integration","Future Working Knowledge and source extraction","Privacy, training, publication, and corrections","Timeline and authenticated APIs","Explicit non-goals"]) if (!learningKnowledgeGraphDocumentation.includes(required)) failures.push("GOVERNED_LEARNING_KNOWLEDGE_GRAPH_RUNTIME.md missing governed boundary: "+required);
for (const required of ["data-login-form", "data-map-mode=\"tap\"", "data-map-mode=\"center\"", "SYSTEM_ESTIMATED", "USER_CONFIRMED", "USER_OVERRIDDEN", "expected_planting_date"]) {
  if (!fieldApp.includes(required)) failures.push(`field-app.js missing workflow: ${required}`);
}
for (const required of ["createPreferredMapAdapter", "data-real-map", "ปิดพื้นที่", "zoom-in", "zoom-out"]) {
  if (!fieldApp.includes(required)) failures.push(`field-app.js missing real map workflow: ${required}`);
}
for (const required of ["tile.openstreetmap.org/{z}/{x}/{y}.png", "OpenStreetMap contributors", "__CPMOAKB_MAP_CONFIG", "projectWebMercator", "unprojectWebMercator"]) {
  if (!browserMapAdapter.includes(required)) failures.push(`browser-map-adapter.js missing map contract: ${required}`);
}
for (const required of ["GoogleSatelliteMapAdapter", "google-maps-key.local.txt", 'mapTypeId: "satellite"', "createPreferredMapAdapter"]) {
  if (!browserMapAdapter.includes(required)) failures.push(`browser-map-adapter.js missing Google Satellite contract: ${required}`);
}
if (!browserMapAdapter.includes("mountGoogleFieldPreview") || !fieldApp.includes("data-field-satellite-preview")) failures.push("field detail missing live satellite preview");
if (fieldApp.includes("(x - 0.5) * 0.012") || fieldApp.includes("draft.mapOffset")) failures.push("field-app.js still contains synthetic coordinate scaling");
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
console.log("SP Assistant verified: isolated Field Workspace and legacy documents, governed details, authenticated pilot storage, Thai-first and mobile-safe");
