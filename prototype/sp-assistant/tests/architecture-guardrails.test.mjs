import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MODEL_CONTRACTS, RELATIONSHIP_BACKBONE } from "../assets/field-core.js";

test("core model and relationship contracts are complete", () => {
  for (const name of ["User", "Field", "Season", "StageAssessment", "GuidanceState", "Activity", "Case", "Observation", "Evidence", "Conversation", "Message", "GuidanceItem", "Recommendation", "ManagementOption", "DecisionLog", "FollowUp", "Outcome", "Alert", "KnowledgeObject"]) assert.ok(MODEL_CONTRACTS[name], `missing ${name}`);
  assert.deepEqual(RELATIONSHIP_BACKBONE.User, ["Field"]);
  assert.ok(RELATIONSHIP_BACKBONE.Case.includes("DecisionLog"));
  assert.ok(MODEL_CONTRACTS.Field.includes("field_id"));
  assert.ok(MODEL_CONTRACTS.Field.includes("stage_provenance"));
  assert.deepEqual(RELATIONSHIP_BACKBONE.Season, ["StageAssessment", "GuidanceState"]);
});

test("new UI has no direct storage writes, OpenAI calls, or entity-specific decision paths", async () => {
  const source = await readFile(new URL("../assets/field-app.js", import.meta.url), "utf8");
  for (const prohibited of [".setItem(", ".getItem(", "api.openai.com", "OPENAI_API_KEY", "bentazone", "brown-planthopper", "เพลี้ยกระโดดสีน้ำตาล"]) assert.equal(source.toLowerCase().includes(prohibited.toLowerCase()), false, `prohibited UI coupling: ${prohibited}`);
  assert.equal(/if\s*\([^)]*(?:pest|disease|weed|threshold|registration)/i.test(source), false);
});
