import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createEmptyCandidateProvider } from "../candidate-provider.mjs";
import { PilotStore } from "../pilot-store.mjs";
import { startServer } from "../server.mjs";
import {
  ManualStructuredVisualPerceptionProvider,
  OpenAIVisualPerceptionProvider,
  VISUAL_PERCEPTION_ENUMS,
  VisualPerceptionProvider,
  createConfiguredVisualPerceptionProvider,
  createTestOnlyVisualPerceptionAdapter,
} from "../visual-perception.mjs";

const scope = { field_id:"field-b2", crop_season_id:"season-b2", case_id:"case-b2" };
const now = "2026-08-27T08:00:00.000Z";
function ids() { let value = 0; return () => `00000000-0000-4000-8000-${String(++value).padStart(12, "0")}`; }
function lifecycle(userId = "user-a") {
  return { schema_version:2, users:[{ user_id:userId, display_name:"Do not send" }], fields:[{ field_id:scope.field_id, owner_user_id:userId, name:"B2 field", crop:"rice", planting_date:"2026-07-01", current_crop_stage:{ code:"TILLERING", label:"Tillering", model_version:"field-stage-model/v1" }, current_cmp_stage:{ stage_id:"CMP-03", label:"Tillering", model_version:"field-stage-model/v1" }, season_id:scope.crop_season_id, stage_provenance:"USER_CONFIRMED", created_at:now, updated_at:now }], seasons:[{ season_id:scope.crop_season_id, field_id:scope.field_id, crop:"rice", status:"ACTIVE" }], guidance:[], activities:[], cases:[], observations:[], evidence:[], conversations:[], messages:[], decision_logs:[], case_summaries:[], weather_snapshots:[] };
}
async function setup({ provider = new VisualPerceptionProvider(), imageLoader = null, contextResolver = null } = {}) {
  const root = await mkdtemp(join(tmpdir(), "cpmoakb-perception-"));
  const store = await new PilotStore({ dbPath:join(root, "pilot.sqlite"), exportDir:join(root, "exports"), investigationCandidateProvider:createEmptyCandidateProvider(), intelligenceClock:() => new Date(now), intelligenceIdProvider:ids(), guidanceClock:() => new Date(now), guidanceIdProvider:ids(), visualClock:() => new Date(now), visualIdProvider:ids(), visualPerceptionAdapter:provider, visualPerceptionClock:() => new Date(now), visualPerceptionIdProvider:ids(), visualPerceptionImageLoader:imageLoader, visualPerceptionContextResolver:contextResolver }).open();
  store.putWorkspace("user-a", lifecycle());
  store.createInvestigationRecord("user-a", "CASE", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id, purpose:"B2 visual perception" });
  store.createInvestigationRecord("user-a", "OBSERVATION", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id, observation_id:"obs-b2", source:"FIELD_OBSERVED", observed_at:now, note:"yellowing patch in a low spot" });
  return { root, store, close:async () => { store.close(); await rm(root, { recursive:true, force:true }); } };
}
let imageNumber = 0;
function imageInput(overrides = {}) {
  const sequence = ++imageNumber, bytes = Buffer.from(`b2-image-${sequence}`);
  return { field_id:scope.field_id, crop_season_id:scope.crop_season_id, case_id:scope.case_id, observation_id:"obs-b2", captured_at:now, source:"UPLOAD", capture_intent:"ROOT", plant_part_scope:"ROOT_SYSTEM", spatial_scope:"SAMPLED_OBJECT", view_type:"AFFECTED_SAMPLE", media_type:"image/png", original_filename:`root-${sequence}.png`, size_bytes:bytes.length, content_hash:createHash("sha256").update(bytes).digest("hex"), storage_key:`root-${sequence}.png`, comparison_pair_id:"pair-b2", comparison_role:"AFFECTED", comparison_role_source:"USER_PROVIDED", ...overrides };
}
function proposal(overrides = {}) {
  return { quality:[{ dimension:"FOCUS", categorical_state:"GOOD", reason:"The sampled roots are in focus." }, { dimension:"OCCLUSION", categorical_state:"ACCEPTABLE", reason:null }], observability:[{ concept:"ROOT_COMPARISON", state:"ASSESSABLE", reason:"The requested root sample is visible." }, { concept:"ROOT_CONDITION", state:"ASSESSABLE", reason:"Root surfaces can be inspected." }], visible_features:[{ concept_id:"BROWNING", state:"OBSERVED", plant_part_scope:"ROOT_SYSTEM", spatial_scope:"SAMPLED_OBJECT", object_scope:"SAMPLED_PLANT_PART", observability_target:"ROOT_CONDITION", comparison_role:"AFFECTED", visible_count:null, reason:"Brown coloration is directly visible on the sampled roots." }], limitations:["The image represents only the sampled root object."], provider_generated_at:now, ...overrides };
}
const rootGuidance = () => ({ guidance_id:"guidance-root", guidance_type:"EVIDENCE_COMPLETION", inspection_domain:"ROOT_INSPECTION", evidence_concept:"ROOT_COMPARISON", why_now:"A root comparison addresses the remaining evidence gap.", where_to_inspect:"affected patch and nearby comparison area", how_to_inspect:"compare sampled roots", assessment_id:"assessment-root", related_evidence_gap_refs:["gap-root"], stage_assessment_id:"stage-b2" });
async function requestWith(h, input = {}) {
  const image = h.store.createImageEvidence("user-a", imageInput(input.image ?? {}));
  const result = await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON", ...(input.request ?? {}) });
  return { image, result };
}
async function rejectedWith(output) {
  const h = await setup({ provider:createTestOnlyVisualPerceptionAdapter(output) });
  try { return (await requestWith(h)).result; } finally { await h.close(); }
}

test("VisualPerceptionProvider exposes a server-side provider interface", () => {
  const manifest = new VisualPerceptionProvider().getManifest();
  assert.equal(typeof VisualPerceptionProvider.prototype.analyzeImage, "function");
  assert.equal(manifest.server_side_only, true);
  assert.equal(manifest.authoritative_state_owner, false);
});
test("provider identity classes are explicit", () => assert.ok(["TEST_ONLY_VISUAL_PERCEPTION_PROVIDER", "MANUAL_STRUCTURED_PROVIDER", "NETWORK_MULTIMODAL_PROVIDER"].every((value) => VISUAL_PERCEPTION_ENUMS.providerTypes.includes(value))));
test("TEST_ONLY provider cannot load through the normal constructor", () => assert.throws(() => new VisualPerceptionProvider({ providerType:"TEST_ONLY_VISUAL_PERCEPTION_PROVIDER" }), /cannot load in normal runtime/));
test("deterministic test provider is available only through its explicit factory", () => assert.equal(createTestOnlyVisualPerceptionAdapter(proposal()).getManifest().provider_type, "TEST_ONLY_VISUAL_PERCEPTION_PROVIDER"));
test("default configuration never selects a network provider", () => assert.equal(createConfiguredVisualPerceptionProvider({ env:{} }).getManifest().provider_type, "NO_PROVIDER"));
test("manual structured provider has no network capability", () => assert.equal(new ManualStructuredVisualPerceptionProvider().getManifest().network_calls, false));
test("manual structured provider accepts only an explicit governed proposal", async () => {
  const h=await setup({ provider:new ManualStructuredVisualPerceptionProvider() });
  try { const image=h.store.createImageEvidence("user-a", imageInput()), result=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON", manual_proposal:proposal() }); assert.equal(result.status, "COMPLETED"); assert.equal(h.store.getImageEvidence("user-a", image.image_evidence_id).ve_level, "VE2_VISIBLE_FEATURE_PROPOSED"); } finally { await h.close(); }
});
test("clients cannot spoof a network provider through the B1 assessment API", async () => {
  const h=await setup();
  try { const image=h.store.createImageEvidence("user-a", imageInput()); assert.throws(() => h.store.addVisualAssessment("user-a", image.image_evidence_id, { quality:{ FOCUS:"GOOD" }, observability:[{ target:"ROOT_COMPARISON", state:"ASSESSABLE", appropriate_view:true }], features:[{ feature_code:"BROWNING", state:"OBSERVED", assessability_target:"ROOT_COMPARISON" }], assessment_method:"NETWORK_MULTIMODAL_PROVIDER", assessment_version:"spoof/v1" }), /authenticated server invocation/); } finally { await h.close(); }
});
test("network provider manifest is server-side and contains no API key", () => {
  const provider = new OpenAIVisualPerceptionProvider({ apiKey:"secret-value", fetcher:async () => null }), manifest = provider.getManifest();
  assert.equal(manifest.server_side_only, true); assert.equal(manifest.network_calls, true); assert.doesNotMatch(JSON.stringify(manifest), /secret-value/);
});
test("network provider rejects unsupported media before any request", async () => {
  let called=false; const provider=new OpenAIVisualPerceptionProvider({ apiKey:"server-secret", fetcher:async () => { called=true; } });
  await assert.rejects(() => provider.analyzeImage({ imagePayload:{ bytes:Buffer.from("x"), media_type:"image/gif" } }), (error) => error.category==="UNSUPPORTED_MEDIA"); assert.equal(called, false);
});
test("network provider enforces its maximum image size before any request", async () => {
  let called=false; const provider=new OpenAIVisualPerceptionProvider({ apiKey:"server-secret", maxImageBytes:2, fetcher:async () => { called=true; } });
  await assert.rejects(() => provider.analyzeImage({ imagePayload:{ bytes:Buffer.from("large"), media_type:"image/png" } }), (error) => error.category==="IMAGE_TOO_LARGE"); assert.equal(called, false);
});

test("explicit request creates an auditable immutable structured result", async () => {
  const h = await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { result } = await requestWith(h); assert.equal(result.status, "COMPLETED"); assert.match(result.request.context_hash, /^[a-f0-9]{64}$/); assert.match(result.result.result_hash, /^[a-f0-9]{64}$/); assert.equal(result.request.requested_target, "ROOT_COMPARISON"); } finally { await h.close(); }
});
test("provider proposal remains VE2 and not human reviewed", async () => {
  const h = await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { image } = await requestWith(h), updated = h.store.getImageEvidence("user-a", image.image_evidence_id); assert.equal(updated.ve_level, "VE2_VISIBLE_FEATURE_PROPOSED"); assert.equal(updated.visible_features[0].review_status, "PROPOSED"); } finally { await h.close(); }
});
test("raw provider proposal creates no Step C evidence", async () => {
  const h = await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { await requestWith(h); assert.equal(h.store.getInvestigationBundle("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }).evidence.length, 0); } finally { await h.close(); }
});
test("raw provider proposal changes no Candidate state", async () => {
  const h = await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const before=h.store.assessInvestigation("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }); await requestWith(h); const after=h.store.assessInvestigation("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }); assert.equal(after.assessment_id, before.assessment_id); assert.deepEqual(after.candidate_assessments, before.candidate_assessments); } finally { await h.close(); }
});
test("provider identity and version are retained on the B1 feature proposal", async () => {
  const h = await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal(), { providerVersion:"fixture/v7" }) });
  try { const { image }=await requestWith(h), feature=h.store.getImageEvidence("user-a", image.image_evidence_id).visible_features[0]; assert.equal(feature.provider_provenance.provider_version, "fixture/v7"); } finally { await h.close(); }
});

test("diagnosis fields are rejected", async () => assert.equal((await rejectedWith({ ...proposal(), diagnosis:"rice blast" })).error_category, "PROVIDER_POLICY_REJECTION"));
test("disease probability fields are rejected", async () => assert.equal((await rejectedWith({ ...proposal(), probability:0.87 })).error_category, "PROVIDER_POLICY_REJECTION"));
test("treatment fields are rejected", async () => assert.equal((await rejectedWith({ ...proposal(), treatment:"spray" })).error_category, "PROVIDER_POLICY_REJECTION"));
test("commercial product fields are rejected", async () => assert.equal((await rejectedWith({ ...proposal(), product:"Example product" })).error_category, "PROVIDER_POLICY_REJECTION"));
test("Candidate state fields are rejected", async () => assert.equal((await rejectedWith({ ...proposal(), candidate_state:"SUPPORTED" })).error_category, "PROVIDER_POLICY_REJECTION"));
test("prohibited authority embedded in provider prose is rejected", async () => {
  const value=proposal(); value.visible_features[0].reason="เป็นโรคไหม้ 87%"; assert.equal((await rejectedWith(value)).error_category, "PROVIDER_POLICY_REJECTION");
});
test("unsupported visual vocabulary is rejected without silent expansion", async () => {
  const value=proposal(); value.visible_features[0].concept_id="ROOT_BROWNING"; assert.equal((await rejectedWith(value)).error_category, "VOCABULARY_VALIDATION_FAILED");
});
test("numeric quality is rejected", async () => {
  const value=proposal(); value.quality[0].categorical_state=0.9; assert.equal((await rejectedWith(value)).error_category, "SCHEMA_VALIDATION_FAILED");
});
test("non-categorical observability is rejected", async () => {
  const value=proposal(); value.observability[0].state="0.9"; assert.equal((await rejectedWith(value)).error_category, "SCHEMA_VALIDATION_FAILED");
});
test("provider cannot emit SEARCHED_NOT_FOUND", async () => {
  const value=proposal(); value.visible_features[0].state="SEARCHED_NOT_FOUND"; assert.equal((await rejectedWith(value)).error_category, "SCHEMA_VALIDATION_FAILED");
});

test("good canopy image may leave requested roots NOT_IN_VIEW", async () => {
  const value=proposal({ observability:[{ concept:"ROOT_COMPARISON", state:"NOT_IN_VIEW", reason:"Only canopy is visible." }, { concept:"ROOT_CONDITION", state:"NOT_IN_VIEW", reason:"Roots are outside the frame." }], visible_features:[] });
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(value) });
  try { const { result }=await requestWith(h, { image:{ capture_intent:"PLANT_CONTEXT", plant_part_scope:"WHOLE_PLANT", view_type:"FIELD_CONTEXT", comparison_pair_id:null, comparison_role:"UNKNOWN_ROLE", comparison_role_source:"UNKNOWN" } }); assert.equal(result.result.quality[0].categorical_state, "GOOD"); assert.equal(result.result.observability[0].state, "NOT_IN_VIEW"); assert.equal(result.result.perception_outcome, "BETTER_VIEW_REQUIRED"); } finally { await h.close(); }
});
test("blurry image makes the relevant target not assessable without absence", async () => {
  const value=proposal({ quality:[{ dimension:"FOCUS", categorical_state:"UNUSABLE", reason:"Motion blur obscures the subject." }], observability:[{ concept:"ROOT_COMPARISON", state:"INSUFFICIENT_SCALE", reason:"The subject is too small." }, { concept:"ROOT_CONDITION", state:"NOT_ASSESSABLE", reason:"Root detail cannot be inspected." }], visible_features:[{ concept_id:"BROWNING", state:"NOT_ASSESSABLE", plant_part_scope:"ROOT_SYSTEM", spatial_scope:"SAMPLED_OBJECT", object_scope:"SAMPLED_PLANT_PART", observability_target:"ROOT_CONDITION", comparison_role:"AFFECTED", visible_count:null, reason:"The feature cannot be assessed." }] });
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(value) });
  try { const { result }=await requestWith(h); assert.equal(result.result.perception_outcome, "BETTER_VIEW_REQUIRED"); assert.equal(result.result.visible_features[0].state, "NOT_ASSESSABLE"); assert.equal(result.result.boundaries.not_observed_is_absence, false); } finally { await h.close(); }
});
test("NOT_OBSERVED remains a proposal and never becomes absence", async () => {
  const value=proposal(); value.visible_features[0].state="NOT_OBSERVED";
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(value) });
  try { const { image }=await requestWith(h), feature=h.store.getImageEvidence("user-a", image.image_evidence_id).visible_features[0]; assert.equal(feature.state, "NOT_OBSERVED"); assert.equal(feature.original_proposal.state, "NOT_OBSERVED"); } finally { await h.close(); }
});
test("provider cannot propose a feature for a target that is not assessable", async () => {
  const value=proposal({ observability:[{ concept:"ROOT_COMPARISON", state:"NOT_IN_VIEW", reason:null }, { concept:"ROOT_CONDITION", state:"NOT_IN_VIEW", reason:null }] });
  assert.equal((await rejectedWith(value)).error_category, "SCHEMA_VALIDATION_FAILED");
});

test("requested target is sent to the provider", async () => {
  let captured; const provider=createTestOnlyVisualPerceptionAdapter((input) => { captured=input; return proposal(); }), h=await setup({ provider });
  try { await requestWith(h); assert.equal(captured.requestedVisualTarget, "ROOT_COMPARISON"); } finally { await h.close(); }
});
test("provider context is candidate-blind and minimum necessary", async () => {
  let captured; const provider=createTestOnlyVisualPerceptionAdapter((input) => { captured=input; return proposal(); }), h=await setup({ provider });
  try { await requestWith(h); const context=JSON.stringify(captured.authoritativeContext); assert.equal(captured.authoritativeContext.crop, "rice"); assert.doesNotMatch(context, /candidate|display_name|phone|history/i); } finally { await h.close(); }
});
test("prohibited Candidate context from a resolver is blocked before invocation", async () => {
  let invoked=false; const provider=createTestOnlyVisualPerceptionAdapter(() => { invoked=true; return proposal(); }), h=await setup({ provider, contextResolver:() => ({ crop:"rice", candidate_names:["X"] }) });
  try { const image=h.store.createImageEvidence("user-a", imageInput()); await assert.rejects(() => h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }), /minimum context contains prohibited/); assert.equal(invoked, false); } finally { await h.close(); }
});
test("affected role is preserved from B1 metadata", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { result }=await requestWith(h); assert.equal(result.result.visible_features[0].comparison_role, "AFFECTED"); } finally { await h.close(); }
});
test("Golden root pair preserves affected and user-confirmed normal roles without Candidate output", async () => {
  const provider=createTestOnlyVisualPerceptionAdapter((input) => { const value=proposal(); value.visible_features[0].comparison_role=input.authoritativeContext.comparison_role; value.visible_features[0].state=input.authoritativeContext.comparison_role==="NORMAL_COMPARISON"?"NOT_OBSERVED":"OBSERVED"; return value; }), h=await setup({ provider });
  try { const affected=h.store.createImageEvidence("user-a", imageInput()), normal=h.store.createImageEvidence("user-a", imageInput({ view_type:"NORMAL_COMPARISON", comparison_role:"NORMAL_COMPARISON" })), a=await h.store.requestVisualPerception("user-a", { image_evidence_id:affected.image_evidence_id, requested_target:"ROOT_COMPARISON" }), n=await h.store.requestVisualPerception("user-a", { image_evidence_id:normal.image_evidence_id, requested_target:"ROOT_COMPARISON" }); assert.equal(a.result.visible_features[0].comparison_role, "AFFECTED"); assert.equal(n.result.visible_features[0].comparison_role, "NORMAL_COMPARISON"); assert.equal(n.result.visible_features[0].state, "NOT_OBSERVED"); assert.equal("candidate_state" in a.result, false); } finally { await h.close(); }
});
test("model cannot assign NORMAL_COMPARISON role", async () => {
  const value=proposal(); value.visible_features[0].comparison_role="NORMAL_COMPARISON"; assert.equal((await rejectedWith(value)).error_category, "PROVIDER_POLICY_REJECTION");
});
test("one-leaf proposal cannot expand to field scope", async () => {
  const value=proposal({ observability:[{ concept:"LEAF_DETAIL", state:"ASSESSABLE", reason:null }], visible_features:[{ concept_id:"YELLOWING", state:"OBSERVED", plant_part_scope:"LEAF_BLADE", spatial_scope:"FIELD_CONTEXT", object_scope:"SAMPLED_PLANT_PART", observability_target:"LEAF_DETAIL", comparison_role:"UNKNOWN_ROLE", visible_count:null, reason:"One leaf is visible." }] });
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(value) });
  try { const { result }=await requestWith(h, { image:{ capture_intent:"LEAF", plant_part_scope:"LEAF_BLADE", comparison_pair_id:null, comparison_role:"UNKNOWN_ROLE", comparison_role_source:"UNKNOWN" }, request:{ requested_target:"LEAF_DETAIL" } }); assert.equal(result.error_category, "PROVIDER_POLICY_REJECTION"); } finally { await h.close(); }
});
test("visible counts stay IMAGE_FRAME_ONLY", async () => {
  const value=proposal(); value.visible_features[0].visible_count=3;
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(value) });
  try { const { result }=await requestWith(h); assert.equal(result.result.visible_features[0].count_basis, "IMAGE_FRAME_ONLY"); assert.equal("population_density" in result.result.visible_features[0], false); } finally { await h.close(); }
});

test("identical successful analysis is reused", async () => {
  let calls=0; const provider=createTestOnlyVisualPerceptionAdapter(() => { calls+=1; return proposal(); }), h=await setup({ provider });
  try { const image=h.store.createImageEvidence("user-a", imageInput()), input={ image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }, first=await h.store.requestVisualPerception("user-a", input), second=await h.store.requestVisualPerception("user-a", input); assert.equal(first.result.perception_result_id, second.result.perception_result_id); assert.equal(second.reused, true); assert.equal(calls, 1); } finally { await h.close(); }
});
test("provider version change creates a new immutable result", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal(), { providerVersion:"fixture/v1" }) });
  try { const image=h.store.createImageEvidence("user-a", imageInput()), first=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }); h.store.visualPerception.provider=createTestOnlyVisualPerceptionAdapter(proposal(), { providerVersion:"fixture/v2" }); const second=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }); assert.notEqual(first.result.perception_result_id, second.result.perception_result_id); assert.equal(h.store.getVisualPerceptionHistory("user-a", image.image_evidence_id).history.length, 2); } finally { await h.close(); }
});
test("relevant context change creates a new result", async () => {
  let revision="context/v1"; const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()), contextResolver:() => ({ crop:"rice", requested_target:"ROOT_COMPARISON", context_revision:revision }) });
  try { const image=h.store.createImageEvidence("user-a", imageInput()), first=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }); revision="context/v2"; const second=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }); assert.notEqual(first.request.context_hash, second.request.context_hash); assert.notEqual(first.result.perception_result_id, second.result.perception_result_id); } finally { await h.close(); }
});
test("visual vocabulary version change invalidates reuse", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const image=h.store.createImageEvidence("user-a", imageInput()), first=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }); h.store.visualPerception.vocabularyVersion="investigation-phenotypes/v2"; const second=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }); assert.notEqual(first.result.perception_result_id, second.result.perception_result_id); assert.notEqual(first.result.visual_vocabulary_version, second.result.visual_vocabulary_version); } finally { await h.close(); }
});

test("network timeout returns PERCEPTION_UNAVAILABLE", async () => {
  const error=Object.assign(new Error("aborted"), { name:"AbortError" }), provider=new OpenAIVisualPerceptionProvider({ apiKey:"server-secret", fetcher:async () => { throw error; } }), h=await setup({ provider, imageLoader:async () => Buffer.from("image") });
  try { const { image, result }=await requestWith(h); assert.equal(result.perception_outcome, "PERCEPTION_UNAVAILABLE"); assert.equal(result.error_category, "NETWORK_TIMEOUT"); assert.equal(h.store.getImageEvidence("user-a", image.image_evidence_id).ve_level, "VE0_RAW_IMAGE_ONLY"); } finally { await h.close(); }
});
test("network unavailable is distinct from no visible abnormality", async () => {
  const provider=new OpenAIVisualPerceptionProvider({ apiKey:"server-secret", fetcher:async () => { throw new TypeError("offline"); } }), h=await setup({ provider, imageLoader:async () => Buffer.from("image") });
  try { const { result }=await requestWith(h); assert.equal(result.error_category, "NETWORK_UNAVAILABLE"); assert.equal(result.result, null); } finally { await h.close(); }
});
test("malformed provider output fails safely", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter("free prose") });
  try { const { result }=await requestWith(h); assert.equal(result.error_category, "MALFORMED_PROVIDER_OUTPUT"); assert.equal(result.result, null); } finally { await h.close(); }
});
test("provider failure creates no negative Evidence and changes no Candidate", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(() => { throw new Error("failure"); }) });
  try { const before=h.store.assessInvestigation("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }); await requestWith(h); const bundle=h.store.getInvestigationBundle("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }), after=h.store.assessInvestigation("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }); assert.equal(bundle.evidence.length, 0); assert.deepEqual(after.candidate_assessments, before.candidate_assessments); } finally { await h.close(); }
});
test("provider failure retains Image Evidence and Guidance", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(() => { throw new Error("failure"); }) });
  try { h.store.visualEvidence.guidanceService={ current:rootGuidance }; const { image }=await requestWith(h); assert.equal(h.store.getImageEvidence("user-a", image.image_evidence_id).status, "RECEIVED"); assert.equal(h.store.getNextVisualRequest("user-a", scope).target, "ROOT_COMPARISON"); } finally { await h.close(); }
});

test("human confirmation retains provider provenance and enables VE3", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { image }=await requestWith(h), proposed=h.store.getImageEvidence("user-a", image.image_evidence_id), reviewed=h.store.reviewVisualObservation("user-a", { image_evidence_id:image.image_evidence_id, visual_feature_observation_id:proposed.visible_features[0].visual_feature_observation_id, action:"CONFIRM_FEATURE", reason:"Reviewer confirms the directly visible feature." }); assert.equal(reviewed.ve_level, "VE3_HUMAN_REVIEWED_VISIBLE_FEATURE"); assert.equal(reviewed.visible_features[0].provider_provenance.provider_type, "TEST_ONLY_VISUAL_PERCEPTION_PROVIDER"); } finally { await h.close(); }
});
test("human correction retains the original provider proposal", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { image }=await requestWith(h), proposed=h.store.getImageEvidence("user-a", image.image_evidence_id), reviewed=h.store.reviewVisualObservation("user-a", { image_evidence_id:image.image_evidence_id, visual_feature_observation_id:proposed.visible_features[0].visual_feature_observation_id, action:"CORRECT_FEATURE", corrected_feature_code:"YELLOWING", corrected_state:"OBSERVED", reason:"Reviewer observes yellowing rather than browning." }); assert.equal(reviewed.visible_features[0].feature_code, "YELLOWING"); assert.equal(reviewed.visible_features[0].original_proposal.feature_code, "BROWNING"); assert.equal(reviewed.training_eligible, false); } finally { await h.close(); }
});
test("human rejection retains immutable provider proposal and audit history", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { image }=await requestWith(h), proposed=h.store.getImageEvidence("user-a", image.image_evidence_id), reviewed=h.store.reviewVisualObservation("user-a", { image_evidence_id:image.image_evidence_id, visual_feature_observation_id:proposed.visible_features[0].visual_feature_observation_id, action:"REJECT_FEATURE", reason:"The proposed feature is not supported by the view." }); assert.equal(reviewed.visible_features[0].review_status, "REJECTED"); assert.equal(reviewed.review_history[0].original_proposal_preserved, true); } finally { await h.close(); }
});
test("only reviewed visual Evidence can enter Step C and trigger reassessment", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const before=h.store.assessInvestigation("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }), { image }=await requestWith(h), proposed=h.store.getImageEvidence("user-a", image.image_evidence_id); h.store.reviewVisualObservation("user-a", { image_evidence_id:image.image_evidence_id, visual_feature_observation_id:proposed.visible_features[0].visual_feature_observation_id, action:"CONFIRM_FEATURE", reason:"Human reviewer confirms browning." }); h.store.reviewVisualObservation("user-a", { image_evidence_id:image.image_evidence_id, action:"LINK_TO_OBSERVATION", observation_id:"obs-b2", plant_part:"ROOT_SYSTEM", reason:"Link only reviewed visual evidence." }); const after=h.store.assessInvestigation("user-a", { field_id:scope.field_id, season_id:scope.crop_season_id, case_id:scope.case_id }); assert.equal(after.assessment_revision, before.assessment_revision+1); assert.notEqual(after.source_bundle_hash, before.source_bundle_hash); } finally { await h.close(); }
});

test("wrong photo returns one root-oriented better-view request", async () => {
  const value=proposal({ observability:[{ concept:"ROOT_COMPARISON", state:"NOT_IN_VIEW", reason:"Canopy only." }, { concept:"ROOT_CONDITION", state:"NOT_IN_VIEW", reason:"Roots not visible." }], visible_features:[] }), h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(value) });
  try { h.store.visualEvidence.guidanceService={ current:rootGuidance }; const { result }=await requestWith(h, { image:{ capture_intent:"PLANT_CONTEXT", plant_part_scope:"WHOLE_PLANT", view_type:"FIELD_CONTEXT", comparison_pair_id:null, comparison_role:"UNKNOWN_ROLE", comparison_role_source:"UNKNOWN" } }); assert.deepEqual(result.result.next_visual_action.action, "BETTER_VIEW_REQUIRED"); assert.equal(result.result.next_visual_action.target, "ROOT_COMPARISON"); assert.equal(result.result.next_visual_action.one_primary_request, true); } finally { await h.close(); }
});
test("photo loop stops after one governed better-view request", async () => {
  const value=proposal({ observability:[{ concept:"ROOT_COMPARISON", state:"NOT_IN_VIEW", reason:"Wrong view." }, { concept:"ROOT_CONDITION", state:"NOT_IN_VIEW", reason:"Roots not visible." }], visible_features:[] }), h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(value) });
  try { h.store.visualEvidence.guidanceService={ current:rootGuidance }; const first=await requestWith(h), second=await requestWith(h); assert.equal(first.result.result.perception_outcome, "BETTER_VIEW_REQUIRED"); assert.equal(second.result.result.perception_outcome, "TARGET_NOT_VISUALLY_ASSESSABLE"); } finally { await h.close(); }
});
test("known backend target is reused without asking the user again", async () => {
  let captured; const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter((input) => { captured=input; return proposal(); }) });
  try { h.store.visualEvidence.guidanceService={ current:rootGuidance }; const image=h.store.createImageEvidence("user-a", imageInput()); const result=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id }); assert.equal(result.request.requested_target, "ROOT_COMPARISON"); assert.equal(captured.authoritativeContext.crop, "rice"); assert.equal("questionnaire" in result.request, false); } finally { await h.close(); }
});
test("future ถ่ายแบบนี้ได้ไหม backend scenario returns structured acceptance", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { h.store.visualEvidence.guidanceService={ current:rootGuidance }; const image=h.store.createImageEvidence("user-a", imageInput()), result=await h.store.requestVisualPerception("user-a", { image_evidence_id:image.image_evidence_id }); assert.equal(result.result.requested_target, "ROOT_COMPARISON"); assert.equal(result.result.observability[0].state, "ASSESSABLE"); assert.equal(result.result.next_visual_action.action, "NONE"); } finally { await h.close(); }
});

test("OpenAI adapter sends strict structured candidate-blind request with server credential only", async () => {
  let captured; const fetcher=async (url, options) => { captured={ url, options }; return { ok:true, status:200, json:async () => ({ id:"resp-safe", output:[{ content:[{ type:"output_text", text:JSON.stringify(proposal()) }] }] }) }; }, provider=new OpenAIVisualPerceptionProvider({ apiKey:"server-secret", model:"visual-model/v1", fetcher }), h=await setup({ provider, imageLoader:async () => Buffer.from("server-image") });
  try { const { result }=await requestWith(h), body=JSON.parse(captured.options.body), context=body.input[0].content[0].text; assert.equal(body.store, false); assert.equal(body.text.format.strict, true); assert.match(captured.options.headers.authorization, /server-secret/); assert.doesNotMatch(context, /candidate|display_name|phone/i); assert.doesNotMatch(JSON.stringify(result), /server-secret/); } finally { await h.close(); }
});
test("health diagnostics expose provider state without secrets", async () => {
  const h=await setup({ provider:new OpenAIVisualPerceptionProvider({ apiKey:"server-secret", fetcher:async () => null }) });
  try { const health=h.store.getVisualPerceptionHealth("user-a"); assert.equal(health.provider.available, true); assert.equal(health.api_key_exposed, false); assert.doesNotMatch(JSON.stringify(health), /server-secret/); } finally { await h.close(); }
});
test("training eligibility and automatic learning remain disabled", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { image, result }=await requestWith(h), stored=h.store.getImageEvidence("user-a", image.image_evidence_id); assert.equal(stored.training_eligible, false); assert.equal(result.result.boundaries.training_eligible, false); assert.equal("learning" in result.result, false); } finally { await h.close(); }
});
test("perception output contains no management, reminder, probability, or Diagnosis authority", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const { result }=await requestWith(h), serialized=JSON.stringify(result.result).toLowerCase(); for (const key of ['"diagnosis":','"probability":','"treatment":','"product":','"rate":','"reminder":']) assert.equal(serialized.includes(key), false); } finally { await h.close(); }
});
test("visual perception schema migration v7 is recorded", async () => {
  const h=await setup(); try { assert.equal(h.store.db.prepare("SELECT COUNT(*) count FROM investigation_schema_migrations WHERE version=7").get().count, 1); } finally { await h.close(); }
});

async function login(base, userId) { const response=await fetch(`${base}/api/pilot/session`, { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ password:"1234", user_id:userId }) }); return response.headers.get("set-cookie").split(";")[0]; }
test("visual perception APIs require authentication", async () => {
  const h=await setup(); h.store.close(); const server=await startServer({ port:0, dbPath:join(h.root,"pilot.sqlite"), exportDir:join(h.root,"exports"), uploadDir:join(h.root,"uploads") });
  try { const response=await fetch(`http://127.0.0.1:${server.address().port}/api/pilot/visual-perception-health`); assert.equal(response.status, 401); } finally { await new Promise((done) => server.close(done)); await rm(h.root,{ recursive:true, force:true }); }
});
test("visual perception result, history, and health APIs are owner scoped and hide API keys", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) }), image=h.store.createImageEvidence("user-a", imageInput()); h.store.close(); const server=await startServer({ port:0, dbPath:join(h.root,"pilot.sqlite"), exportDir:join(h.root,"exports"), uploadDir:join(h.root,"uploads"), visualPerceptionAdapter:createTestOnlyVisualPerceptionAdapter(proposal()) });
  try { const base=`http://127.0.0.1:${server.address().port}`, cookie=await login(base,"user-a"), created=await (await fetch(`${base}/api/pilot/visual-perception`, { method:"POST", headers:{ cookie,"content-type":"application/json" }, body:JSON.stringify({ image_evidence_id:image.image_evidence_id, requested_target:"ROOT_COMPARISON" }) })).json(), result=await (await fetch(`${base}/api/pilot/visual-perception?analysis_request_id=${created.request.analysis_request_id}`, { headers:{ cookie } })).json(), history=await (await fetch(`${base}/api/pilot/visual-perception-history?image_evidence_id=${image.image_evidence_id}`, { headers:{ cookie } })).json(), health=await (await fetch(`${base}/api/pilot/visual-perception-health`, { headers:{ cookie } })).json(); assert.equal(result.result.perception_result_id, created.result.perception_result_id); assert.equal(history.history.length, 1); assert.equal(health.provider.server_side_only, true); assert.equal(JSON.stringify({ result,history,health }).includes("OPENAI_API_KEY"), false); } finally { await new Promise((done) => server.close(done)); await rm(h.root,{ recursive:true, force:true }); }
});
test("foreign user cannot inspect another user's perception history", async () => {
  const h=await setup({ provider:createTestOnlyVisualPerceptionAdapter(proposal()) }), { image }=await requestWith(h); try { assert.throws(() => h.store.getVisualPerceptionHistory("user-b", image.image_evidence_id), /scope not found/); } finally { await h.close(); }
});
