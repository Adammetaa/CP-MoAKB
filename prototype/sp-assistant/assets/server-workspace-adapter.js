export class ServerWorkspaceAdapter {
  constructor(fetcher = (...args) => globalThis.fetch(...args), endpoint = "/api/pilot/workspace") { this.fetcher = fetcher; this.endpoint = endpoint; this.lastError = null; }
  async authenticate(password, userId) {
    const response = await this.fetcher("/api/pilot/session", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ password, user_id:userId }) });
    if (!response.ok) throw new Error("รหัสผ่านไม่ถูกต้อง");
    return response.json();
  }
  async hasSession() { const response = await this.fetcher("/api/pilot/session", { headers:{ accept:"application/json" } }); return response.ok; }
  async pull() {
    const response = await this.fetcher(this.endpoint, { headers: { accept: "application/json" } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูล Pilot จาก server");
    return (await response.json()).state;
  }
  async push(state) {
    try {
      const response = await this.fetcher(this.endpoint, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ state }) });
      if (!response.ok) throw new Error("pilot sync failed");
      this.lastError = null; return await response.json();
    } catch (error) { this.lastError = error; return { status: "PENDING_LOCAL", message: "ข้อมูลอยู่ในเครื่องและรอ sync" }; }
  }
  async uploadEvidence(file, context) {
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowed.has(file.type) || file.size > 6_000_000) throw new Error("รองรับเฉพาะ JPG, PNG หรือ WebP ขนาดไม่เกิน 6 MB");
    const bytes = new Uint8Array(await file.arrayBuffer()); let binary = ""; for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    const response = await this.fetcher("/api/pilot/evidence", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ field_id:context.field_id, season_id:context.season_id, original_filename:file.name, media_type:file.type, size_bytes:file.size, content_base64:btoa(binary) }) });
    const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message ?? "บันทึกภาพไม่สำเร็จ"); return payload;
  }
  async summary() { const response = await this.fetcher("/api/pilot/summary"); if (!response.ok) throw new Error("โหลดสถานะ Pilot ไม่สำเร็จ"); return response.json(); }
  async dataCatalog() { const response = await this.fetcher("/api/pilot/data-catalog"); if (!response.ok) throw new Error("โหลดสถานะข้อมูลไม่สำเร็จ"); return response.json(); }
  async feedback(payload) { const response = await this.fetcher("/api/pilot/feedback", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify(payload) }); if (!response.ok) throw new Error("บันทึก Feedback ไม่สำเร็จ"); return response.json(); }
  async exportData() { const response = await this.fetcher("/api/pilot/export", { method:"POST" }); if (!response.ok) throw new Error("Export ไม่สำเร็จ"); return response.json(); }
  async backup() { const response = await this.fetcher("/api/pilot/backup", { method:"POST" }); if (!response.ok) throw new Error("Backup ไม่สำเร็จ"); return response.json(); }
}
