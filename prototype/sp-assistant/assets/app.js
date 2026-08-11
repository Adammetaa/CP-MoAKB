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

let selectedImages = [];
let caseState = null;

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
];

const candidates = [
  { key: "brown-spot", domain: "Disease", name: "โรคใบจุดสีน้ำตาล", link: "../knowledge-explorer/rice-disease-corpus.html", cues: ["organ_leaf", "brown", "spot"], distinctions: ["รูปร่างแผล", "สีบริเวณกลางแผล", "อาการที่เมล็ด"], source: "Rice Disease corpus · governed biological sources" },
  { key: "blast", domain: "Disease", name: "โรคไหม้", link: "../knowledge-explorer/rice-disease-corpus.html", cues: ["organ_leaf", "spot"], distinctions: ["แผลรูปตา/กระสวย", "กลางแผลสีเทา", "ความชื้นและระยะข้าว"], source: "Rice Disease corpus · governed biological sources" },
  { key: "leaffolder", domain: "Insect", name: "หนอนห่อใบข้าว", link: "../knowledge-explorer/rice-insect-corpus.html", cues: ["folded_leaf", "larva", "organ_leaf"], distinctions: ["พบหนอนภายในใบ", "รอยกินเป็นแถบสีขาว"], source: "Rice Insect corpus · Rice Department source" },
  { key: "brown-planthopper", domain: "Insect", name: "เพลี้ยกระโดดสีน้ำตาล", link: "../knowledge-explorer/rice-insect-corpus.html", cues: ["hopper", "wilt", "organ_stem"], distinctions: ["ตัวแมลงบริเวณโคนต้น", "การกระจายเป็นหย่อม", "อาการไหม้เป็นบริเวณ"], source: "Rice Insect corpus · Rice Department source" },
  { key: "sedge-group", domain: "Weed", name: "กลุ่มกกที่ควรตรวจต่อ", link: "../knowledge-explorer/rice-weed-corpus.html", cues: ["triangular_stem", "narrow_leaf"], distinctions: ["หน้าตัดลำต้น", "ข้อปล้อง", "ช่อดอก", "สภาพน้ำ"], source: "Rice Weed corpus · governed DOA source" },
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
  caseState = { id: String(Date.now()).slice(-6), userText: text, answers: [], observations: [], candidates: [], questions: [], managementViewed: false };
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
$("[data-escalate]")?.addEventListener("click", () => { if (!caseState) return; const summary = $("[data-handoff-summary]"); summary.hidden = false; summary.innerHTML = `<h2>สรุปสำหรับส่งต่อผู้เชี่ยวชาญ (local prototype)</h2><dl><dt>คำอธิบาย</dt><dd>${escapeHtml(caseState.userText)}</dd><dt>Observations</dt><dd>${caseState.observations.join(" · ") || "ไม่มี"}</dd><dt>รูป</dt><dd>${selectedImages.length} รูป · metadata/local preview only</dd><dt>คำตอบ</dt><dd>${caseState.answers.map(escapeHtml).join(" · ") || "ยังไม่มี"}</dd><dt>Candidates</dt><dd>${caseState.candidates.map((item) => item.name).join(" · ") || "ยังไม่มี"}</dd><dt>Evidence gaps</dt><dd>${caseState.questions.map((item) => item.text).join(" · ") || "ต้องทบทวนโดยผู้เชี่ยวชาญ"}</dd><dt>Contradictions</dt><dd>${caseState.candidates.flatMap((item) => item.contradictions).join(" · ") || "ยังไม่พบที่ระบุได้"}</dd><dt>Management viewed</dt><dd>${caseState.managementViewed ? "YES" : "NO"}</dd></dl><p>ไม่มีการส่ง email หรือ notification จริง</p>`; summary.scrollIntoView({ behavior: "smooth" }); });
$("[data-new-case]")?.addEventListener("click", () => { caseState = null; stream.hidden = true; $("[data-empty-intro]").hidden = false; problem.value = ""; problem.focus(); });
window.addEventListener("pagehide", () => selectedImages.forEach((item) => URL.revokeObjectURL(item.url)));
