from __future__ import annotations

from tests.deployment.test_investigation_decision_gates import ROOT
from tests.deployment.test_multi_source_knowledge_integration import data, project


def by_id(items: list[dict], identity: str) -> dict:
    return next(item for item in items if item["id"] == identity)


def test_current_official_source_set_retains_identity_and_scope() -> None:
    sources = {item["id"]: item for item in data()["sources"]}
    registry = sources["GS-DOA-HAZARDOUS-REGISTRY-2026-001/v2"]
    guidance = sources["GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1"]
    assert registry["class"] == "REGULATORY_AUTHORITY"
    assert registry["version_date"] == "2026-07-16"
    assert registry["sha256"] == (
        "8b28fcfa31a40a021645645a33864fe858769af8f2264db22776e549df6916fe"
    )
    assert guidance["class"] == "REGULATORY_SUPPORTING_OFFICIAL"
    assert "no registration number" in guidance["limitations"][0]


def test_registration_405_2555_is_expired_not_current() -> None:
    registration = by_id(data()["entities"]["registrations"], "TH-REG-405-2555")
    assert registration["registration_number"] == "405-2555"
    assert registration["recorded_issue"] == "2018-03-23"
    assert registration["recorded_expiry"] == "2024-03-22"
    assert registration["current_status"] == "EXPIRED"
    assert registration["status_as_of"] == "2026-07-16"
    assert registration["cancellation_status"] == "NOT_RECORDED"


def test_registration_lineage_does_not_invent_a_successor() -> None:
    lineage = by_id(data()["entities"]["registrations"], "TH-REG-405-2555")["lineage"]
    assert lineage["relationship_state"] == "NEEDS_REVIEW"
    assert lineage["replacement_registration_id"] is None
    assert lineage["current_successor_bound"] is False
    assert "does not itself classify" in lineage["limitation"]


def test_product_identity_match_is_supported_but_similar_name_is_not_merged() -> None:
    integration = data()
    product = by_id(integration["entities"]["products"], "PRODUCT-SYN-PLENUM-50WG-001")
    ambiguous = by_id(
        integration["entities"]["products"], "PRODUCT-AMBIGUOUS-PLENUM-NAME-001"
    )
    relationship = by_id(integration["relationships"], "REL-PRODUCT-REG")
    assert product["identity_state"] == "SUPPORTED"
    assert relationship["state"] == "SUPPORTED"
    assert ambiguous["identity_state"] == "NEEDS_REVIEW"
    assert ambiguous["identity_key"] is None


def test_official_guidance_supports_exact_crop_target_and_rate_facts() -> None:
    use = by_id(
        data()["entities"]["regulatory_use_assertions"],
        "TH-USE-BPH-PYM-UNBOUND-001",
    )
    assert "Oryza sativa L." in use["crop"]["identity"]
    assert use["crop"]["source_fact_state"] == "SUPPORTED"
    assert "Nilaparvata lugens" in use["target"]["identity"]
    assert use["target"]["source_fact_state"] == "SUPPORTED"
    assert use["use"]["source_fact_state"] == "SUPPORTED"
    assert use["rate_fact"] == {
        "value": "20 g per 20 L water",
        "source_role": "REGULATORY_SUPPORTING_OFFICIAL",
        "case_instruction": False,
    }


def test_missing_stable_identifier_blocks_approved_use_binding() -> None:
    integration = data()
    use = by_id(
        integration["entities"]["regulatory_use_assertions"],
        "TH-USE-BPH-PYM-UNBOUND-001",
    )
    relationship = by_id(integration["relationships"], "REL-REG-GUIDANCE-CTU-UNBOUND")
    assert use["stable_identifier"] is None
    assert use["binding_status"] == "AUTHORITY_BLOCKED"
    assert use["human_review_state"] == "REQUIRED"
    assert relationship["state"] == "AUTHORITY_BLOCKED"
    assert "no stable identifier" in relationship["limitations"][0]


def test_incomplete_label_provenance_and_ambiguous_alias_require_review() -> None:
    integration = data()
    source = by_id(integration["sources"], "GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1")
    identity = by_id(integration["entities"]["biological"], "BIO-BPH")
    assert "approved-label identifier" in source["limitations"][0]
    assert identity["scientific_name"] == "Nilaparvata lugens"
    assert identity["aliases"] == ["BPH"]
    assert "planthopper" not in identity["aliases"]


def test_manufacturer_science_and_irac_never_supply_regulatory_authority() -> None:
    integration = data()
    manufacturer = by_id(integration["assertions"], "AS-MFR-PLENUM-001")
    science = by_id(integration["assertions"], "AS-SCI-BPH-001")
    irac = by_id(integration["assertions"], "AS-IRAC-PYM-001")
    assert manufacturer["source_role"] == "MANUFACTURER_COMMERCIAL_SOURCE"
    assert science["source_role"] == "SCIENTIFIC_AUTHORITY"
    assert irac["source_role"] == "MOA_CLASSIFICATION_AUTHORITY"
    assert all(
        item["source_role"] != "REGULATORY_AUTHORITY"
        for item in (manufacturer, science, irac)
    )


def test_website_projection_exposes_bounded_thai_regulatory_status() -> None:
    result = project()
    binding = result["regulatoryBinding"]
    assert binding["registration_number"] == "405-2555"
    assert binding["registration_status"] == "EXPIRED"
    assert binding["crop"]["registration_binding"] == "AUTHORITY_BLOCKED"
    assert binding["target"]["registration_binding"] == "AUTHORITY_BLOCKED"
    assert binding["approved_use"] == "AUTHORITY_BLOCKED"
    assert binding["stable_identifier_binding"] == "BLOCKED_NO_SHARED_IDENTIFIER"
    assert binding["human_review"] == "REQUIRED"


def test_rate_fact_is_not_a_recommendation_or_treatment_execution() -> None:
    integration = data()
    projection = project()
    assert integration["safety"]["recommendation"] is None
    assert integration["safety"]["prescription"] is None
    assert integration["safety"]["execution"] is None
    assert integration["safety"]["application_instructions"] is None
    assert projection["recommendation"] is None
    assert projection["execution"] is None


def test_golden_slice_records_the_resolved_status_and_exact_remaining_gap() -> None:
    document = (
        ROOT
        / "docs"
        / "knowledge"
        / "multi-source-integration-001"
        / "brown-planthopper-golden-slice-validation.md"
    ).read_text(encoding="utf-8")
    for required in (
        "Sprint-088R",
        "EXPIRED",
        "405-2555",
        "20 g per 20 L water",
        "BLOCKED_NO_SHARED_IDENTIFIER",
        "REGULATORY_SOURCE_COVERAGE_GAP",
        "AUTHORITY_BLOCKED",
        "Manufacturer Claim",
        "IRAC Group 9B",
    ):
        assert required in document
