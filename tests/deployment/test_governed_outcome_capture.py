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
        f"window.SPDecisionGates.evaluateOutcomeReview({json.dumps(payload)})));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def observation(phase: str, value: int, **values: object) -> dict:
    return {
        "id": f"OBS-{phase}-{value}",
        "phase": phase,
        "timestamp": f"2026-08-{10 + {'T0': 0, 'T1': 1, 'T2': 3}[phase]}T07:30:00+07:00",
        "elapsedSinceApplication": "BEFORE" if phase == "T0" else "POST_APPLICATION",
        "subject": "brown-planthopper",
        "value": value,
        "unit": "insects",
        "denominator": "plant",
        "countBasis": "direct plant-base count",
        "sampleSize": 20,
        "samplingContext": {"fieldZone": "interior", "hills": "same-marked-hills"},
        "source": "HUMAN_MEASUREMENT",
        "evidenceState": "MEASURED",
        "method": "direct plant-base count",
        "limitations": ["Case evidence only"],
        "supersedesObservationId": None,
        "provenance": ["CASE-093", "APP-092", "explicit submission"],
        "submittedExplicitly": True,
        **values,
    }


def base(**values: object) -> dict:
    return {
        "caseReference": "CASE-093",
        "applicationEventReference": "APP-092",
        "applicationContextReference": "ACV-091",
        "depositionEvidenceReference": "DCV-092",
        "subject": "brown-planthopper",
        "regulatoryState": "AUTHORITY_BLOCKED",
        "observations": [
            observation("T0", 10),
            observation("T1", 6),
            observation("T2", 3),
        ],
        "humanComparison": {
            "state": "DECREASE_OBSERVED",
            "statement": "Recorded burden decreased.",
            "source": "HUMAN_REVIEW",
            "submittedExplicitly": True,
        },
        "depositionLimitations": ["plant-base deposition not measured"],
        **values,
    }


def test_t0_t1_t2_retain_raw_measurement_and_application_links() -> None:
    result = evaluate(base())
    assert result["applicationEventReference"] == "APP-092"
    assert result["applicationContextReference"] == "ACV-091"
    assert result["depositionEvidenceReference"] == "DCV-092"
    assert [item["phase"] for item in result["observations"]] == ["T0", "T1", "T2"]
    assert result["effectiveObservations"]["T0"]["value"] == 10
    assert result["effectiveObservations"]["T2"]["denominator"] == "plant"
    assert result["effectiveObservations"]["T1"]["sampleSize"] == 20


def test_phase_and_outcome_require_explicit_submission() -> None:
    result = evaluate(
        base(
            observations=[
                observation("T0", 10),
                observation("T1", 6, submittedExplicitly=False),
                observation("T2", 3),
            ],
            humanComparison=None,
        )
    )
    assert result["effectiveObservations"]["T1"] is None
    assert result["rejectedSubmissions"] == [
        {"id": "OBS-T1-6", "phase": "T1", "reason": "EXPLICIT_SUBMISSION_REQUIRED"}
    ]
    assert result["comparison"]["submittedExplicitly"] is False
    assert result["comparison"]["state"] == "COMPARISON_LIMITED"


def test_human_comparison_supports_bounded_states_without_auto_efficacy() -> None:
    for state in ("DECREASE_OBSERVED", "INCREASE_OBSERVED", "NO_CLEAR_CHANGE"):
        result = evaluate(
            base(humanComparison={"state": state, "submittedExplicitly": True})
        )
        assert result["comparison"]["state"] == state
        assert result["comparison"]["submittedExplicitly"] is True
        assert result["derivedChange"] is None
        assert all(value is None for value in result["nonConclusions"].values())


def test_comparable_sampling_is_descriptive_only() -> None:
    result = evaluate(base())
    comparison = result["samplingComparability"]
    assert comparison["state"] == "SUPPORTED"
    assert comparison["unitsMatch"] is True
    assert comparison["denominatorsMatch"] is True
    assert comparison["methodsMatch"] is True
    assert comparison["conversionApplied"] is False


def test_different_denominator_or_method_is_not_silently_normalized() -> None:
    different_denominator = observation(
        "T1",
        50,
        denominator="10 sweeps",
        countBasis="sweep-net count",
        method="sweep net",
    )
    result = evaluate(
        base(
            observations=[
                observation("T0", 10),
                different_denominator,
                observation("T2", 3),
            ]
        )
    )
    assert result["samplingComparability"]["state"] == "NOT_COMPARABLE"
    assert result["samplingComparability"]["denominatorsMatch"] is False
    assert result["samplingComparability"]["methodsMatch"] is False
    assert result["samplingComparability"]["conversionApplied"] is False


def test_context_difference_remains_comparison_limited() -> None:
    t2 = observation(
        "T2", 3, samplingContext={"fieldZone": "edge", "hills": "different-hills"}
    )
    result = evaluate(
        base(observations=[observation("T0", 10), observation("T1", 6), t2])
    )
    assert result["samplingComparability"]["state"] == "COMPARISON_LIMITED"
    assert result["samplingComparability"]["contextsMatch"] is False
    assert result["humanReview"]["required"] is True


def test_correction_preserves_history_and_reruns_from_effective_t1() -> None:
    original = observation("T1", 7)
    corrected = observation(
        "T1",
        6,
        id="OBS-T1-CORRECTED",
        supersedesObservationId=original["id"],
    )
    result = evaluate(
        base(
            observations=[
                observation("T0", 10),
                original,
                corrected,
                observation("T2", 3),
            ]
        )
    )
    assert len(result["observations"]) == 4
    assert result["effectiveObservations"]["T1"]["id"] == "OBS-T1-CORRECTED"
    assert result["correctionHistory"] == [
        {"observationId": "OBS-T1-CORRECTED", "supersedesObservationId": "OBS-T1-7"}
    ]


def test_missing_phase_requests_one_observation_not_treatment() -> None:
    result = evaluate(base(observations=[observation("T0", 10), observation("T1", 6)]))
    action = result["nextBestEvidence"]
    assert action["architecture"] == "field-action-handoff/v1"
    assert action["count"] == 1
    assert action["subject"] == "T2_observation"
    assert action["completion"] == "EXPLICIT_HUMAN_SUBMISSION_REQUIRED"
    assert action["treatmentTask"] is False
    assert action["reSprayTask"] is False
    assert action["doseAdjustmentTask"] is False


def test_alternatives_and_subject_boundaries_remain_unranked() -> None:
    result = evaluate(base())
    assert len(result["alternativeExplanations"]) >= 10
    assert not any(
        item["rank"] or item["conclusion"] for item in result["alternativeExplanations"]
    )
    assert "historical folded leaves" in result["subjectBoundaries"]["leaffolder"]
    assert "old irreversible damage" in result["subjectBoundaries"]["stem-borer-group"]
    assert "old lesions" in result["subjectBoundaries"]["blast"]
    assert "not restricted to pesticide" in result["subjectBoundaries"]["abiotic"]


def test_comparison_regulatory_manufacturer_learn_and_privacy_boundaries_hold() -> None:
    result = evaluate(base())
    assert result["productComparisonInteraction"] == {
        "orderingChanged": False,
        "scoreChanged": False,
        "preferredProduct": None,
        "winner": None,
    }
    assert result["regulatoryInteraction"] == {
        "authorityWaived": False,
        "authorityState": "AUTHORITY_BLOCKED",
    }
    assert result["manufacturerBoundary"]["caseOutcomeValidatesClaim"] is False
    assert not any(result["learn"].values())
    assert result["privacy"]["persistence"] == "BROWSER_LOCAL_ONLY"
    assert not any(
        value for key, value in result["privacy"].items() if key != "persistence"
    )


def test_website_bph_slice_and_documentation_expose_governed_outcome() -> None:
    projection = project()
    view = projection["outcomeReview"]
    assert view["id"] == "ORV-093P-BPH-001/v1"
    assert view["effective_observations"] == {
        "T0": "OUT-093-BPH-T0-001",
        "T1": "OUT-093-BPH-T1-001",
        "T2": "OUT-093-BPH-T2-001",
    }
    assert view["human_comparison"]["state"] == "DECREASE_OBSERVED"
    assert view["deposition_summary"]["plant_base"] == "NOT_MEASURED"
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
        "Post-Application Outcome",
        "Human Comparison",
        "Sampling Comparability",
        "Alternative Explanations",
        "Observed improvement",
        "poor outcome",
        "No score, ranking, recommendation, re-spray, or automatic Learn",
    ):
        assert required in app
    for required in (
        "Sprint-093P governed outcome capture",
        "Outcome capture",
        "Sampling comparability",
        "Human comparison",
        "Outcome versus efficacy and causality boundary",
        "Failed-control boundary",
        "Application context and deposition interaction",
        "Product comparison and local performance preparation",
    ):
        assert required in document
    assert 'locale === "th"' in app
