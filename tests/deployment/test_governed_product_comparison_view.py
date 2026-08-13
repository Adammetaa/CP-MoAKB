from __future__ import annotations

from tests.deployment.test_investigation_decision_gates import ROOT
from tests.deployment.test_multi_source_knowledge_integration import project


def comparison() -> dict:
    return project()["productComparison"]


def candidates() -> dict[str, dict]:
    return {item["id"]: item for item in comparison()["candidates"]}


def test_two_exact_products_share_one_semantically_bounded_context() -> None:
    result = comparison()
    assert result["context"] == {
        "label": "Thai rice insect-control regulatory knowledge",
        "scope": (
            "general governed knowledge across separately identified rice insect "
            "targets; not a same-target treatment-choice comparison"
        ),
        "subject_type": "GOVERNED_KNOWLEDGE_CONTEXT",
        "case_required": False,
        "case_link": "CHEMICAL_REVIEW_INFORMATION_ONLY",
        "case_selection": False,
    }
    assert len(result["candidates"]) == 2
    assert len({item["product"]["identity_key"] for item in result["candidates"]}) == 2


def test_comparison_resolves_identity_ingredient_formulation_and_manufacturer() -> None:
    plenum = candidates()["PC-CAND-PLENUM-001"]
    prevathon = candidates()["PC-CAND-PREVATHON-001"]
    assert (
        plenum["activeIngredient"]["normalized_name"],
        plenum["product"]["concentration"],
        plenum["product"]["formulation"],
        plenum["manufacturer"]["name"],
    ) == ("pymetrozine", "50%", "WG", "Syngenta Crop Protection Co., Ltd.")
    assert (
        prevathon["activeIngredient"]["normalized_name"],
        prevathon["product"]["concentration"],
        prevathon["product"]["formulation"],
        prevathon["manufacturer"]["name"],
    ) == (
        "chlorantraniliprole",
        "5.17% W/V",
        "SC",
        "FMC AG (Thailand) Co., Ltd.",
    )


def test_moa_is_visible_descriptive_and_never_aggregated() -> None:
    compared = candidates()
    assert compared["PC-CAND-PLENUM-001"]["moa"] == {
        "system": "IRAC",
        "group": "9B",
        "source_id": "GS-IRAC-MOA-11.5-001/v1",
        "descriptive_only": True,
    }
    assert compared["PC-CAND-PREVATHON-001"]["moa"]["group"] == "28"
    assert comparison()["score"] is None


def test_current_and_expired_registration_do_not_upgrade_ctu_authority() -> None:
    compared = candidates()
    assert compared["PC-CAND-PLENUM-001"]["registration"]["current_status"] == "EXPIRED"
    assert (
        compared["PC-CAND-PREVATHON-001"]["registration"]["current_status"] == "CURRENT"
    )
    assert {item["authority"]["exact_ctu"] for item in compared.values()} == {
        "AUTHORITY_BLOCKED"
    }
    assert compared["PC-CAND-PREVATHON-001"]["authority"]["crop"] == "INCOMPLETE"


def test_sources_and_missing_evidence_remain_visible_by_role() -> None:
    for candidate in comparison()["candidates"]:
        assert candidate["why_shown"]
        assert candidate["official_source_ids"]
        assert candidate["manufacturer_source"]["status"]
        assert candidate["scientific_source"]["scope"]
        assert candidate["gaps"]
        assert candidate["provenance"]
        assert all(
            source["id"] and source["class"] for source in candidate["provenance"]
        )
    assert (
        candidates()["PC-CAND-PREVATHON-001"]["manufacturer_source"]["status"]
        == "NOT_GOVERNED_IN_SLICE"
    )


def test_ordering_is_deterministic_alphabetical_and_company_neutral() -> None:
    result = comparison()
    assert result["candidate_ids"] == [
        "PC-CAND-PLENUM-001",
        "PC-CAND-PREVATHON-001",
    ]
    assert [item["neutral_sort_key"] for item in result["candidates"]] == [
        "plenum 50 wg",
        "prevathon",
    ]
    assert result["ordering"]["field"] == "neutral_sort_key"
    assert "manufacturer" in result["ordering"]["explanation"]


def test_recommendation_commercial_execution_and_learn_boundaries_hold() -> None:
    result = comparison()
    assert result["boundaries"] == {
        "recommendation": None,
        "ranking": None,
        "score": None,
        "winner": None,
        "treatment_selection": None,
        "commercial_preference": None,
        "execution": None,
        "automatic_learning": False,
        "human_review_can_upgrade_authority": False,
        "current_registration_implies_ctu_authority": False,
    }
    assert result["recommendation"] is result["ranking"] is result["score"] is None
    assert result["treatmentSelection"] is None


def test_case_history_rate_human_review_and_regulatory_gap_are_preserved() -> None:
    result = comparison()
    plenum = candidates()["PC-CAND-PLENUM-001"]
    assert plenum["previous_case_use"]["state"] == "CASE_HISTORY_ONLY"
    assert plenum["previous_case_use"]["conclusion"] is None
    assert plenum["source_facts"] == [
        "Official guidance fact: 20 g per 20 L water; not a Case recommendation"
    ]
    assert all(item["human_review"] == "REQUIRED" for item in result["candidates"])
    assert result["preserved_regulatory_classification"] == (
        "CURRENT_REGULATORY_POSITIVE_SOURCE_GAP"
    )
    assert project()["regulatoryBinding"]["approved_use"] == "AUTHORITY_BLOCKED"


def test_website_renders_explainable_comparison_without_selection_language() -> None:
    app = (ROOT / "prototype" / "knowledge-explorer" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    surface = app + (
        ROOT
        / "prototype"
        / "knowledge-explorer"
        / "assets"
        / "data"
        / "multi-source-integration-001.json"
    ).read_text(encoding="utf-8")
    for required in (
        "Comparing Product Information",
        "Why is this product shown?",
        "Product Identity",
        "Rice Authority",
        "Exact Target Authority",
        "Exact CTU",
        "Manufacturer Source",
        "Regulatory Authority",
        "Previous Application / Case History",
        "Neutral alphabetical order",
        "exact crop-target-use authority",
    ):
        assert required in surface
    for prohibited in (
        "best product",
        "top choice",
        "most effective",
        "most suitable",
        "use this product",
        "switch to",
        "buy this product",
    ):
        assert prohibited not in app.lower()


def test_documentation_and_localized_additive_ui_preserve_freeze() -> None:
    document = (
        ROOT / "docs" / "knowledge" / "multi-source-integration-001" / "README.md"
    ).read_text(encoding="utf-8")
    app = (ROOT / "prototype" / "knowledge-explorer" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    for required in (
        "What Product Comparison is",
        "What Product Comparison is not",
        "Inclusion logic and neutral ordering",
        "Authority display and missing evidence",
        "Recommendation, Case, rate, and Learn boundaries",
        "CURRENT_REGULATORY_POSITIVE_SOURCE_GAP",
    ):
        assert required in document
    assert 'locale === "th"' in app
    assert "data-integrated-knowledge" in (
        ROOT / "prototype" / "knowledge-explorer" / "crop-protection-management.html"
    ).read_text(encoding="utf-8")
