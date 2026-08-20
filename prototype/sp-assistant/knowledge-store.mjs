import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PACKAGES = Object.freeze({
  DISEASE: new URL("../knowledge-explorer/assets/data/rice-disease-corpus-001.json", import.meta.url),
  INSECT: new URL("../knowledge-explorer/assets/data/rice-insect-corpus-001.json", import.meta.url),
  WEED: new URL("../knowledge-explorer/assets/data/rice-weed-corpus-001.json", import.meta.url),
});

function text(value) { return String(value ?? "").normalize("NFC").toLocaleLowerCase("th-TH"); }
function boundedSubject(domain, subject, pack) {
  return {
    record_id:`${domain}:${subject.key}`, domain, key:subject.key, name:subject.name,
    english:subject.english ?? null, scientific:subject.scientific ?? null,
    observation:subject.observation ?? subject.coverage ?? subject.characters ?? null,
    context:subject.context ?? null, group:subject.group ?? null,
    source_locators:subject.sources ?? subject.pages ?? null,
    sources:pack.sources, review_state:pack.meta.status, rights:pack.meta.rights,
    limitations:["ข้อมูลนี้ช่วยจัดสิ่งที่ควรสังเกต ไม่ใช่การยืนยันการวินิจฉัย", "ไม่มีคำแนะนำผลิตภัณฑ์ อัตราใช้ หรือการตัดสินใจจัดการจากผลค้นหานี้"],
  };
}

export class PilotKnowledgeStore {
  constructor() { this.packages = new Map(); this.manifest = null; this.companyProgram = null; }
  async open() {
    for (const [domain, url] of Object.entries(PACKAGES)) { const pack = JSON.parse(await readFile(fileURLToPath(url), "utf8")); if (pack.meta?.status !== "accepted-internal-not-published") throw new Error("knowledge package review state is not allowed"); this.packages.set(domain, pack); }
    this.manifest = JSON.parse(await readFile(new URL("./source-manifest.json", import.meta.url), "utf8"));
    this.companyProgram = JSON.parse(await readFile(new URL("./company-rice-program.json", import.meta.url), "utf8"));
    if (this.companyProgram.status !== "accepted-internal-pilot") throw new Error("company program review state is not allowed");
    return this;
  }
  summary() { return { manifest_version:this.manifest.manifest_version, sources:this.manifest.sources.length, packages:[...this.packages].map(([domain, pack]) => ({ domain, subjects:pack.subjects.length, review_state:pack.meta.status })) }; }
  search({ query, domain, limit = 20 }) {
    const normalized = text(query); if (!normalized || normalized.length > 120) throw new Error("invalid knowledge query");
    const domains = domain ? [String(domain).toUpperCase()] : [...this.packages.keys()]; if (domains.some((item) => !this.packages.has(item))) throw new Error("invalid knowledge domain");
    return domains.flatMap((item) => { const pack = this.packages.get(item); return pack.subjects.map((subject) => boundedSubject(item, subject, pack)); }).filter((record) => text([record.name,record.english,record.scientific,record.observation,record.context,record.group].join(" ")).includes(normalized)).slice(0, Math.min(Number(limit) || 20, 20));
  }
  program(stageId = null) {
    const stages = stageId ? this.companyProgram.stages.filter((stage) => stage.stage_id === stageId) : this.companyProgram.stages;
    if (stageId && stages.length !== 1) throw new Error("invalid company program stage");
    return { schema_version:this.companyProgram.schema_version, status:this.companyProgram.status, title:this.companyProgram.title, sources:this.companyProgram.sources, governance:this.companyProgram.governance, stages };
  }
}
