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
test("browser adapter calls only the governed same-origin orchestrator", async () => { let request; const adapter = new ServerLLMAdapter({ idProvider:()=>"request-1", fetcher:async (url, options) => { request = { url, options }; return { ok:true, json:async () => ({ conversation_id:"conversation-server", turn_id:"turn-server", text:"รับทราบ", provider:{provider_id:"conversation-provider-disabled",provider_version:"none"} }) }; } }); const result = await adapter.chat({ message:"ตรวจอะไรต่อ", scope:"FIELD_SCOPED", field_id:"field-1", season_id:"season-1" }); assert.equal(request.url, "/api/pilot/conversation-turns"); assert.doesNotMatch(request.options.body, /OPENAI_API_KEY/); assert.match(request.options.body,/browser-turn-request-1/); assert.equal(result.status, "AVAILABLE"); assert.equal(result.governed_response.turn_id,"turn-server"); });
test("browser adapter resumes matching server conversation across devices",async()=>{const calls=[],adapter=new ServerLLMAdapter({idProvider:()=>"request-2",fetcher:async(url,options)=>{calls.push({url,options});if(url==="/api/pilot/conversations")return {ok:true,json:async()=>({conversations:[{conversation_id:"conversation-resumed",field_id:"field-1",season_id:"season-1",status:"ACTIVE"}]})};return {ok:true,json:async()=>({conversation_id:"conversation-resumed",turn_id:"turn-2",text:"ต่อจากเดิม",provider:{provider_id:"conversation-provider-disabled",provider_version:"none"}})};}});await adapter.chat({message:"ต่อจากเดิม",scope:"FIELD_SCOPED",field_id:"field-1",season_id:"season-1"});assert.equal(calls[0].url,"/api/pilot/conversations");assert.equal(JSON.parse(calls[1].options.body).conversation_id,"conversation-resumed");});
