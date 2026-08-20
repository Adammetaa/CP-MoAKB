import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startServer } from "../server.mjs";

async function session(base) {
  const response = await fetch(`${base}/api/pilot/session`, { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ password:"1234", user_id:"prototype-spa-001" }) });
  assert.equal(response.status, 200); return response.headers.get("set-cookie").split(";")[0];
}

test("pilot API requires a session and restores workspace after restart", async () => {
  const root = await mkdtemp(join(tmpdir(), "cpmoakb-server-")), options = { port:0, dbPath:join(root, "pilot.sqlite"), exportDir:join(root, "exports"), uploadDir:join(root, "uploads") };
  let server = await startServer(options), base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(`${base}/api/pilot/workspace`)).status, 401);
  let cookie = await session(base), state = { schema_version:2, users:[], fields:[{ field_id:"field-1", owner_user_id:"prototype-spa-001", name:"นาไทย" }], seasons:[{ season_id:"season-1", field_id:"field-1" }], activities:[], cases:[], observations:[], evidence:[], conversations:[], messages:[], guidance:[], decision_logs:[], case_summaries:[], weather_snapshots:[] };
  assert.equal((await fetch(`${base}/api/pilot/workspace`, { method:"PUT", headers:{ cookie, "content-type":"application/json" }, body:JSON.stringify({ state }) })).status, 200);
  const evidence = { field_id:"field-1", season_id:"season-1", original_filename:"ใบข้าว.png", media_type:"image/png", size_bytes:1, content_base64:"AA==" };
  const evidenceResponse = await fetch(`${base}/api/pilot/evidence`, { method:"POST", headers:{ cookie, "content-type":"application/json" }, body:JSON.stringify(evidence) });
  assert.equal(evidenceResponse.status, 201); assert.equal((await evidenceResponse.json()).analysis_state, "NOT_ANALYZED");
  await new Promise((done) => server.close(done));
  server = await startServer(options); base = `http://127.0.0.1:${server.address().port}`; cookie = await session(base);
  const restored = await (await fetch(`${base}/api/pilot/workspace`, { headers:{ cookie } })).json(); assert.equal(restored.state.fields[0].name, "นาไทย");
  await new Promise((done) => server.close(done)); await rm(root, { recursive:true, force:true });
});

test("LAN binding is blocked unless explicitly enabled", async () => {
  const root = await mkdtemp(join(tmpdir(), "cpmoakb-lan-"));
  await assert.rejects(startServer({ port:0, host:"0.0.0.0", dbPath:join(root,"pilot.sqlite"), exportDir:join(root,"exports"), uploadDir:join(root,"uploads") }), /PILOT_ALLOW_LAN/);
  await rm(root, { recursive:true, force:true });
});
