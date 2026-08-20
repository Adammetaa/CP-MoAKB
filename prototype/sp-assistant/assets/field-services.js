import { STAGE_PROVENANCE, createEmptyWorkspace, createStableId, differenceInCalendarDays, toDateOnly, validateFieldName } from "./field-core.js";

export class WorkspaceRepository {
  constructor(storage, key = "cpmoakb.field-workspace.v1") { this.storage = storage; this.key = key; }
  load() {
    const raw = this.storage?.getItem?.(this.key);
    if (!raw) return createEmptyWorkspace();
    try { return { ...createEmptyWorkspace(), ...JSON.parse(raw) }; }
    catch { return createEmptyWorkspace(); }
  }
  save(state) { this.storage?.setItem?.(this.key, JSON.stringify(state)); return state; }
  clear() { this.storage?.removeItem?.(this.key); }
}

export class FieldService {
  constructor(repository, clock = () => new Date()) { this.repository = repository; this.clock = clock; }
  list_fields(ownerUserId) { return this.repository.load().fields.filter((field) => field.owner_user_id === ownerUserId); }
  get_field(fieldId) { return this.repository.load().fields.find((field) => field.field_id === fieldId) ?? null; }
  create_field(input) {
    const state = this.repository.load();
    const name = validateFieldName(input.name);
    if (!name.valid) throw new Error(name.error);
    if (!input.owner_user_id) throw new Error("owner_user_id is required");
    if (!input.polygon?.coordinates?.[0]?.length || input.polygon.coordinates[0].length < 4) throw new Error("polygon requires at least three points");
    const now = this.clock().toISOString();
    const fieldId = createStableId("field");
    const seasonId = createStableId("season");
    const field = { field_id: fieldId, owner_user_id: input.owner_user_id, name: name.value, polygon: input.polygon, centroid: input.centroid, area: input.area, crop: input.crop ?? "rice", variety: input.variety ?? "", planting_method: input.planting_method ?? "", planting_date: input.planting_date ?? null, expected_planting_date: input.expected_planting_date ?? null, current_crop_stage: input.current_crop_stage ?? null, current_cmp_stage: input.current_cmp_stage ?? null, season_id: seasonId, stage_provenance: input.stage_provenance ?? STAGE_PROVENANCE.SYSTEM_ESTIMATED, created_at: now, updated_at: now };
    state.fields.push(field);
    state.seasons.push({ season_id: seasonId, field_id: fieldId, crop: field.crop, started_at: field.planting_date ?? field.expected_planting_date, status: field.expected_planting_date ? "PLANNED" : "ACTIVE" });
    state.activities.push({ activity_id: createStableId("activity"), field_id: fieldId, season_id: seasonId, activity_type: "FIELD_CREATED", occurred_at: now });
    state.selected_field_id = fieldId;
    this.repository.save(state);
    return field;
  }
  update_field(fieldId, patch) {
    const state = this.repository.load();
    const index = state.fields.findIndex((field) => field.field_id === fieldId);
    if (index < 0) throw new Error("ไม่พบแปลงที่ต้องการแก้ไข");
    const next = { ...state.fields[index], ...patch, field_id: state.fields[index].field_id, owner_user_id: state.fields[index].owner_user_id, updated_at: this.clock().toISOString() };
    if (patch.name !== undefined) { const checked = validateFieldName(patch.name); if (!checked.valid) throw new Error(checked.error); next.name = checked.value; }
    state.fields[index] = next; this.repository.save(state); return next;
  }
  delete_field(fieldId) {
    const state = this.repository.load();
    state.fields = state.fields.filter((field) => field.field_id !== fieldId);
    state.seasons = state.seasons.filter((season) => season.field_id !== fieldId);
    state.activities = state.activities.filter((activity) => activity.field_id !== fieldId);
    if (state.selected_field_id === fieldId) state.selected_field_id = null;
    this.repository.save(state);
  }
  select_field(fieldId) { const state = this.repository.load(); if (!state.fields.some((field) => field.field_id === fieldId)) throw new Error("ไม่พบแปลง"); state.selected_field_id = fieldId; this.repository.save(state); }
}

export class LocationService {
  constructor(geolocation, repository) { this.geolocation = geolocation; this.repository = repository; }
  request_location() {
    if (!this.geolocation?.getCurrentPosition) return Promise.resolve({ status: "UNAVAILABLE", message: "อุปกรณ์นี้ไม่รองรับตำแหน่ง คุณยังใช้งานต่อได้" });
    return new Promise((resolve) => this.geolocation.getCurrentPosition((position) => {
      const context = { status: "AVAILABLE", latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, captured_at: new Date().toISOString() };
      const state = this.repository.load(); state.location_context = context; this.repository.save(state); resolve(context);
    }, () => resolve({ status: "DENIED", message: "ไม่ได้รับสิทธิ์ตำแหน่ง คุณยังสร้างแปลงและใช้งานส่วนอื่นได้" }), { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 }));
  }
  get_current_location() { return this.repository.load().location_context; }
}

export class MapService {
  create_polygon(points) {
    if (!Array.isArray(points) || points.length < 3) throw new Error("ต้องมีอย่างน้อย 3 จุด");
    const coordinates = points.map((point) => [Number(point.longitude), Number(point.latitude)]);
    const first = coordinates[0], last = coordinates.at(-1);
    if (first[0] !== last[0] || first[1] !== last[1]) coordinates.push([...first]);
    return { type: "Polygon", coordinates: [coordinates] };
  }
  update_polygon(_polygon, points) { return this.create_polygon(points); }
  calculate_centroid(polygon) {
    const points = polygon.coordinates[0].slice(0, -1);
    return { latitude: points.reduce((sum, point) => sum + point[1], 0) / points.length, longitude: points.reduce((sum, point) => sum + point[0], 0) / points.length };
  }
  calculate_area(polygon) {
    const points = polygon.coordinates[0];
    const referenceLatitude = points.reduce((sum, point) => sum + point[1], 0) / points.length * Math.PI / 180;
    const projected = points.map(([longitude, latitude]) => ({ x: longitude * 111_320 * Math.cos(referenceLatitude), y: latitude * 110_540 }));
    let twiceArea = 0;
    for (let index = 0; index < projected.length - 1; index += 1) twiceArea += projected[index].x * projected[index + 1].y - projected[index + 1].x * projected[index].y;
    const squareMeters = Math.abs(twiceArea) / 2;
    return { square_meters: squareMeters, rai: squareMeters / 1600, hectares: squareMeters / 10000, method: "LOCAL_PLANAR_SHOELACE", estimated: true };
  }
}

export class StageService {
  constructor(configuration, clock = () => new Date()) { this.configuration = configuration; this.clock = clock; }
  calculate_crop_age(dateValue) {
    const today = toDateOnly(this.clock());
    const days = differenceInCalendarDays(today, dateValue);
    return days >= 0 ? { state: "PLANTED", crop_age_days: days, days_until_planting: 0 } : { state: "PLANNED", crop_age_days: null, days_until_planting: Math.abs(days) };
  }
  calculate_crop_stage(dateValue) {
    const age = this.calculate_crop_age(dateValue);
    const comparisonDay = age.state === "PLANNED" ? -age.days_until_planting : age.crop_age_days;
    const rule = this.configuration.stage_rules.find((item) => comparisonDay >= item.min_day && comparisonDay <= item.max_day) ?? this.configuration.stage_rules.at(-1);
    return { crop_stage: rule.crop_stage, crop_stage_label: rule.label_th, cmp_stage: rule.stage_id, provenance: STAGE_PROVENANCE.SYSTEM_ESTIMATED, model_version: this.configuration.version, basis: { date: dateValue, comparison_day: comparisonDay } };
  }
  calculate_cmp_stage(dateValue) { return this.calculate_crop_stage(dateValue).cmp_stage; }
  override_crop_stage(estimate, cropStage, cmpStage, label) { return { ...estimate, crop_stage: cropStage, cmp_stage: cmpStage, crop_stage_label: label, provenance: STAGE_PROVENANCE.USER_OVERRIDDEN }; }
  confirm_crop_stage(estimate) { return { ...estimate, provenance: STAGE_PROVENANCE.USER_CONFIRMED }; }
}

export class GuidanceService {
  get_guidance(field) {
    if (!field) return [{ guidance_item_id: "neutral_learning", title: "เรียนรู้การบันทึกข้อมูลแปลง", state: "NEUTRAL", source_lineage: "PRODUCT_GUIDANCE" }];
    return [
      { guidance_item_id: `guidance_${field.field_id}_plant`, field_id: field.field_id, title: "ตรวจสุขภาพต้นข้าว", state: "CHECK", source_lineage: "FIELD_WORKFLOW" },
      { guidance_item_id: `guidance_${field.field_id}_water`, field_id: field.field_id, title: "บันทึกสภาพน้ำในแปลง", state: "CHECK", source_lineage: "FIELD_WORKFLOW" },
      { guidance_item_id: `guidance_${field.field_id}_notes`, field_id: field.field_id, title: "เพิ่มบันทึกจากการเดินแปลง", state: "OPTIONAL", source_lineage: "FIELD_WORKFLOW" },
    ];
  }
}

export class WeatherService {
  constructor(clock = () => new Date()) { this.clock = clock; }
  async get_weather(location) {
    if (!location || location.status !== "AVAILABLE") return { status: "UNAVAILABLE" };
    return { status: "AVAILABLE", temperature: 29, condition: "แดดบางส่วน", wind_speed: 8, unit: "กม./ชม.", updated_at: this.clock().toISOString(), provider: "MOCK_ADAPTER" };
  }
}

export class InvestigationService {
  constructor(repository) { this.repository = repository; }
  start_case(fieldId, seasonId) { const state = this.repository.load(); const record = { case_id: createStableId("case"), field_id: fieldId, season_id: seasonId, status: "OPEN", created_at: new Date().toISOString() }; state.cases.push(record); this.repository.save(state); return record; }
  submit_observation(caseId, value) { const state = this.repository.load(); const record = { observation_id: createStableId("observation"), case_id: caseId, ...value, provenance: value.provenance ?? "USER_REPORTED" }; state.observations.push(record); this.repository.save(state); return record; }
  get_next_question() { return null; }
  finish_case(caseId) { const state = this.repository.load(); const item = state.cases.find((entry) => entry.case_id === caseId); if (item) item.status = "FINISHED"; this.repository.save(state); return item; }
  get_case_summary(caseId) { const state = this.repository.load(); return { case: state.cases.find((item) => item.case_id === caseId), observations: state.observations.filter((item) => item.case_id === caseId) }; }
}

export class EvidenceService { constructor(repository) { this.repository = repository; } add_evidence(record) { const state = this.repository.load(); const item = { evidence_id: createStableId("evidence"), ...record }; state.evidence.push(item); this.repository.save(state); return item; } get_evidence(caseId) { return this.repository.load().evidence.filter((item) => item.case_id === caseId); } }
export class ConversationService { constructor(repository) { this.repository = repository; } create_conversation(caseId) { const state = this.repository.load(); const item = { conversation_id: createStableId("conversation"), case_id: caseId, created_at: new Date().toISOString() }; state.conversations.push(item); this.repository.save(state); return item; } list_messages(conversationId) { return this.repository.load().messages.filter((item) => item.conversation_id === conversationId); } append_message(conversationId, message) { const state = this.repository.load(); const item = { message_id: createStableId("message"), conversation_id: conversationId, ...message, created_at: new Date().toISOString() }; state.messages.push(item); this.repository.save(state); return item; } }
export class KnowledgeService { constructor(adapter = null) { this.adapter = adapter; } resolve_entity(query) { return this.adapter?.resolve_entity?.(query) ?? null; } retrieve_knowledge(query) { return this.adapter?.retrieve_knowledge?.(query) ?? []; } get_relationships(identifier) { return this.adapter?.get_relationships?.(identifier) ?? []; } }
export class DecisionService { constructor(adapter = null) { this.adapter = adapter; } evaluate_need_for_action(caseRecord) { return this.adapter?.evaluate_need_for_action?.(caseRecord) ?? { state: "INSUFFICIENT_EVIDENCE", evidence_lineage: [] }; } get_management_options(caseRecord) { return this.adapter?.get_management_options?.(caseRecord) ?? []; } }
export class ExplanationService { explain_decision(decision) { return { text: decision?.explanation ?? "ยังไม่มีหลักฐานเพียงพอสำหรับอธิบายการตัดสินใจ", evidence_lineage: decision?.evidence_lineage ?? [] }; } }
export class LLMGateway { chat() { throw new Error("LLMGateway is server-side only"); } analyze_image() { throw new Error("LLMGateway is server-side only"); } compose_explanation() { throw new Error("LLMGateway is server-side only"); } }

export async function loadFieldConfiguration(url = "./assets/field-config.json") { const response = await fetch(url); if (!response.ok) throw new Error("โหลดกฎระยะข้าวไม่สำเร็จ"); return response.json(); }
