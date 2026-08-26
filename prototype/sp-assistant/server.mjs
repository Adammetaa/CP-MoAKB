import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { PilotStore } from "./pilot-store.mjs";
import { PilotKnowledgeStore } from "./knowledge-store.mjs";

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
function contractError(message) { return Object.assign(new Error(message),{code:"VALIDATION_ERROR",status:400}); }
function sessionToken(request) { return request.headers.cookie?.split(";").map((item) => item.trim()).find((item) => item.startsWith("pilot_session="))?.slice("pilot_session=".length) ?? null; }

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

export async function startServer({ port, host, dbPath, exportDir, uploadDir: configuredUploadDir } = {}) {
  await loadLocalEnvironment();
  const selectedPort = Number(port ?? process.env.PORT ?? 4173), selectedHost = host ?? process.env.PILOT_HOST ?? "127.0.0.1";
  if (!["127.0.0.1", "localhost", "::1"].includes(selectedHost) && process.env.PILOT_ALLOW_LAN !== "true") throw new Error("LAN binding requires PILOT_ALLOW_LAN=true");
  const uploadDir = resolve(configuredUploadDir ?? process.env.PILOT_UPLOAD_DIR ?? resolve(ROOT, "data/uploads")); await mkdir(uploadDir, { recursive:true });
  const store = await new PilotStore({ dbPath: dbPath ?? process.env.PILOT_DB_PATH ?? resolve(ROOT, "data/pilot.sqlite"), exportDir: exportDir ?? process.env.PILOT_EXPORT_DIR ?? resolve(ROOT, "data/exports") }).open();
  const knowledge = await new PilotKnowledgeStore().open(), sessions = new Map();
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    try {
      if (request.method === "GET" && url.pathname === "/health") return json(response, 200, { status:"ok", storage_ready:true, ai_configured:Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith("YOUR_")), model:process.env.OPENAI_MODEL || "gpt-5.6-luna" });
      if (request.method === "POST" && url.pathname === "/api/pilot/session") { const payload = await readJson(request); if (Object.keys(payload).some((key) => !["password", "user_id"].includes(key)) || payload.password !== "1234" || typeof payload.user_id !== "string") return json(response, 401, { status:"DENIED" }); const token = randomUUID(); sessions.set(token, { user_id:payload.user_id, expires_at:Date.now() + 43_200_000 }); response.writeHead(200, { "content-type":"application/json; charset=utf-8", "cache-control":"no-store", "set-cookie":`pilot_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200` }); return response.end(JSON.stringify({ status:"AUTHENTICATED" })); }
      const session = sessions.get(sessionToken(request));
      if (request.method === "GET" && url.pathname === "/api/pilot/session") return session && session.expires_at >= Date.now() ? json(response, 200, { status:"AUTHENTICATED" }) : json(response, 401, { status:"AUTHENTICATION_REQUIRED" });
      if (url.pathname.startsWith("/api/") && (!session || session.expires_at < Date.now())) return json(response, 401, { status:"AUTHENTICATION_REQUIRED" });
      if (request.method === "GET" && url.pathname === "/api/pilot/workspace") { const record = store.getWorkspace(session.user_id); return record ? json(response, 200, record) : json(response, 404, { status:"NOT_FOUND" }); }
      if (request.method === "PUT" && url.pathname === "/api/pilot/workspace") { const payload = await readJson(request, 2_000_000); if (!payload || Object.keys(payload).some((key) => key !== "state")) throw new Error("invalid workspace request"); return json(response, 200, { status:"SAVED", ...store.putWorkspace(session.user_id, payload.state) }); }
      if (request.method === "GET" && url.pathname === "/api/pilot/lifecycle") { const lifecycle = store.getLifecycle(session.user_id); return lifecycle ? json(response, 200, lifecycle) : json(response, 404, { status:"NOT_FOUND" }); }
      if (request.method === "GET" && url.pathname === "/api/pilot/guidance") { const guidance = store.getGuidance(session.user_id,url.searchParams.get("field_id"),url.searchParams.get("season_id")); return guidance ? json(response,200,{ status:"ok", authority:"SERVER", user_id:session.user_id, field_id:url.searchParams.get("field_id"), season_id:url.searchParams.get("season_id"), guidance }) : json(response,404,{ status:"NOT_FOUND" }); }
      if (request.method === "POST" && url.pathname === "/api/pilot/investigation-records") { const payload = await readJson(request, 256_000); if (!payload || Object.keys(payload).some((key) => !["record_type","record","request_id"].includes(key)) || !payload.record_type || !payload.record) throw contractError("invalid investigation record request"); const result = store.createInvestigationRecord(session.user_id,payload.record_type,payload.record,payload.request_id??null),wrapped=payload.request_id?result:{record:result,replayed:false}; return json(response,wrapped.replayed?200:201,{ status:wrapped.replayed?"IDEMPOTENT_REPLAY":"CREATED", authority:"SERVER", record_type:payload.record_type, ...wrapped }); }
      if (request.method === "PATCH" && url.pathname === "/api/pilot/investigation-records") { const payload = await readJson(request,256_000); if (!payload || Object.keys(payload).some((key)=>!["record_type","record_id","expected_revision","record","request_id"].includes(key)) || !payload.record_type || !payload.record_id || !Number.isInteger(payload.expected_revision) || !payload.record || !payload.request_id) throw contractError("invalid investigation update request"); const result=store.updateInvestigationRecord(session.user_id,payload.record_type,payload.record_id,payload.expected_revision,payload.record,payload.request_id); return json(response,200,{status:result.replayed?"IDEMPOTENT_REPLAY":"UPDATED",authority:"SERVER",record_type:payload.record_type,...result}); }
      if (request.method === "GET" && url.pathname === "/api/pilot/investigation-bundle") { const bundle = store.getInvestigationBundle(session.user_id,{ field_id:url.searchParams.get("field_id"), season_id:url.searchParams.get("season_id"), case_id:url.searchParams.get("case_id"), observation_id:url.searchParams.get("observation_id") }); return json(response,200,bundle); }
      if (request.method === "GET" && url.pathname === "/api/pilot/investigation-timeline") { const timeline = store.getInvestigationTimeline(session.user_id,{ field_id:url.searchParams.get("field_id"), season_id:url.searchParams.get("season_id"), case_id:url.searchParams.get("case_id") }); return json(response,200,timeline); }
      if (request.method === "GET" && url.pathname === "/api/pilot/summary") return json(response, 200, { status:"ok", ...store.summary(), ai_configured:Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith("YOUR_")), model:process.env.OPENAI_MODEL || "gpt-5.6-luna" });
      if (request.method === "GET" && url.pathname === "/api/pilot/data-catalog") return json(response, 200, JSON.parse(await readFile(resolve(ROOT, "data-catalog.json"), "utf8")));
      if (request.method === "GET" && url.pathname === "/api/knowledge/summary") return json(response, 200, { status:"ok", ...knowledge.summary() });
      if (request.method === "GET" && url.pathname === "/api/knowledge/search") return json(response, 200, { status:"ok", query:url.searchParams.get("q") ?? "", results:knowledge.search({ query:url.searchParams.get("q"), domain:url.searchParams.get("domain") || null }) });
      if (request.method === "GET" && url.pathname === "/api/knowledge/company-program") return json(response, 200, { status:"ok", ...knowledge.program(url.searchParams.get("stage_id") || null) });
      if (request.method === "POST" && url.pathname === "/api/pilot/feedback") { const payload = await readJson(request); if (!payload || Object.keys(payload).some((key) => !["route","subject_id","rating","category","note","storage_key"].includes(key))) throw new Error("invalid feedback"); return json(response, 201, { status:"SAVED", ...store.addFeedback(session.user_id, payload) }); }
      if (request.method === "POST" && url.pathname === "/api/pilot/feedback-evidence") { const payload = await readJson(request, 9_000_000), allowed = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp" }; if (!payload || Object.keys(payload).some((key) => !["original_filename","media_type","size_bytes","content_base64"].includes(key)) || !allowed[payload.media_type] || !Number.isInteger(payload.size_bytes) || payload.size_bytes > 6_000_000) throw new Error("invalid feedback evidence"); const bytes = Buffer.from(payload.content_base64, "base64"); if (bytes.length !== payload.size_bytes) throw new Error("invalid feedback evidence size"); const storageKey = `feedback-${randomUUID()}.${allowed[payload.media_type]}`; await writeFile(resolve(uploadDir, storageKey), bytes, { flag:"wx" }); return json(response, 201, { status:"STORED", storage_key:storageKey }); }
      if (request.method === "POST" && url.pathname === "/api/pilot/export") return json(response, 200, { status:"EXPORTED", ...(await store.exportAll()) });
      if (request.method === "POST" && url.pathname === "/api/pilot/backup") return json(response, 200, { status:"BACKED_UP", ...store.backup() });
      if (request.method === "POST" && url.pathname === "/api/pilot/evidence") { const payload = await readJson(request, 9_000_000), allowed = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp" }; if (!payload || Object.keys(payload).some((key) => !["field_id","season_id","original_filename","media_type","size_bytes","content_base64"].includes(key)) || !allowed[payload.media_type] || !Number.isInteger(payload.size_bytes) || payload.size_bytes > 6_000_000) throw new Error("invalid evidence"); const workspace = store.getWorkspace(session.user_id)?.state; if (!workspace?.fields?.some((item) => item.field_id === payload.field_id && item.owner_user_id === session.user_id) || !workspace?.seasons?.some((item) => item.season_id === payload.season_id && item.field_id === payload.field_id)) throw new Error("evidence context mismatch"); const bytes = Buffer.from(payload.content_base64, "base64"); if (bytes.length !== payload.size_bytes) throw new Error("invalid evidence size"); const storageKey = `${randomUUID()}.${allowed[payload.media_type]}`; await writeFile(resolve(uploadDir, storageKey), bytes, { flag:"wx" }); return json(response, 201, { status:"STORED", storage_key:storageKey, analysis_state:"NOT_ANALYZED" }); }
      if (request.method === "POST" && url.pathname === "/api/assistant/chat") return handleChat(request, response);
      if (request.method === "GET" || request.method === "HEAD") return serveStatic(request, response);
      return json(response, 405, { status:"METHOD_NOT_ALLOWED" });
    } catch (error) { if(url.pathname.startsWith("/api/pilot/investigation-")){ const code=error?.code??(error instanceof SyntaxError?"VALIDATION_ERROR":"SERVER_ERROR"),status=error?.status??(code==="VALIDATION_ERROR"?400:500),message=code==="AUTHORIZATION_ERROR"?"ไม่มีสิทธิ์เข้าถึงข้อมูลการตรวจนี้":code==="SERVER_ERROR"?"บริการบันทึกการตรวจไม่พร้อมใช้งาน":error.message; return json(response,status,{status:"ERROR",error_code:code,message}); } return json(response, 400, { status:"INVALID_REQUEST", message:"คำขอไม่ถูกต้อง" }); }
  });
  server.once("close", () => store.close());
  return new Promise((done, reject) => { server.once("error", reject); server.listen(selectedPort, selectedHost, () => done(server)); });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startServer().then(() => console.log(`SP Assistant pilot server ready at http://${process.env.PILOT_HOST ?? "127.0.0.1"}:${process.env.PORT ?? 4173}`)).catch((error) => { console.error(error.message); process.exitCode = 1; });
