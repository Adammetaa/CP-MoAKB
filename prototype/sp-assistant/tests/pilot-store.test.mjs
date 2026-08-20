import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PilotStore, safeWorkspace } from "../pilot-store.mjs";

const workspace = { schema_version:2, users:[{ user_id:"prototype-spa-001", display_name:"ผู้ใช้งานทดสอบ" }], fields:[{ field_id:"field-1", owner_user_id:"prototype-spa-001", name:"นาทุ่งทอง" }], seasons:[{ season_id:"season-1", field_id:"field-1" }], conversations:[{ conversation_id:"conversation-1", field_id:"field-1", season_id:"season-1", scope:"FIELD_SCOPED" }], messages:[{ message_id:"message-1", conversation_id:"conversation-1", content:"วันนี้ควรสังเกตอะไร" }], activities:[], cases:[], observations:[], evidence:[], guidance:[], decision_logs:[], case_summaries:[] };

test("pilot SQLite persists Thai workspace across restart and exports safely", async () => {
  const root = await mkdtemp(join(tmpdir(), "cpmoakb-pilot-")), dbPath = join(root, "pilot.sqlite"), exportDir = join(root, "exports");
  let store = await new PilotStore({ dbPath, exportDir }).open();
  store.putWorkspace("prototype-spa-001", workspace); store.close();
  store = await new PilotStore({ dbPath, exportDir }).open();
  assert.equal(store.getWorkspace("prototype-spa-001").state.fields[0].name, "นาทุ่งทอง");
  assert.equal(store.summary().messages, 1);
  const exported = await store.exportAll(), json = await readFile(join(exportDir, exported.json_file), "utf8");
  assert.match(json, /นาทุ่งทอง/); assert.doesNotMatch(json, /OPENAI_API_KEY|authorization/i);
  const backup = store.backup(); assert.match(backup.backup_file, /^pilot-backup-.*\.sqlite$/);
  store.close(); await rm(root, { recursive:true, force:true });
});

test("pilot storage rejects secret-shaped fields and invalid identity", () => {
  assert.throws(() => safeWorkspace({ fields:[], api_key:"secret" }), /secret/);
  assert.throws(() => safeWorkspace({ fields:[{ password:"1234" }] }), /secret/);
});
