import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PilotStore } from "../pilot-store.mjs";
import { startServer } from "../server.mjs";

const scope = { field_id:"field-investigation", season_id:"season-investigation" };

function lifecycle(userId = "user-a") {
  return {
    schema_version:2,
    users:[{ user_id:userId }],
    fields:[{ field_id:scope.field_id, owner_user_id:userId, name:"นา evidence", polygon:{ type:"Polygon", coordinates:[[[100,13],[100.01,13],[100,13.01],[100,13]]] }, crop:"rice", planting_date:"2026-07-01", current_crop_stage:{ code:"TILLERING", label:"แตกกอ", model_version:"field-stage-model/v1" }, current_cmp_stage:{ stage_id:"CMP-03", label:"ระยะแตกกอ", model_version:"field-stage-model/v1" }, season_id:scope.season_id, stage_provenance:"USER_CONFIRMED", created_at:"2026-07-01T00:00:00.000Z", updated_at:"2026-08-20T00:00:00.000Z" }],
    seasons:[{ season_id:scope.season_id, field_id:scope.field_id, crop:"rice", status:"ACTIVE" }],
    guidance:[],activities:[],cases:[],observations:[],evidence:[],conversations:[],messages:[],decision_logs:[],case_summaries:[],weather_snapshots:[],
  };
}

async function setup() {
  const root = await mkdtemp(join(tmpdir(),"cpmoakb-investigation-"));
  const store = await new PilotStore({ dbPath:join(root,"pilot.sqlite"), exportDir:join(root,"exports") }).open();
  store.putWorkspace("user-a",lifecycle());
  return { root,store };
}

function create(store, recordType, record) { return store.createInvestigationRecord("user-a",recordType,{...scope,...record}); }

test("golden A1-A10 bundle remains evidence, not diagnosis", async () => {
  const {root,store}=await setup();
  const caseRecord=create(store,"CASE",{case_id:"case-yellowing",purpose:"Investigate observed yellowing without diagnosis",opened_at:"2026-08-20T08:00:00Z"});
  const observation=create(store,"OBSERVATION",{observation_id:"obs-yellowing",case_id:caseRecord.case_id,observed_at:"2026-08-20T08:30:00Z",source:"USER_REPORTED",confidence:"MODERATE",note:"Yellowing noticed in a low patch"});
  assert.equal(observation.stage_assessment_id,"stage-season-investigation");
  assert.equal(observation.stage_provenance,"USER_CONFIRMED");
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM stage_assessments").get().count,1);

  const spatial=create(store,"SPATIAL_EVIDENCE",{evidence_id:"ev-spatial",observation_id:observation.observation_id,case_id:caseRecord.case_id,observed_at:observation.observed_at,source:"FIELD_OBSERVED",confidence:"MODERATE",evidence_level:"SP1_SITE_SUPPORTED",payload:{observation_scope:"PATCH",geometry:"PATCH",field_positions:["LOW_SPOT"],patterns:["PATCH"],field_extent:"LOCAL",direction:"NO_CLEAR_DIRECTION",affected_status:"AFFECTED",location_provenance:"FIELD_MAP_SELECTED"}});
  const morphology=create(store,"MORPHOLOGY_EVIDENCE",{evidence_id:"ev-morphology",observation_id:observation.observation_id,case_id:caseRecord.case_id,observed_at:observation.observed_at,source:"FIELD_OBSERVED",evidence_level:"MO1_DIRECT_OBSERVATION",payload:{plant_part:"LEAF_SHEATH",primary_phenotypes:["LESION"],shape:"irregular",color:"green-gray",near_waterline:true,negative_evidence:[{feature:"visible organism",state:"NOT_OBSERVED"},{feature:"root condition",state:"NOT_ASSESSABLE"}]}});
  const sampling=create(store,"SAMPLING_SESSION",{evidence_id:"ev-sampling",observation_id:observation.observation_id,case_id:caseRecord.case_id,observed_at:observation.observed_at,source:"FIELD_OBSERVED",evidence_level:"SM2_MULTI_SITE_SAMPLED",payload:{sampling_mode:"S2_GUIDED_INVESTIGATION",sampling_unit:"TILLER",plant_part:"TILLER",sites_count:4,units_per_site:25,sampling_method:"Affected and comparison low-spot transects",affected_sites_count:2,comparison_sites_count:2,representativeness:"MULTI_ZONE_REPRESENTATIVE"}});
  const severity=create(store,"SEVERITY_MEASUREMENT",{evidence_id:"ev-severity",observation_id:observation.observation_id,case_id:caseRecord.case_id,observed_at:observation.observed_at,source:"FIELD_OBSERVED",evidence_level:"SV3_SAMPLING_SUPPORTED",payload:{measurement_concept:"AFFECTED_TILLERS_PER_OBSERVED_TILLERS",numerator:18,denominator:100,unit:"COUNT_RATIO",sampling_reference_id:sampling.evidence_id,plant_part:"TILLER"}});
  assert.equal(severity.payload.derived_percent,18);
  const weather=create(store,"WEATHER_CONTEXT",{evidence_id:"ev-weather",observation_id:observation.observation_id,case_id:caseRecord.case_id,source:"WEATHER_API_GRID",evidence_level:"WC1_SOURCE_SUPPORTED",payload:{rainfall:{value:42,unit:"MM"},time_window_start:"2026-08-17T00:00:00Z",time_window_end:"2026-08-20T00:00:00Z",weather_source:"WEATHER_API_GRID",source_confidence:"MODERATE"}});
  const water=create(store,"WATER_CONTEXT",{evidence_id:"ev-water",observation_id:observation.observation_id,case_id:caseRecord.case_id,observed_at:observation.observed_at,source:"FIELD_OBSERVED",evidence_level:"WT2_ZONE_COMPARISON",payload:{water_state:"DEEP_PONDED",zone_reference:"affected low spot; deeper than comparison site",water_depth:{value:12,unit:"CM"},source:"FIELD_OBSERVED",conflicts_with_weather_evidence_id:weather.evidence_id,conflict_note:"Field ponding is preserved separately from gridded rainfall context"}});
  const management=create(store,"MANAGEMENT_EVENT",{management_event_id:"management-recent",case_id:caseRecord.case_id,event_type:"FERTILIZER_APPLICATION",event_at:"2026-08-19T04:00:00Z",time_precision:"APPROXIMATE",source:"USER_REPORTED",reported_product_name:"reported bag wording unclear",product_identity_confidence:"UNKNOWN",raw_rate:{value:1,unit:"REPORTED_BAG"},application_method:"GROUND_APPLICATION"});
  assert.equal(management.active_ingredient,null);

  const biological=create(store,"CANDIDATE",{candidate_id:"candidate-biological",case_id:caseRecord.case_id,candidate_class:"DISEASE",label:"sheath-related biological candidate",support_state:"OPEN"});
  const waterStress=create(store,"CANDIDATE",{candidate_id:"candidate-water",case_id:caseRecord.case_id,candidate_class:"WATER_STRESS",label:"water/root-stress candidate",support_state:"OPEN"});
  for (const link of [
    {candidate_evidence_link_id:"link-bio-morph",candidate_id:biological.candidate_id,relation:"SUPPORTING",evidence_id:morphology.evidence_id},
    {candidate_evidence_link_id:"link-bio-spatial",candidate_id:biological.candidate_id,relation:"SUPPORTING",evidence_id:spatial.evidence_id},
    {candidate_evidence_link_id:"link-bio-missing",candidate_id:biological.candidate_id,relation:"MISSING",missing_description:"Expert or laboratory evidence capable of resolving identity"},
    {candidate_evidence_link_id:"link-water-spatial",candidate_id:waterStress.candidate_id,relation:"SUPPORTING",evidence_id:spatial.evidence_id},
    {candidate_evidence_link_id:"link-water-water",candidate_id:waterStress.candidate_id,relation:"SUPPORTING",evidence_id:water.evidence_id},
    {candidate_evidence_link_id:"link-water-contradiction",candidate_id:waterStress.candidate_id,relation:"CONTRADICTING",evidence_id:morphology.evidence_id,rationale:"Observed morphology is not explained by spatial context alone"},
    {candidate_evidence_link_id:"link-water-missing",candidate_id:waterStress.candidate_id,relation:"MISSING",missing_description:"Comparable root-zone observation"},
  ]) create(store,"CANDIDATE_EVIDENCE_LINK",{...link,case_id:caseRecord.case_id});

  const firstNoticed=create(store,"TEMPORAL_EVIDENCE",{temporal_evidence_id:"time-first-noticed",case_id:caseRecord.case_id,observation_id:observation.observation_id,event_kind:"FIRST_USER_NOTICED_AT",event_at:"2026-08-20T07:00:00Z",time_precision:"APPROXIMATE",evidence_level:"TC1_APPROXIMATE_SEQUENCE",source:"USER_REPORTED"});
  const earliest=create(store,"TEMPORAL_EVIDENCE",{temporal_evidence_id:"time-earliest-evidence",case_id:caseRecord.case_id,observation_id:observation.observation_id,event_kind:"EARLIEST_EVIDENCE_AT",event_at:"2026-08-19T03:00:00Z",time_precision:"EXACT",evidence_level:"TC2_DATE_SUPPORTED",source:"PHOTO_METADATA"});
  const current=create(store,"TEMPORAL_EVIDENCE",{temporal_evidence_id:"time-observed",case_id:caseRecord.case_id,observation_id:observation.observation_id,event_kind:"OBSERVED_AT",event_at:observation.observed_at,time_precision:"EXACT",progression_state:"NEW_AREAS_APPEARING",evidence_level:"TC3_MULTI_TIMEPOINT_SUPPORTED",source:"FIELD_OBSERVED"});
  assert.notEqual(firstNoticed.event_at,earliest.event_at); assert.notEqual(current.event_at,earliest.event_at);
  create(store,"TEMPORAL_RELATIONSHIP",{temporal_relationship_id:"relation-application-after-onset",case_id:caseRecord.case_id,subject_type:"MANAGEMENT_EVENT",subject_id:management.management_event_id,object_type:"TEMPORAL_EVIDENCE",object_id:earliest.temporal_evidence_id,relation:"AFTER",incompatible_with_initial_cause:true,rationale:"The recorded symptom evidence predates this event; the event cannot explain initial onset."});
  create(store,"FOLLOW_UP_PLAN",{follow_up_id:"follow-up-monitor",case_id:caseRecord.case_id,purpose:"Repeat comparable observation without selecting treatment",check_items:["Repeat tiller counts","Compare water depth and lesion morphology"],where_to_check:"Affected low spot and comparison site",measurement_to_repeat_id:severity.evidence_id,sampling_reference_id:sampling.evidence_id,comparison_required:true,recommended_window_start:"2026-08-22T00:00:00Z",recommended_window_end:"2026-08-24T23:59:59Z"});

  const bundle=store.getInvestigationBundle("user-a",{...scope,case_id:caseRecord.case_id});
  assert.equal(bundle.authority,"SERVER"); assert.equal(bundle.stage_assessment.provenance,"USER_CONFIRMED");
  assert.equal(bundle.candidates.length,2); assert.ok(bundle.candidates.every((item)=>item.support_state==="OPEN"));
  assert.ok(bundle.candidates.every((item)=>item.evidence_links.some((link)=>link.relation==="MISSING")));
  assert.equal(bundle.candidates.flatMap((item)=>item.evidence_links).filter((link)=>link.evidence_id===spatial.evidence_id).length,2,"competing candidates may share evidence without ranking");
  assert.ok(bundle.evidence.some((item)=>item.evidence_type==="WEATHER")); assert.ok(bundle.evidence.some((item)=>item.evidence_type==="WATER"));
  assert.equal(bundle.evidence.find((item)=>item.evidence_id==="ev-severity").derived_percent,18);
  assert.equal(bundle.follow_up_plans.length,1); assert.equal(bundle.outcomes.length,0);
  assert.deepEqual(bundle.boundaries,{observation_is_interpretation:false,candidate_is_diagnosis:false,temporal_association_is_causation:false,selection_is_field_action:false,field_action_is_outcome:false,treatment_failure_is_resistance:false,automatic_knowledge_promotion:false});
  const timeline=store.getInvestigationTimeline("user-a",{...scope,case_id:caseRecord.case_id});
  assert.equal(timeline.boundary,"ORDER_AND_DECLARED_RELATIONSHIPS_ONLY_NO_CAUSAL_INFERENCE"); assert.equal(timeline.relationships[0].causation_claimed,false);
  store.close(); await rm(root,{recursive:true,force:true});
});

test("validation preserves unknowns, local scope, negative states, raw measurements, and sampling limits", async () => {
  const {root,store}=await setup();
  const observation=create(store,"OBSERVATION",{observation_id:"obs-routine",observed_at:"2026-08-20T08:30:00Z",source:"FIELD_OBSERVED"});
  assert.equal(observation.case_id,null,"routine observation can precede a case");
  assert.throws(()=>create(store,"SPATIAL_EVIDENCE",{observation_id:observation.observation_id,source:"FIELD_OBSERVED",evidence_level:"SP3_FIELD_SUPPORTED",payload:{observation_scope:"LOCAL_SITE",geometry:"POINT",field_extent:"LOCAL",location_provenance:"PHONE_GPS"}}),/cannot be SP3/);
  assert.throws(()=>create(store,"MORPHOLOGY_EVIDENCE",{observation_id:observation.observation_id,source:"FIELD_OBSERVED",evidence_level:"MO1_DIRECT_OBSERVATION",payload:{plant_part:"LEAF_BLADE",primary_phenotypes:["YELLOWING"],diagnosis:"anything"}}),/unsupported field: diagnosis/);
  const morphology=create(store,"MORPHOLOGY_EVIDENCE",{observation_id:observation.observation_id,source:"FIELD_OBSERVED",evidence_level:"MO1_DIRECT_OBSERVATION",payload:{plant_part:"LEAF_BLADE",primary_phenotypes:["YELLOWING"],negative_evidence:[{feature:"organism",state:"NOT_OBSERVED"},{feature:"roots",state:"NOT_ASSESSABLE"},{feature:"insects",state:"SEARCHED_NOT_FOUND",search_method:"capable inspection",target_observable:true}]}});
  assert.deepEqual(morphology.payload.negative_evidence.map((item)=>item.state),["NOT_OBSERVED","NOT_ASSESSABLE","SEARCHED_NOT_FOUND"]);
  assert.throws(()=>create(store,"MORPHOLOGY_EVIDENCE",{observation_id:observation.observation_id,source:"FIELD_OBSERVED",evidence_level:"MO1_DIRECT_OBSERVATION",payload:{plant_part:"LEAF_BLADE",primary_phenotypes:[],negative_evidence:[{feature:"insects",state:"SEARCHED_NOT_FOUND"}]}}),/target_observable/);
  assert.throws(()=>create(store,"SEVERITY_MEASUREMENT",{observation_id:observation.observation_id,source:"USER_REPORTED",evidence_level:"SV0_REPORTED",payload:{raw_value:15}}),/measurement_concept|unit/);
  const sampling=create(store,"SAMPLING_SESSION",{observation_id:observation.observation_id,source:"USER_REPORTED",evidence_level:"SM0_ANECDOTAL",payload:{sampling_mode:"S0_SPOT_OBSERVATION",sampling_unit:"PLANT",representativeness:"UNKNOWN"}});
  assert.equal(sampling.payload.sites_count,null); assert.equal(sampling.payload.units_per_site,null);
  assert.throws(()=>create(store,"SAMPLING_SESSION",{observation_id:observation.observation_id,source:"USER_REPORTED",evidence_level:"SM1_LOCAL_SAMPLED",payload:{sampling_mode:"S1_QUICK_FIELD_CHECK",sampling_unit:"PLANT",representativeness:"LOCAL_ONLY",zero_observation_state:"SEARCHED_NOT_FOUND"}}),/target_observable/);
  const range=create(store,"TEMPORAL_EVIDENCE",{observation_id:observation.observation_id,event_kind:"ESTIMATED_ONSET",range_start:"2026-08-18T00:00:00Z",range_end:"2026-08-19T23:59:59Z",time_precision:"RANGE",evidence_level:"TC1_APPROXIMATE_SEQUENCE",source:"USER_REPORTED"});
  assert.equal(range.event_at,null); assert.equal(range.time_precision,"RANGE");
  store.close(); await rm(root,{recursive:true,force:true});
});

test("ownership, product identity, outcome learning, action separation, and migration are guarded", async () => {
  const {root,store}=await setup();
  const caseRecord=create(store,"CASE",{case_id:"case-guardrails",purpose:"guardrail test"});
  const observation=create(store,"OBSERVATION",{observation_id:"obs-guardrails",case_id:caseRecord.case_id,source:"USER_REPORTED"});
  const spatialInput={evidence_id:"evidence-owner-guard",observation_id:observation.observation_id,case_id:caseRecord.case_id,observed_at:"2026-08-20T08:30:00Z",source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"SP1_SITE_SUPPORTED",review_state:"UNREVIEWED",payload:{observation_scope:"PATCH",geometry:"PATCH",field_positions:[],patterns:["PATCH"],field_extent:"LOCAL",direction:"UNKNOWN",affected_status:"AFFECTED",location_provenance:"USER_REPORTED"}};
  create(store,"SPATIAL_EVIDENCE",spatialInput);
  assert.throws(()=>store.getInvestigationBundle("user-b",scope),/scope not found/);
  assert.throws(()=>store.createInvestigationRecord("user-b","OBSERVATION",{...scope,source:"USER_REPORTED"}),/scope not found/);
  assert.throws(()=>store.updateInvestigationRecord("user-b","SPATIAL_EVIDENCE",spatialInput.evidence_id,1,{...scope,...spatialInput},"request-cross-owner-update"),/scope not found/);
  assert.throws(()=>create(store,"MANAGEMENT_EVENT",{case_id:caseRecord.case_id,event_type:"PESTICIDE_APPLICATION",time_precision:"UNKNOWN",source:"USER_REPORTED",reported_product_name:"unclear product",product_identity_confidence:"UNKNOWN",active_ingredient:"fabricated"}),/resolved product identity/);
  const management=create(store,"MANAGEMENT_EVENT",{case_id:caseRecord.case_id,event_type:"PESTICIDE_APPLICATION",time_precision:"UNKNOWN",source:"USER_REPORTED",reported_product_name:"unclear product",product_identity_confidence:"UNKNOWN"});
  assert.equal(management.active_ingredient,null);
  const otherCase=create(store,"CASE",{case_id:"case-other",purpose:"cross-case isolation"});
  const otherObservation=create(store,"OBSERVATION",{observation_id:"obs-other",case_id:otherCase.case_id,source:"FIELD_OBSERVED"});
  const otherSampling=create(store,"SAMPLING_SESSION",{observation_id:otherObservation.observation_id,case_id:otherCase.case_id,source:"FIELD_OBSERVED",evidence_level:"SM1_LOCAL_SAMPLED",payload:{sampling_mode:"S1_QUICK_FIELD_CHECK",sampling_unit:"PLANT",representativeness:"LOCAL_ONLY"}});
  assert.throws(()=>create(store,"FOLLOW_UP_PLAN",{case_id:caseRecord.case_id,purpose:"invalid cross-case reference",check_items:["repeat"],sampling_reference_id:otherSampling.evidence_id}),/case mismatch/);
  assert.throws(()=>create(store,"CANDIDATE",{case_id:caseRecord.case_id,candidate_class:"UNKNOWN",support_state:"OPEN",probability:0.92}),/unsupported field: probability/);
  const outcome=create(store,"OUTCOME",{case_id:caseRecord.case_id,observed_at:"2026-08-25T08:00:00Z",outcome_dimensions:["MONITORING_ONLY"],new_damage_status:"NO_NEW_DAMAGE_OBSERVED",existing_damage_status:"UNCHANGED",recovery_status:"NOT_ASSESSABLE",comparability:"LIMITED",outcome_confidence:"LOW",attribution_confidence:"UNKNOWN",evidence_level:"OC1_OBSERVATION_SUPPORTED",source:"USER_REPORTED"});
  assert.equal(outcome.executed_action_id,null); assert.equal(outcome.learning_state,"CASE_ONLY"); assert.equal(outcome.resistance_conclusion,null);
  const dbPath=store.dbPath; store.close();
  let reopened=await new PilotStore({dbPath,exportDir:join(root,"exports")}).open();
  assert.equal(reopened.db.prepare("SELECT COUNT(*) AS count FROM investigation_schema_migrations WHERE version=1").get().count,1);
  assert.equal(reopened.db.prepare("SELECT COUNT(*) AS count FROM investigation_schema_migrations WHERE version=2").get().count,1);
  assert.equal(reopened.db.prepare("SELECT COUNT(*) AS count FROM investigation_schema_migrations WHERE version=3").get().count,1);
  assert.ok(reopened.db.prepare("PRAGMA table_info(investigation_observations)").all().some((column)=>column.name==="revision"));
  assert.ok(reopened.db.prepare("PRAGMA table_info(investigation_evidence)").all().some((column)=>column.name==="revision"));
  assert.equal(reopened.db.prepare("SELECT COUNT(*) AS count FROM stage_assessments").get().count,1);
  assert.equal(reopened.getInvestigationBundle("user-a",{...scope,case_id:caseRecord.case_id}).outcomes[0].learning_state,"CASE_ONLY");
  reopened.close(); await rm(root,{recursive:true,force:true});
});

test("investigation HTTP contract creates records and returns scoped bundles", async () => {
  const root=await mkdtemp(join(tmpdir(),"cpmoakb-investigation-api-")),options={port:0,dbPath:join(root,"pilot.sqlite"),exportDir:join(root,"exports"),uploadDir:join(root,"uploads")};
  const seed=await new PilotStore({dbPath:options.dbPath,exportDir:options.exportDir}).open(); seed.putWorkspace("user-a",lifecycle()); seed.close();
  const server=await startServer(options),base=`http://127.0.0.1:${server.address().port}`;
  const auth=await fetch(`${base}/api/pilot/session`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({password:"1234",user_id:"user-a"})}),cookie=auth.headers.get("set-cookie").split(";")[0];
  const created=await fetch(`${base}/api/pilot/investigation-records`,{method:"POST",headers:{cookie,"content-type":"application/json"},body:JSON.stringify({record_type:"OBSERVATION",record:{...scope,observation_id:"obs-api",source:"USER_REPORTED"}})});
  assert.equal(created.status,201); assert.equal((await created.json()).record.stage_assessment_id,"stage-season-investigation");
  const bundle=await (await fetch(`${base}/api/pilot/investigation-bundle?field_id=${scope.field_id}&season_id=${scope.season_id}&observation_id=obs-api`,{headers:{cookie}})).json();
  assert.equal(bundle.authority,"SERVER"); assert.equal(bundle.observations.length,1);
  const otherAuth=await fetch(`${base}/api/pilot/session`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({password:"1234",user_id:"user-b"})}),otherCookie=otherAuth.headers.get("set-cookie").split(";")[0];
  assert.equal((await fetch(`${base}/api/pilot/investigation-bundle?field_id=${scope.field_id}&season_id=${scope.season_id}`,{headers:{cookie:otherCookie}})).status,403);
  await new Promise((done)=>server.close(done)); await rm(root,{recursive:true,force:true});
});
