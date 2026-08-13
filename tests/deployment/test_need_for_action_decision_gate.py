import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def decide(payload: dict) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        f"const r=window.SPDecisionGates.evaluateNeedForAction({json.dumps(payload)});"
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


def supported(subject: str, **values: object) -> dict:
    return {
        "subject": subject,
        "identificationState": "PROVISIONAL_IDENTIFICATION",
        "alternativesResolved": True,
        "activityState": "CURRENT_ACTIVITY_SUPPORTED",
        **values,
    }


def test_historical_damage_cannot_open_management_or_retreatment() -> None:
    result = decide(
        {
            "subject": "leaffolder",
            "identificationState": "PROVISIONAL_IDENTIFICATION",
            "alternativesResolved": True,
            "activityState": "HISTORICAL_DAMAGE_SUPPORTED",
            "progressionState": "PROGRESSION_NOT_ESTABLISHED",
            "newDamage": False,
        }
    )
    assert result["needForAction"] == "CONTINUE_MONITORING"
    assert result["managementGate"] == "CLOSED"
    assert result["recommendation"] is None


def test_bph_missing_measurement_asks_one_governed_question() -> None:
    result = decide(supported("brown-planthopper"))
    assert result["needForAction"] == "MORE_EVIDENCE_REQUIRED"
    assert result["nextBestDecisionEvidence"]["key"] == "INSECTS_PER_PLANT"
    assert result["actionEvidence"]["thresholdType"] == "Economic Threshold"
    assert result["actionEvidence"]["unit"] == "insects_per_plant"


def test_bph_sampling_unit_mismatch_requires_human_review() -> None:
    result = decide(
        supported(
            "brown-planthopper",
            measurements={"insectsPerPlant": 12, "unit": "insects_per_point"},
        )
    )
    assert result["needForAction"] == "HUMAN_REVIEW_REQUIRED"
    assert result["nextBestDecisionEvidence"]["key"] == "SAMPLING_UNIT_REVIEW"


def test_bph_below_and_at_threshold_form_working_vertical_slice() -> None:
    below = decide(
        supported(
            "brown-planthopper",
            measurements={"insectsPerPlant": 9, "unit": "insects_per_plant"},
        )
    )
    reached = decide(
        supported(
            "brown-planthopper",
            measurements={"insectsPerPlant": 10, "unit": "insects_per_plant"},
        )
    )
    assert below["needForAction"] == "CONTINUE_MONITORING"
    assert reached["needForAction"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert reached["managementGate"] == "OPEN_FOR_OPTION_CLASS_REVIEW"
    assert "SPRAY_REQUIRED" not in json.dumps(reached)


def test_leaffolder_thai_evidence_requires_stage_specific_measurement() -> None:
    result = decide(supported("leaffolder", progressionState="PROGRESSION_SUPPORTED"))
    assert result["actionEvidence"]["thresholdType"] == "ACTION_THRESHOLD"
    assert (
        result["applicability"]["status"] == "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION"
    )
    assert result["needForAction"] == "MORE_EVIDENCE_REQUIRED"
    assert result["nextBestDecisionEvidence"]["key"] == "LEAFFOLDER_STAGE_INCIDENCE"


def test_disease_and_weed_progression_burden_do_not_invent_thresholds() -> None:
    for subject in ("blast", "brown-spot", "rice-field-broadleaf", "sedge-group"):
        result = decide(
            supported(
                subject,
                progressionState="PROGRESSION_SUPPORTED",
                burdenEvidence={"affectedPatches": 3},
            )
        )
        assert result["needForAction"] == "NO_ACTION_DETERMINATION_SUPPORTED"
        assert result["burden"]["labels"] == []
        assert result["humanReview"]["required"] is True


def test_failed_control_cannot_skip_to_dose_or_reapplication() -> None:
    failed = {
        "states": ["MORE_EVIDENCE_REQUIRED"],
        "nextBestEvidence": {"key": "RATE", "question": "What was reported?"},
    }
    result = decide(supported("brown-planthopper", failedControlContext=failed))
    assert result["needForAction"] == "HUMAN_REVIEW_REQUIRED"
    assert result["nextBestDecisionEvidence"]["key"] == "RATE"
    assert result["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"


def test_weather_and_nearby_field_cannot_trigger_action() -> None:
    weather = decide({"weatherContext": {"humidity": "high"}})
    nearby = decide({"nearbyCase": True})
    assert weather["needForAction"] == "NO_ACTION_DETERMINATION_SUPPORTED"
    assert nearby["needForAction"] == "NO_ACTION_DETERMINATION_SUPPORTED"
    assert weather["managementOptions"][0]["class"] == "EXPERT_REVIEW"


def test_two_key_gate_blocks_chemical_review_when_regulation_unresolved() -> None:
    result = decide(
        supported(
            "brown-planthopper",
            measurements={"insectsPerPlant": 10, "unit": "insects_per_plant"},
        )
    )
    assert result["twoKeyGate"]["keyA"]["satisfied"] is True
    assert result["twoKeyGate"]["keyB"]["satisfied"] is False
    assert result["chemicalGate"] == "CHEMICAL_REVIEW_ELIGIBILITY_UNRESOLVED"
    assert result["efficacyGate"]["status"] == "REGULATORY_ELIGIBILITY_UNRESOLVED"


def test_explainability_traceability_and_execute_learn_boundaries() -> None:
    result = decide({})
    assert result["explainability"]["reason"]
    assert result["traceability"]["scientific"][-1] == "Management Gate"
    assert result["traceability"]["regulatory"][-1] == "Chemical Eligibility"
    assert result["execute"]["droneMissionCreated"] is False
    assert result["learn"]["canonicalPromotion"] is False
