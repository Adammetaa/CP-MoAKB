import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def differential(payload: dict) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        f"const r=window.SPDecisionGates.evaluateAbioticDifferential({json.dumps(payload)});"
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


def test_yellowing_retains_biotic_and_abiotic_without_nutrient_diagnosis() -> None:
    result = differential(
        {"observableFamily": "yellowing_paling", "observations": ["yellow_or_pale"]}
    )
    assert "MULTIPLE_CAUSE_FAMILIES_REMAIN" in result["investigationStates"]
    assert "NUTRIENT_CAUSE_NOT_ESTABLISHED" in result["investigationStates"]
    assert result["recommendation"] is None
    assert result["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"


def test_nutrient_patterns_are_traceable_but_not_diagnoses() -> None:
    result = differential(
        {
            "observableFamily": "leaf_tip_margin_drying",
            "observations": ["older_leaf_tip_or_margin_injury"],
        }
    )
    potassium = next(
        item
        for item in result["candidates"]
        if item["key"] == "potassium-related-condition"
    )
    assert potassium["status"] == "SOURCE_PATTERN_SUPPORTED_NOT_DIAGNOSIS"
    assert potassium["claim"] == "CL-RAD-002-O/v1"
    assert potassium["evidence"] == "EV-RAD-002/v1"


def test_water_root_plant_response_are_separate() -> None:
    result = differential(
        {
            "observableFamily": "poor_root_condition",
            "fieldWater": "standing",
            "rootCondition": "black",
            "plantResponse": "stunted",
        }
    )
    assert result["observations"]["fieldWater"]["role"] == "CONTEXTUAL"
    assert result["observations"]["rootCondition"]["role"] == "REQUIRED_TO_DISTINGUISH"
    assert result["observations"]["plantResponse"]["role"] == "CONTEXTUAL"
    assert "WATER_ROOT_CAUSE_NOT_ESTABLISHED" in result["investigationStates"]


def test_post_application_order_and_pattern_remain_noncausal() -> None:
    result = differential(
        {
            "observableFamily": "post_application_abnormality",
            "distribution": "application_line",
            "applicationContext": {"method": "drone"},
            "eventOrder": ["application", "first_noticed", "T1"],
        }
    )
    assert "CHEMICAL_INJURY_NOT_ESTABLISHED" in result["investigationStates"]
    assert result["spatial"]["applicationPattern"] is True
    assert result["spatial"]["boundary"] == "SPATIAL PATTERN ≠ CAUSE"
    assert result["temporal"]["boundary"] == "TEMPORAL ASSOCIATION ≠ CAUSATION"


def test_photo_weather_failed_control_and_recovery_boundaries() -> None:
    result = differential(
        {
            "observableFamily": "wilting",
            "environment": {"rain": True},
            "temporalObservations": [
                {"observationTime": "T1", "source": "USER_PHOTO"},
                {
                    "observationTime": "T2",
                    "source": "USER_PHOTO",
                    "newHealthyGrowth": True,
                },
            ],
        }
    )
    assert result["observations"]["environment"]["role"] == "CONTEXTUAL"
    assert result["photoMission"]["automaticImageAnalysis"] is False
    assert "COMPARISON" in result["photoMission"]["captureScales"]
    assert result["failedControl"]["boundary"] == "CONTROL FAILURE ≠ RESISTANCE"
    assert result["temporal"]["recovery"] == "NEW_HEALTHY_GROWTH_OBSERVED"
    assert (
        result["knowledgeGaps"]["RECOVERY"]
        == "CONDITION_SPECIFIC_RECOVERY_RELATIONSHIPS_UNRESOLVED"
    )


def test_understand_domains_and_action_boundary_are_explicit() -> None:
    result = differential({})
    assert "Chemical / Application Context" in result["understandDomains"]
    assert "Resistance Context" in result["understandDomains"]
    assert result["needForAction"] == "NOT_EVALUATED"
    assert (
        result["knowledgeGaps"]["CHEMICAL INJURY"]
        == "PRODUCT_OR_ACTIVE_SPECIFIC_CAUSATION_UNRESOLVED"
    )
