import test from "node:test";
import assert from "node:assert/strict";
import { FieldService, LocationService, MapService, StageService, WorkspaceRepository } from "../assets/field-services.js";
import { loginToPrototypeWorkspace } from "../assets/prototype-login.js";
import { loadConfiguration, MemoryStorage, trianglePoints } from "./support.mjs";

test("golden flow: fixed-password login to GPS fallback to persisted field reopen", async () => {
  const storage = new MemoryStorage();
  const repository = new WorkspaceRepository(storage);
  const { user, nextRoute } = loginToPrototypeWorkspace(repository, "1234", new Date("2026-08-20T08:00:00Z"), { randomUUID: () => "golden-session" });
  assert.equal(nextRoute, "gps");

  const location = await new LocationService(null, repository).request_location();
  assert.equal(location.status, "UNAVAILABLE");
  const fields = new FieldService(repository, () => new Date("2026-08-20T08:00:00Z"));
  assert.deepEqual(fields.list_fields(user.user_id), []);

  const map = new MapService();
  const polygon = map.create_polygon(trianglePoints());
  const stage = new StageService(await loadConfiguration(), () => new Date("2026-08-20T08:00:00Z")).calculate_crop_stage("2026-08-10");
  const created = fields.create_field({ owner_user_id: user.user_id, name: "นาบ้านทุ่งทอง", polygon, centroid: map.calculate_centroid(polygon), area: map.calculate_area(polygon), crop: "rice", variety: "พันธุ์ทดสอบ", planting_method: "DIRECT_SEEDED_WET", planting_date: "2026-08-10", expected_planting_date: null, current_crop_stage: { code: stage.crop_stage, label: stage.crop_stage_label }, current_cmp_stage: { stage_id: stage.cmp_stage, label: stage.cmp_stage_label }, stage_provenance: stage.provenance });

  const afterRefresh = new FieldService(new WorkspaceRepository(storage));
  assert.equal(afterRefresh.get_field(created.field_id).name, "นาบ้านทุ่งทอง");
  assert.equal(afterRefresh.list_fields(user.user_id).length, 1);
});
