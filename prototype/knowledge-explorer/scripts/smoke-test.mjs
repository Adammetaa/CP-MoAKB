import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";

const artifact = resolve(import.meta.dirname, "..", "dist", "pages-root");
const prefix = "/CP-MoAKB/";
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};
const explorerPages = ["index.html", "search.html", "browse.html", "concept.html", "evidence.html", "source.html", "authority.html", "governance.html", "about.html", "components.html", "real-knowledge.html", "rice-disease-wave-1.html", "rice-disease-corpus.html"];
const labPages = ["index.html", "tasks.html", "inbox.html", "sources.html", "evidence.html", "candidates.html", "candidate-detail.html", "review-queue.html", "review-detail.html", "findings.html", "acceptance.html", "release-package.html", "audit.html", "governance.html", "components.html"];

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (!url.pathname.startsWith(prefix)) throw new Error("outside preview prefix");
    let relativePath = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!relativePath || relativePath.endsWith("/")) relativePath += "index.html";
    if (relativePath.includes("..")) throw new Error("invalid path");
    const file = resolve(artifact, relativePath);
    if (!file.startsWith(artifact)) throw new Error("outside artifact");
    const body = await readFile(file);
    response.writeHead(200, { "content-type": contentTypes[extname(file)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404).end("not found");
  }
});

await new Promise((ready) => server.listen(0, "127.0.0.1", ready));
const address = server.address();
if (!address || typeof address === "string") throw new Error("Smoke server did not start");
const base = `http://127.0.0.1:${address.port}${prefix}`;

try {
  const landing = await (await fetch(base)).text();
  if (!landing.includes('href="knowledge-explorer/"') || !landing.includes('href="knowledge-lab/"')) {
    throw new Error("Root landing does not link both prototypes");
  }

  for (const page of explorerPages) {
    const response = await fetch(`${base}knowledge-explorer/${page}`);
    if (!response.ok) throw new Error(`Explorer ${page} failed with ${response.status}`);
    const text = await response.text();
    if (!text.includes("Prototype · fictional placeholder content")) throw new Error(`Explorer ${page} lost prototype notice`);
    for (const match of text.matchAll(/href="([^"]+)"/g)) {
      const target = match[1];
      if (target.startsWith("https://") || target.startsWith("#")) continue;
      const resolved = new URL(target, `${base}knowledge-explorer/${page}`);
      if (!resolved.pathname.startsWith(`${prefix}knowledge-explorer/`)) throw new Error(`Explorer ${page} link escapes root: ${target}`);
      if (target.endsWith(".html") || target.includes(".html#")) {
        const linked = await fetch(resolved);
        if (!linked.ok) throw new Error(`Explorer ${page} has broken link: ${target}`);
      }
    }
  }

  for (const page of labPages) {
    const response = await fetch(`${base}knowledge-lab/${page}`);
    if (!response.ok) throw new Error(`Knowledge Lab ${page} failed with ${response.status}`);
    const text = await response.text();
    for (const requirement of [
      '<html lang="th">',
      "data-prototype-boundary",
      "data-deployment-boundary",
      "No real permissions",
      "No workflow execution",
      "Candidate is not accepted knowledge",
      "Acceptance is not publication",
      "No diagnosis or recommendation",
      'data-language="en"',
      "data-role-switcher",
    ]) {
      if (!text.includes(requirement)) throw new Error(`Knowledge Lab ${page} missing ${requirement}`);
    }
    for (const match of text.matchAll(/href="([^"]+)"/g)) {
      const target = match[1];
      if (target.startsWith("#")) continue;
      const resolved = new URL(target, `${base}knowledge-lab/${page}`);
      const allowed = resolved.pathname.startsWith(`${prefix}knowledge-lab/`)
        || resolved.pathname === prefix
        || resolved.pathname === `${prefix}knowledge-explorer/`;
      if (!allowed) throw new Error(`Knowledge Lab ${page} link escapes approved previews: ${target}`);
      const linked = await fetch(resolved);
      if (!linked.ok) throw new Error(`Knowledge Lab ${page} has broken link: ${target}`);
    }
  }

  for (const asset of [
    "knowledge-explorer/assets/styles.css",
    "knowledge-explorer/assets/app.js",
    "knowledge-explorer/assets/og.png",
    "knowledge-explorer/assets/data/mock-knowledge.json",
    "knowledge-explorer/assets/data/governed-batch-001.json",
    "knowledge-explorer/assets/data/rice-disease-wave-001.json",
    "knowledge-explorer/assets/data/rice-disease-corpus-001.json",
    "knowledge-explorer/assets/i18n/th.json",
    "knowledge-explorer/assets/i18n/en.json",
    "knowledge-explorer/deployment.json",
    "knowledge-lab/assets/styles.css",
    "knowledge-lab/assets/app.js",
    "knowledge-lab/assets/data/mock-workspace.json",
    "knowledge-lab/assets/i18n/th.json",
    "knowledge-lab/assets/i18n/en.json",
    "knowledge-lab/deployment.json",
  ]) {
    const response = await fetch(`${base}${asset}`);
    if (!response.ok) throw new Error(`${asset} failed with ${response.status}`);
  }
  const labApp = await (await fetch(`${base}knowledge-lab/assets/app.js`)).text();
  if (!labApp.includes("bindRoleSwitcher") || !labApp.includes("applyLanguage")) throw new Error("Knowledge Lab enhancements are missing");
  const labMock = await (await fetch(`${base}knowledge-lab/assets/data/mock-workspace.json`)).json();
  if (labMock.meta?.status !== "fictional-placeholder") throw new Error("Knowledge Lab mock boundary failed");
  console.log(`Combined repository-subpath smoke test passed: ${explorerPages.length} Explorer pages and ${labPages.length} Lab pages`);
} finally {
  await new Promise((closed, reject) => server.close((error) => error ? reject(error) : closed()));
}
