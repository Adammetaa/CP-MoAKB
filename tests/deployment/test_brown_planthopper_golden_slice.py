from __future__ import annotations

import json

from tests.deployment.test_governed_management_option_selection import (
    base,
    evaluate,
    option,
)
from tests.deployment.test_investigation_decision_gates import ROOT
from tests.deployment.test_multi_source_knowledge_integration import data, project


def test_bph_identity_reuses_canonical_corpus_reference_without_duplicate() -> None:
    identity = data()["entities"]["biological"][0]
    assert identity == {
        "id": "BIO-BPH",
        "type": "pest",
        "normalized_name": "brown planthopper",
        "thai_name": "เพลี้ยกระโดดสีน้ำตาล",
        "english_name": "Brown Planthopper",
        "scientific_name": "Nilaparvata lugens",
        "crop_relationship": "rice",
        "aliases": ["BPH"],
        "canonical_reference": "rice-insect-corpus-001:BPH",
        "identity_state": "SUPPORTED",
        "duplicate_identity_state": "NO_DUPLICATE_IN_INTEGRATION_SLICE",
    }


def test_case_has_governed_observation_metadata_and_temporal_boundary() -> None:
    assertion = project()["observedInCase"][0]
    details = assertion["details"]
    assert details["crop"] == "rice"
    assert details["crop_stage"] == "NOT_RECORDED"
    assert details["observation_timestamp"] == "2026-08-13T12:00:00+07:00"
    assert details["burden"] == 10
    assert details["unit"] == "insects_per_plant"
    assert details["sampling_denominator"] == "plant"
    assert details["activity_context"] == "CURRENT_ACTIVITY_SUPPORTED"
    assert "not current burden" in details["historical_context"]
    assert details["observation_source"] == "HUMAN_FIELD_OBSERVATION"
    assert details["photo_inference"] is False


def test_eight_monitors_and_ten_opens_management_review_without_selection() -> None:
    eight = evaluate(
        base(
            "brown-planthopper",
            measurements={"insectsPerPlant": 8, "unit": "insects_per_plant"},
        )
    )
    ten = evaluate(
        base(
            "brown-planthopper",
            measurements={"insectsPerPlant": 10, "unit": "insects_per_plant"},
        )
    )
    assert eight["reviewedFinding"]["state"] == "CONTINUE_MONITORING"
    assert ten["reviewedFinding"]["state"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert option(ten, "CHEMICAL_REVIEW")["eligibilityState"] == "authority-blocked"
    assert ten["chemicalBoundary"]["productSelected"] is False


def test_view_exposes_management_review_as_information_only() -> None:
    result = project()
    review = result["managementReview"]
    assert review["state"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert review["chemical_information_state"] == "CHEMICAL_REVIEW_INFORMATION_ONLY"
    assert review["product_selected"] is False
    assert review["threshold_source"] == "AE-076-BPH-001/v1"


def test_pymetrozine_irac_product_and_manufacturer_chain_is_traceable() -> None:
    integration = data()
    chemical = integration["entities"]["chemicals"][0]
    product = integration["entities"]["products"][0]
    irac = next(
        item for item in integration["assertions"] if item["id"] == "AS-IRAC-PYM-001"
    )
    manufacturer = next(
        item for item in integration["assertions"] if item["id"] == "AS-MFR-PLENUM-001"
    )
    assert chemical["normalized_name"] == "pymetrozine"
    assert irac["statement"] == "IRAC classifies pymetrozine in Group 9B."
    assert irac["source_id"] == "GS-IRAC-MOA-11.5-001/v1"
    assert product["product_name"] == "เพลนั่ม 50 ดับบลิวจี"
    assert product["active_ingredient_id"] == "AI-PYMETROZINE"
    assert product["concentration"] == "50%" and product["formulation"] == "WG"
    assert manufacturer["source_role"] == "MANUFACTURER_COMMERCIAL_SOURCE"
    assert manufacturer["state"] == "NEEDS_REVIEW"


def test_historical_registration_identity_binds_but_current_ctu_is_blocked() -> None:
    integration = data()
    registration = integration["entities"]["registrations"][0]
    product_binding = next(
        item for item in integration["relationships"] if item["id"] == "REL-PRODUCT-REG"
    )
    use_binding = next(
        item
        for item in integration["relationships"]
        if item["id"] == "REL-MFR-CLAIM-CTU"
    )
    assert registration["registration_number"] == "405-2555"
    assert registration["recorded_expiry"] == "2024-03-22"
    assert registration["current_status"] == "EXPIRED"
    assert product_binding["state"] == "SUPPORTED"
    assert "historical identity" in product_binding["limitations"][0]
    assert use_binding["state"] == "AUTHORITY_BLOCKED"
    assert set(use_binding["limitations"]) == {
        "manufacturer claim is not regulatory authority",
        "registration 405-2555 is expired",
    }


def test_website_projection_is_interpretable_and_never_recommends() -> None:
    result = project()
    assert result["observedInCase"]
    assert result["generalKnowledge"]
    assert result["moaKnowledge"]
    assert result["regulatoryKnowledge"]
    assert result["manufacturerKnowledge"]
    assert result["products"]
    assert result["gapsAndConflicts"]
    assert result["recommendation"] is None
    assert result["ranking"] is None
    assert result["prescription"] is None
    assert result["execution"] is None


def test_failed_control_boundary_has_no_resistance_or_instruction_output() -> None:
    integration = data()
    failed = next(
        item
        for item in integration["relationships"]
        if item["id"] == "REL-FAILED-CONTROL"
    )
    serialized = json.dumps(integration["safety"], sort_keys=True)
    assert failed["state"] == "NOT_APPLICABLE"
    assert "failed control does not establish resistance" in failed["limitations"]
    assert all(
        integration["safety"][key] is None
        for key in (
            "recommendation",
            "ranking",
            "commercial_preference",
            "prescription",
            "execution",
            "application_instructions",
        )
    )
    assert "rate" not in serialized and "moa_switch" not in serialized


def test_gap_register_classifies_regulatory_source_coverage_as_dominant_gap() -> None:
    document = (
        ROOT
        / "docs"
        / "knowledge"
        / "multi-source-integration-001"
        / "brown-planthopper-golden-slice-validation.md"
    ).read_text(encoding="utf-8")
    for step in (
        "Field Case",
        "BPH identity",
        "Scientific knowledge",
        "Management Review",
        "Active ingredient",
        "IRAC",
        "Product identity",
        "Manufacturer assertion",
        "Registration identity",
        "Product-registration binding",
        "Rice authority",
        "BPH target authority",
        "Exact use authority",
        "Website rendering",
        "Provenance",
    ):
        assert f"| {step} |" in document
    assert "REGULATORY_SOURCE_COVERAGE_GAP" in document
    assert "AUTHORITY_BLOCKED" in document
