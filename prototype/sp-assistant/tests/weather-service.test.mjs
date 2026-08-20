import test from "node:test";
import assert from "node:assert/strict";
import { WeatherService } from "../assets/field-services.js";

test("weather uses field coordinates and preserves provider provenance", async () => {
  let requestedUrl;
  const service = new WeatherService({ fetcher: async (url) => { requestedUrl = new URL(url); return { ok: true, json: async () => ({ latitude: 13.75, longitude: 100.5, timezone: "Asia/Bangkok", current: { time: "2026-08-20T17:15", temperature_2m: 31.4, weather_code: 61, wind_speed_10m: 7.2, precipitation: 0.4, is_day: 1 } }) }; }, clock: () => new Date("2026-08-20T10:15:00Z") });
  const result = await service.get_weather({ status: "AVAILABLE", latitude: 13.751, longitude: 100.502, source: "FIELD_CENTROID", field_id: "field-1" });
  assert.equal(requestedUrl.hostname, "api.open-meteo.com");
  assert.equal(requestedUrl.searchParams.get("latitude"), "13.751");
  assert.match(requestedUrl.searchParams.get("current"), /weather_code/);
  assert.equal(result.status, "AVAILABLE");
  assert.equal(result.provider, "OPEN_METEO");
  assert.equal(result.condition, "มีฝน");
  assert.equal(result.target.field_id, "field-1");
  assert.match(result.limitations[0], /ไม่ใช่เซนเซอร์/);
});

test("weather fails honestly for missing location and provider errors", async () => {
  assert.equal((await new WeatherService().get_weather(null)).reason, "LOCATION_REQUIRED");
  const service = new WeatherService({ fetcher: async () => { throw new Error("offline"); } });
  const result = await service.get_weather({ status: "AVAILABLE", latitude: 13, longitude: 100 });
  assert.equal(result.status, "UNAVAILABLE");
  assert.equal(result.reason, "PROVIDER_ERROR");
});

test("default browser fetch is invoked through the global object", async () => {
  const originalFetch = globalThis.fetch;
  let invoked = false;
  globalThis.fetch = async function () { assert.equal(this, globalThis); invoked = true; return { ok: true, json: async () => ({ current: { temperature_2m: 30, weather_code: 1, wind_speed_10m: 4 } }) }; };
  try { const result = await new WeatherService().get_weather({ status: "AVAILABLE", latitude: 13.75, longitude: 100.5 }); assert.equal(result.status, "AVAILABLE"); assert.equal(invoked, true); }
  finally { globalThis.fetch = originalFetch; }
});
