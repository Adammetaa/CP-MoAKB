import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { pages, root } from "./verify-prototype.mjs";

const flatten = (value, prefix = "", output = new Map()) => {
  for (const [key, child] of Object.entries(value)) {
    if (!prefix && key === "_meta") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof child === "string") output.set(path, child);
    else flatten(child, path, output);
  }
  return output;
};

const thai = JSON.parse(await readFile(resolve(root, "assets", "i18n", "th.json"), "utf8"));
const english = JSON.parse(await readFile(resolve(root, "assets", "i18n", "en.json"), "utf8"));
const thaiKeys = flatten(thai);
const englishKeys = flatten(english);
const failures = [];

if (thai._meta?.locale !== "th" || english._meta?.locale !== "en") failures.push("catalog locale metadata is invalid");
if (JSON.stringify([...thaiKeys.keys()].sort()) !== JSON.stringify([...englishKeys.keys()].sort())) failures.push("Thai and English catalog structures differ");
for (const [key, value] of thaiKeys) if (!value.trim()) failures.push(`empty Thai translation: ${key}`);
for (const [key, value] of englishKeys) if (!value.trim()) failures.push(`empty English translation: ${key}`);

for (const page of pages) {
  const text = await readFile(resolve(root, page), "utf8");
  if (!text.includes('<html lang="th">')) failures.push(`${page}: Thai is not default`);
  if (!text.includes('data-language="th"') || !text.includes('data-language="en"')) failures.push(`${page}: language switch missing`);
  if (!text.includes("การนำทางหลัก")) failures.push(`${page}: localized navigation label missing`);
  for (const match of text.matchAll(/data-i18n="([^"]+)"/g)) {
    if (!thaiKeys.has(match[1]) || !englishKeys.has(match[1])) failures.push(`${page}: incomplete translation key ${match[1]}`);
  }
  for (const match of text.matchAll(/>([^<>]+)</g)) {
    const visible = match[1].trim();
    if (/^[a-z0-9_-]+(?:\.[a-z0-9_.-]+)+$/i.test(visible)) failures.push(`${page}: raw translation key visible: ${visible}`);
  }
}

if (failures.length) throw new Error(`Knowledge Lab localization verification failed:\n${failures.join("\n")}`);
console.log(`Knowledge Lab localization verified: ${thaiKeys.size} paired keys across ${pages.length} pages`);
