import test from "node:test";
import assert from "node:assert/strict";
import { ServerLLMAdapter } from "../assets/server-llm-adapter.js";
import { extractOutputText, validateChatPayload } from "../server.mjs";

test("server chat request is strictly field scoped", () => {
  assert.deepEqual(validateChatPayload({ message:" พบใบเหลือง ", scope:"FIELD_SCOPED", field_id:"field-1", season_id:"season-1" }), { message:"พบใบเหลือง", scope:"FIELD_SCOPED", field_id:"field-1", season_id:"season-1" });
  assert.throws(() => validateChatPayload({ message:"x", scope:"GLOBAL" }));
  assert.throws(() => validateChatPayload({ message:"x", scope:"FIELD_SCOPED", api_key:"secret" }));
});
test("Responses output extraction ignores non-message output", () => { assert.equal(extractOutputText({ output:[{ type:"reasoning" },{ type:"message", content:[{ type:"output_text", text:"คำตอบ" }] }] }), "คำตอบ"); });
test("browser adapter calls only the same-origin gateway", async () => { let request; const adapter = new ServerLLMAdapter({ fetcher:async (url, options) => { request = { url, options }; return { ok:true, json:async () => ({ status:"AVAILABLE", message:"รับทราบ" }) }; } }); const result = await adapter.chat({ message:"ตรวจอะไรต่อ", scope:"FIELD_SCOPED", field_id:"field-1", season_id:"season-1" }); assert.equal(request.url, "/api/assistant/chat"); assert.doesNotMatch(request.options.body, /OPENAI_API_KEY/); assert.equal(result.status, "AVAILABLE"); });
