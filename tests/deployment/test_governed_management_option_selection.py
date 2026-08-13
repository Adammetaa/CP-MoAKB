import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def evaluate(payload: dict) -> dict:
    script = (
        "global.window={};"
        + f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        + f"process.stdout.write(JSON.stringify(window.SPDecisionGates.evaluateManagementOptions({json.dumps(payload)})));"
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
        "caseReference": "CASE-086",
        "evaluatedAt": "2026-08-13T12:00:00+07:00",
        "subject": subject,
        "identificationState": "PROVISIONAL_IDENTIFICATION",
        "alternativesResolved": True,
        "activityState": "CURRENT_ACTIVITY_SUPPORTED",
        **values,
    }


def option(result: dict, name: str) -> dict:
    return next(item for item in result["options"] if item["optionClass"] == name)


def test_bph_review_opens_candidates_and_authority_blocks_chemical_review() -> None:
    result = evaluate(
        base(
            "brown-planthopper",
            measurements={"insectsPerPlant": 10, "unit": "insects_per_plant"},
        )
    )
    assert result["managementGate"] == "OPEN"
    assert option(result, "CHEMICAL_REVIEW")["eligibilityState"] == "authority-blocked"
    assert (
        option(result, "NO_ACTION_CURRENTLY_JUSTIFIED")["eligibilityState"]
        == "eligible"
    )
    assert result["chemicalBoundary"]["prescriptionCreated"] is False


def test_bph_eight_and_missing_evidence_do_not_open_gate() -> None:
    below = evaluate(
        base(
            "brown-planthopper",
            measurements={"insectsPerPlant": 8, "unit": "insects_per_plant"},
        )
    )
    missing = evaluate(base("brown-planthopper"))
    assert option(below, "CONTINUE_MONITORING")["eligibilityState"] == "eligible"
    assert option(missing, "CHEMICAL_REVIEW")["eligibilityState"] == "evidence-blocked"
    assert (
        option(missing, "NO_ACTION_CURRENTLY_JUSTIFIED")["eligibilityState"]
        == "information-required"
    )


def test_leaffolder_historical_damage_and_current_activity_remain_distinct() -> None:
    historical = evaluate(
        {
            **base("leaffolder"),
            "activityState": "HISTORICAL_DAMAGE_SUPPORTED",
            "newDamage": False,
        }
    )
    current = evaluate(
        base(
            "leaffolder",
            cropStage="rice_15_40_days",
            measurements={"percentAffectedLeaves": 16},
        )
    )
    assert option(historical, "CONTINUE_MONITORING")["eligibilityState"] == "eligible"
    assert (
        option(historical, "CHEMICAL_REVIEW")["eligibilityState"] == "evidence-blocked"
    )
    assert current["managementGate"] == "OPEN"


def test_investigation_families_do_not_invent_management_claims() -> None:
    for payload in (
        base("stem-borer-group", progressionState="PROGRESSION_SUPPORTED"),
        base("blast", progressionState="PROGRESSION_SUPPORTED"),
        base("brown-spot", progressionState="PROGRESSION_SUPPORTED"),
        base("rice-field-broadleaf"),
        {"subject": "nutrient-related-condition", "causeFamily": "ABIOTIC"},
    ):
        result = evaluate(payload)
        assert option(result, "CULTURAL_MANAGEMENT")["eligibilityState"] != "eligible"
        assert option(result, "CHEMICAL_REVIEW")["prescription"] is None
        assert result["execute"]["taskCreated"] is False


def test_multiple_nonchemical_options_are_case_derived_and_not_ranked() -> None:
    result = evaluate(
        base(
            "brown-planthopper",
            measurements={"insectsPerPlant": 10, "unit": "insects_per_plant"},
            governedManagementContext={
                "CULTURAL_MANAGEMENT": {
                    "caseRelevant": True,
                    "evidence": "governed case relationship",
                },
                "BIOLOGICAL_MANAGEMENT": {
                    "caseRelevant": True,
                    "evidence": "governed natural-enemy relationship",
                    "limitations": ["presence does not establish control"],
                },
            },
        )
    )
    assert option(result, "CULTURAL_MANAGEMENT")["eligibilityState"] == "eligible"
    assert option(result, "BIOLOGICAL_MANAGEMENT")["eligibilityState"] == "eligible"
    assert result["ordering"] == {
        "rule": "GOVERNED_CLASS_ORDER",
        "order": result["optionClasses"],
        "ranking": False,
        "commercialPreferenceUsed": False,
    }


def test_failed_control_requires_review_without_execution_or_learning() -> None:
    result = evaluate({"failedControlContext": {"states": ["MORE_EVIDENCE_REQUIRED"]}})
    assert option(result, "EXPERT_REVIEW")["humanReviewRequired"] is True
    assert result["humanReview"]["approvalInferred"] is False
    assert result["execute"]["applicationCreated"] is False
    assert result["learn"]["automaticLearning"] is False


def test_every_candidate_has_traceability_and_bounded_context() -> None:
    result = evaluate(
        base(
            "brown-planthopper",
            observations=["OBS-1"],
            measurements={"insectsPerPlant": 10, "unit": "insects_per_plant"},
        )
    )
    assert result["optionClasses"] == [
        item["optionClass"] for item in result["options"]
    ]
    for candidate in result["options"]:
        assert candidate["caseReference"] == "CASE-086"
        assert candidate["reviewedFinding"] and candidate["targetProblem"]
        assert candidate["eligibilityState"] in result["eligibilityStates"]
        assert candidate["provenance"] and candidate["evaluationContext"]["evaluatedAt"]
        assert candidate["explainability"]["caseEvidence"]["observations"] == ["OBS-1"]
        assert candidate["execution"] is None
    assert result["privacy"]["persistence"] == "BROWSER_LOCAL_ONLY"


def test_complete_authority_still_opens_only_human_chemical_review() -> None:
    suitability = {
        "caseReference": "CASE-086",
        "decisionTimestamp": None,
        "subject": "brown-planthopper",
        "needForAction": "MANAGEMENT_REVIEW_JUSTIFIED",
        "options": [
            {
                "optionClass": "CHEMICAL_MANAGEMENT_REVIEW",
                "state": "SUPPORTED_FOR_REVIEW",
                "why": "exact governed chain",
                "supporting": [],
                "missing": [],
                "limitations": [],
                "humanReviewRequired": False,
            }
        ],
        "regulatoryGate": {
            "keyB": {"satisfied": True, "status": "ELIGIBLE_FOR_DECISION_REVIEW"},
            "chemicalGate": "CHEMICAL_OPTIONS_READY_FOR_DECISION_REVIEW",
        },
        "nextBestDecisionQuestion": {
            "key": "MANAGEMENT_OPTIONS",
            "question": "Review options",
        },
        "explainability": {
            "identification": "PROVISIONAL_IDENTIFICATION",
            "currentActivity": "CURRENT_ACTIVITY_SUPPORTED",
            "progression": "UNRESOLVED",
            "burden": {},
            "actionEvidence": {},
            "humanReview": {},
            "provenance": {},
        },
    }
    result = evaluate(
        {**base("brown-planthopper"), "managementSuitability": suitability}
    )
    chemical = option(result, "CHEMICAL_REVIEW")
    assert (
        chemical["eligibilityState"] == "eligible"
        and chemical["humanReviewRequired"] is True
    )
    assert (
        chemical["explainability"]["nextGovernedStep"]
        == "HUMAN_CHEMICAL_DECISION_REVIEW"
    )
    assert result["chemicalBoundary"]["productSelected"] is False


def test_field_action_reentry_reuses_existing_single_action_architecture() -> None:
    result = evaluate(base("brown-planthopper"))
    assert result["fieldActionInteraction"]["architecture"] == "field-action-handoff/v1"
    assert result["fieldActionInteraction"]["createsAction"] is False
    assert (
        result["fieldActionInteraction"]["nextEvidence"]["key"] == "INSECTS_PER_PLANT"
    )
