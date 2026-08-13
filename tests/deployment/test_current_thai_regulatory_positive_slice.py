from __future__ import annotations

from tests.deployment.test_investigation_decision_gates import ROOT
from tests.deployment.test_multi_source_knowledge_integration import data, project


def search() -> dict:
    return data()["regulatory_positive_search"]


def candidates() -> dict[str, dict]:
    return {item["id"]: item for item in search()["candidates"]}


def test_search_is_bounded_source_driven_and_company_neutral() -> None:
    review = search()
    assert review["candidate_priority"] == [
        "brown-planthopper",
        "rice-leaffolder",
        "stem-borer",
        "rice-blast",
        "brown-spot",
    ]
    assert "bounded source-driven search" in review["strategy"]
    assert [item["registrant"] for item in review["candidates"]] == [
        "Syngenta Crop Protection Co., Ltd.",
        "FMC AG (Thailand) Co., Ltd.",
        None,
        "Global Crops Co., Ltd.",
        None,
    ]


def test_bph_expired_negative_slice_remains_blocked() -> None:
    integration = data()
    registration = integration["entities"]["registrations"][0]
    binding = project()["regulatoryBinding"]
    candidate = candidates()["REG-CAND-089-BPH-001"]
    assert registration["current_status"] == "EXPIRED"
    assert binding["approved_use"] == "AUTHORITY_BLOCKED"
    assert binding["stable_identifier_binding"] == "BLOCKED_NO_SHARED_IDENTIFIER"
    assert candidate["result"] == "REJECTED_EXPIRED"


def test_current_leaffolder_identity_is_exact_but_has_no_label_join() -> None:
    candidate = candidates()["REG-CAND-089-LEAFFOLDER-001"]
    assert candidate["product"] == "พรีวาธอน / Prevathon"
    assert candidate["active_ingredient"] == "chlorantraniliprole"
    assert candidate["concentration_formulation"] == "5.17% W/V SC"
    assert candidate["registration_id"] == "7-2554"
    assert candidate["current_status"] == "CURRENT"
    assert candidate["validity"] == "2023-04-07 through 2029-04-06"
    assert candidate["official_label_found"] is False
    assert candidate["stable_identifier"] is False
    assert candidate["result"] == "REJECTED_NO_LABEL"


def test_current_blast_identity_is_exact_but_has_no_ctu_artifact() -> None:
    candidate = candidates()["REG-CAND-089-BLAST-001"]
    assert candidate["product"] == "บลาสวัน"
    assert candidate["active_ingredient"] == "tricyclazole"
    assert candidate["concentration_formulation"] == "75% WP"
    assert candidate["registration_id"] == "602-2555"
    assert candidate["current_status"] == "CURRENT"
    assert candidate["validity"] == "2024-04-17 through 2030-04-16"
    assert all(
        candidate[key] is False
        for key in (
            "official_label_found",
            "stable_identifier",
            "rice_explicit",
            "target_explicit",
            "use_explicit",
        )
    )
    assert candidate["result"] == "REJECTED_NO_LABEL"


def test_each_candidate_has_an_explicit_qualification_result() -> None:
    allowed = {
        "REJECTED_EXPIRED",
        "REJECTED_NO_LABEL",
        "REJECTED_NO_STABLE_IDENTIFIER",
        "NEEDS_REVIEW",
    }
    assert {item["result"] for item in search()["candidates"]} <= allowed
    assert all(item["limitation"] for item in search()["candidates"])


def test_no_candidate_is_promoted_without_the_complete_authority_chain() -> None:
    review = search()
    assert review["qualified_positive_slices"] == 0
    assert review["result"] == "NO_QUALIFIED_POSITIVE_SLICE"
    assert review["classification"] == "CURRENT_REGULATORY_POSITIVE_SOURCE_GAP"
    assert not any(
        item["official_label_found"] and item["stable_identifier"]
        for item in review["candidates"]
    )


def test_manufacturer_moa_human_review_and_learn_boundaries_hold() -> None:
    boundaries = search()["boundaries"]
    assert boundaries == {
        "manufacturer_authority": False,
        "moa_authority": False,
        "human_review_can_waive_authority": False,
        "product_selected": False,
        "recommendation": None,
        "ranking": None,
        "execution": None,
        "automatic_learning": False,
    }


def test_website_projects_positive_search_gap_beside_negative_path() -> None:
    result = project()
    review = result["regulatoryPositiveSearch"]
    assert review["id"] == "RR-089R-TH-RICE-POSITIVE-001/v1"
    assert review["result"] == "NO_QUALIFIED_POSITIVE_SLICE"
    assert result["regulatoryBinding"]["registration_status"] == "EXPIRED"
    assert result["regulatoryBinding"]["approved_use"] == "AUTHORITY_BLOCKED"
    assert result["recommendation"] is None
    assert result["execution"] is None


def test_candidate_register_and_architecture_decision_are_documented() -> None:
    document = (
        ROOT / "docs" / "knowledge" / "multi-source-integration-001" / "README.md"
    ).read_text(encoding="utf-8")
    for required in (
        "Sprint-089R current positive-path search",
        "| Candidate | Target | Registration | Status | Label | Stable ID | Rice | Target | Use | Result |",
        "7-2554",
        "602-2555",
        "REJECTED_NO_LABEL",
        "NO QUALIFIED POSITIVE SLICE",
        "CURRENT_REGULATORY_POSITIVE_SOURCE_GAP",
    ):
        assert required in document


def test_ui_language_never_implies_recommendation_or_selection() -> None:
    app = (ROOT / "prototype" / "knowledge-explorer" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    assert "Current Thai Regulatory Positive-Path Search" in app
    assert "Current registration identity ≠ approved rice-target-use authority" in app
    assert "official label fact ≠ Case recommendation" in app
    for prohibited in (
        "recommended product",
        "best choice",
        "suitable for your case",
        "use this product",
    ):
        assert prohibited not in app.lower()
