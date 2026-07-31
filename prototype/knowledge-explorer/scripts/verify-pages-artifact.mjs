import { lstat, readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const pages = ["index.html", "search.html", "browse.html", "concept.html", "evidence.html", "source.html", "authority.html", "governance.html", "about.html", "components.html"];
const approved = new Set([
  "index.html",
  "robots.txt",
  ...pages.map((page) => `knowledge-explorer/${page}`),
  "knowledge-explorer/deployment.json",
  "knowledge-explorer/assets/app.js",
  "knowledge-explorer/assets/styles.css",
  "knowledge-explorer/assets/og.png",
  "knowledge-explorer/assets/data/mock-knowledge.json",
  "knowledge-explorer/assets/i18n/th.json",
  "knowledge-explorer/assets/i18n/en.json",
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
  if (relativeFiles.length !== 19 || approved.size !== 19) throw new Error("Pages artifact must contain exactly 19 approved files");
  const unexpected = relativeFiles.filter((path) => !approved.has(path));
  const missing = [...approved].filter((path) => !relativeFiles.includes(path));
  if (unexpected.length || missing.length) {
    throw new Error(`Pages artifact boundary mismatch\nUnexpected: ${unexpected.join(", ") || "none"}\nMissing: ${missing.join(", ") || "none"}`);
  }

  for (const file of files) {
    if (![".html", ".js", ".css", ".json", ".txt"].includes(extname(file))) continue;
    const text = await readFile(file, "utf8");
    for (const pattern of [/[A-Z]:\\/i, /file:\/\//i, /localhost/i, /127\.0\.0\.1/, /\$\{\{\s*secrets\./i, /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/]) {
      if (pattern.test(text)) throw new Error(`Pages artifact contains prohibited local or sensitive text: ${relative(resolvedRoot, file)}`);
    }
  }

  for (const page of pages) {
    const text = await readFile(resolve(resolvedRoot, "knowledge-explorer", page), "utf8");
    if (!text.includes("Prototype · fictional placeholder content") || !text.includes('content="noindex,nofollow"')) {
      throw new Error(`Explorer page lost public prototype or indexing boundary: ${page}`);
    }
  }
  const mock = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "data", "mock-knowledge.json"), "utf8"));
  if (mock.meta?.status !== "fictional-placeholder") throw new Error("Deployed mock data lost fictional-placeholder status");
  const thai = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "i18n", "th.json"), "utf8"));
  const english = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "assets", "i18n", "en.json"), "utf8"));
  if (!thai.prototype?.notice || !english.prototype?.notice) throw new Error("Deployed localization dictionaries lost prototype notices");
  const metadata = JSON.parse(await readFile(resolve(resolvedRoot, "knowledge-explorer", "deployment.json"), "utf8"));
  if (metadata.deployment_mode !== "preview" || metadata.status !== "fictional-placeholder" || !/^[0-9a-f]{40}$/.test(metadata.commit)) {
    throw new Error("Deployment metadata is unsafe or incomplete");
  }
  const landing = await readFile(resolve(resolvedRoot, "index.html"), "utf8");
  for (const requirement of ['<html lang="th">', 'href="knowledge-explorer/"', 'href="https://github.com/Adammetaa/CP-MoAKB"', "ตัวอย่างต้นแบบ", "เนื้อหาสมมติ", "ไม่ใช่ระบบ", "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ"]) {
    if (!landing.includes(requirement)) throw new Error(`Pages root landing page is missing Thai-first requirement: ${requirement}`);
  }
  const landingTitle = landing.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  const landingHeading = landing.match(/<h1>(.*?)<\/h1>/s)?.[1] ?? "";
  const landingNarrative = landing.match(/<h1>.*?<\/h1>\s*<p>(.*?)<\/p>/s)?.[1] ?? "";
  if (!/[\u0E00-\u0E7F]/.test(landingTitle) || !/[\u0E00-\u0E7F]/.test(landingHeading) || !/[\u0E00-\u0E7F]/.test(landingNarrative)) throw new Error("Pages root landing page is not Thai-first");
  if (/<script\b|http-equiv\s*=\s*["']refresh|(?:window\.)?location\s*=/i.test(landing)) throw new Error("Pages root landing page must remain JavaScript-free with no automatic redirect");
  const robots = await readFile(resolve(resolvedRoot, "robots.txt"), "utf8");
  if (!robots.includes("Disallow: /CP-MoAKB/knowledge-explorer/")) throw new Error("robots.txt does not block Explorer indexing");
  return relativeFiles.sort();
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target) throw new Error("Usage: node scripts/verify-pages-artifact.mjs <pages-root>");
  const files = await verifyArtifact(target);
  console.log(`Pages artifact verified: ${files.length} approved files`);
}
