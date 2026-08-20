import test from "node:test";
import assert from "node:assert/strict";
import { STAGE_PROVENANCE, resolveMockUser, validateFieldName } from "../assets/field-core.js";
import { MapService, StageService } from "../assets/field-services.js";
import { loadConfiguration, trianglePoints } from "./support.mjs";

test("mock login resolves all supported roles", () => {
  assert.equal(resolveMockUser("spa1", "secret").role, "FIELD_USER");
  assert.equal(resolveMockUser("CA1", "secret").role, "CROP_ADVISOR");
  assert.equal(resolveMockUser("AG1", "secret").role, "AGRONOMIST");
  assert.throws(() => resolveMockUser("UNKNOWN", "secret"));
  assert.throws(() => resolveMockUser("SPA1", ""));
});

test("field name is required and limited to 50 characters", () => {
  assert.equal(validateFieldName("  ").valid, false);
  assert.equal(validateFieldName("ก".repeat(50)).valid, true);
  assert.equal(validateFieldName("ก".repeat(51)).valid, false);
});

test("Thai and safe mixed field names are accepted without collapsing display intent", () => {
  const result = validateFieldName("  นาบ้านทุ่งทอง (A_1)-2569  ");
  assert.equal(result.valid, true);
  assert.equal(result.value, "นาบ้านทุ่งทอง (A_1)-2569");
  assert.equal(result.changedBoundaryWhitespace, true);
});

test("polygon service closes geometry and calculates area and centroid", () => {
  const service = new MapService();
  const polygon = service.create_polygon(trianglePoints());
  assert.deepEqual(polygon.coordinates[0][0], polygon.coordinates[0].at(-1));
  const area = service.calculate_area(polygon);
  const centroid = service.calculate_centroid(polygon);
  assert.ok(area.square_meters > 0);
  assert.ok(area.rai > 0);
  assert.ok(centroid.latitude > 13.7 && centroid.latitude < 13.8);
  assert.ok(centroid.longitude > 100.4 && centroid.longitude < 100.6);
});

test("crop age and future countdown derive from the date", async () => {
  const config = await loadConfiguration();
  const service = new StageService(config, () => new Date("2026-08-20T12:00:00Z"));
  assert.deepEqual(service.calculate_crop_age("2026-08-10"), { state: "PLANTED", crop_age_days: 10, days_until_planting: 0 });
  assert.deepEqual(service.calculate_crop_age("2026-08-30"), { state: "PLANNED", crop_age_days: null, days_until_planting: 10 });
  assert.equal(service.calculate_crop_stage("2026-08-30").crop_stage, "PRE_PLANTING");
});

test("system stage can be confirmed or overridden with provenance", async () => {
  const config = await loadConfiguration();
  const service = new StageService(config, () => new Date("2026-08-20T12:00:00Z"));
  const estimate = service.calculate_crop_stage("2026-07-20");
  assert.equal(estimate.provenance, STAGE_PROVENANCE.SYSTEM_ESTIMATED);
  assert.equal(service.confirm_crop_stage(estimate).provenance, STAGE_PROVENANCE.USER_CONFIRMED);
  const override = service.override_crop_stage(estimate, "GRAIN_FILLING", "CMP-08", "น้ำนม–แป้ง");
  assert.equal(override.provenance, STAGE_PROVENANCE.USER_OVERRIDDEN);
  assert.equal(override.cmp_stage, "CMP-08");
});
