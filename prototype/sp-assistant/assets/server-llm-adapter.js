export class ServerLLMAdapter {
  constructor({ endpoint = "/api/assistant/chat", fetcher = (...args) => globalThis.fetch(...args) } = {}) { this.endpoint = endpoint; this.fetcher = fetcher; }
  async chat(input) {
    try {
      const response = await this.fetcher(this.endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: input.message, scope: input.scope, field_id: input.field_id ?? null, season_id: input.season_id ?? null }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) return { status: "UNAVAILABLE", message: payload.message ?? "บริการ AI ยังไม่พร้อมใช้งาน" };
      return payload;
    } catch { return { status: "UNAVAILABLE", message: "เชื่อมต่อบริการ AI ไม่สำเร็จ ข้อมูลแปลงและการสนทนาในเครื่องยังใช้งานได้" }; }
  }
  async analyze_image() { return { status: "UNAVAILABLE", analysis_performed: false, message: "รับรูปแล้ว แต่ระบบวิเคราะห์ภาพฝั่ง server จะเปิดในขั้นถัดไป" }; }
  async compose_explanation() { return { status: "UNAVAILABLE", message: "ใช้คำอธิบายจากกฎและหลักฐานที่กำกับไว้" }; }
}
