from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_composer_starts_collapsed_and_has_explicit_controls() -> None:
    app = _read("assets/app.js")
    assert "let composerExpanded = false" in app
    assert "setComposerExpanded(false)" in app
    assert "data-composer-state" in app
    assert 'aria-label", "ขยายพื้นที่เขียนข้อความและดูไฟล์แนบ"' in app
    assert 'aria-label", "ย่อพื้นที่เขียนข้อความ"' in app


def test_expansion_and_manual_collapse_are_presentation_only() -> None:
    app = _read("assets/app.js")
    assert 'composer?.classList.toggle("composer-expanded", expanded)' in app
    assert 'composer?.classList.toggle("composer-collapsed", !expanded)' in app
    assert (
        'composerCollapse.addEventListener("click", () => setComposerExpanded(false))'
        in app
    )
    assert (
        'composerSummary.addEventListener("click", () => setComposerExpanded(true'
        in app
    )


def test_collapsed_summary_retains_images_observations_and_draft() -> None:
    app = _read("assets/app.js")
    assert "selectedImages.length" in app
    assert "checkedObservationCount()" in app
    assert "problem?.value.trim()" in app
    assert "เลือกรูป" not in app or "รูป" in app
    assert "เลือกสิ่งที่เห็นแล้ว" in app
    assert "composer-has-summary" in app


def test_collapsed_hides_full_attachment_editor_but_expanded_restores_it() -> None:
    app = _read("assets/app.js")
    for selector in (".image-previews", ".image-count", ".image-annotations"):
        assert f".composer-collapsed {selector}" in app
    assert ".composer-expanded textarea" in app
    assert "max-height:min(44dvh,340px)" in app


def test_state_is_not_deleted_when_collapsing() -> None:
    app = _read("assets/app.js")
    collapse_function = app.split("function setComposerExpanded", 1)[1].split(
        "composerSummary.addEventListener", 1
    )[0]
    for mutation in (
        "selectedImages =",
        "problem.value =",
        ".checked =",
        "answerRecords",
    ):
        assert mutation not in collapse_function


def test_scroll_up_collapses_only_when_not_actively_editing() -> None:
    app = _read("assets/app.js")
    assert 'window.addEventListener("scroll"' in app
    assert "currentScrollY < lastComposerScrollY - 24" in app
    assert "composer?.contains(document.activeElement)" in app
    assert "composerInteractionAt" in app
    assert "composerExpanded && readingOlderMessages && !activelyEditing" in app


def test_focus_and_attachment_actions_expand_composer() -> None:
    app = _read("assets/app.js")
    assert 'problem?.addEventListener("focus"' in app
    assert "setComposerExpanded(true)" in app
    assert "setComposerExpanded(true);" in app
    for action in (
        "data-camera-action",
        "data-gallery-action",
        "data-attachment-field",
    ):
        assert action in app


def test_successful_send_returns_to_compact_state() -> None:
    app = _read("assets/app.js")
    start_case = app.split("function startCase()", 1)[1].split('$("[data-submit]")', 1)[
        0
    ]
    assert start_case.count("setComposerExpanded(false)") == 2
    assert (
        'caseState.conversationHistory.push({ role: "USER", type: "USER_TEXT", text })'
        in start_case
    )


def test_photo_mission_and_true_chat_contracts_remain() -> None:
    app = _read("assets/app.js")
    assert "createPhotoMission()" in app
    assert "data-mission-image" in app
    assert "Photo received ≠ Photo analyzed" in app
    assert "message-timeline" in app
    assert "USER_IMAGE" in app


def test_mobile_clearance_and_privacy_boundaries_remain() -> None:
    app = _read("assets/app.js")
    chat_css = _read("assets/chat.css")
    assert "bottom:52px" in chat_css
    assert "100dvh" in chat_css
    assert "38dvh" in app
    for persistence in ("localStorage", "sessionStorage", "indexedDB"):
        assert persistence not in app
    assert app.count("fetch(") == 1
    assert "open-meteo.com" in app
