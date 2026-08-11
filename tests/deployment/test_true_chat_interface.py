from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_primary_workspace_is_a_chat_shell_with_initial_assistant_turn() -> None:
    html = _read("index.html")
    css = _read("assets/chat.css")
    assert "chat-shell" in html
    assert "welcome-message" in html
    assert "สวัสดีครับ" in html
    assert ".message-timeline" in css
    assert ".user-turn" in css and ".assistant-turn" in css


def test_persistent_composer_accepts_free_text_during_active_case() -> None:
    app = _read("assets/app.js")
    css = _read("assets/chat.css")
    assert 'composer?.classList.add("chat-composer")' in app
    assert (
        'caseState.conversationHistory.push({ role: "USER", type: "USER_TEXT", text })'
        in app
    )
    assert "caseState.userText +=" in app
    assert "sendButton.disabled" in app
    assert ".chat-composer{position:sticky" in css
    assert "position:fixed" in css


def test_structured_answer_becomes_user_turn_and_retires_controls() -> None:
    app = _read("assets/app.js")
    assert "USER · STRUCTURED ANSWER" in app
    assert "data-message-type" in app
    assert "renderConversationHistory()" in app
    assert "requestSubmit()" in app
    assert "caseState.questions[0]" in app


def test_attachment_menu_is_contextual_and_images_are_conversation_turns() -> None:
    app = _read("assets/app.js")
    for action in (
        "data-camera-action",
        "data-gallery-action",
        "data-attachment-field",
        "data-attachment-location",
        "data-attachment-time",
    ):
        assert action in app
    assert 'type: "USER_IMAGE"' in app
    assert "timeline-image" in app
    assert "Photo received ≠ Photo analyzed" in app


def test_candidate_evidence_is_a_secondary_detail_surface() -> None:
    app = _read("assets/app.js")
    assert "case-detail-sheet" in app
    assert "showModal()" in app
    assert "Candidate Knowledge" in app
    assert "renderEnvironmentalContext" in app
    assert "Candidate Knowledge ≠ Diagnosis" in app


def test_chat_correction_preserves_existing_governed_flows() -> None:
    app = _read("assets/app.js")
    for retained in (
        "createPhotoMission()",
        "REQUEST_LOCATION",
        "OFFER_WEATHER_CONTEXT",
        "OFFER_NEARBY_FIELD",
        "REQUEST_EXPERT_HANDOFF",
        "CONTROL FAILURE ≠ RESISTANCE",
        "data-correct-answer",
    ):
        assert retained in app
    for prohibited in (
        "localStorage",
        "sessionStorage",
        "indexedDB",
        "OpenAI",
        "mapbox",
        "severityLevel",
    ):
        assert prohibited not in app


def test_mobile_chat_respects_composer_navigation_and_overflow() -> None:
    css = _read("assets/chat.css")
    assert "bottom:52px" in css
    assert "width:auto" in css
    assert "max-width:90%" in css
    assert "calc(100vw - 40px)" in css
    assert "100dvh" in css


def test_static_fallback_remains_understandable() -> None:
    html = _read("index.html")
    assert "<noscript>" in html
    assert "ยังเริ่มตรวจสอบได้แม้ไม่ใช้ JavaScript" in html
