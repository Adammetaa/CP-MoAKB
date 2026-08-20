import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { WorkspaceRepository } from "../assets/field-services.js";
import { DEFAULT_PROTOTYPE_USER, loginToPrototypeWorkspace, resolvePrototypeAccess } from "../assets/prototype-login.js";
import { findOwnedRouteTarget } from "../assets/route-interactions.js";
import { MemoryStorage } from "./support.mjs";

const styles = await readFile(new URL("../assets/field-shell.css", import.meta.url), "utf8");
const app = await readFile(new URL("../assets/field-app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const legacyHtml = await readFile(new URL("../legacy.html", import.meta.url), "utf8");
const loginRender = app.match(/function renderLogin\(\)[\s\S]*?function renderGps\(\)/)?.[0] ?? "";

test("login UI contains only password and submit controls", () => {
  assert.match(loginRender, /data-login-form/);
  assert.match(loginRender, /<input id="password" name="password" type="password"/);
  assert.match(loginRender, /เข้าสู่ระบบ/);
  assert.match(loginRender, /สำหรับทดสอบภายใน/);
  assert.equal((loginRender.match(/<input\b/g) ?? []).length, 1);
  assert.equal((loginRender.match(/<button\b/g) ?? []).length, 1);
  assert.doesNotMatch(loginRender, /username|ชื่อผู้ใช้|SPA1|CA1|AG1/);
  assert.doesNotMatch(loginRender, /toggle-password|aria-pressed|forgot-password|ลืมรหัสผ่าน/);
  assert.doesNotMatch(loginRender, /data-route|href=/);
});

test("decorative login layers cannot intercept the password control", () => {
  assert.match(styles, /\.login-view::before,\.login-view::after[^}]*pointer-events:none/);
  assert.match(styles, /\.input-with-icon > span[^}]*pointer-events:none/);
  assert.match(styles, /\.login-shell[^}]*z-index:1/);
});

test("empty and incorrect passwords are rejected without creating a user", () => {
  const repository = new WorkspaceRepository(new MemoryStorage());
  assert.throws(() => loginToPrototypeWorkspace(repository, ""), { message: "กรุณากรอกรหัสผ่าน" });
  assert.throws(() => loginToPrototypeWorkspace(repository, "wrong"), { message: "รหัสผ่านไม่ถูกต้อง" });
  assert.deepEqual(repository.load().users, []);
  assert.equal(repository.load().active_user_id, null);
});

test("password 1234 creates the stable default user and routes to GPS", () => {
  const repository = new WorkspaceRepository(new MemoryStorage());
  const now = new Date("2026-08-20T08:00:00Z");
  const result = loginToPrototypeWorkspace(repository, "1234", now, { randomUUID: () => "fixed-session" });
  assert.deepEqual(DEFAULT_PROTOTYPE_USER, {
    user_id: "prototype-spa-001",
    username: "SPA1",
    display_name: "ผู้ใช้งานทดสอบ",
    role: "SPA",
  });
  assert.equal(result.nextRoute, "gps");
  assert.equal(result.user.session.session_id, "session_fixed-session");
  const state = repository.load();
  assert.equal(state.active_user_id, "prototype-spa-001");
  assert.equal(state.users.length, 1);
  assert.equal(state.users[0].user_id, "prototype-spa-001");
  assert.equal(state.users[0].role, "SPA");
});

test("raw password never enters repository state or the resolved user", () => {
  const repository = new WorkspaceRepository(new MemoryStorage());
  const user = resolvePrototypeAccess("1234", new Date("2026-08-20T08:00:00Z"), { randomUUID: () => "privacy" });
  assert.equal(Object.hasOwn(user, "password"), false);
  loginToPrototypeWorkspace(repository, "1234", new Date("2026-08-20T08:00:00Z"), { randomUUID: () => "privacy" });
  const serialized = JSON.stringify(repository.load());
  assert.doesNotMatch(serialized, /1234|password|credential/i);
  assert.doesNotMatch(app, /localStorage[^\n]*(?:password|credential)|(?:password|credential)[^\n]*localStorage/i);
});

test("field runtime uses only the fixed-password login transition", () => {
  assert.match(app, /loginToPrototypeWorkspace\(repository, password\)/);
  assert.match(app, /route = result\.nextRoute; render\(\); requestGps\(\)/);
  assert.match(app, /elements\.namedItem\("password"\)/);
  assert.doesNotMatch(app, /resolveMockUser|login-interactions|toggle-password|forgot-password/);
});

test("password pointer interactions do not resolve the body as a route or replace the input", () => {
  const body = { dataset: { route: "login" } };
  let passwordInput = {
    value: "1234",
    closest(selector) { return selector === "[data-route]" ? body : null; },
  };
  const originalInput = passwordInput;
  const root = { contains: (node) => node !== body };
  let renderCount = 0;

  for (const eventType of ["click", "mouseup"]) {
    const routeTarget = findOwnedRouteTarget(passwordInput, root);
    if (routeTarget) {
      renderCount += 1;
      passwordInput = { value: "", closest: passwordInput.closest };
    }
    assert.equal(passwordInput.value, "1234", `${eventType} must preserve the typed password`);
  }

  assert.strictEqual(passwordInput, originalInput);
  assert.equal(renderCount, 0);
  assert.equal(findOwnedRouteTarget(passwordInput, root), null);
});

test("body is diagnostic-only while data-route controls inside field-app still navigate", () => {
  const body = { dataset: { currentRoute: "login" } };
  const routeButton = { dataset: { route: "home" } };
  routeButton.closest = (selector) => selector === "[data-route]" ? routeButton : null;
  const root = { contains: (node) => node === routeButton };

  assert.equal(Object.hasOwn(body.dataset, "route"), false);
  assert.strictEqual(findOwnedRouteTarget(routeButton, root), routeButton);
  assert.match(app, /document\.body\.dataset\.currentRoute = route/);
  assert.doesNotMatch(app, /document\.body\.dataset\.route = route/);
});

test("native Enter and submit button paths converge on the login submit handler", () => {
  assert.match(loginRender, /<form class="login-card" data-login-form novalidate>/);
  assert.match(loginRender, /<button class="primary-action" type="submit">เข้าสู่ระบบ<\/button>/);
  assert.match(app, /root\.addEventListener\("submit", async \(event\) =>/);
  assert.match(app, /event\.target\.matches\("\[data-login-form\]"\)/);
  assert.doesNotMatch(loginRender, /onclick|onkeydown|onkeyup/);
  assert.doesNotMatch(app, /addEventListener\("keydown"/);
});

test("normal and legacy documents remain runtime-isolated", () => {
  assert.match(html, /id="field-app"/);
  assert.doesNotMatch(html, /class="workspace"|class="conversation chat-shell"|assets\/styles\.css|assets\/app\.js/);
  assert.match(html, /field-shell\.css\?v=knowledge-pilot-1/);
  assert.match(html, /field-app\.js\?v=knowledge-pilot-1/);
  assert.doesNotMatch(legacyHtml, /id="field-app"|field-shell\.css|field-app\.js/);
  assert.match(legacyHtml, /class="workspace"/);
  assert.match(legacyHtml, /assets\/app\.js\?v=legacy-isolated-1/);
});
