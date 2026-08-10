import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = await readFile(resolve(root, "index.html"), "utf8");
const styles = await readFile(resolve(root, "assets", "styles.css"), "utf8");
const app = await readFile(resolve(root, "assets", "app.js"), "utf8");
const failures = [];

for (const required of [
  "SP Assistant", "วันนี้พบปัญหาอะไรในแปลง?", "เพิ่มรูปภาพ", "ข้อมูลแปลง", "เริ่มตรวจสอบ",
  "รุ่นทดลองนี้ยังไม่อัปโหลดหรือจัดเก็บรูปภาพ", "ข้อมูลที่ได้รับ", "สิ่งที่สังเกตได้",
  "ข้อมูลที่ยังขาด", "คำถาม", "องค์ความรู้ที่เกี่ยวข้อง", "ยังไม่สามารถยืนยันได้",
  "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ", "../knowledge-explorer/rice-disease-corpus.html",
  "โรคใบจุดสีน้ำตาล", "มหาวิทยาลัยเกษตรศาสตร์ หน้า 15–18", "<noscript>",
]) if (!html.includes(required)) failures.push(`index.html missing: ${required}`);

for (const prohibited of [
  "fetch(", "XMLHttpRequest", "WebSocket", "EventSource", "sendBeacon", "localStorage",
  "sessionStorage", "indexedDB", "FormData", "base64", "FileReader", "เป็นโรคใบจุดสีน้ำตาล",
  "Google Drive", "Supabase", "Firebase", "S3", "R2",
]) if (app.includes(prohibited)) failures.push(`app.js contains prohibited capability: ${prohibited}`);

for (const required of ["URL.createObjectURL", "URL.revokeObjectURL", "imageInput.value = \"\"", "pagehide"]) {
  if (!app.includes(required)) failures.push(`app.js missing local-image boundary: ${required}`);
}
for (const required of ["--green:#165c3b", "--gold:#d4a017", "min-height:46px", ":focus-visible", "@media(max-width:820px)", "prefers-reduced-motion"]) {
  if (!styles.includes(required)) failures.push(`styles.css missing design requirement: ${required}`);
}
if (/<form\b/i.test(html)) failures.push("index.html must not create a network-submittable form");
if (!html.includes('<html lang="th">') || !html.includes('content="noindex,nofollow"')) failures.push("Thai-first or indexing boundary missing");
if (failures.length) throw new Error(`SP Assistant verification failed:\n${failures.join("\n")}`);
console.log("SP Assistant verified: chat-first, local images, governed knowledge, no backend, Thai-first and mobile-safe");
