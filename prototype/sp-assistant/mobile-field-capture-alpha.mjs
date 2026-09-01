import { createHash, randomUUID } from "node:crypto";

export const MOBILE_FIELD_CAPTURE_ALPHA_VERSION = "mobile-field-capture-alpha/v1";
export const LEARNING_SIGNAL_SCHEMA_VERSION = "governed-learning-signal/v1";
export const LEARNING_SIGNAL_CLASSES = Object.freeze([
  "UNANSWERED_QUESTION",
  "INTERPRETATION_GAP",
  "MISSING_EVIDENCE",
  "USER_CORRECTION",
  "FAILED_CONTROL_REPORT_CANDIDATE",
  "PRODUCT_QUESTION",
  "ACTIVE_INGREDIENT_QUESTION",
  "MISSING_CANDIDATE",
  "MISSING_MANAGEMENT_RELATIONSHIP",
  "USEFUL_COMPLETED_CASE",
]);

const SIGNALS = new Set(LEARNING_SIGNAL_CLASSES);
const IDENTIFIER = /^[A-Za-z0-9._:/-]{1,180}$/;
const safeId = (value, name, optional = false) => {
  if (optional && value == null) return null;
  if (typeof value !== "string" || !IDENTIFIER.test(value)) throw Object.assign(new Error(`invalid ${name}`), { code:"VALIDATION_ERROR", status:400 });
  return value;
};
const bounded = (value, name, max = 500) => {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw Object.assign(new Error(`invalid ${name}`), { code:"VALIDATION_ERROR", status:400 });
  return value.trim();
};
const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function initializeMobileFieldCaptureAlphaSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS governed_learning_signals (
      signal_id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      field_id TEXT,
      season_id TEXT,
      case_id TEXT,
      conversation_id TEXT,
      turn_id TEXT,
      signal_class TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL,
      review_state TEXT NOT NULL,
      source_authority TEXT NOT NULL,
      limitations_json TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      source_fingerprint TEXT NOT NULL,
      evidence_authority INTEGER NOT NULL DEFAULT 0,
      learning_candidate_authority INTEGER NOT NULL DEFAULT 0,
      canonical_knowledge_authority INTEGER NOT NULL DEFAULT 0,
      UNIQUE(owner_user_id,source_fingerprint),
      FOREIGN KEY(field_id) REFERENCES lifecycle_fields(field_id),
      FOREIGN KEY(season_id) REFERENCES crop_seasons(season_id),
      FOREIGN KEY(case_id) REFERENCES investigation_cases(case_id),
      FOREIGN KEY(conversation_id) REFERENCES governed_conversations(conversation_id),
      FOREIGN KEY(turn_id) REFERENCES governed_conversation_turns(turn_id)
    );
    CREATE INDEX IF NOT EXISTS governed_learning_signals_owner ON governed_learning_signals(owner_user_id,created_at,signal_id);
    CREATE INDEX IF NOT EXISTS governed_learning_signals_review ON governed_learning_signals(review_state,signal_class,created_at);
  `);
  db.prepare("INSERT OR IGNORE INTO investigation_schema_migrations(version,applied_at) VALUES(12,?)").run(new Date().toISOString());
}

function publicSignal(row) {
  return {
    signal_id:row.signal_id,
    owner_user_id:row.owner_user_id,
    field_id:row.field_id,
    season_id:row.season_id,
    case_id:row.case_id,
    conversation_id:row.conversation_id,
    turn_id:row.turn_id,
    signal_class:row.signal_class,
    reason:row.reason,
    created_at:row.created_at,
    review_state:row.review_state,
    source_authority:row.source_authority,
    limitations:JSON.parse(row.limitations_json),
    schema_version:row.schema_version,
    learning_signal_is_evidence:false,
    learning_signal_is_learning_candidate:false,
    learning_signal_is_canonical_knowledge:false,
    automatic_promotion:false,
  };
}

export class MobileFieldCaptureAlphaService {
  constructor(db, { clock = () => new Date(), idProvider = () => randomUUID() } = {}) {
    this.db=db; this.clock=clock; this.idProvider=idProvider;
  }
  now() { return this.clock().toISOString(); }
  assertScope(userId, input) {
    safeId(userId,"user_id");
    if (input.field_id) {
      const field=this.db.prepare("SELECT field_id FROM lifecycle_fields WHERE owner_user_id=? AND field_id=?").get(userId,safeId(input.field_id,"field_id"));
      if(!field)throw Object.assign(new Error("learning signal field scope not found"),{code:"AUTHORIZATION_ERROR",status:403});
    }
    if (input.season_id) {
      const season=this.db.prepare("SELECT season_id FROM crop_seasons WHERE owner_user_id=? AND season_id=? AND (? IS NULL OR field_id=?)").get(userId,safeId(input.season_id,"season_id"),input.field_id??null,input.field_id??null);
      if(!season)throw Object.assign(new Error("learning signal season scope not found"),{code:"AUTHORIZATION_ERROR",status:403});
    }
    if (input.case_id) {
      const record=this.db.prepare("SELECT case_id FROM investigation_cases WHERE owner_user_id=? AND case_id=? AND (? IS NULL OR field_id=?) AND (? IS NULL OR season_id=?)").get(userId,safeId(input.case_id,"case_id"),input.field_id??null,input.field_id??null,input.season_id??null,input.season_id??null);
      if(!record)throw Object.assign(new Error("learning signal case scope not found"),{code:"AUTHORIZATION_ERROR",status:403});
    }
  }
  create(userId, input) {
    this.assertScope(userId,input);
    const signalClass=safeId(input.signal_class,"signal_class");if(!SIGNALS.has(signalClass))throw Object.assign(new Error("invalid signal_class"),{code:"VALIDATION_ERROR",status:400});
    const reason=bounded(input.reason,"reason"),sourceAuthority=safeId(input.source_authority??"SERVER_DERIVED_WORKFLOW_STATE","source_authority"),limitations=(input.limitations??[]).map((item)=>bounded(item,"limitation",500));
    const scope={field_id:input.field_id??null,season_id:input.season_id??null,case_id:input.case_id??null,conversation_id:safeId(input.conversation_id,"conversation_id",true),turn_id:safeId(input.turn_id,"turn_id",true)};
    const sourceFingerprint=digest({userId,scope,signalClass,reason,source_ref:input.source_ref??scope.turn_id}),prior=this.db.prepare("SELECT * FROM governed_learning_signals WHERE owner_user_id=? AND source_fingerprint=?").get(userId,sourceFingerprint);
    if(prior)return {...publicSignal(prior),idempotent_replay:true};
    const record={signal_id:input.signal_id??`learning-signal-${this.idProvider()}`,owner_user_id:userId,...scope,signal_class:signalClass,reason,created_at:this.now(),review_state:"UNREVIEWED",source_authority:sourceAuthority,limitations,schema_version:LEARNING_SIGNAL_SCHEMA_VERSION,source_fingerprint:sourceFingerprint};
    safeId(record.signal_id,"signal_id");
    this.db.prepare("INSERT INTO governed_learning_signals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(record.signal_id,userId,record.field_id,record.season_id,record.case_id,record.conversation_id,record.turn_id,record.signal_class,record.reason,record.created_at,record.review_state,record.source_authority,JSON.stringify(record.limitations),record.schema_version,record.source_fingerprint,0,0,0);
    return {...record,learning_signal_is_evidence:false,learning_signal_is_learning_candidate:false,learning_signal_is_canonical_knowledge:false,automatic_promotion:false,idempotent_replay:false};
  }
  captureTurn(userId, rawInput, response) {
    if(!response?.turn_id)return [];
    const message=String(rawInput?.message??""),scope={field_id:response.context?.field_id??null,season_id:response.context?.season_id??null,case_id:response.context?.case_id??null,conversation_id:response.conversation_id,turn_id:response.turn_id},base={...scope,source_ref:response.turn_id,source_authority:"SERVER_DERIVED_CONVERSATION_STATE",limitations:["Learning Signal is operational review input, not Evidence, a Learning Candidate, or Canonical Knowledge."]},signals=[];
    const add=(signal_class,reason)=>signals.push(this.create(userId,{...base,signal_class,reason}));
    if(response.intent==="CANNOT_ANSWER")add("UNANSWERED_QUESTION","User explicitly could not provide the requested field information.");
    if(response.intent==="USER_CORRECTION"||rawInput?.corrects_turn_id)add("USER_CORRECTION","User submitted a correction; original conversation history remains preserved.");
    if((response.explicit_facts??[]).some((item)=>item.status!=="EXPLICIT"))add("INTERPRETATION_GAP","At least one expression could not be mapped to the governed capture vocabulary.");
    if(response.assessment_reference&&response.actions?.some((item)=>["REQUEST_FIELD_CHECK","REQUEST_VISUAL_EVIDENCE"].includes(item.action)))add("MISSING_EVIDENCE","Current governed assessment identified another evidence step.");
    if(/ควบคุมไม่ได้|ไม่ได้ผล|พ่นแล้ว.*(?:ยัง|ไม่)/iu.test(message))add("FAILED_CONTROL_REPORT_CANDIDATE","User reported possible failed control; no resistance or efficacy conclusion was inferred.");
    if(/ผลิตภัณฑ์|ยี่ห้อ|ชื่อการค้า/iu.test(message))add("PRODUCT_QUESTION","User asked about a product; no case recommendation authority was created.");
    if(/สารออกฤทธิ์|active ingredient/iu.test(message))add("ACTIVE_INGREDIENT_QUESTION","User asked about an active ingredient; reference interest is not case suitability.");
    if(response.context?.case_id&&!response.assessment_reference)add("MISSING_CANDIDATE","Current Case has no materialized investigation assessment reference for this turn.");
    if(response.management_review_reference?.need_for_action_state==="MORE_EVIDENCE_REQUIRED")add("MISSING_MANAGEMENT_RELATIONSHIP","Current state does not authorize a management relationship for review.");
    return signals;
  }
  listOwner(userId) {
    safeId(userId,"user_id");
    return this.db.prepare("SELECT * FROM governed_learning_signals WHERE owner_user_id=? ORDER BY created_at,signal_id").all(userId).map(publicSignal);
  }
  listAdmin() {
    return this.db.prepare("SELECT * FROM governed_learning_signals ORDER BY created_at,signal_id").all().map(publicSignal);
  }
}
