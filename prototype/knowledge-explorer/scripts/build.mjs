import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { verifyArtifact } from "./verify-pages-artifact.mjs";
import { verifyLocalization } from "./verify-localization.mjs";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist", "pages-root");
const explorerOutput = resolve(output, "knowledge-explorer");
const labRoot = resolve(root, "..", "knowledge-lab");
const labOutput = resolve(output, "knowledge-lab");
const assistantRoot = resolve(root, "..", "sp-assistant");
const assistantOutput = resolve(output, "sp-assistant");
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
  "real-knowledge.html",
  "rice-disease-wave-1.html",
  "rice-disease-corpus.html",
  "rice-insect-corpus.html",
  "rice-weed-corpus.html",
];
const labPages = [
  "index.html",
  "tasks.html",
  "inbox.html",
  "sources.html",
  "evidence.html",
  "candidates.html",
  "candidate-detail.html",
  "review-queue.html",
  "review-detail.html",
  "findings.html",
  "acceptance.html",
  "release-package.html",
  "audit.html",
  "governance.html",
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
for (const prohibited of ["sessionStorage", "WebSocket", "EventSource", "document.cookie", "analytics"]) {
  if (appText.includes(prohibited)) failures.push(`app.js contains prohibited capability: ${prohibited}`);
}
if (!appText.includes("storage?.getItem(storageKey)") || !appText.includes("storage?.setItem(storageKey, nextLanguage)")) failures.push("app.js is missing safe language-preference persistence");
for (const request of appText.matchAll(/fetch\("([^"]+)"\)/g)) {
  if (!["assets/i18n/th.json", "assets/i18n/en.json", "assets/data/mock-knowledge.json", "assets/data/governed-batch-001.json", "deployment.json"].includes(request[1])) {
    failures.push(`app.js fetches an unapproved resource: ${request[1]}`);
  }
}

const dataText = await readFile(resolve(root, "assets", "data", "mock-knowledge.json"), "utf8");
const data = JSON.parse(dataText);
if (data.meta?.status !== "fictional-placeholder") failures.push("mock dataset must declare fictional-placeholder status");
if (!data.meta?.disclaimer?.includes("not agricultural knowledge")) failures.push("mock dataset disclaimer is missing");
const governed = JSON.parse(await readFile(resolve(root, "assets", "data", "governed-batch-001.json"), "utf8"));
if (governed.meta?.status !== "accepted-internal-not-published") failures.push("governed batch must remain not published");
if (governed.package?.id !== "CKP-KPB-001/v1" || governed.view?.id !== "WV-KPB-001/v1") failures.push("governed batch identity is invalid");
if (governed.meta?.rights !== "public-source-excerpts-and-images-suppressed") failures.push("governed batch rights boundary is invalid");
const riceWave = JSON.parse(await readFile(resolve(root, "assets", "data", "rice-disease-wave-001.json"), "utf8"));
if (riceWave.meta?.status !== "accepted-internal-not-published" || riceWave.subjects?.length !== 2) failures.push("rice disease wave identity or subject count is invalid");
if (riceWave.meta?.rights !== "public-source-excerpts-and-images-suppressed") failures.push("rice disease wave rights boundary is invalid");
const riceCorpus = JSON.parse(await readFile(resolve(root, "assets", "data", "rice-disease-corpus-001.json"), "utf8"));
if (riceCorpus.meta?.status !== "accepted-internal-not-published" || riceCorpus.subjects?.length !== 16 || riceCorpus.counts?.packages !== 16 || riceCorpus.counts?.views !== 16) failures.push("rice disease corpus identity or counts are invalid");
if (riceCorpus.meta?.rights !== "source-pages-images-tables-layout-and-passages-suppressed") failures.push("rice disease corpus rights boundary is invalid");
const riceInsectCorpus = JSON.parse(await readFile(resolve(root, "assets", "data", "rice-insect-corpus-001.json"), "utf8"));
if (riceInsectCorpus.meta?.status !== "accepted-internal-not-published" || riceInsectCorpus.subjects?.length !== 19 || riceInsectCorpus.counts?.packages !== 19 || riceInsectCorpus.counts?.views !== 19) failures.push("rice insect corpus identity or counts are invalid");
if (riceInsectCorpus.meta?.rights !== "source-pages-images-tables-layout-and-passages-suppressed") failures.push("rice insect corpus rights boundary is invalid");
const riceWeedCorpus = JSON.parse(await readFile(resolve(root, "assets", "data", "rice-weed-corpus-001.json"), "utf8"));
if (riceWeedCorpus.meta?.status !== "accepted-internal-not-published" || riceWeedCorpus.subjects?.length !== 8 || riceWeedCorpus.counts?.packages !== 8 || riceWeedCorpus.counts?.views !== 8 || riceWeedCorpus.counts?.differential_relationships !== 3) failures.push("rice weed corpus identity or counts are invalid");
if (riceWeedCorpus.meta?.rights !== "source-pages-images-tables-layout-and-passages-suppressed") failures.push("rice weed corpus rights boundary is invalid");
if (failures.length) throw new Error(`Prototype validation failed:\n${failures.join("\n")}`);

await verifyLocalization();

await rm(resolve(root, "dist"), { recursive: true, force: true });
await mkdir(explorerOutput, { recursive: true });
await mkdir(labOutput, { recursive: true });
await mkdir(assistantOutput, { recursive: true });
await cp(resolve(root, "deployment", "root-index.html"), resolve(output, "index.html"));
await cp(resolve(root, "deployment", "robots.txt"), resolve(output, "robots.txt"));
for (const page of pages) await cp(resolve(root, page), resolve(explorerOutput, page));
await cp(resolve(root, "assets"), resolve(explorerOutput, "assets"), { recursive: true });
await writeFile(
  resolve(explorerOutput, "deployment.json"),
  `${JSON.stringify({ deployment_mode: "preview", prototype: "knowledge-explorer", commit, build_timestamp: buildTimestamp, package_version: packageVersion, status: "fictional-placeholder" }, null, 2)}\n`,
  "utf8",
);

const labDeploymentBoundary = `
  <aside class="boundary deployment-boundary" data-deployment-boundary>
    <span aria-hidden="true">!</span>
    <div><strong>Static prototype · Fictional placeholder content</strong>
    <p>No real permissions · No workflow execution · Candidate is not accepted knowledge · Acceptance is not publication · No diagnosis or recommendation</p></div>
  </aside>
  <nav class="actions preview-links" aria-label="ลิงก์ตัวอย่างต้นแบบ">
    <a class="button secondary" href="/CP-MoAKB/">หน้าหลักโครงการ</a>
    <a class="button secondary" href="/CP-MoAKB/knowledge-explorer/">เปิด Knowledge Explorer</a>
  </nav>`;
for (const page of labPages) {
  const source = await readFile(resolve(labRoot, page), "utf8");
  if (!source.includes("</main>")) throw new Error(`Knowledge Lab page has no main boundary: ${page}`);
  await writeFile(
    resolve(labOutput, page),
    source.replace("</main>", `${labDeploymentBoundary}</main>`),
    "utf8",
  );
}
await cp(resolve(labRoot, "assets"), resolve(labOutput, "assets"), { recursive: true });
await writeFile(
  resolve(labOutput, "deployment.json"),
  `${JSON.stringify({ deployment_mode: "preview", prototype: "knowledge-lab", commit, package_version: packageVersion, status: "fictional-placeholder" }, null, 2)}\n`,
  "utf8",
);
await cp(resolve(assistantRoot, "index.html"), resolve(assistantOutput, "index.html"));
await cp(resolve(assistantRoot, "assets"), resolve(assistantOutput, "assets"), { recursive: true });
await writeFile(
  resolve(assistantOutput, "deployment.json"),
  `${JSON.stringify({ deployment_mode: "preview", prototype: "sp-assistant", commit, package_version: packageVersion, status: "local-demo-not-published" }, null, 2)}\n`,
  "utf8",
);

const files = await verifyArtifact(output);
console.log(`Combined Pages artifact built: 1 SP Assistant page, ${pages.length} Explorer pages, ${labPages.length} Lab pages, ${files.length} approved files`);
console.log(`Deployment identity: ${commit}`);
console.log("Boundary verified: fictional placeholder preserved; governed disease and insect corpora not published; no backend or Runtime");
