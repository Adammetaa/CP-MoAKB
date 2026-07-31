import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
globalThis.__EXPLORER_TEST__ = true;
await import("../assets/app.js");

const behavior = globalThis.__explorerLocalization;
assert.ok(behavior, "application localization behavior is not exposed to the harness");

const readJson = async (...parts) => JSON.parse(
  await readFile(resolve(root, ...parts), "utf8"),
);
const catalogs = {
  th: await readJson("assets", "i18n", "th.json"),
  en: await readJson("assets", "i18n", "en.json"),
};
const knowledge = await readJson("assets", "data", "mock-knowledge.json");

const storageState = new Map();
const storage = {
  getItem: (key) => storageState.get(key) ?? null,
  setItem: (key, value) => storageState.set(key, value),
};
const unavailableStorage = {
  getItem: () => { throw new Error("storage unavailable"); },
  setItem: () => { throw new Error("storage unavailable"); },
};

assert.equal(behavior.readLanguagePreference(storage), "th", "Thai must be the deterministic default");
assert.equal(behavior.writeLanguagePreference(storage, "en"), true);
assert.equal(behavior.readLanguagePreference(storage), "en", "English must persist across reload state");
assert.equal(behavior.readLanguagePreference(null), "th");
assert.equal(behavior.readLanguagePreference(unavailableStorage), "th");
assert.equal(behavior.writeLanguagePreference(unavailableStorage, "en"), false);

const rootElement = { lang: "" };
behavior.applyDocumentLanguage(rootElement, "en");
assert.equal(rootElement.lang, "en");
behavior.applyDocumentLanguage(rootElement, "unsupported");
assert.equal(rootElement.lang, "th");
assert.deepEqual(behavior.languageToggleState("th"), { th: true, en: false });
assert.deepEqual(behavior.languageToggleState("en"), { th: false, en: true });

const thaiQuery = knowledge.concepts[0].title.th.split(" ")[0];
assert.ok(behavior.searchKnowledge(knowledge, thaiQuery).length > 0, "Thai search must find shared records");
assert.ok(behavior.searchKnowledge(knowledge, "placeholder concept").length > 0, "English search must find shared records");
assert.equal(behavior.searchKnowledge(knowledge, "no-such-fictional-record").length, 0);
assert.ok(behavior.localizedResultCount(catalogs, "th", 2).includes("2"));
assert.ok(behavior.localizedResultCount(catalogs, "en", 2).includes("2"));
assert.equal(behavior.translateCatalog(catalogs, "th", "search.empty"), catalogs.th.search.empty);
assert.equal(behavior.translateCatalog(catalogs, "en", "search.empty"), catalogs.en.search.empty);
assert.equal(behavior.translateCatalog(catalogs, "th", "prototype.notice"), catalogs.th.prototype.notice);
assert.equal(behavior.translateCatalog(catalogs, "en", "prototype.notice"), catalogs.en.prototype.notice);
assert.equal(behavior.translateCatalog(catalogs, "th", "language.label"), catalogs.th.language.label);
assert.equal(behavior.translateCatalog(catalogs, "en", "nav.primaryLabel"), catalogs.en.nav.primaryLabel);
assert.throws(
  () => behavior.translateCatalog(catalogs, "th", "missing.behavior.key"),
  /Missing th translation key/,
);

for (const identifier of ["IRAC", "FRAC", "HRAC", "BBCH"]) {
  assert.ok(knowledge.domains.includes(identifier), `${identifier} must remain unchanged`);
}
assert.equal(knowledge.concepts[0].scientificName, "Placeholder scientific name — not asserted");
assert.equal(knowledge.evidence[0].id, "E-001");
assert.equal(knowledge.meta.version, "prototype-0.2");

console.log("Localization behavior verified: Thai default, persistence, fallback, bilingual search, UI states, and protected identifiers");
