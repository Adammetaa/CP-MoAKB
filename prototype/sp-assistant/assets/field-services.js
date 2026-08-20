import {
  APPLICATION_GUIDANCE_FIELDS,
  CASE_STATUSES,
  CONVERSATION_SCOPES,
  GUIDANCE_STATUSES,
  PHOTO_EVIDENCE_BOUNDARY,
  STAGE_PROVENANCE,
  createEmptyWorkspace,
  createStableId,
  differenceInCalendarDays,
  toDateOnly,
  validateFieldName,
} from "./field-core.js?v=fixed-login-1";

export class WorkspaceRepository {
  constructor(storage, key = "cpmoakb.field-workspace.v1", onSave = null) { this.storage = storage; this.key = key; this.onSave = onSave; }
  load() {
    const raw = this.storage?.getItem?.(this.key);
    if (!raw) return createEmptyWorkspace();
    try {
      const saved = JSON.parse(raw);
      const fresh = createEmptyWorkspace();
      const merged = { ...fresh, ...saved, schema_version: fresh.schema_version };
      for (const key of Object.keys(fresh)) if (Array.isArray(fresh[key]) && !Array.isArray(merged[key])) merged[key] = [];
      return merged;
    } catch { return createEmptyWorkspace(); }
  }
  save(state, { sync = true } = {}) { this.storage?.setItem?.(this.key, JSON.stringify(state)); if (sync) this.onSave?.(state); return state; }
  import(state) { return this.save(state, { sync:false }); }
  clear() { this.storage?.removeItem?.(this.key); }
}

export class ContextService {
  constructor(repository) { this.repository = repository; }
  assert_field_context(context) {
    const state = this.repository.load();
    if (!context?.user_id || !context?.field_id || !context?.season_id) throw new Error("user_id, field_id and season_id are required");
    if (state.active_user_id && state.active_user_id !== context.user_id) throw new Error("active user context mismatch");
    const field = state.fields.find((item) => item.field_id === context.field_id);
    if (!field || field.owner_user_id !== context.user_id) throw new Error("field context is not available to this user");
    if (field.season_id !== context.season_id || !state.seasons.some((item) => item.season_id === context.season_id && item.field_id === context.field_id)) throw new Error("season context mismatch");
    return { state, field, season: state.seasons.find((item) => item.season_id === context.season_id) };
  }
  assert_case_context(context) {
    const checked = this.assert_field_context(context);
    if (!context.case_id) throw new Error("case_id is required");
    const caseRecord = checked.state.cases.find((item) => item.case_id === context.case_id);
    if (!caseRecord || caseRecord.user_id !== context.user_id || caseRecord.field_id !== context.field_id || caseRecord.season_id !== context.season_id) throw new Error("case context mismatch");
    return { ...checked, caseRecord };
  }
  assert_conversation_context(context) {
    const checked = this.assert_field_context(context);
    if (!context.conversation_id) throw new Error("conversation_id is required");
    const conversation = checked.state.conversations.find((item) => item.conversation_id === context.conversation_id);
    if (!conversation || conversation.user_id !== context.user_id || conversation.field_id !== context.field_id || conversation.season_id !== context.season_id) throw new Error("conversation context mismatch");
    if (context.case_id && conversation.case_id !== context.case_id) throw new Error("conversation case mismatch");
    return { ...checked, conversation };
  }
}

export class FieldService {
  constructor(repository, clock = () => new Date()) { this.repository = repository; this.clock = clock; }
  list_fields(ownerUserId) { return this.repository.load().fields.filter((field) => field.owner_user_id === ownerUserId); }
  get_field(fieldId, ownerUserId = null) { return this.repository.load().fields.find((field) => field.field_id === fieldId && (!ownerUserId || field.owner_user_id === ownerUserId)) ?? null; }
  create_field(input) {
    const state = this.repository.load();
    const name = validateFieldName(input.name);
    if (!name.valid) throw new Error(name.error);
    if (!input.owner_user_id) throw new Error("owner_user_id is required");
    if (!input.polygon?.coordinates?.[0]?.length || input.polygon.coordinates[0].length < 4) throw new Error("polygon requires at least three points");
    const now = this.clock().toISOString();
    const fieldId = createStableId("field"), seasonId = createStableId("season");
    const field = { field_id: fieldId, owner_user_id: input.owner_user_id, name: name.value, polygon: input.polygon, centroid: input.centroid, area: input.area, crop: input.crop ?? "rice", variety: input.variety ?? "", planting_method: input.planting_method ?? "", planting_date: input.planting_date ?? null, expected_planting_date: input.expected_planting_date ?? null, current_crop_stage: input.current_crop_stage ?? null, current_cmp_stage: input.current_cmp_stage ?? null, season_id: seasonId, stage_provenance: input.stage_provenance ?? STAGE_PROVENANCE.SYSTEM_ESTIMATED, created_at: now, updated_at: now };
    state.fields.push(field);
    state.seasons.push({ season_id: seasonId, field_id: fieldId, crop: field.crop, started_at: field.planting_date ?? field.expected_planting_date, status: field.expected_planting_date ? "PLANNED" : "ACTIVE" });
    state.activities.push({ activity_id: createStableId("activity"), field_id: fieldId, season_id: seasonId, activity_type: "FIELD_CREATED", occurred_at: now });
    state.selected_field_id = fieldId; this.repository.save(state); return field;
  }
  update_field(fieldId, patch) {
    const state = this.repository.load(), index = state.fields.findIndex((field) => field.field_id === fieldId);
    if (index < 0) throw new Error("ไม่พบแปลงที่ต้องการแก้ไข");
    const next = { ...state.fields[index], ...patch, field_id: state.fields[index].field_id, owner_user_id: state.fields[index].owner_user_id, updated_at: this.clock().toISOString() };
    if (patch.name !== undefined) { const checked = validateFieldName(patch.name); if (!checked.valid) throw new Error(checked.error); next.name = checked.value; }
    state.fields[index] = next; this.repository.save(state); return next;
  }
  delete_field(fieldId) {
    const state = this.repository.load(); state.fields = state.fields.filter((field) => field.field_id !== fieldId); state.seasons = state.seasons.filter((season) => season.field_id !== fieldId); state.activities = state.activities.filter((activity) => activity.field_id !== fieldId); if (state.selected_field_id === fieldId) state.selected_field_id = null; this.repository.save(state);
  }
  select_field(fieldId, ownerUserId = null) { const state = this.repository.load(); if (!state.fields.some((field) => field.field_id === fieldId && (!ownerUserId || field.owner_user_id === ownerUserId))) throw new Error("ไม่พบแปลง"); state.selected_field_id = fieldId; this.repository.save(state); }
}

export class LocationService {
  constructor(geolocation, repository) { this.geolocation = geolocation; this.repository = repository; }
  request_location() {
    if (!this.geolocation?.getCurrentPosition) return Promise.resolve({ status: "UNAVAILABLE", message: "อุปกรณ์นี้ไม่รองรับตำแหน่ง คุณยังใช้งานต่อได้" });
    return new Promise((resolve) => this.geolocation.getCurrentPosition((position) => { const context = { status: "AVAILABLE", latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, captured_at: new Date().toISOString() }; const state = this.repository.load(); state.location_context = context; this.repository.save(state); resolve(context); }, () => resolve({ status: "DENIED", message: "ไม่ได้รับสิทธิ์ตำแหน่ง คุณยังสร้างแปลงและใช้งานส่วนอื่นได้" }), { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 }));
  }
  get_current_location() { return this.repository.load().location_context; }
}

export class MapService {
  create_polygon(points) { if (!Array.isArray(points) || points.length < 3) throw new Error("ต้องมีอย่างน้อย 3 จุด"); const coordinates = points.map((point) => [Number(point.longitude), Number(point.latitude)]); const first = coordinates[0], last = coordinates.at(-1); if (first[0] !== last[0] || first[1] !== last[1]) coordinates.push([...first]); return { type: "Polygon", coordinates: [coordinates] }; }
  update_polygon(_polygon, points) { return this.create_polygon(points); }
  calculate_centroid(polygon) { const points = polygon.coordinates[0].slice(0, -1); return { latitude: points.reduce((sum, point) => sum + point[1], 0) / points.length, longitude: points.reduce((sum, point) => sum + point[0], 0) / points.length }; }
  calculate_area(polygon) { const points = polygon.coordinates[0], earthRadius = 6_371_008.8, radians = Math.PI / 180; let sphericalExcess = 0; for (let index = 0; index < points.length - 1; index += 1) { const [longitudeA, latitudeA] = points[index], [longitudeB, latitudeB] = points[index + 1]; sphericalExcess += (longitudeB - longitudeA) * radians * (2 + Math.sin(latitudeA * radians) + Math.sin(latitudeB * radians)); } const squareMeters = Math.abs(sphericalExcess * earthRadius * earthRadius / 2); return { square_meters: squareMeters, rai: squareMeters / 1600, hectares: squareMeters / 10000, method: "SPHERICAL_POLYGON", estimated: true }; }
}

export class StageService {
  constructor(configuration, clock = () => new Date()) { this.configuration = configuration; this.clock = clock; }
  calculate_crop_age(dateValue) { const days = differenceInCalendarDays(toDateOnly(this.clock()), dateValue); return days >= 0 ? { state: "PLANTED", crop_age_days: days, days_until_planting: 0 } : { state: "PLANNED", crop_age_days: null, days_until_planting: Math.abs(days) }; }
  calculate_crop_stage(dateValue) { const age = this.calculate_crop_age(dateValue), comparisonDay = age.state === "PLANNED" ? -age.days_until_planting : age.crop_age_days; const rule = this.configuration.stage_rules.find((item) => comparisonDay >= item.min_day && comparisonDay <= item.max_day) ?? this.configuration.stage_rules.at(-1); return { crop_stage: rule.crop_stage, crop_stage_label: rule.backend_label_th ?? rule.label_th, cmp_stage: rule.stage_id, cmp_stage_label: rule.label_th, provenance: STAGE_PROVENANCE.SYSTEM_ESTIMATED, model_version: this.configuration.version, basis: { date: dateValue, comparison_day: comparisonDay } }; }
  calculate_cmp_stage(dateValue) { return this.calculate_crop_stage(dateValue).cmp_stage; }
  override_crop_stage(estimate, cropStage, cmpStage, label) { return { ...estimate, crop_stage: cropStage, cmp_stage: cmpStage, cmp_stage_label: label, provenance: STAGE_PROVENANCE.USER_OVERRIDDEN }; }
  confirm_crop_stage(estimate) { return { ...estimate, provenance: STAGE_PROVENANCE.USER_CONFIRMED }; }
}

export class GuidanceService {
  constructor(repository, configuration, clock = () => new Date()) { this.repository = repository; this.configuration = configuration; this.clock = clock; this.context = new ContextService(repository); }
  get_guidance(context, inputs = {}) {
    const { state, field } = this.context.assert_field_context(context);
    const cmpStage = field.current_cmp_stage?.stage_id;
    const existing = state.guidance.filter((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id);
    const existingRules = new Set(existing.map((item) => item.rule_id));
    for (const rule of this.configuration.guidance_rules) {
      if (existingRules.has(rule.rule_id) || (rule.cmp_stages?.length && !rule.cmp_stages.includes(cmpStage))) continue;
      state.guidance.push({ guidance_item_id: createStableId("guidance"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, rule_id: rule.rule_id, domain: rule.domain, subject_reference: null, title: rule.title, short_instruction: rule.short_instruction, reason: rule.reason_template.replace("{cmp_stage}", field.current_cmp_stage?.label ?? cmpStage ?? "ระยะปัจจุบัน"), priority: rule.priority, status: GUIDANCE_STATUSES.includes(rule.status) ? rule.status : "PENDING", source_rule_provenance: rule.source_rule_provenance, inspection_flow: rule.inspection_flow, basis: { cmp_stage: cmpStage, crop_stage: field.current_crop_stage?.code ?? null, recent_activity_count: inputs.recent_activities?.length ?? 0, previous_case_count: inputs.previous_cases?.length ?? 0, weather_status: inputs.weather?.status ?? "UNAVAILABLE" }, created_at: this.clock().toISOString(), completed_at: null });
    }
    this.repository.save(state);
    return this.sort_guidance(state.guidance.filter((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id));
  }
  sort_guidance(items) { const order = { PENDING: 0, IN_PROGRESS: 1, UNAVAILABLE: 2, SKIPPED: 3, COMPLETED: 4 }; return [...items].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.priority - b.priority || a.created_at.localeCompare(b.created_at)); }
  update_status(context, guidanceItemId, status) { if (!GUIDANCE_STATUSES.includes(status)) throw new Error("invalid guidance status"); const { state } = this.context.assert_field_context(context); const item = state.guidance.find((entry) => entry.guidance_item_id === guidanceItemId && entry.user_id === context.user_id && entry.field_id === context.field_id && entry.season_id === context.season_id); if (!item) throw new Error("guidance item context mismatch"); item.status = status; item.completed_at = status === "COMPLETED" ? this.clock().toISOString() : null; this.repository.save(state); return item; }
  get_tip(context) { this.context.assert_field_context(context); return this.configuration.neutral_tips?.[0] ?? null; }
}

export class WeatherService {
  constructor({ fetcher = (...args) => globalThis.fetch(...args), clock = () => new Date(), timeout_ms = 8_000 } = {}) { this.fetcher = fetcher; this.clock = clock; this.timeout_ms = timeout_ms; }
  static describe_code(code) { const value = Number(code); if (value === 0) return { condition: "ท้องฟ้าแจ่มใส", icon: "☀️" }; if ([1,2].includes(value)) return { condition: "มีเมฆบางส่วน", icon: "🌤️" }; if (value === 3) return { condition: "เมฆมาก", icon: "☁️" }; if ([45,48].includes(value)) return { condition: "มีหมอก", icon: "🌫️" }; if ([51,53,55,56,57].includes(value)) return { condition: "ฝนปรอย", icon: "🌦️" }; if ([61,63,65,66,67,80,81,82].includes(value)) return { condition: "มีฝน", icon: "🌧️" }; if ([95,96,99].includes(value)) return { condition: "พายุฝนฟ้าคะนอง", icon: "⛈️" }; return { condition: "สภาพอากาศแปรปรวน", icon: "🌥️" }; }
  async get_weather(location) {
    if (!location || location.status !== "AVAILABLE" || !Number.isFinite(Number(location.latitude)) || !Number.isFinite(Number(location.longitude))) return { status: "UNAVAILABLE", reason: "LOCATION_REQUIRED" };
    const controller = globalThis.AbortController ? new AbortController() : null;
    const timeout = controller ? setTimeout(() => controller.abort(), this.timeout_ms) : null;
    try {
      const query = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), current: "temperature_2m,weather_code,wind_speed_10m,is_day,precipitation", timezone: "auto", wind_speed_unit: "kmh" });
      const response = await this.fetcher(`https://api.open-meteo.com/v1/forecast?${query}`, controller ? { signal: controller.signal } : undefined);
      if (!response.ok) throw new Error(`weather provider returned ${response.status}`);
      const data = await response.json(), current = data.current ?? {}, description = WeatherService.describe_code(current.weather_code);
      if (![current.temperature_2m, current.wind_speed_10m].every((value) => Number.isFinite(Number(value)))) throw new Error("weather provider response is incomplete");
      return { status: "AVAILABLE", temperature: Number(current.temperature_2m), condition: description.condition, icon: description.icon, wind_speed: Number(current.wind_speed_10m), unit: "กม./ชม.", precipitation: Number(current.precipitation ?? 0), is_day: Number(current.is_day ?? 1) === 1, observation_at: current.time ?? null, updated_at: this.clock().toISOString(), provider: "OPEN_METEO", timezone: data.timezone ?? null, latitude: Number(data.latitude ?? location.latitude), longitude: Number(data.longitude ?? location.longitude), target: { latitude: Number(location.latitude), longitude: Number(location.longitude), source: location.source ?? "LOCATION", field_id: location.field_id ?? null }, limitations: ["ข้อมูลจากแบบจำลองพยากรณ์ ไม่ใช่เซนเซอร์ภายในแปลง", "พิกัดกริดของผู้ให้บริการอาจอยู่ห่างจากพิกัดแปลง"] };
    } catch (error) { return { status: "UNAVAILABLE", reason: error?.name === "AbortError" ? "TIMEOUT" : "PROVIDER_ERROR", updated_at: this.clock().toISOString() }; }
    finally { if (timeout) clearTimeout(timeout); }
  }
}

export class InvestigationService {
  constructor(repository, configuration, clock = () => new Date()) { this.repository = repository; this.configuration = configuration; this.clock = clock; this.context = new ContextService(repository); }
  flow(flowId) { return this.configuration.flows.find((item) => item.flow_id === flowId) ?? null; }
  start_case(context, input = {}) {
    const { state } = this.context.assert_field_context(context), flow = this.flow(input.inspection_flow);
    if (!flow) throw new Error("inspection flow is unavailable");
    if (input.guidance_item_id) {
      const existing = state.cases.find((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id && item.guidance_item_id === input.guidance_item_id && item.status === CASE_STATUSES.OPEN);
      if (existing) return existing;
    }
    const record = { case_id: createStableId("case"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, guidance_item_id: input.guidance_item_id ?? null, domain: flow.domain, case_type: input.case_type ?? "GUIDED_INSPECTION", inspection_flow: flow.flow_id, status: CASE_STATUSES.OPEN, created_at: this.clock().toISOString(), completed_at: null };
    state.cases.push(record); this.repository.save(state); return record;
  }
  get_case(context) { return this.context.assert_case_context(context).caseRecord; }
  get_next_question(context) { const { state, caseRecord } = this.context.assert_case_context(context), flow = this.flow(caseRecord.inspection_flow); if (!flow) return null; const answered = new Set(state.observations.filter((item) => item.case_id === caseRecord.case_id).map((item) => item.question_id)); return flow.questions.find((question) => !answered.has(question.question_id)) ?? null; }
  submit_observation(context, value) {
    const { state, caseRecord } = this.context.assert_case_context(context); if (caseRecord.status !== CASE_STATUSES.OPEN) throw new Error("case is not open");
    const question = this.get_next_question(context); if (question && value.question_id !== question.question_id) throw new Error("question progression mismatch");
    const record = { observation_id: createStableId("observation"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, case_id: context.case_id, conversation_id: value.conversation_id ?? null, question_id: value.question_id, observation_type: value.observation_type ?? question?.observation_type ?? "USER_REPORTED", value: value.value, original_text: value.original_text ?? null, response_mode: value.response_mode ?? "SUGGESTION", uncertain: value.uncertain === true || value.value === "UNSURE", skipped: value.skipped === true, provenance: value.provenance ?? "USER_REPORTED", created_at: this.clock().toISOString() };
    state.observations.push(record); this.repository.save(state); return record;
  }
  finish_case(context) { const { state, caseRecord } = this.context.assert_case_context(context); caseRecord.status = CASE_STATUSES.COMPLETED; caseRecord.completed_at = this.clock().toISOString(); this.repository.save(state); return caseRecord; }
  get_case_summary(context) { const { state } = this.context.assert_case_context(context); return state.case_summaries.find((item) => item.case_id === context.case_id && item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id) ?? null; }
  save_case_summary(context, summary) { const { state } = this.context.assert_case_context(context); const existing = state.case_summaries.findIndex((item) => item.case_id === context.case_id); const record = { case_summary_id: existing >= 0 ? state.case_summaries[existing].case_summary_id : createStableId("summary"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, case_id: context.case_id, ...summary, created_at: existing >= 0 ? state.case_summaries[existing].created_at : this.clock().toISOString(), updated_at: this.clock().toISOString() }; if (existing >= 0) state.case_summaries[existing] = record; else state.case_summaries.push(record); this.repository.save(state); return record; }
  list_case_history(context) { const { state } = this.context.assert_field_context(context); return state.cases.filter((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id).map((caseRecord) => ({ ...caseRecord, summary: state.case_summaries.find((item) => item.case_id === caseRecord.case_id) ?? null, decision_log: state.decision_logs.find((item) => item.case_id === caseRecord.case_id) ?? null, follow_up: state.follow_ups.find((item) => item.case_id === caseRecord.case_id) ?? null })).sort((a, b) => b.created_at.localeCompare(a.created_at)); }
}

export class EvidenceService {
  constructor(repository, clock = () => new Date()) { this.repository = repository; this.clock = clock; this.context = new ContextService(repository); }
  add_evidence(context, record) {
    const checked = context.case_id ? this.context.assert_case_context(context) : this.context.assert_conversation_context(context), state = checked.state;
    if (record.observation_id && !state.observations.some((item) => item.observation_id === record.observation_id && item.case_id === context.case_id)) throw new Error("observation evidence context mismatch");
    if (context.conversation_id && !state.conversations.some((item) => item.conversation_id === context.conversation_id && item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id && (!context.case_id || item.case_id === context.case_id))) throw new Error("conversation evidence context mismatch");
    const item = { evidence_id: createStableId("evidence"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, case_id: context.case_id ?? null, observation_id: record.observation_id ?? null, conversation_id: context.conversation_id ?? record.conversation_id ?? null, source_type: record.source_type ?? "USER_UPLOAD", file_name: record.file_name ?? null, storage_key:record.storage_key ?? null, media_type: record.media_type ?? null, size_bytes: record.size_bytes ?? null, received_at: this.clock().toISOString(), analysis_state: "PHOTO_RECEIVED", processing_status:"NOT_ANALYZED", user_provenance: record.user_provenance ?? "USER_SUBMITTED", lineage: record.lineage ?? ["USER_SUBMITTED_MEDIA"], boundary: PHOTO_EVIDENCE_BOUNDARY };
    state.evidence.push(item); this.repository.save(state); return item;
  }
  get_evidence(context) { const { state } = context.case_id ? this.context.assert_case_context(context) : this.context.assert_conversation_context(context); return state.evidence.filter((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id && (context.case_id ? item.case_id === context.case_id : item.conversation_id === context.conversation_id)); }
}

export class ConversationService {
  constructor(repository, clock = () => new Date()) { this.repository = repository; this.clock = clock; this.context = new ContextService(repository); }
  create_conversation(context, scope = CONVERSATION_SCOPES.FIELD_SCOPED) { const { state } = this.context.assert_field_context(context); if (!Object.values(CONVERSATION_SCOPES).includes(scope)) throw new Error("invalid conversation scope"); if (context.case_id) this.context.assert_case_context(context); const item = { conversation_id: createStableId("conversation"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, case_id: context.case_id ?? null, scope, created_at: this.clock().toISOString() }; state.conversations.push(item); this.repository.save(state); return item; }
  find_field_conversation(context) { const { state } = this.context.assert_field_context(context); return state.conversations.find((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id && item.scope === CONVERSATION_SCOPES.FIELD_SCOPED && item.case_id === null) ?? null; }
  list_messages(context) { const { state } = this.context.assert_conversation_context(context); return state.messages.filter((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id && item.conversation_id === context.conversation_id); }
  append_message(context, message) { const { state } = this.context.assert_conversation_context(context); const item = { message_id: createStableId("message"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, case_id: context.case_id ?? null, conversation_id: context.conversation_id, role: message.role, content: message.content, message_type: message.message_type ?? "TEXT", evidence_id: message.evidence_id ?? null, provider: message.provider ?? null, model: message.model ?? null, provider_response_id: message.response_id ?? null, status: message.status ?? "SAVED", error_code: message.error_code ?? null, created_at: this.clock().toISOString() }; state.messages.push(item); this.repository.save(state); return item; }
}

export class KnowledgeService { constructor(adapter = null) { this.adapter = adapter; } resolve_entity(query) { return this.adapter?.resolve_entity?.(query) ?? null; } retrieve_knowledge(query) { return this.adapter?.retrieve_knowledge?.(query) ?? []; } get_relationships(identifier) { return this.adapter?.get_relationships?.(identifier) ?? []; } }

export class DecisionService {
  constructor(repository, configuration, clock = () => new Date(), governedAdapter = null) { this.repository = repository; this.configuration = configuration; this.clock = clock; this.governedAdapter = governedAdapter; this.context = new ContextService(repository); }
  evaluate_need_for_action(context) {
    const { state } = this.context.assert_case_context(context), observations = state.observations.filter((item) => item.case_id === context.case_id), evidence = state.evidence.filter((item) => item.case_id === context.case_id);
    if (this.governedAdapter?.evaluate_need_for_action) return this.governedAdapter.evaluate_need_for_action({ context, observations, evidence });
    const uncertain = observations.some((item) => item.uncertain || item.skipped), completeEnough = observations.length >= 2;
    return { model: "need-for-action-decision/v1", state: uncertain || !completeEnough ? "MORE_EVIDENCE_REQUIRED" : "CONTINUE_MONITORING", reason: uncertain ? "มีข้อสังเกตที่ยังไม่แน่ใจ" : completeEnough ? "ยังไม่มี Action Evidence ที่รองรับการเปิด Management Review" : "ข้อมูลการตรวจยังไม่เพียงพอ", evidence_references: evidence.map((item) => item.evidence_id), limitations: ["ไม่มีการอนุมานเกณฑ์ ความรุนแรง หรือความจำเป็นต้องใช้สารจากข้อมูลทั่วไป"] };
  }
  get_management_options(context) {
    const { state } = this.context.assert_case_context(context), decision = this.evaluate_need_for_action(context), observations = state.observations.filter((item) => item.case_id === context.case_id), photos = state.evidence.filter((item) => item.case_id === context.case_id && item.source_type.includes("PHOTO"));
    const uncertain = observations.some((item) => item.uncertain || item.skipped), options = this.configuration.management_options.map((definition) => {
      let eligibility_state = "eligible";
      if (definition.eligibility_rule === "WHEN_UNCERTAIN_OR_PHOTO" && !uncertain && photos.length === 0) eligibility_state = "information-required";
      if (definition.eligibility_rule === "WHEN_ACTION_NOT_JUSTIFIED" && !["MORE_EVIDENCE_REQUIRED", "CONTINUE_MONITORING", "NO_ACTION_DETERMINATION_SUPPORTED"].includes(decision.state)) eligibility_state = "not-currently-justified";
      return { management_option_id: `${context.case_id}_${definition.option_class}`, case_id: context.case_id, option_class: definition.option_class, title: definition.title_th, objective: definition.objective_th, why_shown: decision.reason, eligibility_state, cost_consideration: null, risk_limitations: definition.limitations, evidence_state: decision.state, regulatory_state: definition.option_class === "CHEMICAL_REVIEW" ? "UNRESOLVED" : "NOT_APPLICABLE", application_considerations: null, suggested: false, suggestion_basis: null, evidence_references: decision.evidence_references, source_provenance: definition.source_provenance };
    });
    const recordable = options.filter((item) => ["eligible", "information-required"].includes(item.eligibility_state));
    const stateRecord = this.repository.load(); stateRecord.management_options = stateRecord.management_options.filter((item) => item.case_id !== context.case_id).concat(options); this.repository.save(stateRecord);
    return { options: recordable, single_suggestion_supported: false, suggestion_message: "ยังไม่มีข้อมูลเพียงพอให้ระบบชี้ทางเลือกเดียว", need_for_action: decision };
  }
  select_management_option(context, managementOptionId, notes = "", selectionSource = "USER_SELECTED") {
    const checked = this.context.assert_case_context(context), available = this.get_management_options(context).options.find((item) => item.management_option_id === managementOptionId && item.eligibility_state === "eligible");
    if (!available) throw new Error("management option is not eligible for selection");
    const state = this.repository.load(), existing = state.decision_logs.find((item) => item.case_id === context.case_id);
    const log = { decision_log_id: existing?.decision_log_id ?? createStableId("decision"), user_id: context.user_id, field_id: context.field_id, season_id: context.season_id, case_id: context.case_id, management_option_id: managementOptionId, option_class: available.option_class, selected_at: this.clock().toISOString(), selection_source: selectionSource, notes, selection_only: true, field_action_performed: false };
    state.decision_logs = state.decision_logs.filter((item) => item.case_id !== context.case_id); state.decision_logs.push(log); this.repository.save(state); return log;
  }
  get_decision_log(context) { const { state } = this.context.assert_case_context(context); return state.decision_logs.find((item) => item.user_id === context.user_id && item.field_id === context.field_id && item.season_id === context.season_id && item.case_id === context.case_id) ?? null; }
  application_guidance() { return Object.fromEntries(APPLICATION_GUIDANCE_FIELDS.map((key) => [key, key === "evidence_state" ? "UNAVAILABLE" : key === "source_provenance" ? [] : null])); }
}

export class ExplanationService { explain_decision(decision) { return { text: decision?.reason ?? decision?.explanation ?? "ยังไม่มีหลักฐานเพียงพอสำหรับอธิบายการตัดสินใจ", evidence_lineage: decision?.evidence_references ?? decision?.evidence_lineage ?? [], limitations: decision?.limitations ?? [] }; } }

export class LLMGateway {
  constructor(adapter = null) { this.adapter = adapter; }
  is_available() { return Boolean(this.adapter); }
  async chat(input) { return this.adapter?.chat ? this.adapter.chat(input) : { status: "UNAVAILABLE", message: "ยังไม่ได้เชื่อมต่อผู้ให้บริการ AI การสนทนาและข้อมูลแปลงที่บันทึกไว้ยังใช้งานได้" }; }
  async analyze_image(input) { return this.adapter?.analyze_image ? this.adapter.analyze_image(input) : { status: "UNAVAILABLE", analysis_performed: false, message: "รับรูปแล้ว แต่ยังไม่มีบริการวิเคราะห์ภาพ" }; }
  async compose_explanation(input) { return this.adapter?.compose_explanation ? this.adapter.compose_explanation(input) : { status: "UNAVAILABLE", message: "ใช้คำอธิบายจากกฎและหลักฐานที่กำกับไว้" }; }
}

export async function loadFieldConfiguration(url = "./assets/field-config.json") { const response = await fetch(url); if (!response.ok) throw new Error("โหลดกฎระยะข้าวไม่สำเร็จ"); return response.json(); }
export async function loadInvestigationConfiguration(url = "./assets/investigation-config.json") { const response = await fetch(url); if (!response.ok) throw new Error("โหลดขั้นตอนการตรวจไม่สำเร็จ"); return response.json(); }
