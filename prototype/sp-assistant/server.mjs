import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const MIME = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".mjs":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".txt":"text/plain; charset=utf-8" };

export function validateChatPayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid request");
  const allowed = new Set(["message", "scope", "field_id", "season_id"]); if (Object.keys(value).some((key) => !allowed.has(key))) throw new Error("invalid request");
  if (typeof value.message !== "string" || !value.message.trim() || value.message.length > 4_000) throw new Error("invalid message");
  if (!["FIELD_SCOPED", "CASE_SCOPED"].includes(value.scope)) throw new Error("invalid scope");
  for (const key of ["field_id", "season_id"]) if (value[key] != null && (typeof value[key] !== "string" || value[key].length > 128)) throw new Error(`invalid ${key}`);
  return { message:value.message.trim(), scope:value.scope, field_id:value.field_id ?? null, season_id:value.season_id ?? null };
}

export function extractOutputText(response) { return (response?.output ?? []).flatMap((item) => item?.content ?? []).filter((item) => item?.type === "output_text").map((item) => item.text).join("\n").trim(); }

async function loadLocalEnvironment() { try { const text = await readFile(resolve(ROOT, ".env.local"), "utf8"); for (const line of text.split(/\r?\n/)) { const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/); if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim(); } } catch { /* Host environment may provide configuration. */ } }
async function readJson(request, limit = 32_768) { const chunks = []; let size = 0; for await (const chunk of request) { size += chunk.length; if (size > limit) throw new Error("request too large"); chunks.push(chunk); } return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
function json(response, status, payload) { response.writeHead(status, { "content-type":"application/json; charset=utf-8", "cache-control":"no-store", "x-content-type-options":"nosniff" }); response.end(JSON.stringify(payload)); }

async function handleChat(request, response) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("YOUR_")) return json(response, 503, { status:"UNAVAILABLE", message:"ยังไม่ได้ตั้งค่า OpenAI API key ฝั่ง server" });
  try {
    const input = validateChatPayload(await readJson(request));
    const providerResponse = await fetch("https://api.openai.com/v1/responses", { method:"POST", headers:{ authorization:`Bearer ${process.env.OPENAI_API_KEY}`, "content-type":"application/json" }, body:JSON.stringify({ model:process.env.OPENAI_MODEL || "gpt-5.6-luna", store:false, instructions:"ตอบภาษาไทยอย่างกระชับในบทบาทผู้ช่วยงานแปลง ใช้เฉพาะบริบทที่ผู้ใช้ให้ รักษาขอบเขต Candidate ≠ Diagnosis ห้ามอ้างว่าเป็นการวินิจฉัย ยืนยันสาเหตุ แหล่งอำนาจกำกับ หรือคำแนะนำสารเคมี หากหลักฐานไม่พอให้ระบุความไม่แน่นอนและเสนอสิ่งที่ควรสังเกตต่อ", input:[{ role:"user", content:[{ type:"input_text", text:`scope=${input.scope}; field_id=${input.field_id ?? "none"}; season_id=${input.season_id ?? "none"}\nคำถาม: ${input.message}` }] }], text:{ verbosity:"low" } }) });
    const providerPayload = await providerResponse.json();
    if (!providerResponse.ok) return json(response, 502, { status:"UNAVAILABLE", message:"ผู้ให้บริการ AI ไม่พร้อมใช้งานในขณะนี้" });
    const message = extractOutputText(providerPayload); if (!message) return json(response, 502, { status:"UNAVAILABLE", message:"ผู้ให้บริการ AI ไม่ส่งข้อความกลับมา" });
    return json(response, 200, { status:"AVAILABLE", message, provider:"OPENAI_RESPONSES", model:providerPayload.model ?? process.env.OPENAI_MODEL, response_id:providerPayload.id ?? null });
  } catch { return json(response, 400, { status:"UNAVAILABLE", message:"คำขอสนทนาไม่ถูกต้อง" }); }
}

async function serveStatic(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname), relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  if (relative.startsWith(".") || relative.includes(`..${sep}`) || relative === ".env.local") return json(response, 404, { status:"NOT_FOUND" });
  const filePath = resolve(ROOT, relative); if (!filePath.startsWith(resolve(ROOT) + sep)) return json(response, 404, { status:"NOT_FOUND" });
  try { const body = await readFile(filePath); response.writeHead(200, { "content-type":MIME[extname(filePath)] ?? "application/octet-stream", "x-content-type-options":"nosniff" }); response.end(body); }
  catch { json(response, 404, { status:"NOT_FOUND" }); }
}

export async function startServer({ port } = {}) { await loadLocalEnvironment(); const selectedPort = Number(port ?? process.env.PORT ?? 4173); const server = createServer(async (request, response) => { if (request.method === "GET" && request.url === "/health") return json(response, 200, { status:"ok", ai_configured:Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith("YOUR_")), model:process.env.OPENAI_MODEL || "gpt-5.6-luna" }); if (request.method === "POST" && request.url === "/api/assistant/chat") return handleChat(request, response); if (request.method === "GET" || request.method === "HEAD") return serveStatic(request, response); return json(response, 405, { status:"METHOD_NOT_ALLOWED" }); }); return new Promise((done, reject) => { server.once("error", reject); server.listen(selectedPort, "127.0.0.1", () => done(server)); }); }
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startServer().then(() => console.log(`SP Assistant server ready at http://localhost:${process.env.PORT ?? 4173}`)).catch((error) => { console.error(error.message); process.exitCode = 1; });
