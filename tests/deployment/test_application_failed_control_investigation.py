import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def investigate(payload: dict) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        f"const r=window.SPDecisionGates.evaluateFailedControl({json.dumps(payload)});"
        "process.stdout.write(JSON.stringify(r));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def test_report_becomes_reported_failure_not_resistance() -> None:
    result = investigate({"reportedControlFailure": True})
    assert result["start"] == "REPORTED_CONTROL_FAILURE"
    assert result["resistance"]["status"] == "RESISTANCE_EVIDENCE_INSUFFICIENT"
    assert result["nextBestEvidence"]["key"] == "OUTCOME_OBSERVATION"
    assert result["management"]["productRecommendation"] is None


def test_old_damage_and_current_activity_are_independent() -> None:
    result = investigate(
        {
            "reportedControlFailure": True,
            "outcomeObservation": {
                "observed": "old white feeding scars",
                "oldDamage": True,
                "newDamage": False,
            },
            "activityReview": {"historicalDamageSupported": True},
        }
    )
    assert result["outcomeObservation"]["oldDamage"] is True
    assert result["activityReview"]["boundary"] == "DAMAGE PRESENT ≠ CURRENT ACTIVITY"
    assert "CURRENT_ACTIVITY_REVIEW_REQUIRED" not in result["states"]


def test_rate_water_mix_and_arithmetic_preserve_user_evidence() -> None:
    result = investigate(
        {
            "intervention": {
                "rate": {
                    "value": 25,
                    "unit": "cc",
                    "denominator": "20 L",
                    "productIdentity": "คำเดิม",
                },
                "waterVolume": {"tankVolume": 20, "treatedAreaPerTank": 2},
                "tankMixture": ["A", "fertilizer", "unknown"],
            }
        }
    )
    assert result["interventionHistory"]["rate"]["source"] == "USER"
    assert result["interventionHistory"]["rate"]["normalized"] is False
    assert result["waterArithmetic"]["waterVolumePerRai"] == 10
    assert result["waterArithmetic"]["interpretation"] is None
    assert result["interventionHistory"]["tankMixture"] == [
        "A",
        "fertilizer",
        "unknown",
    ]


def test_drone_settings_and_pass_pattern_do_not_establish_quality() -> None:
    result = investigate(
        {
            "reportedControlFailure": True,
            "intervention": {
                "method": "agricultural_drone",
                "drone": {
                    "flightHeight": 3,
                    "flightSpeed": 5,
                    "operatorEvents": ["refill_interruption"],
                },
            },
            "applicationQualityObservation": {"missedStrip": True},
        }
    )
    assert result["droneContext"]["flightHeight"] == 3
    assert result["coverageDeposition"]["quality"] == "NOT_ESTABLISHED"
    assert "APPLICATION_ISSUE_PLAUSIBLE" in result["states"]
    assert (
        result["droneContext"]["boundary"]
        == "DRONE TELEMETRY ≠ BIOLOGICAL DEPOSITION CONFIRMATION"
    )


def test_weather_times_water_and_reinfestation_remain_contextual() -> None:
    result = investigate(
        {
            "weatherAtApplication": {"rain": True},
            "weatherAtObservation": {"temperature": 30},
            "fieldWater": "recently_reflooded",
        }
    )
    assert result["weather"]["atApplication"]["retrieval"] == "USER_INITIATED_ONLY"
    assert result["weather"]["automaticCoordinateTransmission"] is False
    assert result["fieldWater"]["role"] == "CONTEXTUAL"
    assert result["reinfestation"]["status"] == "UNRESOLVED"


def test_moa_history_uses_governed_classification_without_inference() -> None:
    result = investigate(
        {
            "reportedControlFailure": True,
            "moaHistory": [
                {"activeIngredient": "Bispyribac-sodium"},
                {"activeIngredient": "Bensulfuron-methyl"},
            ],
        }
    )
    assert result["moaHistory"]["summary"] == "SAME_MOA_OBSERVED_REPEATEDLY"
    assert result["moaHistory"]["records"][0]["classification"]["system"] == "HRAC"
    assert result["resistance"]["status"] == "RESISTANCE_EVIDENCE_INSUFFICIENT"
    assert result["management"]["moaRotationRecommendation"] is None


def test_regulatory_uncertainty_photo_and_learning_boundaries() -> None:
    result = investigate(
        {
            "reportedControlFailure": True,
            "targetIdentity": {"resolved": True, "candidate": "brown-planthopper"},
            "outcomeObservation": {"observed": "target present"},
            "activityReview": {"currentActivitySupported": True},
        }
    )
    assert result["regulatoryUse"]["status"] == "HUMAN_REVIEW_REQUIRED"
    assert result["photoMission"]["automaticImageAnalysis"] is False
    assert (
        result["learnReadiness"]["boundary"]
        == "FIELD OUTCOME ≠ CANONICAL EFFICACY CLAIM"
    )
    assert result["management"]["reapplication"] is None


def test_six_field_scenarios_remain_investigations() -> None:
    scenarios: list[dict[str, object]] = [
        {
            "targetIdentity": {"candidate": "brown-planthopper"},
            "outcomeObservation": {"observed": "hopper still present"},
        },
        {
            "targetIdentity": {"candidate": "leaffolder"},
            "outcomeObservation": {
                "observed": "old white leaf scars",
                "oldDamage": True,
            },
        },
        {
            "targetIdentity": {"candidate": "rice-field-broadleaf"},
            "outcomeObservation": {"observed": "weed remains"},
            "fieldWater": "flooded",
        },
        {
            "targetIdentity": {"candidate": "blast"},
            "outcomeObservation": {"observed": "lesions remain", "oldDamage": True},
        },
        {
            "outcomeObservation": {
                "observed": "crop scorch after three days",
                "cropInjury": True,
            },
            "applicationQualityObservation": {"overlap": True},
        },
        {
            "outcomeObservation": {"observed": "different field outcomes"},
            "intervention": {
                "method": "agricultural_drone",
                "drone": {"routeSpacing": "user reported"},
            },
        },
    ]
    for payload in scenarios:
        result = investigate({"reportedControlFailure": True, **payload})
        assert result["start"] == "REPORTED_CONTROL_FAILURE"
        assert result["resistance"]["status"] == "RESISTANCE_EVIDENCE_INSUFFICIENT"
        assert result["management"]["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"
        assert result["management"]["productRecommendation"] is None
