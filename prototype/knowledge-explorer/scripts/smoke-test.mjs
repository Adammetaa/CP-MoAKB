import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";

const artifact = resolve(import.meta.dirname, "..", "dist", "pages-root");
const prefix = "/CP-MoAKB/";
const contentTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".txt": "text/plain; charset=utf-8" };
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

await new Promise((resolveReady) => server.listen(0, "127.0.0.1", resolveReady));
const address = server.address();
if (!address || typeof address === "string") throw new Error("Smoke server did not start");
const base = `http://127.0.0.1:${address.port}${prefix}`;
const pages = ["index.html", "search.html", "browse.html", "concept.html", "evidence.html", "source.html", "authority.html", "governance.html", "about.html", "components.html"];

try {
  for (const page of pages) {
    const response = await fetch(`${base}knowledge-explorer/${page}`);
    if (!response.ok) throw new Error(`${page} failed with ${response.status}`);
    const text = await response.text();
    if (!text.includes("Prototype · fictional placeholder content")) throw new Error(`${page} lost prototype notice`);
    for (const match of text.matchAll(/href="([^"]+)"/g)) {
      const target = match[1];
      if (target.startsWith("https://") || target.startsWith("#")) continue;
      const resolved = new URL(target, `${base}knowledge-explorer/${page}`);
      if (!resolved.pathname.startsWith(`${prefix}knowledge-explorer/`)) throw new Error(`${page} link escapes deployment root: ${target}`);
      if (target.endsWith(".html") || target.includes(".html#")) {
        const linked = await fetch(resolved);
        if (!linked.ok) throw new Error(`${page} has broken link: ${target}`);
      }
    }
  }
  for (const asset of ["assets/styles.css", "assets/app.js", "assets/og.png", "assets/data/mock-knowledge.json", "deployment.json"]) {
    const response = await fetch(`${base}knowledge-explorer/${asset}`);
    if (!response.ok) throw new Error(`${asset} failed with ${response.status}`);
  }
  const mock = await (await fetch(`${base}knowledge-explorer/assets/data/mock-knowledge.json`)).json();
  if (mock.meta?.status !== "fictional-placeholder") throw new Error("Mock data boundary failed");
  console.log(`Repository-subpath smoke test passed: ${pages.length} Explorer pages and all required assets`);
} finally {
  await new Promise((resolveClosed, reject) => server.close((error) => error ? reject(error) : resolveClosed()));
}
