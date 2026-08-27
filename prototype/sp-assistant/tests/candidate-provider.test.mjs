import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GovernedCandidateProvider, createGoldenTestOnlyCandidateProvider, loadCandidateProvider, validateCandidateProviderPackage } from "../candidate-provider.mjs";
import { PilotStore } from "../pilot-store.mjs";

const scope = { field_id:"field-provider", season_id:"season-provider" };

function lifecycle(stage = "TILLERING") {
  return { schema_version:2, users:[{ user_id:"user-a" }], fields:[{ field_id:scope.field_id, owner_user_id:"user-a", name:"นา provider", crop:"rice", planting_date:"2026-07-01", current_crop_stage:{ code:stage, label:stage, model_version:"field-stage-model/v1" }, current_cmp_stage:{ stage_id:"CMP-03", label:"ระยะแตกกอ", model_version:"field-stage-model/v1" }, season_id:scope.season_id, stage_provenance:"USER_CONFIRMED", created_at:"2026-07-01T00:00:00.000Z", updated_at:"2026-08-20T00:00:00.000Z" }], seasons:[{ season_id:scope.season_id, field_id:scope.field_id, crop:"rice", status:"ACTIVE" }], guidance:[], activities:[], cases:[], observations:[], evidence:[], conversations:[], messages:[], decision_logs:[], case_summaries:[], weather_snapshots:[] };
}

function deterministicIds() { let value = 0; return () => `00000000-0000-4000-8000-${String(++value).padStart(12,"0")}`; }
async function setup(candidateProvider = loadCandidateProvider(), stage = "TILLERING") {
  const root = await mkdtemp(join(tmpdir(),"cpmoakb-candidate-provider-"));
  const store = await new PilotStore({ dbPath:join(root,"pilot.sqlite"), exportDir:join(root,"exports"), investigationCandidateProvider:candidateProvider, intelligenceClock:()=>new Date("2026-08-27T02:00:00Z"), intelligenceIdProvider:deterministicIds() }).open();
  store.putWorkspace("user-a",lifecycle(stage));
  return { store, close:async()=>{ store.close(); await rm(root,{ recursive:true, force:true }); } };
}
function create(store, type, record) { return store.createInvestigationRecord("user-a",type,{ ...scope, ...record }); }

function buildGoldenBundle(store, { includeCandidates = false, morphologyPart = "LEAF_SHEATH", phenotypes = ["YELLOWING","LESION"] } = {}) {
  const caseRecord = create(store,"CASE",{ case_id:"case-provider", purpose:"Governed Candidate Provider integration" });
  const observation = create(store,"OBSERVATION",{ observation_id:"obs-provider", case_id:caseRecord.case_id, observed_at:"2026-08-20T08:30:00Z", source:"FIELD_OBSERVED", note:"ข้าวเหลืองเป็นหย่อมตรงจุดต่ำ น้ำลึกกว่าข้างๆ" });
  create(store,"SPATIAL_EVIDENCE",{ evidence_id:"ev-provider-spatial", observation_id:observation.observation_id, case_id:caseRecord.case_id, source:"FIELD_OBSERVED", evidence_level:"SP2_MULTI_ZONE_SUPPORTED", payload:{ observation_scope:"PATCH", geometry:"PATCH", field_positions:["LOW_SPOT"], patterns:["PATCH"], field_extent:"LOCAL", location_provenance:"FIELD_MAP_SELECTED" } });
  create(store,"MORPHOLOGY_EVIDENCE",{ evidence_id:"ev-provider-morphology", observation_id:observation.observation_id, case_id:caseRecord.case_id, source:"FIELD_OBSERVED", evidence_level:"MO1_DIRECT_OBSERVATION", payload:{ plant_part:morphologyPart, primary_phenotypes:phenotypes, negative_evidence:[] } });
  create(store,"WATER_CONTEXT",{ evidence_id:"ev-provider-water", observation_id:observation.observation_id, case_id:caseRecord.case_id, source:"FIELD_OBSERVED", evidence_level:"WT2_ZONE_COMPARISON", payload:{ water_state:"DEEP_PONDED", zone_reference:"affected low spot deeper than comparison", water_depth:{ value:12, unit:"CM" }, source:"FIELD_OBSERVED" } });
  const management = create(store,"MANAGEMENT_EVENT",{ management_event_id:"management-provider", case_id:caseRecord.case_id, event_type:"FERTILIZER_APPLICATION", event_at:"2026-08-19T04:00:00Z", time_precision:"EXACT", source:"USER_REPORTED", reported_product_name:"unresolved report", product_identity_confidence:"UNKNOWN" });
  const earliest = create(store,"TEMPORAL_EVIDENCE",{ temporal_evidence_id:"time-provider", case_id:caseRecord.case_id, observation_id:observation.observation_id, event_kind:"EARLIEST_EVIDENCE_AT", event_at:"2026-08-19T03:00:00Z", time_precision:"EXACT", evidence_level:"TC2_DATE_SUPPORTED", source:"PHOTO_METADATA" });
  create(store,"TEMPORAL_RELATIONSHIP",{ temporal_relationship_id:"relation-provider", case_id:caseRecord.case_id, subject_type:"MANAGEMENT_EVENT", subject_id:management.management_event_id, object_type:"TEMPORAL_EVIDENCE", object_id:earliest.temporal_evidence_id, relation:"AFTER", incompatible_with_initial_cause:true, rationale:"Symptoms predate application." });
  if (includeCandidates) create(store,"CANDIDATE",{ candidate_id:"candidate-user-sheath", case_id:caseRecord.case_id, concept_id:"TEST-SHEATH", candidate_class:"DISEASE", label:"ผู้ใช้สงสัยปัญหากาบใบ", support_state:"OPEN", review_state:"UNREVIEWED", authorship:"USER_HYPOTHESIS" });
  return caseRecord;
}

function buildNoMatch(store) {
  const caseRecord = create(store,"CASE",{ case_id:"case-gap", purpose:"Knowledge gap remains valid" });
  const observation = create(store,"OBSERVATION",{ observation_id:"obs-gap", case_id:caseRecord.case_id, source:"FIELD_OBSERVED", note:"unmapped observation" });
  create(store,"MORPHOLOGY_EVIDENCE",{ evidence_id:"ev-gap", observation_id:observation.observation_id, case_id:caseRecord.case_id, source:"FIELD_OBSERVED", evidence_level:"MO1_DIRECT_OBSERVATION", payload:{ plant_part:"PANICLE", primary_phenotypes:["GRAIN_DISCOLORATION"], negative_evidence:[] } });
  return caseRecord;
}

test("production manifest materializes only resolved governed sources and stable concepts", () => {
  const provider = loadCandidateProvider(), manifest = provider.getManifest();
  assert.equal(manifest.provider_id,"cp-moakb-governed-candidate-provider");
  assert.equal(manifest.provider_version,"1.0.0");
  assert.match(manifest.content_hash,/^[a-f0-9]{64}$/);
  assert.equal(manifest.authority,"GOVERNED_KNOWLEDGE_RELATIONSHIP");
  assert.deepEqual(manifest.crop_scope,["RICE"]);
  for (const rule of [...provider.package.nomination_rules,...provider.package.comparison_rules]) {
    assert.ok(rule.source_refs.every((sourceRef)=>provider.package.sources.some((source)=>source.source_ref===sourceRef)));
    assert.ok(rule.source_concept_claim_ids.every((recordId)=>provider.package.sources.some((source)=>source.knowledge_record_ids.includes(recordId))));
  }
});

test("Candidate identity and authorship schema migration is recorded", async () => {
  const h = await setup(); try {
    assert.equal(h.store.db.prepare("SELECT COUNT(*) AS count FROM investigation_schema_migrations WHERE version=4").get().count,1);
    const columns = new Set(h.store.db.prepare("PRAGMA table_info(investigation_candidates)").all().map((column)=>column.name));
    assert.ok(columns.has("concept_id"));
    assert.ok(columns.has("authorship"));
  } finally { await h.close(); }
});

test("no governed relationship means no invented Candidate and a structured knowledge gap", async () => {
  const h = await setup(); try {
    const caseRecord = buildNoMatch(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id });
    assert.equal(assessment.nominated_candidates.length,0);
    assert.equal(assessment.candidate_assessments.length,0);
    assert.equal(assessment.result_state,"NO_CANDIDATES_AVAILABLE");
    assert.ok(assessment.knowledge_gaps.some((gap)=>gap.code==="MISSING_CANDIDATE_RELATIONSHIP"));
  } finally { await h.close(); }
});

test("a User hypothesis needs no provider support and remains separate provenance", async () => {
  const h = await setup(); try {
    const caseRecord = buildNoMatch(h.store);
    create(h.store,"CANDIDATE",{ candidate_id:"candidate-user-only", case_id:caseRecord.case_id, candidate_class:"DISEASE", label:"น่าจะโรคไหม้", support_state:"OPEN", review_state:"UNREVIEWED", authorship:"USER_HYPOTHESIS" });
    const assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id }), candidate = assessment.candidate_assessments[0];
    assert.equal(candidate.state,"INSUFFICIENT");
    assert.equal(candidate.nomination_provenance[0].type,"USER_HYPOTHESIS");
    assert.equal(candidate.consideration_basis.type,"PERSISTED_AUTHORED_CANDIDATE");
    assert.equal(assessment.nominated_candidates.length,0);
  } finally { await h.close(); }
});

test("actual governed knowledge can nominate multiple Candidates without Diagnosis or ranking", async () => {
  const h = await setup(); try {
    const caseRecord = buildGoldenBundle(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id }), concepts = assessment.nominated_candidates.map((item)=>item.concept_id);
    assert.ok(concepts.includes("CO-RIC-002/v1"));
    assert.ok(concepts.includes("CO-RDC-002/v1"));
    assert.ok(assessment.nominated_candidates.length >= 2);
    const nominationRule = assessment.nominated_candidates[0].nomination_provenance[0];
    assert.match(nominationRule.rule_hash,/^[a-f0-9]{64}$/);
    assert.match(nominationRule.provider_content_hash,/^[a-f0-9]{64}$/);
    assert.ok(nominationRule.source_refs.length > 0);
    assert.ok(nominationRule.source_concept_claim_ids.length > 0);
    assert.equal(assessment.candidate_ordering,"STABLE_IDENTIFIER_ONLY_NO_RANK");
    assert.equal(assessment.boundaries.candidate_is_diagnosis,false);
    assert.equal(assessment.boundaries.nomination_is_support,false);
    assert.equal("diagnosis" in assessment,false);
  } finally { await h.close(); }
});

test("Golden TEST_ONLY provider retains biological and abiotic recall and Step C adjudicates", async () => {
  const h = await setup(createGoldenTestOnlyCandidateProvider()); try {
    const caseRecord = buildGoldenBundle(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id }), byConcept = Object.fromEntries(assessment.candidate_assessments.map((item)=>[item.concept_id,item]));
    assert.equal(assessment.nominated_candidates.length,3);
    assert.equal(byConcept["TEST-WATER-ROOT"].state,"SUPPORTED");
    assert.equal(byConcept["TEST-SHEATH"].state,"SUPPORTED");
    assert.equal(byConcept["TEST-APPLICATION"].state,"WEAKENED");
    assert.equal(byConcept["TEST-APPLICATION"].compatibility.TEMPORAL,"CONTRADICTORY");
    assert.deepEqual({ type:assessment.next_best_evidence.type, target:assessment.next_best_evidence.target, comparison:assessment.next_best_evidence.comparison },{ type:"FIELD_CHECK", target:"ROOT_COMPARISON", comparison:"AFFECTED_VS_NORMAL" });
    assert.ok(assessment.candidate_assessments.some((item)=>item.candidate_class==="ROOT_ZONE_STRESS"));
    assert.ok(assessment.candidate_assessments.some((item)=>item.candidate_class==="DISEASE"));
  } finally { await h.close(); }
});

test("stable concept identity merges User and provider provenance without duplicates", async () => {
  const h = await setup(createGoldenTestOnlyCandidateProvider()); try {
    const caseRecord = buildGoldenBundle(h.store,{ includeCandidates:true }), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id }), matches = assessment.candidate_assessments.filter((item)=>item.concept_id==="TEST-SHEATH");
    assert.equal(matches.length,1);
    assert.equal(matches[0].candidate_id,"candidate-user-sheath");
    assert.deepEqual(new Set(matches[0].nomination_provenance.map((item)=>item.type)),new Set(["USER_HYPOTHESIS","GOVERNED_PROVIDER"]));
    assert.equal(matches[0].consideration_basis.type,"MERGED_AUTHORED_AND_GOVERNED_CANDIDATE");
  } finally { await h.close(); }
});

test("provider validation rejects dangling sources, concepts, invalid classes, and unreviewed rules", () => {
  const base = loadCandidateProvider().package;
  const mutate = (callback) => { const copy = structuredClone(base); delete copy.manifest.content_hash; callback(copy); return copy; };
  assert.throws(()=>validateCandidateProviderPackage(mutate((copy)=>{ copy.nomination_rules[0].source_refs=["MISSING-SOURCE"]; })),/dangling source reference/);
  assert.throws(()=>validateCandidateProviderPackage(mutate((copy)=>{ copy.nomination_rules[0].candidate_concept_id="MISSING-CONCEPT"; })),/dangling candidate concept/);
  assert.throws(()=>validateCandidateProviderPackage(mutate((copy)=>{ copy.candidate_concepts[0].candidate_class="NOT_A_CLASS"; })),/invalid candidate class/);
  assert.throws(()=>validateCandidateProviderPackage(mutate((copy)=>{ copy.nomination_rules[0].review_state="UNREVIEWED"; })),/invalid rule review state/);
  assert.throws(()=>validateCandidateProviderPackage(mutate((copy)=>{ copy.nomination_rules[0].authority="TEST_ONLY_FIXTURE"; })),/TEST_ONLY_FIXTURE rule cannot load in normal runtime/);
});

test("TEST_ONLY_FIXTURE is rejected by normal runtime and loads only with explicit test authority", () => {
  const fixture = createGoldenTestOnlyCandidateProvider(), copy = structuredClone(fixture.package); delete copy.manifest.content_hash;
  assert.throws(()=>new GovernedCandidateProvider(copy),/TEST_ONLY_FIXTURE cannot load in normal runtime/);
  assert.doesNotThrow(()=>new GovernedCandidateProvider(copy,{ allowTestFixtures:true }));
});

test("provider version change invalidates current assessment while history retains original version", async () => {
  const h = await setup(createGoldenTestOnlyCandidateProvider({ version:"fixture/v1" })); try {
    const caseRecord = buildGoldenBundle(h.store), first = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id });
    h.store.investigationIntelligence.engine.candidateProvider = createGoldenTestOnlyCandidateProvider({ version:"fixture/v2" });
    const second = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id }), history = h.store.getInvestigationAssessmentHistory("user-a",{ ...scope, case_id:caseRecord.case_id });
    assert.equal(first.provider_manifest.provider_version,"fixture/v1");
    assert.equal(second.provider_manifest.provider_version,"fixture/v2");
    assert.equal(second.assessment_revision,2);
    assert.deepEqual(history.map((item)=>item.stale),[true,false]);
    assert.deepEqual(history.map((item)=>item.provider_manifest.provider_version),["fixture/v1","fixture/v2"]);
  } finally { await h.close(); }
});

test("contested governed relationships remain visible without last-loaded-wins resolution", async () => {
  const h = await setup(createGoldenTestOnlyCandidateProvider({ contested:true })); try {
    const caseRecord = buildGoldenBundle(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id });
    assert.ok(assessment.uncertainty.some((item)=>item.code==="CONTESTED_RELATIONSHIP" && item.candidate_concept_id==="TEST-WATER-ROOT"));
    assert.ok(assessment.candidate_assessments.some((item)=>item.concept_id==="TEST-WATER-ROOT"));
  } finally { await h.close(); }
});

test("UNKNOWN stage is not a contradiction and authoritative StageAssessment controls applicability", async () => {
  const known = await setup(loadCandidateProvider(),"TILLERING"); try {
    const caseRecord = buildGoldenBundle(known.store,{ morphologyPart:"LEAF_SHEATH", phenotypes:["LESION"] }), assessment = known.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id });
    assert.ok(assessment.nominated_candidates.some((item)=>item.concept_id==="CO-RDC-002/v1"));
    assert.equal(assessment.field_context_reused.stage_assessment_id,"stage-season-provider");
  } finally { await known.close(); }
  const unknown = await setup(loadCandidateProvider(),"UNKNOWN"); try {
    const caseRecord = buildGoldenBundle(unknown.store,{ morphologyPart:"LEAF_SHEATH", phenotypes:["LESION"] }), assessment = unknown.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id });
    assert.ok(!assessment.nominated_candidates.some((item)=>item.concept_id==="CO-RDC-002/v1"));
    assert.ok(!assessment.uncertainty.some((item)=>item.dimension==="BIOLOGICAL_STAGE" && /CONTRADICT/i.test(item.code)));
  } finally { await unknown.close(); }
});

test("existing backend evidence is reused without mandatory re-entry", async () => {
  const h = await setup(createGoldenTestOnlyCandidateProvider()); try {
    const caseRecord = buildGoldenBundle(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id });
    assert.equal(assessment.field_context_reused.crop,"rice");
    assert.equal(assessment.field_context_reused.new_user_input_required_for_nomination,false);
    assert.ok(assessment.field_context_reused.evidence_refs.includes("ev-provider-spatial"));
    assert.ok(assessment.field_context_reused.evidence_refs.includes("ev-provider-water"));
    assert.ok(assessment.nominated_candidates.flatMap((item)=>item.nomination_provenance).flatMap((item)=>item.triggering_evidence_refs).some((ref)=>ref.record_id==="ev-provider-morphology"));
  } finally { await h.close(); }
});

test("duplicate provider rules and evidence do not amplify support", async () => {
  const base = createGoldenTestOnlyCandidateProvider(), copy = structuredClone(base.package); delete copy.manifest.content_hash;
  const duplicate = structuredClone(copy.adjudication_rules[0]); duplicate.rule_id = "TEST-ADJ-WATER-SPATIAL-DUPLICATE"; copy.adjudication_rules.push(duplicate);
  const h = await setup(new GovernedCandidateProvider(copy,{ allowTestFixtures:true })); try {
    const caseRecord = buildGoldenBundle(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id }), water = assessment.candidate_assessments.find((item)=>item.concept_id==="TEST-WATER-ROOT");
    assert.equal(water.supporting_evidence.filter((item)=>item.evidence_id==="ev-provider-spatial").length,1);
  } finally { await h.close(); }
});

test("assessment exposes comparison provenance and exactly one Next Best Evidence", async () => {
  const h = await setup(createGoldenTestOnlyCandidateProvider()); try {
    const caseRecord = buildGoldenBundle(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id });
    assert.ok(assessment.comparison_rules.some((rule)=>rule.evidence_concept==="ROOT_COMPARISON" && /^[a-f0-9]{64}$/.test(rule.rule_hash)));
    const comparison = assessment.comparison_rules.find((rule)=>rule.evidence_concept==="ROOT_COMPARISON");
    assert.equal(comparison.provider_id,"golden-test-only-candidate-provider");
    assert.ok(comparison.source_refs.includes("TEST-SOURCE/v1"));
    assert.equal(assessment.evidence_sufficiency.limiting_gaps.find((gap)=>gap.concept==="ROOT_COMPARISON").rule_provenance.provider_id,"golden-test-only-candidate-provider");
    assert.equal(Array.isArray(assessment.next_best_evidence),false);
    assert.equal(assessment.next_best_evidence.target,"ROOT_COMPARISON");
    assert.ok(assessment.next_best_evidence.related_candidate_ids.length > 1);
  } finally { await h.close(); }
});

test("provider and Step C emit no probability, score, chemical, product, rate, Guidance, or Diagnosis", async () => {
  const h = await setup(createGoldenTestOnlyCandidateProvider()); try {
    const caseRecord = buildGoldenBundle(h.store), assessment = h.store.assessInvestigation("user-a",{ ...scope, case_id:caseRecord.case_id }), serialized = JSON.stringify(assessment);
    assert.doesNotMatch(serialized,/"(?:probability|rank_score|risk_score|product|active_ingredient|rate|recommendation|diagnosis|guidance)"\s*:/i);
    assert.equal(assessment.boundaries.openai_candidate_generation,false);
    assert.equal(assessment.boundaries.guidance_generated,false);
    assert.equal(assessment.boundaries.chemical_output_generated,false);
  } finally { await h.close(); }
});
