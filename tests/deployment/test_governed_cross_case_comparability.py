from __future__ import annotations

import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT
from tests.deployment.test_multi_source_knowledge_integration import project

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def evaluate(payload: dict) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        "process.stdout.write(JSON.stringify("
        f"window.SPDecisionGates.evaluateCrossCaseComparability({json.dumps(payload)})));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def case(case_id: str, **values: object) -> dict:
    return {
        "id": case_id,
        "outcomeReviewReference": f"ORV-{case_id}",
        "applicationEventReference": f"APP-{case_id}",
        "applicationContextReference": f"ACV-{case_id}",
        "depositionEvidenceReference": f"DCV-{case_id}",
        "target": "brown-planthopper",
        "crop": "rice",
        "cropStage": "tillering",
        "outcomeMeasurement": {
            "metric": "BPH burden",
            "unit": "insects",
            "denominator": "plant",
            "countBasis": "direct plant-base count",
            "method": "same marked hills",
            "sampleSize": 20,
        },
        "observationTiming": {"T1": "24 hours", "T2": "72 hours"},
        "applicationMethod": "agricultural_drone",
        "productIdentity": "PRODUCT-PLENUM-50WG",
        "activeIngredient": "pymetrozine",
        "moa": {"system": "IRAC", "group": "9B", "descriptiveOnly": True},
        "regulatoryContext": {
            "registration": "405-2555",
            "status": "EXPIRED",
            "ctu": "AUTHORITY_BLOCKED",
        },
        "waterVolume": {"value": 3, "unit": "L", "denominator": "rai"},
        "equipmentContext": {
            "type": "agricultural_drone",
            "model": "UNKNOWN",
            "nozzle": "UNKNOWN",
            "height": "3 m",
        },
        "weatherContext": {"wind": "7 km/h", "rainTiming": "UNKNOWN"},
        "canopyContext": {"density": "dense", "cropHeight": "UNKNOWN"},
        "depositionContext": {
            "method": "water-sensitive paper",
            "plantBase": "NOT_MEASURED",
            "sampling": "INCOMPLETE",
        },
        "samplingLimitations": ["plant-base deposition not measured"],
        "alternativeExplanations": ["sampling variation", "weather"],
        "effectiveOutcomePhases": ["T0", "T1", "T2"],
        "humanComparison": "DECREASE_OBSERVED",
        "sourceRevision": "v1",
        "comparisonRevision": "v1",
        "correctionLineage": [],
        "provenance": [case_id, f"ORV-{case_id}", f"APP-{case_id}"],
        **values,
    }


def base(**values: object) -> dict:
    return {
        "comparisonId": "CCS-TEST",
        "reviewQuestion": (
            "Are these BPH outcomes comparable enough at product level for local review?"
        ),
        "granularity": "PRODUCT_LEVEL",
        "cases": [case("A"), case("B")],
        **values,
    }


def human_review(*case_ids: str) -> dict:
    return {
        "submittedExplicitly": True,
        "decision": "INCLUDE_TOGETHER",
        "includeCaseIds": list(case_ids),
        "descriptivePattern": "Reviewed Cases show a similar recorded direction.",
        "limitations": ["Case-derived evidence only"],
    }


def findings(result: dict) -> dict[str, dict]:
    return {item["id"]: item for item in result["dimensions"]}


def test_two_and_three_governed_outcomes_retain_explicit_review_question() -> None:
    two = evaluate(base())
    three = evaluate(base(cases=[case("A"), case("B"), case("C")]))
    assert two["reviewQuestion"].startswith("Are these BPH outcomes")
    assert len(two["cases"]) == 2
    assert len(three["cases"]) == 3
    for item in three["cases"]:
        assert item["outcomeReviewReference"]
        assert item["applicationEventReference"]
        assert item["applicationContextReference"]
        assert item["depositionEvidenceReference"]
        assert item["effectiveOutcomePhases"] == ["T0", "T1", "T2"]


def test_all_required_dimensions_are_exposed_without_hidden_weighting() -> None:
    result = evaluate(base())
    expected = {
        "biological_target",
        "crop_identity",
        "crop_stage",
        "outcome_measurement",
        "observation_timing",
        "application_method",
        "product_identity",
        "active_ingredient",
        "moa",
        "registration_authority",
        "water_volume",
        "equipment_context",
        "weather_context",
        "crop_canopy_context",
        "target_deposition_coverage",
        "sampling_limitations",
        "alternative_explanations",
    }
    assert {item["id"] for item in result["dimensions"]} == expected
    assert all(item["hiddenWeight"] is None for item in result["dimensions"])
    assert result["deterministicLogic"]["hiddenWeighting"] is False
    assert result["deterministicLogic"]["score"] is None
    assert result["deterministicLogic"]["opaqueModel"] is False


def test_comparable_state_requires_matching_governed_dimensions() -> None:
    result = evaluate(base())
    assert result["overallComparability"] == "COMPARABLE"
    assert all(item["state"] == "MATCH" for item in result["dimensions"])


def test_partial_comparability_exposes_context_and_deposition_differences() -> None:
    different = case(
        "C",
        cropStage="booting",
        observationTiming={"T1": "48 hours", "T2": "96 hours"},
        applicationMethod="knapsack_sprayer",
        waterVolume={"value": 20, "unit": "L", "denominator": "rai"},
        equipmentContext={"type": "knapsack_sprayer", "nozzle": "flat_fan"},
        weatherContext={"wind": "2 km/h", "temperature": "31 C"},
        canopyContext={"density": "sparse"},
        depositionContext={
            "method": "artificial collector",
            "plantBase": "MEASURED",
            "sampling": "LIMITED",
        },
    )
    result = evaluate(base(cases=[case("A"), case("B"), different]))
    dimension_map = findings(result)
    assert result["overallComparability"] == "PARTIALLY_COMPARABLE"
    for key in (
        "crop_stage",
        "observation_timing",
        "application_method",
        "water_volume",
        "equipment_context",
        "weather_context",
        "crop_canopy_context",
        "target_deposition_coverage",
    ):
        assert dimension_map[key]["state"] == "NEEDS_REVIEW"


def test_different_target_crop_or_measurement_is_hard_incompatibility() -> None:
    for changes, dimension_id in (
        ({"target": "leaffolder"}, "biological_target"),
        ({"crop": "maize"}, "crop_identity"),
        (
            {
                "outcomeMeasurement": {
                    "metric": "BPH burden",
                    "unit": "insects",
                    "denominator": "10 sweeps",
                    "countBasis": "sweep net",
                    "method": "sweep net",
                    "sampleSize": 10,
                }
            },
            "outcome_measurement",
        ),
    ):
        result = evaluate(base(cases=[case("A"), case("B", **changes)]))
        assert result["overallComparability"] == "NOT_COMPARABLE"
        assert findings(result)[dimension_id]["state"] == "MATERIAL_DIFFERENCE"


def test_missing_critical_case_evidence_is_insufficient_information() -> None:
    incomplete = case("B", applicationEventReference=None)
    result = evaluate(base(cases=[case("A"), incomplete]))
    assert result["overallComparability"] == "INSUFFICIENT_INFORMATION"
    assert result["reasons"]["missingCriticalCaseEvidence"] is True


def test_unknown_dimension_requires_human_review_without_inventing_equivalence() -> (
    None
):
    result = evaluate(base(cases=[case("A"), case("B", cropStage="UNKNOWN")]))
    assert result["overallComparability"] == "NEEDS_HUMAN_REVIEW"
    assert findings(result)["crop_stage"]["state"] == "UNKNOWN"
    assert result["humanReview"]["required"] is True


def test_review_granularity_preserves_product_ingredient_and_target_levels() -> None:
    other_product = case("B", productIdentity="PRODUCT-OTHER-PYMETROZINE")
    product_level = evaluate(base(cases=[case("A"), other_product]))
    ingredient_level = evaluate(
        base(
            granularity="ACTIVE_INGREDIENT_LEVEL",
            cases=[case("A"), other_product],
        )
    )
    target_level = evaluate(
        base(
            granularity="TARGET_LEVEL",
            cases=[case("A"), case("B", activeIngredient="other ingredient")],
        )
    )
    assert product_level["overallComparability"] == "NOT_COMPARABLE"
    assert findings(ingredient_level)["product_identity"]["state"] == (
        "ACCEPTABLE_DIFFERENCE"
    )
    assert findings(target_level)["active_ingredient"]["state"] == (
        "ACCEPTABLE_DIFFERENCE"
    )
    assert findings(target_level)["moa"]["reason"].startswith("MoA remains descriptive")


def test_explicit_human_review_creates_only_case_derived_pattern_candidate() -> None:
    result = evaluate(base(humanReview=human_review("A", "B")))
    candidate = result["localPatternCandidate"]
    assert candidate["state"] == "PATTERN_CANDIDATE"
    assert candidate["evidenceClass"] == "CASE_DERIVED_LOCAL_EVIDENCE"
    assert candidate["caseIds"] == ["A", "B"]
    assert candidate["canonical"] is False
    assert candidate["efficacyClaim"] is None
    assert candidate["resistanceClaim"] is None
    assert candidate["recommendation"] is None


def test_no_review_no_candidate_and_no_automatic_aggregation() -> None:
    result = evaluate(base())
    assert result["localPatternCandidate"]["state"] == "PATTERN_NEEDS_REVIEW"
    assert result["localPatternCandidate"]["caseIds"] == []
    assert result["aggregation"]["automatic"] is False
    assert all(
        value is None
        for key, value in result["aggregation"].items()
        if key != "automatic"
    )
    assert all(value is None for value in result["nonConclusions"].values())


def test_correction_revision_invalidates_stale_comparison_and_reopens_review() -> None:
    stale = case(
        "B",
        sourceRevision="v2",
        comparisonRevision="v1",
        correctionLineage=["T1-v2 supersedes T1-v1"],
    )
    result = evaluate(
        base(cases=[case("A"), stale], humanReview=human_review("A", "B"))
    )
    assert result["overallComparability"] == "NEEDS_HUMAN_REVIEW"
    assert result["reasons"]["staleCases"] == ["B"]
    assert result["humanReview"]["reopenRequired"] is True
    assert result["localPatternCandidate"]["state"] == "PATTERN_INCONCLUSIVE"


def test_product_regulatory_authority_learn_and_privacy_boundaries_hold() -> None:
    result = evaluate(base(humanReview=human_review("A", "B")))
    assert result["productComparisonInteraction"] == {
        "orderingChanged": False,
        "badgesAdded": False,
        "rankingChanged": False,
        "preferredProduct": None,
    }
    assert result["regulatoryInteraction"]["authorityWaived"] is False
    assert result["authorityBoundaries"] == {
        "manufacturerClaimsValidated": False,
        "scientificAuthoritySuperseded": False,
    }
    assert "!= RESISTANCE" in result["failedControlBoundary"]
    assert not any(result["learn"].values())
    assert result["privacy"]["persistence"] == "BROWSER_LOCAL_ONLY"
    assert not any(
        value for key, value in result["privacy"].items() if key != "persistence"
    )


def test_website_representative_set_and_documentation_preserve_boundaries() -> None:
    projection = project()
    view = projection["crossCaseComparison"]
    assert view["id"] == "CCS-094K-BPH-001/v1"
    assert len(view["cases_considered"]) == 3
    assert view["overall_comparability"] == "PARTIALLY_COMPARABLE"
    assert view["human_review"]["included_case_ids"] == [
        "CASE-087-BPH-A/v1",
        "CASE-094-BPH-B/v1",
    ]
    assert view["human_review"]["excluded_cases"][0]["case_id"] == ("CASE-094-BPH-C/v1")
    assert view["local_pattern_candidate"]["canonical"] is False
    assert not any(
        value for key, value in view["aggregation"].items() if key != "automatic"
    )
    assert projection["regulatoryBinding"]["approved_use"] == "AUTHORITY_BLOCKED"
    assert [item["id"] for item in projection["productComparison"]["candidates"]] == [
        "PC-CAND-PLENUM-001",
        "PC-CAND-PREVATHON-001",
    ]
    app = (ROOT / "prototype" / "knowledge-explorer" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    document = (
        ROOT
        / "docs"
        / "knowledge"
        / "action-crop-target-use-001"
        / "application-failed-control-investigation.md"
    ).read_text(encoding="utf-8")
    for required in (
        "Cross-Case Comparability",
        "Review Question",
        "Cases Considered",
        "Comparison Dimensions",
        "Local Pattern Candidate",
        "Hidden numerical comparability score",
        "No pooled efficacy, performance score",
        "Similar recorded direction",
    ):
        assert required in app
    for required in (
        "Sprint-094K governed cross-Case comparability",
        "Cross-Case comparability",
        "Review question and granularity",
        "Comparison dimensions and material difference",
        "Human Review and correction",
        "Local pattern candidate and outcome boundary",
        "Failed-control, regulatory, authority, and Learn boundaries",
    ):
        assert required in document
    assert 'locale === "th"' in app
