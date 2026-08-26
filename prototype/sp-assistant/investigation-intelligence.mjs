import { createHash, randomUUID } from "node:crypto";
import { InvestigationContractError } from "./investigation-backbone.mjs";

export const INVESTIGATION_INTELLIGENCE_ENUMS = Object.freeze({
  candidateStates:["OPEN","INSUFFICIENT","SUPPORTED","WEAKENED","STRONGLY_SUPPORTED","REQUIRES_EXPERT_REVIEW","RESOLVED","NOT_SUPPORTED"],
  evidenceRelations:["SUPPORTS","WEAKLY_SUPPORTS","NEUTRAL","CONTRADICTS","STRONGLY_CONTRADICTS","REQUIRED_BUT_MISSING","NOT_APPLICABLE"],
  compatibilityDimensions:["BIOLOGICAL_STAGE","SPATIAL","MORPHOLOGY","SEVERITY","SAMPLING","ENVIRONMENT","MANAGEMENT_HISTORY","ABIOTIC","TEMPORAL","VISUAL"],
  compatibilityValues:["SUPPORTIVE","NEUTRAL","CONTRADICTORY","UNKNOWN"],
  constraints:["REQUIRED","TYPICAL","COMMON","POSSIBLE","CONTRADICTORY"],
  sufficiencyStates:["INSUFFICIENT_FOR_NARROWING","SUFFICIENT_FOR_NARROWING","SUFFICIENT_FOR_MANAGEMENT_OPTION_REVIEW","SUFFICIENT_FOR_HUMAN_FINDING","REQUIRES_SPECIALIST_CONFIRMATION","UNRESOLVABLE_WITH_CURRENT_FIELD_EVIDENCE"],
  nextEvidenceTypes:["QUESTION","PHOTO","FIELD_CHECK","SAMPLING","COUNT","MEASUREMENT","COMPARISON_SITE","MANAGEMENT_RECORD","WEATHER_CONTEXT","EXPERT_REVIEW","LAB_TEST"],
  valueBands:["HIGH","MEDIUM","LOW"],
  stopConditions:["ENOUGH_FOR_CURRENT_DECISION","USER_DECLINED","EXPERT_REVIEW_REQUIRED","LAB_EVIDENCE_REQUIRED","FIELD_EVIDENCE_EXHAUSTED","CASE_RESOLVED"],
  reviewActions:["ACCEPT","CORRECT","REQUEST_MORE_EVIDENCE","MARK_UNRESOLVED","RESOLVE_FINDING"],
  resolutionLevels:["FIELD_PLAUSIBLE","FIELD_SUPPORTED","FIELD_STRONGLY_SUPPORTED","FIELD_REVIEWED_FINDING","SPECIALIST_CONFIRMED","LAB_CONFIRMED","AUTHORITY_REFERENCE_MATCH"],
  findingRoles:["PRIMARY_FINDING","CONTRIBUTING_FACTOR","COEXISTING_CONDITION"],
});

const sets=Object.fromEntries(Object.entries(INVESTIGATION_INTELLIGENCE_ENUMS).map(([key,values])=>[key,new Set(values)]));
const stableJson=(value)=>Array.isArray(value)?`[${value.map(stableJson).join(",")}]`:value&&typeof value==="object"?`{${Object.keys(value).sort().map((key)=>`${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`:JSON.stringify(value);
const hash=(value)=>createHash("sha256").update(stableJson(value)).digest("hex");
const fail=(message,code="VALIDATION_ERROR",status=code==="AUTHORIZATION_ERROR"?403:400)=>{throw new InvestigationContractError(message,code,status);};
const object=(value,name)=>{if(!value||typeof value!=="object"||Array.isArray(value))fail(`${name} must be an object`);return value;};
const id=(value,name)=>{if(typeof value!=="string"||!/^[A-Za-z0-9._:-]{1,128}$/.test(value))fail(`invalid ${name}`);return value;};
const text=(value,name,max=2_000)=>{if(typeof value!=="string"||!value.trim()||value.length>max)fail(`invalid ${name}`);return value.trim();};
const member=(value,set,name)=>{if(!set.has(value))fail(`invalid ${name}`);return value;};
const allowed=(value,keys,name)=>{const extra=Object.keys(value).filter((key)=>!keys.includes(key));if(extra.length)fail(`${name} contains unsupported field: ${extra[0]}`);};
const optionalText=(value,name,max=2_000)=>value==null?null:text(value,name,max);
const stripOperationalTimes=(value)=>Array.isArray(value)?value.map(stripOperationalTimes):value&&typeof value==="object"?Object.fromEntries(Object.entries(value).filter(([key])=>!["created_at","updated_at"].includes(key)).map(([key,child])=>[key,stripOperationalTimes(child)])):value;

const dimensionByRecordType=Object.freeze({SPATIAL:"SPATIAL",MORPHOLOGY:"MORPHOLOGY",SEVERITY_MEASUREMENT:"SEVERITY",SAMPLING:"SAMPLING",WEATHER:"ENVIRONMENT",WATER:"ENVIRONMENT",MANAGEMENT_EVENT:"MANAGEMENT_HISTORY",TEMPORAL_EVIDENCE:"TEMPORAL",TEMPORAL_RELATIONSHIP:"TEMPORAL",STAGE_ASSESSMENT:"BIOLOGICAL_STAGE"});
const relationByPersistedLink=Object.freeze({SUPPORTING:"SUPPORTS",CONTRADICTING:"CONTRADICTS",MISSING:"REQUIRED_BUT_MISSING"});
const compatibilityTemplate=()=>Object.fromEntries(INVESTIGATION_INTELLIGENCE_ENUMS.compatibilityDimensions.map((dimension)=>[dimension,"UNKNOWN"]));

function authoritativeProjection(bundle){
  return stripOperationalTimes({authority:bundle.authority,user_id:bundle.user_id,field_id:bundle.field_id,season_id:bundle.season_id,stage_assessment:bundle.stage_assessment,cases:bundle.cases,observations:bundle.observations,evidence:bundle.evidence,management_events:bundle.management_events,candidates:bundle.candidates,temporal_evidence:bundle.temporal_evidence,temporal_relationships:bundle.temporal_relationships,follow_up_plans:bundle.follow_up_plans,outcomes:bundle.outcomes});
}

function sourceIndex(bundle){
  const index=new Map(),add=(recordType,recordId,record)=>{if(recordId)index.set(recordId,{record_type:recordType,record});};
  add("STAGE_ASSESSMENT",bundle.stage_assessment?.stage_assessment_id,bundle.stage_assessment);
  for(const record of bundle.observations??[])add("OBSERVATION",record.observation_id,record);
  for(const record of bundle.evidence??[])add(record.evidence_type,record.evidence_id,record);
  for(const record of bundle.management_events??[])add("MANAGEMENT_EVENT",record.management_event_id,record);
  for(const record of bundle.temporal_evidence??[])add("TEMPORAL_EVIDENCE",record.temporal_evidence_id,record);
  for(const record of bundle.temporal_relationships??[])add("TEMPORAL_RELATIONSHIP",record.temporal_relationship_id,record);
  return index;
}

function validateNextRequest(value,candidateId,gapRef){
  object(value,"next_best_evidence"); allowed(value,["type","target","comparison","purpose","discrimination_goal","value","reason","related_candidate_ids","existing_evidence_gap_refs","stop_if"],"next_best_evidence");
  const related=(value.related_candidate_ids??(candidateId?[candidateId]:[])).map((entry)=>id(entry,"related_candidate_id"));
  if(!related.length)fail("next_best_evidence requires related_candidate_ids");
  const gaps=(value.existing_evidence_gap_refs??[gapRef]).filter(Boolean).map((entry)=>id(entry,"evidence_gap_ref"));
  return {type:member(value.type,sets.nextEvidenceTypes,"next evidence type"),target:text(value.target,"next evidence target",200),comparison:optionalText(value.comparison,"next evidence comparison",200),purpose:text(value.purpose,"next evidence purpose",500),discrimination_goal:text(value.discrimination_goal,"discrimination_goal",500),value:member(value.value,sets.valueBands,"next evidence value"),reason:text(value.reason,"next evidence reason",1_000),related_candidate_ids:[...new Set(related)],existing_evidence_gap_refs:[...new Set(gaps)],stop_if:optionalText(value.stop_if,"stop_if",500)};
}

function normalizeProvider(provider,bundle){
  const raw=provider?.getRules?.(bundle)??{},version=text(raw.rule_version??provider?.version??"persisted-candidate-links/v1","rule_version",200),rules=Array.isArray(raw.rules)?raw.rules:[];
  const config={rule_version:version,rule_authority:member(raw.rule_authority??provider?.authority,new Set(["PERSISTED_EXPLICIT_RELATIONS","GOVERNED_KNOWLEDGE_RELATIONSHIP","BOUNDED_RUNTIME_RULE"]),"rule_authority"),rule_review_state:member(raw.rule_review_state??provider?.reviewState,new Set(["EXPLICITLY_AUTHORED","HUMAN_REVIEWED","DOMAIN_APPROVED"]),"rule_review_state"),rules,stop_condition:raw.stop_condition??null,sufficiency_state:raw.sufficiency_state??null,field_evidence_exhausted:raw.field_evidence_exhausted===true,specialist_confirmation_required:raw.specialist_confirmation_required===true,next_best_evidence:Array.isArray(raw.next_best_evidence)?raw.next_best_evidence:[]};
  if(config.stop_condition!=null)member(config.stop_condition,sets.stopConditions,"stop_condition");
  if(config.sufficiency_state!=null)member(config.sufficiency_state,sets.sufficiencyStates,"sufficiency_state");
  return config;
}

function validatedRule(raw,candidates,sources){
  object(raw,"rule"); allowed(raw,["rule_id","candidate_id","dimension","relation","constraint","reason","source_refs","missing_evidence","next_best_evidence","semantic_basis","negative_feature","inspection_method_appropriate"],"rule");
  const candidateId=id(raw.candidate_id,"candidate_id"); if(!candidates.has(candidateId))fail("rule candidate is outside the authoritative bundle");
  const relation=member(raw.relation,sets.evidenceRelations,"evidence relation"),dimension=member(raw.dimension,sets.compatibilityDimensions,"compatibility dimension"),constraint=member(raw.constraint,sets.constraints,"constraint"),ruleId=id(raw.rule_id,"rule_id"),refs=[];
  for(const ref of raw.source_refs??[]){object(ref,"source_ref");allowed(ref,["record_type","record_id"],"source_ref");const recordId=id(ref.record_id,"source record id"),source=sources.get(recordId);if(!source||source.record_type!==ref.record_type)fail("rule source is outside the authoritative bundle");refs.push({record_type:ref.record_type,record_id:recordId,record:source.record});}
  if(!["REQUIRED_BUT_MISSING","NOT_APPLICABLE"].includes(relation)&&refs.length===0)fail("adjudication rule requires an authoritative source reference");
  let missing=null,next=null;
  if(relation==="REQUIRED_BUT_MISSING"){
    object(raw.missing_evidence,"missing_evidence");allowed(raw.missing_evidence,["gap_ref","concept","importance","reason"],"missing_evidence");
    missing={gap_ref:id(raw.missing_evidence.gap_ref,"gap_ref"),concept:text(raw.missing_evidence.concept,"missing concept",200),importance:member(raw.missing_evidence.importance,new Set(["REQUIRED","USEFUL"]),"missing importance"),reason:text(raw.missing_evidence.reason,"missing reason",1_000),rule_ref:ruleId};
    if(raw.next_best_evidence)next=validateNextRequest(raw.next_best_evidence,candidateId,missing.gap_ref);
  }
  return {rule_id:ruleId,candidate_id:candidateId,dimension,relation,constraint,reason:text(raw.reason,"rule reason",1_000),source_refs:refs,missing,next,semantic_basis:raw.semantic_basis??null,negative_feature:raw.negative_feature??null,inspection_method_appropriate:raw.inspection_method_appropriate===true};
}

function negativeEvidenceRelation(rule,uncertainty){
  if(rule.semantic_basis!=="NEGATIVE_EVIDENCE")return rule.relation;
  const feature=optionalText(rule.negative_feature,"negative_feature",200),entries=rule.source_refs.flatMap((ref)=>ref.record?.negative_evidence??[]),entry=entries.find((item)=>!feature||item.feature===feature);
  const valid=entry?.state==="SEARCHED_NOT_FOUND"&&entry.target_observable===true&&Boolean(entry.search_method)&&rule.inspection_method_appropriate;
  if(valid)return rule.relation;
  uncertainty.push({code:"NEGATIVE_EVIDENCE_NOT_DISPOSITIVE",candidate_id:rule.candidate_id,rule_ref:rule.rule_id,reason:"The recorded state, observability, or inspection-method basis does not support treating non-detection as contradiction."});
  return "NEUTRAL";
}

function relationEntry({relation,dimension,constraint,reason,ruleRef,sourceRef}){
  return {evidence_id:sourceRef?.record_id??null,source_type:sourceRef?.record_type??null,relation,dimension,constraint,reason,rule_ref:ruleRef};
}

function addRelation(map,entry){
  const key=[entry.relation,entry.dimension,entry.evidence_id??"missing"].join(":");
  if(!map.has(key))map.set(key,entry);
}

function updateCompatibility(compatibility,dimension,relation,uncertainty,candidateId){
  const next=["SUPPORTS","WEAKLY_SUPPORTS"].includes(relation)?"SUPPORTIVE":["CONTRADICTS","STRONGLY_CONTRADICTS"].includes(relation)?"CONTRADICTORY":relation==="NEUTRAL"?"NEUTRAL":null;
  if(!next)return;
  const current=compatibility[dimension];
  if(current==="UNKNOWN"||current===next)compatibility[dimension]=next;
  else {compatibility[dimension]="NEUTRAL";uncertainty.push({code:"CONFLICTING_EVIDENCE_IN_DIMENSION",candidate_id:candidateId,dimension,reason:"Authoritative relationships provide both supportive and contradictory indications in this dimension."});}
}

function candidateState(candidate,supporting,contradicting,missing,config){
  if(candidate.support_state==="RESOLVED"&&["HUMAN_REVIEWED","DOMAIN_APPROVED"].includes(candidate.review_state)&&supporting.length)return "RESOLVED";
  if(config.specialist_confirmation_required)return "REQUIRES_EXPERT_REVIEW";
  const requiredContradiction=contradicting.some((item)=>item.constraint==="REQUIRED"&&item.relation==="STRONGLY_CONTRADICTS");
  if(requiredContradiction)return "NOT_SUPPORTED";
  if(contradicting.length)return "WEAKENED";
  if(supporting.length)return candidate.support_state==="STRONGLY_SUPPORTED"?"STRONGLY_SUPPORTED":"SUPPORTED";
  if(missing.length)return "INSUFFICIENT";
  return "OPEN";
}

function selectNextEvidence(requests,stopCondition){
  let eligible=requests;
  if(["ENOUGH_FOR_CURRENT_DECISION","USER_DECLINED","CASE_RESOLVED"].includes(stopCondition))return null;
  if(["EXPERT_REVIEW_REQUIRED","LAB_EVIDENCE_REQUIRED","FIELD_EVIDENCE_EXHAUSTED"].includes(stopCondition))eligible=requests.filter((item)=>["EXPERT_REVIEW","LAB_TEST"].includes(item.type));
  const valueOrder={HIGH:0,MEDIUM:1,LOW:2},typeOrder={FIELD_CHECK:0,MEASUREMENT:1,COUNT:2,SAMPLING:3,COMPARISON_SITE:4,MANAGEMENT_RECORD:5,WEATHER_CONTEXT:6,PHOTO:7,QUESTION:8,EXPERT_REVIEW:9,LAB_TEST:10};
  return [...eligible].sort((a,b)=>valueOrder[a.value]-valueOrder[b.value]||Number(b.related_candidate_ids.length>1)-Number(a.related_candidate_ids.length>1)||typeOrder[a.type]-typeOrder[b.type]||a.target.localeCompare(b.target))[0]??null;
}

export class PersistedCandidateRuleProvider { constructor(version="persisted-candidate-links/v1"){this.version=version;this.authority="PERSISTED_EXPLICIT_RELATIONS";this.reviewState="EXPLICITLY_AUTHORED";} getRules(){return {rule_version:this.version,rule_authority:this.authority,rule_review_state:this.reviewState,rules:[]};} }

export class StaticInvestigationRuleProvider {
  constructor(configuration){this.configuration=structuredClone(configuration);this.version=configuration.rule_version;}
  getRules(){return structuredClone(this.configuration);}
}

export class InvestigationIntelligenceEngine {
  constructor({ruleProvider=new PersistedCandidateRuleProvider(),clock=()=>new Date()}={}){this.ruleProvider=ruleProvider;this.clock=clock;}
  assess(bundle){
    object(bundle,"investigation bundle"); if(bundle.authority!=="SERVER")fail("only an authoritative server Investigation Bundle may be assessed");
    const config=normalizeProvider(this.ruleProvider,bundle),sources=sourceIndex(bundle),candidates=new Map((bundle.candidates??[]).map((candidate)=>[candidate.candidate_id,candidate])),rules=config.rules.map((rule)=>validatedRule(rule,candidates,sources)),uncertainty=[],requests=[];
    const assessments=[...candidates.values()].sort((a,b)=>a.candidate_id.localeCompare(b.candidate_id)).map((candidate)=>{
      const compatibility=compatibilityTemplate(),relations=new Map(),missing=new Map();
      for(const link of candidate.evidence_links??[]){
        const relation=relationByPersistedLink[link.relation];
        if(relation==="REQUIRED_BUT_MISSING"){
          const concept=link.missing_description??"INDEPENDENT_SUPPORTING_EVIDENCE",gap={gap_ref:link.candidate_evidence_link_id,concept,importance:"REQUIRED",reason:link.rationale??"An explicitly persisted candidate evidence requirement remains missing.",rule_ref:`candidate-link:${link.candidate_evidence_link_id}`};missing.set(concept,gap);continue;
        }
        const source=sources.get(link.evidence_id); if(!source)continue; const dimension=dimensionByRecordType[source.record_type]??"ABIOTIC",entry=relationEntry({relation,dimension,constraint:"POSSIBLE",reason:link.rationale??"Explicit persisted candidate-evidence relationship.",ruleRef:`candidate-link:${link.candidate_evidence_link_id}`,sourceRef:{record_id:link.evidence_id,record_type:source.record_type}});addRelation(relations,entry);updateCompatibility(compatibility,dimension,relation,uncertainty,candidate.candidate_id);
      }
      for(const rule of rules.filter((item)=>item.candidate_id===candidate.candidate_id)){
        const relation=negativeEvidenceRelation(rule,uncertainty);
        if(rule.missing){missing.set(rule.missing.concept,rule.missing);if(rule.next)requests.push(rule.next);continue;}
        if(relation==="NOT_APPLICABLE")continue;
        for(const sourceRef of rule.source_refs){const entry=relationEntry({relation,dimension:rule.dimension,constraint:rule.constraint,reason:rule.reason,ruleRef:rule.rule_id,sourceRef});addRelation(relations,entry);}
        updateCompatibility(compatibility,rule.dimension,relation,uncertainty,candidate.candidate_id);
      }
      if(relations.size===0&&missing.size===0)missing.set("INDEPENDENT_SUPPORTING_EVIDENCE",{gap_ref:`candidate-gap-${candidate.candidate_id}`,concept:"INDEPENDENT_SUPPORTING_EVIDENCE",importance:"REQUIRED",reason:"The persisted hypothesis has no explicit authoritative supporting, contradicting, or missing-evidence relationship.",rule_ref:"candidate-authorship-boundary/v1"});
      const entries=[...relations.values()],supporting=entries.filter((item)=>["SUPPORTS","WEAKLY_SUPPORTS"].includes(item.relation)),contradicting=entries.filter((item)=>["CONTRADICTS","STRONGLY_CONTRADICTS"].includes(item.relation)),neutral=entries.filter((item)=>item.relation==="NEUTRAL"),missingEvidence=[...missing.values()];
      return {candidate_id:candidate.candidate_id,candidate_class:candidate.candidate_class,label:candidate.label??null,state:candidateState(candidate,supporting,contradicting,missingEvidence,config),persisted_hypothesis_state:candidate.support_state,review_state:candidate.review_state,consideration_basis:{type:"PERSISTED_AUTHORED_CANDIDATE",candidate_id:candidate.candidate_id},compatibility,supporting_evidence:supporting,contradicting_evidence:contradicting,neutral_evidence:neutral,missing_evidence:missingEvidence,resolution_role:null,resolution_level:null};
    });
    for(const request of config.next_best_evidence)requests.push(validateNextRequest(request,null,null));
    for(const request of requests)if(request.related_candidate_ids.some((candidateId)=>!candidates.has(candidateId)))fail("next_best_evidence references a Candidate outside the authoritative bundle");
    const anySupport=assessments.some((item)=>item.supporting_evidence.length),hasDifferentiation=assessments.some((item)=>item.contradicting_evidence.length||item.missing_evidence.length),resolved=assessments.some((item)=>item.state==="RESOLVED")&&assessments.every((item)=>["RESOLVED","NOT_SUPPORTED"].includes(item.state));
    let sufficiency=config.sufficiency_state??(!assessments.length?"INSUFFICIENT_FOR_NARROWING":config.field_evidence_exhausted?"UNRESOLVABLE_WITH_CURRENT_FIELD_EVIDENCE":config.specialist_confirmation_required?"REQUIRES_SPECIALIST_CONFIRMATION":anySupport&&hasDifferentiation?"SUFFICIENT_FOR_NARROWING":"INSUFFICIENT_FOR_NARROWING");
    let stop=config.stop_condition??(resolved?"CASE_RESOLVED":config.field_evidence_exhausted?"FIELD_EVIDENCE_EXHAUSTED":config.specialist_confirmation_required?"EXPERT_REVIEW_REQUIRED":null),next=selectNextEvidence(requests,stop);
    const resultState=!assessments.length?"NO_CANDIDATES_AVAILABLE":["UNRESOLVABLE_WITH_CURRENT_FIELD_EVIDENCE","REQUIRES_SPECIALIST_CONFIRMATION"].includes(sufficiency)?"UNRESOLVED":sufficiency==="INSUFFICIENT_FOR_NARROWING"?"INSUFFICIENT_EVIDENCE":!next&&!stop?"NO_DISCRIMINATING_NEXT_STEP":"ASSESSED";
    const narrowingReady=["SUFFICIENT_FOR_NARROWING","SUFFICIENT_FOR_MANAGEMENT_OPTION_REVIEW","SUFFICIENT_FOR_HUMAN_FINDING"].includes(sufficiency),sufficiencyReason=!assessments.length?"No explicitly authored Candidate is available for adjudication.":sufficiency==="SUFFICIENT_FOR_NARROWING"?"Explicit authoritative relations differentiate at least part of the persisted Candidate set without resolving a finding.":narrowingReady?"The governed rule provider declares sufficiency for this bounded purpose; stronger downstream authority is not implied.":"The current explicit relationships do not support the stated investigation purpose.";
    return {authority:"SERVER_DERIVED_INVESTIGATION_ASSESSMENT",scientific_input:"AUTHORITATIVE_INVESTIGATION_BUNDLE_ONLY",scope:{user_id:bundle.user_id,field_id:bundle.field_id,season_id:bundle.season_id,case_id:bundle.cases?.length===1?bundle.cases[0].case_id:null,observation_ids:(bundle.observations??[]).map((item)=>item.observation_id)},result_state:resultState,candidate_ordering:"STABLE_IDENTIFIER_ONLY_NO_RANK",candidate_assessments:assessments,evidence_sufficiency:{state:sufficiency,purpose_states:{NARROWING:narrowingReady?"SUFFICIENT_FOR_NARROWING":"INSUFFICIENT_FOR_NARROWING",MANAGEMENT_OPTION_REVIEW:sufficiency==="SUFFICIENT_FOR_MANAGEMENT_OPTION_REVIEW"?sufficiency:"INSUFFICIENT_FOR_NARROWING",HUMAN_FINDING:sufficiency==="SUFFICIENT_FOR_HUMAN_FINDING"?sufficiency:config.specialist_confirmation_required?"REQUIRES_SPECIALIST_CONFIRMATION":"INSUFFICIENT_FOR_NARROWING"},reason:sufficiencyReason,limiting_gaps:[...new Map(assessments.flatMap((item)=>item.missing_evidence).map((gap)=>[gap.gap_ref,gap])).values()]},next_best_evidence:next,stop_condition:stop,uncertainty,generated_at:this.clock().toISOString(),source_bundle_hash:hash(authoritativeProjection(bundle)),rule_version:config.rule_version,rule_authority:config.rule_authority,rule_review_state:config.rule_review_state,rule_hash:hash({rule_authority:config.rule_authority,rule_review_state:config.rule_review_state,rules:config.rules,stop_condition:config.stop_condition,sufficiency_state:config.sufficiency_state,field_evidence_exhausted:config.field_evidence_exhausted,specialist_confirmation_required:config.specialist_confirmation_required,next_best_evidence:config.next_best_evidence}),boundaries:{candidate_is_diagnosis:false,ranking_is_probability:false,support_is_proof:false,contradiction_is_impossibility:false,missing_is_negative_evidence:false,temporal_association_is_causation:false,management_history_is_attribution:false,outcome_is_efficacy:false,failure_is_resistance:false,management_option_selected:false}};
  }
}

export function initializeInvestigationIntelligenceSchema(db){
  db.exec(`
    CREATE TABLE IF NOT EXISTS investigation_assessments (assessment_id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, field_id TEXT NOT NULL, season_id TEXT NOT NULL, case_id TEXT NOT NULL, assessment_revision INTEGER NOT NULL, source_bundle_hash TEXT NOT NULL, rule_version TEXT NOT NULL, rule_hash TEXT NOT NULL, assessment_json TEXT NOT NULL, generated_at TEXT NOT NULL, stale_at TEXT);
    CREATE UNIQUE INDEX IF NOT EXISTS investigation_assessment_revision ON investigation_assessments(owner_user_id,field_id,season_id,case_id,assessment_revision);
    CREATE INDEX IF NOT EXISTS investigation_assessment_scope ON investigation_assessments(owner_user_id,field_id,season_id,case_id,generated_at);
    CREATE TABLE IF NOT EXISTS investigation_assessment_reviews (review_id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, assessment_id TEXT NOT NULL, action TEXT NOT NULL, rationale TEXT NOT NULL, review_json TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(assessment_id) REFERENCES investigation_assessments(assessment_id));
    CREATE INDEX IF NOT EXISTS investigation_assessment_review_scope ON investigation_assessment_reviews(owner_user_id,assessment_id,created_at);
  `);
  db.prepare("INSERT OR IGNORE INTO investigation_schema_migrations(version,applied_at) VALUES(3,?)").run(new Date().toISOString());
}

function validateCorrection(value,assessment){
  object(value,"correction");allowed(value,["target","candidate_id","evidence_id","value","reason"],"correction");const target=member(value.target,new Set(["CANDIDATE_STATE","EVIDENCE_RELATION","SUFFICIENCY_STATE","NEXT_BEST_EVIDENCE"]),"correction target"),candidateId=value.candidate_id==null?null:id(value.candidate_id,"candidate_id");
  if(candidateId&&!assessment.candidate_assessments.some((item)=>item.candidate_id===candidateId))fail("correction candidate is outside the assessment");
  const validValue=target==="CANDIDATE_STATE"?sets.candidateStates:target==="EVIDENCE_RELATION"?sets.evidenceRelations:target==="SUFFICIENCY_STATE"?sets.sufficiencyStates:new Set(["REJECTED","REPLACEMENT_REQUIRED"]);
  return {target,candidate_id:candidateId,evidence_id:value.evidence_id==null?null:id(value.evidence_id,"evidence_id"),value:member(value.value,validValue,"correction value"),reason:text(value.reason,"correction reason",1_000)};
}

export class InvestigationIntelligenceService {
  constructor(db,bundleProvider,{ruleProvider=new PersistedCandidateRuleProvider(),clock=()=>new Date(),idProvider=()=>randomUUID()}={}){this.db=db;this.bundleProvider=bundleProvider;this.clock=clock;this.idProvider=idProvider;this.engine=new InvestigationIntelligenceEngine({ruleProvider,clock});}
  reviews(userId,assessmentId){return this.db.prepare("SELECT review_json FROM investigation_assessment_reviews WHERE owner_user_id=? AND assessment_id=? ORDER BY created_at,review_id").all(userId,assessmentId).map((row)=>JSON.parse(row.review_json));}
  assess(userId,scope){
    id(userId,"user_id");object(scope,"scope");const fieldId=id(scope.field_id,"field_id"),seasonId=id(scope.season_id,"season_id"),caseId=id(scope.case_id,"case_id"),bundle=this.bundleProvider.getBundle(userId,{field_id:fieldId,season_id:seasonId,case_id:caseId}),derived=this.engine.assess(bundle),latest=this.db.prepare("SELECT * FROM investigation_assessments WHERE owner_user_id=? AND field_id=? AND season_id=? AND case_id=? ORDER BY assessment_revision DESC LIMIT 1").get(userId,fieldId,seasonId,caseId);
    if(latest&&!latest.stale_at&&latest.source_bundle_hash===derived.source_bundle_hash&&latest.rule_version===derived.rule_version&&latest.rule_hash===derived.rule_hash){const assessment=JSON.parse(latest.assessment_json);return {...assessment,stale:false,review_history:this.reviews(userId,assessment.assessment_id)};}
    const generatedAt=derived.generated_at,revision=(latest?.assessment_revision??0)+1,assessmentId=`assessment-${this.idProvider()}`,assessment={...derived,assessment_id:assessmentId,assessment_revision:revision,stale:false};
    this.db.exec("BEGIN IMMEDIATE");try{this.db.prepare("UPDATE investigation_assessments SET stale_at=? WHERE owner_user_id=? AND field_id=? AND season_id=? AND case_id=? AND stale_at IS NULL").run(generatedAt,userId,fieldId,seasonId,caseId);this.db.prepare("INSERT INTO investigation_assessments(assessment_id,owner_user_id,field_id,season_id,case_id,assessment_revision,source_bundle_hash,rule_version,rule_hash,assessment_json,generated_at,stale_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,NULL)").run(assessmentId,userId,fieldId,seasonId,caseId,revision,assessment.source_bundle_hash,assessment.rule_version,assessment.rule_hash,JSON.stringify(assessment),generatedAt);this.db.exec("COMMIT");}catch(error){this.db.exec("ROLLBACK");throw error;}
    return {...assessment,review_history:[]};
  }
  history(userId,scope){
    id(userId,"user_id");const fieldId=id(scope.field_id,"field_id"),seasonId=id(scope.season_id,"season_id"),caseId=id(scope.case_id,"case_id");this.bundleProvider.getBundle(userId,{field_id:fieldId,season_id:seasonId,case_id:caseId});
    return this.db.prepare("SELECT assessment_json,stale_at FROM investigation_assessments WHERE owner_user_id=? AND field_id=? AND season_id=? AND case_id=? ORDER BY assessment_revision").all(userId,fieldId,seasonId,caseId).map((row)=>{const assessment=JSON.parse(row.assessment_json);return {...assessment,stale:Boolean(row.stale_at),stale_at:row.stale_at,review_history:this.reviews(userId,assessment.assessment_id)};});
  }
  review(userId,input){
    id(userId,"user_id");object(input,"review");allowed(input,["assessment_id","action","rationale","corrections","resolution_level","candidate_findings"],"review");const assessmentId=id(input.assessment_id,"assessment_id"),row=this.db.prepare("SELECT assessment_json,stale_at FROM investigation_assessments WHERE assessment_id=? AND owner_user_id=?").get(assessmentId,userId);if(!row)fail("assessment scope not found","AUTHORIZATION_ERROR");if(row.stale_at)fail("stale assessment cannot receive a new review");const assessment=JSON.parse(row.assessment_json),action=member(input.action,sets.reviewActions,"review action"),rationale=text(input.rationale,"review rationale",2_000),corrections=(input.corrections??[]).map((item)=>validateCorrection(item,assessment));if(action==="CORRECT"&&!corrections.length)fail("CORRECT requires structured corrections");
    const resolutionLevel=input.resolution_level==null?null:member(input.resolution_level,sets.resolutionLevels,"resolution_level"),findings=(input.candidate_findings??[]).map((finding)=>{object(finding,"candidate finding");allowed(finding,["candidate_id","role"],"candidate finding");const candidateId=id(finding.candidate_id,"candidate_id");if(!assessment.candidate_assessments.some((item)=>item.candidate_id===candidateId))fail("finding candidate is outside the assessment");return {candidate_id:candidateId,role:member(finding.role,sets.findingRoles,"finding role")};});if(action==="RESOLVE_FINDING"&&(!resolutionLevel||!findings.length))fail("RESOLVE_FINDING requires a resolution level and attributed candidate finding");
    const createdAt=this.clock().toISOString(),review={review_id:`review-${this.idProvider()}`,assessment_id:assessmentId,assessment_revision:assessment.assessment_revision,reviewer_user_id:userId,action,rationale,corrections,resolution_level:resolutionLevel,candidate_findings:findings,created_at:createdAt,original_system_assessment_preserved:true,cross_layer_promotion:false};this.db.prepare("INSERT INTO investigation_assessment_reviews(review_id,owner_user_id,assessment_id,action,rationale,review_json,created_at) VALUES(?,?,?,?,?,?,?)").run(review.review_id,userId,assessmentId,action,rationale,JSON.stringify(review),createdAt);return {system_assessment:assessment,review,review_history:this.reviews(userId,assessmentId)};
  }
}
