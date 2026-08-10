import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(import.meta.dirname, "..");
const pages = ["index.html", "search.html", "browse.html", "concept.html", "evidence.html", "source.html", "authority.html", "governance.html", "about.html", "components.html"];
const requiredNavigation = new Map([
  ["index.html", "หน้าแรก"],
  ["search.html", "ค้นหา"],
  ["browse.html", "เรียกดู"],
  ["governance.html", "ธรรมาภิบาลองค์ความรู้"],
  ["about.html", "เกี่ยวกับโครงการ"],
]);
const protectedIdentifiers = ["IRAC", "FRAC", "HRAC", "BBCH", "Scientific name", "Taxonomy", "Ontology", "Lifecycle"];

const detectDuplicateKeys = (text, label) => {
  let index = 0;
  const whitespace = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  const string = () => {
    const start = index;
    index += 1;
    while (index < text.length) {
      if (text[index] === "\\") index += 2;
      else if (text[index++] === '"') return JSON.parse(text.slice(start, index));
    }
    throw new Error(`${label}: unterminated JSON string`);
  };
  const value = (path = "$") => {
    whitespace();
    if (text[index] === "{") return object(path);
    if (text[index] === "[") return array(path);
    if (text[index] === '"') { string(); return; }
    const match = text.slice(index).match(/^(?:-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/);
    if (!match) throw new Error(`${label}: invalid JSON at character ${index}`);
    index += match[0].length;
  };
  const object = (path) => {
    index += 1;
    whitespace();
    const keys = new Set();
    if (text[index] === "}") { index += 1; return; }
    while (index < text.length) {
      whitespace();
      if (text[index] !== '"') throw new Error(`${label}: expected object key at character ${index}`);
      const key = string();
      if (keys.has(key)) throw new Error(`${label}: duplicate key ${path}.${key}`);
      keys.add(key);
      whitespace();
      if (text[index++] !== ":") throw new Error(`${label}: expected colon after ${path}.${key}`);
      value(`${path}.${key}`);
      whitespace();
      if (text[index] === "}") { index += 1; return; }
      if (text[index++] !== ",") throw new Error(`${label}: expected comma in ${path}`);
    }
  };
  const array = (path) => {
    index += 1;
    whitespace();
    if (text[index] === "]") { index += 1; return; }
    let item = 0;
    while (index < text.length) {
      value(`${path}[${item++}]`);
      whitespace();
      if (text[index] === "]") { index += 1; return; }
      if (text[index++] !== ",") throw new Error(`${label}: expected comma in ${path}`);
    }
  };
  value();
  whitespace();
  if (index !== text.length) throw new Error(`${label}: trailing JSON content`);
};

const readCatalog = async (locale) => {
  const text = await readFile(resolve(root, "assets", "i18n", `${locale}.json`), "utf8");
  detectDuplicateKeys(text, `${locale}.json`);
  return JSON.parse(text);
};

const flatten = (value, prefix = "", output = new Map()) => {
  for (const [key, child] of Object.entries(value)) {
    if (!prefix && key === "_meta") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof child === "string") output.set(path, child);
    else flatten(child, path, output);
  }
  return output;
};

const visibleLiteralAllowed = (text) => {
  const value = text.replace(/\s+/g, " ").trim();
  if (!value || !/[A-Za-z\u0E00-\u0E7F]/.test(value)) return true;
  // Narrow literals are immutable identifiers, icon glyphs, repository authority
  // abbreviations, integrity values, or code-like specimen text—not translatable UI.
  return /^(?:CP|CP-MoAKB|Knowledge Explorer|[ES]|IRAC|FRAC|HRAC|BBCH|KAS|KGS|ADR|RAS|Constitution|E-\d{3}|Evidence record E-\d{3}|mock-[a-z0-9-]+|sha256: [a-z0-9-]+|[A-Z]+-\d{3}|[0-9a-f]{7,64}|prototype-[\d.]+|IRAC · FRAC · HRAC · BBCH|Scientific name · IRAC · FRAC · HRAC · BBCH · sha256 · prototype-0\.1)$/.test(value);
};

const findUnkeyedVisibleText = (html) => {
  const failures = [];
  const stack = [];
  const tokens = html.replace(/<!--[\s\S]*?-->/g, "").match(/<[^>]+>|[^<]+/g) ?? [];
  for (const token of tokens) {
    if (token.startsWith("</")) { stack.pop(); continue; }
    if (token.startsWith("<")) {
      const name = token.match(/^<\s*([A-Za-z0-9-]+)/)?.[1]?.toLowerCase();
      if (!name || token.startsWith("<!")) continue;
      const keyed = /\bdata-i18n(?:=|-placeholder=|-aria-label=)/.test(token)
        || /\bdata-(?:concept-title|concept-definition|relationships|evidence-title|source-title|authority-title|stats|latest-concepts|latest-sources|results|result-count|site-header|site-footer)\b/.test(token)
        || name === "title" || name === "script" || name === "style";
      if (!/\/\s*>$/.test(token) && !["meta", "link", "img", "input", "br", "hr"].includes(name)) stack.push({ keyed });
      continue;
    }
    if (!stack.some((entry) => entry.keyed) && !visibleLiteralAllowed(token)) failures.push(token.replace(/\s+/g, " ").trim());
  }
  return failures;
};

const contentForAttribute = (html, attribute) => {
  const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<([a-z0-9]+)[^>]*\\b${escaped}(?:="[^"]*")?[^>]*>([\\s\\S]*?)<\\/\\1>`, "i"))?.[2]?.trim() ?? "";
};

export const verifyLocalization = async () => {
  const thaiCatalog = await readCatalog("th");
  const englishCatalog = await readCatalog("en");
  const thai = flatten(thaiCatalog);
  const english = flatten(englishCatalog);
  const failures = [];
  const usedKeys = new Set();

  if (thaiCatalog._meta?.schema_version !== 1 || englishCatalog._meta?.schema_version !== 1) failures.push("Catalog schema_version must be 1");
  if (thaiCatalog._meta?.locale !== "th" || englishCatalog._meta?.locale !== "en") failures.push("Catalog locale metadata is invalid");
  if (JSON.stringify([...thai.keys()].sort()) !== JSON.stringify([...english.keys()].sort())) failures.push("Thai and English translation key structures differ");
  for (const [key, value] of thai) if (!value.trim()) failures.push(`Empty Thai translation: ${key}`);
  for (const [key, value] of english) if (!value.trim()) failures.push(`Empty English translation: ${key}`);

  for (const page of pages) {
    const html = await readFile(resolve(root, page), "utf8");
    if (!html.includes('<html lang="th">')) failures.push(`${page}: Thai is not the initial document language`);
    if (!html.includes('content="noindex,nofollow"')) failures.push(`${page}: indexing boundary missing`);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
    if (!/[\u0E00-\u0E7F]/.test(title) || !/[\u0E00-\u0E7F]/.test(description)) failures.push(`${page}: Thai-first metadata missing`);
    if (!html.includes('data-i18n="prototype.notice"')) failures.push(`${page}: localized prototype notice missing`);
    const header = contentForAttribute(html, "data-site-header");
    if (!header) failures.push(`${page}: static site header is empty`);
    if (!/[\u0E00-\u0E7F]/.test(header)) failures.push(`${page}: static site header is not Thai-first`);
    for (const [href, label] of requiredNavigation) {
      if (!header.includes(`href="${href}"`) || !header.includes(label)) failures.push(`${page}: static navigation is missing ${label} (${href})`);
    }
    if (requiredNavigation.has(page) && !new RegExp(`<a[^>]*href="${page}"[^>]*aria-current="page"`).test(header)) failures.push(`${page}: static current-page navigation semantics missing`);
    const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
    if (!/[\u0E00-\u0E7F]/.test(heading)) failures.push(`${page}: nonempty Thai main heading missing`);
    for (const match of html.matchAll(/>([^<>]+)</g)) {
      const visible = match[1].trim();
      if (/^[a-z0-9_-]+(?:\.[a-z0-9_.-]+)+$/i.test(visible) && !visibleLiteralAllowed(visible)) failures.push(`${page}: raw translation key is visible: ${visible}`);
    }
    for (const match of html.matchAll(/data-i18n(?:-placeholder|-aria-label)?="([^"]+)"/g)) {
      usedKeys.add(match[1]);
      if (!thai.has(match[1]) || !english.has(match[1])) failures.push(`${page}: incomplete translation key ${match[1]}`);
    }
    for (const match of html.matchAll(/<[^>]+aria-label="[^"]+"[^>]*>/g)) {
      if (!/data-i18n-aria-label="[^"]+"/.test(match[0])) failures.push(`${page}: visible ARIA label is not localized`);
    }
    const localizedUi = html.replace(/<section class="section real-entry-section">[\s\S]*?<\/section>/g, "");
    for (const literal of findUnkeyedVisibleText(localizedUi)) failures.push(`${page}: unkeyed visible UI text: ${literal}`);
  }

  for (const [page, attributes] of new Map([
    ["index.html", ["data-stats", "data-latest-concepts", "data-latest-sources"]],
    ["search.html", ["data-results"]],
    ["concept.html", ["data-relationships"]],
  ])) {
    const html = await readFile(resolve(root, page), "utf8");
    for (const attribute of attributes) if (!contentForAttribute(html, attribute)) failures.push(`${page}: static fallback ${attribute} is empty`);
  }

  const landing = await readFile(resolve(root, "deployment", "root-index.html"), "utf8");
  if (!landing.includes('<html lang="th">')) failures.push("root landing: Thai document language missing");
  if (!/[\u0E00-\u0E7F]/.test(landing.match(/<title>(.*?)<\/title>/s)?.[1] ?? "") || !/[\u0E00-\u0E7F]/.test(landing.match(/<h1>(.*?)<\/h1>/s)?.[1] ?? "")) failures.push("root landing: Thai-first title or heading missing");
  for (const requirement of ['href="sp-assistant/"', 'href="knowledge-explorer/"', 'href="knowledge-lab/"', 'href="https://github.com/Adammetaa/CP-MoAKB"', "SP Assistant", "ไม่มีการอัปโหลดหรือจัดเก็บรูป", "ไม่มีระบบหลังบ้าน", "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ"]) {
    if (!landing.includes(requirement)) failures.push(`root landing: missing ${requirement}`);
  }
  if (/<script\b|http-equiv\s*=\s*["']refresh|(?:window\.)?location\s*=/i.test(landing)) failures.push("root landing: automatic redirect or JavaScript found");
  if (/[A-Z]:\\|file:\/\/|\/(?:home|Users)\//i.test(landing)) failures.push("root landing: local filesystem path found");

  const policy = await readFile(resolve(root, "docs", "localization-policy.md"), "utf8");
  for (const requirement of ["assets/og.png", "English CP-MoAKB", "does not make the interface English-first", "not authoritative terminology", "does not override Thai-first HTML", "separate product approval"]) {
    if (!policy.includes(requirement)) failures.push(`localization policy: missing social-preview rule: ${requirement}`);
  }

  const app = await readFile(resolve(root, "assets", "app.js"), "utf8");
  for (const match of app.matchAll(/["`]([A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+)["`]/g)) {
    if (thai.has(match[1])) usedKeys.add(match[1]);
  }
  for (const page of pages.map((name) => name.replace("index.html", "home").replace(".html", ""))) {
    usedKeys.add(`meta.${page}.title`);
    usedKeys.add(`meta.${page}.description`);
  }
  for (const type of ["concept", "evidence", "source"]) usedKeys.add(`data.${type}`);
  usedKeys.add("meta.riceDiseaseWave1.title");
  usedKeys.add("meta.riceDiseaseWave1.description");
  usedKeys.add("meta.riceDiseaseCorpus.title");
  usedKeys.add("meta.riceDiseaseCorpus.description");
  usedKeys.add("meta.riceInsectCorpus.title");
  usedKeys.add("meta.riceInsectCorpus.description");
  for (const key of thai.keys()) if (!usedKeys.has(key)) failures.push(`Orphan translation key: ${key}`);

  const mockText = await readFile(resolve(root, "assets", "data", "mock-knowledge.json"), "utf8");
  detectDuplicateKeys(mockText, "mock-knowledge.json");
  const mock = JSON.parse(mockText);
  for (const group of ["concepts", "evidence", "sources", "authorities"]) {
    for (const record of mock[group]) if (record.status !== "fictional-placeholder") failures.push(`${group}/${record.id}: fictional-placeholder status missing`);
  }
  if (mock.meta.status !== "fictional-placeholder") failures.push("Mock dataset status changed");
  if (mock.concepts[0].scientificName !== "Placeholder scientific name — not asserted") failures.push("Scientific-name placeholder changed");
  if (mock.evidence[0].id !== "E-001" || mock.meta.version !== "prototype-0.2") failures.push("Protected record identifier or version changed");
  for (const identifier of ["IRAC", "FRAC", "HRAC", "BBCH"]) if (!mock.domains.includes(identifier)) failures.push(`Standard identifier changed or missing: ${identifier}`);
  for (const [key, value] of english) {
    for (const identifier of protectedIdentifiers) {
      if (value.includes(identifier) && !thai.get(key)?.includes(identifier)) failures.push(`${key}: protected identifier ${identifier} was not preserved`);
    }
  }

  const styles = await readFile(resolve(root, "assets", "styles.css"), "utf8");
  if (/https?:\/\//.test(styles) || /@import/i.test(styles)) failures.push("External font or stylesheet dependency found");
  if (!styles.includes("min-height: 44px")) failures.push("44px touch target rule missing");
  if (!styles.includes("prefers-reduced-motion")) failures.push("Reduced-motion support missing");
  if (failures.length) throw new Error(`Localization verification failed:\n${failures.join("\n")}`);
  return { pages: pages.length, keys: thai.size };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await verifyLocalization();
  console.log(`Localization verified: ${result.pages} pages, ${result.keys} complete, used keys in Thai and English`);
}
