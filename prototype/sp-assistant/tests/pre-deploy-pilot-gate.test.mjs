import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startServer } from "../server.mjs";
import { validatePilotConfiguration } from "../pilot-hardening-runtime.mjs";
import { createEmptyCandidateProvider } from "../candidate-provider.mjs";

const users = [
  { login_id:"spa", user_id:"pilot-spa", password:"test-spa-password", enabled:true, display_name:"SPA reviewer", role:"SPA" },
  { login_id:"field-a", user_id:"pilot-field-a", password:"test-field-a-password", enabled:true, display_name:"Field User A", role:"FIELD_USER" },
  { login_id:"field-b", user_id:"pilot-field-b", password:"test-field-b-password", enabled:true, display_name:"Field User B", role:"FIELD_USER" },
];

async function login(base, user) {
  const response = await fetch(`${base}/api/pilot/session`, { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ login_id:user.login_id, password:user.password }) });
  assert.equal(response.status, 200);
  return { cookie:response.headers.get("set-cookie").split(";")[0], setCookie:response.headers.get("set-cookie"), body:await response.json() };
}

test("M0D Render configuration is persistent, manual, and explicitly single-instance", async () => {
  const render = await readFile(new URL("../../../render.yaml", import.meta.url), "utf8");
  for (const expected of ["plan: starter", "numInstances: 1", "WEB_CONCURRENCY", "value: \"1\"", "autoDeploy: false", "mountPath: /var/data", "PILOT_DB_PATH", "/var/data/pilot.sqlite", "PILOT_UPLOAD_DIR", "/var/data/uploads", "PILOT_EXPORT_DIR", "/var/data/exports"]) assert.match(render, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((render.match(/^\s+- type: web$/gm) ?? []).length, 1);
  assert.doesNotMatch(render, /scaling:|numInstances:\s*[2-9]/);
});

test("M0D exact public origin validation and secret inventory fail closed", async () => {
  const base = { profile:"FIELD_CAPTURE_ALPHA", host:"0.0.0.0", allow_external_binding:true, db_path:"/var/data/pilot.sqlite", export_dir:"/var/data/exports", upload_dir:"/var/data/uploads" };
  for (const invalid of [undefined, "http://pilot.example.test", "https://pilot.example.test/path", "https://pilot.example.test/?q=x", "https://user:pass@pilot.example.test"]) assert.throws(() => validatePilotConfiguration({ ...base, public_base_url:invalid }), /PILOT_PUBLIC_BASE_URL|HTTPS|invalid public_base_url/);
  const valid = validatePilotConfiguration({ ...base, public_base_url:"https://pilot.example.test" });
  assert.equal(valid.secure_cookie, true);
  assert.equal(valid.profile, "FIELD_CAPTURE_ALPHA");
  const [environment, operations] = await Promise.all([readFile(new URL("../pilot-mobile.env.example", import.meta.url), "utf8"), readFile(new URL("../HTTPS_MOBILE_PILOT_OPERATIONS.md", import.meta.url), "utf8")]);
  assert.match(operations, /OPENAI_API_KEY.*\*\*SECRET\*\*/s);
  assert.match(operations, /GOOGLE_MAPS_BROWSER_KEY.*\*\*PUBLIC CONFIG\*\*/s);
  assert.match(operations, /https:\/\/<pilot-domain>\/\*/);
  assert.doesNotMatch(environment, /test-(?:spa|field)|AIza[0-9A-Za-z_-]{20,}|sk-[0-9A-Za-z_-]{20,}/);
});

test("M0D checklist keeps target evidence and deployment authorization unresolved", async () => {
  const checklist = JSON.parse(await readFile(new URL("../pre-deploy-pilot-checklist.json", import.meta.url), "utf8"));
  assert.equal(checklist.deployment_performed, false);
  assert.equal(checklist.real_field_validation, "NOT_RUN");
  assert.equal(checklist.gate, "HOLD_FOR_PRE_DEPLOY_FIXES");
  const byId = Object.fromEntries(checklist.items.map((item) => [item.id, item]));
  for (const id of ["M0B_SYNC","TARGET_HOST","PERSISTENT_DISK","HTTPS_BASE_URL","PROFILE","USERS","PASSWORDS","OPENAI","GOOGLE_KEY","GOOGLE_REFERRER","SQLITE_PATH","IMAGE_PATH","BASELINE_BACKUP","RESTORE","HEALTH","READINESS","COOKIE","ADMIN_ACCESS","FIELD_DENIAL","NO_REGISTRATION","SINGLE_INSTANCE","KILL_SWITCH","DEPLOY_AUTHORIZATION"]) assert.ok(byId[id], `missing ${id}`);
  assert.equal(byId.HTTPS_BASE_URL.status, "UNRESOLVED");
  assert.equal(byId.DEPLOY_AUTHORIZATION.status, "UNCHECKED");
  assert.equal(byId.BASELINE_BACKUP.status, "NOT_RUN_ON_TARGET");
});

test("M0D public health, readiness, session, and login failure remain confidential", async () => {
  const root = await mkdtemp(join(tmpdir(), "cpmoakb-m0d-public-"));
  const server = await startServer({ port:0, publicBaseUrl:"https://pilot.example.test", pilotProfile:"FIELD_CAPTURE_ALPHA", pilotUsers:users, googleMapsBrowserKey:"test-browser-key", dbPath:join(root,"pilot.sqlite"), exportDir:join(root,"exports"), uploadDir:join(root,"uploads"), investigationCandidateProvider:createEmptyCandidateProvider() });
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ["/health", "/readiness"]) {
      const response = await fetch(base + path), body = await response.text();
      assert.equal(response.status, 200);
      assert.doesNotMatch(body, /test-(?:spa|field)|test-browser-key|OPENAI_API_KEY|PILOT_USERS_JSON|pilot\.sqlite|\/uploads/);
    }
    const failed = await fetch(`${base}/api/pilot/session`, { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ login_id:"unknown", password:"wrong" }) });
    assert.equal(failed.status, 401);
    const failureBody = await failed.text();
    assert.doesNotMatch(failureBody, /unknown|wrong|FIELD|password|stack/i);
    const authenticated = await login(base, users[1]);
    assert.match(authenticated.setCookie, /Secure/);
    assert.match(authenticated.setCookie, /HttpOnly/);
    assert.match(authenticated.setCookie, /SameSite=Strict/);
  } finally {
    await new Promise((done) => server.close(done));
    await rm(root, { recursive:true, force:true, maxRetries:5, retryDelay:100 });
  }
});

test("M0D review, export, image, and registration boundaries are server-authoritative", async () => {
  const root = await mkdtemp(join(tmpdir(), "cpmoakb-m0d-auth-"));
  const server = await startServer({ port:0, publicBaseUrl:"https://pilot.example.test", pilotProfile:"FIELD_CAPTURE_ALPHA", pilotUsers:users, dbPath:join(root,"pilot.sqlite"), exportDir:join(root,"exports"), uploadDir:join(root,"uploads"), investigationCandidateProvider:createEmptyCandidateProvider() });
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const field = await login(base, users[1]), spa = await login(base, users[0]);
    assert.equal((await fetch(`${base}/api/pilot/admin/learning-review/dashboard`, { headers:{ cookie:field.cookie } })).status, 403);
    assert.equal((await fetch(`${base}/api/pilot/admin/learning-review/export?format=csv`, { headers:{ cookie:field.cookie } })).status, 403);
    assert.equal((await fetch(`${base}/api/pilot/admin/learning-review/dashboard`, { headers:{ cookie:spa.cookie } })).status, 200);
    assert.notEqual((await fetch(`${base}/api/pilot/visual-evidence?image_evidence_id=guessed`, { headers:{ cookie:field.cookie } })).status, 200);
    assert.notEqual((await fetch(`${base}/api/signup`, { method:"POST", headers:{ "content-type":"application/json" }, body:"{}" })).status, 201);
    assert.notEqual((await fetch(`${base}/api/pilot/users`, { method:"POST", headers:{ cookie:spa.cookie, "content-type":"application/json" }, body:"{}" })).status, 201);
  } finally {
    await new Promise((done) => server.close(done));
    await rm(root, { recursive:true, force:true, maxRetries:5, retryDelay:100 });
  }
});

test("M0D runbook covers safe operation, rotation, backup, restore, and data-preserving emergency stop", async () => {
  const operations = await readFile(new URL("../HTTPS_MOBILE_PILOT_OPERATIONS.md", import.meta.url), "utf8");
  for (const expected of ["Operator runbook", "GET /health", "GET /readiness", "correlation IDs", "rotate a pilot password", "rotate `OPENAI_API_KEY`", "rotate `GOOGLE_MAPS_BROWSER_KEY`", "verified backup", "isolated restore", "emergency stop", "enabled:false", "Do not delete the disk or database", "no public signup", "Pilot Data is not Canonical Knowledge"]) assert.match(operations, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
});
