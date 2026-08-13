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

  window.SPDecisionAuthority = Object.freeze({ version: "action-crop-target-use-authority/v1", chemicalEligibilityVersion: "chemical-eligibility-authority/v1", sources, actionEvidence, unresolved, registration, eligibilityStates, evaluateRegulatoryChain, priorityRegulatoryReview, regulatoryResolution });
})();
