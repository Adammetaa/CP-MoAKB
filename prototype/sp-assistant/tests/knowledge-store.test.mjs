import test from "node:test";
import assert from "node:assert/strict";
import { PilotKnowledgeStore } from "../knowledge-store.mjs";

test("pilot knowledge search returns reviewed bounded records with provenance", async () => {
  const store = await new PilotKnowledgeStore().open();
  const disease = store.search({ query:"โรคไหม้", domain:"DISEASE" });
  assert.equal(disease[0].name, "โรคไหม้");
  assert.equal(disease[0].review_state, "accepted-internal-not-published");
  assert.ok(disease[0].sources.every((source) => source.id && source.sha256));
  assert.match(disease[0].limitations.join(" "), /ไม่ใช่การยืนยันการวินิจฉัย/);
  const insect = store.search({ query:"เพลี้ยกระโดดสีน้ำตาล", domain:"INSECT" });
  assert.equal(insect[0].scientific, "Nilaparvata lugens");
  for (const record of [...disease, ...insect]) {
    assert.equal("product" in record, false); assert.equal("rate" in record, false); assert.equal("recommendation" in record, false);
  }
});

test("pilot knowledge search rejects unreviewed domains and empty queries", async () => {
  const store = await new PilotKnowledgeStore().open();
  assert.throws(() => store.search({ query:"", domain:"DISEASE" }), /invalid knowledge query/);
  assert.throws(() => store.search({ query:"ข้าว", domain:"PRODUCT" }), /invalid knowledge domain/);
});

test("company rice program is stage-scoped, governed, and keeps wind limitations explicit", async () => {
  const store = await new PilotKnowledgeStore().open();
  const all = store.program();
  assert.equal(all.status, "accepted-internal-pilot");
  assert.equal(all.stages.length, 9);
  assert.equal(all.governance.sent_to_openai, false);
  assert.equal(all.governance.wind_adjusted, false);
  assert.equal(all.governance.content_class, "REFERENCE_ONLY");
  assert.equal(all.governance.case_actionable, false);
  assert.equal(all.governance.regulatory_authority, false);
  assert.equal(all.governance.stage_match_is_approved_use, false);
  assert.equal(all.governance.historical_program_rate_is_case_rate, false);
  const stage = store.program("CMP-06").stages[0];
  assert.equal(stage.stage_id, "CMP-06");
  assert.ok(stage.items.every(([name, rate]) => name && /ไร่/.test(rate)));
  assert.match(stage.drone.source_wind_limit, /3 ม\.\/วินาที/);
  assert.throws(() => store.program("CMP-99"), /invalid company program stage/);
});
