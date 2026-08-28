import { createHash, randomUUID } from "node:crypto";
import { InvestigationContractError } from "./investigation-backbone.mjs";

export const MANAGEMENT_OPTION_ENGINE_VERSION = "governed-management-option-runtime/v1";
export const NEED_FOR_ACTION_MODEL_VERSION = "need-for-action-decision/v1";
export const MANAGEMENT_SUITABILITY_MODEL_VERSION = "management-case-suitability/v1";
export const MANAGEMENT_REVIEW_MODEL_VERSION = "governed-management-review/v1";

export const MANAGEMENT_OPTION_ENUMS = Object.freeze({
  needForActionStates: ["MORE_EVIDENCE_REQUIRED", "CONTINUE_MONITORING", "NO_ACTION_DETERMINATION_SUPPORTED", "MANAGEMENT_REVIEW_JUSTIFIED", "HUMAN_REVIEW_REQUIRED"],
  optionClasses: ["CONTINUE_MONITORING", "CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "BIOLOGICAL_MANAGEMENT", "CHEMICAL_REVIEW", "EXPERT_REVIEW", "NO_ACTION_CURRENTLY_JUSTIFIED"],
  suitabilitySourceClasses: ["CONTINUE_MONITORING", "CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "WATER_MANAGEMENT", "BIOLOGICAL_MANAGEMENT", "CHEMICAL_REVIEW", "EXPERT_REVIEW", "NO_ACTION_CURRENTLY_JUSTIFIED"],
  eligibilityStates: ["SUPPORTED_FOR_REVIEW", "MORE_EVIDENCE_REQUIRED", "NOT_SUPPORTED_BY_CURRENT_EVIDENCE", "BLOCKED_BY_AUTHORITY", "HUMAN_REVIEW_REQUIRED", "NOT_APPLICABLE"],
  knowledgeGaps: ["MISSING_ACTION_EVIDENCE", "MISSING_MANAGEMENT_RELATIONSHIP", "MISSING_CASE_SUITABILITY_RULE", "MISSING_REGULATORY_CHAIN", "MISSING_CURRENT_AUTHORITY", "CONFLICTING_AUTHORITY", "FAILED_CONTROL_REVIEW_REQUIRED", "UNKNOWN"],
});

const sets = Object.fromEntries(Object.entries(MANAGEMENT_OPTION_ENUMS).map(([key, values]) => [key, new Set(values)]));
const canonical = (value) => Array.isArray(value) ? `[${value.map(canonical).join(",")}]` : value && typeof value === "object" ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}` : JSON.stringify(value);
const hash = (value) => createHash("sha256").update(canonical(value)).digest("hex");
const fail = (message, code = "VALIDATION_ERROR", status = code === "AUTHORIZATION_ERROR" ? 403 : 400) => { throw new InvestigationContractError(message, code, status); };
const object = (value, name) => { if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${name} must be an object`); return value; };
const identifier = (value, name, { optional = false } = {}) => { if (optional && value == null) return null; if (typeof value !== "string" || !/^[A-Za-z0-9._:/-]{1,240}$/.test(value)) fail(`invalid ${name}`); return value; };
const text = (value, name, { optional = false, max = 2_000 } = {}) => { if (optional && value == null) return null; if (typeof value !== "string" || !value.trim() || value.length > max) fail(`invalid ${name}`); return value.trim(); };
const member = (value, set, name) => { if (!set.has(value)) fail(`invalid ${name}`); return value; };
const compact = (values) => [...new Set(values.filter(Boolean))];

const DEFAULT_RULE_PACKAGE = Object.freeze({
  manifest: {
    provider_id: "cp-moakb-management-governance",
    provider_version: "1.0.0",
    authority: "GOVERNED_MANAGEMENT_POLICY",
    review_state: "HUMAN_REVIEWED",
  },
  need_for_action: null,
  management_relationships: [],
  failed_control_context: null,
  regulatory_authority: {
    jurisdiction: "TH",
    authority_class: "PRIMARY_OFFICIAL_REGULATOR",
    current: false,
    conflicting: false,
    defensible_join_key: false,
    exact_chain: { crop: null, target: null, use: null, registration: null },
    authority_refs: ["GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1", "GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1"],
    limitation: "Current governed evidence does not complete a defensible Crop x Target x Use x Registration chain.",
  },
});

function validateRulePackage(raw, { allowTestFixtures = false } = {}) {
  object(raw, "management rule package");
  const manifest = object(raw.manifest, "management rule manifest");
  const authority = identifier(manifest.authority, "management rule authority");
  if (authority === "TEST_ONLY_FIXTURE" && !allowTestFixtures) fail("TEST_ONLY_FIXTURE cannot load in normal runtime");
  if (!new Set(["GOVERNED_MANAGEMENT_POLICY", "GOVERNED_KNOWLEDGE_RELATIONSHIP", "TEST_ONLY_FIXTURE"]).has(authority)) fail("unsupported management rule authority");
  const need = raw.need_for_action == null ? null : object(raw.need_for_action, "need_for_action rule");
  if (need) member(need.state, sets.needForActionStates, "need-for-action state");
  const relationships = (raw.management_relationships ?? []).map((relationship, index) => {
    object(relationship, `management relationship ${index}`);
    const sourceClass = member(relationship.option_class, sets.suitabilitySourceClasses, "management relationship option class");
    return {
      rule_id: identifier(relationship.rule_id, "management relationship rule_id"),
      option_class: sourceClass,
      case_relevant: relationship.case_relevant === true,
      reason: text(relationship.reason, "management relationship reason"),
      supporting_evidence_refs: compact((relationship.supporting_evidence_refs ?? []).map((value) => identifier(value, "supporting evidence ref"))),
      missing_evidence_refs: compact((relationship.missing_evidence_refs ?? []).map((value) => identifier(value, "missing evidence ref"))),
      contradicting_evidence_refs: compact((relationship.contradicting_evidence_refs ?? []).map((value) => identifier(value, "contradicting evidence ref"))),
      source_refs: compact((relationship.source_refs ?? []).map((value) => identifier(value, "scientific source ref"))),
      limitations: (relationship.limitations ?? []).map((value) => text(value, "management relationship limitation")),
      human_review_required: relationship.human_review_required === true,
      source_option_class: sourceClass,
    };
  });
  const regulatory = object(raw.regulatory_authority ?? DEFAULT_RULE_PACKAGE.regulatory_authority, "regulatory authority");
  const exact = object(regulatory.exact_chain ?? {}, "regulatory exact chain");
  return {
    manifest: {
      provider_id: identifier(manifest.provider_id, "provider_id"),
      provider_version: identifier(manifest.provider_version, "provider_version"),
      authority,
      review_state: identifier(manifest.review_state, "review_state"),
    },
    need_for_action: need ? {
      state: need.state,
      reason: text(need.reason, "need-for-action reason"),
      supporting_evidence_refs: compact((need.supporting_evidence_refs ?? []).map((value) => identifier(value, "need supporting evidence ref"))),
      missing_evidence_refs: compact((need.missing_evidence_refs ?? []).map((value) => identifier(value, "need missing evidence ref"))),
      source_rule_id: identifier(need.source_rule_id, "need source_rule_id"),
      source_refs: compact((need.source_refs ?? []).map((value) => identifier(value, "need source ref"))),
      limitations: (need.limitations ?? []).map((value) => text(value, "need limitation")),
    } : null,
    management_relationships: relationships,
    failed_control_context: raw.failed_control_context == null ? null : {
      evidence_refs: compact((raw.failed_control_context.evidence_refs ?? []).map((value) => identifier(value, "failed-control evidence ref"))),
      limitations: (raw.failed_control_context.limitations ?? []).map((value) => text(value, "failed-control limitation")),
    },
    regulatory_authority: {
      jurisdiction: identifier(regulatory.jurisdiction ?? "TH", "regulatory jurisdiction"),
      authority_class: identifier(regulatory.authority_class ?? "PRIMARY_OFFICIAL_REGULATOR", "regulatory authority class"),
      current: regulatory.current === true,
      conflicting: regulatory.conflicting === true,
      defensible_join_key: regulatory.defensible_join_key === true,
      exact_chain: {
        crop: exact.crop == null ? null : text(exact.crop, "regulatory crop", { max: 300 }),
        target: exact.target == null ? null : text(exact.target, "regulatory target", { max: 300 }),
        use: exact.use == null ? null : text(exact.use, "regulatory use", { max: 300 }),
        registration: exact.registration == null ? null : identifier(exact.registration, "regulatory registration"),
      },
      authority_refs: compact((regulatory.authority_refs ?? []).map((value) => identifier(value, "regulatory authority ref"))),
      limitation: text(regulatory.limitation ?? "Regulatory authority is incomplete.", "regulatory limitation"),
    },
  };
}

export class ManagementRuleProvider {
  constructor(rulePackage = DEFAULT_RULE_PACKAGE, options = {}) {
    this.rulePackage = validateRulePackage(structuredClone(rulePackage), options);
    this.contentHash = hash(this.rulePackage);
  }
  getManifest() { return { ...this.rulePackage.manifest, content_hash:this.contentHash }; }
  getRules() { return structuredClone(this.rulePackage); }
}

export function createTestOnlyManagementRuleProvider(configuration = {}) {
  return new ManagementRuleProvider({
    ...structuredClone(DEFAULT_RULE_PACKAGE),
    ...structuredClone(configuration),
    manifest: { provider_id:"step-f1-test-fixture", provider_version:"test-only/v1", authority:"TEST_ONLY_FIXTURE", review_state:"TEST_ONLY" },
  }, { allowTestFixtures:true });
}

function authoritativeRefs(bundle) {
  return new Set([
    bundle.stage_assessment?.stage_assessment_id,
    ...(bundle.observations ?? []).map((item) => item.observation_id),
    ...(bundle.evidence ?? []).map((item) => item.evidence_id),
    ...(bundle.management_events ?? []).map((item) => item.management_event_id),
    ...(bundle.candidates ?? []).map((item) => item.candidate_id),
    ...(bundle.temporal_evidence ?? []).map((item) => item.temporal_evidence_id),
    ...(bundle.temporal_relationships ?? []).map((item) => item.temporal_relationship_id),
    ...(bundle.outcomes ?? []).map((item) => item.outcome_id),
  ].filter(Boolean));
}

function validateCaseEvidenceRefs(rules, bundle) {
  const refs = authoritativeRefs(bundle);
  const caseRefs = [
    ...(rules.need_for_action?.supporting_evidence_refs ?? []),
    ...(rules.failed_control_context?.evidence_refs ?? []),
    ...rules.management_relationships.flatMap((item) => [...item.supporting_evidence_refs, ...item.contradicting_evidence_refs]),
  ];
  for (const ref of caseRefs) if (!refs.has(ref)) fail("management rule references evidence outside the authoritative Investigation Bundle");
}

function regulatoryGate(authority) {
  const chain = authority.exact_chain;
  const chainComplete = Boolean(chain.crop && chain.target && chain.use && chain.registration && authority.defensible_join_key);
  const currentAuthority = authority.current && authority.jurisdiction === "TH" && authority.authority_class === "PRIMARY_OFFICIAL_REGULATOR";
  const satisfied = chainComplete && currentAuthority && !authority.conflicting;
  const gaps = authority.conflicting ? ["CONFLICTING_AUTHORITY"] : [!chainComplete ? "MISSING_REGULATORY_CHAIN" : null, !currentAuthority ? "MISSING_CURRENT_AUTHORITY" : null].filter(Boolean);
  return {
    state: satisfied ? "ELIGIBLE_FOR_DECISION_REVIEW" : authority.conflicting ? "CONFLICTING_AUTHORITY" : chainComplete ? "MISSING_CURRENT_AUTHORITY" : "MISSING_REGULATORY_CHAIN",
    satisfied,
    exact_chain_complete: chainComplete,
    current_authority_confirmed: currentAuthority,
    human_review_can_waive: false,
    authority_refs: authority.authority_refs,
    authority_class: authority.authority_class,
    jurisdiction: authority.jurisdiction,
    knowledge_gaps: gaps,
    limitation: authority.limitation,
  };
}

function reviewedFinding(assessment) {
  const review = [...(assessment.review_history ?? [])].reverse().find((item) => item.action === "RESOLVE_FINDING");
  if (!review) return null;
  return { review_id:review.review_id, assessment_id:assessment.assessment_id, assessment_revision:assessment.assessment_revision, resolution_level:review.resolution_level, candidate_findings:review.candidate_findings, reviewed_at:review.created_at };
}

function targetProblem(assessment, finding, rules) {
  const declared = rules.management_relationships.flatMap((item) => item.supporting_evidence_refs).find((ref) => (assessment.candidate_assessments ?? []).some((candidate) => candidate.candidate_id === ref));
  return finding?.candidate_findings?.find((item) => item.role === "PRIMARY_FINDING")?.candidate_id ?? declared ?? assessment.candidate_assessments?.find((item) => item.state === "RESOLVED")?.candidate_id ?? "UNRESOLVED_MANAGEMENT_QUESTION";
}

function needForAction(assessment, rules) {
  const readiness = assessment.evidence_sufficiency?.purpose_states?.MANAGEMENT_OPTION_REVIEW;
  const ready = readiness === "SUFFICIENT_FOR_MANAGEMENT_OPTION_REVIEW";
  if (!ready) return {
    model: NEED_FOR_ACTION_MODEL_VERSION,
    state: "MORE_EVIDENCE_REQUIRED",
    management_review_ready: false,
    reason: "Step C has not declared sufficient evidence for Management Option Review.",
    supporting_evidence_refs: [],
    missing_evidence_refs: compact((assessment.evidence_sufficiency?.limiting_gaps ?? []).map((item) => item.gap_ref)),
    source_rule_id: "STEP_C_MANAGEMENT_READINESS_GATE/v1",
    source_refs: [assessment.assessment_id],
    limitations: ["Candidate presence or user request cannot open management review."],
    next_authority: "STEP_D_GUIDANCE_INTELLIGENCE",
  };
  const declared = rules.need_for_action;
  return {
    model: NEED_FOR_ACTION_MODEL_VERSION,
    state: declared?.state ?? "MANAGEMENT_REVIEW_JUSTIFIED",
    management_review_ready: true,
    reason: declared?.reason ?? "Step C explicitly declares sufficient evidence for bounded Management Option Review.",
    supporting_evidence_refs: declared?.supporting_evidence_refs ?? [assessment.assessment_id],
    missing_evidence_refs: declared?.missing_evidence_refs ?? [],
    source_rule_id: declared?.source_rule_id ?? "STEP_C_MANAGEMENT_READINESS_GATE/v1",
    source_refs: declared?.source_refs ?? [assessment.assessment_id],
    limitations: declared?.limitations ?? ["Management review readiness is not a treatment determination."],
    next_authority: declared?.state === "MORE_EVIDENCE_REQUIRED" ? "STEP_D_GUIDANCE_INTELLIGENCE" : "STEP_F1_MANAGEMENT_SUITABILITY",
  };
}

function relationByCanonicalClass(rules, optionClass) {
  const direct = rules.management_relationships.find((item) => item.option_class === optionClass);
  if (direct) return direct;
  if (optionClass === "CULTURAL_MANAGEMENT") return rules.management_relationships.find((item) => item.option_class === "WATER_MANAGEMENT") ?? null;
  return null;
}

function suitabilityEvaluation(optionClass, need, rules, gate) {
  const relationship = relationByCanonicalClass(rules, optionClass);
  const base = {
    option_class: optionClass,
    source_option_class: relationship?.source_option_class ?? optionClass,
    reason: relationship?.reason ?? null,
    supporting_evidence_refs: relationship?.supporting_evidence_refs ?? [],
    missing_evidence_refs: relationship?.missing_evidence_refs ?? [],
    contradicting_evidence_refs: relationship?.contradicting_evidence_refs ?? [],
    source_refs: relationship?.source_refs ?? [],
    limitations: relationship?.limitations ?? [],
    human_review_required: relationship?.human_review_required ?? false,
    source_rule_id: relationship?.rule_id ?? `F1-${optionClass}/v1`,
  };
  if (optionClass === "CONTINUE_MONITORING") {
    if (need.state === "CONTINUE_MONITORING") return { ...base, eligibility_state:"SUPPORTED_FOR_REVIEW", reason:need.reason, supporting_evidence_refs:need.supporting_evidence_refs, limitations:[...need.limitations, "No monitoring interval is inferred."] };
    if (need.state === "MORE_EVIDENCE_REQUIRED") return { ...base, eligibility_state:"MORE_EVIDENCE_REQUIRED", reason:"Step C and Step D still control the missing evidence path.", missing_evidence_refs:need.missing_evidence_refs, limitations:["No monitoring interval is inferred."] };
  }
  if (["CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "BIOLOGICAL_MANAGEMENT", "CONTINUE_MONITORING"].includes(optionClass)) {
    if (!relationship) return { ...base, eligibility_state:"NOT_SUPPORTED_BY_CURRENT_EVIDENCE", reason:"No governed Case-specific management relationship supports this option class.", limitations:["General model knowledge cannot create Case suitability."] };
    if (!relationship.case_relevant) return { ...base, eligibility_state:"MORE_EVIDENCE_REQUIRED", reason:relationship.reason, missing_evidence_refs:relationship.missing_evidence_refs.length ? relationship.missing_evidence_refs : ["MISSING_CASE_APPLICABILITY"] };
    if (need.state !== "MANAGEMENT_REVIEW_JUSTIFIED") return { ...base, eligibility_state:"NOT_SUPPORTED_BY_CURRENT_EVIDENCE", reason:"The Need-for-Action state does not currently open this management path." };
    return { ...base, eligibility_state:relationship.human_review_required ? "HUMAN_REVIEW_REQUIRED" : "SUPPORTED_FOR_REVIEW" };
  }
  if (optionClass === "CHEMICAL_REVIEW") {
    if (need.state !== "MANAGEMENT_REVIEW_JUSTIFIED") return { ...base, eligibility_state:"NOT_SUPPORTED_BY_CURRENT_EVIDENCE", reason:"Regulatory review cannot open because Need-for-Action Key A did not pass.", authority_state:"KEY_A_NOT_SATISFIED", regulatory_gate_state:"NOT_APPLICABLE", human_review_required:false, limitations:["Chemical Review is not an application decision."] };
    if (!gate.satisfied) return { ...base, eligibility_state:"BLOCKED_BY_AUTHORITY", reason:"Need-for-Action passed, but the current exact Thai Crop x Target x Use x Registration authority chain is incomplete or unresolved.", authority_state:gate.state, regulatory_gate_state:"BLOCKED_BY_AUTHORITY", missing_evidence_refs:gate.knowledge_gaps, human_review_required:true, limitations:[gate.limitation, "Human Review cannot waive missing regulatory authority."] };
    return { ...base, eligibility_state:"SUPPORTED_FOR_REVIEW", reason:"Both the Need-for-Action gate and the current exact Thai regulatory authority gate pass for review.", authority_state:"CURRENT_AUTHORITY_CONFIRMED", regulatory_gate_state:"ELIGIBLE_FOR_DECISION_REVIEW", human_review_required:true, limitations:["This only opens the next governed review layer."] };
  }
  if (optionClass === "EXPERT_REVIEW") {
    const failed = Boolean(rules.failed_control_context), required = need.state === "HUMAN_REVIEW_REQUIRED" || failed || gate.state === "CONFLICTING_AUTHORITY";
    if (relationship?.case_relevant) return { ...base, eligibility_state:relationship.human_review_required ? "HUMAN_REVIEW_REQUIRED" : "SUPPORTED_FOR_REVIEW" };
    if (required) return { ...base, eligibility_state:"HUMAN_REVIEW_REQUIRED", reason:failed ? "Reported failed-control context requires governed specialist review without a resistance inference." : "Material uncertainty or conflicting authority requires qualified review.", supporting_evidence_refs:rules.failed_control_context?.evidence_refs ?? need.supporting_evidence_refs, human_review_required:true, limitations:[...(rules.failed_control_context?.limitations ?? []), "Expert Review cannot waive missing authority."] };
    return { ...base, eligibility_state:"NOT_APPLICABLE", reason:"No current governed expert-review trigger is recorded." };
  }
  if (optionClass === "NO_ACTION_CURRENTLY_JUSTIFIED") {
    if (need.state === "NO_ACTION_DETERMINATION_SUPPORTED") return { ...base, eligibility_state:"SUPPORTED_FOR_REVIEW", reason:need.reason, supporting_evidence_refs:need.supporting_evidence_refs, limitations:["This is a current evidence state, not Case resolution or a permanent finding."] };
    return { ...base, eligibility_state:need.state === "MORE_EVIDENCE_REQUIRED" ? "MORE_EVIDENCE_REQUIRED" : "NOT_APPLICABLE", reason:need.state === "MORE_EVIDENCE_REQUIRED" ? "More evidence is needed before a no-action determination is supported." : "The current Need-for-Action state does not support this class." };
  }
  fail("unsupported management option class");
}

export class ManagementOptionEngine {
  constructor({ ruleProvider = new ManagementRuleProvider(), clock = () => new Date() } = {}) { this.ruleProvider=ruleProvider; this.clock=clock; }
  evaluate(bundle, assessment) {
    object(bundle, "Investigation Bundle"); object(assessment, "Step C assessment");
    if (bundle.authority !== "SERVER" || assessment.authority !== "SERVER_DERIVED_INVESTIGATION_ASSESSMENT") fail("F1 accepts authoritative server state only");
    const rules=this.ruleProvider.getRules(bundle,assessment),manifest=this.ruleProvider.getManifest(); validateCaseEvidenceRefs(rules,bundle);
    const finding=reviewedFinding(assessment),need=needForAction(assessment,rules),gate=regulatoryGate(rules.regulatory_authority),targetRef=targetProblem(assessment,finding,rules);
    const suitability=MANAGEMENT_OPTION_ENUMS.optionClasses.map((optionClass)=>suitabilityEvaluation(optionClass,need,rules,gate));
    const contextProjection={user_id:bundle.user_id,field_id:bundle.field_id,crop_season_id:bundle.season_id,case_id:assessment.scope.case_id,stage_assessment_id:bundle.stage_assessment?.stage_assessment_id??null,stage_updated_at:bundle.stage_assessment?.updated_at??null,assessment_id:assessment.assessment_id,assessment_revision:assessment.assessment_revision,assessment_source_bundle_hash:assessment.source_bundle_hash,assessment_rule_version:assessment.rule_version,assessment_rule_hash:assessment.rule_hash,review_history:assessment.review_history??[],management_event_refs:(bundle.management_events??[]).map((item)=>[item.management_event_id,item.updated_at]),outcome_refs:(bundle.outcomes??[]).map((item)=>[item.outcome_id,item.updated_at]),management_rule_manifest:manifest};
    const contextHash=hash(contextProjection),generatedAt=this.clock().toISOString(),scientificRefs=compact([...need.source_refs,...suitability.flatMap((item)=>item.source_refs)]),regulatoryRefs=gate.authority_refs;
    return {
      authority:"SERVER_GOVERNED_MANAGEMENT_REVIEW",
      model:MANAGEMENT_REVIEW_MODEL_VERSION,
      engine_version:MANAGEMENT_OPTION_ENGINE_VERSION,
      scope:{user_id:bundle.user_id,field_id:bundle.field_id,crop_season_id:bundle.season_id,case_id:assessment.scope.case_id},
      assessment_reference:{assessment_id:assessment.assessment_id,assessment_revision:assessment.assessment_revision,source_bundle_hash:assessment.source_bundle_hash,rule_version:assessment.rule_version,rule_hash:assessment.rule_hash},
      finding_review_reference:finding,
      target_problem_ref:targetRef,
      need_for_action:need,
      management_suitability:{model:MANAGEMENT_SUITABILITY_MODEL_VERSION,evaluations:suitability,ordering_semantics:"DETERMINISTIC_PRESENTATION_ONLY_NOT_RANKING"},
      regulatory_gate:gate,
      failed_control_context:rules.failed_control_context ? {present:true,evidence_refs:rules.failed_control_context.evidence_refs,limitations:rules.failed_control_context.limitations,resistance_inferred:false,repeat_action_created:false} : {present:false,evidence_refs:[],limitations:[],resistance_inferred:false,repeat_action_created:false},
      context_hash:contextHash,
      source_rule_version:manifest.provider_version,
      source_rule_hash:manifest.content_hash,
      source_provenance:{scientific:{source_refs:scientificRefs,authority:manifest.authority,review_state:manifest.review_state},regulatory:{authority_refs:regulatoryRefs,authority_class:gate.authority_class,jurisdiction:gate.jurisdiction,current_authority_confirmed:gate.current_authority_confirmed}},
      generated_at:generatedAt,
      boundaries:{candidate_is_diagnosis:false,management_option_is_recommendation:false,eligibility_is_selection:false,regulatory_eligibility_is_case_suitability:false,human_review_waives_authority:false,moa_creates_eligibility:false,failed_control_is_resistance:false,field_action_created:false,automatic_learning:false},
    };
  }
}

export function initializeManagementOptionSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS governed_management_reviews (
      management_review_id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      field_id TEXT NOT NULL,
      season_id TEXT NOT NULL,
      case_id TEXT NOT NULL,
      assessment_id TEXT NOT NULL,
      assessment_revision INTEGER NOT NULL,
      context_hash TEXT NOT NULL,
      rule_version TEXT NOT NULL,
      rule_hash TEXT NOT NULL,
      engine_version TEXT NOT NULL,
      review_json TEXT NOT NULL,
      status TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      superseded_at TEXT,
      FOREIGN KEY(assessment_id) REFERENCES investigation_assessments(assessment_id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS governed_management_review_current ON governed_management_reviews(owner_user_id,field_id,season_id,case_id) WHERE status='CURRENT';
    CREATE INDEX IF NOT EXISTS governed_management_review_history ON governed_management_reviews(owner_user_id,field_id,season_id,case_id,generated_at);
    CREATE TABLE IF NOT EXISTS governed_management_options (
      management_option_id TEXT PRIMARY KEY,
      management_review_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      field_id TEXT NOT NULL,
      season_id TEXT NOT NULL,
      case_id TEXT NOT NULL,
      option_class TEXT NOT NULL,
      eligibility_state TEXT NOT NULL,
      context_hash TEXT NOT NULL,
      option_json TEXT NOT NULL,
      status TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      superseded_at TEXT,
      FOREIGN KEY(management_review_id) REFERENCES governed_management_reviews(management_review_id)
    );
    CREATE INDEX IF NOT EXISTS governed_management_option_history ON governed_management_options(owner_user_id,field_id,season_id,case_id,generated_at);
  `);
  db.prepare("INSERT OR IGNORE INTO investigation_schema_migrations(version,applied_at) VALUES(9,?)").run(new Date().toISOString());
}

export class ManagementOptionService {
  constructor(db, bundleProvider, assessmentProvider, { ruleProvider = new ManagementRuleProvider(), clock = () => new Date(), idProvider = () => randomUUID() } = {}) {
    this.db=db; this.bundleProvider=bundleProvider; this.assessmentProvider=assessmentProvider; this.clock=clock; this.idProvider=idProvider; this.engine=new ManagementOptionEngine({ruleProvider,clock});
  }
  scope(userId, raw) {
    identifier(userId,"user_id"); object(raw,"management scope");
    return {field_id:identifier(raw.field_id,"field_id"),season_id:identifier(raw.season_id??raw.crop_season_id,"season_id"),case_id:identifier(raw.case_id,"case_id")};
  }
  rowReview(row) {
    const review=JSON.parse(row.review_json),options=this.db.prepare("SELECT * FROM governed_management_options WHERE management_review_id=? ORDER BY CASE option_class WHEN 'CONTINUE_MONITORING' THEN 1 WHEN 'CULTURAL_MANAGEMENT' THEN 2 WHEN 'MECHANICAL_MANAGEMENT' THEN 3 WHEN 'BIOLOGICAL_MANAGEMENT' THEN 4 WHEN 'CHEMICAL_REVIEW' THEN 5 WHEN 'EXPERT_REVIEW' THEN 6 ELSE 7 END").all(row.management_review_id).map((optionRow)=>({...JSON.parse(optionRow.option_json),status:optionRow.status,superseded_at:optionRow.superseded_at}));
    return {...review,status:row.status,superseded_at:row.superseded_at,all_option_evaluations:options,user_facing_review_options:options.filter((item)=>["SUPPORTED_FOR_REVIEW","HUMAN_REVIEW_REQUIRED"].includes(item.eligibility_state)).slice(0,3)};
  }
  buildOptions(proposal, reviewId) {
    return proposal.management_suitability.evaluations.map((evaluation)=>({
      management_option_id:`management-option-${this.idProvider()}`,
      management_review_id:reviewId,
      user_id:proposal.scope.user_id,
      field_id:proposal.scope.field_id,
      crop_season_id:proposal.scope.crop_season_id,
      case_id:proposal.scope.case_id,
      assessment_id:proposal.assessment_reference.assessment_id,
      assessment_revision:proposal.assessment_reference.assessment_revision,
      finding_review_reference:proposal.finding_review_reference,
      option_class:evaluation.option_class,
      source_option_class:evaluation.source_option_class,
      eligibility_state:evaluation.eligibility_state,
      need_for_action_state:proposal.need_for_action.state,
      target_problem_ref:proposal.target_problem_ref,
      supporting_evidence_refs:evaluation.supporting_evidence_refs,
      missing_evidence_refs:evaluation.missing_evidence_refs,
      contradicting_evidence_refs:evaluation.contradicting_evidence_refs,
      authority_refs:evaluation.option_class==="CHEMICAL_REVIEW"?proposal.regulatory_gate.authority_refs:[],
      authority_state:evaluation.authority_state??"NOT_APPLICABLE",
      regulatory_gate_state:evaluation.regulatory_gate_state??"NOT_APPLICABLE",
      human_review_required:evaluation.human_review_required,
      human_review_reason:evaluation.human_review_required?evaluation.reason:null,
      reason:evaluation.reason,
      limitations:evaluation.limitations,
      knowledge_gaps:compact([...(evaluation.missing_evidence_refs??[]).filter((item)=>sets.knowledgeGaps.has(item)),evaluation.eligibility_state==="NOT_SUPPORTED_BY_CURRENT_EVIDENCE"&&["CULTURAL_MANAGEMENT","MECHANICAL_MANAGEMENT","BIOLOGICAL_MANAGEMENT"].includes(evaluation.option_class)?"MISSING_MANAGEMENT_RELATIONSHIP":null,proposal.failed_control_context.present&&evaluation.option_class==="EXPERT_REVIEW"?"FAILED_CONTROL_REVIEW_REQUIRED":null]),
      source_rule_id:evaluation.source_rule_id,
      source_rule_version:proposal.source_rule_version,
      source_refs:evaluation.source_refs,
      provenance:{scientific:{assessment:proposal.assessment_reference,source_refs:evaluation.source_refs,evidence_refs:evaluation.supporting_evidence_refs},regulatory:evaluation.option_class==="CHEMICAL_REVIEW"?proposal.source_provenance.regulatory:null},
      context_hash:proposal.context_hash,
      engine_version:proposal.engine_version,
      generated_at:proposal.generated_at,
      valid_from:proposal.generated_at,
      superseded_at:null,
      status:"CURRENT",
      presentation_order:MANAGEMENT_OPTION_ENUMS.optionClasses.indexOf(evaluation.option_class)+1,
      presentation_is_ranking:false,
      next_governed_step:evaluation.eligibility_state==="MORE_EVIDENCE_REQUIRED"?"STEP_D_GUIDANCE_OR_FIELD_ACTION_EVIDENCE":evaluation.option_class==="CHEMICAL_REVIEW"&&evaluation.eligibility_state==="SUPPORTED_FOR_REVIEW"?"FUTURE_GOVERNED_CHEMICAL_REVIEW_LAYER":evaluation.eligibility_state==="BLOCKED_BY_AUTHORITY"?"RESOLVE_CURRENT_REGULATORY_AUTHORITY":evaluation.human_review_required?"HUMAN_DECISION_REVIEW":"HUMAN_DECISION_REVIEW",
      action_boundary:"OPTION_READY_FOR_HUMAN_DECISION_REVIEW_ONLY",
    }));
  }
  assess(userId, rawScope) {
    const scope=this.scope(userId,rawScope),bundle=this.bundleProvider.getBundle(userId,scope),assessment=this.assessmentProvider.assess(userId,scope),proposal=this.engine.evaluate(bundle,assessment),current=this.db.prepare("SELECT * FROM governed_management_reviews WHERE owner_user_id=? AND field_id=? AND season_id=? AND case_id=? AND status='CURRENT'").get(userId,scope.field_id,scope.season_id,scope.case_id);
    if (current && current.context_hash===proposal.context_hash && current.rule_version===proposal.source_rule_version && current.rule_hash===proposal.source_rule_hash && current.engine_version===proposal.engine_version) return this.rowReview(current);
    const reviewId=`management-review-${this.idProvider()}`,options=this.buildOptions(proposal,reviewId),review={...proposal,management_review_id:reviewId,status:"CURRENT",superseded_at:null,presentation_order:MANAGEMENT_OPTION_ENUMS.optionClasses,presentation_is_ranking:false,all_option_evaluations:options,user_facing_review_options:options.filter((item)=>["SUPPORTED_FOR_REVIEW","HUMAN_REVIEW_REQUIRED"].includes(item.eligibility_state)).slice(0,3)};
    this.db.exec("BEGIN IMMEDIATE");
    try {
      if(current){this.db.prepare("UPDATE governed_management_reviews SET status='SUPERSEDED',superseded_at=? WHERE management_review_id=? AND owner_user_id=?").run(proposal.generated_at,current.management_review_id,userId);this.db.prepare("UPDATE governed_management_options SET status='SUPERSEDED',superseded_at=? WHERE management_review_id=? AND owner_user_id=?").run(proposal.generated_at,current.management_review_id,userId);}
      this.db.prepare("INSERT INTO governed_management_reviews VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(reviewId,userId,scope.field_id,scope.season_id,scope.case_id,proposal.assessment_reference.assessment_id,proposal.assessment_reference.assessment_revision,proposal.context_hash,proposal.source_rule_version,proposal.source_rule_hash,proposal.engine_version,JSON.stringify({...review,all_option_evaluations:undefined,user_facing_review_options:undefined}),"CURRENT",proposal.generated_at,null);
      const insert=this.db.prepare("INSERT INTO governed_management_options VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
      for(const option of options)insert.run(option.management_option_id,reviewId,userId,scope.field_id,scope.season_id,scope.case_id,option.option_class,option.eligibility_state,option.context_hash,JSON.stringify(option),"CURRENT",option.generated_at,null);
      this.db.exec("COMMIT");
    } catch(error) { this.db.exec("ROLLBACK"); throw error; }
    return review;
  }
  current(userId, scope) { return this.assess(userId,scope); }
  history(userId, rawScope) { const scope=this.scope(userId,rawScope);this.bundleProvider.getBundle(userId,scope);return this.db.prepare("SELECT * FROM governed_management_reviews WHERE owner_user_id=? AND field_id=? AND season_id=? AND case_id=? ORDER BY generated_at,management_review_id").all(userId,scope.field_id,scope.season_id,scope.case_id).map((row)=>this.rowReview(row)); }
  context(userId, scope) { const review=this.current(userId,scope);return {authority:"SERVER_GOVERNED_MANAGEMENT_REVIEW",scope:review.scope,management_review_id:review.management_review_id,context_hash:review.context_hash,need_for_action:review.need_for_action,management_suitability:review.management_suitability,regulatory_gate:review.regulatory_gate,failed_control_context:review.failed_control_context,source_provenance:review.source_provenance,all_option_evaluations:review.all_option_evaluations,user_facing_review_options:review.user_facing_review_options,boundaries:review.boundaries}; }
}
