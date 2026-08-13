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
        f"window.SPDecisionGates.evaluateApplicationContext({json.dumps(payload)})));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def recorded_event() -> dict:
    return {
        "caseReference": "CASE-091",
        "subject": "brown-planthopper",
        "regulatoryState": "AUTHORITY_BLOCKED",
        "applicationEvent": {
            "id": "APP-091",
            "caseReference": "CASE-091",
            "timestamp": "2026-08-10T07:30:00+07:00",
            "recordedProduct": "reported product",
            "previousApplication": {"reported": True},
            "provenance": ["USER_CASE_HISTORY"],
            "context": {
                "applicationMethod": {
                    "value": "agricultural_drone",
                    "source": "USER",
                    "evidenceState": "REPORTED",
                    "direct": True,
                },
                "waterVolume": {
                    "value": 3,
                    "unit": "L",
                    "denominator": "rai",
                    "source": "USER",
                    "evidenceState": "REPORTED",
                    "direct": True,
                },
                "equipment": {
                    "value": {"flightHeight": 3, "model": "UNKNOWN"},
                    "source": "USER",
                    "evidenceState": "REPORTED",
                    "direct": True,
                },
                "weather": {
                    "value": {"windSpeed": 7, "unit": "km/h"},
                    "timestamp": "2026-08-10T07:30:00+07:00",
                    "source": "HUMAN_FIELD_OBSERVATION",
                    "evidenceState": "REPORTED",
                    "direct": True,
                    "limitations": ["instrument and spatial relevance unresolved"],
                },
                "cropCanopy": {
                    "value": {"cropStage": "tillering", "canopy": "dense"},
                    "source": "USER",
                    "evidenceState": "REPORTED",
                    "direct": True,
                },
                "timing": {
                    "value": {"applicationTime": "07:30"},
                    "source": "USER",
                    "evidenceState": "REPORTED",
                    "direct": True,
                },
                "coverageEvidence": {"status": "UNKNOWN"},
                "anomalies": {"equipmentInterruption": True},
            },
        },
    }


def assertions(result: dict) -> dict[str, dict]:
    return {item["subject"]: item for item in result["assertions"]}


def test_method_water_equipment_weather_crop_and_timing_preserve_semantics() -> None:
    result = evaluate(recorded_event())
    items = assertions(result)
    assert items["application_method"]["value"] == "agricultural_drone"
    assert (
        items["water_volume"]["value"],
        items["water_volume"]["unit"],
        items["water_volume"]["denominator"],
    ) == (3, "L", "rai")
    assert items["equipment_or_drone"]["value"]["flightHeight"] == 3
    assert items["application_weather"]["timestamp"] == "2026-08-10T07:30:00+07:00"
    assert items["application_weather"]["source"] == "HUMAN_FIELD_OBSERVATION"
    assert items["crop_and_canopy"]["value"]["cropStage"] == "tillering"
    assert items["timing_context"]["evidence_state"] == "REPORTED"


def test_target_location_profiles_cover_four_bounded_slices() -> None:
    expected = {
        "brown-planthopper": "plant_base",
        "leaffolder": "folded_leaf_interior",
        "stem-borer-group": "stem_interior",
        "blast": "leaf_or_affected_organ",
    }
    for subject, location in expected.items():
        payload = recorded_event()
        payload["subject"] = subject
        target = assertions(evaluate(payload))["target_location"]
        assert target["value"] == location
        assert target["direct"] is False
        assert target["limitations"]


def test_unknown_coverage_and_potential_limitation_do_not_establish_quality() -> None:
    result = evaluate(recorded_event())
    assert result["coverageEvidence"]["coverage_status"] == "UNKNOWN"
    assert "coverage_evidence" in result["missingEvidence"]
    assert result["potentialLimitations"][0]["state"] == "POTENTIAL_LIMITATION"
    assert result["potentialLimitations"][0]["instruction"] is None
    assert result["suitability"]["applicationQuality"] == "NOT_ESTABLISHED"
    assert result["suitability"]["score"] is None
    assert result["suitability"]["passFail"] is None


def test_exactly_one_existing_field_action_fact_is_requested() -> None:
    result = evaluate(recorded_event())
    assert result["nextBestEvidence"] == {
        "architecture": "field-action-handoff/v1",
        "count": 1,
        "action_type": "RECORD",
        "subject": "coverage_evidence",
        "completion": "EXPLICIT_HUMAN_SUBMISSION_REQUIRED",
        "instruction": None,
    }


def test_application_event_previous_history_and_assertions_are_case_evidence() -> None:
    result = evaluate(recorded_event())
    event = result["applicationEvent"]
    assert event["eventType"] == "CASE_SCOPED_APPLICATION_HISTORY"
    assert event["executionTask"] is None and event["prescription"] is None
    assert result["previousApplication"]["status"] == "CASE_HISTORY_RECORDED"
    assert all(
        value is None for value in result["previousApplication"]["conclusions"].values()
    )
    assert all(
        "source" in item and "timestamp" in item and "direct" in item
        for item in result["assertions"]
    )


def test_no_dose_drone_water_timing_or_retreatment_prescription() -> None:
    suitability = evaluate(recorded_event())["suitability"]
    for field in (
        "recommendation",
        "dose",
        "droneSettings",
        "waterVolume",
        "sprayTiming",
        "retreatment",
    ):
        assert suitability[field] is None


def test_failed_control_regulation_comparison_photo_sequence_and_learn_boundaries() -> (
    None
):
    result = evaluate(recorded_event())
    assert result["regulatoryInteraction"]["authorityWaived"] is False
    assert result["regulatoryInteraction"]["authorityState"] == "AUTHORITY_BLOCKED"
    assert result["comparisonInteraction"] == {
        "orderingChanged": False,
        "scoreChanged": False,
        "preferredProduct": None,
        "productSelected": None,
    }
    assert result["sequence"]["order"] == [
        "T0",
        "APPLICATION_EVENT",
        "T1",
        "T2",
        "OUTCOME_REVIEW",
    ]
    assert result["sequence"]["causalityEstablished"] is False
    assert result["sequence"]["resistanceEstablished"] is False
    assert (
        result["photoBoundary"]
        == "Photo received â‰  Photo analyzed â‰  Observation confirmed"
    )
    assert not any(result["learn"].values())


def test_privacy_and_manufacturer_boundaries_are_non_executing() -> None:
    result = evaluate(recorded_event())
    assert result["privacy"] == {
        "persistence": "BROWSER_LOCAL_ONLY",
        "automaticGpsPersistence": False,
        "telemetryUpload": False,
        "analytics": False,
        "tracking": False,
        "synchronization": False,
    }
    assert result["manufacturerBoundary"]["sourceFactsMayBeRecorded"] is True
    assert result["manufacturerBoundary"]["caseInstructionCreated"] is False


def test_website_projection_exposes_context_and_preserves_comparison_order() -> None:
    result = project()
    context = result["applicationContext"]
    assert context["id"] == "ACV-091P-BPH-001/v1"
    assert context["coverage_evidence"]["status"] == "UNKNOWN"
    assert context["next_best_evidence"]["count"] == 1
    assert [item["id"] for item in result["productComparison"]["candidates"]] == [
        "PC-CAND-PLENUM-001",
        "PC-CAND-PREVATHON-001",
    ]
    assert result["regulatoryBinding"]["approved_use"] == "AUTHORITY_BLOCKED"


def test_documentation_ui_localization_and_freeze_boundaries() -> None:
    document = (
        ROOT
        / "docs"
        / "knowledge"
        / "action-crop-target-use-001"
        / "application-failed-control-investigation.md"
    ).read_text(encoding="utf-8")
    app = (ROOT / "prototype" / "knowledge-explorer" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    for required in (
        "Sprint-091P Application Context model",
        "Application Event boundary",
        "Recorded context versus quality",
        "Drone context",
        "Weather context",
        "Target location and crop structure",
        "Coverage evidence",
        "Product comparison and regulatory interaction",
        "T0/T1/T2, Learn, privacy, and recommendation boundaries",
    ):
        assert required in document
    for required in (
        "Application Context",
        "Coverage Evidence",
        "Potential Limitations",
        "Missing Evidence",
        "Recorded application context â‰  confirmed application quality",
        "No dose, drone setting, water-volume, timing, re-treatment",
    ):
        assert required in app
    assert 'locale === "th"' in app
    assert "data-integrated-knowledge" in (
        ROOT / "prototype" / "knowledge-explorer" / "crop-protection-management.html"
    ).read_text(encoding="utf-8")
