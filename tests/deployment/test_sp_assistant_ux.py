from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_sp_assistant_is_thai_first_chat_primary_ux() -> None:
    html = _read("legacy.html")
    assert '<html lang="th">' in html
    assert "SP Assistant" in html
    assert "วันนี้พบอะไรในแปลง?" in html
    assert (
        html.index("SP Assistant") < html.index("Knowledge Explorer")
        if "Knowledge Explorer" in html
        else True
    )
    assert '<textarea id="problem"' in html
    assert "เพิ่มรูปภาพ" in html
    assert "ข้อมูลแปลง" in html
    assert "เริ่มตรวจสอบ" in html
    assert "เล่าอาการหรือปัญหาได้ทันที" in html
    assert "<noscript>" in html


def test_image_selection_is_temporary_browser_memory_only() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert 'type="file" accept="image/*" multiple' in html
    assert "รุ่นทดลองนี้ยังไม่อัปโหลดหรือจัดเก็บรูปภาพ" in html
    assert "URL.createObjectURL" in app
    assert "URL.revokeObjectURL" in app
    assert 'imageInput.value = ""' in app
    for prohibited in (
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
    html = _read("legacy.html")
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
    html = _read("legacy.html")
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
    html = _read("legacy.html")
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
    html = _read("legacy.html")
    app = _read("assets/app.js")
    for token in (
        "cueRules",
        "extractObservations",
        "evaluateCandidates",
        "selectQuestions",
        "caseState.answerRecords",
        "Missing Information",
        "ข้อมูลที่อาจไม่สอดคล้อง",
        "CONTROL FAILURE ≠ RESISTANCE",
    ):
        assert token in app
    assert "data-question-form" in html
    assert "data-management-toggle" in html
    assert "data-moa-toggle" in html
    assert "data-escalate" in html
    assert "probability =" not in app.casefold()
    assert "confidence =" not in app.casefold()


def test_all_three_domains_management_and_authorities_are_reused() -> None:
    app = _read("assets/app.js")
    html = _read("legacy.html")
    for domain in ('domain: "Disease"', 'domain: "Insect"', 'domain: "Weed"'):
        assert domain in app
    for authority in ("IRAC v11.5", "FRAC 2026", "HRAC 2026"):
        assert authority in app
    assert "Management Option ไม่ใช่ Recommendation" in app
    assert "../knowledge-explorer/crop-protection-management.html" in html


def test_manual_image_annotation_and_local_handoff_are_explicit() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert "จากรูปนี้ ฉันเห็น" in html
    for value in ("leaf_spots", "folded_leaf", "insect_under_leaf", "dry_shoot"):
        assert value in html
    assert "metadata/local preview only" in app
    assert "ไม่มีการส่ง email หรือ notification จริง" in app


def test_photo_mission_requires_case_and_adapts_to_three_domains() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert "data-photo-mission-start" in html
    assert "ช่วยฉันเก็บภาพและตรวจแปลง" in html
    assert "if (!caseState) return" in app
    assert "domainMissionSteps" in app
    for domain in ("Disease", "Insect", "Weed"):
        assert f"{domain}: [" in app
    assert "slice(0, 6)" in app


def test_photo_mission_captures_field_organ_detail_and_safe_inspection() -> None:
    app = _read("assets/app.js")
    for token in (
        "ภาพรวมพื้นที่",
        "ทั้งต้น / ทั้งกอ",
        "อวัยวะที่มีอาการ",
        "รายละเอียดอาการ",
        "เปิดและตรวจจุดซ่อน",
        "วัชพืชทั้งต้น",
        "ตรวจแล้ว ${done} / ${mission.steps.length} จุด",
    ):
        assert token in app
    assert "ยังไม่มีข้อมูลที่ผ่าน Governance เพียงพอ" in app


def test_photo_does_not_create_observation_but_manual_confirmation_does() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert "รูปภาพเป็นเพียงหลักฐานประกอบ" in html
    assert "ภาพนี้ยังไม่ยืนยัน Observation" in app
    assert "data-mission-observation" in app
    assert "caseState.guidedObservations.push" in app
    assert 'source: "guided_observation"' in app
    assert "photoAssociated" in app
    assert 'completeMissionStep("skipped")' in app
    assert 'completeMissionStep("completed")' in app


def test_photo_mission_preserves_local_image_and_scientific_boundaries() -> None:
    app = _read("assets/app.js")
    for token in (
        'capture="environment"',
        "ถ่ายใหม่/ลบภาพ",
        "ไม่ต้องถ่ายเชื้อขนาดจุลทรรศน์",
        "ภาพตัวแมลงชัดเป็นเพียงโบนัส",
        "ไม่บังคับระบุชนิด",
        "PHOTO MISSION",
        "User-confirmed observations",
        "ไม่มี binary image data",
    ):
        assert token in app
    for prohibited in (
        "localStorage",
        "sessionStorage",
        "FileReader",
        "FormData",
    ):
        assert prohibited not in app


def test_spatial_case_location_is_optional_explicit_and_browser_local() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert "ใช้ตำแหน่งปัจจุบัน" in html
    assert "data-location-request" in html
    assert 'addEventListener("click", requestCurrentLocation)' in app
    assert "navigator.geolocation.getCurrentPosition" in app
    assert "requestCurrentLocation();" not in app
    assert "ตำแหน่งไม่จำเป็นต่อการตรวจสอบเคส" in html
    assert 'status: "empty"' in app
    for state in ("requesting", "captured", "denied", "unsupported", "unavailable"):
        assert f'"{state}"' in app


def test_spatial_case_preserves_device_accuracy_without_fake_precision() -> None:
    app = _read("assets/app.js")
    assert "position.coords.latitude" in app
    assert "position.coords.longitude" in app
    assert "position.coords.accuracy" in app
    assert "position.timestamp" in app
    assert "Math.round(position.coords.accuracy)" in app
    assert "ตามที่อุปกรณ์รายงาน" in app
    assert "toFixed(" not in app


def test_manual_field_time_crop_context_and_preview_are_structured() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    for token in (
        "data-field-id",
        "data-locality",
        "data-district",
        "data-province",
        'type="datetime-local"',
        "data-first-noticed",
        "data-context-variety",
        "data-context-age",
        "data-growth-stage",
        "data-water-condition",
        "data-case-data-preview",
    ):
        assert token in html
    assert "createdAt: new Date().toISOString()" in app
    assert "observationTime:" in app
    assert "firstNoticed:" in app
    assert "cropContext:" in app
    assert "User-provided" in app and "Device-provided" in app


def test_spatial_context_reaches_photo_mission_and_handoff_safely() -> None:
    app = _read("assets/app.js")
    assert "locationCaptured" in app
    assert "locationCapturedAt" in app
    assert "FIELD CASE CONTEXT" in app
    assert "Field observation ≠ Canonical Knowledge" in app
    assert "Case coordinate ≠ disease distribution" in app
    assert "photo ≠ proof of location" in app
    for prohibited in (
        "watchPosition",
        "Exif",
        "EXIF",
        "google.maps",
        "weatherapi",
        "openweathermap",
        "nearby-field",
        "transmissionRadius",
    ):
        assert prohibited not in app
