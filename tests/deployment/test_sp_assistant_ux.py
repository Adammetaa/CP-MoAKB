from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_sp_assistant_is_thai_first_chat_primary_ux() -> None:
    html = _read("index.html")
    assert '<html lang="th">' in html
    assert "SP Assistant" in html
    assert "วันนี้พบปัญหาอะไรในแปลง?" in html
    assert (
        html.index("SP Assistant") < html.index("Knowledge Explorer")
        if "Knowledge Explorer" in html
        else True
    )
    assert '<textarea id="problem"' in html
    assert "เพิ่มรูปภาพ" in html
    assert "ข้อมูลแปลง" in html
    assert "เริ่มตรวจสอบ" in html
    assert "ไม่ต้องเลือกหมวดก่อน" in html
    assert "<noscript>" in html


def test_image_selection_is_temporary_browser_memory_only() -> None:
    html = _read("index.html")
    app = _read("assets/app.js")
    assert 'type="file" accept="image/*" multiple' in html
    assert "รุ่นทดลองนี้ยังไม่อัปโหลดหรือจัดเก็บรูปภาพ" in html
    assert "URL.createObjectURL" in app
    assert "URL.revokeObjectURL" in app
    assert 'imageInput.value = ""' in app
    for prohibited in (
        "fetch(",
        "XMLHttpRequest",
        "WebSocket",
        "sendBeacon",
        "localStorage",
        "sessionStorage",
        "indexedDB",
        "FileReader",
        "FormData",
    ):
        assert prohibited not in app
    assert "action=" not in html and 'method="post"' not in html


def test_investigation_states_do_not_diagnose_or_recommend() -> None:
    html = _read("index.html")
    for state in (
        "ข้อมูลที่ยังขาด",
        "องค์ความรู้สำหรับตรวจต่อ",
        "ส่งต่อผู้เชี่ยวชาญ",
        "Management Knowledge",
        "ข้อมูลสารออกฤทธิ์และ MoA",
    ):
        assert state in html
    assert "ยังไม่สามารถยืนยันได้" in html
    assert "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ" in html
    assert "นี่คือโรค" not in html
    assert "เป็นโรคใบจุดสีน้ำตาล" not in html


def test_real_governed_corpus_is_reused_without_source_rights_leakage() -> None:
    html = _read("index.html")
    corpus = (
        ROOT
        / "prototype"
        / "knowledge-explorer"
        / "assets"
        / "data"
        / "rice-disease-corpus-001.json"
    ).read_text(encoding="utf-8")
    app = _read("assets/app.js")
    assert "โรคใบจุดสีน้ำตาล" in app and "โรคใบจุดสีน้ำตาล" in corpus
    assert "โรคไหม้" in app and "โรคไหม้" in corpus
    assert "../knowledge-explorer/rice-disease-corpus.html" in html
    assert "Knowledge → Evidence → Source" in html
    assert "<img" not in html
    assert ".pdf" not in html.casefold()


def test_green_gold_mobile_accessibility_system_is_explicit() -> None:
    styles = _read("assets/styles.css")
    html = _read("index.html")
    assert "--green:#165c3b" in styles
    assert "--gold:#d4a017" in styles
    assert ":focus-visible" in styles
    assert "min-height:46px" in styles
    assert "@media(max-width:820px)" in styles
    assert "prefers-reduced-motion" in styles
    for label in ("หน้าหลัก", "เคส", "องค์ความรู้", "โปรไฟล์"):
        assert label in html


def test_static_build_and_workflow_include_sp_assistant_subpath() -> None:
    build = (
        ROOT / "prototype" / "knowledge-explorer" / "scripts" / "build.mjs"
    ).read_text(encoding="utf-8")
    verifier = (
        ROOT
        / "prototype"
        / "knowledge-explorer"
        / "scripts"
        / "verify-pages-artifact.mjs"
    ).read_text(encoding="utf-8")
    smoke = (
        ROOT / "prototype" / "knowledge-explorer" / "scripts" / "smoke-test.mjs"
    ).read_text(encoding="utf-8")
    workflow = (
        ROOT / ".github" / "workflows" / "knowledge-explorer-pages.yml"
    ).read_text(encoding="utf-8")
    landing = (
        ROOT / "prototype" / "knowledge-explorer" / "deployment" / "root-index.html"
    ).read_text(encoding="utf-8")
    for text in (build, verifier, smoke):
        assert "sp-assistant" in text
    assert '"prototype/sp-assistant/**"' in workflow
    assert "Verify SP Assistant prototype" in workflow
    assert 'href="sp-assistant/"' in landing


def test_deterministic_case_engine_is_interactive_and_non_diagnostic() -> None:
    html = _read("index.html")
    app = _read("assets/app.js")
    for token in (
        "cueRules",
        "extractObservations",
        "evaluateCandidates",
        "selectQuestions",
        "caseState.answers.push",
        "Missing Information",
        "ข้อมูลที่อาจไม่สอดคล้อง",
        "CONTROL FAILURE ≠ RESISTANCE",
    ):
        assert token in app
    assert "data-question-form" in html
    assert "data-management-toggle" in html
    assert "data-moa-toggle" in html
    assert "data-escalate" in html
    assert "probability" not in app.casefold()
    assert "confidence" not in app.casefold()


def test_all_three_domains_management_and_authorities_are_reused() -> None:
    app = _read("assets/app.js")
    html = _read("index.html")
    for domain in ('domain: "Disease"', 'domain: "Insect"', 'domain: "Weed"'):
        assert domain in app
    for authority in ("IRAC v11.5", "FRAC 2026", "HRAC 2026"):
        assert authority in app
    assert "Management Option ไม่ใช่ Recommendation" in app
    assert "../knowledge-explorer/crop-protection-management.html" in html


def test_manual_image_annotation_and_local_handoff_are_explicit() -> None:
    html = _read("index.html")
    app = _read("assets/app.js")
    assert "จากรูปนี้ ฉันเห็น" in html
    for value in ("leaf_spots", "folded_leaf", "insect_under_leaf", "dry_shoot"):
        assert value in html
    assert "metadata/local preview only" in app
    assert "ไม่มีการส่ง email หรือ notification จริง" in app
