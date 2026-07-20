import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist", "knowledge-explorer");
const pages = [
  "index.html",
  "search.html",
  "browse.html",
  "concept.html",
  "evidence.html",
  "source.html",
  "authority.html",
  "governance.html",
  "about.html",
  "components.html",
];

const failures = [];
for (const page of pages) {
  const text = await readFile(resolve(root, page), "utf8");
  for (const requirement of [
    "<main",
    "data-page=",
    "Prototype · fictional placeholder content",
    "assets/styles.css",
    "assets/app.js",
  ]) {
    if (!text.includes(requirement)) failures.push(`${page}: missing ${requirement}`);
  }
  for (const link of text.matchAll(/href="([^"]+\.html(?:#[^"]*)?)"/g)) {
    const target = link[1].split("#")[0];
    if (!pages.includes(target)) failures.push(`${page}: unknown page link ${target}`);
  }
}

const dataText = await readFile(resolve(root, "assets", "data", "mock-knowledge.json"), "utf8");
const data = JSON.parse(dataText);
if (data.meta?.status !== "fictional-placeholder") {
  failures.push("mock dataset must declare fictional-placeholder status");
}
if (!data.meta?.disclaimer?.includes("not agricultural knowledge")) {
  failures.push("mock dataset disclaimer is missing");
}
if (failures.length) {
  throw new Error(`Prototype validation failed:\n${failures.join("\n")}`);
}

await rm(resolve(root, "dist"), { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const page of pages) await cp(resolve(root, page), resolve(output, page));
await cp(resolve(root, "assets"), resolve(output, "assets"), { recursive: true });

console.log(`Knowledge Explorer prototype built: ${pages.length} pages`);
console.log("Boundary verified: fictional placeholder content; no backend or Runtime");
