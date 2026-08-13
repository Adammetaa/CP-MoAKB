import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def invoke(function: str, *payloads: dict) -> dict:
    arguments = ",".join(json.dumps(payload) for payload in payloads)
    script = (
        "global.window={};"
        + f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        + f"process.stdout.write(JSON.stringify(window.SPDecisionGates.{function}({arguments})));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def base(subject: str, **values: object) -> dict:
    return {
        "caseReference": "CASE-085",
        "createdAt": "2026-08-13T09:00:00+07:00",
        "subject": subject,
        "identificationState": "PROVISIONAL_IDENTIFICATION",
        "alternativesResolved": True,
        "activityState": "CURRENT_ACTIVITY_SUPPORTED",
        **values,
    }


def test_bph_gap_becomes_one_bounded_count_action() -> None:
    action = invoke("createFieldAction", base("brown-planthopper"))
    assert action["action_type"] == "COUNT"
    assert action["measurement_unit"] == "insects_per_plant"
    assert action["completion_state"] == "READY_FOR_FIELD_ACTION"
    assert action["gpsRequired"] is False
    assert action["chemicalExecution"] is None
    assert action["droneParameters"] is None


def test_bph_eight_returns_through_existing_gate_to_monitoring() -> None:
    case = base("brown-planthopper")
    action = invoke("createFieldAction", case)
    result = invoke(
        "applyFieldActionResult",
        action,
        {
            "completedByUser": True,
            "result": 8,
            "completedAt": "2026-08-13T10:00:00+07:00",
            "caseInput": case,
        },
    )
    assert result["action"]["completion_state"] == "COMPLETED_BY_USER"
    assert (
        result["reevaluation"]["needForAction"]["needForAction"]
        == "CONTINUE_MONITORING"
    )
    assert result["observation"]["source"] == "USER"


def test_bph_ten_justifies_review_but_key_b_blocks_chemistry() -> None:
    case = base("brown-planthopper")
    action = invoke("createFieldAction", case)
    result = invoke(
        "applyFieldActionResult",
        action,
        {"completedByUser": True, "result": 10, "caseInput": case},
    )
    suitability = result["reevaluation"]["managementSuitability"]
    chemical = next(
        item
        for item in suitability["options"]
        if item["optionClass"] == "CHEMICAL_MANAGEMENT_REVIEW"
    )
    assert suitability["needForAction"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert chemical["state"] == "BLOCKED_BY_AUTHORITY"
    assert suitability["productRecommendation"] is None
    assert suitability["execution"]["droneMissionCreated"] is False


def test_historical_leaffolder_requests_interior_inspection_not_treatment() -> None:
    action = invoke(
        "createFieldAction",
        base(
            "leaffolder", activityState="HISTORICAL_DAMAGE_SUPPORTED", newDamage=False
        ),
    )
    assert action["action_type"] == "INSPECT"
    assert action["plant_part"] == "folded_leaf_interior"
    assert (
        "historical" in action["limitations"][0].lower()
        or "old" in action["limitations"][0].lower()
    )
    assert action["chemicalExecution"] is None


def test_stem_borer_deadheart_stays_stage_and_interior_evidence() -> None:
    action = invoke("createFieldAction", base("stem-borer-group"))
    assert action["plant_part"] == "stem_interior"
    assert "species" in action["limitations"][0]


def test_disease_weed_and_abiotic_missions_preserve_boundaries() -> None:
    disease = invoke(
        "createFieldAction",
        {
            "subject": "blast",
            "managementSuitability": {
                "subject": "blast",
                "needForAction": "MORE_EVIDENCE_REQUIRED",
                "options": [],
                "nextBestDecisionQuestion": {
                    "key": "RE_INSPECTION_MISSION",
                    "question": "Inspect lesions",
                },
            },
        },
    )
    weed = invoke("createFieldAction", base("rice-field-broadleaf"))
    abiotic = invoke(
        "createFieldAction", {"caseReference": "A", "causeFamily": "ABIOTIC"}
    )
    assert (
        disease["action_type"] == "COMPARE" and "pathogen" in disease["limitations"][0]
    )
    assert weed["action_type"] == "PHOTOGRAPH" and "herbicide" in weed["limitations"][0]
    assert (
        abiotic["action_type"] == "COMPARE"
        and "fertilizer" in abiotic["limitations"][0]
    )


def test_failed_control_records_context_without_retreatment() -> None:
    action = invoke("createFieldAction", {"failedControlContext": {"reported": True}})
    assert action["action_type"] == "RECORD"
    assert "re-treatment" in action["limitations"][0]
    assert action["chemicalExecution"] is None


def test_application_pattern_is_human_verification_not_deposition_claim() -> None:
    action = invoke(
        "createFieldAction", {"applicationQualityObservation": {"overlap": True}}
    )
    assert action["action_type"] == "VERIFY_APPLICATION_CONTEXT"
    assert "deposition" in action["limitations"][0]
    assert action["droneParameters"] is None


def test_t1_t2_repeat_requires_human_comparison() -> None:
    action = invoke(
        "createFieldAction",
        {
            "managementSuitability": {
                "subject": "blast",
                "needForAction": "MORE_EVIDENCE_REQUIRED",
                "options": [],
                "nextBestDecisionQuestion": {
                    "key": "REPEAT_OBSERVATION",
                    "question": "Repeat T2",
                },
            }
        },
    )
    assert action["action_type"] == "REPEAT_OBSERVATION"
    assert "do not automatically" in action["limitations"][0].lower()


def test_completion_is_never_inferred_and_unable_selects_alternate_path() -> None:
    action = invoke("createFieldAction", base("brown-planthopper"))
    pending = invoke("applyFieldActionResult", action, {"result": 8})
    unable = invoke("applyFieldActionResult", action, {"unable": True})
    cancelled = invoke("applyFieldActionResult", action, {"cancelledByUser": True})
    assert pending["action"]["completion_state"] == "IN_PROGRESS"
    assert pending["observation"] is None
    assert unable["nextPath"] == "SELECT_ALTERNATE_EVIDENCE_OR_HUMAN_REVIEW"
    assert cancelled["action"]["completion_state"] == "CANCELLED_BY_USER"


def test_corrected_result_supersedes_prior_observation_and_reruns_gates() -> None:
    case = base("brown-planthopper")
    action = invoke("createFieldAction", case)
    corrected = invoke(
        "applyFieldActionResult",
        action,
        {
            "completedByUser": True,
            "result": 8,
            "supersedesObservationId": "OLD-OBS",
            "caseInput": case,
        },
    )
    assert corrected["observation"]["supersedesObservationId"] == "OLD-OBS"
    assert corrected["reevaluation"]["candidateGateRerunRequired"] is True
    assert corrected["historyEntry"]["effectOnCaseState"] == "CONTINUE_MONITORING"


def test_expert_handoff_is_specific_complete_local_and_not_transmitted() -> None:
    handoff = invoke(
        "prepareExpertHandoff",
        {
            "caseDescription": "ambiguous lesions",
            "subject": "blast",
            "expertQuestion": "Can lesion morphology resolve the causal disease differential?",
            "observations": ["lesion"],
            "missingEvidence": ["causal confirmation"],
            "regulatoryState": "UNRESOLVED",
        },
    )
    assert handoff["action_type"] == "PREPARE_EXPERT_HANDOFF"
    assert handoff["completion_state"] == "HUMAN_REVIEW_REQUIRED"
    assert handoff["expertQuestion"].startswith("Can lesion morphology")
    assert handoff["package"]["missingEvidence"] == ["causal confirmation"]
    assert handoff["transmission"] == "NOT_PERFORMED"
    assert handoff["persistence"] == "BROWSER_LOCAL_ONLY"


def test_photo_and_measurement_metadata_preserve_human_sampling_boundaries() -> None:
    action = invoke("createFieldAction", base("brown-planthopper"))
    result = invoke(
        "applyFieldActionResult",
        action,
        {
            "completedByUser": True,
            "result": 8,
            "unit": "insects_per_plant",
            "denominator": "plant",
            "observationTime": "2026-08-13T09:45:00+07:00",
            "caseInput": base("brown-planthopper"),
        },
    )
    assert action["photo_mission"]["humanConfirmationRequired"] is True
    assert action["photo_mission"]["automaticAnalysis"] is False
    assert result["observation"]["denominator"] == "plant"
    assert result["observation"]["observationTime"] != action["created_at"]
