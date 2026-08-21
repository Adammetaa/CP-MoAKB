import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PilotStore } from "../pilot-store.mjs";

function lifecycle(userId = "user-a") {
  return {
    schema_version:2,
    users:[{ user_id:userId }],
    fields:[{ field_id:"field-1", owner_user_id:userId, name:"นา lifecycle", polygon:{ type:"Polygon", coordinates:[[[100,13],[100.01,13],[100,13.01],[100,13]]] }, centroid:{ latitude:13.003, longitude:100.003 }, area:{ rai:3.25, hectares:0.52 }, crop:"rice", variety:"กข43", planting_method:"TRANSPLANTED", planting_date:"2026-08-01", expected_planting_date:null, current_crop_stage:{ code:"TILLERING", label:"แตกกอ", model_version:"field-stage-model/v1" }, current_cmp_stage:{ stage_id:"CMP-03", label:"ระยะแตกกอ", model_version:"field-stage-model/v1" }, season_id:"season-1", stage_provenance:"USER_CONFIRMED", created_at:"2026-08-01T00:00:00.000Z", updated_at:"2026-08-20T00:00:00.000Z" }],
    seasons:[{ season_id:"season-1", field_id:"field-1", crop:"rice", started_at:"2026-08-01", status:"ACTIVE" }],
    guidance:[{ guidance_item_id:"guidance-1", user_id:userId, field_id:"field-1", season_id:"season-1", status:"PENDING", title:"ตรวจแปลง", updated_at:"2026-08-20T00:00:00.000Z" }],
    activities:[], cases:[], observations:[], evidence:[], conversations:[], messages:[], decision_logs:[], case_summaries:[], weather_snapshots:[],
  };
}

test("server lifecycle is authoritative, scoped, and idempotent", async () => {
  const root = await mkdtemp(join(tmpdir(),"cpmoakb-lifecycle-"));
  const store = await new PilotStore({ dbPath:join(root,"pilot.sqlite"), exportDir:join(root,"exports") }).open();
  const state = lifecycle();
  store.putWorkspace("user-a",state);
  store.putWorkspace("user-a",state);
  const authoritative = store.getLifecycle("user-a");
  assert.equal(authoritative.authority,"SERVER");
  assert.equal(authoritative.user_id,"user-a");
  assert.equal(authoritative.fields.length,1);
  assert.equal(authoritative.seasons.length,1);
  assert.deepEqual(authoritative.fields[0].polygon,state.fields[0].polygon);
  assert.equal(authoritative.fields[0].area.rai,3.25);
  assert.equal(authoritative.fields[0].variety,"กข43");
  assert.equal(authoritative.fields[0].stage_provenance,"USER_CONFIRMED");
  assert.equal(authoritative.fields[0].stage_assessment.configuration_version,"cmp-operational-stage-model/v2");
  assert.equal(store.getGuidance("user-a","field-1","season-1")[0].guidance_item_id,"guidance-1");
  assert.equal(store.getLifecycle("user-b"),null);
  assert.equal(store.getGuidance("user-b","field-1","season-1"),null);
  assert.throws(() => store.putWorkspace("user-b",lifecycle("user-b")),/ownership mismatch/);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM lifecycle_fields").get().count,1);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM lifecycle_users").get().count,1);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM crop_seasons").get().count,1);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM stage_assessments").get().count,1);
  store.close(); await rm(root,{ recursive:true, force:true });
});

test("existing JSON workspace migrates once and hydrates from normalized server records", async () => {
  const root = await mkdtemp(join(tmpdir(),"cpmoakb-lifecycle-migration-")), dbPath = join(root,"pilot.sqlite"), exportDir = join(root,"exports");
  let store = await new PilotStore({ dbPath, exportDir }).open();
  store.putWorkspace("user-a",lifecycle());
  store.db.prepare("DELETE FROM lifecycle_migrations WHERE owner_user_id = ?").run("user-a");
  store.close();
  store = await new PilotStore({ dbPath, exportDir }).open();
  assert.equal(store.getWorkspace("user-a").state.lifecycle_authority,"SERVER");
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM lifecycle_migrations WHERE owner_user_id = ?").get("user-a").count,1);
  store.close();
  store = await new PilotStore({ dbPath, exportDir }).open();
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM lifecycle_fields WHERE owner_user_id = ?").get("user-a").count,1);
  store.close(); await rm(root,{ recursive:true, force:true });
});
