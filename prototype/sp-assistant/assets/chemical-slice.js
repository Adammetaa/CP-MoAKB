(() => {
  "use strict";

  const VERIFIED_AT = "2026-08-14";
  const products = Object.freeze([
    Object.freeze({
      id: "PRODUCT-CT-DAMUZIN-50WG-LEAD-001",
      product: "Damuzin / ดามูซิน",
      manufacturer: "Chia Tai Co., Ltd. — distributor in official record; official manufacturer product artifact not supplied",
      activeIngredient: "pymetrozine",
      formulation: "50% WG",
      moa: "IRAC 9B",
      registrationNumber: "1372-2565",
      registrationHistory: [
        { issueDate: "2022-07-04", expiryDate: "2031-07-03", cancellationDate: null, sourceRow: 20214 },
      ],
      registrant: "Nano Gold Co., Ltd.",
      importer: "Millennium Farm Co., Ltd.",
      distributor: "Chia Tai Co., Ltd.",
      crop: null,
      target: null,
      rate: null,
      rateBasis: "UNRESOLVED — no same-registration approved label supplied",
      timing: null,
      useGuidance: null,
      cautions: [],
      sources: [
        { authorityClass: "PROJECT_OWNER_PRODUCT_LEAD", id: "SPRINT-097-PRIMARY-CANDIDATE", locator: "Damuzin / pymetrozine / 50% WG / registration lead 1372-2565", verifiedAt: VERIFIED_AT },
        { authorityClass: "THAI_REGULATORY_RECORD", id: "GS-DOA-HAZARDOUS-REGISTRY-2568-001/v1", locator: "row 20214 / PDF p.3688; snapshot 2025-09-15", verifiedAt: VERIFIED_AT },
        { authorityClass: "MOA_AUTHORITY", id: "GS-IRAC-MOA-11.5-001/v1", locator: "pymetrozine — Group 9B", verifiedAt: VERIFIED_AT },
      ],
      requiredArtifact: "Front and back of the current DOA-approved label or certificate for registration 1372-2565, including registration number, rice, brown planthopper, rate, timing and cautions in the identity and use-direction panels.",
    }),
    Object.freeze({
      id: "PRODUCT-SYN-PLENUM-50WG-001",
      product: "Plenum 50 WG / เพลนั่ม 50 ดับบลิวจี",
      manufacturer: "Syngenta Crop Protection Co., Ltd.",
      activeIngredient: "pymetrozine",
      formulation: "50% WG",
      moa: "IRAC 9B",
      registrationNumber: "405-2555",
      registrationHistory: [
        { issueDate: "2018-03-23", expiryDate: "2024-03-22", cancellationDate: null, sourceRow: 765 },
      ],
      crop: "rice / ข้าว",
      target: "brown planthopper / เพลี้ยกระโดดสีน้ำตาล",
      rate: "20 g / 20 L water",
      rateBasis: "official DOA crop-target guidance fact; not a Case-specific dose",
      timing: null,
      useGuidance: "The retained official guidance supports crop, target, ingredient, formulation and rate as separate source facts.",
      cautions: [],
      sources: [
        { authorityClass: "THAI_REGULATORY_RECORD", id: "GS-DOA-HAZARDOUS-REGISTRY-2568-001/v1", locator: "row 765 / PDF p.136", verifiedAt: VERIFIED_AT },
        { authorityClass: "REGULATORY_SUPPORTING_OFFICIAL", id: "GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1", locator: "rice — brown planthopper entry", verifiedAt: VERIFIED_AT },
        { authorityClass: "MOA_AUTHORITY", id: "GS-IRAC-MOA-11.5-001/v1", locator: "pymetrozine — Group 9B", verifiedAt: VERIFIED_AT },
        { authorityClass: "MANUFACTURER_USE_GUIDANCE", id: "MS-SYN-PLENUM-001/v1", locator: "retained manufacturer identity/use lead", verifiedAt: VERIFIED_AT },
      ],
    }),
  ]);

  function resolveRegistrationHistory(records, asOf = VERIFIED_AT) {
    if (!Array.isArray(records) || !records.length) return { state: "NO_CURRENT_RECORD_ESTABLISHED", record: null };
    const ordered = [...records].sort((a, b) => String(a.issueDate || "").localeCompare(String(b.issueDate || "")) || Number(a.sourceRow || 0) - Number(b.sourceRow || 0));
    const uncancelled = ordered.filter((record) => !record.cancellationDate || record.cancellationDate > asOf);
    const current = uncancelled.filter((record) => record.issueDate <= asOf && (!record.expiryDate || record.expiryDate >= asOf));
    if (current.length > 1) return { state: "AMBIGUOUS_HISTORY", record: null, records: current };
    if (current.length === 1) return { state: "CURRENT_RECORD_SUPPORTED", record: current[0] };
    const latest = ordered.at(-1);
    if (latest.cancellationDate && latest.cancellationDate <= asOf) return { state: "CANCELLED", record: latest };
    if (latest.expiryDate && latest.expiryDate < asOf) return { state: "EXPIRED", record: latest };
    return { state: "HUMAN_REVIEW_REQUIRED", record: latest };
  }

  function evaluateProductEligibility(product) {
    const registration = resolveRegistrationHistory(product.registrationHistory);
    const identityFields = [product.registrationNumber, product.product, product.activeIngredient, product.formulation];
    const exactIdentity = identityFields.every(Boolean) && product.identityMismatch !== true;
    if (!exactIdentity) return { registration, state: "IDENTITY_MISMATCH", keyB: false };
    if (registration.state !== "CURRENT_RECORD_SUPPORTED") return { registration, state: registration.state === "NO_CURRENT_RECORD_ESTABLISHED" ? "CURRENT_REGISTRATION_UNRESOLVED" : registration.state, keyB: false };
    const officialCtu = product.officialCtu?.authorityClass === "REGULATORY_AUTHORITY" && product.officialCtu.registrationNumber === product.registrationNumber && product.officialCtu.crop === "rice" && product.officialCtu.target === "brown-planthopper" && product.officialCtu.authorizedUse === true;
    if (!officialCtu) return { registration, state: "REGULATORY_CTU_CONFIRMATION_PENDING", keyB: false };
    return { registration, state: "REGULATORY_ELIGIBLE", keyB: true };
  }

  function evaluate(caseEvidence = {}) {
    const isBph = caseEvidence.isBph === true;
    const activity = caseEvidence.currentActivity === "found";
    const count = Number(caseEvidence.insectsPerPlant);
    const burdenKnown = Number.isFinite(count) && count >= 0;
    const fallbackDecision = !isBph || !activity || !burdenKnown ? "MORE_CASE_EVIDENCE_REQUIRED" : count >= 10 ? "MANAGEMENT_REVIEW_JUSTIFIED" : "CONTINUE_MONITORING";
    const pipelineDecision = caseEvidence.decision?.needForAction;
    const needForAction = ["CONTINUE_MONITORING", "MANAGEMENT_REVIEW_JUSTIFIED"].includes(pipelineDecision?.status) ? pipelineDecision.status : fallbackDecision;
    const managementReview = needForAction === "MANAGEMENT_REVIEW_JUSTIFIED";
    const previousTreatmentKnown = Boolean(caseEvidence.previousTreatment);
    const candidates = managementReview && previousTreatmentKnown ? products.map((product) => {
      const eligibility = evaluateProductEligibility(product);
      return {
        ...product,
        registrationState: eligibility.registration.state,
        regulatoryCtuState: eligibility.state,
        optionState: eligibility.keyB ? "ELIGIBLE_FOR_DECISION_REVIEW" : "BLOCKED_BY_AUTHORITY",
        suitability: eligibility.keyB ? "REGULATORY_ELIGIBLE" : "MORE_EVIDENCE_REQUIRED",
        limitations: [
          `registration history resolves to ${eligibility.registration.state}`,
          "no official approved label binds registration number to Crop × Target × Use",
          "timing and manufacturer cautions are not established in the retained governed artifact",
          "the 10 insects/plant evidence has a known sampling-unit limitation",
        ],
      };
    }) : [];
    const keyB = candidates.some((candidate) => candidate.optionState === "ELIGIBLE_FOR_DECISION_REVIEW");
    return {
      needForAction,
      managementReview,
      observedCount: burdenKnown ? count : pipelineDecision?.observedValue ?? null,
      criterion: pipelineDecision?.evidence?.triggerValue ?? 10,
      decisionExplanation: pipelineDecision?.explanation ?? null,
      actionEvidence: pipelineDecision?.evidence ?? null,
      previousTreatment: caseEvidence.previousTreatment || null,
      chemicalReview: managementReview ? "CHEMICAL_MANAGEMENT_REVIEW" : "NOT_OPEN",
      keyA: managementReview,
      keyB,
      options: candidates,
      riskFactors: [!activity ? "CURRENT_ACTIVITY_NOT_ESTABLISHED" : null, !burdenKnown ? "SAMPLING_UNCERTAINTY" : null, managementReview ? "REGULATORY_GAP" : null].filter(Boolean),
      evidenceRequest: managementReview ? { type: "NEED_APPROVED_LABEL", text: "Need front/back current DOA-approved label or registration certificate for 1372-2565, showing the identity panel and rice–brown-planthopper rate/use-direction panel." } : null,
      ordering: "PRODUCT_ID_ASCENDING_NO_MANUFACTURER_PRIORITY",
    };
  }

  const esc = (value) => String(value).replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[character]);
  const followUpLabels = Object.freeze({ WHY_MONITOR: "ทำไมถึงควรเฝ้าระวัง", OPTIONS: "มีตัวเลือกอะไร", RATE: "ใช้อัตราเท่าไหร่", MOA: "กลุ่มยาอะไร", PREVIOUS_TREATMENT: "รอบก่อนใช้ยาอะไร", MISSING_EVIDENCE: "ต้องเช็กอะไรเพิ่ม", SOURCES: "ดูแหล่งข้อมูล" });
  function availableFollowUps(result) {
    const actions = [];
    if (result.needForAction === "CONTINUE_MONITORING") actions.push("WHY_MONITOR");
    if (result.options.length) actions.push("OPTIONS");
    if (result.options.some((option) => option.rate)) actions.push("RATE");
    if (result.options.some((option) => option.moa)) actions.push("MOA");
    if (result.previousTreatment) actions.push("PREVIOUS_TREATMENT");
    if (result.evidenceRequest || result.actionEvidence?.limitations?.length) actions.push("MISSING_EVIDENCE");
    if (result.actionEvidence || result.options.some((option) => option.sources.length)) actions.push("SOURCES");
    return actions;
  }
  function followUpChips(result) {
    return `<nav class="knowledge-follow-ups decision-follow-ups" aria-label="คำถามต่อเนื่องของเคส">${availableFollowUps(result).map((action) => `<button type="button" data-decision-follow-up="${action}">${followUpLabels[action]}</button>`).join("")}</nav><div data-decision-follow-up-output aria-live="polite"></div>`;
  }
  function actionProvenance(result) {
    const evidence = result.actionEvidence;
    if (!evidence) return "";
    return `<details class="knowledge-provenance"><summary>หลักฐาน / provenance</summary><p><strong>${esc(evidence.id)}</strong> · ${esc(evidence.claim)} · ${esc(evidence.evidence)}</p><p>${esc(evidence.source?.authority || "governed source")} · ${esc(evidence.source?.id || "source unavailable")} · ${esc(evidence.source?.locator || "locator unavailable")}</p><p>${(evidence.limitations || []).map(esc).join(" · ")}</p></details>`;
  }
  function productCards(result) {
    return result.options.map((option) => `<article class="chemical-option-card" data-option-state="${option.optionState}"><p class="eyebrow">${option.optionState === "ELIGIBLE_FOR_DECISION_REVIEW" ? "ELIGIBLE_FOR_DECISION_REVIEW" : "PROVISIONAL_PRODUCT_EVIDENCE · BLOCKED_BY_AUTHORITY"}</p><h3>${esc(option.product)}</h3><p><strong>${esc(option.activeIngredient)} · ${esc(option.formulation)} · ${esc(option.moa)}</strong></p><dl><dt>ทะเบียน</dt><dd>${esc(option.registrationNumber)} · ${esc(option.registrationState)}</dd><dt>Regulatory CTU</dt><dd>${esc(option.regulatoryCtuState)}</dd>${option.rate ? `<dt>อัตราที่แหล่งข้อมูลรองรับ</dt><dd>${esc(option.rate)} · ${esc(option.rateBasis)} · ไม่ใช่อัตราสำหรับเคสนี้</dd>` : ""}<dt>ข้อมูลที่ยังขาด</dt><dd>${option.limitations.map(esc).join(" · ")}</dd></dl><details class="knowledge-provenance"><summary>หลักฐานผลิตภัณฑ์ / provenance</summary><ul>${option.sources.map((source) => `<li>${esc(source.authorityClass)} · ${esc(source.id)} · ${esc(source.locator)} · verified ${esc(source.verifiedAt)}</li>`).join("")}</ul>${option.requiredArtifact ? `<p><strong>Artifact ที่ต้องใช้ปลดล็อก:</strong> ${esc(option.requiredArtifact)}</p>` : ""}</details></article>`).join("");
  }
  function render(result) {
    if (!result || result.needForAction === "MORE_CASE_EVIDENCE_REQUIRED") return "";
    if (result.needForAction === "CONTINUE_MONITORING") return `<section class="chemical-slice decision-rich-answer refusal-path knowledge-answer" data-chemical-slice><p class="eyebrow">CONTINUE_MONITORING · GOVERNED DECISION</p><h3>ยังไม่เปิด Management Review</h3><p class="knowledge-summary">พบเฉลี่ย <strong>${esc(result.observedCount)} ตัว/ต้น</strong> ซึ่งยังไม่ถึงเกณฑ์ที่กำกับไว้ ${esc(result.criterion)} ตัว/ต้น จึงไม่แสดงตัวเลือกสาร</p><section class="knowledge-section"><h4>ทำไม</h4><p>หลักฐานปัจจุบันรองรับการติดตามต่อ ไม่ใช่การเปิด Chemical Management Review</p></section><p class="boundary-copy">Management Review ≠ Spray Required · CONTINUE_MONITORING ≠ ไม่ต้องตรวจต่อ</p>${actionProvenance(result)}${followUpChips(result)}</section>`;
    const cards = productCards(result);
    return `<section class="chemical-slice decision-rich-answer knowledge-answer" data-chemical-slice><p class="eyebrow">MANAGEMENT_REVIEW_JUSTIFIED · GOVERNED DECISION</p><h2>ควรเปิดการทบทวนแนวทางจัดการ</h2><p class="knowledge-summary">ค่าที่บันทึก <strong>${esc(result.observedCount)} ตัว/ต้น</strong> ถึงเกณฑ์ ${esc(result.criterion)} ตัว/ต้น จึงรองรับการเปิด Management Review แต่ไม่ได้แปลว่าต้องพ่นสาร</p><section class="knowledge-section"><h4>หลักฐานผลิตภัณฑ์ที่เกี่ยวข้อง</h4><p>พบ ${result.options.length} ระเบียนสำหรับตรวจทานแบบมีขอบเขต ไม่ใช่คำแนะนำหรือคำสั่งใช้</p>${cards || "<p>ยังไม่มีหลักฐานผลิตภัณฑ์ที่แสดงได้ในสถานะนี้</p>"}</section>${result.evidenceRequest ? `<aside class="evidence-request"><strong>NEED_APPROVED_LABEL</strong><p>${esc(result.evidenceRequest.text)}</p></aside>` : ""}<p class="boundary-copy">Option ≠ Recommendation · Management Review ≠ Spray Required · Registration ≠ CTU authorization · Registration ≠ Efficacy · Different MoA ≠ Better · Failed control ≠ Resistance · Photo received ≠ Photo analyzed</p>${actionProvenance(result)}${followUpChips(result)}</section>`;
  }

  function renderFollowUp(result, action) {
    if (!result || !availableFollowUps(result).includes(action)) return "";
    let title = followUpLabels[action]; let body = "";
    if (action === "WHY_MONITOR") body = `<p>${esc(result.decisionExplanation || `ค่าที่บันทึกยังไม่ถึงเกณฑ์ ${result.criterion} ตัว/ต้น`)}</p><p>ไม่แสดงตัวเลือกสาร และยังไม่กำหนดช่วงติดตามที่แหล่งข้อมูลไม่ได้ระบุ</p>`;
    if (action === "OPTIONS") body = productCards(result);
    if (action === "RATE") body = result.options.filter((option) => option.rate).map((option) => `<p><strong>${esc(option.product)}</strong> · ${esc(option.rate)} · ${esc(option.rateBasis)} · ไม่ใช่อัตราสำหรับเคสนี้</p>`).join("");
    if (action === "MOA") body = `<p>${[...new Set(result.options.map((option) => option.moa))].map(esc).join(" · ")}</p><p>Different MoA ≠ Better และ MoA ≠ ประสิทธิภาพหรือคำแนะนำ</p>`;
    if (action === "PREVIOUS_TREATMENT") body = `<p>ข้อมูลที่ผู้ใช้บันทึก: <strong>${esc(result.previousTreatment)}</strong></p><p>ประวัติการใช้ ≠ หลักฐานการดื้อยา · Failed control ≠ Resistance</p>`;
    if (action === "MISSING_EVIDENCE") body = `<p>${result.evidenceRequest ? esc(result.evidenceRequest.text) : "ต้องติดตามจำนวนด้วยหน่วย insects_per_plant โดยไม่อนุมานช่วงเวลาหรือ sampling protocol เพิ่ม"}</p><p>${(result.actionEvidence?.limitations || []).map(esc).join(" · ")}</p>`;
    if (action === "SOURCES") body = `${actionProvenance(result)}${result.options.flatMap((option) => option.sources).length ? `<details class="knowledge-provenance" open><summary>หลักฐานผลิตภัณฑ์</summary><ul>${result.options.flatMap((option) => option.sources).map((source) => `<li>${esc(source.authorityClass)} · ${esc(source.id)} · ${esc(source.locator)}</li>`).join("")}</ul></details>` : ""}`;
    return `<article class="decision-follow-up-answer knowledge-answer"><p class="eyebrow">CASE FOLLOW-UP · ${esc(action)}</p><h3>${esc(title)}</h3>${body}<p class="boundary-copy">คำตอบนี้ใช้ Case context เดิม · Option ≠ Recommendation</p></article>`;
  }

  window.SPChemicalSlice = Object.freeze({ products, resolveRegistrationHistory, evaluateProductEligibility, evaluate, render, renderFollowUp, availableFollowUps });
})();
