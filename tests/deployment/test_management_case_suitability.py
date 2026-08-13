import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def suitability(payload: dict) -> dict:
    script = (
        "global.window={};"
        + f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        + f"process.stdout.write(JSON.stringify(window.SPDecisionGates.evaluateManagementSuitability({json.dumps(payload)})));"
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
        "subject": subject,
        "identificationState": "PROVISIONAL_IDENTIFICATION",
        "alternativesResolved": True,
        "activityState": "CURRENT_ACTIVITY_SUPPORTED",
        **values,
    }


def get_option(result: dict, name: str) -> dict:
    return next(item for item in result["options"] if item["optionClass"] == name)


def test_bph_missing_burden_asks_exactly_one_count_question() -> None:
    result = suitability(base("brown-planthopper"))
    assert result["needForAction"] == "MORE_EVIDENCE_REQUIRED"
    assert result["nextBestDecisionQuestion"]["key"] == "INSECTS_PER_PLANT"
    assert (
        get_option(result, "CHEMICAL_MANAGEMENT_REVIEW")["state"]
        == "NOT_SUPPORTED_BY_CURRENT_EVIDENCE"
    )


def test_bph_below_threshold_supports_monitoring_not_chemical_review() -> None:
    result = suitability(
        base(
            "brown-planthopper",
            measurements={"insectsPerPlant": 9, "unit": "insects_per_plant"},
        )
    )
    assert get_option(result, "MONITORING")["state"] == "SUPPORTED_FOR_REVIEW"
    assert (
        get_option(result, "CHEMICAL_MANAGEMENT_REVIEW")["state"]
        == "NOT_SUPPORTED_BY_CURRENT_EVIDENCE"
    )


def test_bph_threshold_allows_multiple_options_but_key_b_blocks_chemistry() -> None:
    result = suitability(
        base(
            "brown-planthopper",
            measurements={"insectsPerPlant": 10, "unit": "insects_per_plant"},
        )
    )
    assert result["needForAction"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert (
        get_option(result, "CHEMICAL_MANAGEMENT_REVIEW")["state"]
        == "BLOCKED_BY_AUTHORITY"
    )
    assert get_option(result, "EXPERT_REVIEW")["state"] == "SUPPORTED_FOR_REVIEW"
    assert result["productRecommendation"] is None


def test_historical_leaffolder_damage_supports_monitoring_without_treatment() -> None:
    result = suitability(
        {
            "subject": "leaffolder",
            "identificationState": "PROVISIONAL_IDENTIFICATION",
            "alternativesResolved": True,
            "activityState": "HISTORICAL_DAMAGE_SUPPORTED",
            "newDamage": False,
        }
    )
    assert get_option(result, "MONITORING")["state"] == "SUPPORTED_FOR_REVIEW"
    assert (
        get_option(result, "CHEMICAL_MANAGEMENT_REVIEW")["state"]
        == "NOT_SUPPORTED_BY_CURRENT_EVIDENCE"
    )


def test_leaffolder_stage_incidence_is_preserved_with_regulatory_block() -> None:
    result = suitability(
        base(
            "leaffolder",
            cropStage="rice_15_40_days",
            measurements={"percentAffectedLeaves": 16},
        )
    )
    assert result["needForAction"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert (
        get_option(result, "CHEMICAL_MANAGEMENT_REVIEW")["state"]
        == "BLOCKED_BY_AUTHORITY"
    )


def test_disease_weed_and_abiotic_do_not_invent_management() -> None:
    for payload in (
        base("blast", progressionState="PROGRESSION_SUPPORTED"),
        base("rice-field-broadleaf"),
        {"subject": "nutrient-related-condition", "causeFamily": "ABIOTIC"},
    ):
        result = suitability(payload)
        assert (
            get_option(result, "CULTURAL_MANAGEMENT")["state"]
            == "NOT_SUPPORTED_BY_CURRENT_EVIDENCE"
        )
        assert (
            get_option(result, "WATER_MANAGEMENT")["state"]
            == "NOT_SUPPORTED_BY_CURRENT_EVIDENCE"
        )
        assert result["rateRecommendation"] is None


def test_governed_context_can_support_review_without_instruction() -> None:
    result = suitability(
        base(
            "brown-planthopper",
            governedManagementContext={
                "BIOLOGICAL_MANAGEMENT": {
                    "caseRelevant": True,
                    "evidence": "governed natural-enemy relationship",
                    "limitations": ["presence does not establish control"],
                }
            },
        )
    )
    biological = get_option(result, "BIOLOGICAL_MANAGEMENT")
    assert biological["state"] == "SUPPORTED_FOR_REVIEW"
    assert (
        biological["suitabilityBoundary"] == "SUITABILITY FOR REVIEW ≠ RECOMMENDATION"
    )


def test_failed_control_weather_nearby_and_drone_keep_boundaries() -> None:
    result = suitability(
        {
            "failedControlContext": {"states": ["MORE_EVIDENCE_REQUIRED"]},
            "weatherContext": {"humidity": "high"},
            "nearbyCase": True,
            "applicationQualityObservation": {"overlap": True},
        }
    )
    assert result["nextBestDecisionQuestion"]["key"] == "APPLICATION_PATTERN_INSPECTION"
    assert get_option(result, "EXPERT_REVIEW")["state"] == "SUPPORTED_FOR_REVIEW"
    assert result["execution"]["droneMissionCreated"] is False


def test_every_option_is_explainable_and_order_is_not_ranking() -> None:
    result = suitability({})
    assert len(result["options"]) == 9
    assert all(item["why"] and "limitations" in item for item in result["options"])
    assert "not best" in result["orderingSemantics"]
    assert result["nextBestDecisionQuestion"]["action"] == "ASK_EXACTLY_ONE"
    assert result["learn"]["canonicalPromotion"] is False
