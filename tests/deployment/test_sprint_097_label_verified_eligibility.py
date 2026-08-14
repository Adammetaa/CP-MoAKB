from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_primary_damuzin_lead_is_exact_and_explicitly_unverified() -> None:
    chemical = read("assets/chemical-slice.js")
    for value in (
        "Damuzin",
        "1372-2565",
        "pymetrozine",
        "50% WG",
        "PROJECT_OWNER_PRODUCT_LEAD",
    ):
        assert value in chemical
    assert "official manufacturer product artifact not supplied" in chemical
    assert 'issueDate: "2022-07-04"' in chemical
    assert 'expiryDate: "2031-07-03"' in chemical
    assert "row 20214 / PDF p.3688" in chemical
    assert "Nano Gold Co., Ltd." in chemical
    assert "Millennium Farm Co., Ltd." in chemical
    assert "Chia Tai Co., Ltd." in chemical


def test_key_b_requires_current_record_and_same_registration_official_ctu() -> None:
    chemical = read("assets/chemical-slice.js")
    assert "evaluateProductEligibility" in chemical
    assert 'product.officialCtu?.authorityClass === "REGULATORY_AUTHORITY"' in chemical
    assert (
        "product.officialCtu.registrationNumber === product.registrationNumber"
        in chemical
    )
    assert 'product.officialCtu.crop === "rice"' in chemical
    assert 'product.officialCtu.target === "brown-planthopper"' in chemical
    assert "product.officialCtu.authorizedUse === true" in chemical
    assert 'state: "REGULATORY_ELIGIBLE", keyB: true' in chemical


def test_identity_mismatch_and_expired_product_are_deterministically_blocked() -> None:
    chemical = read("assets/chemical-slice.js")
    assert "IDENTITY_MISMATCH" in chemical
    assert "EXPIRED" in chemical
    assert (
        'optionState: eligibility.keyB ? "ELIGIBLE_FOR_DECISION_REVIEW" : "BLOCKED_BY_AUTHORITY"'
        in chemical
    )


def test_missing_artifact_request_is_exact_and_user_visible() -> None:
    chemical = read("assets/chemical-slice.js")
    expected = "Need front/back current DOA-approved label or registration certificate for 1372-2565"
    assert expected in chemical
    assert (
        "identity panel and rice–brown-planthopper rate/use-direction panel" in chemical
    )
    assert "Artifact ที่ต้องใช้ปลดล็อก" in chemical


def test_current_registration_still_does_not_supply_ctu_authority() -> None:
    chemical = read("assets/chemical-slice.js")
    assert 'registration.state !== "CURRENT_RECORD_SUPPORTED"' in chemical
    assert 'state: "REGULATORY_CTU_CONFIRMATION_PENDING", keyB: false' in chemical
    assert "no official approved label binds registration number" in chemical


def test_rate_timing_cautions_remain_unresolved_not_invented() -> None:
    chemical = read("assets/chemical-slice.js")
    assert "rate: null" in chemical
    assert "timing: null" in chemical
    assert "cautions: []" in chemical
    assert "no same-registration approved label supplied" in chemical


def test_previous_treatment_remains_context_not_resistance() -> None:
    app = read("assets/app.js")
    assert "damuzin-pymetrozine" in app
    assert "โดยไม่สรุป resistance" in app
    assert "failed_control" in app


def test_sampling_protocol_limitation_remains_explicit() -> None:
    chemical = read("assets/chemical-slice.js")
    assert "10 insects/plant evidence has a known sampling-unit limitation" in chemical
    assert "sampling-unit limitation" in chemical
