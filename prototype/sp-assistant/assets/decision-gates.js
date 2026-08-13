(() => {
  "use strict";

  const ROLES = Object.freeze({ SUPPORTING: "SUPPORTING", REQUIRED_TO_DISTINGUISH: "REQUIRED_TO_DISTINGUISH", CONTRADICTING: "CONTRADICTING", CONTEXTUAL: "CONTEXTUAL", UNAVAILABLE: "UNAVAILABLE", UNRESOLVED: "UNRESOLVED" });
  const observationVocabulary = Object.freeze({
    plantParts: ["whole_plant", "tiller", "leaf", "leaf_sheath", "stem", "node", "panicle", "neck", "root"],
    features: ["color", "lesion", "feeding_scar", "folding", "rolling", "cutting", "chewing", "drying", "wilting", "deformation", "stunting"],
    distributions: ["single_plant", "scattered", "patch", "field_wide", "edge_associated", "water_related", "unresolved"],
    photoScales: ["FIELD", "PLANT", "ORGAN", "DAMAGE", "VISIBLE_CAUSAL_OBJECT"],
  });
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
    "stem-borer-group": {
      domain: "Insect", level: "group-level investigation only",
      required: [requirement("organ_stem", "inspect affected tiller or stem interior", "CL-RIC-007-O/v1", "EV-RIC-007/v1", "RD printed pp.20-23 / PDF pp.31-34"), requirement("boring_evidence", "larva or boring evidence inside stem", "CL-RIC-007-B/v1", "EV-RIC-007/v1", "RD printed pp.20-23 / PDF pp.31-34")],
      contextual: [["deadheart", "deadheart-like symptom before heading"], ["whitehead", "whitehead-like symptom after heading"], ["crop_stage", "explicit developmental stage, not age alone"]], contradictions: [],
      confirmation: "deadheart or whitehead alone does not establish stem borer; source groups four named species and requires interior inspection",
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

  const symptomFamilies = Object.freeze({
    leaf_lesion: { support: "SUPPORTED", cues: ["organ_leaf", "spot"], candidates: ["brown-spot", "blast"], next: { mission: "inspect_leaf_lesion", label: "inspect lesion shape and center", scale: "DAMAGE" }, evidence: ["CL-RDC-001-O/v1", "CL-RDC-003-O/v1"] },
    yellow_orange_discoloration: { support: "PARTIALLY_SUPPORTED", cues: ["color"], candidates: ["brown-planthopper"], next: { mission: "inspect_plant_base", label: "inspect plant base and compare affected and healthy plants", scale: "PLANT" }, evidence: ["CL-RIC-002-O/v1"] },
    folded_rolled_leaf: { support: "SUPPORTED", cues: ["organ_leaf", "folded_leaf"], candidates: ["leaffolder"], next: { mission: "unfold_affected_leaf", label: "unfold affected leaf and inspect feeding surface", scale: "DAMAGE" }, evidence: ["CL-RIC-006-O/v1"] },
    chewed_scraped_leaf: { support: "PARTIALLY_SUPPORTED", cues: ["organ_leaf", "feeding_scar"], candidates: ["leaffolder"], next: { mission: "inspect_leaf_surface", label: "inspect both leaf surfaces and inside folded tissue", scale: "DAMAGE" }, evidence: ["CL-RIC-006-O/v1"] },
    deadheart_like: { support: "UNSUPPORTED", cues: ["deadheart"], candidates: [], next: { mission: "inspect_inside_stem", label: "inspect tiller base and inside stem", scale: "ORGAN" }, evidence: [] },
    whitehead_like: { support: "UNSUPPORTED", cues: ["whitehead"], candidates: [], next: { mission: "inspect_panicle_neck", label: "inspect panicle neck and stem interior", scale: "ORGAN" }, evidence: [] },
    wilting_drying_patch: { support: "PARTIALLY_SUPPORTED", cues: ["wilt", "field_distribution"], candidates: ["brown-planthopper"], next: { mission: "inspect_plant_base", label: "inspect plant base above water level", scale: "ORGAN" }, evidence: ["CL-RIC-002-O/v1"] },
    stunting_abnormal_tillering: { support: "UNSUPPORTED", cues: ["stunting"], candidates: [], next: { mission: "compare_whole_plants", label: "compare roots, tillers, and whole affected and healthy plants", scale: "PLANT" }, evidence: [] },
    weed_presence: { support: "SUPPORTED", cues: ["weed_plant"], candidates: ["sedge-group", "rice-field-broadleaf"], next: { mission: "inspect_weed_stem_leaf", label: "inspect stem cross-section, nodes, leaves, and inflorescence", scale: "ORGAN" }, evidence: ["RL-RWC-019/v1", "CL-RWC-004-O/v1"] },
    post_application_abnormality: { support: "UNSUPPORTED", cues: ["chemical_application_history"], candidates: [], next: { mission: "report_application_history", label: "report product, timing, rate, method, water, and affected distribution", scale: "FIELD" }, evidence: [] },
  });

  function beginFromObservation(input = {}) {
    const family = symptomFamilies[input.family];
    if (!family) return { status: "UNRESOLVED", candidates: [], evidenceRoles: Object.values(ROLES), knowledgeGap: "OBSERVATION_FAMILY_UNRESOLVED", identificationGate: "IDENTIFICATION_NOT_SUPPORTED", chemicalGate: "CHEMICAL_REVIEW_BLOCKED" };
    const observed = [...new Set([...(input.observations || []), ...family.cues])];
    const candidates = family.candidates.map((key) => ({ key, name: key, domain: profiles[key].domain }));
    const projection = evaluate({ observations: observed, candidates, measurements: input.measurements || {} });
    const context = {
      cropStage: input.cropStage ? { value: input.cropStage, role: ROLES.CONTEXTUAL, limitation: "chronological age alone does not establish developmental stage" } : { role: ROLES.UNAVAILABLE },
      environment: input.environment ? { value: input.environment, role: ROLES.CONTEXTUAL, limitation: "environment cannot independently establish identity or diagnosis" } : { role: ROLES.UNAVAILABLE },
      managementHistory: input.managementHistory ? { value: input.managementHistory, role: ROLES.CONTEXTUAL, limitation: "CONTROL FAILURE ≠ RESISTANCE" } : { role: ROLES.UNAVAILABLE },
    };
    return {
      model: "rice-damage-investigation/v1", start: "UNKNOWN_CAUSE_OBSERVATION", family: input.family, support: family.support,
      observation: { crop: "rice", plantPart: input.plantPart || "unresolved", feature: input.feature || "unresolved", distribution: input.distribution || "unresolved", observed },
      differentialCandidates: projection.candidateGates, supportingEvidence: projection.candidateGates.flatMap((gate) => gate.supporting), contradictingEvidence: projection.candidateGates.flatMap((gate) => gate.contradicting),
      missingDistinguishingEvidence: projection.candidateGates.flatMap((gate) => gate.missing),
      nextBestEvidence: { ...family.next, action: "PHOTO_MISSION_OR_DIRECT_OBSERVATION", boundary: "Photo received ≠ Photo analyzed" },
      context, knowledgeGap: family.support === "SUPPORTED" ? null : `${input.family.toUpperCase()}_KNOWLEDGE_${family.support}`,
      identificationGate: projection.candidateGates.some((gate) => gate.identification === "PROVISIONAL_IDENTIFICATION") ? "PROVISIONAL_IDENTIFICATION" : "IDENTIFICATION_NOT_SUPPORTED",
      chemicalGate: "CHEMICAL_REVIEW_BLOCKED", recommendation: null,
      boundaries: projection.boundaries,
    };
  }

  const progressionStates = Object.freeze(["CURRENT_ACTIVITY_SUPPORTED", "CURRENT_ACTIVITY_NOT_ESTABLISHED", "HISTORICAL_DAMAGE_SUPPORTED", "PROGRESSION_SUPPORTED", "PROGRESSION_NOT_ESTABLISHED", "MORE_EVIDENCE_REQUIRED"]);
  const lifeStageProfiles = Object.freeze({
    leaffolder: { stages: ["larva"], activityCues: ["larva", "feeding_scar", "webbing"], location: "inside folded leaf", claim: "CL-RIC-006-I/B/O/v1", evidence: "EV-RIC-006/v1", locator: "RD printed pp.16-19 / PDF pp.27-30", next: "unfold newly affected leaves" },
    "brown-planthopper": { stages: ["nymph", "adult"], activityCues: ["hopper", "nymph", "adult"], location: "plant base above water level", claim: "CL-RIC-002-I/B/O/v1", evidence: "EV-RIC-002/v1", locator: "RD printed pp.4-7 / PDF pp.15-18", next: "inspect plant base again" },
    "stem-borer-group": { stages: ["larva"], activityCues: ["larva", "boring_evidence", "frass"], location: "inside affected tiller or stem", claim: "CL-RIC-007-I/B/O/v1", evidence: "EV-RIC-007/v1", locator: "RD printed pp.20-23 / PDF pp.31-34", next: "inspect affected tiller interior" },
    blast: { stages: [], activityCues: [], location: "lesion and newly affected organ", claim: "CL-RDC-001-O/v1", evidence: "EV-RDC-001A/v1; EV-RDC-001B/v1", locator: "KU pp.5-10; RRC pp.2-3", next: "record new lesions or lesion expansion" },
    "brown-spot": { stages: [], activityCues: [], location: "lesion and newly affected organ", claim: "CL-RDC-003-O/v1", evidence: "EV-RDC-003A/v1; EV-RDC-003B/v1", locator: "KU pp.15-18; RRC pp.3-4", next: "record new lesions or lesion expansion" },
  });

  function compareTemporalObservations(observations = []) {
    const ordered = observations.map((item, index) => ({ ...item, sequence: index + 1 }));
    const latest = ordered.at(-1) || {};
    const explicitProgression = latest.newAffectedTissue === true || latest.widerDistribution === true || latest.patchExpanded === true || latest.additionalOrgansAffected === true || latest.lesionExpansion === true;
    const explicitHistorical = latest.oldDamageOnly === true || (latest.sameTissueOnly === true && latest.currentActivityObserved === false);
    const recovery = latest.newHealthyGrowth === true;
    return {
      observations: ordered,
      progression: explicitProgression ? "PROGRESSION_SUPPORTED" : observations.length > 1 && (latest.sameTissueOnly === true || recovery) ? "PROGRESSION_NOT_ESTABLISHED" : "MORE_EVIDENCE_REQUIRED",
      damageAge: explicitHistorical ? "HISTORICAL_DAMAGE_SUPPORTED" : "DAMAGE_AGE_UNRESOLVED",
      recovery: recovery ? "NEW_HEALTHY_GROWTH_OBSERVED" : "RECOVERY_UNRESOLVED",
      limitation: "first-noticed time is not actual onset; elapsed time alone does not establish progression or biological damage age",
    };
  }

  function evaluateProgression(input = {}) {
    const temporal = compareTemporalObservations(input.observations || []);
    const profile = lifeStageProfiles[input.candidate];
    const latest = temporal.observations.at(-1) || {};
    const cues = latest.activityCues || [];
    const activityMatches = profile ? profile.activityCues.filter((cue) => cues.includes(cue)) : [];
    const isDisease = input.candidate === "blast" || input.candidate === "brown-spot";
    let activity = "CURRENT_ACTIVITY_NOT_ESTABLISHED";
    if (!isDisease && activityMatches.length) activity = "CURRENT_ACTIVITY_SUPPORTED";
    if (temporal.damageAge === "HISTORICAL_DAMAGE_SUPPORTED") activity = "HISTORICAL_DAMAGE_SUPPORTED";
    const cropStage = input.cropStage ? { value: input.cropStage, role: ROLES.CONTEXTUAL, basis: "explicit developmental-stage observation" } : { role: ROLES.UNAVAILABLE, limitation: "crop age alone cannot establish developmental stage" };
    const stageRelation = input.candidate === "stem-borer-group" ? (latest.symptom === "deadheart" && input.cropStage === "pre_heading" ? "SOURCE_SUPPORTED_DEADHEART_CONTEXT" : latest.symptom === "whitehead" && input.cropStage === "post_heading" ? "SOURCE_SUPPORTED_WHITEHEAD_CONTEXT" : "STAGE_RELATION_UNRESOLVED") : "NOT_APPLICABLE";
    const next = profile?.next || "repeat direct observation";
    const needForActionReadiness = activity === "CURRENT_ACTIVITY_SUPPORTED" && input.candidate === "brown-planthopper" ? "ACTION_EVIDENCE_MEASUREMENT_REQUIRED" : "ACTION_EVIDENCE_NOT_READY";
    return {
      model: "rice-damage-progression/v1", temporal, activity, progression: temporal.progression, progressionStates,
      candidate: input.candidate || null,
      lifeStage: profile ? { supportedStages: profile.stages, observed: activityMatches, inspectionLocation: profile.location, claim: profile.claim, evidence: profile.evidence, locator: profile.locator } : { status: "UNRESOLVED" },
      diseaseBoundary: isDisease ? "SYMPTOM PROGRESSION ≠ PATHOGEN CONFIRMATION" : null,
      cropStage, stageRelation,
      nextBestEvidence: { action: "REPEAT_OBSERVATION_OR_PHOTO_MISSION", prompt: next, captureScales: ["FIELD", "PLANT", "ORGAN_OR_DAMAGE"], preserve: ["observationTime", "source"], automaticImageComparison: false, boundary: "Photo received ≠ Photo analyzed" },
      needForActionReadiness, chemicalGate: "CHEMICAL_REVIEW_BLOCKED", recommendation: null,
      context: { weather: { role: ROLES.CONTEXTUAL }, nearbyCase: { role: ROLES.CONTEXTUAL, boundary: "NEARBY CASE ≠ TRANSMISSION" }, failedControl: { role: ROLES.CONTEXTUAL, boundary: "CONTROL FAILURE ≠ RESISTANCE" } },
      boundaries: ["DAMAGE PRESENT ≠ CAUSE CURRENTLY ACTIVE", "PEST DAMAGE ≠ PEST CURRENTLY PRESENT", "DISEASE SYMPTOM ≠ CURRENT INFECTION EVENT", "OLD DAMAGE ≠ CURRENT MANAGEMENT NEED", "CURRENT ACTIVITY ≠ CHEMICAL MANAGEMENT NEED"],
    };
  }

  const abioticInvestigationStates = Object.freeze(["BIOTIC_CAUSE_REMAINS_PLAUSIBLE", "ABIOTIC_CAUSE_REMAINS_PLAUSIBLE", "MULTIPLE_CAUSE_FAMILIES_REMAIN", "CHEMICAL_INJURY_NOT_ESTABLISHED", "NUTRIENT_CAUSE_NOT_ESTABLISHED", "WATER_ROOT_CAUSE_NOT_ESTABLISHED", "MORE_EVIDENCE_REQUIRED"]);
  const abioticProfiles = Object.freeze({
    "nitrogen-related-condition": {
      domain: "Nutrient", causeFamily: "ABIOTIC", evidence: "EV-RAD-001/v1", claim: "CL-RAD-001-O/v1", locator: "IRRI Rice Knowledge Bank, Nitrogen deficiency, How to identify",
      required: ["yellow_or_pale", "older_leaves_or_whole_plant"], distinguishing: ["leaf_age_order", "whole_plant_expression", "stunting", "reduced_tillering", "laboratory_test"],
      limitation: "Yellowing alone does not establish nitrogen deficiency; IRRI identifies sulfur and iron look-alikes and calls for soil and plant laboratory testing to confirm cause.",
    },
    "potassium-related-condition": {
      domain: "Nutrient", causeFamily: "ABIOTIC", evidence: "EV-RAD-002/v1", claim: "CL-RAD-002-O/v1", locator: "IRRI Rice Knowledge Bank, Potassium (K), deficiency symptoms",
      required: ["older_leaf_tip_or_margin_injury"], distinguishing: ["leaf_age_order", "tip_or_margin_location", "field_distribution", "root_condition", "tungro_evidence"],
      limitation: "Tip or margin injury alone does not establish potassium deficiency; IRRI identifies tungro as a look-alike.",
    },
    "root-knot-context": {
      domain: "Water / Root", causeFamily: "BIOTIC", evidence: "EV-RDC-011A/v1; EV-RDC-011B/v1", claim: "CL-RDC-011-I/C/O/v1", locator: "governed rice disease corpus: root-knot",
      required: ["root_galls"], distinguishing: ["inspect_roots", "field_water_observation", "production_context"], limitation: "Yellowing or stunting without root galls does not establish root-knot.",
    },
    "akiochi-root-zone-context": {
      domain: "Water / Root", causeFamily: "ABIOTIC", evidence: "EV-RDC-012A/v1; EV-RDC-012B/v1", claim: "CL-RDC-012-I/C/O/v1", locator: "governed rice disease corpus: Akiochi",
      required: ["black_root_rot", "tillering_stage"], distinguishing: ["inspect_roots", "residue_decomposition_context", "new_roots_above_soil"], limitation: "Water condition or lower-leaf yellowing alone does not establish Akiochi.",
    },
  });

  function evaluateAbioticDifferential(input = {}) {
    const observations = [...new Set(input.observations || [])];
    const family = input.observableFamily || "unresolved";
    const plausible = [];
    if (["yellowing_paling", "orange_discoloration", "stunting_abnormal_tillering", "uneven_growth"].includes(family)) plausible.push("nitrogen-related-condition", "root-knot-context", "akiochi-root-zone-context", "brown-planthopper");
    if (["leaf_tip_margin_drying", "leaf_burn_scorch"].includes(family)) plausible.push("potassium-related-condition", "blast", "brown-spot");
    if (["wilting", "drying_patches", "poor_root_condition"].includes(family)) plausible.push("root-knot-context", "akiochi-root-zone-context", "brown-planthopper");
    const candidates = [...new Set(plausible)].map((key) => {
      const profile = abioticProfiles[key];
      if (!profile) return { key, domain: profiles[key]?.domain || "Unresolved", causeFamily: "BIOTIC", role: ROLES.REQUIRED_TO_DISTINGUISH, status: "REMAINS_PLAUSIBLE" };
      const present = profile.required.filter((cue) => observations.includes(cue));
      return { key, domain: profile.domain, causeFamily: profile.causeFamily, role: present.length ? ROLES.SUPPORTING : ROLES.REQUIRED_TO_DISTINGUISH, status: present.length === profile.required.length ? "SOURCE_PATTERN_SUPPORTED_NOT_DIAGNOSIS" : "REMAINS_PLAUSIBLE", present, missing: profile.required.filter((cue) => !present.includes(cue)), distinguishing: profile.distinguishing, claim: profile.claim, evidence: profile.evidence, locator: profile.locator, limitation: profile.limitation };
    });
    const hasBiotic = candidates.some((item) => item.causeFamily === "BIOTIC");
    const hasAbiotic = candidates.some((item) => item.causeFamily === "ABIOTIC");
    const applicationReported = Boolean(input.applicationContext || family === "post_application_abnormality");
    const nutrientSupported = candidates.some((item) => item.domain === "Nutrient" && item.status === "SOURCE_PATTERN_SUPPORTED_NOT_DIAGNOSIS");
    const waterRootSupported = candidates.some((item) => item.domain === "Water / Root" && item.status === "SOURCE_PATTERN_SUPPORTED_NOT_DIAGNOSIS");
    const states = [hasBiotic ? "BIOTIC_CAUSE_REMAINS_PLAUSIBLE" : null, hasAbiotic ? "ABIOTIC_CAUSE_REMAINS_PLAUSIBLE" : null, hasBiotic && hasAbiotic ? "MULTIPLE_CAUSE_FAMILIES_REMAIN" : null, applicationReported ? "CHEMICAL_INJURY_NOT_ESTABLISHED" : null, nutrientSupported ? null : "NUTRIENT_CAUSE_NOT_ESTABLISHED", waterRootSupported ? null : "WATER_ROOT_CAUSE_NOT_ESTABLISHED", "MORE_EVIDENCE_REQUIRED"].filter(Boolean);
    const temporal = compareTemporalObservations(input.temporalObservations || []);
    return {
      model: "rice-abiotic-differential/v1", observableFamily: family, evidenceRoles: Object.values(ROLES), investigationStates: [...new Set(states)], candidates,
      observations: {
        phenotype: input.phenotype || null, plantPart: input.plantPart || "unresolved", distribution: input.distribution || "unresolved", cropStage: input.cropStage || "unresolved",
        fieldWater: input.fieldWater ? { value: input.fieldWater, role: ROLES.CONTEXTUAL } : { role: ROLES.UNAVAILABLE },
        rootCondition: input.rootCondition ? { value: input.rootCondition, role: ROLES.REQUIRED_TO_DISTINGUISH } : { role: ROLES.UNAVAILABLE },
        plantResponse: input.plantResponse ? { value: input.plantResponse, role: ROLES.CONTEXTUAL } : { role: ROLES.UNAVAILABLE },
        nutrientContext: input.nutrientContext ? { value: input.nutrientContext, role: ROLES.CONTEXTUAL } : { role: ROLES.UNAVAILABLE },
        applicationContext: applicationReported ? { value: input.applicationContext || {}, role: ROLES.REQUIRED_TO_DISTINGUISH, boundary: "APPLICATION BEFORE SYMPTOM ≠ APPLICATION CAUSED SYMPTOM" } : { role: ROLES.UNAVAILABLE },
        environment: input.environment ? { value: input.environment, role: ROLES.CONTEXTUAL, boundary: "WEATHER ASSOCIATION ≠ CAUSATION" } : { role: ROLES.UNAVAILABLE },
      },
      spatial: { pattern: input.distribution || "unresolved", role: ROLES.CONTEXTUAL, applicationPattern: ["application_line", "overlap_like"].includes(input.distribution || ""), boundary: "SPATIAL PATTERN ≠ CAUSE" },
      temporal: { ...temporal, eventOrder: input.eventOrder || [], boundary: "TEMPORAL ASSOCIATION ≠ CAUSATION" },
      nextBestEvidence: ["compare affected and apparently healthy hills", "record which leaves were affected first", "inspect and photograph roots", "record current and recent water conditions", "record recent chemical and fertilizer applications", "compare treated and untreated areas if available"],
      photoMission: { action: "HUMAN_CONFIRMED_CAPTURE", captureScales: ["FIELD", "PLANT", "ORGAN", "DAMAGE", "COMPARISON", "APPLICATION_CONTEXT"], automaticImageAnalysis: false, boundary: "Photo received ≠ Photo analyzed" },
      failedControl: { role: ROLES.CONTEXTUAL, alternatives: ["target_identity_unresolved", "old_damage_visible", "current_activity_continues", "application_issue", "environmental_context", "timing_issue", "regulatory_use_mismatch", "resistance_hypothesis_unresolved", "insufficient_evidence"], boundary: "CONTROL FAILURE ≠ RESISTANCE" },
      knowledgeGaps: { NUTRIENT: "THAI_LOCAL_VALIDATION_REQUIRED", "WATER / ROOT": "ONLY_ROOT_KNOT_AND_AKIOCHI_RELATIONSHIPS_GOVERNED", ENVIRONMENT: "SUBJECT_SPECIFIC_CAUSAL_RELATIONSHIPS_UNRESOLVED", "CHEMICAL INJURY": "PRODUCT_OR_ACTIVE_SPECIFIC_CAUSATION_UNRESOLVED", APPLICATION: "CASE_OBSERVATIONS_ONLY", RECOVERY: "CONDITION_SPECIFIC_RECOVERY_RELATIONSHIPS_UNRESOLVED", "TEMPORAL CAUSALITY": "UNRESOLVED", "FIELD PATTERN": "CONTEXTUAL_ONLY", "THAI-LOCAL VALIDATION": "NUTRIENT_RELATIONSHIPS_REQUIRE_THAI_REVIEW" },
      understandDomains: ["Crop", "Disease", "Insect", "Weed", "Nutrient", "Water / Root", "Environment", "Chemical / Application Context", "MoA", "Resistance Context"],
      needForAction: "NOT_EVALUATED", chemicalGate: "CHEMICAL_REVIEW_BLOCKED", recommendation: null,
      boundaries: ["SYMPTOM ≠ CAUSE", "YELLOWING ≠ NUTRIENT DEFICIENCY", "LEAF BURN ≠ DISEASE", "ABNORMALITY AFTER APPLICATION ≠ CHEMICAL INJURY CONFIRMED", "Identification ≠ Severity ≠ Current Activity ≠ Need-for-Action ≠ Management Selection ≠ Chemical Eligibility"],
    };
  }

  const applicationQualityStates = Object.freeze(["APPLICATION_CONTEXT_INCOMPLETE", "APPLICATION_CONTEXT_RECORDED", "APPLICATION_QUALITY_NOT_ESTABLISHED", "APPLICATION_ISSUE_PLAUSIBLE", "TARGET_IDENTITY_REVIEW_REQUIRED", "CURRENT_ACTIVITY_REVIEW_REQUIRED", "REINFESTATION_NOT_RESOLVED", "REGULATORY_USE_UNRESOLVED", "RESISTANCE_EVIDENCE_INSUFFICIENT", "RESISTANCE_HYPOTHESIS_REVIEWABLE", "MORE_EVIDENCE_REQUIRED", "HUMAN_REVIEW_REQUIRED"]);
  const applicationSuitabilityStates = Object.freeze(["CONTEXT_RECORDED", "CONTEXT_INCOMPLETE", "POTENTIAL_LIMITATION", "CONFLICTING_CONTEXT", "NEEDS_REVIEW", "NOT_APPLICABLE"]);
  const targetLocationProfiles = Object.freeze({
    "brown-planthopper": { location: "plant_base", evidence: "GOVERNED_TARGET_KNOWLEDGE", limitation: "Application occurrence does not establish that deposition reached the plant base." },
    leaffolder: { location: "folded_leaf_interior", evidence: "GOVERNED_TARGET_KNOWLEDGE", limitation: "Historical folded leaves do not establish live larvae or successful exposure inside the fold." },
    "stem-borer-group": { location: "stem_interior", evidence: "GOVERNED_TARGET_KNOWLEDGE", limitation: "Deadheart or whitehead does not identify a species, and external application does not establish stem-interior exposure." },
    blast: { location: "leaf_or_affected_organ", evidence: "GOVERNED_DISEASE_CONTEXT", limitation: "Lesion appearance and application history do not confirm a pathogen or fungicide failure." },
  });

  function evaluateApplicationContext(input = {}) {
    const event = input.applicationEvent || {};
    const context = event.context || {};
    const assertion = (subject, record, fallbackLimitations = []) => {
      if (!record || record.value === undefined || record.value === null || record.value === "") return { subject, state: "UNKNOWN", value: null, unit: null, denominator: null, timestamp: null, source: null, evidence_state: null, direct: null, limitations: fallbackLimitations, supersedes_assertion_id: null };
      return { subject, state: "CONTEXT_RECORDED", value: record.value, unit: record.unit || null, denominator: record.denominator || null, timestamp: record.timestamp || event.timestamp || null, source: record.source || "USER", evidence_state: record.evidenceState || "REPORTED", direct: record.direct === true, limitations: record.limitations || fallbackLimitations, supersedes_assertion_id: record.supersedesAssertionId || null };
    };
    const method = assertion("application_method", context.applicationMethod, ["Recorded method does not establish application quality or suitability."]);
    const waterVolume = assertion("water_volume", context.waterVolume, ["Recorded water volume is not a recommended volume and incompatible units are not converted."]);
    const equipment = assertion("equipment_or_drone", context.equipment, ["Recorded equipment settings do not confirm deposition or establish recommended settings."]);
    const weather = assertion("application_weather", context.weather, ["Weather relevance remains limited by source, location, and observation time."]);
    const cropCanopy = assertion("crop_and_canopy", context.cropCanopy, ["Crop or canopy context alone does not establish application quality."]);
    const timing = assertion("timing_context", context.timing, ["Application history does not establish a recommended interval or causality."]);
    const targetProfile = targetLocationProfiles[input.subject] || null;
    const targetLocation = context.targetLocation ? assertion("target_location", context.targetLocation) : targetProfile ? { subject: "target_location", state: "CONTEXT_RECORDED", value: targetProfile.location, unit: null, denominator: null, timestamp: null, source: targetProfile.evidence, evidence_state: "GOVERNED_CONTEXT", direct: false, limitations: [targetProfile.limitation], supersedes_assertion_id: null } : assertion("target_location", null, ["Target location remains unknown."]);
    const coverageInput = context.coverageEvidence;
    const coverageEvidence = coverageInput && coverageInput.status !== "UNKNOWN" ? { ...assertion("coverage_evidence", coverageInput), coverage_status: coverageInput.status } : { ...assertion("coverage_evidence", null, ["Coverage was not measured and cannot be inferred from method or equipment settings."]), coverage_status: "UNKNOWN" };
    const assertions = [method, waterVolume, equipment, weather, cropCanopy, targetLocation, timing];
    const missing = assertions.filter((item) => item.state === "UNKNOWN").map((item) => item.subject);
    if (coverageEvidence.coverage_status === "UNKNOWN") missing.push("coverage_evidence");
    const anomalyKeys = ["equipmentInterruption", "sensorMismatch", "flowAnomaly", "skippedLine", "overlap", "nozzleBlockage"].filter((key) => context.anomalies?.[key] === true);
    const potentialLimitations = anomalyKeys.map((key) => ({ state: "POTENTIAL_LIMITATION", evidence: key, interpretation: "RELEVANCE_UNRESOLVED", instruction: null, limitation: "Recorded anomaly may matter to Human Review but does not confirm poor application or justify corrective settings." }));
    const conflicting = context.conflicts || [];
    const states = [missing.length ? "CONTEXT_INCOMPLETE" : "CONTEXT_RECORDED", potentialLimitations.length ? "POTENTIAL_LIMITATION" : null, conflicting.length ? "CONFLICTING_CONTEXT" : null, missing.length || potentialLimitations.length || conflicting.length ? "NEEDS_REVIEW" : null].filter(Boolean);
    const nextSubject = missing[0] || null;
    return {
      model: "application-context-evidence/v1",
      applicationEvent: { id: event.id || null, caseReference: event.caseReference || input.caseReference || null, timestamp: event.timestamp || null, eventType: "CASE_SCOPED_APPLICATION_HISTORY", recordedProduct: event.recordedProduct || null, activeIngredient: event.activeIngredient || null, formulation: event.formulation || null, provenance: event.provenance || [], limitations: event.limitations || ["Application Event is Case evidence, not an execution task, spray order, schedule, or prescription."], executionTask: null, prescription: null },
      states, assertions, coverageEvidence, previousApplication: { status: event.previousApplication ? "CASE_HISTORY_RECORDED" : "NOT_RECORDED", record: event.previousApplication || null, conclusions: { failure: null, resistance: null, underDose: null, overDose: null, retreatment: null, moaSwitch: null } },
      potentialLimitations, conflicts: conflicting, missingEvidence: missing,
      nextBestEvidence: nextSubject ? { architecture: "field-action-handoff/v1", count: 1, action_type: "RECORD", subject: nextSubject, completion: "EXPLICIT_HUMAN_SUBMISSION_REQUIRED", instruction: null } : { architecture: "field-action-handoff/v1", count: 0, action_type: null, subject: null, completion: null, instruction: null },
      sequence: { order: ["T0", "APPLICATION_EVENT", "T1", "T2", "OUTCOME_REVIEW"], causalityEstablished: false, efficacyEstablished: false, resistanceEstablished: false },
      comparisonInteraction: { orderingChanged: false, scoreChanged: false, preferredProduct: null, productSelected: null },
      regulatoryInteraction: { authorityWaived: false, authorityState: input.regulatoryState || "PRESERVED_SEPARATELY", boundary: "APPLICATION CONTEXT â‰  REGULATORY AUTHORITY" },
      manufacturerBoundary: { sourceFactsMayBeRecorded: true, caseInstructionCreated: false },
      suitability: { applicationQuality: "NOT_ESTABLISHED", score: null, passFail: null, recommendation: null, dose: null, droneSettings: null, waterVolume: null, sprayTiming: null, retreatment: null },
      photoBoundary: "Photo received â‰  Photo analyzed â‰  Observation confirmed",
      learn: { automaticPromotion: false, efficacyLearning: false, resistanceLearning: false, settingsLearning: false },
      privacy: { persistence: "BROWSER_LOCAL_ONLY", automaticGpsPersistence: false, telemetryUpload: false, analytics: false, tracking: false, synchronization: false },
      boundaries: ["RECORDED APPLICATION CONTEXT â‰  CONFIRMED APPLICATION QUALITY", "APPLICATION EVENT â‰  EXECUTION TASK", "FAILED CONTROL â‰  RESISTANCE", "POTENTIAL LIMITATION â‰  APPLICATION INSTRUCTION"],
    };
  }
  const moaAuthority = Object.freeze({
    imidacloprid: { system: "IRAC", group: "4A", evidence: "EV-IRAC-CPM-001/v1" }, buprofezin: { system: "IRAC", group: "16", evidence: "EV-IRAC-CPM-002/v1" }, fipronil: { system: "IRAC", group: "2B", evidence: "EV-IRAC-CPM-003/v1" },
    carbendazim: { system: "FRAC", group: "1", evidence: "EV-FRAC-CPM-001/v1" }, isoprothiolane: { system: "FRAC", group: "6", evidence: "EV-FRAC-CPM-002/v1" }, propiconazole: { system: "FRAC", group: "3", evidence: "EV-FRAC-CPM-003/v1" }, tricyclazole: { system: "FRAC", group: "16.1", evidence: "EV-FRAC-CPM-004/v1" }, validamycin: { system: "FRAC", group: "U18", evidence: "EV-FRAC-CPM-005/v1" }, mancozeb: { system: "FRAC", group: "M03", evidence: "EV-FRAC-CPM-006/v1" },
    "cyhalofop-butyl": { system: "HRAC", group: "1 / A", evidence: "EV-HRAC-CPM-001/v1" }, "bispyribac-sodium": { system: "HRAC", group: "2 / B", evidence: "EV-HRAC-CPM-002/v1" }, "bensulfuron-methyl": { system: "HRAC", group: "2 / B", evidence: "EV-HRAC-CPM-003/v1" }, penoxsulam: { system: "HRAC", group: "2 / B", evidence: "EV-HRAC-CPM-004/v1" }, quinclorac: { system: "HRAC", group: "4/29 / O.L", evidence: "EV-HRAC-CPM-005/v1" }, propanil: { system: "HRAC", group: "5 / C2", evidence: "EV-HRAC-CPM-006/v1" },
  });

  function evaluateFailedControl(input = {}) {
    const outcome = input.outcomeObservation || {};
    const intervention = input.intervention || {};
    const identity = input.targetIdentity || {};
    const activity = input.activityReview || {};
    const originalRate = intervention.rate ? { ...intervention.rate, source: "USER", normalized: false } : { status: "UNKNOWN", source: "USER" };
    const waterVolume = intervention.waterVolume ? { ...intervention.waterVolume, source: "USER" } : { status: "UNKNOWN", source: "USER" };
    let arithmetic = { status: "NOT_CALCULATED" };
    if (Number.isFinite(waterVolume.tankVolume) && Number.isFinite(waterVolume.treatedAreaPerTank) && waterVolume.treatedAreaPerTank > 0) arithmetic = { status: "CALCULATED", waterVolumePerRai: waterVolume.tankVolume / waterVolume.treatedAreaPerTank, unit: "reported_volume_per_rai", role: "CALCULATION", interpretation: null };
    const history = (input.moaHistory || []).map((item) => { const authority = item.activeIngredient ? moaAuthority[String(item.activeIngredient).toLowerCase()] : null; return { originalIdentity: item.activeIngredient || null, identityResolved: Boolean(authority), classification: authority || null, source: authority ? "GOVERNED_MOA_AUTHORITY" : "USER_UNRESOLVED" }; });
    const resolvedGroups = history.filter((item) => item.classification).map((item) => `${item.classification.system}:${item.classification.group}`);
    const moaSummary = !history.length ? "MOA_HISTORY_INCOMPLETE" : history.some((item) => !item.identityResolved) ? "ACTIVE_IDENTITY_UNRESOLVED" : new Set(resolvedGroups).size === 1 && resolvedGroups.length > 1 ? "SAME_MOA_OBSERVED_REPEATEDLY" : "MULTIPLE_MOA_GROUPS_OBSERVED";
    const regulatoryReview = identity.candidate && window.SPDecisionAuthority?.priorityRegulatoryReview?.[identity.candidate];
    const regulatoryStatus = regulatoryReview ? window.SPDecisionAuthority.evaluateRegulatoryChain(regulatoryReview) : window.SPDecisionAuthority?.registration?.status || "NO_REGULATORY_EVIDENCE";
    const applicationFields = ["applicationDate", "applicationTime", "product", "method"];
    const contextComplete = applicationFields.every((field) => intervention[field]);
    const applicationConcern = Boolean(input.applicationQualityObservation && (input.applicationQualityObservation.missedStrip || input.applicationQualityObservation.overlap || input.applicationQualityObservation.interruption || input.applicationQualityObservation.inconsistentPass));
    const resistancePrerequisites = [identity.resolved, activity.currentActivitySupported, Boolean(intervention.applicationDate), Boolean(intervention.rate), Boolean(intervention.method), Boolean(input.weatherAtApplication), Boolean(input.fieldWater), history.length > 0, !["NO_REGULATORY_EVIDENCE", "REGISTRATION_IDENTITY_MATCH_ONLY", "HUMAN_REVIEW_REQUIRED"].includes(regulatoryStatus), input.reinfestationReviewed === true, input.alternativesReviewed === true];
    const resistanceState = resistancePrerequisites.every(Boolean) ? "RESISTANCE_HYPOTHESIS_REVIEWABLE" : input.reportedControlFailure ? "RESISTANCE_EVIDENCE_INSUFFICIENT" : "RESISTANCE_NOT_ASSESSED";
    const gaps = [];
    if (!outcome.observed) gaps.push({ key: "OUTCOME_OBSERVATION", question: "What exactly remained or changed after the intervention?" });
    if (!identity.resolved) gaps.push({ key: "TARGET_IDENTITY", question: "What target or damage source is currently observable?" });
    if (!activity.currentActivitySupported && !activity.historicalDamageSupported) gaps.push({ key: "ACTIVITY_OR_DAMAGE_AGE", question: "Is there new damage or current activity, or only old visible damage?" });
    if (!intervention.applicationDate) gaps.push({ key: "APPLICATION_TIME", question: "When was the application made and when was the outcome assessed?" });
    if (!intervention.product) gaps.push({ key: "PRODUCT_IDENTITY", question: "What exact product wording was used?" });
    if (!intervention.rate) gaps.push({ key: "RATE", question: "What rate, unit, and denominator were reported?" });
    if (!intervention.waterVolume) gaps.push({ key: "WATER_VOLUME", question: "How much water and treated area per tank were reported?" });
    if (!intervention.method) gaps.push({ key: "APPLICATION_METHOD", question: "Was the application by drone, ground sprayer, manual equipment, or another method?" });
    if (!input.weatherAtApplication) gaps.push({ key: "WEATHER_AT_APPLICATION", question: "Was rain, wind, temperature, or humidity recorded at application time?" });
    if (!input.fieldWater) gaps.push({ key: "FIELD_WATER", question: "What was the rice-field water condition at application?" });
    const states = [contextComplete ? "APPLICATION_CONTEXT_RECORDED" : "APPLICATION_CONTEXT_INCOMPLETE", "APPLICATION_QUALITY_NOT_ESTABLISHED", applicationConcern ? "APPLICATION_ISSUE_PLAUSIBLE" : null, identity.resolved ? null : "TARGET_IDENTITY_REVIEW_REQUIRED", activity.currentActivitySupported || activity.historicalDamageSupported ? null : "CURRENT_ACTIVITY_REVIEW_REQUIRED", input.reinfestationReviewed === true ? null : "REINFESTATION_NOT_RESOLVED", regulatoryStatus === "ELIGIBLE_FOR_DECISION_REVIEW" ? null : "REGULATORY_USE_UNRESOLVED", resistanceState, gaps.length ? "MORE_EVIDENCE_REQUIRED" : null, "HUMAN_REVIEW_REQUIRED"].filter(Boolean);
    const reportedContext = {
      applicationMethod: intervention.method ? { value: intervention.method, timestamp: intervention.applicationDate || null, source: "USER", evidenceState: "REPORTED", direct: true } : null,
      waterVolume: intervention.waterVolume ? { value: intervention.waterVolume, timestamp: intervention.applicationDate || null, source: "USER", evidenceState: "REPORTED", direct: true } : null,
      equipment: intervention.equipment || intervention.drone ? { value: intervention.equipment || intervention.drone, timestamp: intervention.applicationDate || null, source: "USER", evidenceState: "REPORTED", direct: true } : null,
      weather: input.weatherAtApplication ? { value: input.weatherAtApplication, timestamp: intervention.applicationDate || null, source: "USER", evidenceState: "REPORTED", direct: true } : null,
      cropCanopy: input.cropCanopyContext ? { value: input.cropCanopyContext, timestamp: intervention.applicationDate || null, source: "USER", evidenceState: "REPORTED", direct: true } : null,
      targetLocation: input.targetLocation ? { value: input.targetLocation, source: "USER", evidenceState: "OBSERVED", direct: true } : null,
      timing: intervention.applicationTime ? { value: intervention.applicationTime, timestamp: intervention.applicationDate || null, source: "USER", evidenceState: "REPORTED", direct: true } : null,
      coverageEvidence: input.applicationQualityObservation ? { value: input.applicationQualityObservation, status: "OBSERVED_LIMITED", timestamp: outcome.observationTime || null, source: "USER", evidenceState: "OBSERVED", direct: true } : { status: "UNKNOWN" },
      anomalies: input.applicationQualityObservation || {},
    };
    const reportedEvent = { caseReference: input.caseReference, timestamp: intervention.applicationDate || null, recordedProduct: intervention.product || null, activeIngredient: intervention.activeIngredient || null, formulation: intervention.formulation || null, context: reportedContext, previousApplication: intervention };
    const applicationContextEvidence = evaluateApplicationContext({ caseReference: input.caseReference, subject: identity.candidate || input.subject, applicationEvent: input.applicationEvent || reportedEvent, regulatoryState: regulatoryStatus });
    return {
      model: "application-failed-control-investigation/v1", start: input.reportedControlFailure ? "REPORTED_CONTROL_FAILURE" : "OUTCOME_UNRESOLVED", states: [...new Set(states)], evidenceRoles: Object.values(ROLES),
      outcomeObservation: { expected: outcome.expected || null, observed: outcome.observed || null, observationTime: outcome.observationTime || null, affectedArea: outcome.affectedArea || null, treatedArea: outcome.treatedArea || null, untreatedComparison: outcome.untreatedComparison || null, targetStillObservable: outcome.targetStillObservable ?? null, newDamage: outcome.newDamage ?? null, oldDamage: outcome.oldDamage ?? null, progression: outcome.progression ?? null, cropInjury: outcome.cropInjury ?? null, boundary: "EXPECTED OUTCOME ≠ GOVERNED EFFICACY STANDARD" },
      targetIdentity: { ...identity, role: ROLES.REQUIRED_TO_DISTINGUISH }, activityReview: { ...activity, boundary: "DAMAGE PRESENT ≠ CURRENT ACTIVITY" },
      interventionHistory: { originalUserWording: intervention.originalUserWording || null, applicationDate: intervention.applicationDate || null, applicationTime: intervention.applicationTime || null, product: intervention.product || null, activeIngredient: intervention.activeIngredient || null, formulation: intervention.formulation || null, rate: originalRate, waterVolume, treatedArea: intervention.treatedArea || null, method: intervention.method || "unknown", applicationCount: intervention.applicationCount || null, interval: intervention.interval || null, tankMixture: intervention.tankMixture || [], adjuvant: intervention.adjuvant || null, fertilizerInTank: intervention.fertilizerInTank || null, operator: intervention.operator || null, equipment: intervention.equipment || null, notes: intervention.notes || null },
      waterArithmetic: arithmetic, moaHistory: { records: history, summary: moaSummary, boundary: "SAME MOA REPEATED ≠ RESISTANCE" },
      droneContext: intervention.method === "agricultural_drone" ? { role: ROLES.CONTEXTUAL, model: intervention.drone?.model || null, nozzleOrAtomizer: intervention.drone?.nozzleOrAtomizer || null, flightHeight: intervention.drone?.flightHeight || null, flightSpeed: intervention.drone?.flightSpeed || null, routeSpacing: intervention.drone?.routeSpacing || null, flowRate: intervention.drone?.flowRate || null, dropletSetting: intervention.drone?.dropletSetting || null, tankVolume: intervention.drone?.tankVolume || null, treatedAreaPerTank: intervention.drone?.treatedAreaPerTank || null, operationMode: intervention.drone?.operationMode || null, operatorEvents: intervention.drone?.operatorEvents || [], boundary: "DRONE TELEMETRY ≠ BIOLOGICAL DEPOSITION CONFIRMATION" } : { role: ROLES.UNAVAILABLE },
      coverageDeposition: { observations: input.applicationQualityObservation || {}, role: ROLES.CONTEXTUAL, quality: "NOT_ESTABLISHED", boundary: "SPRAY OCCURRED ≠ TARGET RECEIVED EFFECTIVE DEPOSITION" },
      weather: { atApplication: input.weatherAtApplication ? { value: input.weatherAtApplication, role: ROLES.CONTEXTUAL, retrieval: "USER_INITIATED_ONLY" } : { role: ROLES.UNAVAILABLE }, atObservation: input.weatherAtObservation ? { value: input.weatherAtObservation, role: ROLES.CONTEXTUAL } : { role: ROLES.UNAVAILABLE }, automaticCoordinateTransmission: false, thresholds: [] },
      fieldWater: input.fieldWater ? { value: input.fieldWater, role: ROLES.CONTEXTUAL } : { role: ROLES.UNAVAILABLE }, reinfestation: { status: input.reinfestationReviewed === true ? "REVIEWED_NOT_PROVEN" : "UNRESOLVED", boundary: "PEST PRESENT AFTER APPLICATION ≠ SURVIVING ORIGINAL POPULATION; NEARBY CASE ≠ SOURCE OF REINFESTATION" },
      regulatoryUse: { status: regulatoryStatus, cropTargetUseRegistration: "PRESERVED_SEPARATELY", boundary: "REGISTRATION ≠ EFFICACY" }, resistance: { status: resistanceState, prerequisites: resistancePrerequisites, confirmationAvailable: false, boundary: "CONTROL FAILURE ≠ RESISTANCE" },
      differential: ["target_identity_unresolved", "wrong_or_mixed_target", "historical_damage_only", "current_activity_or_progression", "timing_or_stage_unresolved", "application_context_or_deposition", "environment_or_field_water", "product_or_mixture_identity", "regulatory_use_unresolved", "reinfestation_or_new_exposure", "resistance_hypothesis_unresolved"],
      missingEvidence: gaps, nextBestEvidence: gaps[0] ? { action: "ASK_ONE_QUESTION", ...gaps[0] } : { action: "HUMAN_REVIEW" },
      photoMission: { action: "HUMAN_CONFIRMED_CAPTURE", missions: ["CURRENT_TARGET_ACTIVITY", "NEW_VS_OLD_DAMAGE", "TREATED_VS_UNTREATED", "FIELD_PATTERN", "MISSED_OR_OVERLAP_PATTERN", "CROP_INJURY", "PLANT_BASE", "FOLDED_LEAF_INTERIOR"], automaticImageAnalysis: false, boundary: "Photo received ≠ Photo analyzed" },
      economics: { inputsPreserved: ["treatedArea", "applicationCount", "productAmount", "applicationMethod", "reapplicationReported"], recommendation: null }, executionReadiness: "CASE_OBSERVATIONS_ONLY", learnReadiness: { sequence: ["Intervention", "T1", "T2", "Outcome observation"], boundary: "FIELD OUTCOME ≠ CANONICAL EFFICACY CLAIM" },
      management: { readiness: "EVIDENCE_PREPARATION_ONLY", humanReviewRequired: true, reapplication: null, productRecommendation: null, activeIngredientRecommendation: null, doseIncreaseDecision: null, moaRotationRecommendation: null, chemicalGate: "CHEMICAL_REVIEW_BLOCKED" },
      applicationContextEvidence,
      boundaries: ["OLD DAMAGE ≠ CONTROL FAILURE", "CURRENT ACTIVITY ≠ CHEMICAL ACTION REQUIRED", "APPLICATION BEFORE OUTCOME ≠ CAUSATION", "APPLICATION ISSUE PLAUSIBLE ≠ APPLICATION FAILURE CONFIRMED", "PRODUCT REGISTERED ≠ EFFECTIVE IN THIS CASE", "WEATHER ASSOCIATION ≠ CAUSATION"],
    };
  }

  const needForActionStates = Object.freeze(["MORE_EVIDENCE_REQUIRED", "CONTINUE_MONITORING", "NO_ACTION_DETERMINATION_SUPPORTED", "MANAGEMENT_REVIEW_JUSTIFIED", "NON_CHEMICAL_REVIEW_JUSTIFIED", "HUMAN_REVIEW_REQUIRED", "CHEMICAL_REVIEW_BLOCKED", "CHEMICAL_REVIEW_ELIGIBILITY_UNRESOLVED"]);
  const managementOptionClasses = Object.freeze(["MONITORING", "FIELD_INSPECTION", "CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "WATER_MANAGEMENT", "BIOLOGICAL_MANAGEMENT", "CHEMICAL_MANAGEMENT_REVIEW", "EXPERT_REVIEW", "OTHER_GOVERNED_MANAGEMENT"]);

  function evaluateNeedForAction(input = {}) {
    const authority = window.SPDecisionAuthority;
    const subject = input.subject || null;
    const actionEvidence = subject ? authority?.actionEvidence?.[subject === "leaffolder" && authority.actionEvidence["leaffolder-thai"] ? "leaffolder-thai" : subject] || null : null;
    const identified = ["PROVISIONAL_IDENTIFICATION", "IDENTIFICATION_SUPPORTED"].includes(input.identificationState);
    const alternativesResolved = input.alternativesResolved === true;
    const currentActivity = input.activityState === "CURRENT_ACTIVITY_SUPPORTED";
    const historicalOnly = input.activityState === "HISTORICAL_DAMAGE_SUPPORTED" && input.progressionState !== "PROGRESSION_SUPPORTED" && input.newDamage !== true;
    const progressing = input.progressionState === "PROGRESSION_SUPPORTED";
    const failedControl = input.failedControlContext || null;
    const weatherOnly = Boolean(input.weatherContext) && !identified && !currentActivity && !progressing;
    const nearbyOnly = Boolean(input.nearbyCase) && !identified && !currentActivity && !progressing;
    const burden = { observations: input.burdenEvidence || {}, labels: [], limitation: "observable burden only; no generic LOW/MEDIUM/HIGH severity" };
    const applicability = actionEvidence ? { status: actionEvidence.thaiApplicability, geography: actionEvidence.geography || "international/reference context", cropStage: actionEvidence.cropStage || "not stated", samplingMethod: actionEvidence.samplingMethod || "source criterion wording", limitations: actionEvidence.limitations || [] } : { status: "NO_GOVERNED_ACTION_EVIDENCE", limitations: ["subject-specific threshold or criterion unavailable"] };
    let needForAction = "MORE_EVIDENCE_REQUIRED";
    let basis = "Identification and current evidence are incomplete.";
    let next = { key: "TARGET_IDENTIFICATION", question: "What target or cause is supported by the field evidence?" };
    if (historicalOnly) {
      needForAction = actionEvidence ? "CONTINUE_MONITORING" : "MORE_EVIDENCE_REQUIRED";
      basis = "Historical damage is supported without current activity, progression, or new damage.";
      next = { key: "REPEAT_OBSERVATION", question: "Has new damage or current activity appeared since the last observation?" };
    } else if (weatherOnly || nearbyOnly) {
      needForAction = "NO_ACTION_DETERMINATION_SUPPORTED";
      basis = weatherOnly ? "Weather is contextual and cannot independently establish management need." : "A nearby Case is surveillance context and cannot independently establish management need.";
      next = { key: "FIELD_INSPECTION", question: "What is directly observable in this field?" };
    } else if (!identified || !alternativesResolved) {
      needForAction = "MORE_EVIDENCE_REQUIRED";
      basis = "Identification or differential alternatives remain unresolved.";
      next = { key: "TARGET_IDENTIFICATION", question: "What distinguishing evidence resolves the target or competing cause families?" };
    } else if (!currentActivity && !progressing) {
      needForAction = "MORE_EVIDENCE_REQUIRED";
      basis = "Current activity and progression are not established.";
      next = { key: "CURRENT_ACTIVITY", question: "Is current activity, new damage, or new affected tissue directly observable?" };
    } else if (failedControl && failedControl.states?.includes("MORE_EVIDENCE_REQUIRED")) {
      needForAction = "HUMAN_REVIEW_REQUIRED";
      basis = "Reported control failure retains unresolved Sprint-081 alternatives and cannot skip to re-treatment.";
      next = failedControl.nextBestEvidence || { key: "FAILED_CONTROL_REVIEW", question: "What failed-control evidence remains unresolved?" };
    } else if (subject === "brown-planthopper" && actionEvidence?.thaiApplicability === "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION") {
      const count = input.measurements?.insectsPerPlant;
      if (!Number.isFinite(count)) {
        needForAction = "MORE_EVIDENCE_REQUIRED";
        basis = "Current BPH activity is supported, but the governed insects-per-plant measurement is missing.";
        next = { key: "INSECTS_PER_PLANT", question: "What is the observed average number of insects per plant, preserving the sampling unit?" };
      } else if (input.measurements?.unit !== "insects_per_plant") {
        needForAction = "HUMAN_REVIEW_REQUIRED";
        basis = "The reported sampling unit cannot be silently converted to insects per plant.";
        next = { key: "SAMPLING_UNIT_REVIEW", question: "Can the observation be repeated and recorded explicitly as insects per plant?" };
      } else if (count >= actionEvidence.triggerValue) {
        needForAction = "MANAGEMENT_REVIEW_JUSTIFIED";
        basis = `The observed ${count} insects per plant meets the governed ${actionEvidence.triggerValue} insects-per-plant economic criterion, subject to its stated limitations.`;
        next = { key: "MANAGEMENT_OPTIONS", question: "Which governed management option classes are applicable to this Case?" };
      } else {
        needForAction = "CONTINUE_MONITORING";
        basis = `The observed ${count} insects per plant is below the governed ${actionEvidence.triggerValue} insects-per-plant criterion.`;
        next = { key: "REPEAT_COUNT", question: "When should the same insects-per-plant observation be repeated?" };
      }
    } else if (subject === "leaffolder" && actionEvidence?.id === "AE-083-LF-TH-001/v1") {
      const incidence = input.measurements?.percentAffectedLeaves;
      const stage = input.cropStage;
      const trigger = stage === "rice_15_40_days" ? 15 : stage === "flag_leaf" ? 10 : null;
      if (!Number.isFinite(incidence) || trigger === null) {
        needForAction = "MORE_EVIDENCE_REQUIRED";
        basis = "Thai leaffolder Action Evidence is available, but the stage-specific affected-leaf measurement is incomplete.";
        next = { key: "LEAFFOLDER_STAGE_INCIDENCE", question: "What is the crop stage and percentage of rice leaves damaged?" };
      } else if (incidence >= trigger) {
        needForAction = "MANAGEMENT_REVIEW_JUSTIFIED";
        basis = `The observed ${incidence} percent affected leaves meets the governed ${trigger} percent stage-specific Thai criterion, subject to its sampling limitation.`;
        next = { key: "MANAGEMENT_OPTIONS", question: "Which governed management option classes are applicable to this Case?" };
      } else {
        needForAction = "CONTINUE_MONITORING";
        basis = `The observed ${incidence} percent affected leaves is below the governed ${trigger} percent stage-specific Thai criterion.`;
        next = { key: "REPEAT_INCIDENCE", question: "When should affected-leaf incidence be observed again?" };
      }
    } else if (actionEvidence?.thaiApplicability === "REFERENCE_EVIDENCE_ONLY") {
      needForAction = "NO_ACTION_DETERMINATION_SUPPORTED";
      basis = "Reference evidence is available, but Thai operational action authority is unresolved.";
      next = { key: "HUMAN_REVIEW", question: "Can a qualified reviewer assess the reference criterion and Thai applicability?" };
    } else {
      needForAction = "NO_ACTION_DETERMINATION_SUPPORTED";
      basis = progressing ? "Progression is supported, but no governed applicable action criterion exists." : "No governed applicable action criterion exists.";
      next = { key: "HUMAN_REVIEW", question: "Can a qualified reviewer assess the unsupported management decision?" };
    }
    const keyA = needForAction === "MANAGEMENT_REVIEW_JUSTIFIED";
    const regulatoryReview = subject ? authority?.priorityRegulatoryReview?.[subject] : null;
    const regulatoryStatus = regulatoryReview ? authority.evaluateRegulatoryChain(regulatoryReview) : authority?.registration?.status || "NO_REGULATORY_EVIDENCE";
    const keyB = regulatoryStatus === "ELIGIBLE_FOR_DECISION_REVIEW";
    const chemicalGate = keyA && keyB ? "CHEMICAL_OPTIONS_READY_FOR_DECISION_REVIEW" : keyA ? "CHEMICAL_REVIEW_ELIGIBILITY_UNRESOLVED" : "CHEMICAL_REVIEW_BLOCKED";
    const options = [];
    if (["CONTINUE_MONITORING", "MORE_EVIDENCE_REQUIRED"].includes(needForAction)) options.push({ class: "MONITORING", eligibility: "CASE_RELEVANCE_SUPPORTED" }, { class: "FIELD_INSPECTION", eligibility: "CASE_RELEVANCE_SUPPORTED" });
    if (["NO_ACTION_DETERMINATION_SUPPORTED", "HUMAN_REVIEW_REQUIRED"].includes(needForAction)) options.push({ class: "EXPERT_REVIEW", eligibility: "REQUIRES_HUMAN_REVIEW" });
    if (keyA) options.push({ class: "EXPERT_REVIEW", eligibility: "CASE_RELEVANCE_SUPPORTED" }, { class: "CHEMICAL_MANAGEMENT_REVIEW", eligibility: keyB ? "CHEMICAL_REGULATORY_REVIEW_REQUIRED" : "CASE_APPLICABILITY_UNRESOLVED" });
    const humanReasons = [!identified ? "unresolved identification" : null, !alternativesResolved ? "unresolved differential alternatives" : null, applicability.status === "NO_GOVERNED_ACTION_EVIDENCE" ? "missing subject-specific Action Evidence" : null, applicability.limitations?.some((item) => item.includes("point") || item.includes("plant")) ? "sampling-unit limitation" : null, failedControl ? "failed-control complexity" : null, regulatoryStatus !== "ELIGIBLE_FOR_DECISION_REVIEW" ? "regulatory ambiguity" : null, needForAction === "NO_ACTION_DETERMINATION_SUPPORTED" ? "unsupported management determination" : null].filter(Boolean);
    return {
      model: "need-for-action-decision/v1", decisionTimestamp: input.decisionTimestamp || null, subject, identificationState: input.identificationState || "UNRESOLVED", activityState: input.activityState || "UNRESOLVED", progressionState: input.progressionState || "UNRESOLVED", burden,
      actionEvidence: actionEvidence ? { id: actionEvidence.id, claim: actionEvidence.claim, evidence: actionEvidence.evidence, thresholdType: actionEvidence.thresholdType, measurement: actionEvidence.measurement, unit: actionEvidence.unit, samplingMethod: actionEvidence.samplingMethod || null, source: actionEvidence.source, limitations: actionEvidence.limitations } : null,
      applicability, needForAction, decisionBasis: basis, nextBestDecisionEvidence: { action: "ASK_ONE_QUESTION", ...next },
      managementGate: keyA ? "OPEN_FOR_OPTION_CLASS_REVIEW" : "CLOSED", managementOptions: options, managementOptionClasses,
      twoKeyGate: { keyA: { question: "SHOULD MANAGEMENT BE REVIEWED?", satisfied: keyA }, keyB: { question: "IS A CHEMICAL OPTION REGULATORILY ELIGIBLE?", satisfied: keyB, status: regulatoryStatus }, result: chemicalGate },
      chemicalGate, efficacyGate: { status: keyB ? "ELIGIBLE_BUT_EFFICACY_NOT_ASSESSED" : "REGULATORY_ELIGIBILITY_UNRESOLVED", boundary: "REGULATORY ELIGIBILITY ≠ EFFICACY EVIDENCE ≠ CASE SUITABILITY ≠ PRODUCT RANKING" },
      humanReview: { required: humanReasons.length > 0, reasons: humanReasons },
      explainability: { observed: { burden: input.burdenEvidence || {}, measurements: input.measurements || {} }, supported: [input.identificationState, input.activityState, input.progressionState].filter(Boolean), uncertain: humanReasons, actionEvidenceAvailable: Boolean(actionEvidence), applicable: applicability.status, reason: basis, evidenceThatWouldChangeDecision: next, managementGate: keyA ? "OPEN" : "CLOSED", chemicalGate },
      traceability: { scientific: ["Case Observation", "Candidate / Identification", "Current Activity / Progression", "Action Evidence", "Claim", "Evidence", "Source locator", "Applicability", "Need-for-Action", "Management Gate"], regulatory: ["Case Candidate", "Crop x Target x Use", "Regulatory Evidence", "Current Registration", "Chemical Eligibility"] },
      execute: { planCreated: false, droneMissionCreated: false }, learn: { canonicalPromotion: false, boundary: "FIELD OUTCOME ≠ CANONICAL KNOWLEDGE" }, recommendation: null,
      boundaries: ["PROBLEM PRESENT ≠ ACTION REQUIRED", "CURRENT ACTIVITY ≠ ACTION REQUIRED", "PROGRESSION ≠ CHEMICAL ACTION REQUIRED", "THRESHOLD MET ≠ PESTICIDE REQUIRED", "MANAGEMENT REVIEW ≠ CHEMICAL RECOMMENDATION", "OLD DAMAGE ≠ CURRENT MANAGEMENT NEED", "CONTROL FAILURE ≠ RESISTANCE", "NEARBY CASE ≠ ACTION REQUIRED"],
    };
  }

  const managementSuitabilityStates = Object.freeze(["SUPPORTED_FOR_REVIEW", "MORE_EVIDENCE_REQUIRED", "NOT_SUPPORTED_BY_CURRENT_EVIDENCE", "BLOCKED_BY_AUTHORITY", "HUMAN_REVIEW_REQUIRED", "NOT_APPLICABLE"]);
  function evaluateManagementSuitability(input = {}) {
    const decision = input.needForActionDecision || evaluateNeedForAction(input);
    const subject = input.subject || decision.subject;
    const option = (optionClass, state, why, supporting = [], missing = [], limitations = [], humanReview = false) => ({ optionClass, state, why, supporting: supporting.map((item) => ({ item, role: ROLES.SUPPORTING })), missing: missing.map((item) => ({ item, role: ROLES.REQUIRED_TO_DISTINGUISH })), contradictions: [], context: [], whatCouldChangeState: missing[0] || null, limitations, humanReviewRequired: humanReview, suitabilityBoundary: "SUITABILITY FOR REVIEW ≠ RECOMMENDATION" });
    const options = [];
    const historicalOnly = input.activityState === "HISTORICAL_DAMAGE_SUPPORTED" && input.newDamage !== true && input.progressionState !== "PROGRESSION_SUPPORTED";
    const unresolvedIdentity = !["PROVISIONAL_IDENTIFICATION", "IDENTIFICATION_SUPPORTED"].includes(input.identificationState) || input.alternativesResolved !== true;
    const chemicalReviewRelevant = decision.needForAction === "MANAGEMENT_REVIEW_JUSTIFIED";
    if (historicalOnly || decision.needForAction === "CONTINUE_MONITORING") options.push(option("MONITORING", "SUPPORTED_FOR_REVIEW", "Historical damage or burden below the applicable criterion supports follow-up observation.", [decision.decisionBasis], [], ["No monitoring interval is inferred."], false));
    else if (decision.needForAction === "MORE_EVIDENCE_REQUIRED") options.push(option("MONITORING", "MORE_EVIDENCE_REQUIRED", "Monitoring is relevant after the missing decision measurement is defined.", [], [decision.nextBestDecisionEvidence?.question || "define the observation"], ["Observation target must remain explicit."], false));
    else options.push(option("MONITORING", "NOT_APPLICABLE", "The current decision state does not make monitoring the primary review path."));
    if (unresolvedIdentity) options.push(option("RE_INSPECTION", "SUPPORTED_FOR_REVIEW", "Candidate differentiation remains unresolved.", [input.identificationState || "unresolved identification"], [], ["Inspection does not establish diagnosis."], false));
    else if (!input.activityState || input.activityState === "UNRESOLVED") options.push(option("RE_INSPECTION", "SUPPORTED_FOR_REVIEW", "Current activity needs direct field confirmation.", [], [], ["Photo received ≠ Photo analyzed."], false));
    else options.push(option("RE_INSPECTION", "NOT_APPLICABLE", "No unresolved inspection mission currently changes the option state."));
    const governedContext = input.governedManagementContext || {};
    for (const cls of ["CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "WATER_MANAGEMENT", "BIOLOGICAL_MANAGEMENT"]) {
      const record = governedContext[cls];
      options.push(record?.caseRelevant === true ? option(cls, "SUPPORTED_FOR_REVIEW", "A governed subject/context relationship supports review.", [record.evidence], record.missing || [], record.limitations || [], Boolean(record.humanReviewRequired)) : record ? option(cls, "MORE_EVIDENCE_REQUIRED", "Governed general context exists but Case applicability is unresolved.", [record.evidence], record.missing || ["Case applicability"], record.limitations || [], Boolean(record.humanReviewRequired)) : option(cls, "NOT_SUPPORTED_BY_CURRENT_EVIDENCE", "No governed subject-specific Case relationship supports this option class."));
    }
    options.push(chemicalReviewRelevant ? option("CHEMICAL_MANAGEMENT_REVIEW", decision.twoKeyGate?.keyB?.satisfied ? "SUPPORTED_FOR_REVIEW" : "BLOCKED_BY_AUTHORITY", "Need-for-Action supports management review, but chemical readiness remains controlled by regulatory Key B.", [decision.needForAction], decision.twoKeyGate?.keyB?.satisfied ? [] : ["complete current Crop x Target x Use x Registration chain"], ["Chemical-management review does not identify or recommend a product."], !decision.twoKeyGate?.keyB?.satisfied) : option("CHEMICAL_MANAGEMENT_REVIEW", "NOT_SUPPORTED_BY_CURRENT_EVIDENCE", "Need-for-Action does not currently justify chemical-management review."));
    const expertNeeded = decision.humanReview?.required || Boolean(input.failedControlContext) || input.causeFamily === "ABIOTIC" || ["blast", "brown-spot"].includes(subject);
    options.push(expertNeeded ? option("EXPERT_REVIEW", "SUPPORTED_FOR_REVIEW", "Unresolved scientific, failed-control, abiotic, or authority evidence requires qualified review.", decision.humanReview?.reasons || [], [], ["Human Review cannot waive missing authority."], true) : option("EXPERT_REVIEW", "NOT_APPLICABLE", "No current Human Review trigger is recorded."));
    options.push(option("OTHER_GOVERNED_MANAGEMENT", "NOT_SUPPORTED_BY_CURRENT_EVIDENCE", "No other governed management relationship is represented for this Case."));
    let next = decision.nextBestDecisionEvidence || { key: "FIELD_REVIEW", question: "What evidence would change the current option state?" };
    if (unresolvedIdentity) {
      const missions = { leaffolder: "Open folded leaves and inspect for current larvae or fresh feeding.", "brown-planthopper": "Inspect the plant base above water and confirm current insects.", blast: "Compare new and old lesions and record progression.", "brown-spot": "Compare lesion form and newly affected tissue.", "rice-field-broadleaf": "Inspect weed stem, leaves, and distribution.", "sedge-group": "Inspect stem cross-section and inflorescence.", root: "Compare roots of affected and apparently healthy hills." };
      next = { key: "RE_INSPECTION_MISSION", question: missions[subject] || missions[input.plantPart] || "Compare affected and apparently healthy plants and record distinguishing evidence." };
    }
    if (input.applicationQualityObservation && !input.applicationPatternConfirmed) next = { key: "APPLICATION_PATTERN_INSPECTION", question: "Does the observed pattern follow application passes, overlap, interruption, or appear field-wide?" };
    return {
      model: "management-case-suitability/v1", decisionTimestamp: input.decisionTimestamp || null, caseReference: input.caseReference || null, subject, workflowOrder: ["MONITORING", "RE_INSPECTION", "CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "WATER_MANAGEMENT", "BIOLOGICAL_MANAGEMENT", "CHEMICAL_MANAGEMENT_REVIEW", "EXPERT_REVIEW", "OTHER_GOVERNED_MANAGEMENT"], orderingSemantics: "deterministic workflow order; not best, preferred, effective, ranked, or recommended", optionStates: managementSuitabilityStates, decisionInputs: input, needForAction: decision.needForAction, options,
      regulatoryGate: { keyB: decision.twoKeyGate?.keyB || { satisfied: false, status: "UNRESOLVED" }, chemicalGate: decision.chemicalGate },
      nextBestDecisionQuestion: { action: "ASK_EXACTLY_ONE", key: next.key, question: next.question },
      explainability: { identification: input.identificationState || "UNRESOLVED", currentActivity: input.activityState || "UNRESOLVED", progression: input.progressionState || "UNRESOLVED", burden: input.burdenEvidence || {}, actionEvidence: decision.actionEvidence, needForAction: decision.needForAction, regulatoryGate: decision.chemicalGate, humanReview: decision.humanReview, provenance: decision.traceability },
      knowledgeGaps: { SCIENTIFIC_KNOWLEDGE_GAP: input.scientificGap || null, ACTION_AUTHORITY_GAP: decision.actionEvidence ? null : subject, MANAGEMENT_APPLICABILITY_GAP: options.filter((item) => ["MORE_EVIDENCE_REQUIRED", "NOT_SUPPORTED_BY_CURRENT_EVIDENCE"].includes(item.state)).map((item) => item.optionClass), REGULATORY_GAP: decision.twoKeyGate?.keyB?.satisfied ? null : decision.twoKeyGate?.keyB?.status || "UNRESOLVED", EFFICACY_GAP: "NOT_ASSESSED", CASE_EVIDENCE_GAP: decision.nextBestDecisionEvidence?.key || null, RESISTANCE_GAP: input.failedControlContext ? "RESISTANCE_HYPOTHESIS_UNRESOLVED" : null },
      managementRecommendation: null, productRecommendation: null, activeIngredientRecommendation: null, rateRecommendation: null, execution: { planCreated: false, droneMissionCreated: false, scheduleCreated: false }, learn: { canonicalPromotion: false, boundary: "Case outcome ≠ canonical efficacy evidence" },
      boundaries: ["MANAGEMENT_REVIEW_JUSTIFIED ≠ CHEMICAL_TREATMENT_REQUIRED", "WATER MANAGEMENT RELEVANT ≠ CHANGE WATER LEVEL", "CHEMICAL MANAGEMENT REVIEW ≠ CHEMICAL OPTIONS READY", "OLD LEAF DAMAGE ≠ CURRENT ACTIVITY", "CONTROL FAILURE ≠ RESISTANCE", "DRONE SETTINGS ≠ DEPOSITION CONFIRMATION", "NEARBY CASE ≠ TRANSMISSION", "WEATHER CONTEXT ≠ TREATMENT NEED"],
    };
  }

  const governedManagementOptionClasses = Object.freeze(["CONTINUE_MONITORING", "CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "BIOLOGICAL_MANAGEMENT", "CHEMICAL_REVIEW", "EXPERT_REVIEW", "NO_ACTION_CURRENTLY_JUSTIFIED"]);
  const managementOptionEligibilityStates = Object.freeze(["eligible", "information-required", "human-review-required", "authority-blocked", "evidence-blocked", "not-currently-justified"]);
  function evaluateManagementOptions(input = {}) {
    const suitability = input.managementSuitability || evaluateManagementSuitability(input);
    const decision = input.needForActionDecision || evaluateNeedForAction(input);
    const sourceByClass = new Map(suitability.options.map((item) => [item.optionClass, item]));
    const managementGateOpen = suitability.needForAction === "MANAGEMENT_REVIEW_JUSTIFIED";
    const caseReference = input.caseReference || suitability.caseReference || null;
    const evaluatedAt = input.evaluatedAt || input.decisionTimestamp || suitability.decisionTimestamp || null;
    const reviewedFinding = input.reviewedFinding || {
      state: suitability.needForAction,
      source: decision.actionEvidence?.id || "CASE_DECISION",
      basis: decision.decisionBasis || null,
    };
    const targetProblem = input.targetProblem || suitability.subject || "UNRESOLVED_MANAGEMENT_QUESTION";
    const evidenceTrace = {
      observations: input.observations || [],
      identification: suitability.explainability.identification,
      currentActivity: suitability.explainability.currentActivity,
      progression: suitability.explainability.progression,
      burden: suitability.explainability.burden,
      actionEvidence: suitability.explainability.actionEvidence,
      needForAction: suitability.needForAction,
    };
    const candidate = (optionClass, eligibilityState, source, overrides = {}) => ({
      caseReference,
      reviewedFinding,
      optionClass,
      targetProblem,
      eligibilityState,
      evidenceBasis: overrides.evidenceBasis || source?.supporting || [],
      authorityBasis: overrides.authorityBasis || { required: false, status: "NOT_APPLICABLE" },
      limitations: overrides.limitations || source?.limitations || [],
      unresolvedEvidenceGaps: overrides.unresolvedEvidenceGaps || source?.missing || [],
      humanReviewRequired: overrides.humanReviewRequired ?? source?.humanReviewRequired ?? false,
      provenance: ["Case", "Observation", "Evidence", "Reviewed Finding", "Need-for-Action", "Management Suitability", "Management Option Candidate"],
      evaluationContext: { evaluatedAt, model: "governed-management-option-selection/v1", browserLocal: true },
      explainability: { caseEvidence: evidenceTrace, relevance: overrides.relevance || source?.why || null, authority: overrides.authorityBasis || null, unknown: overrides.unresolvedEvidenceGaps || source?.missing || [], nextGovernedStep: overrides.nextGovernedStep || null },
      prescription: null,
      execution: null,
    });
    const stateFor = (source, availableBeforeManagementGate = false) => {
      if (!managementGateOpen && !availableBeforeManagementGate) return source?.state === "MORE_EVIDENCE_REQUIRED" ? "information-required" : "evidence-blocked";
      if (!source) return "evidence-blocked";
      if (source.state === "SUPPORTED_FOR_REVIEW") return source.humanReviewRequired ? "human-review-required" : "eligible";
      if (source.state === "MORE_EVIDENCE_REQUIRED") return "information-required";
      if (source.state === "BLOCKED_BY_AUTHORITY") return "authority-blocked";
      if (source.state === "HUMAN_REVIEW_REQUIRED") return "human-review-required";
      return "not-currently-justified";
    };
    const monitoring = sourceByClass.get("MONITORING");
    const cultural = sourceByClass.get("CULTURAL_MANAGEMENT");
    const mechanical = sourceByClass.get("MECHANICAL_MANAGEMENT");
    const biological = sourceByClass.get("BIOLOGICAL_MANAGEMENT");
    const chemical = sourceByClass.get("CHEMICAL_MANAGEMENT_REVIEW");
    const expert = sourceByClass.get("EXPERT_REVIEW");
    const chemicalAuthority = { required: true, status: suitability.regulatoryGate.chemicalGate, cropTargetUseChainComplete: suitability.regulatoryGate.keyB.satisfied === true, boundary: "Registration identity or MoA classification alone does not authorize crop, target, use, product, rate, timing, mixture, method, drone use, re-treatment, or MoA switching." };
    const expertState = managementGateOpen && expert?.state === "NOT_APPLICABLE" ? "eligible" : stateFor(expert, true);
    const options = [
      candidate("CONTINUE_MONITORING", stateFor(monitoring, true), monitoring, { nextGovernedStep: monitoring?.state === "MORE_EVIDENCE_REQUIRED" ? "FIELD_ACTION_HANDOFF" : "HUMAN_SELECTION_OR_CASE_REVIEW" }),
      candidate("CULTURAL_MANAGEMENT", stateFor(cultural), cultural, { nextGovernedStep: "HUMAN_SELECTION_OR_CASE_REVIEW" }),
      candidate("MECHANICAL_MANAGEMENT", stateFor(mechanical), mechanical, { nextGovernedStep: "HUMAN_SELECTION_OR_CASE_REVIEW" }),
      candidate("BIOLOGICAL_MANAGEMENT", stateFor(biological), biological, { nextGovernedStep: "HUMAN_SELECTION_OR_CASE_REVIEW" }),
      candidate("CHEMICAL_REVIEW", managementGateOpen ? stateFor(chemical) : "evidence-blocked", chemical, { authorityBasis: chemicalAuthority, humanReviewRequired: managementGateOpen, nextGovernedStep: managementGateOpen && chemicalAuthority.cropTargetUseChainComplete ? "HUMAN_CHEMICAL_DECISION_REVIEW" : "RESOLVE_AUTHORITY_OR_HUMAN_REVIEW", limitations: [...(chemical?.limitations || []), "Chemical Review is not a pesticide prescription or application instruction."] }),
      candidate("EXPERT_REVIEW", expertState, expert, { humanReviewRequired: ["eligible", "human-review-required"].includes(expertState), nextGovernedStep: "HUMAN_REVIEW" }),
      candidate("NO_ACTION_CURRENTLY_JUSTIFIED", managementGateOpen ? "eligible" : suitability.needForAction === "CONTINUE_MONITORING" ? "eligible" : suitability.needForAction === "MORE_EVIDENCE_REQUIRED" ? "information-required" : "not-currently-justified", null, { evidenceBasis: [{ item: decision.decisionBasis, role: ROLES.SUPPORTING }], limitations: ["Eligibility preserves a bounded no-intervention choice; it is not a permanent determination."], nextGovernedStep: suitability.needForAction === "MORE_EVIDENCE_REQUIRED" ? "FIELD_ACTION_HANDOFF" : "HUMAN_SELECTION_OR_CASE_REVIEW" }),
    ];
    return {
      model: "governed-management-option-selection/v1",
      caseReference,
      reviewedFinding,
      managementGate: managementGateOpen ? "OPEN" : "CLOSED",
      optionClasses: governedManagementOptionClasses,
      eligibilityStates: managementOptionEligibilityStates,
      options,
      ordering: { rule: "GOVERNED_CLASS_ORDER", order: governedManagementOptionClasses, ranking: false, commercialPreferenceUsed: false },
      fieldActionInteraction: { architecture: "field-action-handoff/v1", createsAction: false, nextEvidence: suitability.nextBestDecisionQuestion, rule: "Use the existing single highest-value Field Action only when additional Case evidence is required." },
      humanReview: { approvalInferred: false, required: options.some((item) => item.humanReviewRequired) },
      chemicalBoundary: { prescriptionCreated: false, productSelected: false, activeIngredientSelected: false, rateCreated: false, applicationInstructionCreated: false },
      execute: { taskCreated: false, planCreated: false, applicationCreated: false },
      learn: { automaticLearning: false, canonicalPromotion: false, boundary: "Case outcome is Case evidence and does not alter canonical knowledge." },
      privacy: { persistence: "BROWSER_LOCAL_ONLY", transmission: "NOT_PERFORMED", analytics: false, tracking: false, persistentGps: false },
    };
  }

  const fieldActionTypes = Object.freeze(["OBSERVE", "COUNT", "INSPECT", "COMPARE", "PHOTOGRAPH", "RECORD", "RE_INSPECT", "MEASURE", "VERIFY_APPLICATION_CONTEXT", "PREPARE_EXPERT_HANDOFF", "REPEAT_OBSERVATION", "OTHER_GOVERNED_FIELD_ACTION"]);
  const fieldActionStates = Object.freeze(["READY_FOR_FIELD_ACTION", "MORE_INFORMATION_REQUIRED", "HUMAN_REVIEW_REQUIRED", "BLOCKED_BY_AUTHORITY", "IN_PROGRESS", "COMPLETED_BY_USER", "CANCELLED_BY_USER"]);
  function createFieldAction(input = {}) {
    const suitability = input.managementSuitability || evaluateManagementSuitability(input);
    const next = suitability.nextBestDecisionQuestion || {};
    const subject = input.subject || suitability.subject;
    const missions = {
      INSECTS_PER_PLANT: { type: "COUNT", purpose: "Obtain the governed burden measurement required by the Need-for-Action gate.", instructions: "Inspect rice plants and record the number of brown planthoppers per plant using the supported observation unit.", target: "brown planthoppers per plant", plantPart: "plant_base", unit: "insects_per_plant", limitation: "The source does not provide a complete sampling protocol; insects per sampling point cannot be converted to insects per plant." },
      LEAFFOLDER_STAGE_INCIDENCE: { type: "MEASURE", purpose: "Obtain crop stage and affected-leaf incidence for the Thai Action Evidence gate.", instructions: "Record the crop stage and affected-leaf incidence without inventing the sampling denominator.", target: "crop stage and affected-leaf incidence", plantPart: "leaf", unit: "percent_affected_leaves", limitation: "Sampling denominator semantics remain unresolved and may require Human Review." },
      RE_INSPECTION_MISSION: { type: "INSPECT", purpose: "Resolve the highest-value identification or current-activity gap.", instructions: next.question, target: "distinguishing field evidence", plantPart: input.plantPart || null, unit: null, limitation: "Field inspection supports reevaluation but does not confirm diagnosis." },
      APPLICATION_PATTERN_INSPECTION: { type: "VERIFY_APPLICATION_CONTEXT", purpose: "Distinguish an application-pass pattern from a field-wide or unrelated pattern.", instructions: next.question, target: "application and field distribution pattern", plantPart: null, unit: null, limitation: "Application pattern and drone settings do not confirm deposition or application failure." },
      CURRENT_ACTIVITY: { type: "INSPECT", purpose: "Determine whether current activity or only historical damage is present.", instructions: subject === "leaffolder" ? "Open a folded leaf and record whether a live larva or fresh feeding evidence is present." : "Inspect the affected plant part and record direct current-activity evidence.", target: "current activity", plantPart: subject === "leaffolder" ? "folded_leaf_interior" : input.plantPart || null, unit: null, limitation: "Old visible damage does not establish current activity." },
      REPEAT_OBSERVATION: { type: "REPEAT_OBSERVATION", purpose: "Create a human-confirmed T2 observation for explicit comparison with T1.", instructions: "Repeat the same bounded observation and explicitly record what changed since T1.", target: "T2 observation", plantPart: input.plantPart || null, unit: null, limitation: "Two photos or times do not automatically establish progression." },
      HUMAN_REVIEW: { type: "PREPARE_EXPERT_HANDOFF", purpose: "Prepare the unresolved scientific or authority question for qualified Human Review.", instructions: "Prepare the governed Case evidence and the specific unresolved question; do not transmit it externally.", target: "specific Human Review question", plantPart: null, unit: null, limitation: "Human Review cannot waive missing evidence or authority." },
    };
    let mission = missions[next.key] || missions.RE_INSPECTION_MISSION;
    if (subject === "leaffolder" && input.activityState === "HISTORICAL_DAMAGE_SUPPORTED") mission = missions.CURRENT_ACTIVITY;
    if (subject === "stem-borer-group") mission = { type: "INSPECT", purpose: "Distinguish deadheart/whitehead context using stage and stem-interior evidence.", instructions: "Record crop stage, inspect the affected tiller and stem interior, and report larval or boring evidence.", target: "crop stage and stem-interior evidence", plantPart: "stem_interior", unit: null, limitation: "Deadheart or whitehead alone does not establish a species." };
    if (["blast", "brown-spot"].includes(subject) && !["HUMAN_REVIEW", "REPEAT_OBSERVATION"].includes(next.key)) mission = { type: "COMPARE", purpose: "Record lesion morphology and explicit new-versus-old symptom evidence.", instructions: "Compare affected and apparently healthy tissue, lesion shape and center, and record whether new lesions or organs are affected.", target: "lesion morphology and progression evidence", plantPart: "leaf_or_affected_organ", unit: null, limitation: "Website observations cannot confirm a pathogen." };
    if (["rice-field-broadleaf", "sedge-group"].includes(subject)) mission = { type: "PHOTOGRAPH", purpose: "Resolve weed group identity and distribution from human-confirmed morphology.", instructions: "Record the whole plant, stem shape or cross-section, nodes, leaves, inflorescence, and field distribution.", target: "weed morphology and distribution", plantPart: "whole_weed_and_organs", unit: null, limitation: "Photo receipt does not analyze identity and weed presence does not imply herbicide execution." };
    if (input.causeFamily === "ABIOTIC") mission = { type: "COMPARE", purpose: "Collect distinguishing abiotic evidence without prescribing corrective inputs.", instructions: "Compare older and younger leaves, affected and apparently healthy plants, roots, field water, or treated and untreated areas as applicable.", target: "abiotic distinguishing evidence", plantPart: input.plantPart || "plant_and_root", unit: null, limitation: "Observation does not prescribe fertilizer, water adjustment, recovery product, or biostimulant." };
    if (input.failedControlContext && !input.applicationQualityObservation) mission = { type: "RECORD", purpose: "Resolve the highest-value failed-control context before any re-treatment review.", instructions: "Record the exact previous application date, product wording, reported rate and unit, water volume, and method, one requested field at a time.", target: "failed-control application context", plantPart: null, unit: null, limitation: "Control failure does not establish resistance or justify re-treatment." };
    const state = mission.type === "PREPARE_EXPERT_HANDOFF" ? "HUMAN_REVIEW_REQUIRED" : suitability.needForAction === "MANAGEMENT_REVIEW_JUSTIFIED" && mission.type === "RE_INSPECT" ? "BLOCKED_BY_AUTHORITY" : "READY_FOR_FIELD_ACTION";
    return { model: "field-action-handoff/v1", action_id: input.actionId || `FA-${input.caseReference || "CASE"}-${next.key || mission.type}`, case_reference: input.caseReference || null, created_at: input.createdAt || null, source_decision: { needForAction: suitability.needForAction, optionStates: suitability.options.map((item) => ({ optionClass: item.optionClass, state: item.state })), nextEvidence: next }, action_type: mission.type, purpose: mission.purpose, instructions: mission.instructions, target_observation: mission.target, location_context: input.locationContext || null, gpsRequired: false, gpsPersisted: false, plant_part: mission.plantPart, sampling_context: input.samplingContext || { status: "NOT_SPECIFIED_BY_SOURCE" }, photo_mission: { allowed: true, scales: ["FIELD", "PLANT", "ORGAN", "DAMAGE", "VISIBLE_OBJECT", "COMPARISON", "APPLICATION_CONTEXT"], humanConfirmationRequired: true, automaticAnalysis: false, boundary: "Photo received ≠ Photo analyzed" }, measurement_required: Boolean(mission.unit), measurement_unit: mission.unit, completion_state: state, completed_at: null, result: null, limitations: [mission.limitation, "Execution readiness ≠ automatic execution", "Completed action ≠ confirmed diagnosis"], provenance: ["Case Observation", "Evidence Gap", "Decision State", "Management Option", "Next Best Decision Evidence", "Field Action"], interactionModes: ["TAKE_PHOTO", "CHOOSE_IMAGE", "STRUCTURED_ANSWER", "NUMERIC_MEASUREMENT", "UNSURE", "SKIP_WHEN_VALID"], chemicalExecution: null, droneParameters: null };
  }
  function applyFieldActionResult(action, response = {}) {
    const explicitCompletion = response.completedByUser === true && Object.prototype.hasOwnProperty.call(response, "result");
    if (response.cancelledByUser === true) return { action: { ...action, completion_state: "CANCELLED_BY_USER", completed_at: response.completedAt || null }, observation: null, reevaluation: null, nextPath: "SELECT_ALTERNATE_EVIDENCE_OR_HUMAN_REVIEW" };
    if (response.unable === true || response.unsure === true || response.skip === true) return { action: { ...action, completion_state: "MORE_INFORMATION_REQUIRED" }, observation: null, reevaluation: null, nextPath: "SELECT_ALTERNATE_EVIDENCE_OR_HUMAN_REVIEW" };
    if (!explicitCompletion) return { action: { ...action, completion_state: "IN_PROGRESS" }, observation: null, reevaluation: null, nextPath: "AWAIT_EXPLICIT_USER_COMPLETION" };
    const observation = { observationId: response.observationId || `${action.action_id}-OBS`, sourceActionId: action.action_id, source: "USER", observationTime: response.observationTime || response.completedAt || null, subject: response.subject || action.target_observation, value: response.result, unit: response.unit || action.measurement_unit || null, denominator: response.denominator || null, samplingLimitation: action.sampling_context?.status === "NOT_SPECIFIED_BY_SOURCE" ? action.limitations[0] : null, supersedesObservationId: response.supersedesObservationId || null };
    const caseInput = { ...(response.caseInput || {}) };
    if (action.measurement_unit === "insects_per_plant" && Number.isFinite(response.result)) caseInput.measurements = { insectsPerPlant: response.result, unit: response.unit || "insects_per_plant" };
    if (action.measurement_unit === "percent_affected_leaves" && Number.isFinite(response.result)) caseInput.measurements = { percentAffectedLeaves: response.result };
    const decision = evaluateNeedForAction(caseInput);
    const suitability = evaluateManagementSuitability({ ...caseInput, needForActionDecision: decision });
    return { action: { ...action, completion_state: "COMPLETED_BY_USER", completed_at: response.completedAt || null, result: response.result }, observation, reevaluation: { candidateGateRerunRequired: true, identificationState: decision.identificationState, activityState: decision.activityState, progressionState: decision.progressionState, needForAction: decision, managementSuitability: suitability }, nextFieldAction: createFieldAction({ ...caseInput, managementSuitability: suitability }), historyEntry: { requested: action.created_at, performed: response.completedAt || null, result: response.result, effectOnCaseState: decision.needForAction }, boundary: "Human completion records an observation; it does not bypass existing gates" };
  }
  function prepareExpertHandoff(input = {}) {
    const action = createFieldAction({ ...input, managementSuitability: { ...(input.managementSuitability || evaluateManagementSuitability(input)), nextBestDecisionQuestion: { key: "HUMAN_REVIEW", question: input.expertQuestion || "What exact unresolved evidence requires Human Review?" } } });
    return { ...action, action_type: "PREPARE_EXPERT_HANDOFF", completion_state: "HUMAN_REVIEW_REQUIRED", expertQuestion: input.expertQuestion || "What exact unresolved evidence requires Human Review?", package: { caseDescription: input.caseDescription || null, crop: input.crop || "rice", stage: input.cropStage || null, fieldContext: input.fieldContext || null, observations: input.observations || [], photos: input.photos || [], candidates: input.candidates || [], supportingEvidence: input.supportingEvidence || [], contradictions: input.contradictions || [], missingEvidence: input.missingEvidence || [], currentActivity: input.activityState || null, progression: input.progressionState || null, burden: input.burdenEvidence || {}, weather: input.weatherContext || null, nearbyContext: input.nearbyCase || null, interventionHistory: input.interventionHistory || null, failedControlContext: input.failedControlContext || null, applicationContext: input.applicationContext || null, needForAction: input.needForActionDecision || null, managementOptions: input.managementSuitability?.options || [], regulatoryState: input.regulatoryState || null, knowledgeGaps: input.knowledgeGaps || {} }, transmission: "NOT_PERFORMED", persistence: "BROWSER_LOCAL_ONLY" };
  }

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
    const authority = window.SPDecisionAuthority;
    const registration = authority?.registration;
    const regulatoryReview = actionDecision.subject ? authority?.priorityRegulatoryReview?.[actionDecision.subject] : null;
    const regulatoryStatus = regulatoryReview ? authority.evaluateRegulatoryChain(regulatoryReview) : registration?.status ?? "NO_REGULATORY_EVIDENCE";
    const chemicalGate = actionDecision.status === "MANAGEMENT_REVIEW_JUSTIFIED" && regulatoryStatus === "ELIGIBLE_FOR_DECISION_REVIEW" ? "CHEMICAL_OPTIONS_READY_FOR_DECISION_REVIEW" : "CHEMICAL_REVIEW_BLOCKED";
    const managementStatus = failedControl ? "HUMAN_REVIEW_REQUIRED" : actionDecision.status === "MANAGEMENT_REVIEW_JUSTIFIED" ? "MANAGEMENT_REVIEW_JUSTIFIED" : actionDecision.status === "MORE_EVIDENCE_REQUIRED" ? "MORE_EVIDENCE_REQUIRED" : "MANAGEMENT_REMAINS_BLOCKED";
    return {
      model: "bounded-case-projection/v1", evidenceRoles: Object.values(ROLES), candidateGates, severity,
      needForAction: actionDecision,
      management: { status: managementStatus, chemicalGate, chemicalRecommendation: "BLOCKED", eligibleOptions: registration?.eligibleOptions ?? [], registrationStatus: regulatoryStatus, limitation: `${regulatoryStatus} · ${chemicalGate} · ${registration?.limitation ?? "Crop–Target–Use–Registration authority ยังไม่สมบูรณ์; ไม่เลือกสาร ผลิตภัณฑ์ อัตรา หรือโปรแกรมพ่น"}` },
      humanReview: { required: expertRequired, reasons: [failedControl ? "failed-control investigation" : null, candidateGates.some((gate) => gate.domain === "Disease") ? "causal confirmation unavailable in website" : null, candidateGates.some((gate) => gate.alternativesUnresolved) ? "distinguishing evidence or alternatives unresolved" : null].filter(Boolean) },
      nextBestEvidence: nextGap ? { action: "ASK_OBSERVATION", cue: nextGap.cue, label: nextGap.label, candidate: nextGap.candidate, reason: "ข้อมูลนี้เป็น REQUIRED_TO_DISTINGUISH และเปลี่ยนผลของ Identification Gate ได้" } : { action: "EXPERT_REVIEW", reason: "ไม่มี gap ที่ระบบมีคำถามรองรับเพิ่มเติม หรือการยืนยันต้องใช้ผู้เชี่ยวชาญ" },
      boundaries: ["Candidate ≠ Diagnosis", "Severity ≠ Need-for-Action", "Need-for-Action ≠ pesticide recommendation", "Weather alone cannot escalate identification", "Nearby Case cannot escalate identification", "Photo received ≠ Photo analyzed", "CONTROL FAILURE ≠ RESISTANCE"],
    };
  }
  window.SPDecisionGates = Object.freeze({ evaluate, beginFromObservation, evaluateProgression, evaluateAbioticDifferential, evaluateApplicationContext, evaluateFailedControl, evaluateNeedForAction, evaluateManagementSuitability, evaluateManagementOptions, createFieldAction, applyFieldActionResult, prepareExpertHandoff, compareTemporalObservations, profiles, symptomFamilies, observationVocabulary, progressionStates, lifeStageProfiles, abioticProfiles, abioticInvestigationStates, applicationQualityStates, applicationSuitabilityStates, targetLocationProfiles, needForActionStates, managementOptionClasses, managementSuitabilityStates, governedManagementOptionClasses, managementOptionEligibilityStates, fieldActionTypes, fieldActionStates, moaAuthority, roles: ROLES });
})();
