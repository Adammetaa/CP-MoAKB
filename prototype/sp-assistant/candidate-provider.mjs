import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { InvestigationContractError } from "./investigation-backbone.mjs";

const CANDIDATE_CLASSES = new Set(["DISEASE","INSECT","WEED_COMPETITION","NUTRITIONAL","WATER_STRESS","TEMPERATURE_STRESS","SALINITY","SOIL_PH","ROOT_ZONE_STRESS","CHEMICAL_INJURY","FERTILIZER_INJURY","APPLICATION_INJURY","MECHANICAL_INJURY","ESTABLISHMENT_PROBLEM","VARIETAL_OR_DEVELOPMENTAL","UNKNOWN"]);
const AUTHORITIES = new Set(["GOVERNED_KNOWLEDGE_RELATIONSHIP","BOUNDED_RUNTIME_RULE","TEST_ONLY_FIXTURE"]);
const PRODUCTION_AUTHORITIES = new Set(["GOVERNED_KNOWLEDGE_RELATIONSHIP","BOUNDED_RUNTIME_RULE"]);
const REVIEW_STATES = new Set(["HUMAN_REVIEWED","DOMAIN_APPROVED"]);
const RELATIONS = new Set(["REQUIRED","TYPICAL","COMMON","POSSIBLE","CONTRADICTORY"]);
const DIMENSIONS = new Set(["BIOLOGICAL_STAGE","SPATIAL","MORPHOLOGY","SEVERITY","SAMPLING","ENVIRONMENT","MANAGEMENT_HISTORY","ABIOTIC","TEMPORAL","VISUAL"]);
const EVIDENCE_RELATIONS = new Set(["SUPPORTS","WEAKLY_SUPPORTS","NEUTRAL","CONTRADICTS","STRONGLY_CONTRADICTS","REQUIRED_BUT_MISSING","NOT_APPLICABLE"]);
const FACTS = new Set(["MORPHOLOGY_PHENOTYPE","MORPHOLOGY_PLANT_PART","MORPHOLOGY_NEAR_WATERLINE","SPATIAL_PATTERN","FIELD_POSITION","WATER_STATE","STAGE","MANAGEMENT_EVENT","TEMPORAL_INCOMPATIBILITY"]);
const GAP_CODES = new Set(["MISSING_CANDIDATE_RELATIONSHIP","MISSING_DISTINGUISHING_EVIDENCE_RULE","MISSING_STAGE_RELATIONSHIP","MISSING_MORPHOLOGY_RELATIONSHIP","MISSING_ABIOTIC_COMPARISON","MISSING_SOURCE_REFERENCE","UNREVIEWED_RULE","UNKNOWN"]);
const PROHIBITED_KEYS = /^(probability|rank|rank_score|score|risk_score|product|active_ingredient|rate|recommendation|diagnosis)$/i;

const stableJson = (value) => Array.isArray(value) ? `[${value.map(stableJson).join(",")}]` : value && typeof value === "object" ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}` : JSON.stringify(value);
const contentHash = (value) => createHash("sha256").update(stableJson(value)).digest("hex");
const fail = (message) => { throw new InvestigationContractError(message, "CANDIDATE_PROVIDER_VALIDATION_ERROR", 400); };
const object = (value, name) => { if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${name} must be an object`); return value; };
const array = (value, name) => { if (!Array.isArray(value)) fail(`${name} must be an array`); return value; };
const text = (value, name) => { if (typeof value !== "string" || !value.trim()) fail(`invalid ${name}`); return value.trim(); };
const member = (value, allowed, name) => { if (!allowed.has(value)) fail(`invalid ${name}`); return value; };
const unique = (values) => [...new Set(values)];

function rejectProhibitedFields(value, path = "package") {
  if (Array.isArray(value)) return value.forEach((item, index) => rejectProhibitedFields(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (PROHIBITED_KEYS.test(key)) fail(`${path} contains prohibited field: ${key}`);
    rejectProhibitedFields(child, `${path}.${key}`);
  }
}

function validateRuleCommon(rule, sourceIds, knowledgeIds, authority, reviewState, allowTestFixtures) {
  text(rule.rule_id, "rule_id");
  const ruleAuthority = member(rule.authority ?? authority, AUTHORITIES, "rule authority");
  if (!allowTestFixtures && !PRODUCTION_AUTHORITIES.has(ruleAuthority)) fail("TEST_ONLY_FIXTURE rule cannot load in normal runtime");
  member(rule.review_state ?? reviewState, REVIEW_STATES, "rule review state");
  text(rule.scope, "rule scope");
  text(rule.materialized_at, "rule materialized_at");
  for (const sourceRef of array(rule.source_refs, "rule source_refs")) if (!sourceIds.has(sourceRef)) fail(`dangling source reference: ${sourceRef}`);
  for (const recordId of array(rule.source_concept_claim_ids, "source_concept_claim_ids")) if (!knowledgeIds.has(recordId)) fail(`dangling knowledge record reference: ${recordId}`);
}

export function validateCandidateProviderPackage(input, { allowTestFixtures = false } = {}) {
  const value = structuredClone(object(input, "candidate provider package"));
  rejectProhibitedFields(value);
  if (value.schema_version !== "candidate-provider-package/v1") fail("unsupported candidate provider schema_version");
  const manifest = object(value.manifest, "provider manifest");
  text(manifest.provider_id, "provider_id"); text(manifest.provider_version, "provider_version"); text(manifest.knowledge_snapshot, "knowledge_snapshot");
  const authority = member(manifest.authority, AUTHORITIES, "provider authority"), reviewState = member(manifest.review_state, REVIEW_STATES, "provider review state");
  if (!allowTestFixtures && !PRODUCTION_AUTHORITIES.has(authority)) fail("TEST_ONLY_FIXTURE cannot load in normal runtime");
  if (!array(manifest.crop_scope, "crop_scope").length) fail("provider crop_scope is required");
  text(manifest.valid_from, "valid_from"); text(manifest.materialized_at, "materialized_at");

  const sources = array(value.sources, "sources"), sourceIds = new Set(), knowledgeIds = new Set();
  for (const source of sources) {
    object(source, "source"); const sourceRef = text(source.source_ref, "source_ref");
    if (sourceIds.has(sourceRef)) fail(`duplicate source reference: ${sourceRef}`); sourceIds.add(sourceRef);
    text(source.repository_path, "repository_path"); const sourceAuthority = member(source.authority, AUTHORITIES, "source authority"); if (!allowTestFixtures && !PRODUCTION_AUTHORITIES.has(sourceAuthority)) fail("TEST_ONLY_FIXTURE source cannot load in normal runtime"); member(source.review_state, REVIEW_STATES, "source review state");
    for (const recordId of array(source.knowledge_record_ids, "knowledge_record_ids")) { text(recordId, "knowledge record id"); knowledgeIds.add(recordId); }
  }
  for (const sourceRef of array(manifest.source_refs, "manifest source_refs")) if (!sourceIds.has(sourceRef)) fail(`dangling manifest source reference: ${sourceRef}`);

  const concepts = array(value.candidate_concepts, "candidate_concepts"), conceptIds = new Set();
  for (const concept of concepts) {
    object(concept, "candidate concept"); const conceptId = text(concept.concept_id, "concept_id");
    if (conceptIds.has(conceptId)) fail(`duplicate candidate concept: ${conceptId}`); conceptIds.add(conceptId);
    if (!knowledgeIds.has(conceptId)) fail(`candidate concept does not resolve to governed knowledge: ${conceptId}`);
    member(concept.candidate_class, CANDIDATE_CLASSES, "candidate class"); text(concept.label, "candidate label");
    for (const sourceRef of array(concept.source_refs, "candidate source_refs")) if (!sourceIds.has(sourceRef)) fail(`dangling candidate source reference: ${sourceRef}`);
  }

  const ruleIds = new Set();
  for (const rule of array(value.nomination_rules, "nomination_rules")) {
    object(rule, "nomination rule"); validateRuleCommon(rule, sourceIds, knowledgeIds, authority, reviewState, allowTestFixtures);
    if (ruleIds.has(rule.rule_id)) fail(`duplicate rule_id: ${rule.rule_id}`); ruleIds.add(rule.rule_id);
    if (!conceptIds.has(rule.candidate_concept_id)) fail(`dangling candidate concept reference: ${rule.candidate_concept_id}`);
    if (!manifest.crop_scope.includes(rule.crop)) fail(`rule crop is outside provider scope: ${rule.crop}`);
    text(rule.nomination_reason, "nomination_reason");
    for (const relation of array(rule.trigger_relations, "trigger_relations")) member(relation, RELATIONS, "trigger relation");
    const match = object(rule.match, "rule match");
    for (const clause of [...(match.all ?? []), ...(match.any ?? [])]) { object(clause, "match clause"); member(clause.fact, FACTS, "match fact"); if (!("value" in clause)) fail("match clause value is required"); }
    if (!(match.all?.length || match.any?.length)) fail("nomination rule requires at least one match clause");
    if (rule.relationship_state != null && !["SUPPORTED","CONTESTED"].includes(rule.relationship_state)) fail("invalid relationship_state");
  }
  for (const rule of array(value.comparison_rules, "comparison_rules")) {
    object(rule, "comparison rule"); validateRuleCommon(rule, sourceIds, knowledgeIds, authority, reviewState, allowTestFixtures);
    if (ruleIds.has(rule.rule_id)) fail(`duplicate rule_id: ${rule.rule_id}`); ruleIds.add(rule.rule_id);
    const ids = array(rule.candidate_concept_ids, "comparison candidate_concept_ids"); if (!ids.length) fail("comparison rule requires candidate concepts");
    for (const conceptId of ids) if (!conceptIds.has(conceptId)) fail(`dangling comparison candidate concept: ${conceptId}`);
    text(rule.evidence_concept, "evidence_concept"); member(rule.relation, RELATIONS, "comparison relation"); member(rule.dimension, DIMENSIONS, "comparison dimension"); object(rule.next_best_evidence, "next_best_evidence");
  }
  for (const rule of value.adjudication_rules ?? []) {
    object(rule, "adjudication rule"); validateRuleCommon(rule, sourceIds, knowledgeIds, authority, reviewState, allowTestFixtures);
    if (ruleIds.has(rule.rule_id)) fail(`duplicate rule_id: ${rule.rule_id}`); ruleIds.add(rule.rule_id);
    if (!conceptIds.has(rule.candidate_concept_id)) fail(`dangling adjudication candidate concept: ${rule.candidate_concept_id}`);
    member(rule.dimension, DIMENSIONS, "adjudication dimension"); member(rule.relation, EVIDENCE_RELATIONS, "adjudication relation"); member(rule.constraint, RELATIONS, "adjudication constraint");
    if (rule.match) for (const clause of [...(rule.match.all ?? []), ...(rule.match.any ?? [])]) { object(clause, "adjudication match clause"); member(clause.fact, FACTS, "adjudication match fact"); }
  }
  for (const gap of value.knowledge_gaps ?? []) member(gap.code, GAP_CODES, "knowledge gap code");
  const hashBasis = structuredClone(value); delete hashBasis.manifest.content_hash; delete hashBasis.manifest.loaded_at;
  const computedHash = contentHash(hashBasis);
  if (manifest.content_hash && manifest.content_hash !== computedHash) fail("provider manifest content_hash mismatch");
  value.manifest.content_hash = computedHash;
  return value;
}

function factMatches(clause, bundle) {
  const results = [];
  const add = (recordType, recordId) => results.push({ record_type: recordType, record_id: recordId });
  if (clause.fact === "STAGE") {
    const stage = bundle.stage_assessment?.crop_stage?.code ?? bundle.stage_assessment?.cmp_stage?.stage_id ?? null;
    if (stage === clause.value) add("STAGE_ASSESSMENT", bundle.stage_assessment.stage_assessment_id);
  }
  for (const evidence of bundle.evidence ?? []) {
    const payload = evidence.payload ?? evidence;
    if (clause.fact === "MORPHOLOGY_PHENOTYPE" && evidence.evidence_type === "MORPHOLOGY" && [...(payload.primary_phenotypes ?? []), ...(payload.secondary_symptoms ?? [])].includes(clause.value)) add("MORPHOLOGY", evidence.evidence_id);
    if (clause.fact === "MORPHOLOGY_PLANT_PART" && evidence.evidence_type === "MORPHOLOGY" && payload.plant_part === clause.value) add("MORPHOLOGY", evidence.evidence_id);
    if (clause.fact === "MORPHOLOGY_NEAR_WATERLINE" && evidence.evidence_type === "MORPHOLOGY" && payload.near_waterline === clause.value) add("MORPHOLOGY", evidence.evidence_id);
    if (clause.fact === "SPATIAL_PATTERN" && evidence.evidence_type === "SPATIAL" && (payload.patterns ?? []).includes(clause.value)) add("SPATIAL", evidence.evidence_id);
    if (clause.fact === "FIELD_POSITION" && evidence.evidence_type === "SPATIAL" && (payload.field_positions ?? []).includes(clause.value)) add("SPATIAL", evidence.evidence_id);
    if (clause.fact === "WATER_STATE" && evidence.evidence_type === "WATER" && payload.water_state === clause.value) add("WATER", evidence.evidence_id);
  }
  for (const event of bundle.management_events ?? []) if (clause.fact === "MANAGEMENT_EVENT" && event.event_type === clause.value) add("MANAGEMENT_EVENT", event.management_event_id);
  for (const relation of bundle.temporal_relationships ?? []) if (clause.fact === "TEMPORAL_INCOMPATIBILITY" && relation.incompatible_with_initial_cause === clause.value) add("TEMPORAL_RELATIONSHIP", relation.temporal_relationship_id);
  return results;
}

function evaluateMatch(match, bundle) {
  const all = (match.all ?? []).map((clause) => factMatches(clause, bundle));
  const any = (match.any ?? []).map((clause) => factMatches(clause, bundle));
  const matched = all.every((items) => items.length) && (!any.length || any.some((items) => items.length));
  return { matched, triggering_evidence_refs: unique([...all.flat(), ...any.flat()].map((item) => `${item.record_type}:${item.record_id}`)).map((key) => { const [record_type, ...idParts] = key.split(":"); return { record_type, record_id: idParts.join(":") }; }) };
}

export class GovernedCandidateProvider {
  constructor(packageData, { allowTestFixtures = false, clock = () => new Date() } = {}) {
    this.package = validateCandidateProviderPackage(packageData, { allowTestFixtures });
    this.manifest = Object.freeze({ ...this.package.manifest, loaded_at: clock().toISOString() });
    this.version = this.manifest.provider_version;
    this.authority = this.manifest.authority;
    this.reviewState = this.manifest.review_state;
  }
  getManifest() { return structuredClone(this.manifest); }
  nominate(bundle) {
    if (bundle?.authority !== "SERVER") fail("Candidate nomination requires an authoritative server Investigation Bundle");
    const crop = String(bundle.field_context?.crop ?? "UNKNOWN").toUpperCase(), concepts = new Map(this.package.candidate_concepts.map((item) => [item.concept_id, item])), nominations = [], conflicts = [];
    for (const rule of this.package.nomination_rules) {
      if (rule.crop !== crop) continue;
      const match = evaluateMatch(rule.match, bundle); if (!match.matched) continue;
      const concept = concepts.get(rule.candidate_concept_id), ruleHash = contentHash(rule);
      nominations.push({ candidate_id: `candidate-concept-${contentHash(concept.concept_id).slice(0,24)}`, concept_id: concept.concept_id, candidate_class: concept.candidate_class, label: concept.label, nomination_reason: rule.nomination_reason, triggering_evidence_refs: match.triggering_evidence_refs, knowledge_relationship_refs: [rule.rule_id, ...rule.source_concept_claim_ids], source_refs: structuredClone(rule.source_refs), source_concept_claim_ids: structuredClone(rule.source_concept_claim_ids), provider_id: this.manifest.provider_id, provider_version: this.manifest.provider_version, provider_content_hash: this.manifest.content_hash, authority: rule.authority ?? this.manifest.authority, review_state: rule.review_state ?? this.manifest.review_state, scope: rule.scope, materialized_at: rule.materialized_at, rule_id: rule.rule_id, rule_hash: ruleHash, relationship_state: rule.relationship_state ?? "SUPPORTED" });
      if (rule.relationship_state === "CONTESTED") conflicts.push({ code: "CONTESTED_RELATIONSHIP", candidate_concept_id: concept.concept_id, rule_refs: [rule.rule_id], reason: "The applicable governed relationship is explicitly contested and is retained without last-loaded-wins resolution." });
    }
    const grouped = new Map();
    for (const nomination of nominations) { const current = grouped.get(nomination.concept_id) ?? { ...nomination, nomination_sources: [] }; current.nomination_sources.push({ type: "GOVERNED_PROVIDER", reason: nomination.nomination_reason, triggering_evidence_refs: nomination.triggering_evidence_refs, knowledge_relationship_refs: nomination.knowledge_relationship_refs, source_refs: nomination.source_refs, source_concept_claim_ids: nomination.source_concept_claim_ids, rule_id: nomination.rule_id, rule_hash: nomination.rule_hash, authority: nomination.authority, review_state: nomination.review_state, scope: nomination.scope, materialized_at: nomination.materialized_at, provider_id: nomination.provider_id, provider_version: nomination.provider_version, provider_content_hash: nomination.provider_content_hash }); current.triggering_evidence_refs = unique([...current.triggering_evidence_refs, ...nomination.triggering_evidence_refs].map((item) => `${item.record_type}:${item.record_id}`)).map((key) => { const [record_type, ...rest] = key.split(":"); return { record_type, record_id: rest.join(":") }; }); grouped.set(nomination.concept_id, current); }
    const nominated = [...grouped.values()].sort((a, b) => a.concept_id.localeCompare(b.concept_id));
    const nominatedIds = new Set(nominated.map((item) => item.concept_id));
    const comparisons = this.package.comparison_rules.filter((rule) => rule.candidate_concept_ids.every((conceptId) => nominatedIds.has(conceptId)) || (rule.candidate_concept_ids.length === 1 && nominatedIds.has(rule.candidate_concept_ids[0]))).map((rule) => ({ ...structuredClone(rule), rule_hash: contentHash(rule) }));
    const adjudicationRules = (this.package.adjudication_rules ?? []).filter((rule) => nominatedIds.has(rule.candidate_concept_id)).flatMap((rule) => { const match = rule.match ? evaluateMatch(rule.match, bundle) : { matched: true, triggering_evidence_refs: [] }; if (!match.matched) return []; return [{ ...structuredClone(rule), knowledge_source_refs: structuredClone(rule.source_refs), source_refs: match.triggering_evidence_refs, rule_hash: contentHash(rule) }]; });
    const gaps = structuredClone(this.package.knowledge_gaps ?? []);
    if (crop === "UNKNOWN") gaps.push({ code: "MISSING_CANDIDATE_RELATIONSHIP", dimension: "CROP", reason: "Authoritative crop context is unavailable; crop-scoped governed rules were not applied." });
    else if (!nominated.length) gaps.push({ code: "MISSING_CANDIDATE_RELATIONSHIP", dimension: "OBSERVATION_TO_CANDIDATE", reason: "No reviewed provider relationship matches the current authoritative evidence. No Candidate was invented." });
    if (nominated.length && !comparisons.length) gaps.push({ code: "MISSING_DISTINGUISHING_EVIDENCE_RULE", dimension: "COMPARISON", reason: "No reviewed comparison relationship covers the currently nominated Candidate set." });
    return { provider_manifest: this.getManifest(), nominated_candidates: nominated, comparison_rules: comparisons, adjudication_rules: adjudicationRules, knowledge_gaps: gaps, conflicts };
  }
}

const bundledPackage = JSON.parse(readFileSync(new URL("./candidate-provider-package.json", import.meta.url), "utf8"));
export function loadCandidateProvider(options = {}) { return new GovernedCandidateProvider(bundledPackage, options); }

export function createEmptyCandidateProvider() {
  return { version: "no-candidate-provider/v1", authority: "BOUNDED_RUNTIME_RULE", reviewState: "HUMAN_REVIEWED", getManifest: () => ({ provider_id: "no-candidate-provider", provider_version: "1", content_hash: contentHash({ empty: true }), authority: "BOUNDED_RUNTIME_RULE", review_state: "HUMAN_REVIEWED", crop_scope: [], knowledge_snapshot: "NONE", source_refs: [], valid_from: "2026-08-27T00:00:00.000Z", materialized_at: "2026-08-27T00:00:00.000Z", loaded_at: "2026-08-27T00:00:00.000Z" }), nominate: () => ({ provider_manifest: null, nominated_candidates: [], comparison_rules: [], adjudication_rules: [], knowledge_gaps: [], conflicts: [] }) };
}

export function createGoldenTestOnlyCandidateProvider({ version = "golden-test-candidate-provider/v1", contested = false } = {}) {
  const source = { source_ref: "TEST-SOURCE/v1", repository_path: "prototype/sp-assistant/tests/candidate-provider.test.mjs", knowledge_record_ids: ["TEST-WATER-ROOT","TEST-SHEATH","TEST-APPLICATION","TEST-CLAIM-WATER","TEST-CLAIM-SHEATH","TEST-CLAIM-APPLICATION"], authority: "TEST_ONLY_FIXTURE", review_state: "HUMAN_REVIEWED" };
  const common = { source_concept_claim_ids: [], source_refs: [source.source_ref], authority: "TEST_ONLY_FIXTURE", review_state: "HUMAN_REVIEWED", scope: "TEST_ONLY_GOLDEN_CASE", materialized_at: "2026-08-27T00:00:00.000Z" };
  const packageData = { schema_version: "candidate-provider-package/v1", manifest: { provider_id: "golden-test-only-candidate-provider", provider_version: version, knowledge_snapshot: "TEST_ONLY_FIXTURE", crop_scope: ["RICE"], authority: "TEST_ONLY_FIXTURE", review_state: "HUMAN_REVIEWED", source_refs: [source.source_ref], valid_from: "2026-08-27T00:00:00.000Z", supersedes: null, materialized_at: "2026-08-27T00:00:00.000Z" }, sources: [source], candidate_concepts: [
    { concept_id: "TEST-WATER-ROOT", candidate_class: "ROOT_ZONE_STRESS", label: "WATER_ROOT_STRESS", source_refs: [source.source_ref] },
    { concept_id: "TEST-SHEATH", candidate_class: "DISEASE", label: "SHEATH_RELATED_PROBLEM", source_refs: [source.source_ref] },
    { concept_id: "TEST-APPLICATION", candidate_class: "APPLICATION_INJURY", label: "APPLICATION_INJURY", source_refs: [source.source_ref] }
  ], nomination_rules: [
    { ...common, rule_id: "TEST-NOM-WATER", candidate_concept_id: "TEST-WATER-ROOT", crop: "RICE", match: { all: [{ fact: "SPATIAL_PATTERN", value: "PATCH" }, { fact: "FIELD_POSITION", value: "LOW_SPOT" }, { fact: "WATER_STATE", value: "DEEP_PONDED" }] }, nomination_reason: "TEST_ONLY Golden Case water/root nomination.", trigger_relations: ["POSSIBLE"], source_concept_claim_ids: ["TEST-WATER-ROOT","TEST-CLAIM-WATER"], ...(contested ? { relationship_state: "CONTESTED" } : {}) },
    { ...common, rule_id: "TEST-NOM-SHEATH", candidate_concept_id: "TEST-SHEATH", crop: "RICE", match: { all: [{ fact: "MORPHOLOGY_PLANT_PART", value: "LEAF_SHEATH" }, { fact: "MORPHOLOGY_PHENOTYPE", value: "LESION" }] }, nomination_reason: "TEST_ONLY Golden Case sheath nomination.", trigger_relations: ["POSSIBLE"], source_concept_claim_ids: ["TEST-SHEATH","TEST-CLAIM-SHEATH"] },
    { ...common, rule_id: "TEST-NOM-APPLICATION", candidate_concept_id: "TEST-APPLICATION", crop: "RICE", match: { any: [{ fact: "MANAGEMENT_EVENT", value: "FERTILIZER_APPLICATION" }, { fact: "MANAGEMENT_EVENT", value: "PESTICIDE_APPLICATION" }] }, nomination_reason: "TEST_ONLY Golden Case application-history nomination.", trigger_relations: ["POSSIBLE"], source_concept_claim_ids: ["TEST-APPLICATION","TEST-CLAIM-APPLICATION"] }
  ], comparison_rules: [{ ...common, rule_id: "TEST-COMPARE-ROOT", candidate_concept_ids: ["TEST-WATER-ROOT","TEST-SHEATH"], evidence_concept: "ROOT_COMPARISON", relation: "REQUIRED", dimension: "ABIOTIC", source_concept_claim_ids: ["TEST-WATER-ROOT","TEST-SHEATH"], next_best_evidence: { type: "FIELD_CHECK", target: "ROOT_COMPARISON", comparison: "AFFECTED_VS_NORMAL", purpose: "DISTINGUISH_CANDIDATES", discrimination_goal: "Exercise provider-to-Step-C comparison selection.", value: "HIGH", reason: "TEST_ONLY Golden Case comparison." } }], adjudication_rules: [
    { ...common, rule_id: "TEST-ADJ-WATER-SPATIAL", candidate_concept_id: "TEST-WATER-ROOT", dimension: "SPATIAL", relation: "SUPPORTS", constraint: "POSSIBLE", reason: "TEST_ONLY spatial relationship.", match: { all: [{ fact: "SPATIAL_PATTERN", value: "PATCH" }] }, source_concept_claim_ids: ["TEST-WATER-ROOT","TEST-CLAIM-WATER"] },
    { ...common, rule_id: "TEST-ADJ-WATER-ENV", candidate_concept_id: "TEST-WATER-ROOT", dimension: "ENVIRONMENT", relation: "SUPPORTS", constraint: "POSSIBLE", reason: "TEST_ONLY water relationship.", match: { all: [{ fact: "WATER_STATE", value: "DEEP_PONDED" }] }, source_concept_claim_ids: ["TEST-WATER-ROOT","TEST-CLAIM-WATER"] },
    { ...common, rule_id: "TEST-ADJ-SHEATH", candidate_concept_id: "TEST-SHEATH", dimension: "MORPHOLOGY", relation: "SUPPORTS", constraint: "POSSIBLE", reason: "TEST_ONLY sheath relationship.", match: { all: [{ fact: "MORPHOLOGY_PHENOTYPE", value: "LESION" }] }, source_concept_claim_ids: ["TEST-SHEATH","TEST-CLAIM-SHEATH"] },
    { ...common, rule_id: "TEST-ADJ-APPLICATION", candidate_concept_id: "TEST-APPLICATION", dimension: "MANAGEMENT_HISTORY", relation: "SUPPORTS", constraint: "POSSIBLE", reason: "TEST_ONLY application-history relationship.", match: { all: [{ fact: "MANAGEMENT_EVENT", value: "FERTILIZER_APPLICATION" }] }, source_concept_claim_ids: ["TEST-APPLICATION","TEST-CLAIM-APPLICATION"] },
    { ...common, rule_id: "TEST-ADJ-APPLICATION-TIME", candidate_concept_id: "TEST-APPLICATION", dimension: "TEMPORAL", relation: "CONTRADICTS", constraint: "CONTRADICTORY", reason: "TEST_ONLY symptoms predate application.", match: { all: [{ fact: "TEMPORAL_INCOMPATIBILITY", value: true }] }, source_concept_claim_ids: ["TEST-APPLICATION","TEST-CLAIM-APPLICATION"] }
  ] };
  return new GovernedCandidateProvider(packageData, { allowTestFixtures: true });
}
