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
        f"window.SPDecisionGates.evaluateDepositionEvidence({json.dumps(payload)})));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def measurement(location: str, concept: str = "COVERAGE", **values: object) -> dict:
    return {
        "id": f"M-{location}",
        "applicationEventReference": "APP-091",
        "concept": concept,
        "method": "water-sensitive paper",
        "collectorType": "water-sensitive paper",
        "collectorLocation": location,
        "collectorOrientation": "horizontal",
        "value": 18,
        "unit": "%" if concept == "COVERAGE" else "droplets/cm²",
        "denominator": "collector_surface" if concept == "COVERAGE" else "cm²",
        "timestamp": "2026-08-10T07:45:00+07:00",
        "numberOfCollectors": 2,
        "samplingContext": {"fieldZone": "interior"},
        "source": "HUMAN_MEASUREMENT",
        "evidenceState": "MEASURED",
        "limitations": ["two collectors in one zone"],
        "provenance": ["CASE", "APP-091", "explicit submission"],
        **values,
    }


def base(**values: object) -> dict:
    return {
        "caseReference": "CASE-092",
        "applicationEventReference": "APP-091",
        "subject": "brown-planthopper",
        "regulatoryState": "AUTHORITY_BLOCKED",
        "targetLocations": ["plant_base"],
        "measurements": [measurement("upper_canopy")],
        **values,
    }


def test_measurement_links_event_method_location_unit_and_provenance() -> None:
    result = evaluate(base())
    record = result["records"][0]
    assert record["applicationEventReference"] == "APP-091"
    assert record["method"] == "water-sensitive paper"
    assert record["collectorLocation"] == "upper_canopy"
    assert (record["value"], record["unit"], record["denominator"]) == (
        18,
        "%",
        "collector_surface",
    )
    assert record["numberOfCollectors"] == 2
    assert record["provenance"] == ["CASE", "APP-091", "explicit submission"]


def test_coverage_and_deposition_remain_distinct_without_conversion() -> None:
    result = evaluate(
        base(
            targetLocations=["upper_canopy"],
            measurements=[
                measurement("upper_canopy", "COVERAGE"),
                measurement("upper_canopy", "DEPOSITION", value=42),
            ],
        )
    )
    assert result["concepts"] == {
        "coverage": True,
        "deposition": True,
        "collapsedToOneScale": False,
        "conversions": [],
    }
    assert {item["unit"] for item in result["records"]} == {"%", "droplets/cm²"}


def test_upper_measurement_leaves_bph_plant_base_explicitly_unmeasured() -> None:
    result = evaluate(base())
    assert result["spatialSampling"]["measuredLocations"] == ["upper_canopy"]
    assert result["spatialSampling"]["unmeasuredTargetLocations"] == ["plant_base"]
    assert result["targetLocationBinding"]["measuredAtTargetLocation"] is False
    assert "TARGET_LOCATION_UNMEASURED" in result["states"]
    assert result["potentialCoverageGap"]["state"] == "POTENTIAL_COVERAGE_GAP"
    assert result["potentialCoverageGap"]["causeEstablished"] is False


def test_target_specific_relationships_preserve_external_internal_boundaries() -> None:
    expected = {
        "brown-planthopper": "plant_base",
        "leaffolder": "folded_leaf_interior",
        "stem-borer-group": "stem_interior",
        "blast": "leaf_or_affected_organ",
    }
    for subject, target in expected.items():
        result = evaluate(
            base(
                subject=subject,
                targetLocations=[target],
                measurements=[measurement("upper_canopy")],
            )
        )
        assert result["targetLocationBinding"]["relationship"]["location"] == target
        assert result["targetLocationBinding"]["internalExposureConfirmed"] is False


def test_unknown_and_conflicting_measurements_remain_reviewable() -> None:
    unknown = measurement(
        "plant_base",
        value=None,
        unit=None,
        denominator=None,
        evidenceState="NOT_MEASURED",
    )
    result = evaluate(
        base(
            measurements=[unknown],
            conflicts=[
                {"measurementIds": ["M-1", "M-2"], "reason": "different values"}
            ],
        )
    )
    assert result["records"][0]["evidenceState"] == "NOT_MEASURED"
    assert result["records"][0]["value"] is None
    assert result["conflicts"][0]["state"] == "CONFLICTING_MEASUREMENTS"
    assert result["conflicts"][0]["resolution"] is None
    assert result["humanReview"]["required"] is True


def test_sampling_limitations_and_no_protocol_or_threshold_are_preserved() -> None:
    result = evaluate(base(samplingLimitations=["edge-only sampling"]))
    assert "two collectors in one zone" in result["samplingLimitations"]
    assert "edge-only sampling" in result["samplingLimitations"]
    assert result["spatialSampling"]["protocolInvented"] is False
    assert result["spatialSampling"]["representativeSamplingClaimed"] is False
    assert result["thresholdInterpretation"]["thresholdAvailable"] is False
    assert result["thresholdInterpretation"]["minimumDropletsPerArea"] is None
    assert result["thresholdInterpretation"]["qualityScore"] is None
    assert result["thresholdInterpretation"]["passFail"] is None


def test_one_field_action_requires_explicit_submission_and_never_respray() -> None:
    action = evaluate(base())["nextBestEvidence"]
    assert action == {
        "architecture": "field-action-handoff/v1",
        "count": 1,
        "action_type": "RECORD",
        "subject": "target_location_measurement",
        "collectorLocation": "plant_base",
        "completion": "EXPLICIT_HUMAN_OR_DEVICE_SUBMISSION_REQUIRED",
        "reSprayAction": False,
        "instruction": None,
    }


def test_no_setting_causality_efficacy_resistance_or_photo_analysis_output() -> None:
    result = evaluate(base())
    assert all(value is None for value in result["conclusions"].values())
    assert result["sequence"]["causalityEstablished"] is False
    assert result["sequence"]["efficacyEstablished"] is False
    assert result["sequence"]["resistanceEstablished"] is False
    assert result["photoBoundary"] == (
        "Photo received â‰  automated droplet analysis â‰  measurement confirmed"
    )
    assert result["records"][0]["automaticDropletAnalysis"] is False


def test_comparison_regulation_manufacturer_learn_and_privacy_boundaries_hold() -> None:
    result = evaluate(base())
    assert result["comparisonInteraction"] == {
        "orderingChanged": False,
        "scoreChanged": False,
        "productLabelsChanged": False,
        "preferredProduct": None,
    }
    assert result["regulatoryInteraction"] == {
        "authorityWaived": False,
        "authorityState": "AUTHORITY_BLOCKED",
    }
    assert result["manufacturerBoundary"]["thresholdCreated"] is False
    assert result["manufacturerBoundary"]["caseInstructionCreated"] is False
    assert not any(result["learn"].values())
    assert result["privacy"]["persistence"] == "BROWSER_LOCAL_ONLY"
    assert not any(
        value for key, value in result["privacy"].items() if key != "persistence"
    )


def test_website_golden_slice_and_documentation_preserve_all_boundaries() -> None:
    projection = project()
    view = projection["depositionCoverage"]
    assert view["id"] == "DCV-092K-BPH-001/v1"
    assert view["application_event_reference"] == "APP-EVENT-091-BPH-001"
    assert (
        view["target_location_binding"]["measurement_at_target_location"]
        == "NOT_MEASURED"
    )
    assert view["threshold_interpretation"]["threshold_available"] is False
    assert [item["id"] for item in projection["productComparison"]["candidates"]] == [
        "PC-CAND-PLENUM-001",
        "PC-CAND-PREVATHON-001",
    ]
    assert projection["regulatoryBinding"]["approved_use"] == "AUTHORITY_BLOCKED"
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
        "Deposition & Coverage Evidence",
        "Coverage â‰  Deposition",
        "Target Location",
        "Universal threshold: <strong>NOT AVAILABLE",
        "Measured deposition â‰  biological efficacy",
        "does not instruct increased water, lower flight, nozzle change, or re-spray",
    ):
        assert required in app
    for required in (
        "Sprint-092K target-specific deposition evidence",
        "Deposition evidence",
        "Coverage evidence",
        "Target-specific measurement",
        "Sampling and threshold boundaries",
        "Application context, failed control, and Field Action",
        "Outcome and recommendation boundaries",
    ):
        assert required in document
    assert 'locale === "th"' in app
