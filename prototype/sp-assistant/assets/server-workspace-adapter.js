export class ServerWorkspaceAdapter {
  constructor(fetcher = (...args) => globalThis.fetch(...args), endpoint = "/api/pilot/workspace") { this.fetcher = fetcher; this.endpoint = endpoint; this.lastError = null; this.status = "UNKNOWN"; this.queue = Promise.resolve(); }
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
    const payload = await response.json(); this.status = "SERVER_AUTHORITATIVE"; this.lastError = null; return payload.state;
  }
  push(state) {
    const snapshot = structuredClone(state);
    this.status = "SYNCING";
    this.queue = this.queue.catch(() => null).then(async () => {
      try {
        const response = await this.fetcher(this.endpoint, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ state:snapshot }) });
        if (!response.ok) throw new Error("pilot sync failed");
        this.lastError = null; this.status = "SERVER_AUTHORITATIVE"; return await response.json();
      } catch (error) { this.lastError = error; this.status = "DEGRADED_CACHE"; return { status: "PENDING_LOCAL", message: "ข้อมูลนี้ยังอยู่ใน cache และยังไม่ยืนยันบน server" }; }
    });
    return this.queue;
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
  managementPath(scope, endpoint = "/api/pilot/management-options") { const query=new URLSearchParams({field_id:scope.field_id,season_id:scope.season_id,case_id:scope.case_id});return `${endpoint}?${query}`; }
  async getManagementOptions(scope) { const response=await this.fetcher(this.managementPath(scope),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดทางเลือกการจัดการที่กำกับไว้ไม่สำเร็จ");return response.json(); }
  async getManagementOptionHistory(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/management-option-history"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดประวัติทางเลือกการจัดการไม่สำเร็จ");return response.json(); }
  async getManagementReviewContext(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/management-review-context"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดบริบททบทวนการจัดการไม่สำเร็จ");return response.json(); }
  async governedWrite(endpoint,payload,errorMessage) { const response=await this.fetcher(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)}),body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.message??errorMessage);return body; }
  async createHumanDecision(payload) { return this.governedWrite("/api/pilot/human-decisions",payload,"บันทึกการตัดสินใจไม่สำเร็จ"); }
  async getHumanDecisionHistory(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/human-decision-history"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดประวัติการตัดสินใจไม่สำเร็จ");return response.json(); }
  async createManagementAction(payload) { return this.governedWrite("/api/pilot/management-actions",payload,"บันทึกการดำเนินการไม่สำเร็จ"); }
  async getManagementActionHistory(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/management-action-history"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดประวัติการดำเนินการไม่สำเร็จ");return response.json(); }
  async createOutcomeObservation(payload) { return this.governedWrite("/api/pilot/outcome-observations",payload,"บันทึกผลติดตามไม่สำเร็จ"); }
  async createOutcomeComparison(payload) { return this.governedWrite("/api/pilot/outcome-comparisons",payload,"บันทึกการเปรียบเทียบไม่สำเร็จ"); }
  async getOutcomeReview(managementActionId) { const response=await this.fetcher(`/api/pilot/outcome-review?${new URLSearchParams({management_action_id:managementActionId})}`,{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดการทบทวนผลลัพธ์ไม่สำเร็จ");return response.json(); }
  async getDecisionActionOutcomeContext(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/decision-action-outcome-context"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดบริบทการตัดสินใจไม่สำเร็จ");return response.json(); }
  async feedback(payload) { const response = await this.fetcher("/api/pilot/feedback", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify(payload) }); if (!response.ok) throw new Error("บันทึก Feedback ไม่สำเร็จ"); return response.json(); }
  async uploadFeedbackImage(file) {
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]); if (!allowed.has(file.type) || file.size > 6_000_000) throw new Error("รองรับ JPG, PNG หรือ WebP ขนาดไม่เกิน 6 MB");
    const bytes = new Uint8Array(await file.arrayBuffer()); let binary = ""; for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    const response = await this.fetcher("/api/pilot/feedback-evidence", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ original_filename:file.name, media_type:file.type, size_bytes:file.size, content_base64:btoa(binary) }) });
    const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message ?? "บันทึกภาพ Feedback ไม่สำเร็จ"); return payload;
  }
  async exportData() { const response = await this.fetcher("/api/pilot/export", { method:"POST" }); if (!response.ok) throw new Error("Export ไม่สำเร็จ"); return response.json(); }
  async backup() { const response = await this.fetcher("/api/pilot/backup", { method:"POST" }); if (!response.ok) throw new Error("Backup ไม่สำเร็จ"); return response.json(); }
}
