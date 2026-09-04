export class ServerWorkspaceAdapter {
  constructor(fetcher = (...args) => globalThis.fetch(...args), endpoint = "/api/pilot/workspace") { this.fetcher = fetcher; this.endpoint = endpoint; this.lastError = null; this.status = "UNKNOWN"; this.queue = Promise.resolve(); }
  async authenticate(password, loginId = null) {
    const body = loginId == null ? { password } : { password, login_id:loginId };
    const response = await this.fetcher("/api/pilot/session", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify(body) });
    if (!response.ok) throw new Error("รหัสผ่านไม่ถูกต้อง");
    return response.json();
  }
  async hasSession() { const response = await this.fetcher("/api/pilot/session", { headers:{ accept:"application/json" } }); return response.ok; }
  async logout() { const response=await this.fetcher("/api/pilot/session/logout",{method:"POST",headers:{accept:"application/json"}});if(!response.ok)throw new Error("ออกจากระบบไม่สำเร็จ กรุณาลองใหม่");return response.json(); }
  async session() { const response=await this.fetcher("/api/pilot/session",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("กรุณาเข้าสู่ระบบอีกครั้ง");return response.json(); }
  async capabilities() { const response=await this.fetcher("/api/pilot/capabilities",{headers:{accept:"application/json"}});if(!response.ok)throw new Error("โหลดสิทธิ์ความสามารถของระบบไม่สำเร็จ");return response.json(); }
  async lifecycle() { const response=await this.fetcher("/api/pilot/lifecycle",{headers:{accept:"application/json"}});if(response.status===404)return{authority:"SERVER",fields:[],seasons:[],guidance:[]};if(!response.ok)throw new Error("โหลดข้อมูลแปลงจากระบบไม่สำเร็จ");return response.json(); }
  async createField(input) { return this.governedWrite("/api/pilot/fields",input,"บันทึกแปลงบนระบบไม่สำเร็จ"); }
  async pull() {
    const response = await this.fetcher(this.endpoint, { headers: { accept: "application/json" } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูล Pilot จาก server");
    const payload = await response.json(); this.status = "SERVER_AUTHORITATIVE"; this.lastError = null; return payload.state;
  }
  push(state) {
    void state;
    this.status = "LOCAL_COMPATIBILITY_ONLY";
    this.queue = Promise.resolve({ status:"LOCAL_COMPATIBILITY_ONLY", authority:"BROWSER_CACHE_NOT_SERVER_CONFIRMED", message:"ข้อมูล cache ไม่สามารถเขียนทับประวัติที่กำกับไว้บน server" });
    return this.queue;
  }
  async uploadEvidence(file, context) {
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowed.has(file.type) || file.size > 6_000_000) throw new Error("รองรับเฉพาะ JPG, PNG หรือ WebP ขนาดไม่เกิน 6 MB");
    const bytes = new Uint8Array(await file.arrayBuffer()); let binary = ""; for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    const response = await this.fetcher("/api/pilot/evidence", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ field_id:context.field_id, season_id:context.season_id, original_filename:file.name, media_type:file.type, size_bytes:file.size, content_base64:btoa(binary) }) });
    const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message ?? "บันทึกภาพไม่สำเร็จ"); return payload;
  }
  async createInvestigationRecord(recordType,record,requestId=globalThis.crypto.randomUUID()) { return this.governedWrite("/api/pilot/investigation-records",{record_type:recordType,record,request_id:`spa-${requestId}`},"บันทึกข้อมูลการตรวจไม่สำเร็จ"); }
  async getInvestigationBundle(scope) { return this.scopedGet("/api/pilot/investigation-bundle",scope,"โหลดหลักฐานการตรวจไม่สำเร็จ"); }
  async getInvestigationAssessment(scope) { return this.scopedGet("/api/pilot/investigation-assessment",scope,"ประเมินหลักฐานการตรวจไม่สำเร็จ"); }
  async getGuidance(scope) { return this.scopedGet("/api/pilot/guidance",scope,"โหลดขั้นตอนถัดไปไม่สำเร็จ"); }
  scopedPath(endpoint,scope) { return `${endpoint}?${new URLSearchParams(Object.fromEntries(Object.entries(scope).filter(([,value])=>value!=null)))}`; }
  async scopedGet(endpoint,scope,errorMessage) { const response=await this.fetcher(this.scopedPath(endpoint,scope),{headers:{accept:"application/json"}}),body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.message??errorMessage);return body; }
  async uploadVisualEvidence(file,context,{observation_id=null,guidance_id=null,conversation_id=null,capture_intent="PLANT_CONTEXT",plant_part_scope="WHOLE_PLANT",spatial_scope="SAMPLED_OBJECT",view_type="DETAIL"}={}) {
    const allowed=new Set(["image/jpeg","image/png","image/webp"]);if(!allowed.has(file.type)||file.size>6_000_000)throw new Error("รองรับเฉพาะ JPG, PNG หรือ WebP ขนาดไม่เกิน 6 MB");
    const bytes=new Uint8Array(await file.arrayBuffer());let binary="";for(let index=0;index<bytes.length;index+=0x8000)binary+=String.fromCharCode(...bytes.subarray(index,index+0x8000));
    return this.governedWrite("/api/pilot/visual-evidence",{field_id:context.field_id,crop_season_id:context.season_id,case_id:context.case_id,conversation_id,observation_id,guidance_id,sampling_event_id:null,capture_session_id:null,site_reference:null,captured_at:new Date().toISOString(),source:"UPLOAD",capture_intent,plant_part_scope,spatial_scope,view_type,original_filename:file.name,media_type:file.type,size_bytes:file.size,width:null,height:null,orientation:null,comparison_pair_id:null,comparison_role:"UNKNOWN_ROLE",comparison_role_source:"UNKNOWN",content_base64:btoa(binary)},"บันทึก Visual Evidence ไม่สำเร็จ");
  }
  async getVisualEvidenceBundle(scope) { return this.scopedGet("/api/pilot/visual-evidence-bundle",{...scope,crop_season_id:scope.season_id,season_id:null},"โหลดสถานะภาพไม่สำเร็จ"); }
  async assessVisualEvidence(imageEvidenceId,assessment) { return this.governedWrite("/api/pilot/visual-evidence-assessments",{image_evidence_id:imageEvidenceId,assessment},"บันทึกการตรวจภาพไม่สำเร็จ"); }
  async reviewVisualEvidence(payload) { return this.governedWrite("/api/pilot/visual-evidence-reviews",payload,"บันทึกการทบทวนภาพไม่สำเร็จ"); }
  async getVisualRequest(scope) { return this.scopedGet("/api/pilot/visual-evidence-request",{...scope,crop_season_id:scope.season_id,season_id:null},"โหลดคำขอภาพไม่สำเร็จ"); }
  async requestVisualPerception(payload) { try{return await this.governedWrite("/api/pilot/visual-perception",payload,"ตัวช่วยอ่านภาพยังไม่พร้อม");}catch(error){return{status:"DEGRADED",analysis_performed:false,message:error.message};} }
  async summary() { const response = await this.fetcher("/api/pilot/summary"); if (!response.ok) throw new Error("โหลดสถานะ Pilot ไม่สำเร็จ"); return response.json(); }
  async dataCatalog() { const response = await this.fetcher("/api/pilot/data-catalog"); if (!response.ok) throw new Error("โหลดสถานะข้อมูลไม่สำเร็จ"); return response.json(); }
  managementPath(scope, endpoint = "/api/pilot/management-options") { return this.scopedPath(endpoint,scope); }
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
  async getLearningReviewDashboard(filters={}) { return this.scopedGet("/api/pilot/admin/learning-review/dashboard",filters,"โหลดกล่องข้อมูลไม่สำเร็จ"); }
  async getLearningReviewDetail(signalId) { return this.scopedGet("/api/pilot/admin/learning-review/detail",{signal_id:signalId},"โหลดรายละเอียดรายการไม่สำเร็จ"); }
  async createLearningReviewEvent(payload) { return this.governedWrite("/api/pilot/admin/learning-review/events",payload,"บันทึกผลทบทวนไม่สำเร็จ"); }
  async linkRelatedLearningSignal(payload) { return this.governedWrite("/api/pilot/admin/learning-review/relationships",payload,"เชื่อมรายการที่เกี่ยวข้องไม่สำเร็จ"); }
  async setLearningPriority(payload) { return this.governedWrite("/api/pilot/admin/learning-review/priorities",payload,"บันทึกลำดับงานไม่สำเร็จ"); }
  async getPendingLearningFollowup(scope) { return this.scopedGet("/api/pilot/learning-review-follow-up",scope,"โหลดคำขอข้อมูลเพิ่มไม่สำเร็จ"); }
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
