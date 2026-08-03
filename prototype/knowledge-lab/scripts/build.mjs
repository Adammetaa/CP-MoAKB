import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

import { pages, root } from "./verify-prototype.mjs";
import "./verify-localization.mjs";

const output = resolve(root, "dist", "knowledge-lab");
await rm(resolve(root, "dist"), { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const page of pages) await cp(resolve(root, page), resolve(output, page));
await cp(resolve(root, "assets"), resolve(output, "assets"), { recursive: true });
console.log(`Knowledge Lab static build complete: ${pages.length} pages`);
console.log("No deployment metadata or publication action was created");
