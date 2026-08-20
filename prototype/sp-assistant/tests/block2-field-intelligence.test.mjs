import test from "node:test";
import assert from "node:assert/strict";
import { CONVERSATION_SCOPES, PHOTO_EVIDENCE_BOUNDARY } from "../assets/field-core.js";
import {
  ConversationService,
  DecisionService,
  EvidenceService,
  FieldService,
  GuidanceService,
  InvestigationService,
  LLMGateway,
  MapService,
  StageService,
  WorkspaceRepository,
} from "../assets/field-services.js";
import { loadConfiguration, loadInvestigationConfiguration, MemoryStorage, trianglePoints } from "./support.mjs";

const NOW = new Date("2026-08-20T09:41:00+07:00");
const clock = () => NOW;

async function harness() {
  const storage = new MemoryStorage();
  const repository = new WorkspaceRepository(storage);
  const state = repository.load();
  state.active_user_id = "usr_spa1";
  state.users.push({ user_id: "usr_spa1", username: "SPA1", role: "FIELD_USER" });
  repository.save(state);
  const fields = new FieldService(repository, clock);
  const map = new MapService();
  const stageService = new StageService(await loadConfiguration(), clock);
  const create = (name, offset) => {
    const polygon = map.create_polygon(trianglePoints(offset));
    const stage = stageService.calculate_crop_stage("2026-07-24");
    return fields.create_field({
      owner_user_id: "usr_spa1",
      name,
      polygon,
      centroid: map.calculate_centroid(polygon),
      area: map.calculate_area(polygon),
      crop: "rice",
      variety: "กข43",
      planting_method: "DIRECT_SEEDED_WET",
      planting_date: "2026-07-24",
      current_crop_stage: { code: stage.crop_stage, label: stage.crop_stage_label },
      current_cmp_stage: { stage_id: stage.cmp_stage, label: stage.cmp_stage_label },
      stage_provenance: stage.provenance,
    });
  };
  const fieldA = create("แปลง A", 0);
  const fieldB = create("แปลง B", 0.03);
  fields.select_field(fieldA.field_id, "usr_spa1");
  const config = await loadInvestigationConfiguration();
  const context = (field, caseId = null, conversationId = null) => ({ user_id: "usr_spa1", field_id: field.field_id, season_id: field.season_id, ...(caseId ? { case_id: caseId } : {}), ...(conversationId ? { conversation_id: conversationId } : {}) });
  return { storage, repository, fields, fieldA, fieldB, config, context };
}

test("CMP labels are the exact nine governed user-facing labels and remain separate from backend stages", async () => {
  const fieldConfig = await loadConfiguration();
  assert.deepEqual(fieldConfig.stage_rules.map((rule) => rule.label_th), [
    "ระยะคุมเลน", "ระยะคุมฆ่า", "ระยะหว่านปุ๋ยครั้งที่ 1", "ระยะพ่นยาหลังหว่านปุ๋ยครั้งที่ 1", "ระยะหว่านปุ๋ยครั้งที่ 2", "ระยะพ่นยาหลังหว่านปุ๋ยครั้งที่ 2", "ระยะหว่านปุ๋ยครั้งที่ 3", "ระยะพ่นยากัดหางปลาทู", "ระยะพ่นยารับรวง หรือข้าวก้ม",
  ]);
  assert.ok(fieldConfig.stage_rules.every((rule) => rule.backend_label_th && rule.backend_label_th !== rule.label_th));
});

test("guidance is field and season scoped, status ordered, persisted, and directly linked to a reusable flow", async () => {
  const h = await harness();
  const service = new GuidanceService(h.repository, h.config, clock);
  const a = service.get_guidance(h.context(h.fieldA));
  const b = service.get_guidance(h.context(h.fieldB));
  assert.ok(a.length >= 3);
  assert.ok(b.length >= 3);
  assert.ok(a.every((item) => item.field_id === h.fieldA.field_id && item.season_id === h.fieldA.season_id));
  assert.ok(a.every((item) => h.config.flows.some((flow) => flow.flow_id === item.inspection_flow)));
  service.update_status(h.context(h.fieldA), a[0].guidance_item_id, "COMPLETED");
  const refreshed = new GuidanceService(new WorkspaceRepository(h.storage), h.config, clock).get_guidance(h.context(h.fieldA));
  assert.equal(refreshed.at(-1).status, "COMPLETED");
  assert.equal(service.get_guidance(h.context(h.fieldB)).some((item) => item.status === "COMPLETED"), false);
});

test("generic INSECT, DISEASE, and WEED inspections share one data-driven case path", async () => {
  const h = await harness();
  const inspections = new InvestigationService(h.repository, h.config, clock);
  for (const domain of ["INSECT", "DISEASE", "WEED"]) {
    const flow = h.config.flows.find((item) => item.domain === domain);
    const opened = inspections.start_case(h.context(h.fieldA), { inspection_flow: flow.flow_id });
    const question = inspections.get_next_question(h.context(h.fieldA, opened.case_id));
    assert.equal(opened.domain, domain);
    assert.ok(question.question_id);
    assert.ok(Array.isArray(question.suggestions));
  }
});

test("an in-progress guidance item resumes its open Case instead of forking history", async () => {
  const h = await harness();
  const guidance = new GuidanceService(h.repository, h.config, clock).get_guidance(h.context(h.fieldA))[0];
  const service = new InvestigationService(h.repository, h.config, clock);
  const first = service.start_case(h.context(h.fieldA), { guidance_item_id: guidance.guidance_item_id, inspection_flow: guidance.inspection_flow });
  const resumed = service.start_case(h.context(h.fieldA), { guidance_item_id: guidance.guidance_item_id, inspection_flow: guidance.inspection_flow });
  assert.equal(resumed.case_id, first.case_id);
  assert.equal(h.repository.load().cases.filter((item) => item.guidance_item_id === guidance.guidance_item_id).length, 1);
});

test("guided answers preserve suggestion, free-text, uncertain, other, and skipped observations", async () => {
  const h = await harness();
  const service = new InvestigationService(h.repository, h.config, clock);
  const flow = h.config.flows.find((item) => item.domain === "INSECT");
  const opened = service.start_case(h.context(h.fieldA), { inspection_flow: flow.flow_id });
  const ctx = h.context(h.fieldA, opened.case_id);
  let question = service.get_next_question(ctx);
  service.submit_observation(ctx, { question_id: question.question_id, value: question.suggestions[0].value, response_mode: "SUGGESTION" });
  question = service.get_next_question(ctx);
  service.submit_observation(ctx, { question_id: question.question_id, value: "พบเป็นหย่อมใกล้คันนา", original_text: "พบเป็นหย่อมใกล้คันนา", response_mode: "FREE_TEXT" });
  question = service.get_next_question(ctx);
  service.submit_observation(ctx, { question_id: question.question_id, value: "UNSURE", response_mode: "UNCERTAIN", uncertain: true, skipped: true });
  const rows = h.repository.load().observations.filter((item) => item.case_id === opened.case_id);
  assert.deepEqual(rows.map((row) => row.response_mode), ["SUGGESTION", "FREE_TEXT", "UNCERTAIN"]);
  assert.equal(rows.at(-1).uncertain, true);
  assert.equal(rows.at(-1).skipped, true);
  const second = service.start_case(h.context(h.fieldA), { inspection_flow: flow.flow_id });
  question = service.get_next_question(h.context(h.fieldA, second.case_id));
  const other = service.submit_observation(h.context(h.fieldA, second.case_id), { question_id: question.question_id, value: "อาการอื่นที่ผู้ใช้บรรยายเอง", original_text: "อาการอื่นที่ผู้ใช้บรรยายเอง", response_mode: "OTHER" });
  assert.equal(other.response_mode, "OTHER");
  assert.equal(other.original_text, "อาการอื่นที่ผู้ใช้บรรยายเอง");
});

test("photo receipt records scoped evidence without pretending analysis occurred", async () => {
  const h = await harness();
  const investigations = new InvestigationService(h.repository, h.config, clock);
  const conversations = new ConversationService(h.repository, clock);
  const evidence = new EvidenceService(h.repository, clock);
  const flow = h.config.flows.find((item) => item.domain === "DISEASE");
  const opened = investigations.start_case(h.context(h.fieldA), { inspection_flow: flow.flow_id });
  const caseCtx = h.context(h.fieldA, opened.case_id);
  const conversation = conversations.create_conversation(caseCtx, CONVERSATION_SCOPES.CASE_SCOPED);
  const full = h.context(h.fieldA, opened.case_id, conversation.conversation_id);
  const item = evidence.add_evidence(full, { source_type: "USER_PHOTO", file_name: "field-a.jpg", media_type: "image/jpeg" });
  assert.equal(item.analysis_state, "PHOTO_RECEIVED");
  assert.equal(item.boundary, PHOTO_EVIDENCE_BOUNDARY);
  assert.equal("diagnosis" in item, false);
  assert.equal(evidence.get_evidence(full).length, 1);
  assert.throws(() => evidence.get_evidence(h.context(h.fieldB, opened.case_id, conversation.conversation_id)), /context/);
});

test("free chat stays FIELD_SCOPED and messages cannot cross fields or conversations", async () => {
  const h = await harness();
  const service = new ConversationService(h.repository, clock);
  const a = service.create_conversation(h.context(h.fieldA), CONVERSATION_SCOPES.FIELD_SCOPED);
  const b = service.create_conversation(h.context(h.fieldB), CONVERSATION_SCOPES.FIELD_SCOPED);
  service.append_message(h.context(h.fieldA, null, a.conversation_id), { role: "user", content: "ข้อความของแปลง A" });
  assert.equal(service.list_messages(h.context(h.fieldA, null, a.conversation_id)).length, 1);
  assert.equal(service.list_messages(h.context(h.fieldB, null, b.conversation_id)).length, 0);
  assert.throws(() => service.list_messages(h.context(h.fieldB, null, a.conversation_id)), /mismatch/);
});

test("case completion, neutral summary, decision state, and history survive repository refresh", async () => {
  const h = await harness();
  const investigations = new InvestigationService(h.repository, h.config, clock);
  const decisions = new DecisionService(h.repository, h.config, clock);
  const flow = h.config.flows.find((item) => item.domain === "WEED");
  const opened = investigations.start_case(h.context(h.fieldA), { inspection_flow: flow.flow_id });
  const ctx = h.context(h.fieldA, opened.case_id);
  const q1 = investigations.get_next_question(ctx);
  investigations.submit_observation(ctx, { question_id: q1.question_id, value: "UNSURE", uncertain: true, response_mode: "UNCERTAIN" });
  investigations.finish_case(ctx);
  const need = decisions.evaluate_need_for_action(ctx);
  const saved = investigations.save_case_summary(ctx, { candidate_only: true, candidate_label: null, uncertainty: "มีข้อมูลที่ยังไม่แน่ใจ", need_for_action: need.state, evidence_references: need.evidence_references, source_provenance: ["need-for-action-decision/v1"] });
  const refreshed = new InvestigationService(new WorkspaceRepository(h.storage), h.config, clock);
  assert.equal(refreshed.get_case(ctx).status, "COMPLETED");
  assert.equal(refreshed.get_case_summary(ctx).case_summary_id, saved.case_summary_id);
  assert.equal(refreshed.list_case_history(h.context(h.fieldA))[0].summary.need_for_action, "MORE_EVIDENCE_REQUIRED");
  assert.equal(refreshed.list_case_history(h.context(h.fieldB)).length, 0);
});

test("management stays governed: no forced chemical, no unsupported single suggestion, and selection is not field action", async () => {
  const h = await harness();
  const investigations = new InvestigationService(h.repository, h.config, clock);
  const decisions = new DecisionService(h.repository, h.config, clock);
  const flow = h.config.flows.find((item) => item.domain === "ABIOTIC");
  const opened = investigations.start_case(h.context(h.fieldA), { inspection_flow: flow.flow_id });
  const ctx = h.context(h.fieldA, opened.case_id);
  const q1 = investigations.get_next_question(ctx);
  investigations.submit_observation(ctx, { question_id: q1.question_id, value: "UNSURE", uncertain: true });
  const result = decisions.get_management_options(ctx);
  assert.equal(result.single_suggestion_supported, false);
  assert.ok(result.suggestion_message);
  assert.equal(result.options.some((item) => item.option_class === "CHEMICAL_REVIEW"), false);
  assert.ok(result.options.every((item) => item.suggested === false));
  const selectable = result.options.find((item) => item.eligibility_state === "eligible");
  const log = decisions.select_management_option(ctx, selectable.management_option_id, "บันทึกแผนเท่านั้น");
  assert.equal(log.selection_only, true);
  assert.equal(log.field_action_performed, false);
  assert.equal(decisions.get_decision_log(ctx).notes, "บันทึกแผนเท่านั้น");
  const application = decisions.application_guidance();
  assert.equal(application.application_method, null);
  assert.equal(application.evidence_state, "UNAVAILABLE");
});

test("LLM and image-analysis adapters fail honestly without a browser-exposed key", async () => {
  const gateway = new LLMGateway();
  assert.equal(gateway.is_available(), false);
  assert.equal((await gateway.chat({ message: "ทดสอบ" })).status, "UNAVAILABLE");
  const image = await gateway.analyze_image({ file_name: "field.jpg" });
  assert.equal(image.analysis_performed, false);
  assert.equal(image.status, "UNAVAILABLE");
});
