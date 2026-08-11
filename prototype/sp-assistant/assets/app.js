const $ = (selector) => document.querySelector(selector);
const problem = $("[data-problem]");
const stream = $("[data-conversation-stream]");
const output = $("[data-engine-output]");
const questionList = $("[data-question-list]");
const questionPanel = $("[data-question-panel]");
const tools = $("[data-investigation-tools]");
const imageInput = $("[data-image-input]");
const previews = $("[data-image-previews]");
const imageCount = $("[data-image-count]");
const annotations = $("[data-image-annotations]");
const missionPanel = $("[data-photo-mission]");
const missionStep = $("[data-mission-step]");
const missionProgress = $("[data-mission-progress]");
const caseContextPanel = $("[data-case-context]");
const locationStatus = $("[data-location-status]");

let selectedImages = [];
let caseState = null;

const commonMissionSteps = [
  { key: "field", title: "ภาพรวมพื้นที่", guide: "ถอยจากจุดที่พบอาการประมาณ 3–5 เมตร ถ่ายให้เห็นต้นที่มีอาการและต้นรอบข้างในภาพเดียว", inspect: "ดูรูปแบบการกระจายในแปลง", observations: [["ต้นเดียว/กอเดียว", "distribution_single"], ["หลายกอใกล้กัน", "distribution_nearby"], ["เป็นหย่อม", "field_distribution"], ["กระจายหลายจุด", "field_distribution"], ["ตามแนวแถว", "distribution_row"], ["ขอบแปลง", "distribution_edge"], ["ทั่วบริเวณ", "field_distribution"], ["ไม่แน่ใจ", "uncertain_distribution"]] },
  { key: "whole", title: "ทั้งต้น / ทั้งกอ", guide: "ถ่ายต้นหรือกอที่มีอาการให้เห็นตั้งแต่โคนถึงปลาย และให้เห็นต้นรอบข้าง", inspect: "เทียบตำแหน่งอาการและสภาพทั้งต้น", observations: [["ต้นเหลือง/เหี่ยว", "wilt"], ["ยอดแห้ง", "deadheart"], ["รวงขาว", "whitehead"], ["ยังไม่แน่ใจ", "uncertain_whole"]] },
];

const domainMissionSteps = {
  Disease: [
    { key: "organ", title: "อวัยวะที่มีอาการ", guide: "เลือกใบ กาบใบ โคนต้น ราก คอรวง รวง หรือเมล็ดที่มีอาการชัด วางให้นิ่งและถ่ายให้เต็มภาพ", inspect: "ตรวจเฉพาะอวัยวะที่ผู้ใช้ระบุหรือ candidate รองรับ", observations: [["อาการอยู่ที่ใบ", "organ_leaf"], ["อาการอยู่ที่กาบใบ", "organ_sheath"], ["อาการอยู่ที่ราก", "organ_root"], ["อาการอยู่ที่รวง/เมล็ด", "organ_panicle"], ["ไม่แน่ใจ", "uncertain_organ"]] },
    { key: "detail", title: "รายละเอียดอาการ", guide: "ถ่ายรูปร่างแผล สีตรงกลาง ขอบแผล รอยขีด หรือการเปลี่ยนสีที่มองเห็นได้ ไม่ต้องถ่ายเชื้อขนาดจุลทรรศน์", inspect: "ตรวจลักษณะอาการที่มองเห็นด้วยตา", observations: [["พบจุด/แผล", "spot"], ["พบรอยขีดทางยาว", "streak"], ["กลางแผลสีเทา", "gray_center"], ["ขอบแผลสีน้ำตาล", "brown"], ["ไม่เห็นโครงสร้างเชื้อ", "no_visible_sign"]] },
    { key: "environment", title: "สภาพแวดล้อม", guide: "ถ่ายสภาพน้ำ ความหนาแน่นต้น และบริเวณรอบกอ โดยไม่ต้องระบุตำแหน่ง GPS", inspect: "สังเกตน้ำและความชื้นที่เห็นจริง", observations: [["มีน้ำขัง", "standing_water"], ["พื้นแปลงแห้ง", "dry_field"], ["สภาพชื้น", "rain"], ["ไม่แน่ใจ", "uncertain_environment"]] },
  ],
  Insect: [
    { key: "organ", title: "อวัยวะและรอยทำลาย", guide: "ถ่ายใบ ยอด โคนต้น ลำต้น หรือรวงที่มีรอยทำลายให้เต็มภาพ", inspect: "รอยกิน รู มูล ใบม้วน ยอดแห้ง หรือรวงขาว", observations: [["ใบถูกม้วน/พับ", "folded_leaf"], ["รอยกินสีขาว", "feeding_scar"], ["พบรู/จุดเจาะ", "boring_point"], ["พบมูล", "frass"], ["ยอดแห้ง", "deadheart"], ["รวงขาว", "whitehead"]] },
    { key: "inspection", title: "เปิดและตรวจจุดซ่อน", guide: "เปิดใบที่ม้วนอย่างระมัดระวัง หรือแหวกกอตรวจบริเวณโคนต้นตาม cue ที่พบ", inspect: "ด้านในใบม้วน ใต้ใบ หรือโคนต้นเท่านั้นเมื่อสัมพันธ์กับข้อมูลในเคส", observations: [["พบตัวหนอนด้านใน", "larva"], ["พบแมลงใต้ใบ", "pest_seen"], ["พบแมลงบริเวณโคน", "hopper"], ["ไม่พบแมลง", "no_insect_seen"], ["ไม่แน่ใจ", "uncertain_insect"]] },
    { key: "tiny", title: "ถ่ายตัวแมลงถ้าพบ", guide: "ภาพตัวแมลงชัดเป็นเพียงโบนัส หากเล็กเกินไปให้บันทึกขนาด สี ปีก การเคลื่อนที่ ตำแหน่ง และจำนวนที่เห็นแทน", inspect: "ไม่บังคับระบุชนิด ใช้สิ่งเทียบขนาดในระนาบเดียวกันถ้ามี", observations: [["เล็กมาก", "tiny_insect"], ["มีปีก", "winged"], ["ไม่มีปีก", "wingless"], ["กระโดด", "jumping"], ["คลาน", "crawling"], ["อยู่เป็นกลุ่ม", "clustered"]] },
  ],
  Weed: [
    { key: "organ", title: "วัชพืชทั้งต้น", guide: "ถ่ายวัชพืชทั้งต้นพร้อมโคน ให้เห็นทรงต้นและตำแหน่งเทียบกับข้าว", inspect: "ตรวจใบ ลำต้น ข้อ กาบ และโคนต้น", observations: [["ใบแคบ/เรียว", "narrow_leaf"], ["ใบกว้าง", "broad_leaf"], ["ลำต้นเป็นเหลี่ยม", "triangular_stem"], ["ลำต้นกลม", "round_stem"]] },
    { key: "detail", title: "รายละเอียดสัณฐาน", guide: "ถ่ายใบ ลำต้น ข้อ กาบ โคน และช่อดอกถ้ามี โดยไม่ฝืนระบุชื่อชนิด", inspect: "หน้าตัดลำต้น ข้อปล้อง กาบใบ และช่อดอก", observations: [["เห็นข้อปล้อง", "visible_node"], ["มีกาบหุ้มลำต้น", "visible_sheath"], ["มีช่อดอก", "inflorescence"], ["มีน้ำขัง", "standing_water"], ["ไม่แน่ใจ", "uncertain_weed"]] },
  ],
};

const cueRules = [
  ["organ_leaf", ["ใบ", "leaf"]], ["organ_root", ["ราก", "root"]],
  ["organ_stem", ["ลำต้น", "โคนต้น", "stem"]], ["brown", ["สีน้ำตาล", "น้ำตาล", "brown"]],
  ["spot", ["จุด", "แผล", "spot", "lesion"]], ["streak", ["ขีด", "ทางยาว", "streak"]],
  ["folded_leaf", ["ใบม้วน", "ใบพับ", "ใบห่อ", "folded leaf"]],
  ["larva", ["หนอน", "larva"]], ["hopper", ["เพลี้ย", "hopper"]],
  ["deadheart", ["ยอดแห้ง", "deadheart"]], ["whitehead", ["รวงขาว", "whitehead"]],
  ["wilt", ["เหี่ยว", "wilting"]], ["triangular_stem", ["ลำต้นเป็นเหลี่ยม", "สามเหลี่ยม", "triangular stem"]],
  ["narrow_leaf", ["ใบแคบ", "ใบเรียว", "narrow leaf"]], ["pest_seen", ["พบแมลง", "เห็นแมลง", "ตัวหนอน"]],
  ["chemical_history", ["สาร", "ยา", "พ่น", "ฉีด"]],
  ["failed_control", ["ใช้ยาแล้วไม่อยู่", "พ่นแล้วไม่ตาย", "เอาไม่อยู่", "ไม่ได้ผล"]],
  ["rain", ["ฝน", "ชื้น", "rain"]], ["field_distribution", ["ทั้งแปลง", "เป็นหย่อม", "กระจาย"]],
  ["weed_plant", ["วัชพืช", "weed"]],
];

const candidates = [
  { key: "brown-spot", domain: "Disease", name: "โรคใบจุดสีน้ำตาล", link: "../knowledge-explorer/rice-disease-corpus.html", cues: ["organ_leaf", "brown", "spot"], distinctions: ["รูปร่างแผล", "สีบริเวณกลางแผล", "อาการที่เมล็ด"], source: "Rice Disease corpus · governed biological sources" },
  { key: "blast", domain: "Disease", name: "โรคไหม้", link: "../knowledge-explorer/rice-disease-corpus.html", cues: ["organ_leaf", "spot"], distinctions: ["แผลรูปตา/กระสวย", "กลางแผลสีเทา", "ความชื้นและระยะข้าว"], source: "Rice Disease corpus · governed biological sources" },
  { key: "leaffolder", domain: "Insect", name: "หนอนห่อใบข้าว", link: "../knowledge-explorer/rice-insect-corpus.html", cues: ["folded_leaf", "larva", "organ_leaf"], distinctions: ["พบหนอนภายในใบ", "รอยกินเป็นแถบสีขาว"], source: "Rice Insect corpus · Rice Department source" },
  { key: "brown-planthopper", domain: "Insect", name: "เพลี้ยกระโดดสีน้ำตาล", link: "../knowledge-explorer/rice-insect-corpus.html", cues: ["hopper", "wilt", "organ_stem"], distinctions: ["ตัวแมลงบริเวณโคนต้น", "การกระจายเป็นหย่อม", "อาการไหม้เป็นบริเวณ"], source: "Rice Insect corpus · Rice Department source" },
  { key: "sedge-group", domain: "Weed", name: "กลุ่มกกที่ควรตรวจต่อ", link: "../knowledge-explorer/rice-weed-corpus.html", cues: ["weed_plant", "triangular_stem", "narrow_leaf"], distinctions: ["หน้าตัดลำต้น", "ข้อปล้อง", "ช่อดอก", "สภาพน้ำ"], source: "Rice Weed corpus · governed DOA source" },
];

const questionBank = {
  organ_leaf: "อาการหลักอยู่ที่ใบหรือไม่?", organ_root: "พบอาการที่รากหรือไม่?",
  lesion_shape: "แผลมีรูปร่างอย่างไร และตรงกลางมีสีอะไร?", field_distribution: "อาการกระจายทั้งแปลงหรือเป็นหย่อม?",
  rice_age: "ข้าวอายุเท่าใดหรืออยู่ระยะใด?", rain: "ช่วงก่อนพบอาการมีฝนหรือความชื้นสูงหรือไม่?",
  pest_seen: "พบตัวแมลง หนอน ไข่ หรือร่องรอยการกินหรือไม่?", water: "ระดับน้ำและการระบายน้ำในแปลงเป็นอย่างไร?",
  chemical_history: "เคยใช้สารออกฤทธิ์อะไร สูตร/ความเข้มข้น และเมื่อใด?", spray: "ใช้อัตราตามฉลาก การคลุมพื้นที่ และสภาพอากาศขณะพ่นอย่างไร?",
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const detected = (text, words) => words.some((word) => text.includes(word));

function extractObservations(text) {
  const normalized = text.toLowerCase();
  const observations = cueRules.filter(([, words]) => detected(normalized, words)).map(([key]) => key);
  const age = normalized.match(/(?:ข้าว\s*)?(\d{1,3})\s*วัน/);
  if (age) observations.push("rice_age");
  document.querySelectorAll("[data-image-annotations] input:checked").forEach((input) => observations.push(input.value));
  (caseState?.guidedObservations ?? []).forEach((item) => observations.push(item.value));
  return { observations: [...new Set(observations)], age: age?.[1] ?? $("[data-rice-age]")?.value.trim() ?? "" };
}

function evaluateCandidates(observations) {
  return candidates.map((candidate) => {
    const matches = candidate.cues.filter((cue) => observations.includes(cue));
    const contradictions = [];
    if (observations.includes("organ_root") && candidate.cues.includes("organ_leaf")) contradictions.push("ผู้ใช้ระบุอาการที่ราก แต่ Knowledge นี้อธิบายลักษณะหลักที่ใบ");
    if (observations.includes("organ_leaf") && candidate.domain === "Weed") contradictions.push("ข้อมูลปัจจุบันกล่าวถึงอาการบนใบข้าว ไม่ใช่ลักษณะต้นวัชพืช");
    return { ...candidate, matches, contradictions, missing: candidate.distinctions.filter((item) => !caseState.answers.some((answer) => answer.includes(item))) };
  }).filter((candidate) => candidate.matches.length > 0).sort((a, b) => b.matches.length - a.matches.length).slice(0, 3);
}

function selectQuestions(observations, activeCandidates) {
  const keys = [];
  if (!observations.includes("rice_age")) keys.push("rice_age");
  if (observations.includes("spot")) keys.push("lesion_shape");
  if (!observations.includes("field_distribution")) keys.push("field_distribution");
  if (activeCandidates.some((item) => item.domain === "Disease") && !observations.includes("rain")) keys.push("rain");
  if (activeCandidates.some((item) => item.domain === "Insect") && !observations.includes("pest_seen")) keys.push("pest_seen");
  if (activeCandidates.some((item) => item.domain === "Weed")) keys.push("water");
  if (observations.includes("failed_control")) keys.push("chemical_history", "spray");
  return [...new Set(keys)].slice(0, 5).map((key) => ({ key, text: questionBank[key] }));
}

function renderCandidate(candidate) {
  const support = candidate.matches.length ? candidate.matches.map((cue) => `<li>${escapeHtml(cue.replaceAll("_", " "))}</li>`).join("") : "<li>ยังไม่มี cue ที่รองรับ</li>";
  const missing = candidate.missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const contradictions = candidate.contradictions.length ? candidate.contradictions.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>ยังไม่พบข้อขัดแย้งที่ระบุได้</li>";
  return `<article class="candidate-card"><p class="eyebrow">${candidate.domain} Knowledge</p><h3>${candidate.name}</h3><h4>สนับสนุนจากข้อมูลที่มี</h4><ul>${support}</ul><h4>ข้อมูลที่ยังขาด</h4><ul>${missing}</ul><h4>ข้อมูลที่อาจไม่สอดคล้อง</h4><ul>${contradictions}</ul><p class="source-summary"><strong>แหล่งองค์ความรู้:</strong> ${candidate.source}</p><a href="${candidate.link}">เปิด Knowledge Explorer →</a></article>`;
}

function render() {
  const { observations, age } = extractObservations(caseState.userText + " " + caseState.answers.join(" "));
  caseState.observations = observations;
  caseState.riceAge = age;
  caseState.candidates = evaluateCandidates(observations);
  caseState.questions = selectQuestions(observations, caseState.candidates);
  const freeText = caseState.userText;
  const stateLabel = caseState.candidates.length ? (caseState.candidates.some((item) => item.contradictions.length) ? "พบข้อมูลที่ขัดแย้ง" : "มีองค์ความรู้ที่เกี่ยวข้องหลายหัวข้อ") : "ข้อมูลยังไม่พอ";
  const failed = observations.includes("failed_control");
  output.innerHTML = `<article class="message assistant-message"><span class="avatar">SP</span><div class="investigation-response"><div class="response-heading"><div><p class="eyebrow">จากเงื่อนไขที่ตรวจพบ</p><h2>${stateLabel}</h2></div><span class="status-pill">ยังไม่ยืนยันสาเหตุ</span></div><div class="investigation-grid"><section><h3>Observation ที่รู้จัก</h3><p>${observations.length ? observations.map((item) => escapeHtml(item.replaceAll("_", " "))).join(" · ") : "ยังไม่พบ cue ที่กำหนดไว้"}</p></section><section><h3>ข้อความผู้ใช้</h3><p>${escapeHtml(freeText)}</p></section><section class="missing"><h3>Missing Information</h3><p>${caseState.questions.length ? caseState.questions.map((item) => item.text).join(" · ") : "ยังต้องตรวจหลักฐานภาคสนามและทบทวนโดยมนุษย์"}</p></section><section><h3>Case outcome</h3><p>${stateLabel} · ต้องตรวจเพิ่ม · ไม่มี Diagnosis</p></section></div>${failed ? `<div class="failed-control"><strong>CONTROL FAILURE ≠ RESISTANCE</strong><p>ตรวจ identification · stage/timing · application · environment · reinfestation · registration/use-pattern · MoA history ก่อนตั้งสมมติฐาน resistance</p></div>` : ""}<h2 class="candidate-heading">หัวข้อที่ควรตรวจต่อ</h2><p class="ordering-note">เรียงตามจำนวน cue ที่กฎตรวจพบเพื่อการทำงานเท่านั้น ไม่ใช่ความน่าจะเป็นหรือความเชื่อมั่น</p><div class="candidate-list">${caseState.candidates.length ? caseState.candidates.map(renderCandidate).join("") : `<p>ไม่พบ Knowledge ที่รองรับเพียงพอ ข้อความเดิมยังคงแสดงโดยไม่ตีความเพิ่ม</p>`}</div><p class="boundary-copy">Candidate Knowledge ไม่ใช่ Diagnosis · Supporting evidence ไม่พิสูจน์สาเหตุ · Missing/contradicting evidence ต้องตรวจต่อ</p></div></article>`;
  questionList.innerHTML = caseState.questions.map((question, index) => `<label><span>${escapeHtml(question.text)}</span><input name="answer-${index}" data-question-key="${question.key}" placeholder="ตอบเท่าที่ทราบ"></label>`).join("");
  questionPanel.hidden = caseState.questions.length === 0;
  tools.hidden = false;
  $("[data-related-summary]").innerHTML = `<p><strong>${stateLabel}</strong></p><p>${caseState.candidates.map((item) => item.name).join(" · ") || "ยังไม่มี candidate"}</p>`;
  $("[data-case-label]").textContent = `CASE-${caseState.id}`;
}

function startCase() {
  const text = problem.value.trim();
  if (!text) return problem.focus();
  caseState = { id: String(Date.now()).slice(-6), createdAt: new Date().toISOString(), userText: text, answers: [], observations: [], candidates: [], questions: [], managementViewed: false, guidedObservations: [], photoMission: null, field: { identity: "", locality: "", district: "", province: "", areaNotes: "" }, location: { status: "empty", latitude: null, longitude: null, accuracy: null, capturedAt: null, source: null }, observationTime: { value: null, source: null }, firstNoticed: { category: "unknown", date: null }, cropContext: { crop: "rice", variety: "", age: "", growthStage: "", waterCondition: "", notes: "" } };
  $("[data-user-message]").textContent = text;
  $("[data-empty-intro]").hidden = true;
  stream.hidden = false;
  render();
  stream.scrollIntoView({ behavior: "smooth", block: "start" });
}

$("[data-submit]")?.addEventListener("click", startCase);
problem?.addEventListener("keydown", (event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") startCase(); });
$("[data-question-form]")?.addEventListener("submit", (event) => { event.preventDefault(); if (!caseState) return; const entries = [...event.currentTarget.querySelectorAll("input")].filter((input) => input.value.trim()).map((input) => `${input.dataset.questionKey}: ${input.value.trim()}`); caseState.answers.push(...entries); render(); });
$("[data-skip]")?.addEventListener("click", () => { if (caseState) { caseState.questions = []; questionPanel.hidden = true; } });
document.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => { problem.value = button.dataset.example; problem.focus(); }));
$("[data-field-toggle]")?.addEventListener("click", (event) => { const panel = $("[data-field-panel]"); panel.hidden = !panel.hidden; event.currentTarget.setAttribute("aria-expanded", String(!panel.hidden)); });

const fieldValue = (selector) => $(selector)?.value.trim() ?? "";

function renderCaseContext() {
  if (!caseState) return;
  const { field, location, observationTime, firstNoticed, cropContext } = caseState;
  const place = [field.locality, field.district, field.province].filter(Boolean).join(" · ") || "ยังไม่ได้ระบุ";
  const accuracy = location.accuracy == null ? "ไม่ระบุ" : `± ${Math.round(location.accuracy)} เมตร (ตามที่อุปกรณ์รายงาน)`;
  const observed = observationTime.value ? new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(observationTime.value)) : "ยังไม่ได้ระบุ";
  $("[data-case-data-preview]").innerHTML = `<h3>ข้อมูลเคส</h3><dl><dt>แปลง · User-provided</dt><dd>${escapeHtml(field.identity || "ไม่ระบุ")}</dd><dt>พื้นที่ · User-provided</dt><dd>${escapeHtml(place)}</dd><dt>พิกัด · Device-provided</dt><dd>${location.status === "captured" ? "บันทึกแล้ว" : "ยังไม่ได้บันทึก"}</dd><dt>ความแม่นยำ · Device-provided</dt><dd>${accuracy}</dd><dt>ตรวจแปลง · User-provided</dt><dd>${escapeHtml(observed)}</dd><dt>เริ่มเห็นอาการ</dt><dd>${escapeHtml(firstNoticed.date || firstNoticed.category)}</dd><dt>ข้าว</dt><dd>${escapeHtml(cropContext.variety || "ไม่ระบุ")} · ${escapeHtml(cropContext.age || "ไม่ระบุอายุ")}</dd><dt>Case created · System-derived</dt><dd>${escapeHtml(caseState.createdAt)}</dd></dl>`;
  const details = $("[data-coordinate-details]");
  details.hidden = location.status !== "captured";
  if (!details.hidden) $("[data-coordinate-values]").textContent = `latitude ${location.latitude} · longitude ${location.longitude} · ${accuracy} · captured_at ${location.capturedAt}`;
}

function saveCaseContext() {
  if (!caseState) return;
  caseState.field = { identity: fieldValue("[data-field-id]"), locality: fieldValue("[data-locality]"), district: fieldValue("[data-district]"), province: fieldValue("[data-province]"), areaNotes: fieldValue("[data-area-notes]") };
  caseState.observationTime = { value: fieldValue("[data-observation-time]") || null, source: fieldValue("[data-observation-time]") ? "user_provided" : null };
  caseState.firstNoticed = { category: $("[data-first-noticed]").value, date: fieldValue("[data-first-noticed-date]") || null };
  caseState.cropContext = { crop: "rice", variety: fieldValue("[data-context-variety]") || fieldValue("[data-variety]"), age: fieldValue("[data-context-age]") || fieldValue("[data-rice-age]"), growthStage: fieldValue("[data-growth-stage]"), waterCondition: fieldValue("[data-water-condition]"), notes: fieldValue("[data-field-notes]") };
  renderCaseContext();
}

function requestCurrentLocation() {
  if (!caseState) return;
  if (!("geolocation" in navigator)) { caseState.location.status = "unsupported"; locationStatus.textContent = "อุปกรณ์ไม่รองรับ — ระบุพื้นที่เองได้"; return; }
  caseState.location.status = "requesting";
  locationStatus.textContent = "กำลังขอตำแหน่ง";
  navigator.geolocation.getCurrentPosition((position) => {
    caseState.location = { status: "captured", latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, capturedAt: new Date(position.timestamp || Date.now()).toISOString(), source: "device_provided" };
    locationStatus.textContent = `ได้รับตำแหน่งแล้ว · ตำแหน่งจากอุปกรณ์ ± ${Math.round(position.coords.accuracy)} เมตร`;
    renderCaseContext();
  }, (error) => {
    caseState.location = { status: error.code === 1 ? "denied" : "unavailable", latitude: null, longitude: null, accuracy: null, capturedAt: null, source: null };
    locationStatus.textContent = error.code === 1 ? "ผู้ใช้ไม่อนุญาต — เคสยังใช้งานได้" : "ไม่สามารถอ่านตำแหน่งได้ — ระบุพื้นที่เองได้";
    renderCaseContext();
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 });
}

$("[data-case-context-toggle]")?.addEventListener("click", () => { if (!caseState) return; caseContextPanel.hidden = !caseContextPanel.hidden; if (!caseContextPanel.hidden) renderCaseContext(); });
$("[data-location-request]")?.addEventListener("click", requestCurrentLocation);
$("[data-use-current-time]")?.addEventListener("click", () => { const now = new Date(); const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16); $("[data-observation-time]").value = local; });
$("[data-case-context-form]")?.addEventListener("submit", (event) => { event.preventDefault(); saveCaseContext(); });

function missionDomain() {
  return caseState.candidates[0]?.domain ?? "Generic";
}

function createPhotoMission() {
  if (!caseState) return;
  const domain = missionDomain();
  const generic = [{ key: "organ", title: "อวัยวะที่มีอาการ", guide: "ถ่ายอวัยวะที่มีอาการให้เต็มภาพ และเก็บภาพจากมากกว่าหนึ่งมุมเมื่อจำเป็น", inspect: "ยังไม่มีข้อมูลที่ผ่าน Governance เพียงพอสำหรับระบุตำแหน่งตรวจเฉพาะ", observations: [["อาการอยู่ที่ใบ", "organ_leaf"], ["อาการอยู่ที่ลำต้น", "organ_stem"], ["อาการอยู่ที่ราก", "organ_root"], ["ไม่แน่ใจ", "uncertain_organ"]] }];
  caseState.photoMission = { requested: true, domain, current: 0, caseContext: { locationCaptured: caseState.location.status === "captured", locationCapturedAt: caseState.location.capturedAt, observationTime: caseState.observationTime.value }, steps: [...commonMissionSteps, ...(domainMissionSteps[domain] ?? generic)].slice(0, 6).map((step) => ({ ...step, status: "pending", imageIndexes: [] })) };
  missionPanel.hidden = false;
  renderMission();
  missionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderMission() {
  const mission = caseState?.photoMission;
  if (!mission) return;
  const done = mission.steps.filter((step) => step.status !== "pending").length;
  missionProgress.textContent = `ตรวจแล้ว ${done} / ${mission.steps.length} จุด`;
  const step = mission.steps[mission.current];
  const observations = step.observations.map(([label, value]) => `<label><input type="checkbox" data-mission-observation value="${value}"> ${label}</label>`).join("");
  missionStep.innerHTML = `<article class="mission-card"><p class="mission-count">จุดที่ ${mission.current + 1} จาก ${mission.steps.length} · ${mission.domain}</p><h3>${step.title}</h3><p><strong>ถ่ายอย่างไร</strong><br>${step.guide}</p><p><strong>ตรวจตรงไหน</strong><br>${step.inspect}</p><details><summary>เคล็ดลับถ่ายด้วยมือถือ</summary><p>ใช้กล้องหลัง · เช็ดเลนส์ · ใช้แสงพอ · แตะจอให้ชัด · อย่าซูมดิจิทัลมาก · ถือให้นิ่ง</p><p>ถ้ามีไม้บรรทัดหรือการ์ดเทียบขนาด ให้วางในระนาบเดียวกัน ไม่ต้องใช้ถ้าไม่มี และระบบจะไม่ประมาณขนาดจากภาพ</p></details><div class="mission-photo-status">${step.imageIndexes.length ? `มีภาพชั่วคราว ${step.imageIndexes.length} ภาพ — ภาพนี้ยังไม่ยืนยัน Observation` : "ยังไม่มีภาพ — ข้ามได้โดยไม่ปิดเคส"}</div><fieldset class="mission-observations"><legend>จากที่คุณเห็นจริง พบอะไรบ้าง?</legend>${observations}</fieldset><div class="mission-actions"><label class="button secondary mission-camera"><input type="file" accept="image/*" capture="environment" data-mission-image>ถ่ายภาพ</label><button type="button" class="button secondary" data-mission-retake>ถ่ายใหม่/ลบภาพ</button><button type="button" class="button secondary" data-mission-skip>ข้าม</button><button type="button" class="button" data-mission-next>เพิ่มสิ่งที่สังเกตและไปขั้นต่อไป</button></div></article>`;
  $("[data-mission-image]")?.addEventListener("change", (event) => { const files = [...(event.currentTarget.files ?? [])].filter((file) => file.type.startsWith("image/")); files.forEach((file) => { selectedImages.push({ file, url: URL.createObjectURL(file), missionStep: step.key }); step.imageIndexes.push(selectedImages.length - 1); }); event.currentTarget.value = ""; renderImages(); renderMission(); });
  $("[data-mission-retake]")?.addEventListener("click", () => { step.imageIndexes.slice().reverse().forEach((index) => { URL.revokeObjectURL(selectedImages[index]?.url); selectedImages.splice(index, 1); }); step.imageIndexes = []; renderImages(); renderMission(); });
  $("[data-mission-skip]")?.addEventListener("click", () => completeMissionStep("skipped"));
  $("[data-mission-next]")?.addEventListener("click", () => { document.querySelectorAll("[data-mission-observation]:checked").forEach((input) => caseState.guidedObservations.push({ value: input.value, source: "guided_observation", missionStep: step.key, photoAssociated: step.imageIndexes.length > 0 })); completeMissionStep("completed"); });
}

function completeMissionStep(status) {
  const mission = caseState.photoMission;
  mission.steps[mission.current].status = status;
  if (mission.current < mission.steps.length - 1) { mission.current += 1; renderMission(); } else { missionStep.innerHTML = `<div class="mission-complete"><h3>เก็บข้อมูลครบตามภารกิจแล้ว</h3><p>Observation ที่คุณยืนยันถูกเพิ่มเข้าเคสและประเมิน Candidate Knowledge ใหม่แล้ว รูปภาพเพียงอย่างเดียวไม่ได้สร้าง Observation</p></div>`; missionProgress.textContent = `ตรวจแล้ว ${mission.steps.length} / ${mission.steps.length} จุด`; }
  render();
}

$("[data-photo-mission-start]")?.addEventListener("click", createPhotoMission);

function renderImages() {
  previews.replaceChildren();
  selectedImages.forEach((item, index) => { const wrapper = document.createElement("div"); wrapper.className = "image-preview"; const image = document.createElement("img"); image.src = item.url; image.alt = `รูปที่เลือก ${index + 1}: ${item.file.name}`; const remove = document.createElement("button"); remove.type = "button"; remove.className = "image-remove"; remove.textContent = "×"; remove.setAttribute("aria-label", `นำรูป ${item.file.name} ออก`); remove.addEventListener("click", () => { URL.revokeObjectURL(item.url); selectedImages = selectedImages.filter((candidate) => candidate !== item); renderImages(); }); wrapper.append(image, remove); previews.append(wrapper); });
  previews.hidden = selectedImages.length === 0; imageCount.hidden = selectedImages.length === 0; annotations.hidden = selectedImages.length === 0;
  imageCount.textContent = `เลือกรูปแล้ว ${selectedImages.length} รูป · อยู่ในเบราว์เซอร์ชั่วคราว`;
}

imageInput?.addEventListener("change", () => { const files = [...(imageInput.files ?? [])].filter((file) => file.type.startsWith("image/")); selectedImages.push(...files.map((file) => ({ file, url: URL.createObjectURL(file) }))); imageInput.value = ""; renderImages(); });
annotations?.addEventListener("change", () => { if (caseState) render(); });

function togglePanel(buttonSelector, panelSelector, html) { const button = $(buttonSelector); const panel = $(panelSelector); button?.addEventListener("click", () => { panel.hidden = !panel.hidden; button.setAttribute("aria-expanded", String(!panel.hidden)); if (!panel.hidden) panel.innerHTML = html; }); }
togglePanel("[data-management-toggle]", "[data-management-panel]", `<div class="gated-panel"><h3>แนวทางจัดการที่มีข้อมูลรองรับ</h3><p>แสดงหลัง Investigation context เท่านั้น: Monitoring · Prevention · Cultural · Mechanical/Physical · Biological/Natural Enemy · Chemical Context · Follow-up</p><p>Management Option ไม่ใช่ Recommendation</p><a href="../knowledge-explorer/crop-protection-management.html">เปิด Management Knowledge →</a></div>`);
togglePanel("[data-moa-toggle]", "[data-moa-panel]", `<div class="gated-panel"><h3>MoA authority context</h3><p>Active Ingredient → IRAC v11.5 / FRAC 2026 / HRAC 2026 → Authority + Version → Limitation</p><p>ไม่มีการเลือกสาร ไม่มี spray program และ registration ไม่ใช่ efficacy</p></div>`);
$("[data-management-toggle]")?.addEventListener("click", () => { if (caseState) caseState.managementViewed = true; });
$("[data-escalate]")?.addEventListener("click", () => { if (!caseState) return; const summary = $("[data-handoff-summary]"); const mission = caseState.photoMission; const completed = mission?.steps.filter((step) => step.status === "completed").length ?? 0; const skipped = mission?.steps.filter((step) => step.status === "skipped").length ?? 0; const locations = mission?.steps.map((step) => step.inspect).join(" · ") ?? "ยังไม่ได้ขอภารกิจ"; summary.hidden = false; summary.innerHTML = `<h2>สรุปสำหรับส่งต่อผู้เชี่ยวชาญ (local prototype)</h2><dl><dt>คำอธิบาย</dt><dd>${escapeHtml(caseState.userText)}</dd><dt>Observations</dt><dd>${caseState.observations.join(" · ") || "ไม่มี"}</dd><dt>รูป</dt><dd>${selectedImages.length} รูป · metadata/local preview only</dd><dt>คำตอบ</dt><dd>${caseState.answers.map(escapeHtml).join(" · ") || "ยังไม่มี"}</dd><dt>Candidates</dt><dd>${caseState.candidates.map((item) => item.name).join(" · ") || "ยังไม่มี"}</dd><dt>Evidence gaps</dt><dd>${caseState.questions.map((item) => item.text).join(" · ") || "ต้องทบทวนโดยผู้เชี่ยวชาญ"}</dd><dt>Contradictions</dt><dd>${caseState.candidates.flatMap((item) => item.contradictions).join(" · ") || "ยังไม่พบที่ระบุได้"}</dd><dt>Management viewed</dt><dd>${caseState.managementViewed ? "YES" : "NO"}</dd><dt>PHOTO MISSION</dt><dd>requested=${mission ? "YES" : "NO"} · completed=${completed} · skipped=${skipped} · images=${selectedImages.length}</dd><dt>User-confirmed observations</dt><dd>${caseState.guidedObservations.map((item) => item.value).join(" · ") || "ยังไม่มี"}</dd><dt>Inspection locations</dt><dd>${locations}</dd><dt>Unresolved observations</dt><dd>${mission?.steps.filter((step) => step.status === "pending").map((step) => step.title).join(" · ") || "ไม่มีที่ค้างในภารกิจ"}</dd></dl><p>ไม่มี binary image data และไม่มีการส่ง email หรือ notification จริง</p>`; summary.scrollIntoView({ behavior: "smooth" }); });
$("[data-escalate]")?.addEventListener("click", () => { if (!caseState) return; const summary = $("[data-handoff-summary]"); const spatial = document.createElement("section"); const coordinates = caseState.location.status === "captured" ? `${caseState.location.latitude}, ${caseState.location.longitude} · accuracy ±${Math.round(caseState.location.accuracy)} m · captured_at ${caseState.location.capturedAt}` : "not provided"; spatial.innerHTML = `<h3>FIELD CASE CONTEXT</h3><dl><dt>Field identity · User-provided</dt><dd>${escapeHtml(caseState.field.identity || "not provided")}</dd><dt>Human-readable location · User-provided</dt><dd>${escapeHtml([caseState.field.locality, caseState.field.district, caseState.field.province].filter(Boolean).join(" · ") || "not provided")}</dd><dt>Coordinates · Device-provided</dt><dd>${escapeHtml(coordinates)}</dd><dt>Observation time · User-provided</dt><dd>${escapeHtml(caseState.observationTime.value || "not provided")}</dd><dt>First noticed · User-provided</dt><dd>${escapeHtml(caseState.firstNoticed.date || caseState.firstNoticed.category)}</dd><dt>Crop context · User-provided</dt><dd>rice · ${escapeHtml(caseState.cropContext.variety || "variety not provided")} · ${escapeHtml(caseState.cropContext.age || "age not provided")} · ${escapeHtml(caseState.cropContext.growthStage || "stage not provided")} · ${escapeHtml(caseState.cropContext.waterCondition || "water not provided")}</dd><dt>Candidate Knowledge · System-derived</dt><dd>${caseState.candidates.map((item) => item.name).join(" · ") || "none"}</dd></dl><p>Field observation ≠ Canonical Knowledge · Case coordinate ≠ disease distribution · photo ≠ proof of location</p>`; summary.append(spatial); });
$("[data-new-case]")?.addEventListener("click", () => { selectedImages.forEach((item) => URL.revokeObjectURL(item.url)); selectedImages = []; caseState = null; stream.hidden = true; missionPanel.hidden = true; caseContextPanel.hidden = true; locationStatus.textContent = "ยังไม่ได้ระบุตำแหน่ง"; $("[data-empty-intro]").hidden = false; problem.value = ""; renderImages(); problem.focus(); });
window.addEventListener("pagehide", () => selectedImages.forEach((item) => URL.revokeObjectURL(item.url)));
