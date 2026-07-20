import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { verifyArtifact } from "./verify-pages-artifact.mjs";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist", "pages-root");
const explorerOutput = resolve(output, "knowledge-explorer");
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

const commit = process.env.DEPLOY_COMMIT ?? "";
const buildTimestamp = process.env.BUILD_TIMESTAMP ?? "";
const packageVersion = process.env.PACKAGE_VERSION ?? "";
const failures = [];

if (!/^[0-9a-f]{40}$/.test(commit)) failures.push("DEPLOY_COMMIT must be an exact 40-character Git commit SHA");
if (Number.isNaN(Date.parse(buildTimestamp))) failures.push("BUILD_TIMESTAMP must be a valid ISO timestamp");
if (packageVersion !== "0.1.0") failures.push("PACKAGE_VERSION must match governed package version 0.1.0");

for (const page of pages) {
  const text = await readFile(resolve(root, page), "utf8");
  for (const requirement of [
    "<main",
    "data-page=",
    "Prototype · fictional placeholder content",
    '<meta name="robots" content="noindex,nofollow">',
    "assets/styles.css",
    "assets/app.js",
  ]) {
    if (!text.includes(requirement)) failures.push(`${page}: missing ${requirement}`);
  }
  for (const link of text.matchAll(/href="([^"]+)"/g)) {
    const target = link[1];
    if (target.startsWith("https://")) continue;
    if (target.startsWith("http://") || target.startsWith("/") || target.includes("..")) {
      failures.push(`${page}: non-portable or escaping link ${target}`);
      continue;
    }
    const localTarget = target.split("#")[0].split("?")[0];
    if (localTarget.endsWith(".html") && !pages.includes(localTarget)) {
      failures.push(`${page}: unknown page link ${localTarget}`);
    }
  }
}

const appText = await readFile(resolve(root, "assets", "app.js"), "utf8");
for (const prohibited of ["localStorage", "sessionStorage", "WebSocket", "EventSource", "document.cookie", "analytics"]) {
  if (appText.includes(prohibited)) failures.push(`app.js contains prohibited capability: ${prohibited}`);
}
for (const request of appText.matchAll(/fetch\("([^"]+)"\)/g)) {
  if (!["assets/data/mock-knowledge.json", "deployment.json"].includes(request[1])) {
    failures.push(`app.js fetches an unapproved resource: ${request[1]}`);
  }
}

const dataText = await readFile(resolve(root, "assets", "data", "mock-knowledge.json"), "utf8");
const data = JSON.parse(dataText);
if (data.meta?.status !== "fictional-placeholder") failures.push("mock dataset must declare fictional-placeholder status");
if (!data.meta?.disclaimer?.includes("not agricultural knowledge")) failures.push("mock dataset disclaimer is missing");
if (failures.length) throw new Error(`Prototype validation failed:\n${failures.join("\n")}`);

await rm(resolve(root, "dist"), { recursive: true, force: true });
await mkdir(explorerOutput, { recursive: true });
await cp(resolve(root, "deployment", "root-index.html"), resolve(output, "index.html"));
await cp(resolve(root, "deployment", "robots.txt"), resolve(output, "robots.txt"));
for (const page of pages) await cp(resolve(root, page), resolve(explorerOutput, page));
await cp(resolve(root, "assets"), resolve(explorerOutput, "assets"), { recursive: true });
await writeFile(
  resolve(explorerOutput, "deployment.json"),
  `${JSON.stringify({ deployment_mode: "preview", prototype: "knowledge-explorer", commit, build_timestamp: buildTimestamp, package_version: packageVersion, status: "fictional-placeholder" }, null, 2)}\n`,
  "utf8",
);

const files = await verifyArtifact(output);
console.log(`Knowledge Explorer Pages artifact built: ${pages.length} Explorer pages, ${files.length} approved files`);
console.log(`Deployment identity: ${commit}`);
console.log("Boundary verified: fictional placeholder content; no backend or Runtime");
