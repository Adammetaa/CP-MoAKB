(() => {
  "use strict";

  const ROLES = Object.freeze({ SUPPORTING: "SUPPORTING", REQUIRED_TO_DISTINGUISH: "REQUIRED_TO_DISTINGUISH", CONTRADICTING: "CONTRADICTING", CONTEXTUAL: "CONTEXTUAL", UNAVAILABLE: "UNAVAILABLE", UNRESOLVED: "UNRESOLVED" });
  const requirement = (cue, label, claim, evidence, locator) => ({ cue, label, claim, evidence, locator });
  const profiles = Object.freeze({
    "brown-spot": {
      domain: "Disease", level: "field-level provisional identification",
      required: [requirement("organ_leaf", "อาการอยู่ที่ใบ", "CL-RDC-003-O/v1", "EV-RDC-003A/v1; EV-RDC-003B/v1", "KU pp.15-18; RRC pp.3-4"), requirement("spot", "พบจุดหรือแผล", "CL-RDC-003-O/v1", "EV-RDC-003A/v1; EV-RDC-003B/v1", "KU pp.15-18; RRC pp.3-4"), requirement("brown_round_oval", "จุดสีน้ำตาลกลมหรือรูปไข่", "CL-RDC-003-O/v1", "EV-RDC-003A/v1; EV-RDC-003B/v1", "KU pp.15-18; RRC pp.3-4")],
      contextual: [["grain_symptom", "อาการที่เมล็ด"]], contradictions: [["eye_shaped_lesion", "แผลคล้ายรูปตาสอดคล้องกับ Candidate โรคไหม้มากกว่า"]],
      confirmation: "การยืนยันเชื้อสาเหตุต้องอาศัยผู้เชี่ยวชาญหรือวิธีตรวจที่เว็บไซต์ทำไม่ได้",
    },
    blast: {
      domain: "Disease", level: "field-level provisional identification",
      required: [requirement("organ_leaf", "อาการอยู่ที่ใบ", "CL-RDC-001-O/v1", "EV-RDC-001A/v1; EV-RDC-001B/v1", "KU pp.5-10; RRC pp.2-3"), requirement("spot", "พบจุดหรือแผล", "CL-RDC-001-O/v1", "EV-RDC-001A/v1; EV-RDC-001B/v1", "KU pp.5-10; RRC pp.2-3"), requirement("eye_shaped_lesion", "แผลคล้ายรูปตาหรือกระสวย", "CL-RDC-001-O/v1", "EV-RDC-001A/v1; EV-RDC-001B/v1", "KU pp.5-10; RRC pp.2-3"), requirement("gray_center", "กลางแผลสีเทา", "CL-RDC-001-O/v1", "EV-RDC-001A/v1; EV-RDC-001B/v1", "KU pp.5-10; RRC pp.2-3")],
      contextual: [["rain", "ความชื้นเป็นบริบทเอื้อ ไม่ใช่หลักฐานยืนยันโรค"]], contradictions: [["brown_round_oval", "จุดสีน้ำตาลกลมหรือรูปไข่สอดคล้องกับ Candidate ใบจุดสีน้ำตาลมากกว่า"]],
      confirmation: "อาการภาคสนามไม่ยืนยันเชื้อ Pyricularia; การยืนยันเชื้อสาเหตุต้องใช้วิธีที่เว็บไซต์ไม่มี",
    },
    leaffolder: {
      domain: "Insect", level: "field-level provisional identification",
      required: [requirement("organ_leaf", "ความเสียหายอยู่ที่ใบ", "CL-RIC-006-O/v1", "EV-RIC-006/v1", "RD printed pp.16-18 / PDF pp.27-29"), requirement("folded_leaf", "ใบถูกพับหรือห่อ", "CL-RIC-006-O/v1", "EV-RIC-006/v1", "RD printed pp.16-18 / PDF pp.27-29"), requirement("larva_or_feeding", "พบหนอนในใบหรือรอยกินสีขาว", "CL-RIC-006-O/v1", "EV-RIC-006/v1", "RD printed pp.16-18 / PDF pp.27-29")],
      contextual: [["rice_age", "ระยะข้าว"]], contradictions: [], confirmation: "รูปแบบความเสียหายอย่างเดียวไม่ยืนยันชนิด; ใช้ Tiny Insect Fallback เมื่อภาพตัวแมลงไม่ชัด",
    },
    "brown-planthopper": {
      domain: "Insect", level: "field-level provisional identification",
      required: [requirement("organ_stem", "ตรวจบริเวณโคนต้นเหนือระดับน้ำ", "CL-RIC-002-O/v1", "EV-RIC-002/v1", "RD printed pp.4-7 / PDF pp.15-18"), requirement("hopper", "พบเพลี้ยกระโดดบริเวณโคน", "CL-RIC-002-O/v1", "EV-RIC-002/v1", "RD printed pp.4-7 / PDF pp.15-18")],
      contextual: [["field_distribution", "ความเสียหายเป็นหย่อม"], ["wilt", "ต้นเหลืองหรือแห้ง"]], contradictions: [], confirmation: "การพบพาหะไม่ยืนยันการติดเชื้อไวรัส และอาการเสียหายอย่างเดียวไม่ยืนยันชนิดแมลง",
    },
    "sedge-group": {
      domain: "Weed", level: "group-level provisional identification",
      required: [requirement("weed_plant", "เป็นต้นวัชพืชในนาข้าว", "RL-RWC-019/v1", "EV-RWC-004/v1", "DOA printed p.3-45 / PDF p.50"), requirement("triangular_stem", "ลำต้นมีแนวโน้มเป็นสามเหลี่ยม", "RL-RWC-019/v1", "EV-RWC-004/v1", "DOA printed p.3-45 / PDF p.50")],
      contextual: [["inflorescence", "ลักษณะช่อดอก"]], contradictions: [["visible_node", "ข้อปล้องชัดต้องเปรียบเทียบกับกลุ่มหญ้า"]], confirmation: "ลักษณะกลุ่มไม่รองรับการอนุมานชื่อวิทยาศาสตร์หรือชนิดโดยอัตโนมัติ",
    },
    "rice-field-broadleaf": {
      domain: "Weed", level: "group-level provisional identification",
      required: [requirement("weed_plant", "เป็นต้นวัชพืชในนาข้าว", "CL-RWC-004-O/v1", "EV-RWC-003/v1; EV-RWC-004/v1", "DOA printed pp.3-44–3-45 / PDF pp.49-50"), requirement("broad_leaf", "ใบกว้าง", "CL-RWC-004-O/v1", "EV-RWC-003/v1; EV-RWC-004/v1", "DOA printed pp.3-44–3-45 / PDF pp.49-50")],
      contextual: [["inflorescence", "รูปใบ เส้นใบ ลำต้น ดอก และการเจริญ"]], contradictions: [["triangular_stem", "ลำต้นสามเหลี่ยมต้องเปรียบเทียบกับกลุ่มกก"]], confirmation: "หลักฐานรองรับเพียงกลุ่มใบกว้าง; ชื่อผักปอดนาและชื่อวิทยาศาสตร์ยังต้องตรวจลักษณะเพิ่ม",
    },
  });

  const has = (observations, cue) => cue === "larva_or_feeding" ? observations.includes("larva") || observations.includes("feeding_scar") : observations.includes(cue);
  function evaluateCandidate(candidate, observations) {
    const profile = profiles[candidate.key];
    if (!profile) return null;
    const required = profile.required.map((item) => ({ ...item, role: ROLES.REQUIRED_TO_DISTINGUISH, present: has(observations, item.cue) }));
    const supporting = required.filter((item) => item.present).map((item) => ({ ...item, role: ROLES.SUPPORTING }));
    const missing = required.filter((item) => !item.present);
    const contextual = profile.contextual.filter(([cue]) => has(observations, cue)).map(([cue, label]) => ({ cue, label, role: ROLES.CONTEXTUAL }));
    const contradicting = profile.contradictions.filter(([cue]) => has(observations, cue)).map(([cue, label]) => ({ cue, label, role: ROLES.CONTRADICTING }));
    let sufficiency = supporting.length ? "PARTIAL" : "INSUFFICIENT";
    if (supporting.length >= 2) sufficiency = "SUFFICIENT_FOR_COMPARISON";
    if (!missing.length && !contradicting.length) sufficiency = "SUFFICIENT_FOR_PROVISIONAL_IDENTIFICATION";
    return { key: candidate.key, name: candidate.name, domain: profile.domain, level: profile.level, sufficiency, identification: sufficiency === "SUFFICIENT_FOR_PROVISIONAL_IDENTIFICATION" ? "PROVISIONAL_IDENTIFICATION" : "IDENTIFICATION_NOT_SUPPORTED", supporting, required, missing, contradicting, contextual, alternativesUnresolved: missing.length > 0 || contradicting.length > 0, confirmation: profile.confirmation };
  }
  function evaluateSeverity(observations) {
    const burdenCues = ["distribution_single", "distribution_nearby", "field_distribution", "distribution_row", "distribution_edge", "deadheart", "whitehead", "wilt"];
    const evidence = burdenCues.filter((cue) => observations.includes(cue));
    return { status: evidence.length ? "OBSERVABLE_BURDEN_RECORDED" : "SEVERITY_EVIDENCE_INSUFFICIENT", evidence, thresholds: [], limitation: evidence.length ? "บันทึกภาระที่สังเกตได้เท่านั้น; ไม่มีเกณฑ์เชิงปริมาณสำหรับจัดระดับ" : "ยังขาดข้อมูลการกระจายหรือขอบเขตความเสียหายในแปลง" };
  }
  function evaluateAction(candidateGates, measurements) {
    const authority = window.SPDecisionAuthority;
    const provisional = candidateGates.find((gate) => gate.identification === "PROVISIONAL_IDENTIFICATION");
    if (!provisional) return { status: "MORE_EVIDENCE_REQUIRED", subject: null, evidence: null, requiredMeasurement: "provisional identification", observedValue: null, explanation: "Identification Gate ยังไม่รองรับการระบุเบื้องต้น", applicability: "NOT_APPLICABLE_YET" };
    const evidence = authority?.actionEvidence[provisional.key];
    if (!evidence || evidence.thaiApplicability !== "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION") {
      return { status: "NO_ACTION_DETERMINATION_SUPPORTED", subject: provisional.key, evidence: evidence ?? null, requiredMeasurement: evidence?.measurement ?? null, observedValue: null, explanation: authority?.unresolved[provisional.key] ?? "ACTION_THRESHOLD_UNRESOLVED", applicability: evidence?.thaiApplicability ?? "UNRESOLVED" };
    }
    const observedValue = measurements?.insectsPerPlant;
    if (!Number.isFinite(observedValue)) return { status: "MORE_EVIDENCE_REQUIRED", subject: provisional.key, evidence, requiredMeasurement: evidence.measurement, observedValue: null, explanation: `ต้องวัด ${evidence.measurement} ด้วยหน่วย ${evidence.unit}`, applicability: evidence.thaiApplicability };
    const thresholdMet = evidence.operator === ">=" && observedValue >= evidence.triggerValue;
    return { status: thresholdMet ? "MANAGEMENT_REVIEW_JUSTIFIED" : "CONTINUE_MONITORING", subject: provisional.key, evidence, requiredMeasurement: evidence.measurement, observedValue, explanation: thresholdMet ? `ค่าที่สังเกต ${observedValue} ${evidence.unit} ถึงเกณฑ์ ${evidence.triggerValue}` : `ค่าที่สังเกต ${observedValue} ${evidence.unit} ยังไม่ถึงเกณฑ์ ${evidence.triggerValue}`, applicability: evidence.thaiApplicability };
  }
  function evaluate(caseInput) {
    const observations = [...new Set(caseInput.observations || [])];
    const candidateGates = (caseInput.candidates || []).map((candidate) => evaluateCandidate(candidate, observations)).filter(Boolean);
    const severity = evaluateSeverity(observations);
    const failedControl = observations.includes("failed_control");
    const expertRequired = candidateGates.some((gate) => gate.alternativesUnresolved || gate.domain === "Disease") || failedControl;
    const nextGap = candidateGates.filter((gate) => !gate.contradicting.length).flatMap((gate) => gate.missing.map((item) => ({ ...item, candidate: gate.name })))[0];
    const actionDecision = evaluateAction(candidateGates, caseInput.measurements || {});
    actionDecision.basis = actionDecision.explanation;
    const registration = window.SPDecisionAuthority?.registration;
    const managementStatus = failedControl ? "HUMAN_REVIEW_REQUIRED" : actionDecision.status === "MANAGEMENT_REVIEW_JUSTIFIED" ? "MANAGEMENT_REVIEW_JUSTIFIED" : actionDecision.status === "MORE_EVIDENCE_REQUIRED" ? "MORE_EVIDENCE_REQUIRED" : "MANAGEMENT_REMAINS_BLOCKED";
    return {
      model: "bounded-case-projection/v1", evidenceRoles: Object.values(ROLES), candidateGates, severity,
      needForAction: actionDecision,
      management: { status: managementStatus, chemicalGate: registration?.chemicalGate ?? "CHEMICAL_REVIEW_BLOCKED", chemicalRecommendation: "BLOCKED", eligibleOptions: registration?.eligibleOptions ?? [], registrationStatus: registration?.status ?? "REGISTRATION_AUTHORITY_UNAVAILABLE", limitation: `${registration?.status ?? "REGISTRATION_AUTHORITY_UNAVAILABLE"} · ${registration?.chemicalGate ?? "CHEMICAL_REVIEW_BLOCKED"} · ${registration?.limitation ?? "Crop–Target–Use–Registration authority ยังไม่สมบูรณ์; ไม่เลือกสาร ผลิตภัณฑ์ อัตรา หรือโปรแกรมพ่น"}` },
      humanReview: { required: expertRequired, reasons: [failedControl ? "failed-control investigation" : null, candidateGates.some((gate) => gate.domain === "Disease") ? "causal confirmation unavailable in website" : null, candidateGates.some((gate) => gate.alternativesUnresolved) ? "distinguishing evidence or alternatives unresolved" : null].filter(Boolean) },
      nextBestEvidence: nextGap ? { action: "ASK_OBSERVATION", cue: nextGap.cue, label: nextGap.label, candidate: nextGap.candidate, reason: "ข้อมูลนี้เป็น REQUIRED_TO_DISTINGUISH และเปลี่ยนผลของ Identification Gate ได้" } : { action: "EXPERT_REVIEW", reason: "ไม่มี gap ที่ระบบมีคำถามรองรับเพิ่มเติม หรือการยืนยันต้องใช้ผู้เชี่ยวชาญ" },
      boundaries: ["Candidate ≠ Diagnosis", "Severity ≠ Need-for-Action", "Need-for-Action ≠ pesticide recommendation", "Weather alone cannot escalate identification", "Nearby Case cannot escalate identification", "Photo received ≠ Photo analyzed", "CONTROL FAILURE ≠ RESISTANCE"],
    };
  }
  window.SPDecisionGates = Object.freeze({ evaluate, profiles, roles: ROLES });
})();
