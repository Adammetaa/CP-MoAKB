const $ = (selector) => document.querySelector(selector);
const chatStyles = document.createElement("link");
chatStyles.rel = "stylesheet";
chatStyles.href = "assets/chat.css";
document.head.append(chatStyles);
const polishStyles = document.createElement("link");
polishStyles.rel = "stylesheet";
polishStyles.href = "assets/polish.css";
document.head.append(polishStyles);
const chatLayoutFix = document.createElement("style");
chatLayoutFix.textContent = `.chat-composer textarea{height:48px!important;min-height:48px!important}.composer-summary,.composer-collapse{min-height:44px;border:0;background:transparent;color:var(--green);font-weight:800;cursor:pointer}.composer-summary{display:flex;width:100%;align-items:center;gap:8px;padding:6px 12px;text-align:left}.composer-summary small{overflow:hidden;color:var(--muted);font-weight:500;text-overflow:ellipsis;white-space:nowrap}.composer-collapse{position:absolute;right:8px;top:5px;z-index:3;width:44px;border-radius:50%;font-size:20px}.composer-expanded{max-height:min(48dvh,390px);overflow:auto}.composer-expanded textarea{height:88px!important;padding-right:52px}.composer-collapsed .image-previews,.composer-collapsed .image-count,.composer-collapsed .image-annotations,.composer-collapsed .privacy-note{display:none!important}.composer-collapsed{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;overflow:visible}.composer-collapsed textarea,.composer-collapsed .composer-summary{grid-column:1;grid-row:1}.composer-collapsed .composer-actions{grid-column:2;grid-row:1}.composer-collapsed.composer-has-summary textarea{visibility:hidden;pointer-events:none}.composer-collapsed .composer-summary[hidden]{display:none}.composer-expanded .composer-summary{display:none}.composer-expanded .composer-collapse{display:block}.composer-collapsed .composer-collapse{display:none}@media(max-width:820px){.empty-intro{margin:18px auto 140px}.composer-expanded{max-height:min(44dvh,340px);padding-top:44px}.composer-expanded:focus-within{max-height:min(38dvh,280px)}}`;
document.head.append(chatLayoutFix);
chatLayoutFix.textContent += `.header-back{width:40px;height:40px;display:grid;place-items:center;border-radius:50%;color:var(--green);font-size:22px;font-weight:800;text-decoration:none}.header-back:focus-visible{outline:3px solid var(--gold);outline-offset:2px}`;
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
const weatherSection = $("[data-weather-section]");
const weatherStatus = $("[data-weather-status]");
const weatherResult = $("[data-weather-result]");
const fieldWatch = $("[data-field-watch]");
const fieldWatchStatus = $("[data-field-watch-status]");
const fieldWatchResults = $("[data-field-watch-results]");

const headerBack = document.createElement("a");
headerBack.className = "header-back";
headerBack.href = "../knowledge-explorer/";
headerBack.textContent = "←";
headerBack.setAttribute("aria-label", "กลับไปยัง Knowledge Explorer");
document.querySelector(".chat-status")?.prepend(headerBack);

let selectedImages = [];
let caseState = null;

const composer = document.querySelector(".composer-shell");
composer?.classList.add("chat-composer");
const composerSummary = document.createElement("button");
composerSummary.type = "button";
composerSummary.className = "composer-summary";
composerSummary.setAttribute("aria-label", "ขยายพื้นที่เขียนข้อความและดูไฟล์แนบ");
const composerCollapse = document.createElement("button");
composerCollapse.type = "button";
composerCollapse.className = "composer-collapse";
composerCollapse.textContent = "⌄";
composerCollapse.setAttribute("aria-label", "ย่อพื้นที่เขียนข้อความ");
composer?.prepend(composerSummary);
composer?.prepend(composerCollapse);
let composerExpanded = false;
let composerInteractionAt = 0;
const checkedObservationCount = () => annotations?.querySelectorAll('input:checked').length ?? 0;
function updateComposerSummary() {
  const pendingImageCount = selectedImages.filter((item) => item.pending !== false).length;
  const imageSummary = pendingImageCount ? `🖼 ${pendingImageCount} รูป` : "";
  const observationCount = checkedObservationCount();
  const observationSummary = observationCount ? ` · เลือกสิ่งที่เห็นแล้ว ${observationCount} รายการ` : "";
  const statusSummary = `${imageSummary}${observationSummary}`.replace(/^ · /, "");
  const draft = problem?.value.trim();
  const hasPendingSummary = pendingImageCount > 0 || observationCount > 0 || Boolean(draft);
  composer?.classList.toggle("composer-has-summary", hasPendingSummary);
  composerSummary.hidden = !hasPendingSummary;
  composerSummary.innerHTML = `${statusSummary ? `<strong>${statusSummary}</strong>` : ""}<small>${draft ? escapeHtml(draft) : "เล่าอาการเพิ่มเติม..."}</small>`;
}
function setComposerExpanded(expanded, { focus = false } = {}) {
  composerExpanded = expanded;
  composer?.classList.toggle("composer-expanded", expanded);
  composer?.classList.toggle("composer-collapsed", !expanded);
  composer?.setAttribute("data-composer-state", expanded ? "expanded" : "collapsed");
  composerSummary.setAttribute("aria-expanded", String(expanded));
  updateComposerSummary();
  if (focus) problem?.focus({ preventScroll: true });
}
composerSummary.addEventListener("click", () => setComposerExpanded(true, { focus: true }));
composerCollapse.addEventListener("click", () => setComposerExpanded(false));
composer?.addEventListener("pointerdown", () => { composerInteractionAt = Date.now(); });
setComposerExpanded(false);
const jumpLatest = document.createElement("button");
jumpLatest.type = "button";
jumpLatest.className = "jump-latest";
jumpLatest.textContent = "↓ ข้อความล่าสุด";
jumpLatest.hidden = true;
document.body.append(jumpLatest);
jumpLatest.addEventListener("click", () => {
  questionPanel?.scrollIntoView({ behavior: "smooth", block: "end" });
  jumpLatest.hidden = true;
});
const attachmentMenu = document.createElement("div");
attachmentMenu.className = "attachment-menu";
attachmentMenu.hidden = true;
attachmentMenu.setAttribute("role", "menu");
attachmentMenu.innerHTML = `<button type="button" role="menuitem" data-camera-action>📷 ถ่ายภาพ</button><button type="button" role="menuitem" data-gallery-action>🖼 เลือกรูปจากเครื่อง</button><button type="button" role="menuitem" data-attachment-field>🌾 ข้อมูลแปลง</button><button type="button" role="menuitem" data-attachment-location>📍 ตำแหน่งแปลง</button><button type="button" role="menuitem" data-attachment-time>🕒 เวลาที่สังเกต</button>`;
document.body.append(attachmentMenu);
function positionAttachmentMenu() {
  const anchor = attachmentLabel?.getBoundingClientRect();
  if (!anchor) return;
  const menuWidth = Math.min(280, window.innerWidth - 24);
  attachmentMenu.style.width = `${menuWidth}px`;
  attachmentMenu.style.left = `${Math.max(12, Math.min(anchor.left, window.innerWidth - menuWidth - 12))}px`;
  attachmentMenu.style.bottom = `${Math.max(64, window.innerHeight - anchor.top + 8)}px`;
}
const attachmentLabel = document.querySelector(".attachment-button");
if (attachmentLabel) {
  composer?.append(imageInput);
  imageInput.hidden = true;
  attachmentLabel.setAttribute("role", "button");
  attachmentLabel.tabIndex = 0;
  attachmentLabel.querySelector("span").textContent = "+";
  attachmentLabel.lastChild.textContent = "";
  attachmentLabel.setAttribute("aria-label", "เปิดเมนูแนบข้อมูล");
  attachmentLabel.addEventListener("click", (event) => {
    event.preventDefault();
    setComposerExpanded(true);
    attachmentMenu.hidden = !attachmentMenu.hidden;
    if (!attachmentMenu.hidden) positionAttachmentMenu();
  });
  attachmentLabel.addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); attachmentLabel.click(); } });
}
document.addEventListener("pointerdown", (event) => {
  if (!attachmentMenu.hidden && !attachmentMenu.contains(event.target) && !attachmentLabel?.contains(event.target)) attachmentMenu.hidden = true;
});
window.addEventListener("resize", () => { if (!attachmentMenu.hidden) positionAttachmentMenu(); });

const validationBadge = document.createElement("span");
validationBadge.className = "validation-mode";
validationBadge.textContent = "โหมดทดสอบภาคสนาม";
document.querySelector(".topbar")?.append(validationBadge);
$("[data-new-case]")?.addEventListener("click", (event) => {
  if (caseState && !window.confirm("เริ่มเคสใหม่และล้างข้อมูลชั่วคราวของเคสปัจจุบันหรือไม่?")) event.stopImmediatePropagation();
}, true);

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
  ["eye_shaped_lesion", ["รูปตา", "กระสวย", "eye-shaped", "spindle"]], ["gray_center", ["กลางแผลสีเทา", "ตรงกลางสีเทา", "gray center"]],
  ["brown_round_oval", ["จุดสีน้ำตาลกลม", "จุดสีน้ำตาลรูปไข่", "brown round", "brown oval"]], ["grain_symptom", ["อาการที่เมล็ด", "จุดบนเมล็ด", "grain symptom"]],
  ["folded_leaf", ["ใบม้วน", "ใบพับ", "ใบห่อ", "folded leaf"]],
  ["larva", ["หนอน", "larva"]], ["hopper", ["เพลี้ย", "hopper"]],
  ["deadheart", ["ยอดแห้ง", "deadheart"]], ["whitehead", ["รวงขาว", "whitehead"]],
  ["wilt", ["เหี่ยว", "wilting"]], ["triangular_stem", ["ลำต้นเป็นเหลี่ยม", "สามเหลี่ยม", "triangular stem"]],
  ["narrow_leaf", ["ใบแคบ", "ใบเรียว", "narrow leaf"]], ["pest_seen", ["พบแมลง", "เห็นแมลง", "ตัวหนอน"]],
  ["broad_leaf", ["ใบกว้าง", "broad leaf"]], ["feeding_scar", ["รอยกินสีขาว", "แถบสีขาว", "feeding scar"]],
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
  { key: "rice-field-broadleaf", domain: "Weed", name: "ผักปอดนา / กลุ่มใบกว้างที่ควรตรวจต่อ", link: "../knowledge-explorer/rice-weed-corpus.html", cues: ["weed_plant", "broad_leaf"], distinctions: ["รูปใบ", "เส้นใบ", "ลำต้น", "ดอก"], source: "Rice Weed corpus · EV-RWC-003/v1; EV-RWC-004/v1" },
];

const questionBank = {
  organ_leaf: "อาการหลักอยู่ที่ใบหรือไม่?", organ_root: "พบอาการที่รากหรือไม่?",
  lesion_shape: "แผลมีรูปร่างอย่างไร และตรงกลางมีสีอะไร?", field_distribution: "อาการกระจายทั้งแปลงหรือเป็นหย่อม?",
  rice_age: "ข้าวอายุเท่าใดหรืออยู่ระยะใด?", rain: "ช่วงก่อนพบอาการมีฝนหรือความชื้นสูงหรือไม่?",
  pest_seen: "พบตัวแมลง หนอน ไข่ หรือร่องรอยการกินหรือไม่?", water: "ระดับน้ำและการระบายน้ำในแปลงเป็นอย่างไร?",
  chemical_history: "เคยใช้สารออกฤทธิ์อะไร สูตร/ความเข้มข้น และเมื่อใด?", spray: "ใช้อัตราตามฉลาก การคลุมพื้นที่ และสภาพอากาศขณะพ่นอย่างไร?",
};

const environmentalProfiles = {
  "brown-spot": { pathway: "ยังไม่มี pathway ที่ Evidence รองรับใน projection นี้", factors: "บริบทใบและเมล็ด", weather: "ยังไม่มีตัวแปรอากาศที่รองรับเฉพาะ subject", surveillance: "ใช้รูปแบบในแปลงร่วมกับรูปร่างแผล อวัยวะ และระยะข้าว", evidence: "EV-RDC-003A/v1 · EV-RDC-003B/v1", distance: "ระยะเชิงปริมาณยังไม่ทราบ" },
  blast: { pathway: "ยังไม่มี pathway ที่ Evidence รองรับใน projection นี้", factors: "ความชื้นสูงมีความเกี่ยวข้องตาม Source; เป็น favorable context ไม่ใช่ transmission", weather: "relative_humidity", surveillance: "ตรวจอาการใบและคอรวงร่วมกับความชื้นที่สังเกตได้", evidence: "EV-RDC-001A/v1 · EV-RDC-001B/v1", distance: "ระยะเชิงปริมาณยังไม่ทราบ" },
  leaffolder: { pathway: "ไม่สร้าง transmission pathway; บันทึกการพบแมลงและความเสียหายแยกกัน", factors: "ข้าวอ่อน ใบพับ และรอยกินสีขาว", weather: "ยังไม่มีตัวแปรอากาศเฉพาะ subject", surveillance: "เปิดใบพับและตรวจต้นข้างเคียงเมื่อมีหลักฐานความเสียหาย", evidence: "EV-RIC-006/v1", distance: "ระยะการเคลื่อนที่เชิงปริมาณยังไม่ทราบ" },
  "brown-planthopper": { pathway: "มี vector context ตาม Source; การพบพาหะไม่ยืนยันการติดเชื้อ", factors: "โคนต้นและรูปแบบความเสียหายเป็นหย่อม", weather: "ยังไม่มีตัวแปรอากาศเฉพาะ subject", surveillance: "ตรวจโคนต้นและบันทึกจำนวน/การกระจายแยกจากอาการโรค", evidence: "EV-RIC-002/v1 · EV-RDC-010A/v1 · EV-RDC-015B/v1", distance: "ระยะการเคลื่อนที่เชิงปริมาณยังไม่ทราบ" },
  "sedge-group": { pathway: "ไม่มี pathway ที่รองรับ", factors: "สภาพน้ำเป็น observation context เท่านั้น", weather: "ยังไม่มีตัวแปรอากาศที่รองรับ", surveillance: "ตรวจสัณฐานและการกระจายในแปลงโดยไม่อนุมานชนิด", evidence: "Rice Weed corpus governed evidence", distance: "ไม่กำหนดรัศมี" },
};

const governedWeatherVariables = {
  "brown-spot": [],
  blast: ["relative_humidity"],
  leaffolder: [],
  "brown-planthopper": [],
  "sedge-group": [],
};

const governedSpatialPathways = {
  "brown-spot": { category: null, evidence: ["EV-RDC-003A/v1", "EV-RDC-003B/v1"] },
  blast: { category: null, evidence: ["EV-RDC-001A/v1", "EV-RDC-001B/v1"] },
  leaffolder: { category: null, evidence: ["EV-RIC-006/v1"] },
  "brown-planthopper": { category: "vector-associated context", evidence: ["EV-RIC-002/v1", "EV-RDC-010A/v1", "EV-RDC-015B/v1"] },
  "sedge-group": { category: null, evidence: ["Rice Weed corpus governed evidence"] },
};

const demoFieldCases = [
  { id: "DEMO-NFW-001", fieldLabel: "แปลงสาธิต บางเขน A", latitude: 13.8476, longitude: 100.5696, observationTime: "2026-08-10T09:00:00+07:00", crop: "rice", cropAge: "45 วัน", growthStage: "แตกกอ", observations: ["organ_leaf", "spot", "gray_center"], candidates: ["blast"], status: "investigation ongoing", confirmationState: "candidate knowledge · unresolved", weatherContext: { provenance: "DEMO WEATHER CONTEXT", relative_humidity: 82, unit: "%" }, provenance: "demo_fixture" },
  { id: "DEMO-NFW-002", fieldLabel: "แปลงสาธิต บางเขน B", latitude: 13.8382, longitude: 100.5752, observationTime: "2026-08-08T15:30:00+07:00", crop: "rice", cropAge: "52 วัน", growthStage: "แตกกอ", observations: ["hopper", "field_distribution"], candidates: ["brown-planthopper"], status: "observation only", confirmationState: "candidate knowledge · unresolved", weatherContext: { provenance: "DEMO WEATHER CONTEXT", wind_speed: 7, unit: "km/h" }, provenance: "demo_fixture" },
  { id: "DEMO-NFW-003", fieldLabel: "แปลงสาธิต ลาดยาว", latitude: 13.8168, longitude: 100.5621, observationTime: "2026-07-28T07:45:00+07:00", crop: "rice", cropAge: "60 วัน", growthStage: "ตั้งท้อง", observations: ["folded_leaf", "larva"], candidates: ["leaffolder"], status: "observation only", confirmationState: "not confirmed", weatherContext: null, provenance: "demo_fixture" },
  { id: "DEMO-NFW-004", fieldLabel: "แปลงสาธิต ดอนเมือง", latitude: 13.9133, longitude: 100.5897, observationTime: "2026-08-11T06:20:00+07:00", crop: "rice", cropAge: "ไม่ระบุ", growthStage: "ไม่ระบุ", observations: ["weed_plant", "triangular_stem"], candidates: ["sedge-group"], status: "investigation ongoing", confirmationState: "candidate knowledge · unresolved", weatherContext: null, provenance: "demo_fixture" },
];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const detected = (text, words) => words.some((word) => text.includes(word));

function extractObservations(text) {
  const normalized = text.toLowerCase();
  const observations = cueRules.filter(([, words]) => detected(normalized, words)).map(([key]) => key);
  const age = normalized.match(/(?:ข้าว\s*)?(\d{1,3})\s*วัน/);
  const insectsPerPlant = normalized.match(/(\d+(?:\.\d+)?)\s*(?:ตัว)\s*(?:ต่อ|\/)\s*(?:ต้น|กอ)|(?:average\s*)?(\d+(?:\.\d+)?)\s*(?:insects?|hoppers?)\s*per\s*(?:plant|hill)/i);
  if (age) observations.push("rice_age");
  document.querySelectorAll("[data-image-annotations] input:checked").forEach((input) => observations.push(input.value));
  (caseState?.guidedObservations ?? []).forEach((item) => observations.push(item.value));
  return { observations: [...new Set(observations)], age: age?.[1] ?? $("[data-rice-age]")?.value.trim() ?? "", measurements: { insectsPerPlant: insectsPerPlant ? Number(insectsPerPlant[1] ?? insectsPerPlant[2]) : null } };
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
  if (observations.includes("failed_control")) return ["chemical_history", "spray"].filter((key) => !caseState.answerRecords?.[key]).map((key) => ({ key, text: questionBank[key] }));
  const bph = activeCandidates.some((item) => item.key === "brown-planthopper");
  if (bph && !caseState.answerRecords?.bph_current_activity) return [{ key: "bph_current_activity", text: "ตอนนี้ยังพบตัวแมลงมีชีวิตบริเวณโคนต้นหรือไม่?" }];
  if (bph && caseState.answerRecords?.bph_current_activity?.value === "found" && !caseState.answerRecords?.action_insects_per_plant) return [{ key: "action_insects_per_plant", text: "พบเฉลี่ยกี่ตัวต่อต้น?" }];
  if (bph && Number(caseState.answerRecords?.action_insects_per_plant?.value) >= 10 && !caseState.answerRecords?.previous_treatment) return [{ key: "previous_treatment", text: "ครั้งล่าสุดใช้สารกำจัดแมลงอะไร?" }];
  if (!observations.includes("rice_age")) keys.push("rice_age");
  if (observations.includes("spot")) keys.push("lesion_shape");
  if (!observations.includes("field_distribution")) keys.push("field_distribution");
  if (activeCandidates.some((item) => item.domain === "Disease") && !observations.includes("rain")) keys.push("rain");
  if (activeCandidates.some((item) => item.domain === "Insect") && !observations.includes("pest_seen")) keys.push("pest_seen");
  if (activeCandidates.some((item) => item.domain === "Weed")) keys.push("water");
  if (observations.includes("failed_control")) keys.push("chemical_history", "spray");
  return [...new Set(keys)].filter((key) => !caseState.answerRecords?.[key]).slice(0, 5).map((key) => ({ key, text: questionBank[key] }));
}

function renderCandidate(candidate) {
  const support = candidate.matches.length ? candidate.matches.map((cue) => `<li>${escapeHtml(cue.replaceAll("_", " "))}</li>`).join("") : "<li>ยังไม่มี cue ที่รองรับ</li>";
  const missing = candidate.missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const contradictions = candidate.contradictions.length ? candidate.contradictions.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>ยังไม่พบข้อขัดแย้งที่ระบุได้</li>";
  return `<article class="candidate-card"><p class="eyebrow">${candidate.domain} Knowledge</p><h3>${candidate.name}</h3><h4>สนับสนุนจากข้อมูลที่มี</h4><ul>${support}</ul><h4>ข้อมูลที่ยังขาด</h4><ul>${missing}</ul><h4>ข้อมูลที่อาจไม่สอดคล้อง</h4><ul>${contradictions}</ul><p class="source-summary"><strong>แหล่งองค์ความรู้:</strong> ${candidate.source}</p><a href="${candidate.link}">เปิด Knowledge Explorer →</a></article>`;
}

function renderDecisionGates(decision) {
  if (!decision) return '<section data-decision-gates><p>Evidence Gate unavailable · Management remains blocked</p></section>';
  const gates = decision.candidateGates.map((gate) => {
    const supporting = gate.supporting.map((item) => `<li>${escapeHtml(item.label)} <small>${escapeHtml(item.claim)} → ${escapeHtml(item.evidence)} → ${escapeHtml(item.locator)}</small></li>`).join("") || "<li>ยังไม่มี</li>";
    const missing = gate.missing.map((item) => `<li>${escapeHtml(item.label)} · ${item.role}</li>`).join("") || "<li>ไม่มี gap ที่ระบุใน profile นี้</li>";
    const contradicting = gate.contradicting.map((item) => `<li>${escapeHtml(item.label)}</li>`).join("") || "<li>ยังไม่พบข้อขัดแย้งที่กฎรองรับ</li>";
    return `<article class="candidate-card" data-identification-gate="${gate.key}"><h3>${escapeHtml(gate.name)}</h3><dl><dt>Evidence Sufficiency</dt><dd>${gate.sufficiency}</dd><dt>Identification Gate</dt><dd>${gate.identification} · ${escapeHtml(gate.level)}</dd></dl><h4>Supporting Evidence</h4><ul>${supporting}</ul><h4>Missing Distinguishing Evidence</h4><ul>${missing}</ul><h4>Contradictory Evidence</h4><ul>${contradicting}</ul><p><strong>ข้อจำกัด:</strong> ${escapeHtml(gate.confirmation)}</p></article>`;
  }).join("") || "<p>ยังไม่มี Candidate profile ที่เข้าสู่ Gate</p>";
  return `<section data-decision-gates><h3>Evidence Sufficiency และ Identification Gate</h3>${gates}<h3>Severity</h3><p>${decision.severity.status} · ${escapeHtml(decision.severity.limitation)}</p><p>Observable evidence: ${decision.severity.evidence.map(escapeHtml).join(" · ") || "ยังไม่มี"} · quantitative thresholds: NONE</p><h3>Need-for-Action</h3><p>${decision.needForAction.status} · ${escapeHtml(decision.needForAction.basis)}</p><h3>Management Gate</h3><p>${decision.management.status} · chemical recommendation=${decision.management.chemicalRecommendation}</p><p>${escapeHtml(decision.management.limitation)}</p><h3>Next Best Evidence</h3><p>${escapeHtml(decision.nextBestEvidence.label || decision.nextBestEvidence.reason)}${decision.nextBestEvidence.candidate ? ` · ${escapeHtml(decision.nextBestEvidence.candidate)}` : ""}</p><h3>Human Review</h3><p>${decision.humanReview.required ? "REQUIRED" : "NOT CURRENTLY TRIGGERED"} · ${decision.humanReview.reasons.map(escapeHtml).join(" · ") || "ไม่มีเงื่อนไขที่กฎระบุ"}</p><p class="boundary-copy">${decision.boundaries.map(escapeHtml).join(" · ")}</p></section>`;
}

function renderEnvironmentalContext(candidate) {
  if (!candidate || !environmentalProfiles[candidate.key]) return "";
  const profile = environmentalProfiles[candidate.key];
  return `<section class="environmental-context"><p class="eyebrow">Environmental / Transmission projection</p><h2>บริบทที่ควรตรวจเพิ่มเติม</h2><div class="investigation-grid"><section><h3>การแพร่ที่ควรพิจารณา</h3><p>${profile.pathway}</p></section><section><h3>ปัจจัยแวดล้อมที่เกี่ยวข้อง</h3><p>${profile.factors}</p></section><section><h3>ปัจจัยอากาศที่ควรติดตาม</h3><p>${profile.weather}</p></section><section><h3>สิ่งที่ควรตรวจในพื้นที่ใกล้เคียง</h3><p>${profile.surveillance}</p></section></div><p class="source-summary"><strong>Evidence:</strong> ${profile.evidence} · <strong>Distance:</strong> ${profile.distance}</p><p class="boundary-copy">สภาพที่เอื้อ ≠ การแพร่ · Vector present ≠ plant infected · Field pattern ≠ Diagnosis · ไม่มี live weather หรือ nearby-case lookup</p></section>`;
}

const guidedQuestionControls = {
  bph_current_activity: { type: "chips", label: "ตอนนี้ยังพบตัวแมลงมีชีวิตบริเวณโคนต้นหรือไม่?", why: "Current activity ต้องแยกจากรอยเสียหายเก่า", options: [["พบ", "found"], ["ไม่พบ", "not_found"], ["ไม่แน่ใจ", "unknown"]] },
  action_insects_per_plant: { type: "number", label: "พบเฉลี่ยกี่ตัวต่อต้น?", why: "ใช้หน่วย insects / plant ตาม Action Evidence; ไม่แปลงจากจุดสุ่ม" },
  previous_treatment: { type: "select", label: "ครั้งล่าสุดใช้สารกำจัดแมลงอะไร?", why: "เก็บบริบท active ingredient / MoA / failed control โดยไม่สรุป resistance", options: [["", "เลือกเท่าที่ทราบ"], ["none", "ไม่เคยใช้"], ["damuzin-pymetrozine", "ดามูซิน / pymetrozine / IRAC 9B"], ["pymetrozine", "pymetrozine / IRAC 9B"], ["imidacloprid", "imidacloprid / IRAC 4A"], ["unknown", "จำไม่ได้"]] },
  rice_age: { type: "number", label: "อายุข้าวประมาณกี่วัน?", why: "อายุข้าวช่วยจัดบริบทระยะพืช แต่ไม่ยืนยันสาเหตุ" },
  lesion_shape: { type: "chips", label: "ลักษณะแผลใกล้เคียงแบบไหน?", why: "รูปร่างแผลช่วยแยกสิ่งที่ควรตรวจต่อ แต่ไม่ยืนยันโรค", options: [["จุดกลมหรือรี", "จุดกลมหรือรี"], ["แผลยาว/กระสวย", "แผลรูปตาหรือกระสวย"], ["แผลเป็นขีด", "แผลเป็นขีด"], ["ดูไม่แน่ใจ", "ไม่แน่ใจ"]] },
  field_distribution: { type: "chips", label: "อาการกระจายแบบไหน?", why: "รูปแบบการกระจายช่วยกำหนดจุดตรวจในแปลง", options: [["ไม่กี่ต้น", "ไม่กี่ต้น"], ["เป็นหย่อม", "เป็นหย่อม"], ["หลายจุดทั่วแปลง", "กระจายหลายจุดทั่วแปลง"], ["เกือบทั้งแปลง", "เกือบทั้งแปลง"], ["ไม่แน่ใจ", "ไม่แน่ใจ"]] },
  rain: { type: "chips", label: "ช่วงก่อนพบอาการมีฝนหรือความชื้นที่สังเกตได้ไหม?", why: "นี่เป็น Field Observation แยกจากข้อมูล Weather API", options: [["มีฝน/ชื้น", "มีฝนและสภาพชื้น"], ["ไม่มี", "ไม่พบฝนหรือความชื้น"], ["ไม่แน่ใจ", "ไม่แน่ใจ"]] },
  pest_seen: { type: "chips", label: "พบตัวแมลง หนอน ไข่ หรือรอยกินไหม?", why: "การพบแมลงช่วยกำหนดจุดตรวจ แต่ไม่ยืนยันชนิดหรือสาเหตุ", options: [["พบตัวแมลง", "พบแมลง"], ["พบหนอน", "พบหนอน"], ["พบรอยกิน", "พบรอยกิน"], ["ไม่พบ", "ไม่พบแมลง"], ["ไม่แน่ใจ", "ไม่แน่ใจ"]] },
  water: { type: "chips", label: "สภาพน้ำในแปลงเป็นแบบไหน?", why: "สภาพน้ำเป็น Observation context ไม่ใช่คำวินิจฉัย", options: [["มีน้ำขัง", "มีน้ำขัง"], ["ชื้นแต่ไม่ขัง", "ชื้นแต่ไม่ขัง"], ["ค่อนข้างแห้ง", "แปลงค่อนข้างแห้ง"], ["ไม่แน่ใจ", "ไม่แน่ใจ"]] },
  chemical_history: { type: "select", label: "สารที่ใช้ล่าสุดอยู่ในกลุ่มใด?", why: "ใช้ตรวจประวัติการควบคุม ไม่ใช้สรุปการดื้อยา", options: [["", "เลือกเท่าที่ทราบ"], ["fungicide", "สารป้องกันกำจัดโรคพืช"], ["insecticide", "สารป้องกันกำจัดแมลง"], ["herbicide", "สารกำจัดวัชพืช"], ["unknown", "จำชื่อหรือกลุ่มไม่ได้"]] },
  spray: { type: "chips", label: "การใช้ครั้งล่าสุดเป็นอย่างไร?", why: "ตรวจ timing, application และ environment ก่อนตั้งสมมติฐาน resistance", options: [["ตามฉลาก", "ใช้ตามฉลาก"], ["ไม่แน่ใจอัตรา", "ไม่แน่ใจอัตรา"], ["ฝนหลังใช้", "มีฝนหลังใช้"], ["ไม่แน่ใจ", "ไม่แน่ใจ"]] },
};

function investigationProgress() {
  if (!caseState.observations.length) return "เริ่มตรวจสอบ";
  if (!caseState.candidates.length) return "กำลังรวบรวมข้อมูล";
  if (caseState.questions.length) return "ยังมีจุดสำคัญที่ต้องตรวจ";
  if (caseState.guidedObservations.length || caseState.photoMission) return "ข้อมูลภาคสนามค่อนข้างครบสำหรับส่งตรวจทาน";
  return "มีข้อมูลพอเปรียบเทียบ Candidate";
}

function evidenceCompleteness() {
  if (!caseState.candidates.length) return "ข้อมูลยังไม่พอสำหรับสรุป";
  if (caseState.questions.length) return "มีข้อมูลพอสำหรับเปรียบเทียบสาเหตุที่ควรตรวจต่อ";
  return "ข้อมูลภาคสนามค่อนข้างครบสำหรับส่งตรวจทาน";
}

function nextBestAction() {
  if (caseState.lastAnswerUncertain) return { type: "START_PHOTO_MISSION", label: "จุดนี้ถ่ายภาพเพิ่มจะช่วยตรวจต่อได้ครับ", action: "เริ่ม Photo Mission" };
  if (caseState.questions[0]) return { type: "ASK_QUESTION", question: caseState.questions[0] };
  if (!caseState.observationTime.value) return { type: "REQUEST_FIELD_CONTEXT", label: "เพิ่มเวลาที่ตรวจแปลงและบริบทข้าว", action: "เพิ่มข้อมูลแปลง" };
  if (!["captured", "deferred"].includes(caseState.location.status)) return { type: "REQUEST_LOCATION", label: "เพิ่มพิกัดแปลงเพื่อดู Weather และบริบทพื้นที่ใกล้เคียง", action: "เพิ่มตำแหน่ง (ไม่บังคับ)" };
  if (!caseState.weatherContext) return { type: "OFFER_WEATHER_CONTEXT", label: "เคสนี้มีพิกัดและเวลาสังเกตแล้ว ต้องการดูสภาพอากาศประกอบหรือไม่?", action: "ตรวจสภาพอากาศ" };
  if (!caseState.photoMission) return { type: "START_PHOTO_MISSION", label: "เก็บหลักฐานภาพและยืนยันสิ่งที่เห็นเพิ่มเติม", action: "เริ่ม Photo Mission" };
  if (!caseState.nearbyFieldWatch) return { type: "OFFER_NEARBY_FIELD", label: "เคสนี้มีตำแหน่งแล้ว สามารถตรวจบริบทพื้นที่ใกล้เคียงได้", action: "เฝ้าระวังพื้นที่ใกล้เคียง" };
  return { type: "REQUEST_EXPERT_HANDOFF", label: "ข้อมูลตอนนี้พร้อมพอสำหรับส่งให้ผู้เชี่ยวชาญตรวจทาน", action: "ดูสรุปก่อนส่ง" };
}

function renderQuestionControl(question) {
  const control = guidedQuestionControls[question.key] || { type: "text", label: question.text, why: "คำตอบนี้ช่วยเติม Evidence gap ที่กำหนดไว้" };
  if (control.type === "chips") return `<fieldset class="choice-chips"><legend>${control.label}</legend>${control.options.map(([label, value]) => `<label><input type="radio" name="guided-answer" value="${value}" data-question-key="${question.key}" required><span>${label}</span></label>`).join("")}</fieldset>`;
  if (control.type === "select") return `<label class="guided-field">${control.label}<select name="guided-answer" data-question-key="${question.key}" required>${control.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label>`;
  if (control.type === "number") return `<label class="guided-field">${control.label}<input type="number" inputmode="numeric" min="1" max="365" name="guided-answer" data-question-key="${question.key}" placeholder="เช่น 60" required></label>`;
  return `<label class="guided-field">${control.label}<input name="guided-answer" data-question-key="${question.key}" required></label>`;
}

const typoCandidates = [
  { input: "หนอนห่อไบ", suggestion: "หนอนห่อใบ", level: "high" },
  { input: "จุดสีน้ำตาน", suggestion: "จุดสีน้ำตาล", level: "high" },
];
function detectInputRecovery(text, observations) {
  const normalized = text.normalize("NFC").trim().toLowerCase();
  if (/\b(?:irac|frac|hrac)\b|\d+\s*(?:กรัม|กก\.?|มล\.?|ลิตร)|คาแทป|cartap|active ingredient/i.test(normalized)) return { level: "protected", original: text, prompt: "ขอยืนยันชื่อสาร อัตรา หน่วย หรือรหัสกลุ่มก่อนนำไปใช้ตรวจสอบต่อครับ" };
  const candidate = typoCandidates.find((item) => normalized.includes(item.input));
  if (candidate) return { ...candidate, original: text, prompt: `ผมตีความว่า “${candidate.input}” หมายถึง “${candidate.suggestion}” ใช่ไหมครับ?` };
  if (/หนอนกอ|หนอนข้าว/.test(normalized)) return { level: "ambiguous", original: text, prompt: "หมายถึงข้อไหนครับ?", choices: ["หนอนห่อใบข้าว", "หนอนกอข้าว", "อื่น ๆ"] };
  if (!observations.length && normalized.length > 2) return { level: "unknown", original: text, prompt: "ผมยังไม่แน่ใจว่าหมายถึงอะไรครับ ลองบอกเพิ่มได้ไหมว่าพบที่ใบ กาบ โคนต้น หรือรวง?" };
  return null;
}

function renderInputRecovery(recovery) {
  if (!recovery) return "";
  const actions = recovery.level === "high" ? `<button type="button" data-recovery-choice="${escapeHtml(recovery.suggestion)}">ใช่</button><button type="button" data-recovery-edit>แก้ไข</button>` : recovery.level === "ambiguous" ? recovery.choices.map((choice) => `<button type="button" data-recovery-choice="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`).join("") : recovery.level === "protected" ? '<button type="button" data-recovery-confirm>ยืนยันข้อมูล</button><button type="button" data-recovery-edit>พิมพ์ใหม่</button>' : '<button type="button" data-next-action="START_PHOTO_MISSION">ช่วยเก็บภาพ</button><button type="button" data-recovery-edit>บอกเพิ่ม</button>';
  return `<article class="timeline-turn system-turn input-recovery" data-recovery-level="${recovery.level}"><span class="avatar">SYS</span><div class="message-bubble"><strong>${recovery.level === "protected" ? "ข้อมูลที่ต้องยืนยัน" : "ขอเช็กความหมาย"}</strong><span>${escapeHtml(recovery.prompt)}</span><div class="recovery-actions">${actions}</div><small>ข้อความเดิมยังคงอยู่โดยไม่แก้ไขอัตโนมัติ</small></div></article>`;
}

const formatMessageTime = (value) => new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));

function renderConversationHistory() {
  const turns = caseState.conversationHistory.map((item, index, history) => {
    item.timestamp ||= new Date().toISOString();
    const isUser = item.role.startsWith("USER");
    const isSystem = item.role.includes("SYSTEM");
    const kind = isUser ? "user" : isSystem ? "system" : "assistant";
    const previous = history[index - 1];
    const previousKind = previous ? (previous.role.startsWith("USER") ? "user" : previous.role.includes("SYSTEM") ? "system" : "assistant") : null;
    const grouped = previousKind === kind;
    const image = item.imageUrl ? `<img class="timeline-image" src="${item.imageUrl}" alt="รูปที่ผู้ใช้เลือกสำหรับเคส">` : "";
    const reply = item.replyTo ? `<blockquote class="reply-context">↳ ${escapeHtml(item.replyTo)}</blockquote>` : "";
    return `<article class="timeline-turn ${kind}-turn${grouped ? " grouped-turn" : ""}" data-message-type="${item.type || item.role}">${kind === "assistant" || kind === "system" ? `<span class="avatar">${kind === "assistant" ? "SP" : "SYS"}</span>` : ""}<div class="message-bubble">${reply}${image}<span>${escapeHtml(item.text)}</span>${item.questionKey ? `<button type="button" data-correct-answer="${item.questionKey}" aria-label="แก้ไขคำตอบ ${escapeHtml(item.text)}">แก้ไข</button>` : ""}<div class="message-meta"><button type="button" class="timestamp-toggle" aria-expanded="false">เวลา</button><time datetime="${item.timestamp}" hidden>${formatMessageTime(item.timestamp)}</time></div></div></article>`;
  }).join("");
  caseState.inputRecovery = caseState.recoveryResolved ? null : detectInputRecovery(caseState.userText, caseState.observations);
  return `<div class="case-separator">เริ่มเคสใหม่ · ${formatMessageTime(caseState.createdAt)}</div><div class="time-separator">วันนี้ ${formatMessageTime(caseState.createdAt)}</div>${turns}${renderInputRecovery(caseState.inputRecovery)}`;
}

function render() {
  const { observations, age, measurements } = extractObservations(caseState.userText + " " + caseState.answers.join(" "));
  caseState.observations = observations;
  caseState.riceAge = age;
  caseState.candidates = evaluateCandidates(observations);
  caseState.questions = selectQuestions(observations, caseState.candidates);
  caseState.measurements = measurements;
  caseState.decision = window.SPDecisionGates?.evaluate({ observations, candidates: caseState.candidates, measurements }) ?? null;
  caseState.chemicalSlice = window.SPChemicalSlice?.evaluate({
    isBph: caseState.candidates.some((item) => item.key === "brown-planthopper"),
    currentActivity: caseState.answerRecords?.bph_current_activity?.value,
    insectsPerPlant: caseState.answerRecords?.action_insects_per_plant?.value,
    previousTreatment: caseState.answerRecords?.previous_treatment?.value,
  }) ?? null;
  const decisionGap = caseState.decision?.nextBestEvidence;
  if (decisionGap?.action === "ASK_OBSERVATION" && !observations.includes("failed_control") && !caseState.questions.some((question) => ["bph_current_activity", "action_insects_per_plant", "previous_treatment"].includes(question.key))) {
    caseState.questions = [{ key: `gate_${decisionGap.cue}`, text: `เพื่อแยก ${decisionGap.candidate} ต้องตรวจ: ${decisionGap.label}` }, ...caseState.questions].slice(0, 5);
  } else if (caseState.decision?.needForAction.status === "MORE_EVIDENCE_REQUIRED" && caseState.decision.needForAction.requiredMeasurement === "average insects per rice plant" && !observations.includes("failed_control") && !caseState.questions.some((question) => ["bph_current_activity", "action_insects_per_plant", "previous_treatment"].includes(question.key))) {
    caseState.questions = [{ key: "action_insects_per_plant", text: "สุ่มนับเพลี้ยบริเวณโคนต้นแล้วพบเฉลี่ยกี่ตัวต่อต้น?" }, ...caseState.questions].slice(0, 5);
  }
  const workflowStatus = document.querySelector(".chat-status small");
  if (workflowStatus) { workflowStatus.className = "workflow-state"; workflowStatus.textContent = `${investigationProgress()} · โหมดทดสอบภาคสนาม`; }
  const freeText = caseState.userText;
  const stateLabel = caseState.candidates.length ? (caseState.candidates.some((item) => item.contradictions.length) ? "พบข้อมูลที่ขัดแย้ง" : "มีองค์ความรู้ที่เกี่ยวข้องหลายหัวข้อ") : "ข้อมูลยังไม่พอ";
  const failed = observations.includes("failed_control");
  output.innerHTML = `<article class="message assistant-message"><span class="avatar">SP</span><div class="investigation-response"><div class="response-heading"><div><p class="eyebrow">จากเงื่อนไขที่ตรวจพบ</p><h2>${stateLabel}</h2></div><span class="status-pill">ยังไม่ยืนยันสาเหตุ</span></div><div class="investigation-grid"><section><h3>Observation ที่รู้จัก</h3><p>${observations.length ? observations.map((item) => escapeHtml(item.replaceAll("_", " "))).join(" · ") : "ยังไม่พบ cue ที่กำหนดไว้"}</p></section><section><h3>ข้อความผู้ใช้</h3><p>${escapeHtml(freeText)}</p></section><section class="missing"><h3>Missing Information</h3><p>${caseState.questions.length ? caseState.questions.map((item) => item.text).join(" · ") : "ยังต้องตรวจหลักฐานภาคสนามและทบทวนโดยมนุษย์"}</p></section><section><h3>Case outcome</h3><p>${stateLabel} · ต้องตรวจเพิ่ม · ไม่มี Diagnosis</p></section></div>${failed ? `<div class="failed-control"><strong>CONTROL FAILURE ≠ RESISTANCE</strong><p>ตรวจ identification · stage/timing · application · environment · reinfestation · registration/use-pattern · MoA history ก่อนตั้งสมมติฐาน resistance</p></div>` : ""}<h2 class="candidate-heading">หัวข้อที่ควรตรวจต่อ</h2><p class="ordering-note">เรียงตามจำนวน cue ที่กฎตรวจพบเพื่อการทำงานเท่านั้น ไม่ใช่ความน่าจะเป็นหรือความเชื่อมั่น</p><div class="candidate-list">${caseState.candidates.length ? caseState.candidates.map(renderCandidate).join("") : `<p>ไม่พบ Knowledge ที่รองรับเพียงพอ ข้อความเดิมยังคงแสดงโดยไม่ตีความเพิ่ม</p>`}</div>${renderEnvironmentalContext(caseState.candidates[0])}<p class="boundary-copy">Candidate Knowledge ไม่ใช่ Diagnosis · Supporting evidence ไม่พิสูจน์สาเหตุ · Missing/contradicting evidence ต้องตรวจต่อ</p></div></article>`;
  const candidateDetails = caseState.candidates.length ? caseState.candidates.map(renderCandidate).join("") : "<p>ยังไม่มี Candidate ที่ข้อมูลรองรับเพียงพอ</p>";
  const decisionDetails = renderDecisionGates(caseState.decision);
  const leadingGate = caseState.decision?.candidateGates.find((gate) => gate.identification === "PROVISIONAL_IDENTIFICATION") ?? caseState.decision?.candidateGates[0];
  const decisionSummary = leadingGate ? `<p><strong>Identification Gate:</strong> ${leadingGate.identification}</p><p>${leadingGate.identification === "PROVISIONAL_IDENTIFICATION" ? `ลักษณะที่พบสอดคล้องกับ ${escapeHtml(leadingGate.name)} ในระดับเบื้องต้น แต่ไม่ใช่การยืนยันสาเหตุ` : `ข้อมูลยังไม่พอสำหรับแยก ${escapeHtml(leadingGate.name)} · ยังขาด ${leadingGate.missing.map((item) => escapeHtml(item.label)).join(" · ") || "การทบทวนทางวิทยาศาสตร์"}`}</p>` : "";
  output.innerHTML = `<div class="message-timeline" data-message-timeline>${renderConversationHistory()}</div><article class="message assistant-message current-assistant"><span class="avatar">SP</span><div class="message-bubble"><p><strong>${caseState.lastAnswerUncertain ? "ไม่ต้องเดาครับ เราจะเก็บหลักฐานเพิ่ม" : "รับทราบครับ"}</strong></p><p>${investigationProgress()} · ${evidenceCompleteness()}</p>${failed ? `<p class="inline-warning"><strong>⚠️ CONTROL FAILURE ≠ RESISTANCE</strong><br>ต้องตรวจสาร เวลา วิธีใช้ สภาพแวดล้อม และการกลับเข้าทำลายก่อน โดยระบบไม่แนะนำให้เพิ่มอัตราใช้</p>` : ""}<button type="button" class="detail-trigger" data-detail-toggle>ดูรายละเอียดเคสและ Candidate</button></div></article><dialog class="case-detail-sheet" data-detail-sheet aria-label="รายละเอียดเคส"><button type="button" class="sheet-close" data-detail-close>ปิด</button><h2>รายละเอียดเคส</h2><p>${observations.length ? observations.map((item) => escapeHtml(item.replaceAll("_", " "))).join(" · ") : "ยังไม่มี Observation ที่รู้จัก"}</p><h3>Candidate Knowledge</h3><p class="ordering-note">ลำดับทำงาน ไม่ใช่ probability หรือ confidence</p><div class="candidate-list">${candidateDetails}</div>${renderEnvironmentalContext(caseState.candidates[0])}<p class="boundary-copy">Candidate Knowledge ≠ Diagnosis · Photo received ≠ Photo analyzed · Nearby ≠ Transmission</p></dialog>`;
  const assistantBubble = output.querySelector(".current-assistant .message-bubble");
  const chemicalHtml = window.SPChemicalSlice?.render(caseState.chemicalSlice) || "";
  if (chemicalHtml) assistantBubble?.insertAdjacentHTML("beforeend", chemicalHtml);
  assistantBubble?.querySelector(".detail-trigger")?.insertAdjacentHTML("beforebegin", decisionSummary);
  output.querySelector(".case-detail-sheet .boundary-copy")?.insertAdjacentHTML("beforebegin", decisionDetails);
  const nextAction = nextBestAction();
  const heading = questionPanel.querySelector("h2");
  const questionIntro = questionPanel.querySelectorAll("p")[1];
  if (questionIntro) questionIntro.textContent = "ตอบทีละ 1 จุด · ลำดับนี้เป็น workflow ไม่ใช่ความน่าจะเป็น";
  const submit = questionPanel.querySelector('button[type="submit"]');
  const skip = $("[data-skip]");
  if (nextAction.type === "ASK_QUESTION") {
    const control = guidedQuestionControls[nextAction.question.key] || { why: "คำตอบนี้ช่วยเติม Evidence gap ที่กำหนดไว้" };
    heading.textContent = "ขอเช็กเพิ่มอีก 1 จุดครับ";
    questionList.innerHTML = `${renderQuestionControl(nextAction.question)}<details class="question-why"><summary>ทำไมต้องถาม?</summary><p>${control.why}</p></details>`;
    submit.hidden = false;
    submit.textContent = "บันทึกคำตอบ";
    skip.hidden = false;
  } else {
    heading.textContent = nextAction.label;
    questionList.innerHTML = `<button type="button" class="button guided-primary-action" data-next-action="${nextAction.type}">${nextAction.action}</button>${nextAction.type === "REQUEST_LOCATION" ? '<button type="button" class="button secondary" data-next-action="SKIP_LOCATION">ยังไม่เพิ่ม</button>' : ""}`;
    submit.hidden = true;
    skip.hidden = true;
  }
  questionPanel.hidden = false;
  tools.hidden = false;
  $("[data-related-summary]").innerHTML = `<p><strong>${stateLabel}</strong></p><p>${caseState.candidates.map((item) => item.name).join(" · ") || "ยังไม่มี candidate"}</p>`;
  $("[data-case-label]").textContent = `CASE-${caseState.id}`;
  document.querySelectorAll("[data-correct-answer]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.correctAnswer;
    delete caseState.answerRecords[key];
    caseState.answers = Object.entries(caseState.answerRecords).map(([answerKey, record]) => `${answerKey}: ${record.value}`);
    caseState.conversationHistory = caseState.conversationHistory.filter((item) => item.questionKey !== key);
    caseState.lastAnswerUncertain = false;
    render();
    questionPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
  document.querySelectorAll("[data-next-action]").forEach((button) => button.addEventListener("click", () => handleNextAction(button.dataset.nextAction)));
  const detailSheet = $("[data-detail-sheet]");
  $("[data-detail-toggle]")?.addEventListener("click", () => detailSheet?.showModal());
  $("[data-detail-close]")?.addEventListener("click", () => detailSheet?.close());
  const distanceFromLatest = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
  jumpLatest.hidden = distanceFromLatest < 280;
  jumpLatest.classList.toggle("active-case-jump", Boolean(caseState));
  document.querySelectorAll(".timestamp-toggle").forEach((button) => button.addEventListener("click", () => {
    const time = button.nextElementSibling;
    time.hidden = !time.hidden;
    button.setAttribute("aria-expanded", String(!time.hidden));
  }));
  document.querySelectorAll("[data-recovery-choice]").forEach((button) => button.addEventListener("click", () => {
    const value = button.dataset.recoveryChoice;
    caseState.conversationHistory.push({ role: "USER · STRUCTURED ANSWER", type: "USER_STRUCTURED_ANSWER", text: value, replyTo: caseState.inputRecovery.prompt, timestamp: new Date().toISOString() });
    caseState.userText += ` ${value}`;
    caseState.recoveryResolved = true;
    render();
  }));
  $("[data-recovery-confirm]")?.addEventListener("click", () => {
    caseState.conversationHistory.push({ role: "USER · STRUCTURED ANSWER", type: "USER_STRUCTURED_ANSWER", text: "ยืนยันข้อมูลตามข้อความเดิม", replyTo: caseState.inputRecovery.prompt, timestamp: new Date().toISOString() });
    caseState.recoveryResolved = true;
    render();
  });
  document.querySelectorAll("[data-recovery-edit]").forEach((button) => button.addEventListener("click", () => setComposerExpanded(true, { focus: true })));
}

function handleNextAction(action) {
  if (!caseState) return;
  if (action === "START_PHOTO_MISSION") { caseState.lastAnswerUncertain = false; caseState.conversationHistory.push({ role: "SYSTEM / EVIDENCE", text: "เปิด Guided Photo Mission · Photo received ≠ Photo analyzed" }); createPhotoMission(); return; }
  if (action === "REQUEST_FIELD_CONTEXT") { caseContextPanel.hidden = false; renderCaseContext(); caseContextPanel.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  if (action === "REQUEST_LOCATION") { caseContextPanel.hidden = false; renderCaseContext(); $("[data-location-request]").focus(); caseContextPanel.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  if (action === "SKIP_LOCATION") { caseState.conversationHistory.push({ role: "USER", text: "ยังไม่เพิ่มตำแหน่ง" }); caseState.location.status = "deferred"; handleNextAction("START_PHOTO_MISSION"); return; }
  if (action === "OFFER_WEATHER_CONTEXT") { weatherSection.hidden = false; weatherSection.scrollIntoView({ behavior: "smooth", block: "start" }); $("[data-weather-request]").focus(); return; }
  if (action === "OFFER_NEARBY_FIELD") { fieldWatch.hidden = false; fieldWatch.scrollIntoView({ behavior: "smooth", block: "start" }); $("[data-field-watch-run]").focus(); return; }
  if (action === "REQUEST_EXPERT_HANDOFF") { $("[data-escalate]").click(); return; }
}

function collapseComposerAfterKnowledge() { setComposerExpanded(false); }

function startCase() {
  const text = problem.value.trim();
  if (!text) return problem.focus();
  if (window.SPKnowledgeQA?.isKnowledgeQuery(text)) {
    window.SPKnowledgeQA.ask(text);
    problem.value = "";
    updateSendState();
    collapseComposerAfterKnowledge();
    return;
  }
  if (caseState) {
    caseState.userText += ` ${text}`;
    caseState.conversationHistory.push({ role: "USER", type: "USER_TEXT", text });
    caseState.conversationHistory.push({ role: "SP ASSISTANT", type: "ASSISTANT_MESSAGE", text: "รับข้อมูลเพิ่มเติมแล้วครับ" });
    commitPendingImages();
    problem.value = "";
    render();
    setComposerExpanded(false);
    requestAnimationFrame(() => questionPanel.scrollIntoView({ behavior: "smooth", block: "end" }));
    return;
  }
  caseState = { id: String(Date.now()).slice(-6), createdAt: new Date().toISOString(), userText: text, answers: [], answerRecords: {}, conversationHistory: [{ role: "USER", text }, { role: "SP ASSISTANT", text: "รับข้อมูลแล้วครับ" }], lastAnswerUncertain: false, observations: [], candidates: [], questions: [], managementViewed: false, guidedObservations: [], photoMission: null, weatherContext: null, environmentalComparison: null, nearbyFieldWatch: null, surveillanceOriginCase: null, inspectionReason: null, field: { identity: "", locality: "", district: "", province: "", areaNotes: "" }, location: { status: "empty", latitude: null, longitude: null, accuracy: null, capturedAt: null, source: null }, observationTime: { value: null, source: null }, firstNoticed: { category: "unknown", date: null }, cropContext: { crop: "rice", variety: "", age: "", growthStage: "", waterCondition: "", notes: "" } };
  $("[data-user-message]").textContent = text;
  $("[data-empty-intro]").hidden = true;
  stream.hidden = false;
  commitPendingImages();
  document.querySelector(".mobile-nav")?.classList.add("active-case-nav");
  composer?.classList.add("active-case-composer");
  problem.value = "";
  render();
  setComposerExpanded(false);
  weatherSection.hidden = true;
  fieldWatch.hidden = true;
  stream.scrollIntoView({ behavior: "smooth", block: "start" });
  jumpLatest.hidden = true;
}

$("[data-submit]")?.addEventListener("click", startCase);
const sendButton = $("[data-submit]");
const updateSendState = () => { if (sendButton) sendButton.disabled = !problem?.value.trim(); };
const resizeComposerText = () => {
  if (!problem || !composerExpanded) return;
  problem.style.setProperty("height", "48px", "important");
  problem.style.setProperty("height", `${Math.min(problem.scrollHeight, 112)}px`, "important");
  problem.style.overflowY = problem.scrollHeight > 112 ? "auto" : "hidden";
};
problem?.addEventListener("focus", () => { setComposerExpanded(true); requestAnimationFrame(resizeComposerText); });
problem?.addEventListener("input", () => { updateSendState(); updateComposerSummary(); resizeComposerText(); });
problem?.addEventListener("keydown", (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); startCase(); updateSendState(); } });
updateSendState();
$("[data-question-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!caseState) return;
  const selected = event.currentTarget.querySelector('[name="guided-answer"]:checked') || event.currentTarget.querySelector('select[name="guided-answer"]') || event.currentTarget.querySelector('input[name="guided-answer"]');
  if (!selected || !selected.value.trim()) { selected?.focus(); return; }
  const key = selected.dataset.questionKey;
  const value = key === "rice_age" ? `${selected.value.trim()} วัน` : selected.value.trim();
  caseState.answerRecords[key] = { value, answeredAt: new Date().toISOString(), source: "structured_user_answer" };
  caseState.answers = Object.entries(caseState.answerRecords).map(([answerKey, record]) => `${answerKey}: ${record.value}`);
  caseState.lastAnswerUncertain = ["ไม่แน่ใจ", "unknown"].includes(value);
  caseState.conversationHistory.push({ role: "USER · STRUCTURED ANSWER", type: "USER_STRUCTURED_ANSWER", text: value, questionKey: key, replyTo: caseState.questions.find((item) => item.key === key)?.text, timestamp: new Date().toISOString() });
  caseState.conversationHistory.push({ role: "SP ASSISTANT", text: caseState.lastAnswerUncertain ? "รับทราบครับ ไม่ต้องเดา เราจะใช้การสังเกตหรือภาพช่วยตรวจต่อ" : "รับทราบครับ" });
  render();
  questionPanel.scrollIntoView({ behavior: "smooth", block: "center" });
});
$('[data-question-form]')?.addEventListener("change", (event) => {
  if (event.target.matches('input[type="radio"][name="guided-answer"]')) event.currentTarget.requestSubmit();
});
$("[data-skip]")?.addEventListener("click", () => {
  if (!caseState?.questions[0]) return;
  const key = caseState.questions[0].key;
  caseState.answerRecords[key] = { value: "skipped", answeredAt: new Date().toISOString(), source: "user_deferred" };
  caseState.answers = Object.entries(caseState.answerRecords).map(([answerKey, record]) => `${answerKey}: ${record.value}`);
  caseState.conversationHistory.push({ role: "USER · STRUCTURED ANSWER", type: "USER_STRUCTURED_ANSWER", text: "ข้ามตอนนี้", questionKey: key, replyTo: caseState.questions[0].text, timestamp: new Date().toISOString() });
  caseState.lastAnswerUncertain = false;
  render();
});
document.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
  problem.value = button.dataset.example;
  updateSendState();
  if (button.closest(".starter-replies")) startCase(); else problem.focus();
}));
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
  caseState.conversationHistory.push({ role: "SYSTEM / EVIDENCE", text: "อัปเดตข้อมูลแปลงและเวลาสังเกตแล้ว" });
  renderCaseContext();
  render();
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
    caseState.conversationHistory.push({ role: "SYSTEM / EVIDENCE", text: "เพิ่มตำแหน่งจากอุปกรณ์แล้ว · ไม่มีการติดตามต่อเนื่อง" });
    render();
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

const WEATHER_VARIABLES = ["relative_humidity_2m", "precipitation", "wind_speed_10m", "wind_direction_10m", "soil_moisture_0_to_7cm"];
const WEATHER_TO_KNOWLEDGE = {
  relative_humidity: "relative_humidity_2m",
  rainfall: "precipitation",
  wind_speed: "wind_speed_10m",
  wind_direction: "wind_direction_10m",
  soil_moisture: "soil_moisture_0_to_7cm",
};

function closestWeatherIndex(times, target) {
  const targetMs = new Date(target).getTime();
  return times.reduce((best, value, index) => Math.abs(new Date(value).getTime() - targetMs) < Math.abs(new Date(times[best]).getTime() - targetMs) ? index : best, 0);
}

function renderWeatherContext() {
  if (!caseState?.weatherContext) return;
  const context = caseState.weatherContext;
  const comparison = caseState.environmentalComparison;
  const labels = { relative_humidity_2m: "ความชื้นสัมพัทธ์", precipitation: "ฝนในชั่วโมงก่อนหน้า", wind_speed_10m: "ความเร็วลม", wind_direction_10m: "ทิศทางลม", soil_moisture_0_to_7cm: "ความชื้นดิน 0–7 ซม." };
  const observations = Object.entries(context.variables).map(([key, item]) => `<li>${labels[key] || key}: <strong>${item.value == null ? "ไม่มีข้อมูล" : `${escapeHtml(item.value)} ${escapeHtml(item.unit)}`}</strong></li>`).join("");
  const relevant = comparison.relevantVariables.length ? comparison.relevantVariables.map((key) => `<li>${labels[WEATHER_TO_KNOWLEDGE[key]] || key} — ${comparison.availableVariables.includes(key) ? "มีข้อมูลบางส่วนที่เกี่ยวข้อง" : "ตัวแปรไม่มีข้อมูล"}</li>`).join("") : "<li>ไม่มีตัวแปรที่ Knowledge ปัจจุบันรองรับเพียงพอ</li>";
  const manual = [caseState.cropContext.waterCondition, ...caseState.guidedObservations.filter((item) => item.missionStep === "environment").map((item) => item.value)].filter(Boolean).join(" · ") || "ยังไม่มี";
  weatherResult.hidden = false;
  weatherResult.innerHTML = `<h3>สรุป</h3><p>${comparison.supportedContext}</p><p><strong>เวลาอ้างอิง:</strong> ${escapeHtml(context.matchedTime)} (${escapeHtml(context.timezone)})</p><h3>Weather Data · Weather provider</h3><ul>${observations}</ul><p><strong>ผู้ใช้สังเกตในแปลง · USER:</strong> ${escapeHtml(manual)}</p><h3>Governed Environmental Knowledge · CANONICAL KNOWLEDGE</h3><p>${escapeHtml(comparison.candidateName || "ไม่มี Candidate")}</p><ul>${relevant}</ul><h3>System Comparison</h3><p>${comparison.supportedContext} · เป็นการตรวจว่ามีตัวแปรหรือไม่ ไม่ใช้ threshold และไม่ใช่ Diagnosis หรือ Recommendation</p><h3>ควรตรวจต่อ</h3><p>ตรวจรูปแบบอาการ อวัยวะที่มีอาการ และหลักฐานตาม Photo Mission</p><details><summary>แหล่งข้อมูลและข้อจำกัด</summary><p>Provider: ${context.provider} · product: ${context.product} · retrieved_at: ${context.retrievedAt}</p><p>Target: ${context.targetLocation.latitude}, ${context.targetLocation.longitude} · observation_time: ${escapeHtml(context.targetTime)} · timezone: ${escapeHtml(context.timezone)}</p><p>Data class: ${context.dataClass} · resolution: ${context.resolution} · hourly temporal resolution</p><p>Device GPS accuracy ±${Math.round(caseState.location.accuracy)} m ≠ weather grid resolution. ข้อมูลนี้ไม่ใช่เซนเซอร์ที่กอข้าวจุดนี้</p><p>${context.limitations.join(" · ")}</p><p>Attribution: Weather data by Open-Meteo; underlying models credited by provider.</p></details>`;
}

async function requestWeatherContext() {
  if (!caseState) return;
  if (caseState.location.status !== "captured") { weatherStatus.textContent = "ต้องใช้พิกัดจากอุปกรณ์ — ระบบจะไม่สร้างพิกัดจากชื่อสถานที่"; return; }
  if (!caseState.observationTime.value) { weatherStatus.textContent = "ต้องบันทึกเวลาที่ตรวจแปลงก่อน"; return; }
  const target = new Date(caseState.observationTime.value);
  if (Number.isNaN(target.getTime()) || target.getTime() > Date.now()) { weatherStatus.textContent = "เวลาที่ตรวจแปลงไม่ถูกต้องหรืออยู่ในอนาคต — ไม่ใช้ Forecast แทน Observation"; return; }
  const today = new Date();
  const localDate = caseState.observationTime.value.slice(0, 10);
  const todayDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const historical = localDate < todayDate;
  const endpoint = historical ? "https://archive-api.open-meteo.com/v1/archive" : "https://api.open-meteo.com/v1/forecast";
  const query = new URLSearchParams({ latitude: String(caseState.location.latitude), longitude: String(caseState.location.longitude), start_date: localDate, end_date: localDate, hourly: WEATHER_VARIABLES.join(","), timezone: "auto", wind_speed_unit: "kmh", precipitation_unit: "mm" });
  weatherStatus.textContent = "กำลังดึงข้อมูลอากาศ — ส่งเฉพาะพิกัด วันที่ timezone และตัวแปรที่ระบุ";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${endpoint}?${query}`, { method: "GET", signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer" });
    if (!response.ok) throw new Error(`weather provider ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.hourly?.time) || !data.hourly.time.length) throw new Error("incomplete weather response");
    const index = closestWeatherIndex(data.hourly.time, caseState.observationTime.value);
    const variables = Object.fromEntries(WEATHER_VARIABLES.map((key) => [key, { rawValue: data.hourly[key]?.[index] ?? null, value: data.hourly[key]?.[index] ?? null, unit: data.hourly_units?.[key] ?? "unavailable" }]));
    caseState.weatherContext = { provider: "Open-Meteo", product: historical ? "Historical Weather API / Best Match" : "Forecast API / same-day hourly context", targetLocation: { latitude: caseState.location.latitude, longitude: caseState.location.longitude }, targetTime: caseState.observationTime.value, matchedTime: data.hourly.time[index], retrievedAt: new Date().toISOString(), timezone: data.timezone || "provider did not return timezone", dataClass: historical ? "gridded reanalysis/model-derived historical data" : "gridded forecast/model-derived same-day data", resolution: historical ? "Best Match: 9 km from 2017; older periods may use 0.1° or 0.25° grids" : "provider-selected forecast model grid; model-dependent", variables, limitations: ["grid/model values are not an on-field sensor reading", "precipitation is the preceding-hour sum", "same-day data may be forecast/model-derived", "soil moisture may be unavailable for some models"] };
    const candidate = caseState.candidates[0];
    const relevantVariables = governedWeatherVariables[candidate?.key] ?? [];
    const availableVariables = relevantVariables.filter((key) => variables[WEATHER_TO_KNOWLEDGE[key]]?.value != null);
    const unavailableVariables = relevantVariables.filter((key) => !availableVariables.includes(key));
    caseState.environmentalComparison = { candidate: candidate?.key ?? null, candidateName: candidate?.name ?? null, relevantVariables, availableVariables, unavailableVariables, supportedContext: relevantVariables.length === 0 ? "ไม่มีตัวแปรที่ Knowledge ปัจจุบันรองรับเพียงพอ" : availableVariables.length ? "มีข้อมูลบางส่วนที่เกี่ยวข้อง" : "ยังประเมินไม่ได้จากข้อมูลที่มี", evidenceReferences: candidate ? [environmentalProfiles[candidate.key]?.evidence].filter(Boolean) : [] };
    weatherStatus.textContent = "ดึงข้อมูลแล้ว — การตรวจสอบเคสส่วนอื่นยังทำงานแยกกัน";
    renderWeatherContext();
  } catch (error) {
    weatherStatus.textContent = error.name === "AbortError" ? "หมดเวลารอผู้ให้บริการ — เคสยังใช้งานต่อได้" : "ไม่สามารถดึงข้อมูลอากาศได้ — เคสยังใช้งานต่อได้";
  } finally { clearTimeout(timer); }
}

$("[data-weather-request]")?.addEventListener("click", requestWeatherContext);

function haversineDistanceKm(from, to) {
  const earthRadiusKm = 6371.0088;
  const radians = (degrees) => degrees * Math.PI / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatGeometricDistance(distanceKm) {
  return distanceKm < 1 ? `ประมาณ ${Math.round(distanceKm * 1000)} เมตร` : `ประมาณ ${Math.round(distanceKm * 10) / 10} กม.`;
}

function formatTimeSeparation(first, second) {
  const hours = Math.abs(new Date(first).getTime() - new Date(second).getTime()) / 3600000;
  if (hours < 24) return `ห่างกันประมาณ ${Math.round(hours)} ชั่วโมง`;
  const days = Math.round(hours / 24);
  return days < 14 ? `ห่างกันประมาณ ${days} วัน` : `ห่างกันประมาณ ${Math.round(days / 7)} สัปดาห์`;
}

function compareDemoCase(demoCase) {
  const currentKeys = caseState.candidates.map((item) => item.key);
  const sharedCandidates = demoCase.candidates.filter((key) => currentKeys.includes(key));
  const sameCrop = caseState.cropContext.crop === demoCase.crop;
  const pathwayRecords = sharedCandidates.map((key) => governedSpatialPathways[key]).filter((item) => item?.category);
  const currentLocation = { latitude: caseState.location.latitude, longitude: caseState.location.longitude };
  const distanceKm = haversineDistanceKm(currentLocation, demoCase);
  const reasons = ["คำนวณระยะเชิงเรขาคณิตจากพิกัดด้วย Haversine", `เวลาสังเกต ${formatTimeSeparation(caseState.observationTime.value, demoCase.observationTime)}`];
  if (sameCrop) reasons.push("บริบทพืชเป็นข้าวเหมือนกัน");
  if (sharedCandidates.length) reasons.push("มี governed Candidate Knowledge subject ร่วมกัน");
  if (pathwayRecords.length) reasons.push(`มี governed pathway context: ${pathwayRecords.map((item) => item.category).join(" · ")}`);
  if (caseState.weatherContext && demoCase.weatherContext) reasons.push("ทั้งสองเคสมี weather/environment context ที่แยก provenance แล้ว");
  const surveillanceState = sharedCandidates.length && sameCrop ? "ควรตรวจพื้นที่ใกล้เคียงเพิ่มเติม" : sameCrop || pathwayRecords.length ? "มีบริบทบางส่วนที่เกี่ยวข้อง" : currentKeys.length ? "ข้อมูลยังไม่พอสำหรับเชื่อมโยง" : "ไม่พบ Knowledge ที่รองรับการเชื่อมโยงเชิงพื้นที่";
  return { ...demoCase, distanceKm, timeSeparation: formatTimeSeparation(caseState.observationTime.value, demoCase.observationTime), sameCrop, sharedCandidates, pathwayRecords, surveillanceState, reasons, limitations: ["สถานะของทุกเคสยังไม่ยืนยันโรค", "ระยะใกล้กันไม่ยืนยันการแพร่ระหว่างแปลง", "ไม่มีหลักฐานกำหนดรัศมีการแพร่", "shared Candidate ไม่ใช่ shared Diagnosis", "vector presence ไม่เท่ากับ infective vector"] };
}

function renderNearbyFieldWatch(records, technicalSearchDistance) {
  fieldWatchResults.hidden = false;
  const currentCandidateNames = caseState.candidates.map((item) => item.name).join(" · ") || "ยังไม่มี Candidate";
  const cards = records.map((record) => {
    const overlap = record.sharedCandidates.map((key) => candidates.find((item) => item.key === key)?.name || key).join(" · ") || "ไม่มี Candidate ร่วม";
    const pathways = record.pathwayRecords.map((item) => `${item.category} (${item.evidence.join(" · ")})`).join(" · ") || "ไม่มี pathway ที่ governed Knowledge รองรับสำหรับการเทียบนี้";
    const demoWeather = record.weatherContext ? `${record.weatherContext.provenance}: ${Object.entries(record.weatherContext).filter(([key]) => !["provenance", "unit"].includes(key)).map(([key, value]) => `${key}=${value} ${record.weatherContext.unit}`).join(" · ")}` : "ไม่มีข้อมูลอากาศจำลอง";
    return `<article class="watch-card"><p class="eyebrow">DEMO NEARBY CASE · ${record.id}</p><h3>${record.fieldLabel}</h3><p class="demo-badge">ข้อมูลจำลองสำหรับทดสอบระบบ</p><p class="watch-state"><strong>${record.surveillanceState}</strong></p><dl><dt>ระยะเชิงเรขาคณิต</dt><dd>${formatGeometricDistance(record.distanceKm)}</dd><dt>เวลาที่สังเกต</dt><dd>${escapeHtml(record.observationTime)} · ${record.timeSeparation}</dd><dt>พืช/ระยะ</dt><dd>${escapeHtml(record.crop)} · ${escapeHtml(record.cropAge)} · ${escapeHtml(record.growthStage)}</dd><dt>Observation</dt><dd>${record.observations.map(escapeHtml).join(" · ")}</dd><dt>Candidate overlap</dt><dd>${escapeHtml(overlap)}</dd><dt>Pathway context</dt><dd>${escapeHtml(pathways)}</dd><dt>Environment</dt><dd>${escapeHtml(demoWeather)}</dd><dt>Status</dt><dd>${escapeHtml(record.status)} · ${escapeHtml(record.confirmationState)}</dd></dl><h4>เหตุผลที่แสดง</h4><ul>${record.reasons.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><p><strong>สิ่งที่ควรตรวจ:</strong> อวัยวะเดียวกัน รูปแบบการกระจาย ประชากรแมลงพาหะเมื่อ Knowledge รองรับ และหลักฐานตาม Photo Mission</p><details><summary>พิกัดและข้อจำกัด</summary><p>Fixture coordinates: ${record.latitude}, ${record.longitude} · provenance=${record.provenance}</p><ul>${record.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details><button type="button" class="button secondary" data-start-surveillance-case="${record.id}">เริ่มตรวจแปลงนี้</button></article>`;
  }).join("");
  fieldWatchResults.innerHTML = `<section class="watch-summary"><p class="eyebrow">CURRENT CASE</p><h3>CASE-${caseState.id}</h3><p>พิกัดจากอุปกรณ์ · เวลาสังเกต ${escapeHtml(caseState.observationTime.value)} · rice · ${escapeHtml(currentCandidateNames)}</p><p>พบ ${records.length} เคสในรายการค้นหา${technicalSearchDistance == null ? "ทั้งหมด" : `ภายในระยะค้นหาเพื่อการแสดงผล ${technicalSearchDistance} กม.`} จำนวนนี้เป็นเพียงจำนวนระเบียน ไม่ใช่ prevalence หรือ outbreak</p></section><div class="watch-list">${cards || "<p>ไม่มีระเบียนจำลองภายในตัวกรองการแสดงผลที่ผู้ใช้กำหนด</p>"}</div><p class="boundary-copy">NEARBY ≠ RELATED · RELATED ≠ TRANSMISSION · CASE CLUSTER ≠ OUTBREAK · ระบบไม่ได้ยืนยันการแพร่ระหว่างเคส</p>`;
  document.querySelectorAll("[data-start-surveillance-case]").forEach((button) => button.addEventListener("click", () => startSurveillanceCase(button.dataset.startSurveillanceCase)));
}

function runNearbyFieldWatch() {
  if (!caseState) return;
  if (caseState.location.status !== "captured") { fieldWatchStatus.textContent = "ต้องมีพิกัดจากอุปกรณ์ใน CURRENT CASE — ไม่สร้างพิกัดจากชื่อสถานที่"; return; }
  if (!caseState.observationTime.value) { fieldWatchStatus.textContent = "ต้องบันทึก FIELD OBSERVATION TIME ก่อน"; return; }
  const rawDistance = $("[data-watch-distance]").value.trim();
  const technicalSearchDistance = rawDistance ? Number(rawDistance) : null;
  if (technicalSearchDistance != null && (!Number.isFinite(technicalSearchDistance) || technicalSearchDistance <= 0)) { fieldWatchStatus.textContent = "ระยะค้นหาเพื่อการแสดงผลต้องมากกว่า 0"; return; }
  const compared = demoFieldCases.map(compareDemoCase).filter((item) => technicalSearchDistance == null || item.distanceKm <= technicalSearchDistance).sort((a, b) => a.distanceKm - b.distanceKm);
  caseState.nearbyFieldWatch = { comparedAt: new Date().toISOString(), technicalSearchDistance, method: "Haversine · Earth mean radius 6371.0088 km", fixtureProvenance: "demo_fixture", records: compared.map(({ id, distanceKm, timeSeparation, sharedCandidates, surveillanceState }) => ({ id, distanceKm, timeSeparation, sharedCandidates, surveillanceState })) };
  fieldWatchStatus.textContent = `เปรียบเทียบแล้ว ${compared.length} ระเบียน · ระยะค้นหาเป็นตัวกรองการแสดงผล ไม่ใช่ biological radius`;
  renderNearbyFieldWatch(compared, technicalSearchDistance);
}

function startSurveillanceCase(demoId) {
  const origin = caseState;
  const demoCase = demoFieldCases.find((item) => item.id === demoId);
  if (!origin || !demoCase) return;
  problem.value = `เหตุผลที่เข้าตรวจ: เฝ้าระวังพื้นที่ใกล้เคียง · ตรวจสภาพแปลงและบันทึก Observation โดยไม่กำหนด Diagnosis`;
  startCase();
  caseState.surveillanceOriginCase = { caseId: `CASE-${origin.id}`, relation: "surveillance prompted by", meaning: "operational provenance only; does not imply transmission" };
  caseState.inspectionReason = "เฝ้าระวังพื้นที่ใกล้เคียง";
  caseState.field.identity = demoCase.fieldLabel;
  caseState.location = { status: "captured", latitude: demoCase.latitude, longitude: demoCase.longitude, accuracy: null, capturedAt: new Date().toISOString(), source: "demo_fixture_seed" };
  caseState.cropContext = { crop: demoCase.crop, variety: "", age: demoCase.cropAge, growthStage: demoCase.growthStage, waterCondition: "", notes: "" };
  caseState.observationTime = { value: null, source: null };
  renderCaseContext();
  fieldWatchStatus.textContent = "เริ่ม CURRENT CASE ใหม่จากเหตุผลเฝ้าระวังแล้ว · ยังไม่มี Diagnosis · กรุณาบันทึกเวลาตรวจจริง";
  fieldWatchResults.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("[data-field-watch-run]")?.addEventListener("click", runNearbyFieldWatch);

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
  $("[data-mission-image]")?.addEventListener("change", (event) => { const files = [...(event.currentTarget.files ?? [])].filter((file) => file.type.startsWith("image/")); files.forEach((file) => { selectedImages.push({ file, url: URL.createObjectURL(file), missionStep: step.key }); step.imageIndexes.push(selectedImages.length - 1); }); if (files.length) caseState.conversationHistory.push({ role: "SYSTEM / EVIDENCE", text: `ได้รับภาพแล้ว ${files.length} ภาพ · อยู่ใน browser ชั่วคราว · Photo received ≠ Photo analyzed` }); event.currentTarget.value = ""; renderImages(); renderMission(); });
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
  const pendingImages = selectedImages.filter((item) => item.pending !== false);
  pendingImages.forEach((item, index) => { const wrapper = document.createElement("div"); wrapper.className = "image-preview"; const image = document.createElement("img"); image.src = item.url; image.alt = `รูปที่เลือก ${index + 1}: ${item.file.name}`; const remove = document.createElement("button"); remove.type = "button"; remove.className = "image-remove"; remove.textContent = "×"; remove.setAttribute("aria-label", `นำรูป ${item.file.name} ออก`); remove.addEventListener("click", () => { URL.revokeObjectURL(item.url); selectedImages = selectedImages.filter((candidate) => candidate !== item); renderImages(); }); wrapper.append(image, remove); previews.append(wrapper); });
  previews.hidden = pendingImages.length === 0; imageCount.hidden = pendingImages.length === 0; annotations.hidden = pendingImages.length === 0;
  imageCount.textContent = `เลือกรูปแล้ว ${pendingImages.length} รูป · อยู่ในเบราว์เซอร์ชั่วคราว`;
  updateComposerSummary();
}

function commitPendingImages() {
  if (!caseState) return;
  const pendingImages = selectedImages.filter((item) => item.pending !== false && !item.missionStep);
  pendingImages.forEach((item) => {
    caseState.conversationHistory.push({ role: "USER", type: "USER_IMAGE", text: item.file.name, imageUrl: item.url, timestamp: new Date().toISOString() });
    item.pending = false;
  });
  if (pendingImages.length) caseState.conversationHistory.push({ role: "SP ASSISTANT", type: "ASSISTANT_MESSAGE", text: "ได้รับรูปแล้วครับ รูปนี้ยังไม่ได้ถูกวิเคราะห์อัตโนมัติ · Photo received ≠ Photo analyzed", timestamp: new Date().toISOString() });
  renderImages();
}

imageInput?.addEventListener("change", () => {
  const files = [...(imageInput.files ?? [])].filter((file) => file.type.startsWith("image/"));
  const images = files.map((file) => ({ file, url: URL.createObjectURL(file), pending: true }));
  selectedImages.push(...images);
  imageInput.value = "";
  attachmentMenu.hidden = true;
  renderImages();
  if (images.length) setComposerExpanded(true);
});
$('[data-gallery-action]')?.addEventListener("click", () => imageInput?.click());
$('[data-camera-action]')?.addEventListener("click", () => imageInput?.click());
$('[data-attachment-field]')?.addEventListener("click", () => {
  attachmentMenu.hidden = true;
  if (caseState) handleNextAction("REQUEST_FIELD_CONTEXT"); else $("[data-field-toggle]")?.click();
});
$('[data-attachment-location]')?.addEventListener("click", () => {
  attachmentMenu.hidden = true;
  if (caseState) handleNextAction("REQUEST_LOCATION"); else $("[data-field-toggle]")?.click();
});
$('[data-attachment-time]')?.addEventListener("click", () => {
  attachmentMenu.hidden = true;
  if (caseState) handleNextAction("REQUEST_FIELD_CONTEXT"); else $("[data-field-toggle]")?.click();
});
annotations?.addEventListener("change", () => { updateComposerSummary(); if (caseState) render(); });

let lastComposerScrollY = window.scrollY;
window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  const readingOlderMessages = currentScrollY < lastComposerScrollY - 24;
  const activelyEditing = composer?.contains(document.activeElement) || Date.now() - composerInteractionAt < 800;
  if (composerExpanded && readingOlderMessages && !activelyEditing) setComposerExpanded(false);
  if (caseState) jumpLatest.hidden = document.documentElement.scrollHeight - currentScrollY - window.innerHeight < 280;
  lastComposerScrollY = currentScrollY;
}, { passive: true });

function togglePanel(buttonSelector, panelSelector, html) { const button = $(buttonSelector); const panel = $(panelSelector); button?.addEventListener("click", () => { panel.hidden = !panel.hidden; button.setAttribute("aria-expanded", String(!panel.hidden)); if (!panel.hidden) panel.innerHTML = html; }); }
togglePanel("[data-management-toggle]", "[data-management-panel]", `<div class="gated-panel"><h3>แนวทางจัดการที่มีข้อมูลรองรับ</h3><p>แสดงหลัง Investigation context เท่านั้น: Monitoring · Prevention · Cultural · Mechanical/Physical · Biological/Natural Enemy · Chemical Context · Follow-up</p><p>Management Option ไม่ใช่ Recommendation</p><a href="../knowledge-explorer/crop-protection-management.html">เปิด Management Knowledge →</a></div>`);
togglePanel("[data-moa-toggle]", "[data-moa-panel]", `<div class="gated-panel"><h3>MoA authority context</h3><p>Active Ingredient → IRAC v11.5 / FRAC 2026 / HRAC 2026 → Authority + Version → Limitation</p><p>ไม่มีการเลือกสาร ไม่มี spray program และ registration ไม่ใช่ efficacy</p></div>`);
$("[data-management-toggle]")?.addEventListener("click", () => { if (caseState) caseState.managementViewed = true; });
$("[data-escalate]")?.addEventListener("click", () => { if (!caseState) return; const summary = $("[data-handoff-summary]"); const mission = caseState.photoMission; const completed = mission?.steps.filter((step) => step.status === "completed").length ?? 0; const skipped = mission?.steps.filter((step) => step.status === "skipped").length ?? 0; const locations = mission?.steps.map((step) => step.inspect).join(" · ") ?? "ยังไม่ได้ขอภารกิจ"; summary.hidden = false; summary.innerHTML = `<h2>สรุปสำหรับส่งต่อผู้เชี่ยวชาญ (local prototype)</h2><dl><dt>คำอธิบาย</dt><dd>${escapeHtml(caseState.userText)}</dd><dt>Observations</dt><dd>${caseState.observations.join(" · ") || "ไม่มี"}</dd><dt>รูป</dt><dd>${selectedImages.length} รูป · metadata/local preview only</dd><dt>คำตอบ</dt><dd>${caseState.answers.map(escapeHtml).join(" · ") || "ยังไม่มี"}</dd><dt>Candidates</dt><dd>${caseState.candidates.map((item) => item.name).join(" · ") || "ยังไม่มี"}</dd><dt>Evidence gaps</dt><dd>${caseState.questions.map((item) => item.text).join(" · ") || "ต้องทบทวนโดยผู้เชี่ยวชาญ"}</dd><dt>Contradictions</dt><dd>${caseState.candidates.flatMap((item) => item.contradictions).join(" · ") || "ยังไม่พบที่ระบุได้"}</dd><dt>Management viewed</dt><dd>${caseState.managementViewed ? "YES" : "NO"}</dd><dt>PHOTO MISSION</dt><dd>requested=${mission ? "YES" : "NO"} · completed=${completed} · skipped=${skipped} · images=${selectedImages.length}</dd><dt>User-confirmed observations</dt><dd>${caseState.guidedObservations.map((item) => item.value).join(" · ") || "ยังไม่มี"}</dd><dt>Inspection locations</dt><dd>${locations}</dd><dt>Unresolved observations</dt><dd>${mission?.steps.filter((step) => step.status === "pending").map((step) => step.title).join(" · ") || "ไม่มีที่ค้างในภารกิจ"}</dd></dl><p>ไม่มี binary image data และไม่มีการส่ง email หรือ notification จริง</p>`; summary.scrollIntoView({ behavior: "smooth" }); });
$("[data-escalate]")?.addEventListener("click", () => { if (!caseState) return; const summary = $("[data-handoff-summary]"); const spatial = document.createElement("section"); const coordinates = caseState.location.status === "captured" ? `${caseState.location.latitude}, ${caseState.location.longitude} · accuracy ±${Math.round(caseState.location.accuracy)} m · captured_at ${caseState.location.capturedAt}` : "not provided"; spatial.innerHTML = `<h3>FIELD CASE CONTEXT</h3><dl><dt>Field identity · User-provided</dt><dd>${escapeHtml(caseState.field.identity || "not provided")}</dd><dt>Human-readable location · User-provided</dt><dd>${escapeHtml([caseState.field.locality, caseState.field.district, caseState.field.province].filter(Boolean).join(" · ") || "not provided")}</dd><dt>Coordinates · Device-provided</dt><dd>${escapeHtml(coordinates)}</dd><dt>Observation time · User-provided</dt><dd>${escapeHtml(caseState.observationTime.value || "not provided")}</dd><dt>First noticed · User-provided</dt><dd>${escapeHtml(caseState.firstNoticed.date || caseState.firstNoticed.category)}</dd><dt>Crop context · User-provided</dt><dd>rice · ${escapeHtml(caseState.cropContext.variety || "variety not provided")} · ${escapeHtml(caseState.cropContext.age || "age not provided")} · ${escapeHtml(caseState.cropContext.growthStage || "stage not provided")} · ${escapeHtml(caseState.cropContext.waterCondition || "water not provided")}</dd><dt>Candidate Knowledge · System-derived</dt><dd>${caseState.candidates.map((item) => item.name).join(" · ") || "none"}</dd></dl><p>Field observation ≠ Canonical Knowledge · Case coordinate ≠ disease distribution · photo ≠ proof of location</p>`; summary.append(spatial); });
$("[data-new-case]")?.addEventListener("click", () => { selectedImages.forEach((item) => URL.revokeObjectURL(item.url)); selectedImages = []; caseState = null; stream.hidden = true; missionPanel.hidden = true; caseContextPanel.hidden = true; locationStatus.textContent = "ยังไม่ได้ระบุตำแหน่ง"; $("[data-empty-intro]").hidden = false; problem.value = ""; document.querySelector(".mobile-nav")?.classList.remove("active-case-nav"); composer?.classList.remove("active-case-composer"); renderImages(); setComposerExpanded(false); updateSendState(); });
$("[data-new-case]")?.addEventListener("click", () => { weatherSection.hidden = true; weatherResult.hidden = true; weatherResult.replaceChildren(); weatherStatus.textContent = "ต้องมีพิกัดและเวลาที่ตรวจแปลงก่อน"; fieldWatch.hidden = true; fieldWatchResults.hidden = true; fieldWatchResults.replaceChildren(); fieldWatchStatus.textContent = "ต้องมีพิกัดและเวลาที่ตรวจแปลงใน CURRENT CASE ก่อน"; $("[data-watch-distance]").value = ""; });

$("[data-escalate]")?.addEventListener("click", () => {
  if (!caseState?.weatherContext) return;
  const summary = $("[data-handoff-summary]");
  const context = caseState.weatherContext;
  const comparison = caseState.environmentalComparison;
  const weather = document.createElement("section");
  weather.innerHTML = `<h3>WEATHER CONTEXT</h3><dl><dt>Observation location · DEVICE</dt><dd>${context.targetLocation.latitude}, ${context.targetLocation.longitude} · GPS accuracy ±${Math.round(caseState.location.accuracy)} m</dd><dt>Observation time · USER</dt><dd>${escapeHtml(context.targetTime)}</dd><dt>Weather provider · WEATHER PROVIDER</dt><dd>${escapeHtml(context.provider)} · ${escapeHtml(context.product)} · ${escapeHtml(context.dataClass)} · ${escapeHtml(context.timezone)}</dd><dt>Weather observations · WEATHER PROVIDER</dt><dd>${Object.entries(context.variables).map(([key, item]) => `${escapeHtml(key)}=${escapeHtml(item.value ?? "unavailable")} ${escapeHtml(item.unit)}`).join(" · ")}</dd><dt>Manual field environment · USER</dt><dd>${escapeHtml(caseState.cropContext.waterCondition || "not provided")}</dd><dt>Relevant variables · CANONICAL KNOWLEDGE</dt><dd>${comparison.relevantVariables.map(escapeHtml).join(" · ") || "none"} · ${comparison.evidenceReferences.map(escapeHtml).join(" · ") || "no candidate evidence"}</dd><dt>Environmental comparison · SYSTEM COMPARISON</dt><dd>${escapeHtml(comparison.supportedContext)}</dd><dt>Missing variables</dt><dd>${comparison.unavailableVariables.map(escapeHtml).join(" · ") || "none"}</dd><dt>Limitations</dt><dd>${context.limitations.map(escapeHtml).join(" · ")} · GPS accuracy ≠ weather grid resolution</dd></dl>`;
  summary.append(weather);
});

$("[data-escalate]")?.addEventListener("click", () => {
  if (!caseState?.nearbyFieldWatch) return;
  const watch = caseState.nearbyFieldWatch;
  const section = document.createElement("section");
  section.innerHTML = `<h3>NEARBY FIELD WATCH · BROWSER-LOCAL</h3><dl><dt>Current Case</dt><dd>CASE-${escapeHtml(caseState.id)} · ${escapeHtml(caseState.field.identity || "field not provided")}</dd><dt>Compared at</dt><dd>${escapeHtml(watch.comparedAt)}</dd><dt>Method</dt><dd>${escapeHtml(watch.method)}</dd><dt>Display search distance</dt><dd>${watch.technicalSearchDistance == null ? "not applied" : `${escapeHtml(watch.technicalSearchDistance)} km · technical record filter only`}</dd><dt>Demo Cases considered</dt><dd>${watch.records.map((item) => `${escapeHtml(item.id)} · ${formatGeometricDistance(item.distanceKm)} · ${escapeHtml(item.timeSeparation)} · candidate overlap=${item.sharedCandidates.map(escapeHtml).join("/") || "none"} · ${escapeHtml(item.surveillanceState)}`).join("<br>") || "none within display filter"}</dd><dt>Pathway/environment basis</dt><dd>Governed Sprint-071 context plus separately-provenanced Sprint-072 weather where available</dd><dt>Surveillance origin</dt><dd>${caseState.surveillanceOriginCase ? `${escapeHtml(caseState.surveillanceOriginCase.relation)} ${escapeHtml(caseState.surveillanceOriginCase.caseId)} · ${escapeHtml(caseState.surveillanceOriginCase.meaning)}` : "none"}</dd><dt>Inspection reason</dt><dd>${escapeHtml(caseState.inspectionReason || "nearby field comparison")}</dd><dt>Limitations</dt><dd>Nearby ≠ related · related ≠ transmission · shared Candidate ≠ Diagnosis · no biological radius · no outbreak inference</dd></dl><p><strong>ระบบไม่ได้ยืนยันการแพร่ระหว่างเคส</strong></p>`;
  $("[data-handoff-summary]").append(section);
});

window.addEventListener("pagehide", () => selectedImages.forEach((item) => URL.revokeObjectURL(item.url)));
