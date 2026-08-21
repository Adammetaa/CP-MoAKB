import { DatabaseSync } from "node:sqlite";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const COLLECTIONS = ["users", "fields", "seasons", "activities", "cases", "observations", "evidence", "conversations", "messages", "guidance", "decision_logs", "case_summaries", "weather_snapshots"];

function safeId(value, name = "id") {
  if (typeof value !== "string" || !/^[A-Za-z0-9._:-]{1,128}$/.test(value)) throw new Error(`invalid ${name}`);
  return value;
}

function safeWorkspace(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) throw new Error("invalid workspace");
  const copy = structuredClone(state);
  const forbidden = /password|api.?key|authorization|secret/i;
  const inspect = (value) => {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (forbidden.test(key)) throw new Error("secret fields are not accepted");
      if (typeof child === "string" && child.length > 20_000) throw new Error("workspace string too large");
      inspect(child);
    }
  };
  inspect(copy);
  return copy;
}

export class PilotStore {
  constructor({ dbPath, exportDir }) {
    this.dbPath = resolve(dbPath);
    this.exportDir = resolve(exportDir);
    this.db = null;
  }
  async open() {
    await mkdir(dirname(this.dbPath), { recursive: true });
    await mkdir(this.exportDir, { recursive: true });
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS pilot_workspaces (user_id TEXT PRIMARY KEY, state_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS pilot_events (event_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, event_type TEXT NOT NULL, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS pilot_feedback (feedback_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, route TEXT NOT NULL, subject_id TEXT, rating TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS pilot_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);");
    const feedbackColumns = new Set(this.db.prepare("PRAGMA table_info(pilot_feedback)").all().map((column) => column.name));
    if (!feedbackColumns.has("category")) this.db.exec("ALTER TABLE pilot_feedback ADD COLUMN category TEXT");
    if (!feedbackColumns.has("storage_key")) this.db.exec("ALTER TABLE pilot_feedback ADD COLUMN storage_key TEXT");
    return this;
  }
  getWorkspace(userId) {
    safeId(userId, "user_id");
    const row = this.db.prepare("SELECT state_json, updated_at FROM pilot_workspaces WHERE user_id = ?").get(userId);
    return row ? { state: JSON.parse(row.state_json), updated_at: row.updated_at } : null;
  }
  putWorkspace(userId, state) {
    safeId(userId, "user_id");
    const governed = safeWorkspace(state), now = new Date().toISOString();
    this.db.prepare("INSERT INTO pilot_workspaces(user_id,state_json,created_at,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET state_json=excluded.state_json, updated_at=excluded.updated_at").run(userId, JSON.stringify(governed), now, now);
    this.db.prepare("INSERT INTO pilot_events(user_id,event_type,created_at) VALUES(?,?,?)").run(userId, "WORKSPACE_SAVED", now);
    return { user_id: userId, updated_at: now };
  }
  summary() {
    const rows = this.db.prepare("SELECT state_json FROM pilot_workspaces").all(), totals = Object.fromEntries(COLLECTIONS.map((key) => [key, 0]));
    for (const row of rows) { const state = JSON.parse(row.state_json); for (const key of COLLECTIONS) totals[key] += Array.isArray(state[key]) ? state[key].length : 0; }
    const meta = Object.fromEntries(this.db.prepare("SELECT key,value FROM pilot_meta").all().map((row) => [row.key, row.value]));
    const feedback = this.db.prepare("SELECT COUNT(*) AS count FROM pilot_feedback").get().count;
    const feedback_by_category = Object.fromEntries(this.db.prepare("SELECT COALESCE(category,'OTHER') AS category, COUNT(*) AS count FROM pilot_feedback GROUP BY COALESCE(category,'OTHER')").all().map((item) => [item.category,item.count]));
    return { workspaces: rows.length, ...totals, feedback, feedback_by_category, storage_mode:"LOCAL_SQLITE", storage_path:this.dbPath, last_export_at: meta.last_export_at ?? null, last_backup_at: meta.last_backup_at ?? null };
  }
  addFeedback(userId, { route, subject_id = null, rating, category = "OTHER", note = null, storage_key = null }) {
    safeId(userId, "user_id");
    if (typeof route !== "string" || !/^[a-z-]{1,40}$/.test(route)) throw new Error("invalid feedback route");
    if (subject_id != null) safeId(subject_id, "subject_id");
    if (!["WORKS", "MISMATCH", "NEEDS_DATA"].includes(rating)) throw new Error("invalid feedback rating");
    if (!["MAP","CHAT","INSPECTION","SOLUTION","MOBILE_UI","PERFORMANCE","OTHER"].includes(category)) throw new Error("invalid feedback category");
    if (note != null && (typeof note !== "string" || note.length > 500)) throw new Error("invalid feedback note");
    if (storage_key != null) safeId(storage_key, "storage_key");
    const feedback_id = `feedback-${crypto.randomUUID()}`, created_at = new Date().toISOString();
    this.db.prepare("INSERT INTO pilot_feedback(feedback_id,user_id,route,subject_id,rating,note,created_at,category,storage_key) VALUES(?,?,?,?,?,?,?,?,?)").run(feedback_id, userId, route, subject_id, rating, note?.trim() || null, created_at, category, storage_key);
    return { feedback_id, rating, category, storage_key, created_at };
  }
  async exportAll() {
    const rows = this.db.prepare("SELECT user_id,state_json,updated_at FROM pilot_workspaces ORDER BY user_id").all().map((row) => ({ user_id: row.user_id, updated_at: row.updated_at, state: JSON.parse(row.state_json) }));
    const createdAt = new Date().toISOString(), stamp = createdAt.replace(/[:.]/g, "-");
    const jsonName = `pilot-export-${stamp}.json`;
    await writeFile(resolve(this.exportDir, jsonName), JSON.stringify({ schema_version: 1, created_at: createdAt, workspaces: rows }, null, 2), "utf8");
    for (const collection of COLLECTIONS) {
      const records = rows.flatMap((row) => (row.state[collection] ?? []).map((record) => ({ workspace_user_id: row.user_id, ...record })));
      const keys = [...new Set(records.flatMap(Object.keys))], escape = (value) => `"${String(value == null ? "" : typeof value === "object" ? JSON.stringify(value) : value).replaceAll('"', '""')}"`;
      const csv = [keys.map(escape).join(","), ...records.map((record) => keys.map((key) => escape(record[key])).join(","))].join("\r\n");
      await writeFile(resolve(this.exportDir, `${collection}-${stamp}.csv`), `\ufeff${csv}`, "utf8");
    }
    const feedback = this.db.prepare("SELECT * FROM pilot_feedback ORDER BY created_at").all(), feedbackKeys = ["feedback_id","user_id","route","subject_id","rating","category","note","storage_key","created_at"], escapeFeedback = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    await writeFile(resolve(this.exportDir, `pilot-feedback-${stamp}.csv`), `\ufeff${[feedbackKeys.map(escapeFeedback).join(","), ...feedback.map((record) => feedbackKeys.map((key) => escapeFeedback(record[key])).join(","))].join("\r\n")}`, "utf8");
    this.db.prepare("INSERT INTO pilot_meta(key,value) VALUES('last_export_at',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(createdAt);
    return { created_at: createdAt, json_file: jsonName, collections: COLLECTIONS };
  }
  backup() {
    const createdAt = new Date().toISOString(), stamp = createdAt.replace(/[:.]/g, "-"), name = `pilot-backup-${stamp}.sqlite`, path = resolve(this.exportDir, name);
    this.db.exec(`VACUUM INTO '${path.replaceAll("'", "''")}'`);
    this.db.prepare("INSERT INTO pilot_meta(key,value) VALUES('last_backup_at',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(createdAt);
    return { created_at: createdAt, backup_file: name };
  }
  close() { this.db?.close(); this.db = null; }
}

export { safeWorkspace };
