from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_visible_guided_bph_path_uses_one_question_at_a_time() -> None:
    app = read("assets/app.js")
    assert "bph_current_activity" in app
    assert "action_insects_per_plant" in app
    assert "previous_treatment" in app
    assert 'return [{ key: "bph_current_activity"' in app
    assert 'return [{ key: "action_insects_per_plant"' in app
    assert 'return [{ key: "previous_treatment"' in app
    assert "ข้าวมีเพลี้ยตรงโคนต้น" in read("index.html")


def test_real_product_evidence_preserves_authority_classes_and_rate_semantics() -> None:
    chemical = read("assets/chemical-slice.js")
    for value in (
        "PRODUCT-SYN-PLENUM-50WG-001",
        "405-2555",
        "20 g / 20 L water",
        "THAI_REGULATORY_RECORD",
        "MANUFACTURER_USE_GUIDANCE",
        "MOA_AUTHORITY",
        "REGULATORY_SUPPORTING_OFFICIAL",
    ):
        assert value in chemical
    assert "REGULATORY_CTU_CONFIRMATION_PENDING" in chemical
    assert "no official approved label binds registration number" in chemical


def test_registration_history_is_date_sorted_and_ambiguity_safe() -> None:
    chemical = read("assets/chemical-slice.js")
    assert "resolveRegistrationHistory" in chemical
    assert ".sort(" in chemical
    for state in (
        "CURRENT_RECORD_SUPPORTED",
        "EXPIRED",
        "CANCELLED",
        "AMBIGUOUS_HISTORY",
        "NO_CURRENT_RECORD_ESTABLISHED",
        "HUMAN_REVIEW_REQUIRED",
    ):
        assert state in chemical


def test_threshold_opens_management_review_not_spray_and_refusal_is_visible() -> None:
    chemical = read("assets/chemical-slice.js")
    assert "count >= 10" in chemical
    assert "MANAGEMENT_REVIEW_JUSTIFIED" in chemical
    assert "CONTINUE_MONITORING" in chemical
    assert "ไม่แสดงตัวเลือกสาร" in chemical
    assert "ไม่ใช่คำแนะนำหรือคำสั่งใช้" in chemical
    assert "keyB: false" in chemical


def test_no_ranking_no_invented_timing_and_specific_evidence_request() -> None:
    chemical = read("assets/chemical-slice.js")
    assert "PRODUCT_ID_ASCENDING_NO_MANUFACTURER_PRIORITY" in chemical
    assert "timing: null" in chemical
    assert "NEED_APPROVED_LABEL" in chemical
    assert (
        "registration number, rice, brown planthopper, rate, timing and cautions"
        in chemical
    )
    for prohibited in ("best", "strongest", "guaranteed", "SPRAY_REQUIRED"):
        assert prohibited not in chemical


def test_photo_and_privacy_boundaries_are_unchanged() -> None:
    app = read("assets/app.js")
    assert "Photo received" in app and "Photo analyzed" in app
    for persistence in ("localStorage", "sessionStorage", "indexedDB"):
        assert persistence not in app
