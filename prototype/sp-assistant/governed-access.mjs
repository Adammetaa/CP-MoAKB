import { randomUUID } from "node:crypto";

export const GOVERNED_ACCESS_VERSION = "governed-field-access/v1";
const SCOPES = new Set(["FIELD", "CASE", "REVIEW_ITEM", "SYSTEM"]);
const CAPABILITIES = new Set(["FIELD_OPERATE", "CASE_OPERATE", "CASE_REVIEW", "REVIEW_ITEM_REVIEW", "REVIEW_COORDINATE"]);
const fail = (message, status = 403) => { throw Object.assign(new Error(message), { code:status === 403 ? "AUTHORIZATION_ERROR" : "VALIDATION_ERROR", status }); };
const id = (value, name) => { if (typeof value !== "string" || !/^[A-Za-z0-9._:-]{1,180}$/.test(value)) fail(`invalid ${name}`, 400); return value; };
const admin = (identity) => identity?.enabled !== false && ["ADMIN", "TEST_ADMIN"].includes(identity?.role);

export function initializeGovernedAccessSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS governed_access_grants (
      grant_id TEXT PRIMARY KEY, subject_user_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
      scope_type TEXT NOT NULL, scope_id TEXT NOT NULL, capability TEXT NOT NULL,
      granted_by TEXT NOT NULL, granted_at TEXT NOT NULL, grant_reason TEXT NOT NULL,
      revoked_by TEXT, revoked_at TEXT, revoke_reason TEXT
    );
    CREATE INDEX IF NOT EXISTS governed_access_active ON governed_access_grants(subject_user_id,tenant_id,scope_type,scope_id,capability,revoked_at);
    CREATE TABLE IF NOT EXISTS governed_legacy_review_triage (
      signal_id TEXT PRIMARY KEY, classification TEXT NOT NULL, classified_at TEXT NOT NULL,
      migration_version TEXT NOT NULL, FOREIGN KEY(signal_id) REFERENCES governed_learning_signals(signal_id)
    );
    CREATE TABLE IF NOT EXISTS governed_legacy_case_triage (
      case_id TEXT PRIMARY KEY, classification TEXT NOT NULL, classified_at TEXT NOT NULL,
      migration_version TEXT NOT NULL, FOREIGN KEY(case_id) REFERENCES investigation_cases(case_id)
    );
    CREATE TABLE IF NOT EXISTS governed_observation_review_events (
      review_event_id TEXT PRIMARY KEY, observation_id TEXT NOT NULL, owner_user_id TEXT NOT NULL,
      case_id TEXT NOT NULL, reviewer_user_id TEXT NOT NULL, action TEXT NOT NULL,
      previous_state TEXT NOT NULL, new_state TEXT NOT NULL, evidence_ids_json TEXT NOT NULL,
      reason TEXT NOT NULL, corrected_observation_id TEXT, previous_snapshot_json TEXT NOT NULL,
      created_at TEXT NOT NULL, FOREIGN KEY(observation_id) REFERENCES investigation_observations(observation_id)
    );
    CREATE TABLE IF NOT EXISTS governed_case_lineage_events (
      lineage_event_id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, field_id TEXT NOT NULL,
      season_id TEXT NOT NULL, source_case_id TEXT NOT NULL, target_case_id TEXT NOT NULL,
      action TEXT NOT NULL, actor_user_id TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL,
      FOREIGN KEY(source_case_id) REFERENCES investigation_cases(case_id),
      FOREIGN KEY(target_case_id) REFERENCES investigation_cases(case_id)
    );
  `);
  const migrated = db.prepare("SELECT 1 FROM investigation_schema_migrations WHERE version=15").get();
  if (!migrated) {
    const now = new Date().toISOString();
    db.prepare(`INSERT OR IGNORE INTO governed_legacy_review_triage(signal_id,classification,classified_at,migration_version)
      SELECT signal_id,'LEGACY_UNASSIGNED',?,'fw01-access/v1' FROM governed_learning_signals s
      WHERE NOT EXISTS (SELECT 1 FROM governed_access_grants g WHERE g.scope_type='REVIEW_ITEM' AND g.scope_id=s.signal_id AND g.revoked_at IS NULL)
      AND NOT EXISTS (SELECT 1 FROM governed_access_grants g WHERE g.scope_type='CASE' AND g.scope_id=s.case_id AND g.capability='CASE_REVIEW' AND g.revoked_at IS NULL)`).run(now);
    db.prepare(`INSERT OR IGNORE INTO governed_legacy_case_triage(case_id,classification,classified_at,migration_version)
      SELECT case_id,'LEGACY_UNASSIGNED',?,'fw01-access/v1' FROM investigation_cases c
      WHERE NOT EXISTS (SELECT 1 FROM governed_access_grants g WHERE g.scope_type='CASE' AND g.scope_id=c.case_id AND g.capability IN ('CASE_OPERATE','CASE_REVIEW') AND g.revoked_at IS NULL)`).run(now);
    db.prepare("INSERT INTO investigation_schema_migrations(version,applied_at) VALUES(15,?)").run(now);
  }
}

export class GovernedAccessService {
  constructor(db, { identities = [], clock = () => new Date(), idProvider = () => randomUUID() } = {}) {
    this.db = db; this.clock = clock; this.idProvider = idProvider;
    this.identities = new Map(identities.map((item) => [item.user_id, item]));
  }
  identity(userId) { const value = this.identities.get(id(userId, "user_id")); if (!value || value.enabled === false) fail("unknown or disabled pilot identity"); return value; }
  tenant(userId) { return this.identity(userId).tenant_id ?? "single-pilot"; }
  isAdmin(userId) { return admin(this.identity(userId)); }
  scopeOwner(type, scopeId) {
    if (type === "FIELD") return this.db.prepare("SELECT owner_user_id FROM lifecycle_fields WHERE field_id=?").get(scopeId)?.owner_user_id;
    if (type === "CASE") return this.db.prepare("SELECT owner_user_id FROM investigation_cases WHERE case_id=?").get(scopeId)?.owner_user_id;
    if (type === "REVIEW_ITEM") return this.db.prepare("SELECT owner_user_id FROM governed_learning_signals WHERE signal_id=?").get(scopeId)?.owner_user_id;
    return null;
  }
  active(userId, scopeType, scopeId, capability) {
    return Boolean(this.db.prepare("SELECT 1 FROM governed_access_grants WHERE subject_user_id=? AND tenant_id=? AND scope_type=? AND scope_id=? AND capability=? AND revoked_at IS NULL LIMIT 1").get(userId,this.tenant(userId),scopeType,scopeId,capability));
  }
  coordinator(userId) { return this.isAdmin(userId) || this.identity(userId).capabilities?.includes("REVIEW_COORDINATE") === true || this.active(userId,"SYSTEM","pilot","REVIEW_COORDINATE"); }
  hasReviewScope(userId) { this.identity(userId);return this.coordinator(userId)||Boolean(this.db.prepare("SELECT 1 FROM governed_access_grants WHERE subject_user_id=? AND tenant_id=? AND capability IN ('CASE_REVIEW','REVIEW_ITEM_REVIEW') AND revoked_at IS NULL LIMIT 1").get(userId,this.tenant(userId))); }
  accessSummary(userId) {
    const identity=this.identity(userId),fields=this.visibleFields(userId),cases=this.visibleCases(userId),reviewItems=this.hasReviewScope(userId)?this.visibleSignals(userId):[];
    const grants=this.db.prepare("SELECT scope_type,capability FROM governed_access_grants WHERE subject_user_id=? AND tenant_id=? AND revoked_at IS NULL ORDER BY scope_type,capability").all(userId,this.tenant(userId));
    const capabilitySet=new Set();
    if(fields.some((item)=>item.owner_user_id===userId))capabilitySet.add("OWNED_FIELD_WORK");
    if(grants.some((item)=>item.scope_type==="FIELD"))capabilitySet.add("ASSIGNED_FIELD_WORK");
    if(grants.some((item)=>item.scope_type==="CASE"&&item.capability==="CASE_OPERATE"))capabilitySet.add("ASSIGNED_CASE_WORK");
    if(this.hasReviewScope(userId))capabilitySet.add("REVIEW_WORK");
    if(this.coordinator(userId))capabilitySet.add("REVIEW_COORDINATION");
    const scopeCounts={FIELD:0,CASE:0,REVIEW_ITEM:0,SYSTEM:0};
    for(const grant of grants)scopeCounts[grant.scope_type]=(scopeCounts[grant.scope_type]??0)+1;
    return {
      authority:"SERVER_SCOPED_ACCESS_PROJECTION",
      identity:{user_id:identity.user_id,role:identity.role,tenant_id:this.tenant(userId)},
      permissions:{can_view_review_inbox:this.hasReviewScope(userId),can_coordinate_review:this.coordinator(userId),can_manage_access:this.coordinator(userId)},
      counts:{owned_field_count:fields.filter((item)=>item.owner_user_id===userId).length,assigned_field_count:fields.filter((item)=>item.owner_user_id!==userId).length,assigned_case_count:cases.filter((item)=>item.owner_user_id!==userId).length,review_assignment_count:grants.filter((item)=>["CASE_REVIEW","REVIEW_ITEM_REVIEW"].includes(item.capability)).length,review_item_count:reviewItems.length},
      capabilities:[...capabilitySet].sort(),
      scopes:Object.entries(scopeCounts).filter(([,count])=>count>0).map(([scope_type,count])=>({scope_type,count}))
    };
  }
  assignmentManagement(userId) {
    if (!this.coordinator(userId)) fail("assignment management capability required");
    const tenantId=this.tenant(userId),sameTenant=(ownerUserId)=>{const owner=this.identities.get(ownerUserId);return owner?.enabled!==false&&(owner?.tenant_id??"single-pilot")===tenantId;};
    const users=[...this.identities.values()].filter((item)=>item.enabled!==false&&sameTenant(item.user_id)).map((item)=>({user_id:item.user_id,display_name:item.display_name??item.login_id??item.user_id,role:item.role,can_self_assign:item.user_id!==userId||this.isAdmin(userId)})).sort((a,b)=>a.display_name.localeCompare(b.display_name));
    const fields=this.db.prepare("SELECT field_id,owner_user_id,name FROM lifecycle_fields ORDER BY name,field_id").all().filter((item)=>sameTenant(item.owner_user_id)).map((item)=>({scope_type:"FIELD",scope_id:item.field_id,label:item.name,owner_user_id:item.owner_user_id}));
    const cases=this.db.prepare("SELECT c.case_id,c.owner_user_id,c.field_id,c.purpose,f.name field_name FROM investigation_cases c JOIN lifecycle_fields f ON f.field_id=c.field_id ORDER BY c.opened_at,c.case_id").all().filter((item)=>sameTenant(item.owner_user_id)).map((item)=>({scope_type:"CASE",scope_id:item.case_id,label:item.purpose||`เคสใน ${item.field_name}`,field_id:item.field_id,owner_user_id:item.owner_user_id}));
    const reviewItems=this.db.prepare("SELECT signal_id,owner_user_id,case_id,signal_class FROM governed_learning_signals ORDER BY created_at,signal_id").all().filter((item)=>sameTenant(item.owner_user_id)).map((item)=>({scope_type:"REVIEW_ITEM",scope_id:item.signal_id,label:`${item.signal_class} · ${item.signal_id}`,case_id:item.case_id,owner_user_id:item.owner_user_id}));
    const labels=new Map([...fields,...cases,...reviewItems].map((item)=>[`${item.scope_type}:${item.scope_id}`,item.label]));
    const assignments=this.db.prepare("SELECT * FROM governed_access_grants WHERE tenant_id=? AND scope_type<>'SYSTEM' ORDER BY granted_at DESC,grant_id DESC").all(tenantId).map((item)=>({grant_id:item.grant_id,subject_user_id:item.subject_user_id,subject_label:users.find((user)=>user.user_id===item.subject_user_id)?.display_name??item.subject_user_id,scope_type:item.scope_type,scope_id:item.scope_id,scope_label:labels.get(`${item.scope_type}:${item.scope_id}`)??"ขอบเขตที่ไม่พร้อมใช้งาน",capability:item.capability,granted_by:item.granted_by,granted_at:item.granted_at,state:item.revoked_at?"REVOKED":"ACTIVE",revoked_at:item.revoked_at??null}));
    return {authority:"SERVER_ASSIGNMENT_MANAGEMENT_PROJECTION",permissions:{can_manage_access:true},users,scopes:[...fields,...cases,...reviewItems],allowed_combinations:[{scope_type:"FIELD",capabilities:["FIELD_OPERATE"]},{scope_type:"CASE",capabilities:["CASE_OPERATE","CASE_REVIEW"]},{scope_type:"REVIEW_ITEM",capabilities:["REVIEW_ITEM_REVIEW"]}],assignments};
  }
  cropSeasons(userId,fieldId) {
    const field=this.db.prepare("SELECT * FROM lifecycle_fields WHERE field_id=?").get(id(fieldId,"field_id"));
    if(!field||!this.canReadField(userId,field))fail("field not found",404);
    const seasons=this.db.prepare("SELECT season_id,field_id,crop,planting_date,expected_planting_date,rice_variety,planting_method,status,created_at,updated_at FROM crop_seasons WHERE owner_user_id=? AND field_id=? ORDER BY CASE status WHEN 'ACTIVE' THEN 0 ELSE 1 END,created_at DESC,season_id").all(field.owner_user_id,field.field_id).map((item)=>({...item,current:item.season_id===field.season_id,authority:"SERVER_FIELD_SEASON_MEMBERSHIP"}));
    return {authority:"SERVER_SCOPED_CROP_SEASONS",field:{field_id:field.field_id,name:field.name,current_season_id:field.season_id},seasons};
  }
  fieldHistory(userId,fieldId,seasonId,loadHistory) {
    const field=this.db.prepare("SELECT * FROM lifecycle_fields WHERE field_id=?").get(id(fieldId,"field_id"));
    if(!field||!this.canReadField(userId,field))fail("field not found",404);
    const season=this.db.prepare("SELECT season_id FROM crop_seasons WHERE season_id=? AND field_id=? AND owner_user_id=?").get(id(seasonId,"season_id"),field.field_id,field.owner_user_id);
    if(!season)fail("crop season not found",404);
    return loadHistory(field.owner_user_id,{field_id:field.field_id,season_id:season.season_id});
  }
  chatContextCandidates(userId) {
    const fields=this.visibleFields(userId),cases=this.visibleCases(userId).filter((item)=>item.status==="OPEN");
    return {authority:"SERVER_SCOPED_CHAT_CONTEXT_CANDIDATES",selection_required:fields.length+cases.length>1,fields:fields.map((item)=>({field_id:item.field_id,season_id:item.season_id,label:item.name,access_kind:item.access_kind,permissions:item.permissions})),cases:cases.map((item)=>({case_id:item.case_id,field_id:item.field_id,season_id:item.season_id,label:item.purpose??item.case_id,access_kind:item.access_kind,permissions:item.permissions}))};
  }
  notifications(userId,{loadDue=null}={}) {
    this.identity(userId);const tenantId=this.tenant(userId),items=[];
    const grants=this.db.prepare("SELECT * FROM governed_access_grants WHERE subject_user_id=? AND tenant_id=? AND scope_type<>'SYSTEM' ORDER BY granted_at,grant_id").all(userId,tenantId);
    for(const grant of grants){
      if(grant.revoked_at){items.push({notification_id:`assignment-revoked:${grant.grant_id}`,category:"ASSIGNMENT_REVOKED",occurred_at:grant.revoked_at,title:"การมอบหมายสิ้นสุดแล้ว",body:`สิทธิ์ ${grant.capability} ไม่สามารถเปิดเป้าหมายเดิมได้อีก`,target:null,target_state:"NO_LONGER_AVAILABLE",authority:"EVENT_PROJECTION_ONLY"});continue;}
      const target=grant.scope_type==="FIELD"?{type:"FIELD",field_id:grant.scope_id}:grant.scope_type==="CASE"?{type:"CASE",case_id:grant.scope_id}:grant.scope_type==="REVIEW_ITEM"?{type:"REVIEW_ITEM",signal_id:grant.scope_id}:null;
      items.push({notification_id:`assignment-created:${grant.grant_id}`,category:"ASSIGNMENT_CREATED",occurred_at:grant.granted_at,title:"ได้รับมอบหมายงาน",body:`${grant.scope_type} · ${grant.capability}`,target,target_state:"REAUTHORIZE_ON_OPEN",authority:"EVENT_PROJECTION_ONLY"});
    }
    const cases=this.visibleCases(userId);
    if(loadDue)for(const caseItem of cases){for(const reminder of loadDue(caseItem)??[])items.push({notification_id:`follow-up-due:${reminder.reminder_id}`,category:"FOLLOW_UP_DUE",occurred_at:reminder.due_at??reminder.created_at,title:"ถึงกำหนดติดตาม",body:reminder.reason??"มีรายการติดตามที่ถึงกำหนด",target:{type:"CASE",case_id:caseItem.case_id},target_state:"REAUTHORIZE_ON_OPEN",authority:"EVENT_PROJECTION_ONLY"});}
    const reviewCount=this.hasReviewScope(userId)?this.visibleSignals(userId).length:0;if(reviewCount)items.push({notification_id:`review-due:${userId}`,category:"REVIEW_DUE",occurred_at:this.clock().toISOString(),title:"มีงานทบทวน",body:`${reviewCount} รายการที่มองเห็นได้ตามสิทธิ์`,target:{type:"REVIEW_INBOX"},target_state:"REAUTHORIZE_ON_OPEN",authority:"EVENT_PROJECTION_ONLY"});
    items.sort((a,b)=>b.occurred_at.localeCompare(a.occurred_at)||a.notification_id.localeCompare(b.notification_id));
    return {authority:"SERVER_GOVERNED_NOTIFICATION_PROJECTION",generated_at:this.clock().toISOString(),read_state_authority:"NOT_IMPLEMENTED",items};
  }
  operationalHome(userId,{loadFields=()=>this.visibleFields(userId),loadCases=()=>this.visibleCases(userId),loadDue=null,loadReview=()=>this.visibleSignals(userId)}={}) {
    this.identity(userId);const canViewReview=this.hasReviewScope(userId),available=(value)=>({status:"AVAILABLE",...value}),unavailable=()=>({status:"UNAVAILABLE"});
    let fields=null,cases=null,fieldCard,caseCard,evidenceCard,dueCard,reviewCard;
    try{fields=loadFields();fieldCard=available({owned_count:fields.filter((item)=>item.owner_user_id===userId).length,assigned_count:fields.filter((item)=>item.owner_user_id!==userId).length,items:fields});}catch{fieldCard=unavailable();}
    try{cases=loadCases();const open=cases.filter((item)=>item.status==="OPEN");caseCard=available({open_count:open.length,assigned_count:open.filter((item)=>item.owner_user_id!==userId).length,items:open});const ids=open.map((item)=>item.case_id);let pending=0;if(ids.length){const placeholders=ids.map(()=>"?").join(",");pending=this.db.prepare(`SELECT COUNT(*) count FROM investigation_observations WHERE case_id IN (${placeholders}) AND review_state IN ('UNREVIEWED','DISPUTED')`).get(...ids).count;}evidenceCard=available({pending_count:pending,case_count:open.length});}catch{caseCard=unavailable();evidenceCard=unavailable();}
    try{const due=loadDue&&cases?cases.flatMap((item)=>loadDue(item)??[]):[];dueCard=available({count:due.length,items:due.map((item)=>({reminder_id:item.reminder_id,case_id:item.case_id,field_id:item.field_id,due_at:item.due_at,status:item.status}))});}catch{dueCard=unavailable();}
    if(canViewReview){try{const items=loadReview();reviewCard=available({count:items.length});}catch{reviewCard=unavailable();}}
    const continueTarget=cases?.find((item)=>item.status==="OPEN")??fields?.[0]??null;
    return {authority:"SERVER_OPERATIONAL_HOME_PROJECTION",generated_at:this.clock().toISOString(),cards:{continue_work:continueTarget?available({target:continueTarget.case_id?{type:"CASE",case_id:continueTarget.case_id,label:continueTarget.purpose??continueTarget.case_id}:{type:"FIELD",field_id:continueTarget.field_id,label:continueTarget.name}}):available({target:null}),fields:fieldCard,cases:caseCard,evidence:evidenceCard,due_followup:dueCard,...(reviewCard?{review_work:reviewCard}:{}),quick_actions:available({actions:["CREATE_FIELD","OPEN_FIELDS","OPEN_LEARNING",...(canViewReview?["OPEN_REVIEW"]:[])]})}};
  }
  grant(actorUserId, input) {
    id(actorUserId,"actor_user_id"); if (!this.coordinator(actorUserId)) fail("grant authority required");
    const subject = id(input?.subject_user_id,"subject_user_id"), type = id(input?.scope_type,"scope_type"), scopeId = id(input?.scope_id,"scope_id"), capability = id(input?.capability,"capability");
    if (!SCOPES.has(type) || !CAPABILITIES.has(capability)) fail("unsupported grant",400);
    if (type === "SYSTEM" ? (scopeId !== "pilot" || capability !== "REVIEW_COORDINATE" || !this.isAdmin(actorUserId)) : !this.scopeOwner(type,scopeId)) fail("invalid grant scope");
    if (type === "FIELD" && capability !== "FIELD_OPERATE" || type === "CASE" && !["CASE_OPERATE","CASE_REVIEW"].includes(capability) || type === "REVIEW_ITEM" && capability !== "REVIEW_ITEM_REVIEW") fail("capability and scope mismatch",400);
    const owner = type === "SYSTEM" ? actorUserId : this.scopeOwner(type,scopeId);
    if (this.tenant(subject) !== this.tenant(owner) || this.tenant(actorUserId) !== this.tenant(owner)) fail("cross-tenant grant denied");
    if (subject === actorUserId && !this.isAdmin(actorUserId)) fail("self-assignment denied");
    const reason = String(input?.reason ?? "").trim(); if (!reason || reason.length > 1000) fail("grant reason required",400);
    if (this.active(subject,type,scopeId,capability)) fail("active grant already exists",409);
    const grant = { grant_id:`access-${this.idProvider()}`, subject_user_id:subject, tenant_id:this.tenant(subject), scope_type:type, scope_id:scopeId, capability, granted_by:actorUserId, granted_at:this.clock().toISOString(), grant_reason:reason, revoked_by:null, revoked_at:null, revoke_reason:null };
    this.db.prepare("INSERT INTO governed_access_grants VALUES(?,?,?,?,?,?,?,?,?,?,?,?)").run(...Object.values(grant));
    return grant;
  }
  revoke(actorUserId, grantId, reason) {
    if (!this.coordinator(actorUserId)) fail("revoke authority required");
    const grant = this.db.prepare("SELECT * FROM governed_access_grants WHERE grant_id=? AND revoked_at IS NULL").get(id(grantId,"grant_id")); if (!grant) fail("active grant not found",404);
    if (this.tenant(actorUserId) !== grant.tenant_id) fail("cross-tenant revocation denied");
    const note = String(reason ?? "").trim(); if (!note || note.length > 1000) fail("revoke reason required",400);
    const revokedAt = this.clock().toISOString(); this.db.prepare("UPDATE governed_access_grants SET revoked_by=?,revoked_at=?,revoke_reason=? WHERE grant_id=? AND revoked_at IS NULL").run(actorUserId,revokedAt,note,grantId);
    return { ...grant, revoked_by:actorUserId, revoked_at:revokedAt, revoke_reason:note };
  }
  canReviewSignal(userId, signal) {
    if (this.tenant(userId) !== this.tenant(signal.owner_user_id)) return false;
    if (this.isAdmin(userId) || this.coordinator(userId)) return true;
    return this.active(userId,"REVIEW_ITEM",signal.signal_id,"REVIEW_ITEM_REVIEW") || Boolean(signal.case_id && this.active(userId,"CASE",signal.case_id,"CASE_REVIEW"));
  }
  canReadCase(userId, caseRow) {
    if (this.tenant(userId) !== this.tenant(caseRow.owner_user_id)) return false;
    if (caseRow.owner_user_id === userId || this.isAdmin(userId)) return true;
    return this.active(userId,"CASE",caseRow.case_id,"CASE_REVIEW") || this.active(userId,"CASE",caseRow.case_id,"CASE_OPERATE") || this.active(userId,"FIELD",caseRow.field_id,"FIELD_OPERATE");
  }
  canOperateCase(userId,caseRow){if(this.tenant(userId)!==this.tenant(caseRow.owner_user_id))return false;return caseRow.owner_user_id===userId||this.isAdmin(userId)||this.active(userId,"CASE",caseRow.case_id,"CASE_OPERATE")||this.active(userId,"FIELD",caseRow.field_id,"FIELD_OPERATE");}
  canOperateField(userId,fieldRow){if(this.tenant(userId)!==this.tenant(fieldRow.owner_user_id))return false;return fieldRow.owner_user_id===userId||this.isAdmin(userId)||this.active(userId,"FIELD",fieldRow.field_id,"FIELD_OPERATE");}
  fieldPermissions(userId,fieldRow){const operate=this.canOperateField(userId,fieldRow);return{field_view:this.canReadField(userId,fieldRow),field_edit:fieldRow.owner_user_id===userId||this.isAdmin(userId),case_investigate:operate,case_create:operate};}
  casePermissions(userId,caseRow){return{case_view:this.canReadCase(userId,caseRow),case_investigate:this.canOperateCase(userId,caseRow),review_perform:this.canReviewObservation(userId,caseRow)};}
  linkCaseLineage(actorUserId,input){const sourceId=id(input?.source_case_id,"source_case_id"),targetId=id(input?.target_case_id,"target_case_id"),action=id(input?.action,"action"),source=this.db.prepare("SELECT * FROM investigation_cases WHERE case_id=?").get(sourceId),target=this.db.prepare("SELECT * FROM investigation_cases WHERE case_id=?").get(targetId);if(!source||!target||sourceId===targetId||source.owner_user_id!==target.owner_user_id||source.field_id!==target.field_id||source.season_id!==target.season_id)fail("case lineage scope mismatch");if(!this.canOperateCase(actorUserId,source)||!this.canOperateCase(actorUserId,target))fail("case operation scope required");if(!["SPLIT_LINK","MERGE_LINK"].includes(action))fail("unsupported case lineage action",400);const reason=String(input.reason??"").trim();if(!reason||reason.length>2000)fail("lineage reason required",400);const event={lineage_event_id:`case-lineage-${this.idProvider()}`,owner_user_id:source.owner_user_id,field_id:source.field_id,season_id:source.season_id,source_case_id:sourceId,target_case_id:targetId,action,actor_user_id:actorUserId,reason,created_at:this.clock().toISOString(),records_moved:false,source_case_preserved:true,target_case_preserved:true};this.db.prepare("INSERT INTO governed_case_lineage_events VALUES(?,?,?,?,?,?,?,?,?,?)").run(event.lineage_event_id,event.owner_user_id,event.field_id,event.season_id,event.source_case_id,event.target_case_id,event.action,event.actor_user_id,event.reason,event.created_at);return event;}
  caseLineage(userId,caseId){const row=this.db.prepare("SELECT * FROM investigation_cases WHERE case_id=?").get(id(caseId,"case_id"));if(!row||!this.canReadCase(userId,row))fail("case lineage not found",404);return this.db.prepare("SELECT * FROM governed_case_lineage_events WHERE source_case_id=? OR target_case_id=? ORDER BY created_at,lineage_event_id").all(caseId,caseId).filter((event)=>{const other=this.db.prepare("SELECT * FROM investigation_cases WHERE case_id=?").get(event.source_case_id===caseId?event.target_case_id:event.source_case_id);return other&&this.canReadCase(userId,other);});}
  canReadField(userId, fieldRow) {
    if(this.tenant(userId)!==this.tenant(fieldRow.owner_user_id))return false;
    return fieldRow.owner_user_id===userId||this.isAdmin(userId)||this.active(userId,"FIELD",fieldRow.field_id,"FIELD_OPERATE");
  }
  visibleFields(userId) {
    return this.db.prepare("SELECT field_id,owner_user_id,name,season_id,area_json,crop_profile_json,updated_at FROM lifecycle_fields ORDER BY name,field_id").all().filter((row)=>this.canReadField(userId,row)).map((row)=>({field_id:row.field_id,owner_user_id:row.owner_user_id,name:row.name,season_id:row.season_id,area:JSON.parse(row.area_json??"null"),crop_profile:JSON.parse(row.crop_profile_json),updated_at:row.updated_at,access_kind:row.owner_user_id===userId?"OWNED":"ASSIGNED",permissions:this.fieldPermissions(userId,row),authority:"SCOPED_FIELD_VISIBILITY"}));
  }
  visibleCases(userId) {
    return this.db.prepare("SELECT * FROM investigation_cases ORDER BY opened_at,case_id").all().filter((row)=>this.canReadCase(userId,row)).map((row)=>({case_id:row.case_id,owner_user_id:row.owner_user_id,field_id:row.field_id,season_id:row.season_id,status:row.status,purpose:row.purpose,opened_at:row.opened_at,access_kind:row.owner_user_id===userId?"OWNED":"ASSIGNED",permissions:this.casePermissions(userId,row),authority:"SCOPED_CASE_VISIBILITY"}));
  }
  canReadAttachment(userId, attachment) {
    if (this.tenant(userId) !== this.tenant(attachment.owner_user_id)) return false;
    if (attachment.owner_user_id === userId || this.isAdmin(userId)) return true;
    if (this.active(userId,"FIELD",attachment.field_id,"FIELD_OPERATE") || this.active(userId,"CASE",attachment.case_id,"CASE_OPERATE") || this.active(userId,"CASE",attachment.case_id,"CASE_REVIEW")) return true;
    return false;
  }
  visibleSignals(userId) {
    this.identity(userId); const rows = this.db.prepare("SELECT signal_id,owner_user_id,case_id FROM governed_learning_signals ORDER BY created_at,signal_id").all();
    return rows.filter((row) => this.canReviewSignal(userId,row)).map((row) => row.signal_id);
  }
  legacyTriage(userId) {
    if (!this.coordinator(userId)) fail("triage capability required");
    return this.db.prepare("SELECT t.signal_id,t.classification,t.classified_at,s.owner_user_id,s.field_id,s.case_id FROM governed_legacy_review_triage t JOIN governed_learning_signals s ON s.signal_id=t.signal_id ORDER BY t.classified_at,t.signal_id").all().filter((row) => this.tenant(userId)===this.tenant(row.owner_user_id)&&!this.db.prepare("SELECT 1 FROM governed_access_grants WHERE revoked_at IS NULL AND (scope_type='REVIEW_ITEM' AND scope_id=? OR scope_type='CASE' AND scope_id=? AND capability='CASE_REVIEW') LIMIT 1").get(row.signal_id,row.case_id));
  }
  legacyCaseTriage(userId) {
    if (!this.coordinator(userId)) fail("triage capability required");
    return this.db.prepare("SELECT t.case_id,t.classification,t.classified_at,c.owner_user_id,c.field_id,c.season_id FROM governed_legacy_case_triage t JOIN investigation_cases c ON c.case_id=t.case_id ORDER BY t.classified_at,t.case_id").all().filter((row)=>this.tenant(userId)===this.tenant(row.owner_user_id)&&!this.db.prepare("SELECT 1 FROM governed_access_grants WHERE scope_type='CASE' AND scope_id=? AND capability IN ('CASE_OPERATE','CASE_REVIEW') AND revoked_at IS NULL LIMIT 1").get(row.case_id));
  }
  canReviewObservation(userId, observation) {
    if (!observation.case_id || this.tenant(userId)!==this.tenant(observation.owner_user_id)) return false;
    return this.isAdmin(userId)||this.active(userId,"CASE",observation.case_id,"CASE_REVIEW");
  }
  reviewObservation(reviewerUserId,input) {
    const observationId=id(input?.observation_id,"observation_id"),observation=this.db.prepare("SELECT * FROM investigation_observations WHERE observation_id=?").get(observationId);
    if (!observation || !this.canReviewObservation(reviewerUserId,observation)) fail("observation review scope required");
    const action=id(input.action,"action"),allowed=new Set(["CONFIRM","CONTRADICT","CORRECT","INSUFFICIENT_EVIDENCE"]);
    if(!allowed.has(action))fail("invalid review action",400);
    const expected=Number(input.expected_revision);if(!Number.isInteger(expected)||expected!==observation.revision)fail("observation revision changed",409);
    if(!["UNREVIEWED","DISPUTED"].includes(observation.review_state))fail("observation already reviewed",409);
    const reason=String(input.reason??"").trim();if(!reason||reason.length>2000)fail("review reason required",400);
    const evidenceIds=input.evidence_ids;if(!Array.isArray(evidenceIds)||evidenceIds.length<1||evidenceIds.length>30||new Set(evidenceIds).size!==evidenceIds.length)fail("evidence references required",400);
    for(const evidenceId of evidenceIds){const row=this.db.prepare("SELECT owner_user_id,case_id,observation_id FROM investigation_evidence WHERE evidence_id=?").get(id(evidenceId,"evidence_id"));if(!row||row.owner_user_id!==observation.owner_user_id||row.case_id!==observation.case_id||row.observation_id!==observationId)fail("evidence outside observation scope");}
    const correction=action==="CORRECT"?String(input.corrected_note??"").trim():null;if(action==="CORRECT"&&(!correction||correction.length>2000||correction===observation.note))fail("distinct corrected observation required",400);
    const now=this.clock().toISOString(),newState=action==="CONFIRM"?"HUMAN_REVIEWED":action==="CORRECT"?"SUPERSEDED":action==="CONTRADICT"?"DISPUTED":observation.review_state,correctedId=action==="CORRECT"?`observation-${this.idProvider()}`:null;
    const event={review_event_id:`observation-review-${this.idProvider()}`,observation_id:observationId,owner_user_id:observation.owner_user_id,case_id:observation.case_id,reviewer_user_id:reviewerUserId,action,previous_state:observation.review_state,new_state:newState,evidence_ids:evidenceIds,reason,corrected_observation_id:correctedId,previous_snapshot:observation,created_at:now};
    this.db.exec("BEGIN IMMEDIATE");try{
      const changed=this.db.prepare("UPDATE investigation_observations SET review_state=?,updated_at=?,revision=revision+1 WHERE observation_id=? AND revision=?").run(newState,now,observationId,expected).changes;if(changed!==1)fail("observation revision changed",409);
      if(correctedId)this.db.prepare("INSERT INTO investigation_observations(observation_id,owner_user_id,field_id,season_id,case_id,stage_assessment_id,observed_at,source,confidence,review_state,note,created_at,updated_at,revision) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,1)").run(correctedId,observation.owner_user_id,observation.field_id,observation.season_id,observation.case_id,observation.stage_assessment_id,now,"HUMAN_CORRECTION",observation.confidence,"HUMAN_REVIEWED",correction,now,now);
      this.db.prepare("INSERT INTO governed_observation_review_events VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)").run(event.review_event_id,observationId,observation.owner_user_id,observation.case_id,reviewerUserId,action,event.previous_state,newState,JSON.stringify(evidenceIds),reason,correctedId,JSON.stringify(observation),now);
      this.db.exec("COMMIT");
    }catch(error){this.db.exec("ROLLBACK");throw error;}
    return {...event,corrected_note:correction};
  }
}
