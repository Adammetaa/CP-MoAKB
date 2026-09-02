export const CONVERSATION_PRESENTATION_VERSION = "round-zero-natural-thai/v1";

export const FORBIDDEN_FIELD_CHAT_TERMS = Object.freeze([
  "PLANT_BASE_INSPECTION", "MORPHOLOGY", "SPATIAL_PATTERN", "WATER_CONTEXT",
  "FIELD_POSITION", "SUPPORTED_FOR_REVIEW", "INSUFFICIENT_FOR_NARROWING",
  "Step C", "Step D", "F1", "F2", "B1", "B2", "authority state",
  "candidate adjudication", "purpose state",
]);

const NATURAL_QUESTIONS = Object.freeze({
  PLANT_BASE_INSPECTION: "ช่วยดูโคนต้นบริเวณที่มีอาการเพิ่มอีกอย่างครับ ว่ามีสีเปลี่ยน เน่า หรือแตกต่างจากต้นปกติข้าง ๆ ไหม?",
  WATER_CONTEXT: "บริเวณที่มีอาการ น้ำลึกหรือขังต่างจากข้าวปกติข้าง ๆ ไหมครับ?",
  DEEPER_WATER_CONTEXT: "บริเวณที่มีอาการ น้ำลึกหรือขังต่างจากข้าวปกติข้าง ๆ ไหมครับ?",
  ROOT_COMPARISON: "ช่วยดูรากของต้นที่มีอาการเทียบกับต้นปกติข้าง ๆ แล้วบอกความต่างที่เห็นชัดหนึ่งอย่างได้ไหมครับ?",
  LESION_MORPHOLOGY_DETAIL: "รอยบนใบมีรูปทรง สีตรงกลาง หรือขอบรอยต่างจากใบปกติอย่างไรครับ?",
  TARGETED_DAMAGE_COUNT: "ช่วยสุ่มนับสิ่งที่พบตามจุดตรวจ แล้วบอกจำนวนพร้อมจำนวนต้นที่ตรวจได้ไหมครับ?",
  WATER_MEASUREMENT: "ช่วยวัดระดับน้ำตรงบริเวณที่มีอาการ แล้วบอกค่าที่วัดได้ไหมครับ?",
});

function hasForbiddenTerm(value) {
  const text = String(value ?? "").toLocaleUpperCase("en-US");
  return FORBIDDEN_FIELD_CHAT_TERMS.some((term) => text.includes(term.toLocaleUpperCase("en-US")));
}

export function containsForbiddenFieldChatTerm(value) { return hasForbiddenTerm(value); }

export function naturalQuestionForGuidance(guidance = {}) {
  const concept = String(guidance.evidence_concept ?? "").trim();
  if (guidance.inspection_domain === "VISUAL_EVIDENCE") return "ถ้ามีรูปที่เห็นจุดนี้ชัด ส่งเพิ่มได้ไหมครับ?";
  if (NATURAL_QUESTIONS[concept]) return NATURAL_QUESTIONS[concept];
  if (/WATER|น้ำ/iu.test(`${concept} ${guidance.what_to_inspect ?? ""}`)) return NATURAL_QUESTIONS.WATER_CONTEXT;
  if (/ROOT|ราก/iu.test(`${concept} ${guidance.what_to_inspect ?? ""}`)) return NATURAL_QUESTIONS.ROOT_COMPARISON;
  return "ช่วยตรวจบริเวณที่มีอาการเทียบกับต้นปกติข้าง ๆ แล้วบอกสิ่งที่เห็นต่างกันอย่างหนึ่งได้ไหมครับ?";
}

export function acknowledgementForFacts(explicitFacts = []) {
  const codes = new Set(explicitFacts.map((item) => item.governed_code));
  if (codes.has("YELLOWING") && codes.has("PATCH")) return "รับทราบครับ พบใบเหลืองเป็นหย่อมในบางบริเวณ";
  const understood = [];
  if (codes.has("YELLOWING")) understood.push("พบใบเหลือง");
  if (codes.has("PATCH")) understood.push("เป็นหย่อมในบางบริเวณ");
  if (codes.has("SCATTERED")) understood.push("กระจายหลายจุด");
  if (codes.has("UNIFORM")) understood.push("กระจายทั่วแปลง");
  if (codes.has("LOW_SPOT")) understood.push("อยู่ตรงจุดต่ำ");
  if (codes.has("DEEPER_WATER_CONTEXT")) understood.push("บริเวณนั้นมีน้ำต่างจากข้าง ๆ");
  return understood.length ? `รับทราบครับ ${understood.join(" และ ")}` : "รับทราบครับ บันทึกสิ่งที่เล่าไว้แล้ว";
}

export function composeNaturalFieldGuidance({ explicitFacts = [], guidance = {} } = {}) {
  const question = naturalQuestionForGuidance(guidance);
  const text = `${acknowledgementForFacts(explicitFacts)} ขอเช็กเพิ่มอีกอย่างเดียวครับ ${question}`;
  if (hasForbiddenTerm(text) || hasForbiddenTerm(question)) throw new Error("field chat presentation leaked governed vocabulary");
  return { text, question, presentation_version:CONVERSATION_PRESENTATION_VERSION };
}

export function naturalVisualReceipt({ automaticReadingAvailable = false } = {}) {
  return automaticReadingAvailable
    ? "เก็บภาพไว้แล้วครับ สิ่งที่ระบบมองเห็นยังรอคุณยืนยันหรือแก้ไขก่อนใช้เป็นข้อมูลของเคส"
    : "เก็บภาพไว้แล้วครับ ตอนนี้ภาพเป็นข้อมูลประกอบ แต่ยังไม่ได้ใช้ยืนยันสาเหตุ";
}
