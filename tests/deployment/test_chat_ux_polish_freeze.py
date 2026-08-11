from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_permanent_message_side_grammar() -> None:
    css = _read("assets/polish.css")
    assert ".timeline-turn.user-turn{align-self:flex-end" in css
    for selector in (".assistant-turn", ".system-turn", ".warning-turn"):
        assert selector in css
    assert "align-self:flex-start" in css
    assert ".question-panel form{align-self:flex-start}" in css


def test_prompt_font_has_safe_thai_and_english_fallbacks() -> None:
    css = _read("assets/polish.css")
    assert 'font-family:"Prompt"' in css
    for fallback in ('"Noto Sans Thai"', '"Leelawadee UI"', "Tahoma", "Arial"):
        assert fallback in css
    assert "body,button,input,textarea,select,dialog{font-family:inherit}" in css


def test_starters_retire_when_case_begins() -> None:
    app = _read("assets/app.js")
    html = _read("index.html")
    assert 'button.closest(".starter-replies")' in app
    assert "startCase()" in app
    assert '$("[data-empty-intro]").hidden = true' in app
    assert ".empty-intro[hidden]{display:none!important}" in _read("assets/polish.css")
    assert "starter-replies" in html


def test_compact_header_exposes_workflow_not_confidence() -> None:
    app = _read("assets/app.js")
    css = _read("assets/polish.css")
    assert "workflow-state" in app
    assert "investigationProgress()" in app
    assert ".topbar{display:none}" in css
    assert "header-back" in app
    assert "../knowledge-explorer/" in app
    for prohibited in ("diagnosticConfidence", "probabilityScore", "severityScore"):
        assert prohibited not in app


def test_composer_side_controls_are_fixed_and_centered() -> None:
    css = _read("assets/polish.css")
    for required in (
        "width:46px!important",
        "height:46px!important",
        "aspect-ratio:1",
        "place-items:center!important",
        "line-height:1!important",
    ):
        assert required in css


def test_long_text_has_bounded_internal_scroll() -> None:
    app = _read("assets/app.js")
    css = _read("assets/polish.css")
    assert "resizeComposerText" in app
    assert "Math.min(problem.scrollHeight, 112)" in app
    assert 'style.setProperty("height"' in app
    assert 'problem.style.overflowY = problem.scrollHeight > 112 ? "auto"' in app
    assert ".chat-composer textarea{overflow-y:auto" in css


def test_attachment_layer_is_body_level_reachable_and_closes() -> None:
    app = _read("assets/app.js")
    css = _read("assets/polish.css")
    assert "document.body.append(attachmentMenu)" in app
    assert "positionAttachmentMenu" in app
    assert "window.innerHeight - anchor.top" in app
    assert "!attachmentMenu.contains(event.target)" in app
    assert "attachmentMenu.hidden = !attachmentMenu.hidden" in app
    assert "position:fixed!important" in css and "z-index:65!important" in css


def test_attachment_transition_and_reduced_motion() -> None:
    css = _read("assets/polish.css")
    assert "attachment-layer-in 190ms" in css
    assert "attachment-action-in 180ms" in css
    assert "nth-child(5)" in css
    assert "@media(prefers-reduced-motion:reduce)" in css
    assert "animation:none!important" in css


def test_image_is_pending_until_send_then_becomes_user_turn() -> None:
    app = _read("assets/app.js")
    assert "pending: true" in app
    assert "commitPendingImages()" in app
    assert 'type: "USER_IMAGE"' in app
    assert "item.pending = false" in app
    assert "Photo received ≠ Photo analyzed" in app


def test_history_grouping_time_and_accessible_reveal() -> None:
    app = _read("assets/app.js")
    css = _read("assets/polish.css")
    for required in (
        "grouped-turn",
        "case-separator",
        "time-separator",
        "timestamp-toggle",
        'datetime="${item.timestamp}"',
        'aria-expanded="false"',
    ):
        assert required in app
    assert ".timeline-turn.grouped-turn" in css
    for prohibited in (">Read<", ">Seen<", ">Delivered<"):
        assert prohibited not in app


def test_structured_answers_have_reply_context_and_correction() -> None:
    app = _read("assets/app.js")
    assert "replyTo: caseState.questions.find" in app
    assert "reply-context" in app
    assert "data-correct-answer" in app
    assert "delete caseState.answerRecords[key]" in app
    assert "USER_STRUCTURED_ANSWER" in app


def test_bounded_typo_recovery_preserves_original_meaning() -> None:
    app = _read("assets/app.js")
    assert "หนอนห่อไบ" in app and "หนอนห่อใบ" in app
    assert 'level: "ambiguous"' in app
    assert 'level: "unknown"' in app
    assert 'level: "protected"' in app
    assert "ข้อความเดิมยังคงอยู่โดยไม่แก้ไขอัตโนมัติ" in app
    assert "คาแทป|cartap" in app
    assert (
        "โรคใบจุดสีน้ำตาล"
        not in app.split("const typoCandidates", 1)[1].split(
            "function renderConversationHistory", 1
        )[0]
    )


def test_scroll_does_not_fight_reader_and_jump_latest_exists() -> None:
    app = _read("assets/app.js")
    css = _read("assets/polish.css")
    assert "readingOlderMessages" in app
    assert "activelyEditing" in app
    assert "distanceFromLatest" in app
    assert "↓ ข้อความล่าสุด" in app
    assert ".jump-latest" in css


def test_governed_regressions_and_boundaries_remain() -> None:
    app = _read("assets/app.js")
    for retained in (
        "createPhotoMission()",
        "REQUEST_LOCATION",
        "OFFER_WEATHER_CONTEXT",
        "OFFER_NEARBY_FIELD",
        "CONTROL FAILURE ≠ RESISTANCE",
        "Candidate Knowledge ≠ Diagnosis",
    ):
        assert retained in app
    for prohibited in (
        "localStorage",
        "sessionStorage",
        "indexedDB",
        "severityLevel",
        "pesticideRecommendation",
        "doseEscalation",
        "OpenAI",
        "mapbox",
        "polygon",
    ):
        assert prohibited not in app
    assert app.count("fetch(") == 1
    assert "open-meteo.com" in app


def test_secondary_surfaces_are_above_composer_and_fallback_remains() -> None:
    css = _read("assets/polish.css")
    html = _read("index.html")
    assert (
        ".field-panel,.case-context,.photo-mission,.weather-context,.field-watch{z-index:70}"
        in css
    )
    assert ".case-detail-sheet{z-index:80}" in css
    assert "<noscript>" in html
