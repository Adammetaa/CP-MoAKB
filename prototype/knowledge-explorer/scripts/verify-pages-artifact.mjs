import { lstat, readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const explorerPages = [
  "index.html", "search.html", "browse.html", "concept.html", "evidence.html",
  "source.html", "authority.html", "governance.html", "about.html", "components.html", "real-knowledge.html", "rice-disease-wave-1.html", "rice-disease-corpus.html", "rice-insect-corpus.html", "rice-weed-corpus.html", "crop-protection-management.html",
];
const labPages = [
  "index.html", "tasks.html", "inbox.html", "sources.html", "evidence.html",
  "candidates.html", "candidate-detail.html", "review-queue.html", "review-detail.html",
  "findings.html", "acceptance.html", "release-package.html", "audit.html",
  "governance.html", "components.html",
];
const approved = new Set([
  "index.html",
  "robots.txt",
  ...explorerPages.map((page) => `knowledge-explorer/${page}`),
  "knowledge-explorer/deployment.json",
  "knowledge-explorer/assets/app.js",
  "knowledge-explorer/assets/styles.css",
  "knowledge-explorer/assets/og.png",
  "knowledge-explorer/assets/data/mock-knowledge.json",
  "knowledge-explorer/assets/data/governed-batch-001.json",
  "knowledge-explorer/assets/data/rice-disease-wave-001.json",
  "knowledge-explorer/assets/data/rice-disease-corpus-001.json",
  "knowledge-explorer/assets/data/rice-insect-corpus-001.json",
  "knowledge-explorer/assets/data/rice-weed-corpus-001.json",
  "knowledge-explorer/assets/data/crop-protection-management-001.json",
  "knowledge-explorer/assets/data/multi-source-integration-001.json",
  "knowledge-explorer/assets/i18n/th.json",
  "knowledge-explorer/assets/i18n/en.json",
  ...labPages.map((page) => `knowledge-lab/${page}`),
  "knowledge-lab/deployment.json",
  "knowledge-lab/assets/app.js",
  "knowledge-lab/assets/styles.css",
  "knowledge-lab/assets/data/mock-workspace.json",
  "knowledge-lab/assets/i18n/th.json",
  "knowledge-lab/assets/i18n/en.json",
  "sp-assistant/index.html",
  "sp-assistant/deployment.json",
  "sp-assistant/assets/decision-authority.js",
  "sp-assistant/assets/decision-gates.js",
  "sp-assistant/assets/app.js",
  "sp-assistant/assets/chat.css",
  "sp-assistant/assets/polish.css",
  "sp-assistant/assets/styles.css",
]);

const walk = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) throw new Error(`Pages artifact contains symbolic link: ${path}`);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
};

export const verifyArtifact = async (root) => {
  const resolvedRoot = resolve(root);
  const files = await walk(resolvedRoot);
  const relativeFiles = files.map((path) => relative(resolvedRoot, path).split(sep).join("/"));
  if (relativeFiles.length !== 61 || approved.size !== 61) {
    throw new Error("Pages artifact must contain exactly 61 approved files");
  }
  const unexpected = relativeFiles.filter((path) => !approved.has(path));
  const missing = [...approved].filter((path) => !relativeFiles.includes(path));
  if (unexpected.length || missing.length) {
    throw new Error(`Pages artifact boundary mismatch\nUnexpected: ${unexpected.join(", ") || "none"}\nMissing: ${missing.join(", ") || "none"}`);
  }

  for (const path of relativeFiles) {
    if (/(?:^|\/)(?:docs?|tests?|scripts?|cpmoakb|references|node[_]modules)(?:\/|$)/i.test(path)) {
      throw new Error(`Pages artifact exposes repository source: ${path}`);
    }
    if (/\.(?:pdf|csv|db|sqlite|sqlite3|map|py|pyc|md|yaml|yml)$/i.test(path)) {
      throw new Error(`Pages artifact contains prohibited source or generated material: ${path}`);
    }
    if (/(?:package\.json|package-lock\.json|pyproject\.toml)$/i.test(path)) {
      throw new Error(`Pages artifact contains package metadata: ${path}`);
    }
  }

  for (const file of files) {
    if (![".html", ".js", ".css", ".json", ".txt"].includes(extname(file))) continue;
    const text = await readFile(file, "utf8");
    for (const pattern of [
      /[A-Z]:\\/i,
      /file:\/\//i,
      /localhost/i,
      /127\.0\.0\.1/,
      /\$\{\{\s*secrets\./i,
      /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/,
    ]) {
      if (pattern.test(text)) {
        throw new Error(`Pages artifact contains prohibited local or sensitive text: ${relative(resolvedRoot, file)}`);
      }
    }
  }

  for (const page of explorerPages) {
    const text = await readFile(resolve(resolvedRoot, "knowledge-explorer", page), "utf8");
    if (!text.includes("Prototype · fictional placeholder content") || !text.includes('content="noindex,nofollow"')) {
      throw new Error(`Explorer page lost public prototype or indexing boundary: ${page}`);
    }
  }
  const explorerMock = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "mock-knowledge.json"), "utf8"));
  if (explorerMock.meta?.status !== "fictional-placeholder") throw new Error("Explorer mock data lost fictional-placeholder status");
  const governed = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "governed-batch-001.json"), "utf8"));
  if (governed.meta?.status !== "accepted-internal-not-published" || governed.package?.id !== "CKP-KPB-001/v1" || governed.view?.id !== "WV-KPB-001/v1") throw new Error("Explorer governed batch identity or publication boundary is invalid");
  if (governed.meta?.rights !== "public-source-excerpts-and-images-suppressed") throw new Error("Explorer governed batch lost rights suppression");
  const governedText = JSON.stringify(governed);
  for (const prohibited of ["sourceExcerpt", "passageText", "imageUrl", "pdfUrl"]) {
    if (governedText.includes(prohibited)) throw new Error(`Explorer governed batch exposes prohibited source material: ${prohibited}`);
  }
  const riceInsectCorpus = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "rice-insect-corpus-001.json"), "utf8"));
  if (riceInsectCorpus.meta?.status !== "accepted-internal-not-published" || riceInsectCorpus.subjects?.length !== 19 || riceInsectCorpus.counts?.packages !== 19 || riceInsectCorpus.counts?.views !== 19 || riceInsectCorpus.counts?.natural_enemy_relationships !== 10) throw new Error("Explorer rice insect corpus is incomplete or publishable");
  if (riceInsectCorpus.meta?.rights !== "source-pages-images-tables-layout-and-passages-suppressed") throw new Error("Explorer rice insect corpus lost rights suppression");
  const riceInsectText = JSON.stringify(riceInsectCorpus);
  for (const prohibited of ["sourceExcerpt", "passageText", "imageUrl", "pdfUrl", "tradeName", "dose"]) {
    if (riceInsectText.includes(prohibited)) throw new Error(`Explorer rice insect corpus exposes prohibited material: ${prohibited}`);
  }
  const riceWeedCorpus = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "rice-weed-corpus-001.json"), "utf8"));
  if (riceWeedCorpus.meta?.status !== "accepted-internal-not-published" || riceWeedCorpus.subjects?.length !== 8 || riceWeedCorpus.counts?.packages !== 8 || riceWeedCorpus.counts?.views !== 8 || riceWeedCorpus.counts?.differential_relationships !== 3) throw new Error("Explorer rice weed corpus is incomplete or publishable");
  if (riceWeedCorpus.meta?.rights !== "source-pages-images-tables-layout-and-passages-suppressed") throw new Error("Explorer rice weed corpus lost rights suppression");
  const riceWeedText = JSON.stringify(riceWeedCorpus);
  for (const prohibited of ["sourceExcerpt", "passageText", "imageUrl", "pdfUrl", "tradeName", "dose"]) {
    if (riceWeedText.includes(prohibited)) throw new Error(`Explorer rice weed corpus exposes prohibited material: ${prohibited}`);
  }
  const management = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "crop-protection-management-001.json"), "utf8"));
  if (management.meta?.status !== "accepted-internal-not-published" || management.counts?.management_options !== 9 || management.counts?.active_ingredients !== 18 || management.counts?.irac_relationships !== 6 || management.counts?.frac_relationships !== 6 || management.counts?.hrac_relationships !== 6 || management.counts?.registration_relationships !== 0) throw new Error("Explorer crop protection management integration is invalid");
  if (management.meta?.rights !== "source-pages-images-tables-layout-and-passages-suppressed") throw new Error("Explorer crop protection management lost rights suppression");
  const managementText = JSON.stringify(management);
  for (const prohibited of ["sourceExcerpt", "passageText", "imageUrl", "pdfUrl", "tradeName", "productRank", "dose"]) {
    if (managementText.includes(prohibited)) throw new Error(`Explorer crop protection management exposes prohibited material: ${prohibited}`);
  }
  const integration = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "multi-source-integration-001.json"), "utf8"));
  if (integration.meta?.model !== "multi-source-knowledge-integration/v1" || integration.meta?.status !== "accepted-internal-not-published" || integration.source_classes?.length !== 6 || integration.views?.length < 2) throw new Error("Explorer multi-source integration is invalid");
  if (integration.safety?.recommendation !== null || integration.safety?.ranking !== null || integration.safety?.prescription !== null || integration.safety?.execution !== null || integration.safety?.automatic_learning !== false) throw new Error("Explorer multi-source integration crossed a safety boundary");
  if (!integration.relationships?.every((relationship) => relationship.source_assertions?.length)) throw new Error("Explorer multi-source relationship lacks provenance");
  const riceWave = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "rice-disease-wave-001.json"), "utf8"));
  if (riceWave.meta?.status !== "accepted-internal-not-published" || riceWave.subjects?.length !== 2 || riceWave.counts?.packages !== 2 || riceWave.counts?.views !== 2) throw new Error("Explorer rice disease wave is incomplete or publishable");
  if (riceWave.meta?.rights !== "public-source-excerpts-and-images-suppressed") throw new Error("Explorer rice disease wave lost rights suppression");
  const riceCorpus = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "rice-disease-corpus-001.json"), "utf8"));
  if (riceCorpus.meta?.status !== "accepted-internal-not-published" || riceCorpus.subjects?.length !== 16 || riceCorpus.counts?.packages !== 16 || riceCorpus.counts?.views !== 16) throw new Error("Explorer rice disease corpus is incomplete or publishable");
  if (riceCorpus.meta?.rights !== "source-pages-images-tables-layout-and-passages-suppressed") throw new Error("Explorer rice disease corpus lost rights suppression");
  const riceCorpusText = JSON.stringify(riceCorpus);
  for (const prohibited of ["sourceExcerpt", "passageText", "imageUrl", "pdfUrl"]) {
    if (riceCorpusText.includes(prohibited)) throw new Error(`Explorer rice disease corpus exposes prohibited source material: ${prohibited}`);
  }
  const thai = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "i18n", "th.json"), "utf8"));
  const english = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "i18n", "en.json"), "utf8"));
  if (!thai.prototype?.notice || !english.prototype?.notice) throw new Error("Explorer localization dictionaries lost prototype notices");
  const explorerMetadata = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "deployment.json"), "utf8"));
  if (explorerMetadata.deployment_mode !== "preview" || explorerMetadata.status !== "fictional-placeholder" || !/^[0-9a-f]{40}$/.test(explorerMetadata.commit)) {
    throw new Error("Explorer deployment metadata is unsafe or incomplete");
  }

  for (const page of labPages) {
    const text = await readFile(resolve(resolvedRoot, "knowledge-lab", page), "utf8");
    for (const requirement of [
      '<meta name="robots" content="noindex,nofollow">',
      "data-prototype-boundary",
      "data-deployment-boundary",
      "Static prototype",
      "Fictional placeholder content",
      "No real permissions",
      "No workflow execution",
      "Candidate is not accepted knowledge",
      "Acceptance is not publication",
      "No diagnosis or recommendation",
      'href="/CP-MoAKB/"',
      'href="/CP-MoAKB/knowledge-explorer/"',
    ]) {
      if (!text.includes(requirement)) {
        throw new Error(`Knowledge Lab page lost deployment boundary: ${page} -> ${requirement}`);
      }
    }
    for (const script of text.matchAll(/<script[^>]+src="([^"]+)"/g)) {
      if (script[1] !== "assets/app.js") {
        throw new Error(`Knowledge Lab page contains external script: ${page} -> ${script[1]}`);
      }
    }
  }
  const labMock = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-lab", "assets", "data", "mock-workspace.json"), "utf8"));
  if (labMock.meta?.status !== "fictional-placeholder") throw new Error("Knowledge Lab mock metadata lost fictional-placeholder status");
  for (const [name, records] of Object.entries(labMock)) {
    if (name === "meta") continue;
    if (!Array.isArray(records) || !records.every((record) => record.status === "fictional-placeholder")) {
      throw new Error(`Knowledge Lab deployed mock records are unsafe: ${name}`);
    }
  }
  const labMetadata = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-lab", "deployment.json"), "utf8"));
  if (JSON.stringify(Object.keys(labMetadata).sort()) !== JSON.stringify(["commit", "deployment_mode", "package_version", "prototype", "status"])) {
    throw new Error("Knowledge Lab deployment metadata contains unexpected fields");
  }
  if (labMetadata.deployment_mode !== "preview" || labMetadata.prototype !== "knowledge-lab" || labMetadata.package_version !== "0.1.0" || labMetadata.status !== "fictional-placeholder" || !/^[0-9a-f]{40}$/.test(labMetadata.commit)) {
    throw new Error("Knowledge Lab deployment metadata is unsafe or incomplete");
  }

  const assistant = await readFile(resolve(resolvedRoot, "sp-assistant", "index.html"), "utf8");
  for (const requirement of ["SP Assistant", "วันนี้พบอะไรในแปลง?", "chat-shell", "เพิ่มรูปภาพ", "ยังไม่อัปโหลดหรือจัดเก็บรูปภาพ", "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ", "../knowledge-explorer/rice-disease-corpus.html", '<meta name="robots" content="noindex,nofollow">']) {
    if (!assistant.includes(requirement)) throw new Error(`SP Assistant lost product boundary: ${requirement}`);
  }
  const assistantApp = await readFile(resolve(resolvedRoot, "sp-assistant", "assets", "app.js"), "utf8");
  for (const prohibited of ["XMLHttpRequest", "WebSocket", "sendBeacon", "localStorage", "sessionStorage", "indexedDB", "FileReader", "FormData"]) {
    if (assistantApp.includes(prohibited)) throw new Error(`SP Assistant contains prohibited network or persistence capability: ${prohibited}`);
  }
  for (const weatherBoundary of ["https://archive-api.open-meteo.com/v1/archive", "https://api.open-meteo.com/v1/forecast", 'credentials: "omit"', 'referrerPolicy: "no-referrer"']) {
    if (!assistantApp.includes(weatherBoundary)) throw new Error(`SP Assistant lost weather-only network boundary: ${weatherBoundary}`);
  }
  for (const surveillanceBoundary of ["demoFieldCases", "haversineDistanceKm", "ระยะค้นหาเป็นตัวกรองการแสดงผล", "NEARBY ≠ RELATED", "CASE CLUSTER ≠ OUTBREAK"]) {
    if (!assistantApp.includes(surveillanceBoundary)) throw new Error(`SP Assistant lost browser-local surveillance boundary: ${surveillanceBoundary}`);
  }
  for (const conversationBoundary of ["guidedQuestionControls", "nextBestAction", "answerRecords", "conversationHistory", "Photo received ≠ Photo analyzed", "CONTROL FAILURE ≠ RESISTANCE", "โหมดทดสอบภาคสนาม"]) {
    if (!assistantApp.includes(conversationBoundary)) throw new Error(`SP Assistant lost guided-conversation boundary: ${conversationBoundary}`);
  }
  const assistantMetadata = JSON.parse(await readFile(resolve(resolvedRoot, "sp-assistant", "deployment.json"), "utf8"));
  if (assistantMetadata.deployment_mode !== "preview" || assistantMetadata.prototype !== "sp-assistant" || assistantMetadata.status !== "local-demo-not-published" || !/^[0-9a-f]{40}$/.test(assistantMetadata.commit)) throw new Error("SP Assistant deployment metadata is unsafe or incomplete");

  const landing = await readFile(resolve(resolvedRoot, "index.html"), "utf8");
  for (const requirement of [
    '<html lang="th">',
    'href="knowledge-explorer/"',
    'href="knowledge-lab/"',
    'href="sp-assistant/"',
    'href="https://github.com/Adammetaa/CP-MoAKB"',
    "SP Assistant",
    "ไม่มีการอัปโหลดหรือจัดเก็บรูป",
    "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ",
    "สำหรับอ่านและสำรวจองค์ความรู้ที่ได้รับอนุมัติ",
    "ต้นแบบพื้นที่สร้าง ตรวจ และพิจารณา Knowledge Candidate",
  ]) {
    if (!landing.includes(requirement)) throw new Error(`Pages root landing page is missing Thai-first requirement: ${requirement}`);
  }
  const landingTitle = landing.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  const landingHeading = landing.match(/<h1>(.*?)<\/h1>/s)?.[1] ?? "";
  if (!/[\u0E00-\u0E7F]/.test(landingTitle) || !/[\u0E00-\u0E7F]/.test(landingHeading)) {
    throw new Error("Pages root landing page is not Thai-first");
  }
  if (/<script\b|http-equiv\s*=\s*["']refresh|(?:window\.)?location\s*=/i.test(landing)) {
    throw new Error("Pages root landing page must remain JavaScript-free with no automatic redirect");
  }
  const robots = await readFile(resolve(resolvedRoot, "robots.txt"), "utf8");
  if (!robots.includes("Disallow: /CP-MoAKB/knowledge-explorer/")) throw new Error("robots.txt does not block Explorer indexing");
  if (!robots.includes("Disallow: /CP-MoAKB/knowledge-lab/")) throw new Error("robots.txt does not block Knowledge Lab indexing");
  if (!robots.includes("Disallow: /CP-MoAKB/sp-assistant/")) throw new Error("robots.txt does not block SP Assistant indexing");
  return relativeFiles.sort();
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target) throw new Error("Usage: node scripts/verify-pages-artifact.mjs <pages-root>");
  const files = await verifyArtifact(target);
  console.log(`Pages artifact verified: ${files.length} approved files; governed disease, insect, weed, and management views remain not published`);
}
