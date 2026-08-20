import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { handleLoginInteraction, readLoginCredentials } from "../assets/login-interactions.js";

const styles = await readFile(new URL("../assets/field-shell.css", import.meta.url), "utf8");
const app = await readFile(new URL("../assets/field-app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

function ruleFor(selectorFragment) {
  const escaped = selectorFragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1] ?? "";
}

function loginHarness() {
  const username = { value: "SPA1" };
  const password = {
    value: "1234", type: "password", selectionStart: 2, selectionEnd: 4, focused: false,
    focus() { this.focused = true; },
    setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; },
  };
  const attributes = new Map([["aria-pressed", "false"], ["aria-label", "แสดงรหัสผ่าน"]]);
  const button = { setAttribute(name, value) { attributes.set(name, value); } };
  const root = { contains: (node) => node === button, querySelector: (selector) => selector === "#username" ? username : selector === "#password" ? password : null };
  const event = { target: { closest: () => button }, defaultPrevented: false, propagationStopped: false, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.propagationStopped = true; } };
  return { username, password, button, attributes, root, event };
}

test("decorative login layers cannot intercept pointer or touch input", () => {
  assert.match(ruleFor(".login-view::before,.login-view::after"), /pointer-events\s*:\s*none/);
  assert.match(ruleFor(".input-with-icon > span"), /pointer-events\s*:\s*none/);
  assert.match(ruleFor(".login-shell"), /z-index\s*:\s*1/);
});

test("eye interaction preserves DOM identity, values, focus, and caret across both toggles", () => {
  const h = loginHarness();
  const usernameNode = h.root.querySelector("#username");
  const passwordNode = h.root.querySelector("#password");

  assert.equal(handleLoginInteraction(h.event, h.root), true);
  assert.strictEqual(h.root.querySelector("#username"), usernameNode);
  assert.strictEqual(h.root.querySelector("#password"), passwordNode);
  assert.equal(h.username.value, "SPA1");
  assert.equal(h.password.value, "1234");
  assert.equal(h.password.type, "text");
  assert.equal(h.password.focused, true);
  assert.deepEqual([h.password.selectionStart, h.password.selectionEnd], [2, 4]);
  assert.equal(h.attributes.get("aria-pressed"), "true");
  assert.equal(h.attributes.get("aria-label"), "ซ่อนรหัสผ่าน");
  assert.equal(h.event.defaultPrevented, true);
  assert.equal(h.event.propagationStopped, true);

  h.password.focused = false;
  assert.equal(handleLoginInteraction(h.event, h.root), true);
  assert.strictEqual(h.root.querySelector("#password"), passwordNode);
  assert.equal(h.password.value, "1234");
  assert.equal(h.password.type, "password");
  assert.equal(h.password.focused, true);
  assert.equal(h.attributes.get("aria-pressed"), "false");
  assert.equal(h.attributes.get("aria-label"), "แสดงรหัสผ่าน");
});

test("login submit reads the current form values without persisting the password", () => {
  const controls = new Map([["username", { value: "SPA1" }], ["password", { value: "1234" }]]);
  const form = { elements: { namedItem: (name) => controls.get(name) ?? null } };
  assert.deepEqual(readLoginCredentials(form), { username: "SPA1", password: "1234" });
  assert.doesNotMatch(app, /localStorage[^\n]*(?:password|credentials)|(?:password|credentials)[^\n]*localStorage/i);
});

test("new and legacy runtimes have isolated bootstrap ownership", () => {
  assert.doesNotMatch(html, /<script\s+src="assets\/app\.js/);
  assert.match(html, /field-app\.js\?v=hotfix-3/);
  assert.match(app, /FIELD_RUNTIME_KEY/);
  assert.match(app, /location\.hash === "#legacy"/);
  assert.match(app, /script\.dataset\.legacyRuntime = "true"/);
  assert.match(app, /handleLoginInteraction\(event, root\)/);
  const loginClickBranch = app.match(/root\.addEventListener\("click"[\s\S]*?root\.addEventListener\("change"/)?.[0] ?? "";
  assert.doesNotMatch(loginClickBranch, /action === "toggle-password"[\s\S]*render(?:Login)?\(/);
});
