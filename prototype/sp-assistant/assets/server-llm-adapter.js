export class ServerLLMAdapter {
  constructor({ endpoint = "/api/pilot/conversation-turns", fetcher = (...args) => globalThis.fetch(...args), idProvider = () => globalThis.crypto.randomUUID() } = {}) { this.endpoint = endpoint; this.fetcher = fetcher; this.idProvider = idProvider; this.conversations = new Map(); }
  async resumeConversation(key,input) {
    if (this.conversations.has(key)) return this.conversations.get(key);
    try { const response=await this.fetcher("/api/pilot/conversations",{headers:{accept:"application/json"}}),payload=await response.json();if(response.ok){const match=(payload.conversations??[]).find((item)=>item.field_id===input.field_id&&item.season_id===input.season_id&&item.status==="ACTIVE");if(match){this.conversations.set(key,match.conversation_id);return match.conversation_id;}} } catch { /* A new governed conversation can still be created. */ }
    return null;
  }
  async chat(input) {
    try {
      const key = `${input.field_id ?? "none"}:${input.season_id ?? "none"}`, conversationId = await this.resumeConversation(key,input);
      const response = await this.fetcher(this.endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request_id:`browser-turn-${this.idProvider()}`, conversation_id:conversationId, message:input.message, entry_point:input.scope === "CASE_SCOPED" ? "CASE" : "FIELD", field_id:input.field_id ?? null, season_id:input.season_id ?? null, case_id:input.case_id ?? null, audience:input.audience ?? "SP" }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) return { status: "UNAVAILABLE", message: payload.message ?? "บริการ AI ยังไม่พร้อมใช้งาน" };
      if (payload.conversation_id) this.conversations.set(key,payload.conversation_id);
      return { status:"AVAILABLE", message:payload.text, provider:payload.provider?.provider_id, model:payload.provider?.provider_version, response_id:payload.turn_id, governed_response:payload };
    } catch { return { status: "UNAVAILABLE", message: "เชื่อมต่อบริการ AI ไม่สำเร็จ ข้อมูลแปลงและการสนทนาในเครื่องยังใช้งานได้" }; }
  }
  async analyze_image() { return { status: "UNAVAILABLE", analysis_performed: false, message: "รับรูปแล้ว แต่ระบบวิเคราะห์ภาพฝั่ง server จะเปิดในขั้นถัดไป" }; }
  async compose_explanation() { return { status: "UNAVAILABLE", message: "ใช้คำอธิบายจากกฎและหลักฐานที่กำกับไว้" }; }
}
