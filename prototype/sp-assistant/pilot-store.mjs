import { DatabaseSync } from "node:sqlite";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { InvestigationBackbone, initializeInvestigationSchema } from "./investigation-backbone.mjs";
import { InvestigationIntelligenceService, initializeInvestigationIntelligenceSchema } from "./investigation-intelligence.mjs";
import { GuidanceIntelligenceService, initializeGuidanceIntelligenceSchema } from "./guidance-intelligence.mjs";
import { VisualEvidenceService, initializeVisualEvidenceSchema } from "./visual-evidence.mjs";
import { VisualPerceptionService, initializeVisualPerceptionSchema } from "./visual-perception.mjs";

const COLLECTIONS = ["users", "fields", "seasons", "activities", "cases", "observations", "evidence", "conversations", "messages", "guidance", "decision_logs", "case_summaries", "weather_snapshots"];
const STAGE_PROVENANCE = new Set(["SYSTEM_ESTIMATED", "USER_CONFIRMED", "USER_OVERRIDDEN"]);

function safeId(value, name = "id") {
  if (typeof value !== "string" || !/^[A-Za-z0-9._:-]{1,128}$/.test(value)) throw new Error(`invalid ${name}`);
  return value;
}

function safeWorkspace(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) throw new Error("invalid workspace");
  const copy = structuredClone(state);
  const forbidden = /password|api.?key|authorization|secret/i;
  const inspect = (value) => {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (forbidden.test(key)) throw new Error("secret fields are not accepted");
      if (typeof child === "string" && child.length > 20_000) throw new Error("workspace string too large");
      inspect(child);
    }
  };
  inspect(copy);
  return copy;
}

export class PilotStore {
  constructor({ dbPath, exportDir, investigationRuleProvider = null, investigationCandidateProvider = null, intelligenceClock = null, intelligenceIdProvider = null, guidanceRuleProvider = null, guidanceClock = null, guidanceIdProvider = null, visualPerceptionProvider = null, visualClock = null, visualIdProvider = null, visualPerceptionAdapter = null, visualPerceptionClock = null, visualPerceptionIdProvider = null, visualPerceptionImageLoader = null, visualPerceptionContextResolver = null }) {
    this.dbPath = resolve(dbPath);
    this.exportDir = resolve(exportDir);
    this.db = null;
    this.investigation = null;
    this.investigationIntelligence = null;
    this.investigationRuleProvider = investigationRuleProvider;
    this.investigationCandidateProvider = investigationCandidateProvider;
    this.intelligenceClock = intelligenceClock;
    this.intelligenceIdProvider = intelligenceIdProvider;
    this.guidanceRuleProvider = guidanceRuleProvider;
    this.guidanceClock = guidanceClock;
    this.guidanceIdProvider = guidanceIdProvider;
    this.guidanceIntelligence = null;
    this.visualPerceptionProvider = visualPerceptionProvider;
    this.visualClock = visualClock;
    this.visualIdProvider = visualIdProvider;
    this.visualEvidence = null;
    this.visualPerceptionAdapter = visualPerceptionAdapter;
    this.visualPerceptionClock = visualPerceptionClock;
    this.visualPerceptionIdProvider = visualPerceptionIdProvider;
    this.visualPerceptionImageLoader = visualPerceptionImageLoader;
    this.visualPerceptionContextResolver = visualPerceptionContextResolver;
    this.visualPerception = null;
  }
  async open() {
    await mkdir(dirname(this.dbPath), { recursive: true });
    await mkdir(this.exportDir, { recursive: true });
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS pilot_workspaces (user_id TEXT PRIMARY KEY, state_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS pilot_events (event_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, event_type TEXT NOT NULL, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS pilot_feedback (feedback_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, route TEXT NOT NULL, subject_id TEXT, rating TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS pilot_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS lifecycle_users (user_id TEXT PRIMARY KEY, profile_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS lifecycle_fields (field_id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, name TEXT NOT NULL, geometry_json TEXT, centroid_json TEXT, area_json TEXT, crop_profile_json TEXT NOT NULL, season_id TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS lifecycle_fields_owner ON lifecycle_fields(owner_user_id);
      CREATE TABLE IF NOT EXISTS crop_seasons (season_id TEXT PRIMARY KEY, field_id TEXT NOT NULL, owner_user_id TEXT NOT NULL, crop TEXT NOT NULL, planting_date TEXT, expected_planting_date TEXT, rice_variety TEXT, planting_method TEXT, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY(field_id) REFERENCES lifecycle_fields(field_id));
      CREATE INDEX IF NOT EXISTS crop_seasons_scope ON crop_seasons(owner_user_id, field_id);
      CREATE TABLE IF NOT EXISTS stage_assessments (stage_assessment_id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, field_id TEXT NOT NULL, season_id TEXT NOT NULL, crop_age_days INTEGER, crop_stage_json TEXT, cmp_stage_json TEXT, provenance TEXT NOT NULL, model_version TEXT NOT NULL, configuration_version TEXT NOT NULL, assessed_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(owner_user_id, field_id, season_id), FOREIGN KEY(field_id) REFERENCES lifecycle_fields(field_id), FOREIGN KEY(season_id) REFERENCES crop_seasons(season_id));
      CREATE TABLE IF NOT EXISTS guidance_states (guidance_item_id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, field_id TEXT NOT NULL, season_id TEXT NOT NULL, state_json TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY(field_id) REFERENCES lifecycle_fields(field_id), FOREIGN KEY(season_id) REFERENCES crop_seasons(season_id));
      CREATE INDEX IF NOT EXISTS guidance_states_scope ON guidance_states(owner_user_id, field_id, season_id);
      CREATE TABLE IF NOT EXISTS lifecycle_migrations (owner_user_id TEXT PRIMARY KEY, status TEXT NOT NULL, source_schema_version INTEGER, imported_at TEXT NOT NULL, updated_at TEXT NOT NULL);
    `);
    const feedbackColumns = new Set(this.db.prepare("PRAGMA table_info(pilot_feedback)").all().map((column) => column.name));
    if (!feedbackColumns.has("category")) this.db.exec("ALTER TABLE pilot_feedback ADD COLUMN category TEXT");
    if (!feedbackColumns.has("storage_key")) this.db.exec("ALTER TABLE pilot_feedback ADD COLUMN storage_key TEXT");
    initializeInvestigationSchema(this.db);
    initializeInvestigationIntelligenceSchema(this.db);
    initializeGuidanceIntelligenceSchema(this.db);
    initializeVisualEvidenceSchema(this.db);
    initializeVisualPerceptionSchema(this.db);
    this.investigation = new InvestigationBackbone(this.db);
    this.investigationIntelligence = new InvestigationIntelligenceService(this.db,this.investigation,{...(this.investigationRuleProvider?{ruleProvider:this.investigationRuleProvider}:{}),...(this.investigationCandidateProvider?{candidateProvider:this.investigationCandidateProvider}:{}),...(this.intelligenceClock?{clock:this.intelligenceClock}:{}),...(this.intelligenceIdProvider?{idProvider:this.intelligenceIdProvider}:{})});
    this.guidanceIntelligence = new GuidanceIntelligenceService(this.db,this.investigation,this.investigationIntelligence,{...(this.guidanceRuleProvider?{ruleProvider:this.guidanceRuleProvider}:{}),...(this.guidanceClock?{clock:this.guidanceClock}:{}),...(this.guidanceIdProvider?{idProvider:this.guidanceIdProvider}:{})});
    this.visualEvidence = new VisualEvidenceService(this.db,this.investigation,this.guidanceIntelligence,{...(this.visualPerceptionProvider?{perceptionProvider:this.visualPerceptionProvider}:{}),...(this.visualClock?{clock:this.visualClock}:{}),...(this.visualIdProvider?{idProvider:this.visualIdProvider}:{})});
    this.visualPerception = new VisualPerceptionService(this.db,this.visualEvidence,{...(this.visualPerceptionAdapter?{provider:this.visualPerceptionAdapter}:{}),...(this.visualPerceptionClock?{clock:this.visualPerceptionClock}:{}),...(this.visualPerceptionIdProvider?{idProvider:this.visualPerceptionIdProvider}:{}),...(this.visualPerceptionImageLoader?{imageLoader:this.visualPerceptionImageLoader}:{}),...(this.visualPerceptionContextResolver?{contextResolver:this.visualPerceptionContextResolver}:{})});
    for (const row of this.db.prepare("SELECT user_id,state_json,updated_at FROM pilot_workspaces").all()) {
      const migrated = this.db.prepare("SELECT status FROM lifecycle_migrations WHERE owner_user_id = ?").get(row.user_id);
      if (!migrated) this.persistLifecycle(row.user_id, JSON.parse(row.state_json), row.updated_at);
    }
    return this;
  }
  getWorkspace(userId) {
    safeId(userId, "user_id");
    const row = this.db.prepare("SELECT state_json, updated_at FROM pilot_workspaces WHERE user_id = ?").get(userId);
    if (!row) return null;
    return { state: this.hydrateLifecycle(userId, JSON.parse(row.state_json)), updated_at: row.updated_at, authority: "SERVER_LIFECYCLE" };
  }
  hydrateLifecycle(userId, state) {
    safeId(userId, "user_id");
    const userRow = this.db.prepare("SELECT profile_json FROM lifecycle_users WHERE user_id = ?").get(userId);
    const users = userRow ? [JSON.parse(userRow.profile_json)] : [];
    const fields = this.db.prepare("SELECT * FROM lifecycle_fields WHERE owner_user_id = ? ORDER BY created_at").all(userId).map((row) => ({ ...JSON.parse(row.crop_profile_json), field_id:row.field_id, owner_user_id:row.owner_user_id, name:row.name, polygon:row.geometry_json ? JSON.parse(row.geometry_json) : null, centroid:row.centroid_json ? JSON.parse(row.centroid_json) : null, area:row.area_json ? JSON.parse(row.area_json) : null, season_id:row.season_id, created_at:row.created_at, updated_at:row.updated_at }));
    const seasons = this.db.prepare("SELECT * FROM crop_seasons WHERE owner_user_id = ? ORDER BY created_at").all(userId).map((row) => ({ season_id:row.season_id, field_id:row.field_id, crop:row.crop, started_at:row.planting_date ?? row.expected_planting_date, planting_date:row.planting_date, expected_planting_date:row.expected_planting_date, variety:row.rice_variety, planting_method:row.planting_method, status:row.status, created_at:row.created_at, updated_at:row.updated_at }));
    const assessments = this.db.prepare("SELECT * FROM stage_assessments WHERE owner_user_id = ?").all(userId);
    for (const field of fields) {
      const assessment = assessments.find((item) => item.field_id === field.field_id && item.season_id === field.season_id);
      if (!assessment) continue;
      field.current_crop_stage = assessment.crop_stage_json ? JSON.parse(assessment.crop_stage_json) : null;
      field.current_cmp_stage = assessment.cmp_stage_json ? JSON.parse(assessment.cmp_stage_json) : null;
      field.stage_provenance = assessment.provenance;
      field.stage_assessment = { stage_assessment_id:assessment.stage_assessment_id, crop_age:assessment.crop_age_days, provenance:assessment.provenance, model_version:assessment.model_version, configuration_version:assessment.configuration_version, assessed_at:assessment.assessed_at };
    }
    const guidance = this.db.prepare("SELECT state_json FROM guidance_states WHERE owner_user_id = ? ORDER BY updated_at").all(userId).map((row) => JSON.parse(row.state_json));
    return { ...state, users, fields, seasons, guidance, lifecycle_authority:"SERVER", lifecycle_loaded_at:new Date().toISOString() };
  }
  persistLifecycle(userId, state, now) {
    const fields = Array.isArray(state.fields) ? state.fields : [], seasons = Array.isArray(state.seasons) ? state.seasons : [], guidance = Array.isArray(state.guidance) ? state.guidance : [];
    for (const field of fields) {
      safeId(field.field_id,"field_id");
      field.season_id ??= seasons.find((season) => season.field_id === field.field_id)?.season_id;
      safeId(field.season_id,"season_id");
      if (field.owner_user_id !== userId) throw new Error("field ownership mismatch");
      if (!seasons.some((season) => season.season_id === field.season_id && season.field_id === field.field_id)) throw new Error("field season mismatch");
      if (field.stage_provenance != null && !STAGE_PROVENANCE.has(field.stage_provenance)) throw new Error("invalid stage provenance");
    }
    for (const season of seasons) if (!fields.some((field) => field.field_id === season.field_id && field.season_id === season.season_id)) throw new Error("orphan crop season");
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const user = (Array.isArray(state.users) ? state.users : []).find((item) => item.user_id === userId) ?? { user_id:userId, role:"SPA" };
      this.db.prepare("INSERT INTO lifecycle_users(user_id,profile_json,created_at,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET profile_json=excluded.profile_json, updated_at=excluded.updated_at").run(userId,JSON.stringify(user),now,now);
      const upsertField = this.db.prepare("INSERT INTO lifecycle_fields(field_id,owner_user_id,name,geometry_json,centroid_json,area_json,crop_profile_json,season_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(field_id) DO UPDATE SET name=excluded.name, geometry_json=excluded.geometry_json, centroid_json=excluded.centroid_json, area_json=excluded.area_json, crop_profile_json=excluded.crop_profile_json, season_id=excluded.season_id, updated_at=excluded.updated_at WHERE lifecycle_fields.owner_user_id=excluded.owner_user_id");
      const upsertSeason = this.db.prepare("INSERT INTO crop_seasons(season_id,field_id,owner_user_id,crop,planting_date,expected_planting_date,rice_variety,planting_method,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(season_id) DO UPDATE SET planting_date=excluded.planting_date, expected_planting_date=excluded.expected_planting_date, rice_variety=excluded.rice_variety, planting_method=excluded.planting_method, status=excluded.status, updated_at=excluded.updated_at WHERE crop_seasons.owner_user_id=excluded.owner_user_id AND crop_seasons.field_id=excluded.field_id");
      const upsertStage = this.db.prepare("INSERT INTO stage_assessments(stage_assessment_id,owner_user_id,field_id,season_id,crop_age_days,crop_stage_json,cmp_stage_json,provenance,model_version,configuration_version,assessed_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(owner_user_id,field_id,season_id) DO UPDATE SET crop_age_days=excluded.crop_age_days, crop_stage_json=excluded.crop_stage_json, cmp_stage_json=excluded.cmp_stage_json, provenance=excluded.provenance, model_version=excluded.model_version, configuration_version=excluded.configuration_version, assessed_at=excluded.assessed_at, updated_at=excluded.updated_at");
      for (const field of fields) {
        const created = field.created_at ?? now, profile = { crop:field.crop ?? "rice", variety:field.variety ?? "", planting_method:field.planting_method ?? "", planting_date:field.planting_date ?? null, expected_planting_date:field.expected_planting_date ?? null };
        if (upsertField.run(field.field_id,userId,String(field.name ?? ""),JSON.stringify(field.polygon ?? null),JSON.stringify(field.centroid ?? null),JSON.stringify(field.area ?? null),JSON.stringify(profile),field.season_id,created,now).changes !== 1) throw new Error("field ownership mismatch");
        const season = seasons.find((item) => item.season_id === field.season_id);
        if (upsertSeason.run(season.season_id,field.field_id,userId,season.crop ?? field.crop ?? "rice",field.planting_date ?? season.planting_date ?? null,field.expected_planting_date ?? season.expected_planting_date ?? null,field.variety ?? season.variety ?? "",field.planting_method ?? season.planting_method ?? "",season.status ?? "ACTIVE",season.created_at ?? created,now).changes !== 1) throw new Error("season ownership mismatch");
        const cropDate = field.planting_date ?? field.expected_planting_date, cropAge = cropDate ? Math.floor((Date.parse(now.slice(0,10)) - Date.parse(cropDate)) / 86_400_000) : null;
        const modelVersion = field.current_crop_stage?.model_version ?? field.current_cmp_stage?.model_version ?? "field-stage-model/v1";
        upsertStage.run(`stage-${field.season_id}`,userId,field.field_id,field.season_id,Number.isFinite(cropAge) ? cropAge : null,JSON.stringify(field.current_crop_stage ?? null),JSON.stringify(field.current_cmp_stage ?? null),field.stage_provenance ?? "SYSTEM_ESTIMATED",modelVersion,"cmp-operational-stage-model/v2",field.stage_assessment?.assessed_at ?? field.updated_at ?? now,now);
      }
      const upsertGuidance = this.db.prepare("INSERT INTO guidance_states(guidance_item_id,owner_user_id,field_id,season_id,state_json,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(guidance_item_id) DO UPDATE SET state_json=excluded.state_json, updated_at=excluded.updated_at WHERE guidance_states.owner_user_id=excluded.owner_user_id AND guidance_states.field_id=excluded.field_id AND guidance_states.season_id=excluded.season_id");
      for (const item of guidance) {
        if (item.user_id !== userId || !fields.some((field) => field.field_id === item.field_id && field.season_id === item.season_id)) throw new Error("guidance context mismatch");
        if (upsertGuidance.run(safeId(item.guidance_item_id,"guidance_item_id"),userId,item.field_id,item.season_id,JSON.stringify(item),now).changes !== 1) throw new Error("guidance ownership mismatch");
      }
      this.db.prepare("INSERT INTO lifecycle_migrations(owner_user_id,status,source_schema_version,imported_at,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(owner_user_id) DO UPDATE SET status=excluded.status, updated_at=excluded.updated_at").run(userId,"IMPORTED",Number(state.schema_version ?? 0),state.pilot_migration?.imported_at ?? now,now);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  putWorkspace(userId, state) {
    safeId(userId, "user_id");
    const governed = safeWorkspace(state), now = new Date().toISOString();
    this.persistLifecycle(userId, governed, now);
    governed.lifecycle_authority = "SERVER";
    this.db.prepare("INSERT INTO pilot_workspaces(user_id,state_json,created_at,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET state_json=excluded.state_json, updated_at=excluded.updated_at").run(userId, JSON.stringify(governed), now, now);
    this.db.prepare("INSERT INTO pilot_events(user_id,event_type,created_at) VALUES(?,?,?)").run(userId, "WORKSPACE_SAVED", now);
    return { user_id: userId, updated_at: now };
  }
  getLifecycle(userId) {
    const workspace = this.getWorkspace(userId);
    if (!workspace) return null;
    const { fields, seasons, guidance } = workspace.state;
    return { authority:"SERVER", user_id:userId, fields, seasons, guidance, updated_at:workspace.updated_at };
  }
  getGuidance(userId, fieldId, seasonId) {
    safeId(userId,"user_id"); safeId(fieldId,"field_id"); safeId(seasonId,"season_id");
    const field = this.db.prepare("SELECT field_id FROM lifecycle_fields WHERE field_id = ? AND owner_user_id = ?").get(fieldId,userId);
    const season = this.db.prepare("SELECT season_id FROM crop_seasons WHERE season_id = ? AND field_id = ? AND owner_user_id = ?").get(seasonId,fieldId,userId);
    if (!field || !season) return null;
    return this.db.prepare("SELECT state_json FROM guidance_states WHERE owner_user_id = ? AND field_id = ? AND season_id = ? ORDER BY updated_at").all(userId,fieldId,seasonId).map((row) => JSON.parse(row.state_json));
  }
  createInvestigationRecord(userId, recordType, record, requestId = null) { return requestId ? this.investigation.createIdempotent(userId,requestId,recordType,record) : this.investigation.create(userId,recordType,record); }
  updateInvestigationRecord(userId, recordType, recordId, expectedRevision, record, requestId = null) { return requestId ? this.investigation.updateIdempotent(userId,requestId,recordType,recordId,expectedRevision,record) : this.investigation.update(userId,recordType,recordId,expectedRevision,record); }
  getInvestigationBundle(userId, scope) { return this.investigation.getBundle(userId,scope); }
  getInvestigationTimeline(userId, scope) { return this.investigation.getTimeline(userId,scope); }
  assessInvestigation(userId, scope) { return this.investigationIntelligence.assess(userId,scope); }
  getInvestigationAssessmentHistory(userId, scope) { return this.investigationIntelligence.history(userId,scope); }
  reviewInvestigationAssessment(userId, review) { return this.investigationIntelligence.review(userId,review); }
  getCurrentGovernedGuidance(userId, scope) { return this.guidanceIntelligence.current(userId,scope); }
  getGovernedGuidanceHistory(userId, scope) { return this.guidanceIntelligence.history(userId,scope); }
  transitionGovernedGuidance(userId, action) { return this.guidanceIntelligence.transition(userId,action); }
  getGovernedGuidanceDiagnostics(userId, scope) { return this.guidanceIntelligence.diagnostics(userId,scope); }
  findDuplicateImageEvidence(userId, scope) { return this.visualEvidence.findDuplicate(userId,scope); }
  createImageEvidence(userId, image) { return this.visualEvidence.create(userId,image); }
  getImageEvidence(userId, imageId) { return this.visualEvidence.get(userId,imageId); }
  getVisualEvidenceBundle(userId, scope) { return this.visualEvidence.bundle(userId,scope); }
  addVisualAssessment(userId, imageId, assessment) { return this.visualEvidence.addAssessment(userId,imageId,assessment); }
  reviewVisualObservation(userId, review) { return this.visualEvidence.review(userId,review); }
  getNextVisualRequest(userId, scope) { return this.visualEvidence.nextRequest(userId,scope); }
  requestVisualPerception(userId, request) { return this.visualPerception.request(userId,request); }
  getVisualPerceptionResult(userId, requestId) { return this.visualPerception.get(userId,requestId); }
  getVisualPerceptionHistory(userId, imageId) { return this.visualPerception.history(userId,imageId); }
  getVisualPerceptionHealth(userId) { return this.visualPerception.health(userId); }
  summary() {
    const rows = this.db.prepare("SELECT state_json FROM pilot_workspaces").all(), totals = Object.fromEntries(COLLECTIONS.map((key) => [key, 0]));
    for (const row of rows) { const state = JSON.parse(row.state_json); for (const key of COLLECTIONS) totals[key] += Array.isArray(state[key]) ? state[key].length : 0; }
    const meta = Object.fromEntries(this.db.prepare("SELECT key,value FROM pilot_meta").all().map((row) => [row.key, row.value]));
    const feedback = this.db.prepare("SELECT COUNT(*) AS count FROM pilot_feedback").get().count;
    const feedback_by_category = Object.fromEntries(this.db.prepare("SELECT COALESCE(category,'OTHER') AS category, COUNT(*) AS count FROM pilot_feedback GROUP BY COALESCE(category,'OTHER')").all().map((item) => [item.category,item.count]));
    return { workspaces: rows.length, ...totals, feedback, feedback_by_category, storage_mode:"LOCAL_SQLITE", storage_path:this.dbPath, last_export_at: meta.last_export_at ?? null, last_backup_at: meta.last_backup_at ?? null };
  }
  addFeedback(userId, { route, subject_id = null, rating, category = "OTHER", note = null, storage_key = null }) {
    safeId(userId, "user_id");
    if (typeof route !== "string" || !/^[a-z-]{1,40}$/.test(route)) throw new Error("invalid feedback route");
    if (subject_id != null) safeId(subject_id, "subject_id");
    if (!["WORKS", "MISMATCH", "NEEDS_DATA"].includes(rating)) throw new Error("invalid feedback rating");
    if (!["MAP","CHAT","INSPECTION","SOLUTION","MOBILE_UI","PERFORMANCE","OTHER"].includes(category)) throw new Error("invalid feedback category");
    if (note != null && (typeof note !== "string" || note.length > 500)) throw new Error("invalid feedback note");
    if (storage_key != null) safeId(storage_key, "storage_key");
    const feedback_id = `feedback-${crypto.randomUUID()}`, created_at = new Date().toISOString();
    this.db.prepare("INSERT INTO pilot_feedback(feedback_id,user_id,route,subject_id,rating,note,created_at,category,storage_key) VALUES(?,?,?,?,?,?,?,?,?)").run(feedback_id, userId, route, subject_id, rating, note?.trim() || null, created_at, category, storage_key);
    return { feedback_id, rating, category, storage_key, created_at };
  }
  async exportAll() {
    const rows = this.db.prepare("SELECT user_id,state_json,updated_at FROM pilot_workspaces ORDER BY user_id").all().map((row) => ({ user_id: row.user_id, updated_at: row.updated_at, state: JSON.parse(row.state_json) }));
    const createdAt = new Date().toISOString(), stamp = createdAt.replace(/[:.]/g, "-");
    const jsonName = `pilot-export-${stamp}.json`;
    await writeFile(resolve(this.exportDir, jsonName), JSON.stringify({ schema_version: 1, created_at: createdAt, workspaces: rows }, null, 2), "utf8");
    for (const collection of COLLECTIONS) {
      const records = rows.flatMap((row) => (row.state[collection] ?? []).map((record) => ({ workspace_user_id: row.user_id, ...record })));
      const keys = [...new Set(records.flatMap(Object.keys))], escape = (value) => `"${String(value == null ? "" : typeof value === "object" ? JSON.stringify(value) : value).replaceAll('"', '""')}"`;
      const csv = [keys.map(escape).join(","), ...records.map((record) => keys.map((key) => escape(record[key])).join(","))].join("\r\n");
      await writeFile(resolve(this.exportDir, `${collection}-${stamp}.csv`), `\ufeff${csv}`, "utf8");
    }
    const feedback = this.db.prepare("SELECT * FROM pilot_feedback ORDER BY created_at").all(), feedbackKeys = ["feedback_id","user_id","route","subject_id","rating","category","note","storage_key","created_at"], escapeFeedback = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    await writeFile(resolve(this.exportDir, `pilot-feedback-${stamp}.csv`), `\ufeff${[feedbackKeys.map(escapeFeedback).join(","), ...feedback.map((record) => feedbackKeys.map((key) => escapeFeedback(record[key])).join(","))].join("\r\n")}`, "utf8");
    this.db.prepare("INSERT INTO pilot_meta(key,value) VALUES('last_export_at',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(createdAt);
    return { created_at: createdAt, json_file: jsonName, collections: COLLECTIONS };
  }
  backup() {
    const createdAt = new Date().toISOString(), stamp = createdAt.replace(/[:.]/g, "-"), name = `pilot-backup-${stamp}.sqlite`, path = resolve(this.exportDir, name);
    this.db.exec(`VACUUM INTO '${path.replaceAll("'", "''")}'`);
    this.db.prepare("INSERT INTO pilot_meta(key,value) VALUES('last_backup_at',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(createdAt);
    return { created_at: createdAt, backup_file: name };
  }
  close() { this.db?.close(); this.db = null; this.investigation = null; this.investigationIntelligence = null; this.guidanceIntelligence = null; this.visualEvidence = null; this.visualPerception = null; }
}

export { safeWorkspace };
