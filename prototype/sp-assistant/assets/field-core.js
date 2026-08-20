export const STAGE_PROVENANCE = Object.freeze({
  SYSTEM_ESTIMATED: "SYSTEM_ESTIMATED",
  USER_CONFIRMED: "USER_CONFIRMED",
  USER_OVERRIDDEN: "USER_OVERRIDDEN",
});

export const GUIDANCE_STATUSES = Object.freeze(["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED", "UNAVAILABLE"]);
export const CONVERSATION_SCOPES = Object.freeze({ FIELD_SCOPED: "FIELD_SCOPED", CASE_SCOPED: "CASE_SCOPED" });
export const CASE_STATUSES = Object.freeze({ OPEN: "OPEN", COMPLETED: "COMPLETED" });
export const PHOTO_EVIDENCE_BOUNDARY = "PHOTO_RECEIVED != PHOTO_ANALYZED != DIAGNOSIS_CONFIRMED";
export const APPLICATION_GUIDANCE_FIELDS = Object.freeze(["application_method", "equipment_type", "water_volume", "height", "speed", "swath_width", "flow_rate", "droplet_deposition_considerations", "weather_constraints", "source_provenance", "evidence_state"]);

export const MODEL_CONTRACTS = Object.freeze({
  User: ["user_id", "username", "display_name", "role", "session"],
  Field: ["field_id", "owner_user_id", "name", "polygon", "centroid", "area", "crop", "variety", "planting_method", "planting_date", "expected_planting_date", "current_crop_stage", "current_cmp_stage", "season_id", "stage_provenance", "created_at", "updated_at"],
  Season: ["season_id", "field_id", "crop", "started_at", "status"],
  Activity: ["activity_id", "field_id", "season_id", "activity_type", "occurred_at"],
  Case: ["case_id", "user_id", "field_id", "season_id", "guidance_item_id", "domain", "inspection_flow", "status", "created_at", "completed_at"],
  Observation: ["observation_id", "user_id", "field_id", "season_id", "case_id", "conversation_id", "question_id", "observation_type", "value", "response_mode", "uncertain", "provenance", "created_at"],
  Evidence: ["evidence_id", "user_id", "field_id", "season_id", "case_id", "observation_id", "conversation_id", "source_type", "received_at", "analysis_state", "user_provenance", "lineage", "boundary"],
  Conversation: ["conversation_id", "user_id", "field_id", "season_id", "case_id", "scope", "created_at"],
  Message: ["message_id", "user_id", "field_id", "season_id", "case_id", "conversation_id", "role", "content", "created_at"],
  GuidanceItem: ["guidance_item_id", "user_id", "field_id", "season_id", "domain", "subject_reference", "title", "short_instruction", "reason", "priority", "status", "source_rule_provenance", "inspection_flow", "created_at", "completed_at"],
  Recommendation: ["recommendation_id", "case_id", "status", "evidence_ids"],
  ManagementOption: ["management_option_id", "case_id", "label", "authority_state"],
  DecisionLog: ["decision_log_id", "user_id", "field_id", "season_id", "case_id", "management_option_id", "selected_at", "selection_source", "notes", "selection_only", "field_action_performed"],
  CaseSummary: ["case_summary_id", "user_id", "field_id", "season_id", "case_id", "observed_findings", "uncertainty", "need_for_action", "management_options", "application_guidance", "next_step", "evidence_provenance", "created_at"],
  FollowUp: ["follow_up_id", "case_id", "due_at", "status"],
  Outcome: ["outcome_id", "case_id", "recorded_at", "value"],
  Alert: ["alert_id", "field_id", "risk_context", "source_lineage", "created_at"],
  KnowledgeObject: ["knowledge_object_id", "kind", "version", "authority", "evidence_lineage"],
});

export const RELATIONSHIP_BACKBONE = Object.freeze({
  User: ["Field"],
  Field: ["Season", "Activity", "Alert", "Case"],
  Case: ["Observation", "Evidence", "Conversation", "Recommendation", "ManagementOption", "DecisionLog", "FollowUp", "Outcome"],
});

const MOCK_USERS = Object.freeze({
  SPA1: { user_id: "usr_spa1", username: "SPA1", display_name: "สมชาย", role: "FIELD_USER" },
  CA1: { user_id: "usr_ca1", username: "CA1", display_name: "เจ้าหน้าที่เกษตร", role: "CROP_ADVISOR" },
  AG1: { user_id: "usr_ag1", username: "AG1", display_name: "ผู้ดูแลระบบ", role: "AGRONOMIST" },
});

export function createStableId(prefix, cryptoProvider = globalThis.crypto) {
  const raw = cryptoProvider?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${raw}`;
}

export function resolveMockUser(username, password, now = new Date()) {
  const normalizedUsername = String(username ?? "").trim().toUpperCase();
  if (!normalizedUsername || !String(password ?? "")) throw new Error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
  const user = MOCK_USERS[normalizedUsername];
  if (!user) throw new Error("ไม่พบบัญชีต้นแบบนี้ กรุณาใช้ SPA1, CA1 หรือ AG1");
  return {
    ...user,
    session: {
      session_id: createStableId("session"),
      issued_at: now.toISOString(),
      authentication_mode: "PROTOTYPE_MOCK",
    },
  };
}

export function validateFieldName(rawName) {
  const original = String(rawName ?? "");
  const normalized = original.normalize("NFC").trim();
  if (!normalized) return { valid: false, value: normalized, error: "กรุณาตั้งชื่อแปลง" };
  if (normalized.length > 50) return { valid: false, value: normalized, error: "ชื่อแปลงต้องไม่เกิน 50 ตัวอักษร" };
  return { valid: true, value: normalized, changedBoundaryWhitespace: original !== original.trim(), error: null };
}

export function parseDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""))) throw new Error("วันที่ไม่ถูกต้อง");
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toDateOnly(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function differenceInCalendarDays(later, earlier) {
  const laterDate = typeof later === "string" ? parseDateOnly(later) : new Date(later);
  const earlierDate = typeof earlier === "string" ? parseDateOnly(earlier) : new Date(earlier);
  const laterUtc = Date.UTC(laterDate.getUTCFullYear(), laterDate.getUTCMonth(), laterDate.getUTCDate());
  const earlierUtc = Date.UTC(earlierDate.getUTCFullYear(), earlierDate.getUTCMonth(), earlierDate.getUTCDate());
  return Math.round((laterUtc - earlierUtc) / 86_400_000);
}

export function createEmptyWorkspace() {
  return { schema_version: 2, users: [], fields: [], seasons: [], activities: [], cases: [], observations: [], evidence: [], conversations: [], messages: [], guidance: [], recommendations: [], management_options: [], decision_logs: [], case_summaries: [], follow_ups: [], outcomes: [], alerts: [], knowledge_objects: [], active_user_id: null, selected_field_id: null, location_context: null };
}
