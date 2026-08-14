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
    const managementReview = isBph && activity && burdenKnown && count >= 10;
    const needForAction = !isBph || !activity || !burdenKnown ? "MORE_CASE_EVIDENCE_REQUIRED" : managementReview ? "MANAGEMENT_REVIEW_JUSTIFIED" : "CONTINUE_MONITORING";
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
  function render(result) {
    if (!result || result.needForAction === "MORE_CASE_EVIDENCE_REQUIRED") return "";
    if (result.needForAction === "CONTINUE_MONITORING") return '<section class="chemical-slice refusal-path" data-chemical-slice><h3>ยังไม่เปิดการพิจารณาจัดการ</h3><p><strong>CONTINUE_MONITORING</strong> — จำนวนต่ำกว่าเกณฑ์ปฏิบัติการ 10 ตัว/ต้น จึงไม่แสดงตัวเลือกสาร</p><p>เกณฑ์นี้ใช้เปิด Management Review เท่านั้น ไม่ได้แปลว่าต้องพ่นสาร</p></section>';
    const cards = result.options.map((option) => `<article class="chemical-option-card" data-option-state="${option.optionState}"><p class="eyebrow">ตัวเลือกสำหรับตรวจทาน · ${option.optionState}</p><h3>${esc(option.product)}</h3><dl><dt>สารสำคัญ / สูตร</dt><dd>${esc(option.activeIngredient)} · ${esc(option.formulation)}</dd><dt>MoA</dt><dd>${esc(option.moa)}</dd><dt>ทะเบียน</dt><dd>${esc(option.registrationNumber)} · ${esc(option.registrationState)}</dd><dt>Regulatory CTU</dt><dd>${esc(option.regulatoryCtuState)}</dd><dt>อัตราที่แหล่งข้อมูลรองรับ</dt><dd>${esc(option.rate || "ยังไม่ยืนยัน")} — ${esc(option.rateBasis)}</dd><dt>ช่วงใช้</dt><dd>${esc(option.timing || "ยังไม่มีหลักฐานที่กำกับไว้เพียงพอ")}</dd><dt>เหตุผลที่เข้ารายการ</dt><dd>ข้าว + เพลี้ยกระโดดสีน้ำตาล + current activity + ≥10 ตัว/ต้น; ใช้เพื่อ review ไม่ใช่ recommendation</dd></dl><details><summary>หลักฐานและข้อจำกัด</summary><p>${option.limitations.map(esc).join(" · ")}</p><ul>${option.sources.map((source) => `<li>${esc(source.authorityClass)} · ${esc(source.id)} · ${esc(source.locator)} · verified ${esc(source.verifiedAt)}</li>`).join("")}</ul>${option.requiredArtifact ? `<p><strong>Artifact ที่ต้องใช้ปลดล็อก:</strong> ${esc(option.requiredArtifact)}</p>` : ""}</details></article>`).join("");
    return `<section class="chemical-slice" data-chemical-slice><h2>ผล Chemical Management Review</h2><p><strong>Key A: PASS</strong> · Management review justified</p><p><strong>Key B: ${result.keyB ? "PASS" : "NOT PASS"}</strong> · ${result.keyB ? "REGULATORY_ELIGIBLE" : "REGULATORY_CTU_CONFIRMATION_PENDING"}</p><p>พบ ${result.options.length} ผลิตภัณฑ์ที่มีหลักฐานพอสำหรับการตรวจทานแบบมีขอบเขต ไม่ใช่คำแนะนำหรือคำสั่งใช้</p>${cards}<aside class="evidence-request"><strong>NEED_APPROVED_LABEL</strong><p>${esc(result.evidenceRequest.text)}</p></aside><p class="boundary-copy">Product candidate ≠ eligible option ≠ recommendation ≠ execution · Manufacturer guidance ≠ Thai regulatory CTU authority · ไม่มีการจัดอันดับผู้ผลิต</p></section>`;
  }

  window.SPChemicalSlice = Object.freeze({ products, resolveRegistrationHistory, evaluateProductEligibility, evaluate, render });
})();
