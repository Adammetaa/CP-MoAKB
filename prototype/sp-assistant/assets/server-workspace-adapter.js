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
  async createFollowUpPlan(payload) { return this.governedWrite("/api/pilot/follow-up-plans",payload,"บันทึกแผนติดตามไม่สำเร็จ"); }
  async getFollowUpPlans(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/follow-up-plans"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดแผนติดตามไม่สำเร็จ");return response.json(); }
  async getFollowUpHistory(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/follow-up-history"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดประวัติแผนติดตามไม่สำเร็จ");return response.json(); }
  async createReminder(payload) { return this.governedWrite("/api/pilot/reminders",payload,"ตั้งการเตือนไม่สำเร็จ"); }
  async actOnReminder(payload) { return this.governedWrite("/api/pilot/reminder-actions",payload,"บันทึกสถานะการเตือนไม่สำเร็จ"); }
  async getReminders(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/reminders"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดการเตือนไม่สำเร็จ");return response.json(); }
  async getReminderHistory(followUpPlanId) { const response=await this.fetcher(`/api/pilot/reminder-history?${new URLSearchParams({follow_up_plan_id:followUpPlanId})}`,{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดประวัติการเตือนไม่สำเร็จ");return response.json(); }
  async getDueReminders(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/reminder-due"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดการเตือนที่ถึงกำหนดไม่สำเร็จ");return response.json(); }
  async getAuthoritativeTimeline(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/timeline"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดไทม์ไลน์ไม่สำเร็จ");return response.json(); }
  async getFollowUpReminderContext(scope) { const response=await this.fetcher(this.managementPath(scope,"/api/pilot/follow-up-reminder-context"),{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดบริบทติดตามไม่สำเร็จ");return response.json(); }
  async createCrossCaseComparison(payload) { return this.governedWrite("/api/pilot/cross-case-comparisons",payload,"บันทึกการเปรียบเทียบข้ามเคสไม่สำเร็จ"); }
  async getCrossCaseComparisons() { const response=await this.fetcher("/api/pilot/cross-case-comparisons",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดการเปรียบเทียบข้ามเคสไม่สำเร็จ");return response.json(); }
  async createLocalPatternCandidate(payload) { return this.governedWrite("/api/pilot/local-pattern-candidates",payload,"บันทึกรูปแบบในพื้นที่ที่รอทบทวนไม่สำเร็จ"); }
  async getLocalPatternCandidates() { const response=await this.fetcher("/api/pilot/local-pattern-candidates",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดรูปแบบในพื้นที่ไม่สำเร็จ");return response.json(); }
  async createLocalPatternAdjudication(payload) { return this.governedWrite("/api/pilot/local-pattern-adjudications",payload,"บันทึกการทบทวนรูปแบบในพื้นที่ไม่สำเร็จ"); }
  async getLocalPatternContext(candidateId) { const response=await this.fetcher(`/api/pilot/local-pattern-context?${new URLSearchParams({local_pattern_candidate_id:candidateId})}`,{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดบริบทรูปแบบในพื้นที่ไม่สำเร็จ");return response.json(); }
  async getLocalPatternGaps(candidateId) { const response=await this.fetcher(`/api/pilot/local-pattern-gaps?${new URLSearchParams({local_pattern_candidate_id:candidateId})}`,{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดช่องว่างหลักฐานไม่สำเร็จ");return response.json(); }
  async getSpatialPatternProjection(candidateId) { const response=await this.fetcher(`/api/pilot/spatial-pattern-projection?${new URLSearchParams({local_pattern_candidate_id:candidateId})}`,{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดมุมมองพื้นที่แบบคุ้มครองข้อมูลไม่สำเร็จ");return response.json(); }
  async interpretLearningIntent(text) { return this.governedWrite("/api/pilot/learning-intent",{text},"ตีความคำขอเก็บความรู้ไม่สำเร็จ"); }
  async createLearningNomination(payload) { return this.governedWrite("/api/pilot/learning-nominations",payload,"บันทึก Learning Candidate ไม่สำเร็จ"); }
  async getLearningNominations() { const response=await this.fetcher("/api/pilot/learning-nominations",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลด Learning Inbox ไม่สำเร็จ");return response.json(); }
  async getKnowledgeGaps() { const response=await this.fetcher("/api/pilot/knowledge-gaps",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดทะเบียนช่องว่างความรู้ไม่สำเร็จ");return response.json(); }
  async getKnowledgeWorkQueue() { const response=await this.fetcher("/api/pilot/knowledge-work-queue",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดคิวงานความรู้ไม่สำเร็จ");return response.json(); }
  async createReviewedCaseBundle(payload) { return this.governedWrite("/api/pilot/reviewed-case-bundles",payload,"บันทึกชุดเคสที่ตรวจทานแล้วไม่สำเร็จ"); }
  async getReviewedCaseBundles() { const response=await this.fetcher("/api/pilot/reviewed-case-bundles",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดชุดเคสที่ตรวจทานแล้วไม่สำเร็จ");return response.json(); }
  async createKnowledgeAssertionCandidate(payload) { return this.governedWrite("/api/pilot/knowledge-assertion-candidates",payload,"บันทึกข้อเสนอข้อความรู้ไม่สำเร็จ"); }
  async getKnowledgeAssertionCandidates() { const response=await this.fetcher("/api/pilot/knowledge-assertion-candidates",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดข้อเสนอข้อความรู้ไม่สำเร็จ");return response.json(); }
  async createKnowledgePromotionReview(payload) { return this.governedWrite("/api/pilot/knowledge-promotion-reviews",payload,"บันทึกการทบทวนเลื่อนสถานะความรู้ไม่สำเร็จ"); }
  async getKnowledgePromotionHistory() { const response=await this.fetcher("/api/pilot/knowledge-promotion-history",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดประวัติการเลื่อนสถานะความรู้ไม่สำเร็จ");return response.json(); }
  async getKnowledgeGraph(subjectEntityId=null) { const query=subjectEntityId?"?"+new URLSearchParams({subject_entity_id:subjectEntityId}):"";const response=await this.fetcher("/api/pilot/knowledge-graph"+query,{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดกราฟความรู้ไม่สำเร็จ");return response.json(); }
  async getKnowledgeGraphContext(subjectEntityId=null) { const query=subjectEntityId?"?"+new URLSearchParams({subject_entity_id:subjectEntityId}):"";const response=await this.fetcher("/api/pilot/knowledge-graph-context"+query,{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดบริบทกราฟความรู้ไม่สำเร็จ");return response.json(); }
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
