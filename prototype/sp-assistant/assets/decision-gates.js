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
      boundaries: ["OLD DAMAGE ≠ CONTROL FAILURE", "CURRENT ACTIVITY ≠ CHEMICAL ACTION REQUIRED", "APPLICATION BEFORE OUTCOME ≠ CAUSATION", "APPLICATION ISSUE PLAUSIBLE ≠ APPLICATION FAILURE CONFIRMED", "PRODUCT REGISTERED ≠ EFFECTIVE IN THIS CASE", "WEATHER ASSOCIATION ≠ CAUSATION"],
    };
  }

  const needForActionStates = Object.freeze(["MORE_EVIDENCE_REQUIRED", "CONTINUE_MONITORING", "NO_ACTION_DETERMINATION_SUPPORTED", "MANAGEMENT_REVIEW_JUSTIFIED", "NON_CHEMICAL_REVIEW_JUSTIFIED", "HUMAN_REVIEW_REQUIRED", "CHEMICAL_REVIEW_BLOCKED", "CHEMICAL_REVIEW_ELIGIBILITY_UNRESOLVED"]);
  const managementOptionClasses = Object.freeze(["MONITORING", "FIELD_INSPECTION", "CULTURAL_MANAGEMENT", "MECHANICAL_MANAGEMENT", "WATER_MANAGEMENT", "BIOLOGICAL_MANAGEMENT", "CHEMICAL_MANAGEMENT_REVIEW", "EXPERT_REVIEW", "OTHER_GOVERNED_MANAGEMENT"]);

  function evaluateNeedForAction(input = {}) {
    const authority = window.SPDecisionAuthority;
    const subject = input.subject || null;
    const actionEvidence = subject ? authority?.actionEvidence?.[subject] || null : null;
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
  window.SPDecisionGates = Object.freeze({ evaluate, beginFromObservation, evaluateProgression, evaluateAbioticDifferential, evaluateFailedControl, evaluateNeedForAction, compareTemporalObservations, profiles, symptomFamilies, observationVocabulary, progressionStates, lifeStageProfiles, abioticProfiles, abioticInvestigationStates, applicationQualityStates, needForActionStates, managementOptionClasses, moaAuthority, roles: ROLES });
})();
