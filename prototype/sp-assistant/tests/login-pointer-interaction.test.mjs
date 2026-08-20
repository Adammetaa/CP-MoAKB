import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const styles = await readFile(new URL("../assets/field-shell.css", import.meta.url), "utf8");
const app = await readFile(new URL("../assets/field-app.js", import.meta.url), "utf8");

function ruleFor(selectorFragment) {
  const escaped = selectorFragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1] ?? "";
}

test("decorative login layers cannot intercept pointer or touch input", () => {
  const backgroundRule = ruleFor(".login-view::before,.login-view::after");
  const iconRule = ruleFor(".input-with-icon > span");
  assert.match(backgroundRule, /pointer-events\s*:\s*none/);
  assert.match(iconRule, /pointer-events\s*:\s*none/);
  assert.match(ruleFor(".login-shell"), /z-index\s*:\s*1/);
});

test("login controls remain enabled, focusable, and preserve password toggle behavior", () => {
  const loginMarkup = app.match(/function renderLogin\(\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(loginMarkup, /<input id="username"[^>]*required>/);
  assert.match(loginMarkup, /<input id="password"[^>]*type="password"[^>]*required>/);
  assert.doesNotMatch(loginMarkup, /<input id="(?:username|password)"[^>]*disabled/);
  assert.match(loginMarkup, /data-action="toggle-password"/);
  assert.match(app, /action === "toggle-password"[\s\S]*input\.type = input\.type === "password" \? "text" : "password"/);
  assert.doesNotMatch(ruleFor(".login-card input,.form-grid input,.form-grid select,.override-stage select"), /pointer-events\s*:\s*none/);
});
