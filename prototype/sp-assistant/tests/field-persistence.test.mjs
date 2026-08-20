import test from "node:test";
import assert from "node:assert/strict";
import { FieldService, MapService, StageService, WorkspaceRepository } from "../assets/field-services.js";
import { loadConfiguration, MemoryStorage, trianglePoints } from "./support.mjs";

async function createFieldInput(ownerUserId, name, offset = 0, date = "2026-08-30") {
  const map = new MapService();
  const polygon = map.create_polygon(trianglePoints(offset));
  const config = await loadConfiguration();
  const stage = new StageService(config, () => new Date("2026-08-20T12:00:00Z")).calculate_crop_stage(date);
  return { owner_user_id: ownerUserId, name, polygon, centroid: map.calculate_centroid(polygon), area: map.calculate_area(polygon), crop: "rice", variety: "ข้อมูลทดสอบ", planting_method: "TRANSPLANTED", planting_date: null, expected_planting_date: date, current_crop_stage: { code: stage.crop_stage, label: stage.crop_stage_label }, current_cmp_stage: { stage_id: stage.cmp_stage, label: stage.crop_stage_label }, stage_provenance: stage.provenance };
}

test("future planting date, polygon, season, and activity persist across refresh", async () => {
  const storage = new MemoryStorage();
  const firstRepository = new WorkspaceRepository(storage);
  const firstService = new FieldService(firstRepository, () => new Date("2026-08-20T12:00:00Z"));
  const created = firstService.create_field(await createFieldInput("usr_spa1", "นาทดสอบ"));
  assert.equal(created.planting_date, null);
  assert.equal(created.expected_planting_date, "2026-08-30");

  const refreshedRepository = new WorkspaceRepository(storage);
  const refreshedService = new FieldService(refreshedRepository);
  const reloaded = refreshedService.get_field(created.field_id);
  assert.deepEqual(reloaded.polygon, created.polygon);
  assert.equal(reloaded.name, "นาทดสอบ");
  assert.equal(refreshedRepository.load().seasons[0].field_id, created.field_id);
  assert.equal(refreshedRepository.load().activities[0].field_id, created.field_id);
});

test("two fields keep distinct stable identities and geometry", async () => {
  const storage = new MemoryStorage();
  const service = new FieldService(new WorkspaceRepository(storage));
  const first = service.create_field(await createFieldInput("usr_spa1", "ชื่อซ้ำ", 0));
  const second = service.create_field(await createFieldInput("usr_spa1", "ชื่อซ้ำ", 0.02));
  assert.notEqual(first.field_id, second.field_id);
  assert.notEqual(first.season_id, second.season_id);
  assert.notDeepEqual(first.centroid, second.centroid);
  assert.equal(service.list_fields("usr_spa1").length, 2);
  assert.equal(service.list_fields("usr_ca1").length, 0);
});
