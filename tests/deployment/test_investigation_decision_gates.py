import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"
GATES = ASSISTANT / "assets" / "decision-gates.js"
APP = ASSISTANT / "assets" / "app.js"
HTML = ASSISTANT / "index.html"
POLISH = ASSISTANT / "assets" / "polish.css"
NODE = shutil.which("node") or str(
    Path.home()
    / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
)


def gate_source() -> str:
    return GATES.read_text(encoding="utf-8")


def evaluate(observations: list[str], candidates: list[dict[str, str]]) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(GATES))});"
        f"const result=window.SPDecisionGates.evaluate({json.dumps({'observations': observations, 'candidates': candidates}, ensure_ascii=False)});"
        "process.stdout.write(JSON.stringify(result));"
    )
    completed = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(completed.stdout)


def candidate(key: str, name: str, domain: str) -> dict[str, str]:
    return {"key": key, "name": name, "domain": domain}


def test_bounded_projection_uses_all_six_governed_evidence_roles() -> None:
    source = gate_source()
    for role in (
        "SUPPORTING",
        "REQUIRED_TO_DISTINGUISH",
        "CONTRADICTING",
        "CONTEXTUAL",
        "UNAVAILABLE",
        "UNRESOLVED",
    ):
        assert role in source
    assert "confidence" not in source.lower()
    assert "%" not in source


def test_insufficient_symptom_keeps_identification_blocked() -> None:
    result = evaluate(
        ["organ_leaf", "spot"],
        [
            candidate("brown-spot", "Brown spot", "Disease"),
            candidate("blast", "Blast", "Disease"),
        ],
    )
    assert {gate["identification"] for gate in result["candidateGates"]} == {
        "IDENTIFICATION_NOT_SUPPORTED"
    }
    assert result["nextBestEvidence"]["action"] == "ASK_OBSERVATION"
    assert result["management"]["status"] == "MANAGEMENT_REMAINS_BLOCKED"


def test_differential_preserves_brown_spot_and_blast_without_winner() -> None:
    result = evaluate(
        ["organ_leaf", "spot"],
        [
            candidate("brown-spot", "Brown spot", "Disease"),
            candidate("blast", "Blast", "Disease"),
        ],
    )
    assert [gate["key"] for gate in result["candidateGates"]] == ["brown-spot", "blast"]
    assert all(gate["alternativesUnresolved"] for gate in result["candidateGates"])


def test_blast_provisional_is_bounded_and_requires_human_review() -> None:
    result = evaluate(
        ["organ_leaf", "spot", "eye_shaped_lesion", "gray_center"],
        [candidate("blast", "Blast", "Disease")],
    )
    gate = result["candidateGates"][0]
    assert gate["sufficiency"] == "SUFFICIENT_FOR_PROVISIONAL_IDENTIFICATION"
    assert gate["identification"] == "PROVISIONAL_IDENTIFICATION"
    assert "เว็บไซต์" in gate["confirmation"]
    assert result["humanReview"]["required"] is True


def test_brown_spot_distinguishing_cue_can_reach_provisional_only() -> None:
    result = evaluate(
        ["organ_leaf", "spot", "brown_round_oval"],
        [candidate("brown-spot", "Brown spot", "Disease")],
    )
    gate = result["candidateGates"][0]
    assert gate["identification"] == "PROVISIONAL_IDENTIFICATION"
    assert gate["level"] == "field-level provisional identification"


def test_contradictory_evidence_is_explicit() -> None:
    result = evaluate(
        ["organ_leaf", "spot", "brown_round_oval", "eye_shaped_lesion"],
        [candidate("brown-spot", "Brown spot", "Disease")],
    )
    gate = result["candidateGates"][0]
    assert gate["contradicting"][0]["role"] == "CONTRADICTING"
    assert gate["identification"] == "IDENTIFICATION_NOT_SUPPORTED"


def test_next_evidence_does_not_prioritize_a_contradicted_alternative() -> None:
    result = evaluate(
        ["organ_leaf", "spot", "eye_shaped_lesion", "gray_center"],
        [
            candidate("brown-spot", "Brown spot", "Disease"),
            candidate("blast", "Blast", "Disease"),
        ],
    )
    assert result["candidateGates"][0]["contradicting"]
    assert result["candidateGates"][1]["identification"] == "PROVISIONAL_IDENTIFICATION"
    assert result["nextBestEvidence"]["action"] == "EXPERT_REVIEW"


def test_leaffolder_uses_damage_and_tiny_insect_fallback_boundary() -> None:
    result = evaluate(
        ["organ_leaf", "folded_leaf", "feeding_scar"],
        [candidate("leaffolder", "Leaffolder", "Insect")],
    )
    gate = result["candidateGates"][0]
    assert gate["identification"] == "PROVISIONAL_IDENTIFICATION"
    assert "Tiny Insect Fallback" in gate["confirmation"]


def test_planthopper_damage_alone_does_not_identify_species() -> None:
    result = evaluate(
        ["wilt", "field_distribution"],
        [candidate("brown-planthopper", "BPH", "Insect")],
    )
    gate = result["candidateGates"][0]
    assert gate["identification"] == "IDENTIFICATION_NOT_SUPPORTED"
    assert {item["cue"] for item in gate["missing"]} == {"organ_stem", "hopper"}


def test_weed_identification_stays_at_supported_group_level() -> None:
    sedge = evaluate(
        ["weed_plant", "triangular_stem"], [candidate("sedge-group", "Sedge", "Weed")]
    )["candidateGates"][0]
    broadleaf = evaluate(
        ["weed_plant", "broad_leaf"],
        [candidate("rice-field-broadleaf", "Broadleaf", "Weed")],
    )["candidateGates"][0]
    assert (
        sedge["level"] == broadleaf["level"] == "group-level provisional identification"
    )
    assert "ชื่อวิทยาศาสตร์" in sedge["confirmation"]
    assert "ชื่อวิทยาศาสตร์" in broadleaf["confirmation"]


def test_severity_records_observable_burden_without_thresholds() -> None:
    result = evaluate(["field_distribution", "wilt"], [])
    assert result["severity"]["status"] == "OBSERVABLE_BURDEN_RECORDED"
    assert result["severity"]["thresholds"] == []
    assert "ไม่มีเกณฑ์เชิงปริมาณ" in result["severity"]["limitation"]


def test_severity_is_independent_and_blocked_without_extent() -> None:
    result = evaluate(
        ["organ_leaf", "spot", "eye_shaped_lesion", "gray_center"],
        [candidate("blast", "Blast", "Disease")],
    )
    assert result["candidateGates"][0]["identification"] == "PROVISIONAL_IDENTIFICATION"
    assert result["severity"]["status"] == "SEVERITY_EVIDENCE_INSUFFICIENT"


def test_need_for_action_and_chemical_selection_remain_blocked() -> None:
    result = evaluate(["field_distribution"], [])
    assert result["needForAction"]["status"] == "NO_ACTION_DETERMINATION_SUPPORTED"
    assert "ไม่มี action threshold" in result["needForAction"]["basis"]
    assert result["management"]["chemicalRecommendation"] == "BLOCKED"
    assert "Crop–Target–Use–Registration" in result["management"]["limitation"]


def test_failed_control_routes_to_human_review_not_resistance() -> None:
    result = evaluate(["failed_control"], [])
    assert result["management"]["status"] == "HUMAN_REVIEW_REQUIRED"
    assert "failed-control investigation" in result["humanReview"]["reasons"]
    assert "CONTROL FAILURE ≠ RESISTANCE" in result["boundaries"]


def test_weather_nearby_and_photo_are_non_escalating_boundaries() -> None:
    boundaries = evaluate([], [])["boundaries"]
    assert "Weather alone cannot escalate identification" in boundaries
    assert "Nearby Case cannot escalate identification" in boundaries
    assert "Photo received ≠ Photo analyzed" in boundaries


def test_traceability_reaches_claim_evidence_and_exact_locator() -> None:
    result = evaluate(["organ_leaf", "spot"], [candidate("blast", "Blast", "Disease")])
    supporting = result["candidateGates"][0]["supporting"]
    assert all(item["claim"].startswith("CL-") for item in supporting)
    assert all(item["evidence"].startswith("EV-") for item in supporting)
    assert all("pp." in item["locator"] for item in supporting)


def test_app_integrates_gate_as_case_projection_and_next_best_evidence() -> None:
    app = APP.read_text(encoding="utf-8")
    assert "window.SPDecisionGates?.evaluate" in app
    assert "data-decision-gates" in app
    assert "decisionGap?.action" in app
    assert "REQUIRED_TO_DISTINGUISH" in gate_source()


def test_ui_freeze_assets_and_grammar_are_unchanged() -> None:
    html = HTML.read_text(encoding="utf-8")
    app = APP.read_text(encoding="utf-8")
    polish = POLISH.read_text(encoding="utf-8")
    assert '<link rel="stylesheet" href="assets/styles.css">' in html
    assert "assets/chat.css" in app
    assert "assets/polish.css" in app
    assert ".user-turn" in polish
    assert ".assistant-turn" in polish
    assert ".system-turn" in polish
    assert "positionAttachmentMenu" in app
    assert "timestamp-toggle" in app
    assert "jump-latest" in app


def test_no_backend_persistence_llm_cv_or_recommendation_capability() -> None:
    combined = gate_source() + APP.read_text(encoding="utf-8")
    for prohibited in (
        "localStorage",
        "sessionStorage",
        "indexedDB",
        "WebSocket",
        "OpenAI",
        "ChatGPT",
        "computer vision",
        "image classification",
    ):
        assert prohibited not in combined
    assert 'chemicalRecommendation: "BLOCKED"' in combined
