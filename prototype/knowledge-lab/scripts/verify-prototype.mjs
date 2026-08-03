import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const root = resolve(import.meta.dirname, "..");
export const pages = [
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

const requiredNavigation = [
  ["index.html", "แดชบอร์ด"],
  ["tasks.html", "งานของฉัน"],
  ["inbox.html", "กล่องรับงาน"],
  ["sources.html", "แหล่งข้อมูล"],
  ["evidence.html", "หลักฐาน"],
  ["candidates.html", "รายการผู้สมัคร"],
  ["review-queue.html", "คิวทบทวน"],
  ["findings.html", "ข้อค้นพบ"],
  ["acceptance.html", "เกณฑ์รับรอง"],
  ["release-package.html", "แพ็กเกจเผยแพร่"],
  ["audit.html", "ประวัติการตรวจสอบ"],
  ["governance.html", "ธรรมาภิบาล"],
  ["components.html", "คลังคอมโพเนนต์"],
];

const failures = [];

for (const page of pages) {
  const text = await readFile(resolve(root, page), "utf8");
  for (const required of [
    '<html lang="th">',
    '<meta name="robots" content="noindex,nofollow">',
    "<main",
    "data-page=",
    "data-prototype-boundary",
    "assets/styles.css",
    "assets/app.js",
  ]) {
    if (!text.includes(required)) failures.push(`${page}: missing ${required}`);
  }
  const heading = text.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? "";
  if (!/[\u0E00-\u0E7F]/.test(heading)) failures.push(`${page}: Thai heading missing`);
  const main = text.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
  if (main.length < 700) failures.push(`${page}: static main fallback is incomplete`);
  for (const [href, label] of requiredNavigation) {
    if (!text.includes(`href="${href}"`) || !text.includes(label)) {
      failures.push(`${page}: missing Thai navigation ${label}`);
    }
  }
  for (const link of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = link[1];
    if (/^(?:https?:)?\/\//.test(target)) failures.push(`${page}: external asset or link ${target}`);
    if (target.startsWith("/") || target.includes("..")) failures.push(`${page}: subpath-unsafe target ${target}`);
    const local = target.split("#")[0].split("?")[0];
    if (local.endsWith(".html") && !pages.includes(local)) failures.push(`${page}: unknown page ${local}`);
  }
}

const app = await readFile(resolve(root, "assets", "app.js"), "utf8");
for (const prohibited of [
  "WebSocket",
  "EventSource",
  "document.cookie",
  "indexedDB",
  "XMLHttpRequest",
  "analytics",
]) {
  if (app.includes(prohibited)) failures.push(`app.js contains prohibited capability: ${prohibited}`);
}
for (const request of app.matchAll(/fetch\("([^"]+)"\)/g)) {
  if (!["assets/i18n/th.json", "assets/i18n/en.json"].includes(request[1])) {
    failures.push(`app.js fetches an unapproved resource: ${request[1]}`);
  }
}

const css = await readFile(resolve(root, "assets", "styles.css"), "utf8");
if (/@import|url\s*\(/i.test(css)) failures.push("styles.css loads an external or embedded asset");
for (const required of [":focus-visible", "min-height: 44px", "prefers-reduced-motion", "overflow-wrap"] ) {
  if (!css.includes(required)) failures.push(`styles.css missing accessibility rule: ${required}`);
}

const data = JSON.parse(
  await readFile(resolve(root, "assets", "data", "mock-workspace.json"), "utf8"),
);
if (data.meta?.status !== "fictional-placeholder") failures.push("mock data status is not fictional-placeholder");
if (!data.meta?.disclaimer?.includes("not agricultural knowledge")) failures.push("mock data disclaimer is incomplete");
for (const [key, expected] of Object.entries({
  sourceCandidates: 1,
  evidenceItems: 2,
  claims: 1,
  conceptCandidates: 1,
  terminologyCandidates: 1,
  relationshipCandidates: 1,
  findings: 2,
  reviewDecisions: 1,
  acceptanceGates: 1,
  releasePackages: 1,
})) {
  if (data[key]?.length !== expected) failures.push(`mock data ${key} count mismatch`);
  if (!data[key]?.every((item) => item.status === "fictional-placeholder")) {
    failures.push(`mock data ${key} contains a non-placeholder object`);
  }
}
if (data.auditEvents?.length < 15 || !data.auditEvents.every((item) => item.status === "fictional-placeholder")) {
  failures.push("mock audit events are incomplete or non-placeholder");
}

const pageSources = await Promise.all(
  pages.map((page) => readFile(resolve(root, page), "utf8")),
);
const allSource = [...pageSources, JSON.stringify(data)].join("\n").toLowerCase();
for (const prohibitedTerm of ["oryza", "zea mays", "pesticide", "fungicide", "insecticide", "herbicide"]) {
  if (allSource.includes(prohibitedTerm)) failures.push(`real agricultural term found: ${prohibitedTerm}`);
}

if (failures.length) throw new Error(`Knowledge Lab prototype verification failed:\n${failures.join("\n")}`);
console.log(`Knowledge Lab prototype verified: ${pages.length} static Thai-first pages`);
console.log("Boundary verified: fictional placeholders; no backend, workflow persistence, or publication");
