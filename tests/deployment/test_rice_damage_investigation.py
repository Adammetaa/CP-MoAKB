import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def begin(payload: dict) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});"
        f"require({json.dumps(str(GATES))});"
        f"const r=window.SPDecisionGates.beginFromObservation({json.dumps(payload)});"
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


def test_unknown_leaf_lesion_starts_multi_candidate_investigation() -> None:
    result = begin({"family": "leaf_lesion", "plantPart": "leaf", "feature": "lesion"})
    assert result["start"] == "UNKNOWN_CAUSE_OBSERVATION"
    assert [item["key"] for item in result["differentialCandidates"]] == [
        "brown-spot",
        "blast",
    ]
    assert result["identificationGate"] == "IDENTIFICATION_NOT_SUPPORTED"
    assert result["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"
    assert result["recommendation"] is None


def test_support_contradiction_missing_and_traceability_stay_explicit() -> None:
    result = begin({"family": "leaf_lesion", "observations": ["eye_shaped_lesion"]})
    assert result["supportingEvidence"]
    assert result["contradictingEvidence"]
    assert result["missingDistinguishingEvidence"]
    assert all(item["claim"].startswith("CL-") for item in result["supportingEvidence"])
    assert all(
        item["evidence"].startswith("EV-") for item in result["supportingEvidence"]
    )


def test_insect_investigation_can_begin_without_visible_insect() -> None:
    result = begin({"family": "folded_rolled_leaf"})
    assert result["differentialCandidates"][0]["key"] == "leaffolder"
    assert result["identificationGate"] == "IDENTIFICATION_NOT_SUPPORTED"
    assert result["nextBestEvidence"]["mission"] == "unfold_affected_leaf"


def test_photo_mission_scale_does_not_analyze_photo() -> None:
    result = begin({"family": "wilting_drying_patch", "distribution": "patch"})
    assert result["nextBestEvidence"]["scale"] == "ORGAN"
    assert result["nextBestEvidence"]["boundary"] == "Photo received ≠ Photo analyzed"


def test_stage_environment_and_management_history_are_contextual() -> None:
    result = begin(
        {
            "family": "leaf_lesion",
            "cropStage": "reported reproductive stage",
            "environment": "recent rain",
            "managementHistory": "prior control attempt",
        }
    )
    assert {result["context"][key]["role"] for key in result["context"]} == {
        "CONTEXTUAL"
    }
    assert "chronological age alone" in result["context"]["cropStage"]["limitation"]
    assert (
        "CONTROL FAILURE ≠ RESISTANCE"
        in result["context"]["managementHistory"]["limitation"]
    )


def test_unsupported_family_creates_gap_without_causal_candidate() -> None:
    result = begin({"family": "post_application_abnormality"})
    assert result["support"] == "UNSUPPORTED"
    assert result["differentialCandidates"] == []
    assert (
        result["knowledgeGap"] == "POST_APPLICATION_ABNORMALITY_KNOWLEDGE_UNSUPPORTED"
    )
    assert result["identificationGate"] == "IDENTIFICATION_NOT_SUPPORTED"


def test_vocabulary_is_neutral_and_bounded() -> None:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        "process.stdout.write(JSON.stringify(window.SPDecisionGates.observationVocabulary));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    vocabulary = json.loads(result.stdout)
    assert "root" in vocabulary["plantParts"]
    assert "stunting" in vocabulary["features"]
    assert "water_related" in vocabulary["distributions"]
    assert vocabulary["photoScales"] == [
        "FIELD",
        "PLANT",
        "ORGAN",
        "DAMAGE",
        "VISIBLE_CAUSAL_OBJECT",
    ]
