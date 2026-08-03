import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";

import { pages, root } from "./verify-prototype.mjs";

const artifact = resolve(root, "dist", "knowledge-lab");
const prefix = "/CP-MoAKB/knowledge-lab/";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json" };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (!url.pathname.startsWith(prefix)) throw new Error("outside prefix");
    let relative = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!relative || relative.endsWith("/")) relative += "index.html";
    if (relative.includes("..")) throw new Error("invalid path");
    const file = resolve(artifact, relative);
    if (!file.startsWith(artifact)) throw new Error("outside artifact");
    const body = await readFile(file);
    response.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404).end("not found");
  }
});

await new Promise((ready) => server.listen(0, "127.0.0.1", ready));
const address = server.address();
if (!address || typeof address === "string") throw new Error("smoke server failed");
const base = `http://127.0.0.1:${address.port}${prefix}`;

try {
  for (const page of pages) {
    const response = await fetch(`${base}${page}`);
    if (!response.ok) throw new Error(`${page}: ${response.status}`);
    const html = await response.text();
    if (!html.includes("data-prototype-boundary")) throw new Error(`${page}: boundary missing`);
    for (const match of html.matchAll(/href="([^"#]+\.html)(?:#[^"]*)?"/g)) {
      const linked = await fetch(new URL(match[1], `${base}${page}`));
      if (!linked.ok) throw new Error(`${page}: broken link ${match[1]}`);
    }
  }
  for (const asset of ["assets/styles.css", "assets/app.js", "assets/data/mock-workspace.json", "assets/i18n/th.json", "assets/i18n/en.json"]) {
    const response = await fetch(`${base}${asset}`);
    if (!response.ok) throw new Error(`asset failed: ${asset}`);
  }
  console.log(`Knowledge Lab subpath smoke test passed: ${pages.length} pages and required assets`);
} finally {
  await new Promise((closed, reject) => server.close((error) => error ? reject(error) : closed()));
}
