(() => {
  "use strict";

  const sources = Object.freeze({
    thaiBphAnnual: {
      id: "GS-RD-ANNUAL-2023-BPH-001/v1",
      authority: "Rice Department, Thailand",
      url: "https://files.ricethailand.go.th/files/45/documents/page_doc/files-rice-1728458495199.pdf",
      retrievalDate: "2026-08-11",
      locator: "PDF p.58, lines 1701-1705 in indexed text",
      dateContext: "2023 wet-season field efficacy activity; annual report published later",
    },
    irriLeaffolder: {
      id: "GS-IRRI-RKB-LEAFFOLDER-001/v1",
      authority: "International Rice Research Institute",
      url: "https://www.knowledgebank.irri.org/training/fact-sheets/pest-management/insects/item/rice-leaffolder",
      retrievalDate: "2026-08-11",
      locator: "Why is it important / How to manage",
      dateContext: "current web factsheet at retrieval",
    },
    irriPlanthopper: {
      id: "GS-IRRI-RKB-PLANTHOPPER-001/v1",
      authority: "International Rice Research Institute",
      url: "https://www.knowledgebank.irri.org/training/fact-sheets/pest-management/insects/item/planthopper",
      retrievalDate: "2026-08-11",
      locator: "How to manage - critical numbers and seedbed conditions",
      dateContext: "current web factsheet at retrieval",
    },
    doaRegistry: {
      id: "GS-DOA-HAZARDOUS-REGISTRY-2026-001/v2",
      authority: "Department of Agriculture, Thailand",
      url: "https://www.doa.go.th/ard/?page_id=386",
      retrievalDate: "2026-08-13",
      locator: "official hazardous-substance registration listing; page states updated 2026-07-16",
      dateContext: "time-dependent registration context",
    },
    doaAgriFactor: {
      id: "GS-DOA-AGRI-FACTOR-GUIDANCE-001/v1",
      authority: "Department of Agriculture, Thailand",
      url: "https://www.doa.go.th/th/doa-mobile-application/",
      retrievalDate: "2026-08-11",
      locator: "DOA Agri Factor description; registration-number and Buddhist-year lookup",
      dateContext: "current official web guidance at retrieval",
    },
    doaInsectGuidance: {
      id: "GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1",
      authority: "Plant Protection Research and Development Office, Department of Agriculture, Thailand",
      url: "https://www.doa.go.th/plprotect/wp-content/uploads/2023/12/%E0%B8%84%E0%B8%B3%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%86%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%A1%E0%B8%A5%E0%B8%87%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C%E0%B8%A8%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B9%E0%B8%9E%E0%B8%B7%E0%B8%8A%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B8%A0%E0%B8%B1%E0%B8%A21.pdf",
      retrievalDate: "2026-08-11",
      locator: "rice entries headed เพลี้ยกระโดดสีน้ำตาล and หนอนห่อใบข้าว",
      authorityRoles: ["CROP_AUTHORITY", "TARGET_AUTHORITY", "USE_PATTERN_AUTHORITY"],
      limitation: "No product registration number or stable registration-record identifier is exposed; ingredient wording is not a safe join key.",
    },
    doaRegistry2568: {
      id: "GS-DOA-HAZARDOUS-REGISTRY-2568-001/v1",
      authority: "Agricultural Regulatory Division, Department of Agriculture, Thailand",
      url: "https://www.doa.go.th/ard/wp-content/uploads/2025/09/%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%B8%E0%B8%AD%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%9A%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%99%E0%B8%B4%E0%B8%94-%E0%B8%9B%E0%B8%B5-2554-25681.pdf",
      retrievalDate: "2026-08-13",
      locator: "row 765 / PDF p.136: registration 405-2555",
      dateContext: "official 2554-2568 registration listing dated 2025-09-15; row states expiry 2024-03-22",
      limitation: "administrative identity/status row does not expose crop, target, use, or an approved label",
    },
  });

  const actionEvidence = Object.freeze({
    "brown-planthopper": {
      id: "AE-076-BPH-001/v1",
      claim: "CL-076-BPH-ET-001/v1",
      evidence: "EV-076-BPH-ET-001/v1",
      subject: "brown planthopper / Nilaparvata lugens",
      thresholdType: "Economic Threshold",
      measurement: "average insects per rice plant",
      unit: "insects_per_plant",
      operator: ">=",
      triggerValue: 10,
      cropStage: "source field activity states water-volume contexts at <=40 and >40 days; threshold itself is not separately stage-qualified",
      samplingMethod: "field activity reports an average count; point-versus-plant wording is inconsistent and must be reviewed",
      implication: "management review may open; pesticide application does not follow automatically",
      geography: "Phan District, Chiang Rai, Thailand",
      productionContext: "2023 wet-season farmer field efficacy activity",
      thaiApplicability: "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION",
      source: sources.thaiBphAnnual,
      limitations: ["single reported field activity", "average observed as insects per point while ET is stated per plant", "does not establish current registration, efficacy ranking, product selection, or dose"],
    },
    leaffolder: {
      id: "AE-076-LF-REF-001/v1",
      claim: "CL-076-LF-REF-001/v1",
      evidence: "EV-076-LF-REF-001/v1",
      subject: "rice leaffolder / Cnaphalocrocis medinalis",
      thresholdType: "Damage importance criterion",
      measurement: "damage to more than half of flag leaf and next two youngest leaves per tiller",
      unit: "leaf_damage_extent",
      triggerValue: null,
      thaiApplicability: "REFERENCE_EVIDENCE_ONLY",
      source: sources.irriLeaffolder,
      limitations: ["international reference", "not validated as a Thai operational action threshold", "does not by itself justify pesticide use"],
    },
    "leaffolder-thai": {
      id: "AE-083-LF-TH-001/v1",
      claim: "CL-083-LF-ACTION-001/v1",
      evidence: "EV-083-LF-ACTION-001/v1",
      subject: "rice leaffolder / Cnaphalocrocis medinalis",
      thresholdType: "ACTION_THRESHOLD",
      measurement: "percentage of rice leaves damaged",
      unit: "percent_affected_leaves",
      triggerValue: null,
      cropStage: "15-40 days: more than 15%; flag-leaf stage: 10%",
      samplingMethod: "field inspection of damaged rice leaves; denominator details not stated in the bounded source entry",
      geography: "Thailand",
      thaiApplicability: "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION",
      source: sources.doaInsectGuidance,
      limitations: ["stage-specific criteria cannot be collapsed into one threshold", "sampling denominator is not explicit", "does not establish registration, product eligibility, or recommendation"],
    },
    "brown-planthopper-reference": {
      id: "AE-076-BPH-REF-001/v1",
      claim: "CL-076-BPH-REF-001/v1",
      evidence: "EV-076-BPH-REF-001/v1",
      subject: "brown planthopper / Nilaparvata lugens",
      thresholdType: "Monitoring and seedbed action criteria",
      measurement: "planthoppers per stem plus natural-enemy comparison and flooding feasibility",
      unit: "insects_per_stem",
      triggerValue: 1,
      thaiApplicability: "REFERENCE_EVIDENCE_ONLY",
      source: sources.irriPlanthopper,
      limitations: ["international reference", "seedbed-specific chemical condition", "not converted to a Thai operational rule"],
    },
  });

  const unresolved = Object.freeze({
    "brown-spot": "ACTION_THRESHOLD_UNRESOLVED",
    blast: "ACTION_THRESHOLD_UNRESOLVED",
    leaffolder: "THAI_ACTION_THRESHOLD_UNRESOLVED",
    "rice-field-broadleaf": "ACTION_THRESHOLD_UNRESOLVED",
    "sedge-group": "ACTION_THRESHOLD_UNRESOLVED",
  });

  const registration = Object.freeze({
    id: "RA-076-TH-CTU-001/v1",
    recordsSearched: 3501,
    identitiesSearched: 18,
    exactIdentityMatches: 17,
    absentIdentities: ["Carbofuran"],
    cropMatches: 0,
    targetMatches: 0,
    completeCropTargetUseChains: 0,
    ambiguousChains: 17,
    rejectedChains: 1,
    status: "REGISTRATION_IDENTITY_MATCH_ONLY",
    chemicalGate: "CHEMICAL_REVIEW_BLOCKED",
    eligibleOptions: [],
    priorityIdentityMatches: {
      "brown-spot": ["Carbendazim", "Mancozeb"],
      blast: ["Isoprothiolane", "Tricyclazole"],
      leaffolder: ["Cartap hydrochloride", "Fipronil", "Chlorantraniliprole"],
      "brown-planthopper": ["Imidacloprid", "Buprofezin", "Fipronil"],
      "rice-field-broadleaf": ["Bispyribac-sodium", "Bensulfuron-methyl", "Penoxsulam"],
      "sedge-group": ["Bispyribac-sodium", "Bensulfuron-methyl", "Penoxsulam"],
    },
    mixturePolicy: "preserve exact mixture identity; never project a mixture registration to each component",
    identityPolicy: "preserve salts, esters, concentration, formulation, Thai/English source wording, punctuation, and spacing",
    limitation: "The official snapshot and registration-number lookup confirm identities and administrative records but do not establish a complete Crop–Target–Use–Registration chain for these matches.",
    sources: [sources.doaRegistry, sources.doaAgriFactor],
  });

  const eligibilityStates = Object.freeze(["NO_REGULATORY_EVIDENCE", "REGISTRATION_IDENTITY_MATCH_ONLY", "REGULATORY_RELATIONSHIP_AMBIGUOUS", "REGISTRATION_STATUS_UNRESOLVED", "ELIGIBLE_FOR_DECISION_REVIEW", "HUMAN_REVIEW_REQUIRED"]);
  function evaluateRegulatoryChain(chain = {}) {
    if (!chain.officialEvidence) return "NO_REGULATORY_EVIDENCE";
    if (chain.humanReviewRequired) return "HUMAN_REVIEW_REQUIRED";
    if (!chain.crop || !chain.target || !chain.useContext) return chain.identity ? "REGISTRATION_IDENTITY_MATCH_ONLY" : "REGULATORY_RELATIONSHIP_AMBIGUOUS";
    if (!chain.recordIdentifier || !chain.defensibleJoinKey || !chain.identity) return "REGULATORY_RELATIONSHIP_AMBIGUOUS";
    if (chain.registrationStatus !== "CURRENTLY_REGISTERED") return "REGISTRATION_STATUS_UNRESOLVED";
    return "ELIGIBLE_FOR_DECISION_REVIEW";
  }
  const priorityRegulatoryReview = Object.freeze({
    "brown-planthopper": { sourceCrop: "ข้าว", sourceTarget: "เพลี้ยกระโดดสีน้ำตาล", source: sources.doaInsectGuidance, candidateIdentities: ["Imidacloprid", "Buprofezin", "Fipronil"], identity: true, crop: true, target: true, useContext: true, officialEvidence: true, recordIdentifier: null, defensibleJoinKey: false, registrationStatus: "STATUS_UNRESOLVED", humanReviewRequired: true, status: "HUMAN_REVIEW_REQUIRED", gaps: ["REGULATORY_JOIN_GAP", "REGISTRATION_STATUS_GAP"] },
    leaffolder: { sourceCrop: "ข้าว", sourceTarget: "หนอนห่อใบข้าว", source: sources.doaInsectGuidance, candidateIdentities: ["Cartap hydrochloride", "Fipronil", "Chlorantraniliprole"], identity: true, crop: true, target: true, useContext: true, officialEvidence: true, recordIdentifier: null, defensibleJoinKey: false, registrationStatus: "STATUS_UNRESOLVED", humanReviewRequired: true, status: "HUMAN_REVIEW_REQUIRED", gaps: ["REGULATORY_JOIN_GAP", "REGISTRATION_STATUS_GAP"] },
    blast: { sourceCrop: "ข้าว", sourceTarget: "โรคไหม้", officialEvidence: false, identity: true, crop: false, target: false, useContext: false, recordIdentifier: null, defensibleJoinKey: false, registrationStatus: "UNRESOLVED", status: "REGISTRATION_IDENTITY_MATCH_ONLY", gaps: ["REGULATORY_SOURCE_GAP", "REGULATORY_JOIN_GAP", "REGISTRATION_STATUS_GAP"] },
  });

  const regulatoryResolution = Object.freeze({
    id: "RR-077R-TH-FIRST-CHAIN-001/v1",
    reviewDate: "2026-08-13",
    reviewerRole: "Regulatory evidence reviewer",
    strategy: "record-by-record human review",
    candidatesInspected: 8,
    officialLabelsLocated: 0,
    stableJoins: 0,
    completeChains: 0,
    currentEligibleChains: 0,
    acceptedRelationships: 0,
    rejectedSimilarityOnlyJoins: 8,
    unresolvedRelationships: 3,
    result: "PARTIAL — HUMAN REGULATORY RESOLUTION STILL REQUIRED",
    recommendationProduced: false,
  });

  const decisionAuthorityResolution = Object.freeze({
    id: "RR-083-TH-DECISION-AUTHORITY-001/v1", reviewDate: "2026-08-13", primaryTarget: "brown-planthopper", completeChains: 0, currentEligibleChains: 0,
    productLeads: [{ target: "brown-planthopper", sourceScope: "COMMERCIAL_PRODUCT_IDENTITY_LEAD", originalWording: "เพลนั่ม 50 ดับบลิวจี / ไพมีโทรซีน 50% WG / เลขทะเบียน 405-2555 / ข้าว / เพลี้ยกระโดดสีน้ำตาล", registrationNumber: "405-2555", tradeName: "เพลนั่ม 50 ดับบลิวจี", activeIngredient: "pymetrozine", concentration: "50%", formulation: "WG", company: "Syngenta Crop Protection Co., Ltd.", lookupQuery: "site:doa.go.th/ard 405-2555", officialMatch: "OFFICIAL_IDENTITY_MATCH", officialSource: sources.doaRegistry2568, cropBinding: false, targetBinding: false, useBinding: false, currentStatus: "EXPIRED_DATE_RECORDED_CURRENT_RENEWAL_UNRESOLVED", joinMethod: "EXACT_REGISTRATION_NUMBER", finalEligibility: "REGISTRATION_STATUS_UNRESOLVED", reviewStatus: "REJECTED", rejectionReasons: ["OFFICIAL_CTU_NOT_BOUND", "CURRENT_STATUS_UNRESOLVED", "COMMERCIAL_USE_CLAIM_ONLY"] }],
    rejectedCandidates: [
      { target: "brown-planthopper", lead: "405-2555", reason: "OFFICIAL_CTU_NOT_BOUND; CURRENT_STATUS_UNRESOLVED; COMMERCIAL_USE_CLAIM_ONLY" },
      { target: "brown-planthopper", lead: "Imidacloprid / Buprofezin / Fipronil identity hits", reason: "NO_STABLE_IDENTIFIER_SHARED_WITH_CTU" },
      { target: "leaffolder", lead: "Fipronil 5% SC", reason: "NO_STABLE_IDENTIFIER_SHARED_WITH_CTU" },
      { target: "blast / brown-spot / weed groups", lead: "ingredient-only historical/use records", reason: "NO_COMPLETE_CURRENT_OFFICIAL_CTU_REGISTRATION_JOIN" },
    ],
    matrix: [
      { target: "brown-planthopper", identification: "GOVERNED", actionAuthority: "ACTION_AUTHORITY_OPERATIONAL_WITH_LIMITATION", managementGate: "AVAILABLE_WHEN_MEASUREMENT_VALID", regulatoryCTU: "USE_GUIDANCE_ONLY_NO_STABLE_JOIN", currentRegistration: "UNRESOLVED", chemicalEligibility: "HUMAN_REVIEW_REQUIRED", blocker: "official label/certificate sharing stable ID and current status" },
      { target: "leaffolder", identification: "GOVERNED", actionAuthority: "ACTION_AUTHORITY_LIMITED", managementGate: "STAGE_AND_INCIDENCE_MEASUREMENT_REQUIRED", regulatoryCTU: "USE_GUIDANCE_ONLY_NO_STABLE_JOIN", currentRegistration: "UNRESOLVED", chemicalEligibility: "HUMAN_REVIEW_REQUIRED", blocker: "stable registration join and current status" },
      { target: "blast", identification: "PROVISIONAL_CAUSAL_CONFIRMATION_UNAVAILABLE", actionAuthority: "ACTION_AUTHORITY_UNRESOLVED", managementGate: "NO_ACTION_DETERMINATION_SUPPORTED", regulatoryCTU: "UNRESOLVED", currentRegistration: "UNRESOLVED", chemicalEligibility: "REGISTRATION_IDENTITY_MATCH_ONLY", blocker: "action criterion and complete regulatory chain" },
      { target: "brown-spot", identification: "PROVISIONAL_CAUSAL_CONFIRMATION_UNAVAILABLE", actionAuthority: "ACTION_AUTHORITY_UNRESOLVED", managementGate: "NO_ACTION_DETERMINATION_SUPPORTED", regulatoryCTU: "UNRESOLVED", currentRegistration: "UNRESOLVED", chemicalEligibility: "REGISTRATION_IDENTITY_MATCH_ONLY", blocker: "action criterion and complete regulatory chain" },
      { target: "rice-field-broadleaf", identification: "GROUP_LEVEL", actionAuthority: "ACTION_AUTHORITY_UNRESOLVED", managementGate: "NO_ACTION_DETERMINATION_SUPPORTED", regulatoryCTU: "UNRESOLVED", currentRegistration: "UNRESOLVED", chemicalEligibility: "REGISTRATION_IDENTITY_MATCH_ONLY", blocker: "exact target, action criterion, and complete regulatory chain" },
      { target: "sedge-group", identification: "GROUP_LEVEL", actionAuthority: "ACTION_AUTHORITY_UNRESOLVED", managementGate: "NO_ACTION_DETERMINATION_SUPPORTED", regulatoryCTU: "UNRESOLVED", currentRegistration: "UNRESOLVED", chemicalEligibility: "REGISTRATION_IDENTITY_MATCH_ONLY", blocker: "exact target, action criterion, and complete regulatory chain" },
    ],
    result: "PARTIAL — THAI DECISION AUTHORITY GAPS REMAIN", recommendationProduced: false,
  });

  function evaluateRegulatoryLead(lead = {}) {
    const required = { crop: lead.cropBinding === true, target: lead.targetBinding === true, use: lead.useBinding === true, identity: Boolean(lead.registrationNumber && lead.exactIdentity), stableIdentifier: Boolean(lead.registrationNumber), current: lead.currentStatus === "CURRENT", authoritative: lead.officialEvidence === true, traceable: Boolean(lead.evidence), conflictFree: lead.identityConflict !== true };
    return { required, complete: Object.values(required).every(Boolean), eligibility: Object.values(required).every(Boolean) ? "ELIGIBLE_FOR_DECISION_REVIEW" : lead.officialEvidence ? "REGISTRATION_STATUS_UNRESOLVED" : "NO_REGULATORY_EVIDENCE", missing: Object.entries(required).filter(([, value]) => !value).map(([key]) => key), boundary: "REGISTRATION ≠ EFFICACY" };
  }

  window.SPDecisionAuthority = Object.freeze({ version: "action-crop-target-use-authority/v1", chemicalEligibilityVersion: "chemical-eligibility-authority/v1", sources, actionEvidence, unresolved, registration, eligibilityStates, evaluateRegulatoryChain, evaluateRegulatoryLead, priorityRegulatoryReview, regulatoryResolution, decisionAuthorityResolution });
})();
