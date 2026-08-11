import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"
AUTHORITY = ASSISTANT / "assets" / "decision-authority.js"
GATES = ASSISTANT / "assets" / "decision-gates.js"
APP = ASSISTANT / "assets" / "app.js"
DOCS = ROOT / "docs" / "knowledge" / "action-crop-target-use-001"
NODE = shutil.which("node") or str(
    Path.home()
    / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
)


def run_js(expression: str) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});"
        f"require({json.dumps(str(GATES))});"
        f"const value={expression};process.stdout.write(JSON.stringify(value));"
    )
    completed = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(completed.stdout)


def evaluate(
    observations: list[str],
    measurements: dict[str, float] | None = None,
    key: str = "brown-planthopper",
) -> dict:
    domain = (
        "Insect"
        if key in {"brown-planthopper", "leaffolder"}
        else "Disease" if key in {"brown-spot", "blast"} else "Weed"
    )
    payload = {
        "observations": observations,
        "measurements": measurements or {},
        "candidates": [{"key": key, "name": key, "domain": domain}],
    }
    return run_js(f"window.SPDecisionGates.evaluate({json.dumps(payload)})")


def test_authority_uses_existing_record_and_projection_boundaries() -> None:
    authority = run_js("window.SPDecisionAuthority")
    assert authority["version"] == "action-crop-target-use-authority/v1"
    assert authority["actionEvidence"]["brown-planthopper"]["claim"].startswith("CL-")
    assert authority["actionEvidence"]["brown-planthopper"]["evidence"].startswith(
        "EV-"
    )
    assert authority["registration"]["id"].startswith("RA-")


def test_thai_bph_threshold_preserves_type_unit_method_and_limitations() -> None:
    evidence = run_js('window.SPDecisionAuthority.actionEvidence["brown-planthopper"]')
    assert evidence["thresholdType"] == "Economic Threshold"
    assert evidence["triggerValue"] == 10
    assert evidence["unit"] == "insects_per_plant"
    assert evidence["thaiApplicability"] == "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION"
    assert "point-versus-plant" in evidence["samplingMethod"]
    assert len(evidence["limitations"]) == 3


def test_bph_threshold_measurement_missing_requests_exact_field_measurement() -> None:
    result = evaluate(["organ_stem", "hopper"])
    assert result["candidateGates"][0]["identification"] == "PROVISIONAL_IDENTIFICATION"
    assert result["needForAction"]["status"] == "MORE_EVIDENCE_REQUIRED"
    assert (
        result["needForAction"]["requiredMeasurement"]
        == "average insects per rice plant"
    )
    assert result["management"]["status"] == "MORE_EVIDENCE_REQUIRED"


def test_bph_below_threshold_continues_monitoring() -> None:
    result = evaluate(["organ_stem", "hopper"], {"insectsPerPlant": 9})
    assert result["needForAction"]["status"] == "CONTINUE_MONITORING"
    assert result["needForAction"]["observedValue"] == 9
    assert result["management"]["status"] == "MANAGEMENT_REMAINS_BLOCKED"


def test_bph_at_threshold_opens_management_review_not_chemical_review() -> None:
    result = evaluate(["organ_stem", "hopper"], {"insectsPerPlant": 10})
    assert result["needForAction"]["status"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert result["management"]["status"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert result["management"]["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"
    assert result["management"]["chemicalRecommendation"] == "BLOCKED"
    assert result["management"]["eligibleOptions"] == []


def test_subjects_without_thai_action_authority_remain_unresolved() -> None:
    scenarios = {
        "brown-spot": ["organ_leaf", "spot", "brown_round_oval"],
        "blast": ["organ_leaf", "spot", "eye_shaped_lesion", "gray_center"],
        "leaffolder": ["organ_leaf", "folded_leaf", "feeding_scar"],
        "rice-field-broadleaf": ["weed_plant", "broad_leaf"],
        "sedge-group": ["weed_plant", "triangular_stem"],
    }
    for key, observations in scenarios.items():
        result = evaluate(observations, key=key)
        assert result["needForAction"]["status"] == "NO_ACTION_DETERMINATION_SUPPORTED"
        assert result["management"]["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"


def test_foreign_thresholds_remain_reference_only() -> None:
    authority = run_js("window.SPDecisionAuthority.actionEvidence")
    assert authority["leaffolder"]["thaiApplicability"] == "REFERENCE_EVIDENCE_ONLY"
    assert (
        authority["brown-planthopper-reference"]["thaiApplicability"]
        == "REFERENCE_EVIDENCE_ONLY"
    )
    assert authority["leaffolder"]["triggerValue"] is None


def test_registration_search_counts_and_identity_only_state_are_explicit() -> None:
    registration = run_js("window.SPDecisionAuthority.registration")
    assert registration["recordsSearched"] == 3501
    assert registration["identitiesSearched"] == 18
    assert registration["exactIdentityMatches"] == 17
    assert registration["completeCropTargetUseChains"] == 0
    assert registration["ambiguousChains"] == 17
    assert registration["rejectedChains"] == 1
    assert registration["status"] == "REGISTRATION_IDENTITY_MATCH_ONLY"


def test_no_crop_target_use_chain_means_no_eligible_option() -> None:
    registration = run_js("window.SPDecisionAuthority.registration")
    assert registration["cropMatches"] == 0
    assert registration["targetMatches"] == 0
    assert registration["eligibleOptions"] == []
    assert registration["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"


def test_identity_normalization_and_mixture_policy_are_conservative() -> None:
    registration = run_js("window.SPDecisionAuthority.registration")
    assert "salts" in registration["identityPolicy"]
    assert "esters" in registration["identityPolicy"]
    assert "preserve exact mixture identity" in registration["mixturePolicy"]
    assert "never project" in registration["mixturePolicy"]


def test_priority_identity_matches_are_unranked_identity_context_only() -> None:
    registration = run_js("window.SPDecisionAuthority.registration")
    assert set(registration["priorityIdentityMatches"]) == {
        "brown-spot",
        "blast",
        "leaffolder",
        "brown-planthopper",
        "rice-field-broadleaf",
        "sedge-group",
    }
    assert all(
        isinstance(items, list)
        for items in registration["priorityIdentityMatches"].values()
    )
    assert registration["eligibleOptions"] == []


def test_failed_control_weather_nearby_and_photo_do_not_open_chemical_gate() -> None:
    failed = evaluate(["failed_control"])
    assert failed["management"]["status"] == "HUMAN_REVIEW_REQUIRED"
    assert failed["management"]["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"
    assert "CONTROL FAILURE ≠ RESISTANCE" in failed["boundaries"]
    assert "Weather alone cannot escalate identification" in failed["boundaries"]
    assert "Nearby Case cannot escalate identification" in failed["boundaries"]
    assert "Photo received ≠ Photo analyzed" in failed["boundaries"]


def test_app_parses_bounded_density_and_targets_next_action_measurement() -> None:
    app = APP.read_text(encoding="utf-8")
    assert "insectsPerPlant" in app
    assert "average insects per rice plant" in app
    assert "สุ่มนับเพลี้ยบริเวณโคนต้นแล้วพบเฉลี่ยกี่ตัวต่อต้น" in app
    assert "measurements })" in app


def test_governed_docs_capture_sources_matrix_and_gap_families() -> None:
    combined = "\n".join(path.read_text(encoding="utf-8") for path in DOCS.glob("*.md"))
    for required in (
        "GS-RD-ANNUAL-2023-BPH-001/v1",
        "GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1",
        "Economic Threshold",
        "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION",
        "REFERENCE_EVIDENCE_ONLY",
        "REGISTRATION_IDENTITY_MATCH_ONLY",
        "Scientific",
        "action-threshold gap",
        "Thai-local validation gap",
        "regulatory gap",
        "efficacy gap",
        "resistance gap",
    ):
        assert required in combined


def test_no_recommendation_ranking_dose_or_probability_capability() -> None:
    combined = AUTHORITY.read_text(encoding="utf-8") + GATES.read_text(encoding="utf-8")
    for prohibited in (
        "CHEMICAL_RECOMMENDATION",
        "ELIGIBLE_OPTIONS_AVAILABLE_FOR_REVIEW",
        "best option",
        "rankedOptions",
        "doseRecommendation",
        "probability",
        "confidenceScore",
    ):
        assert prohibited not in combined
    assert 'chemicalRecommendation: "BLOCKED"' in combined
