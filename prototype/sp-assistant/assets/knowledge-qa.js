(() => {
  "use strict";

  const STORAGE_KEY = "sp_assistant_spa_reviews_v1";
  const SCHEMA_VERSION = "1.0";
  const APP_VERSION = "sprint-098";
  const REVIEW_STATES = Object.freeze(["CORRECT", "PENDING_REVIEW", "SUPPORTED_CORRECTION", "REJECTED_CORRECTION", "SUPERSEDED"]);
  const context = { conversationId: crypto.randomUUID(), subject: null, lastAnswer: null, answers: new Map() };
  const sources = {
    irac: { authority: "IRAC", id: "GS-IRAC-MOA-11.5-001/v1", version: "11.5 / 2026-02", locator: "IRAC classification hierarchy", limitation: "MoA classification ≠ efficacy, suitability, registration or CTU authority" },
    frac: { authority: "FRAC", id: "GS-FRAC-MOA-2026-001/v1", version: "2026-05", locator: "FRAC Code List", limitation: "MoA classification ≠ field efficacy or treatment suitability" },
    hrac: { authority: "HRAC", id: "crop-protection-management-001", version: "2026", locator: "governed HRAC active ingredients", limitation: "classification ≠ product authorization" },
    doa: { authority: "Thai DOA", id: "GS-DOA-HAZARDOUS-REGISTRY-2568-001/v1", version: "2025-09-15", locator: "official registration rows", limitation: "registry identity/status does not contain crop × target × use fields" },
    doaUse: { authority: "Thai DOA", id: "GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1", version: "2023-12", locator: "rice / Brown Planthopper / pymetrozine 50% WG row", limitation: "guidance is not bound to a registration or approved label" },
  };
  const subjects = {
    thiamethoxam: { name: "thiamethoxam", thai: "ไทอะมีทอกแซม", category: "สารกำจัดแมลง", authority: "IRAC", group: "4A", mechanism: "nAChR competitive modulator; acts on the insect nicotinic acetylcholine-receptor neural process.", related: [{ name: "imidacloprid", relation: "SAME_MOA", group: "IRAC 4A" }], targets: [], products: [], evidence: [sources.irac] },
    pymetrozine: { name: "pymetrozine", thai: "ไพมีโทรซีน", category: "สารกำจัดแมลง", authority: "IRAC", group: "9B", mechanism: "Modulates chordotonal organs, disrupting sensory coordination and feeding-related behaviour; mechanism evidence does not establish field efficacy.", related: [], targets: ["เพลี้ยกระโดดสีน้ำตาล / Brown Planthopper"], products: [
      { trade: "ดามูซิน / Damuzin", formulation: "50% WG", registration: "1372-2565", registrationState: "CURRENT_RECORD_SUPPORTED", registrationLabel: "ปัจจุบัน", ctu: "PENDING", ctuLabel: "รอตรวจสอบ", registrant: "Nano Gold Co., Ltd.", importer: "Millennium Farm Co., Ltd.", distributor: "Chia Tai Co., Ltd.", issue: "2022-07-04", expiry: "2031-07-03", cancellation: "none recorded" },
      { trade: "เพลนั่ม 50 ดับบลิวจี / Plenum 50 WG", formulation: "50% WG", registration: "405-2555", registrationState: "EXPIRED", registrationLabel: "หมดอายุ", ctu: "NOT_ESTABLISHED", ctuLabel: "ยังไม่มีหลักฐาน", registrant: "Syngenta Crop Protection Co., Ltd.", importer: "not established", distributor: "not established", issue: "not shown here", expiry: "2024-03-22", cancellation: "none recorded" },
    ], evidence: [sources.irac, sources.doaUse, sources.doa] },
    tricyclazole: { name: "tricyclazole", thai: "ไตรไซคลาโซล", category: "สารป้องกันกำจัดเชื้อรา", authority: "FRAC", group: "16.1", mechanism: "I1 reductase in melanin biosynthesis; the governed classification describes the biological target site, not field efficacy.", related: [], targets: ["โรคไหม้ข้าว / rice blast — association remains separate from product CTU authority"], products: [{ trade: "บลาสวัน", formulation: "75% WP", registration: "602-2555", registrationState: "CURRENT_RECORD_SUPPORTED", registrationLabel: "ปัจจุบัน", ctu: "NOT_ESTABLISHED", ctuLabel: "ยังไม่มีหลักฐาน", registrant: "Global Crops Co., Ltd.", importer: "not established", distributor: "not established", issue: "2024-04-17", expiry: "2030-04-16", cancellation: "none recorded" }], evidence: [sources.frac, sources.doa] },
    propiconazole: { name: "propiconazole", thai: null, category: "สารป้องกันกำจัดเชื้อรา", authority: "FRAC", group: "3", mechanism: "G1 C14-demethylase inhibition in sterol biosynthesis.", related: [], targets: [], products: [], evidence: [sources.frac] },
    penoxsulam: { name: "penoxsulam", thai: null, category: "สารกำจัดวัชพืช", authority: "HRAC", group: "2 (legacy B)", mechanism: "ALS inhibition, affecting branched-chain amino-acid synthesis in plants.", related: [{ name: "bispyribac-sodium", relation: "SAME_MOA", group: "HRAC 2" }, { name: "bensulfuron-methyl", relation: "SAME_MOA", group: "HRAC 2" }], targets: [], products: [], evidence: [sources.hrac] },
  };

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const normalize = (text) => text.toLowerCase().replaceAll("ไทอะมีทอกแซม", "thiamethoxam").replaceAll("ไพมีโทรซีน", "pymetrozine").replaceAll("ไตรไซคลาโซล", "tricyclazole");
  function resolveSubject(text) { const query = normalize(text); return Object.keys(subjects).find((name) => query.includes(name)) || context.subject; }
  function route(text) {
    const query = normalize(text);
    if (/source|ที่มา|มาจากไหน/.test(query)) return "SOURCE_LOOKUP";
    if (/ทะเบียน|registered|ผลิตภัณฑ์|ชื่อการค้า|ชื่อยา/.test(query)) return "SUBSTANCE_TO_PRODUCT";
    if (/กลุ่มอื่น|กลุ่มเดียว|ใกล้เคียง|related/.test(query)) return "RELATED_SUBSTANCE_LOOKUP";
    if (/ออกฤทธิ์|กลไก|mechanism|moa/.test(query)) return "MECHANISM_LOOKUP";
    if (/เพลี้ย|โรคไหม้|วัชพืช|เชื้อรา|แบคทีเรีย|target/.test(query) && !Object.keys(subjects).some((name) => query.includes(name))) return "TARGET_TO_SUBSTANCE";
    return resolveSubject(text) ? "ACTIVE_INGREDIENT_LOOKUP" : null;
  }
  function isKnowledgeQuery(text) { return Boolean(route(text)); }
  function sourceDetails(evidence) { return `<details class="knowledge-provenance"><summary>หลักฐาน / provenance</summary>${evidence.map((source) => `<p><strong>${esc(source.authority)}</strong> · ${esc(source.id)} · ${esc(source.version)}<br>${esc(source.locator)}<br><small>${esc(source.limitation)}</small></p>`).join("")}</details>`; }
  function productCards(subject) {
    if (!subject.products.length) return "<p>ยังไม่พบระเบียนผลิตภัณฑ์ไทยที่รองรับใน governed knowledge ชุดนี้ — ไม่ได้หมายความว่าไม่มีผลิตภัณฑ์</p>";
    return subject.products.map((product) => `<article class="knowledge-product"><h4>${esc(product.trade)}</h4><dl><dt>สาร / สูตร</dt><dd>${esc(subject.name)} · ${esc(product.formulation)}</dd><dt>เลขทะเบียน</dt><dd>${esc(product.registration)}</dd><dt>ทะเบียนผลิตภัณฑ์</dt><dd><strong>${esc(product.registrationLabel)}</strong> · ${esc(product.registrationState)}</dd><dt>สิทธิ์พืช–เป้าหมาย–การใช้</dt><dd><strong>${esc(product.ctuLabel)}</strong> · ${esc(product.ctu)}</dd><dt>ผู้ขึ้นทะเบียน</dt><dd>${esc(product.registrant)}</dd><dt>ผู้นำเข้า / ผู้จัดจำหน่าย</dt><dd>${esc(product.importer)} / ${esc(product.distributor)}</dd><dt>ออก / หมดอายุ / ยกเลิก</dt><dd>${esc(product.issue)} / ${esc(product.expiry)} / ${esc(product.cancellation)}</dd></dl></article>`).join("");
  }
  function compose(intent, subjectKey, text) {
    if (intent === "TARGET_TO_SUBSTANCE") {
      const q = normalize(text);
      const hits = q.includes("เพลี้ยกระโดด") ? [subjects.pymetrozine] : q.includes("โรคไหม้") ? [subjects.tricyclazole] : [];
      return { subjectKey: hits[0]?.name || "target", title: "สารที่ระบบพบหลักฐานเชื่อมโยงกับเป้าหมายนี้", body: hits.length ? hits.map((item) => `<p><strong>${item.name}</strong> · ${item.authority} ${item.group}</p>`).join("") : "<p>ยังไม่พบความสัมพันธ์ที่รองรับใน governed knowledge ชุดนี้</p>", evidence: hits.flatMap((item) => item.evidence), limitation: "รายการนี้ไม่ใช่สารทั้งหมดที่ใช้ได้ และไม่ใช่คำแนะนำผลิตภัณฑ์" };
    }
    const subject = subjects[subjectKey];
    if (!subject) return null;
    if (intent === "MECHANISM_LOOKUP") return { subjectKey, title: `กลไกของ ${subject.name}`, body: `<p><strong>${subject.authority} ${subject.group}</strong></p><p>${esc(subject.mechanism)}</p>`, evidence: subject.evidence, limitation: "Mechanism ≠ field efficacy ≠ recommendation" };
    if (intent === "RELATED_SUBSTANCE_LOOKUP") return { subjectKey, title: `สารที่เกี่ยวข้องกับ ${subject.name}`, body: subject.related.length ? subject.related.map((item) => `<p><strong>${esc(item.relation)}</strong> · ${esc(item.name)} · ${esc(item.group)}</p>`).join("") : "<p>ยังไม่พบ related active ingredient ที่รองรับใน governed knowledge ชุดนี้</p>", evidence: subject.evidence, limitation: "same MoA ≠ interchangeable; different MoA ≠ better or a resistance solution" };
    if (intent === "SUBSTANCE_TO_PRODUCT") return { subjectKey, title: `ผลิตภัณฑ์ไทยที่มี ${subject.name}`, body: productCards(subject), evidence: subject.evidence, limitation: "Registration status and CTU authority are independent; no dose or ranking is provided" };
    if (intent === "SOURCE_LOOKUP") return { subjectKey, title: `แหล่งข้อมูลของ ${subject.name}`, body: "<p>แสดง authority, version, locator และข้อจำกัดแยกตามแหล่งด้านล่าง</p>", evidence: subject.evidence, limitation: "Evidence scope is bounded to governed records currently loaded" };
    return { subjectKey, title: `${subject.thai ? `${subject.thai} / ` : ""}${subject.name}`, body: `<dl><dt>ประเภท</dt><dd>${esc(subject.category)}</dd><dt>กลุ่ม</dt><dd>${esc(subject.authority)} ${esc(subject.group)}</dd><dt>กลไกที่กำกับแล้ว</dt><dd>${esc(subject.mechanism)}</dd><dt>เป้าหมายที่มีหลักฐานเชื่อมโยง</dt><dd>${subject.targets.map(esc).join(" · ") || "ยังไม่พบในชุดความรู้นี้"}</dd><dt>ระเบียนผลิตภัณฑ์ไทย</dt><dd>${subject.products.length} ระเบียนที่รองรับ (ไม่ใช่ catalog ทั้งหมด)</dd></dl>`, evidence: subject.evidence, limitation: "Knowledge answer ≠ diagnosis, efficacy claim, prescription or rate recommendation" };
  }

  function reviews() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
  function save(records) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
  function reviewPanel(messageId) { return `<section class="spa-review" data-review-for="${messageId}"><p><strong>SPA ตรวจคำตอบนี้</strong></p><div class="review-actions"><button data-review="CORRECT">ถูกต้อง</button><button data-review="INCORRECT">ข้อมูลไม่ถูกต้อง</button><button data-review="INCOMPLETE">ข้อมูลไม่ครบ</button></div><form data-correction-form hidden><label>ต้องการแก้/เติมข้อมูลส่วนไหน?<select name="correction_type" required><option value="">เลือกประเภท</option>${["IDENTITY","TERMINOLOGY","MOA","MECHANISM","TARGET","CROP","PRODUCT","REGISTRATION","CTU","SOURCE","OTHER"].map((value) => `<option>${value}</option>`).join("")}</select></label><label>ข้อความแก้ไข/เพิ่มเติม<textarea name="correction_text" rows="2" required></textarea></label><label>แหล่งอ้างอิงหรือหมายเหตุ (ไม่บังคับ)<input name="source_reference"></label><button type="submit">บันทึกเป็น PENDING_REVIEW</button></form><p data-review-status></p></section>`; }
  function renderHistory() { const records = reviews(); return `<section class="review-history"><header><strong>ผลตรวจในอุปกรณ์นี้ ${records.length} รายการ</strong>${records.length ? '<a href="#" role="button" data-export-review>ส่งออกผลการตรวจ (JSON)</a>' : '<span class="export-disabled">ยังไม่มีผลตรวจสำหรับส่งออก</span>'}</header>${records.slice(-5).reverse().map((record) => `<p>${esc(record.subject_reference)} · ${esc(record.review_state)} · <time>${esc(record.updated_at)}</time></p>`).join("")}</section>`; }
  function ask(text) {
    const intent = route(text); const subjectKey = resolveSubject(text); const answer = compose(intent, subjectKey, text); if (!answer) return false;
    context.subject = answer.subjectKey === "target" ? context.subject : answer.subjectKey;
    const messageId = `KMSG-${Date.now()}`; const answerReference = `${answer.subjectKey}:${intent}:${APP_VERSION}`;
    context.lastAnswer = { messageId, question: text, subject: answer.subjectKey, answerReference, snapshot: `${answer.title}|${answer.limitation}` };
    context.answers.set(messageId, context.lastAnswer);
    const stream = document.querySelector("[data-conversation-stream]"); const output = document.querySelector("[data-engine-output]");
    document.querySelector("[data-empty-intro]").hidden = true; stream.hidden = false;
    document.querySelector("[data-question-panel]").hidden = true; document.querySelector("[data-investigation-tools]").hidden = true;
    const turns = `<article class="timeline-turn user-turn"><div class="message-bubble"><span>${esc(text)}</span></div></article><article class="timeline-turn assistant-turn knowledge-answer" data-message-id="${messageId}"><span class="avatar">SP</span><div class="message-bubble"><p class="eyebrow">${esc(intent)} · GOVERNED KNOWLEDGE</p><h3>${answer.title}</h3>${answer.body}<p class="boundary-copy">${esc(answer.limitation)}</p>${sourceDetails(answer.evidence)}${reviewPanel(messageId)}</div></article>`;
    const timeline = output.querySelector("[data-knowledge-timeline]");
    if (timeline) { timeline.insertAdjacentHTML("beforeend", turns); output.querySelector(".review-history")?.remove(); output.insertAdjacentHTML("beforeend", renderHistory()); }
    else output.innerHTML = `<div class="message-timeline" data-knowledge-timeline>${turns}</div>${renderHistory()}`;
    bind(output); stream.scrollIntoView({ behavior: "smooth", block: "start" }); return true;
  }
  function upsertReview(review) { const records = reviews(); const previous = records.filter((item) => item.message_id === review.message_id && item.review_state !== "SUPERSEDED").at(-1); if (previous) { previous.review_state = "SUPERSEDED"; previous.updated_at = review.created_at; review.supersession_reference = previous.review_id; } records.push(review); save(records); }
  function createReview(reviewState, messageId, correction = {}) { const now = new Date().toISOString(); const answer = context.answers.get(messageId); return { review_id: crypto.randomUUID(), conversation_id: context.conversationId, message_id: answer.messageId, question_text: answer.question, subject_reference: answer.subject, answer_reference: answer.answerReference, answer_snapshot_or_hash: answer.snapshot, review_state: reviewState, correction_type: correction.type || null, correction_text: correction.text || null, source_reference_optional: correction.source || null, reviewer_role: "SPA", created_at: now, updated_at: now, supersession_reference: null, knowledge_version_reference_if_available: APP_VERSION }; }
  function bind(root) {
    root.querySelectorAll("[data-review]").forEach((button) => { if (button.dataset.bound) return; button.dataset.bound = "true"; button.addEventListener("click", () => { const panel = button.closest(".spa-review"); const form = panel.querySelector("[data-correction-form]"); if (button.dataset.review === "CORRECT") { upsertReview(createReview("CORRECT", panel.dataset.reviewFor)); panel.querySelector("[data-review-status]").textContent = "บันทึก CORRECT ใน browser นี้แล้ว"; root.querySelector(".review-history")?.remove(); root.insertAdjacentHTML("beforeend", renderHistory()); bind(root); } else { form.hidden = false; form.dataset.reviewState = button.dataset.review; form.querySelector("select").focus(); } }); });
    root.querySelectorAll("[data-correction-form]").forEach((form) => { if (form.dataset.bound) return; form.dataset.bound = "true"; form.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(form); const panel = form.closest(".spa-review"); upsertReview(createReview("PENDING_REVIEW", panel.dataset.reviewFor, { type: data.get("correction_type"), text: data.get("correction_text"), source: data.get("source_reference") })); form.hidden = true; panel.querySelector("[data-review-status]").textContent = `${form.dataset.reviewState} บันทึกเป็น PENDING_REVIEW · ยังไม่เปลี่ยน Canonical Knowledge`; root.querySelector(".review-history")?.remove(); root.insertAdjacentHTML("beforeend", renderHistory()); bind(root); }); });
    root.querySelector("[data-export-review]")?.addEventListener("click", exportReviews);
  }
  function exportReviews(event) { const records = reviews(); const payload = { exported_at: new Date().toISOString(), schema_version: SCHEMA_VERSION, record_count: records.length, application_version: APP_VERSION, privacy: "No GPS, device identifier, IP, personal name, phone, email or browser fingerprint", records }; const link = event?.currentTarget || document.createElement("a"); link.href = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`; link.download = `sp-assistant-spa-review-${new Date().toISOString().slice(0, 10)}.json`; if (!event) { link.hidden = true; document.body.append(link); link.click(); link.remove(); } }
  window.SPKnowledgeQA = Object.freeze({ isKnowledgeQuery, route, ask, reviews, exportReviews, STORAGE_KEY });
})();
