from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_long_form_input_acknowledges_and_guides_one_question() -> None:
    app = _read("assets/app.js")
    assert "รับข้อมูลแล้วครับ" in app
    assert "ตอนนี้ควรทำอะไรต่อ?" in app
    assert "caseState.questions[0]" in app
    assert "ขอเช็กเพิ่มอีก 1 จุดครับ" in app
    assert "slice(0, 5)" in app  # engine may retain gaps; UX selects only the first


def test_structured_controls_reduce_field_typing() -> None:
    app = _read("assets/app.js")
    for control_type in ('type: "chips"', 'type: "select"', 'type: "number"'):
        assert control_type in app
    assert 'name="guided-answer"' in app
    assert "choice-chips" in app
    assert 'inputmode="numeric"' in app
    assert "จำชื่อหรือกลุ่มไม่ได้" in app


def test_not_sure_skip_and_correction_are_first_class() -> None:
    app = _read("assets/app.js")
    assert app.count("ไม่แน่ใจ") >= 6
    assert "ไม่ต้องเดา" in app
    assert 'source: "user_deferred"' in app
    assert "data-correct-answer" in app
    assert "delete caseState.answerRecords[key]" in app
    assert "evaluateCandidates(observations)" in app
    assert "selectQuestions(observations, caseState.candidates)" in app


def test_conversation_history_is_browser_local() -> None:
    app = _read("assets/app.js")
    assert "conversationHistory" in app
    for role in ("USER", "SP ASSISTANT", "SYSTEM / EVIDENCE"):
        assert role in app
    for persistence in ("localStorage", "sessionStorage", "indexedDB"):
        assert persistence not in app


def test_next_best_action_reuses_existing_investigation_flows() -> None:
    app = _read("assets/app.js")
    for action in (
        "ASK_QUESTION",
        "START_PHOTO_MISSION",
        "REQUEST_FIELD_CONTEXT",
        "REQUEST_LOCATION",
        "OFFER_WEATHER_CONTEXT",
        "REQUEST_EXPERT_HANDOFF",
    ):
        assert action in app
    assert "createPhotoMission()" in app
    assert '$("[data-weather-request]").focus()' in app
    assert '$("[data-escalate]").click()' in app


def test_photo_received_never_becomes_photo_analysis() -> None:
    app = _read("assets/app.js")
    assert "Photo received ≠ Photo analyzed" in app
    assert "ได้รับภาพแล้ว" in app
    assert "URL.createObjectURL" in app
    for prohibited in ("FileReader", "OCR", "computerVision", "EXIF"):
        assert prohibited not in app


def test_progress_and_completeness_are_non_numeric() -> None:
    app = _read("assets/app.js")
    for state in (
        "เริ่มตรวจสอบ",
        "กำลังรวบรวมข้อมูล",
        "มีข้อมูลพอเปรียบเทียบ Candidate",
        "ยังมีจุดสำคัญที่ต้องตรวจ",
        "ข้อมูลภาคสนามค่อนข้างครบสำหรับส่งตรวจทาน",
    ):
        assert state in app
    for prohibited in ("70%", "80%", "confidenceScore", "probabilityScore"):
        assert prohibited not in app


def test_failed_control_becomes_guided_investigation() -> None:
    app = _read("assets/app.js")
    assert 'return ["chemical_history", "spray"]' in app
    assert "CONTROL FAILURE ≠ RESISTANCE" in app
    assert "โดยไม่เพิ่มอัตราใช้จากระบบนี้" in app
    assert "สารที่ใช้ล่าสุดอยู่ในกลุ่มใด" in app


def test_progressive_disclosure_keeps_secondary_context_available() -> None:
    app = _read("assets/app.js")
    for summary in (
        "ดูข้อมูลที่ระบบมีแล้ว",
        "ดูสิ่งที่ยังขาด",
        "ดู Candidate Knowledge",
        "ดูประวัติการสนทนาและแก้ไขคำตอบ",
        "ตัวเลือกการจัดการในอนาคต",
    ):
        assert summary in app
    for retained in (
        "data-management-toggle",
        "data-moa-toggle",
        "data-weather-request",
        "data-field-watch",
    ):
        assert retained in _read("index.html")


def test_new_case_warns_before_clearing_local_state() -> None:
    app = _read("assets/app.js")
    assert "window.confirm" in app
    assert "เริ่มเคสใหม่และล้างข้อมูลชั่วคราว" in app
    assert "event.stopImmediatePropagation()" in app


def test_field_validation_has_no_analytics_or_new_network_service() -> None:
    app = _read("assets/app.js")
    assert "โหมดทดสอบภาคสนาม" in app
    for prohibited in (
        "google-analytics",
        "gtag(",
        "analytics",
        "segment.io",
        "mixpanel",
        "session replay",
        "trackingPixel",
    ):
        assert prohibited not in app.casefold()
    assert app.count("fetch(") == 1
    assert "open-meteo.com" in app


def test_mobile_touch_focus_and_one_column_controls() -> None:
    styles = _read("assets/styles.css")
    assert ".choice-chips span" in styles and "min-height:52px" in styles
    assert ".choice-chips input:focus-visible+span" in styles
    assert "@media(max-width:820px)" in styles
    assert ".choice-chips{grid-template-columns:1fr}" in styles
    assert "bottom:72px" in styles


def test_no_diagnosis_severity_or_chemical_decision_is_added() -> None:
    app = _read("assets/app.js")
    for prohibited in (
        "severityLevel",
        "pesticideRecommendation",
        "activeIngredientRanking",
        "doseEscalation",
        "automaticResistance",
    ):
        assert prohibited not in app
    assert "ความสามารถนี้ยังไม่เปิดใช้" in app
    assert "ยังไม่มีการตรวจ Crop–Target–Use" in app
