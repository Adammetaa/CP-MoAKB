import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def progression(payload: dict) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        f"const r=window.SPDecisionGates.evaluateProgression({json.dumps(payload)});"
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


def observation(time: str, source: str, **values: object) -> dict:
    return {"observationTime": time, "source": source, **values}


def test_visible_damage_does_not_establish_current_activity() -> None:
    result = progression(
        {
            "candidate": "leaffolder",
            "observations": [observation("T1", "USER", symptom="folded_leaf")],
        }
    )
    assert result["activity"] == "CURRENT_ACTIVITY_NOT_ESTABLISHED"
    assert "DAMAGE PRESENT ≠ CAUSE CURRENTLY ACTIVE" in result["boundaries"]
    assert result["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"


def test_old_damage_remains_distinct_from_progression() -> None:
    result = progression(
        {
            "candidate": "leaffolder",
            "observations": [
                observation("T1", "USER"),
                observation("T2", "USER", oldDamageOnly=True),
            ],
        }
    )
    assert result["activity"] == "HISTORICAL_DAMAGE_SUPPORTED"
    assert result["progression"] == "MORE_EVIDENCE_REQUIRED"
    assert result["needForActionReadiness"] == "ACTION_EVIDENCE_NOT_READY"


def test_repeat_observation_supports_progression_only_from_explicit_comparison() -> (
    None
):
    result = progression(
        {
            "candidate": "blast",
            "observations": [
                observation("2026-08-12T08:00:00+07:00", "USER"),
                observation(
                    "2026-08-13T08:00:00+07:00", "USER", newAffectedTissue=True
                ),
            ],
        }
    )
    assert result["progression"] == "PROGRESSION_SUPPORTED"
    assert result["activity"] == "CURRENT_ACTIVITY_NOT_ESTABLISHED"
    assert result["diseaseBoundary"] == "SYMPTOM PROGRESSION ≠ PATHOGEN CONFIRMATION"


def test_leaffolder_activity_uses_larva_or_feeding_evidence_without_photo() -> None:
    result = progression(
        {
            "candidate": "leaffolder",
            "observations": [
                observation(
                    "T2", "DIRECT_OBSERVATION", activityCues=["larva", "feeding_scar"]
                )
            ],
        }
    )
    assert result["activity"] == "CURRENT_ACTIVITY_SUPPORTED"
    assert result["lifeStage"]["inspectionLocation"] == "inside folded leaf"
    assert result["lifeStage"]["evidence"] == "EV-RIC-006/v1"


def test_bph_retains_plant_base_and_separate_action_measurement() -> None:
    result = progression(
        {
            "candidate": "brown-planthopper",
            "observations": [
                observation("T2", "DIRECT_OBSERVATION", activityCues=["nymph"])
            ],
        }
    )
    assert result["activity"] == "CURRENT_ACTIVITY_SUPPORTED"
    assert result["lifeStage"]["inspectionLocation"] == "plant base above water level"
    assert result["needForActionReadiness"] == "ACTION_EVIDENCE_MEASUREMENT_REQUIRED"


def test_deadheart_whitehead_are_stage_bounded_not_automatic_identity() -> None:
    deadheart = progression(
        {
            "candidate": "stem-borer-group",
            "cropStage": "pre_heading",
            "observations": [observation("T1", "USER", symptom="deadheart")],
        }
    )
    whitehead = progression(
        {
            "candidate": "stem-borer-group",
            "cropStage": "post_heading",
            "observations": [observation("T1", "USER", symptom="whitehead")],
        }
    )
    assert deadheart["stageRelation"] == "SOURCE_SUPPORTED_DEADHEART_CONTEXT"
    assert whitehead["stageRelation"] == "SOURCE_SUPPORTED_WHITEHEAD_CONTEXT"
    assert (
        deadheart["activity"]
        == whitehead["activity"]
        == "CURRENT_ACTIVITY_NOT_ESTABLISHED"
    )
    assert deadheart["lifeStage"]["claim"] == "CL-RIC-007-I/B/O/v1"


def test_crop_age_weather_nearby_and_failed_control_cannot_escalate() -> None:
    result = progression(
        {
            "candidate": "brown-spot",
            "cropAge": 50,
            "weather": "rain",
            "nearbyCase": True,
            "failedControl": True,
            "observations": [],
        }
    )
    assert result["cropStage"]["role"] == "UNAVAILABLE"
    assert result["context"]["weather"]["role"] == "CONTEXTUAL"
    assert result["context"]["nearbyCase"]["boundary"] == "NEARBY CASE ≠ TRANSMISSION"
    assert (
        result["context"]["failedControl"]["boundary"] == "CONTROL FAILURE ≠ RESISTANCE"
    )
    assert result["recommendation"] is None


def test_repeat_photo_mission_preserves_time_source_without_comparison() -> None:
    result = progression(
        {
            "candidate": "leaffolder",
            "observations": [
                observation("T1", "USER_PHOTO"),
                observation("T2", "USER_PHOTO"),
            ],
        }
    )
    assert result["temporal"]["observations"][0]["observationTime"] == "T1"
    assert result["temporal"]["observations"][1]["source"] == "USER_PHOTO"
    assert result["nextBestEvidence"]["automaticImageComparison"] is False
    assert result["nextBestEvidence"]["boundary"] == "Photo received ≠ Photo analyzed"
