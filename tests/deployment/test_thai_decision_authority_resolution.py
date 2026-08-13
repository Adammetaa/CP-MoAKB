import json
import subprocess
from typing import Any

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def js(expression: str) -> Any:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        f"process.stdout.write(JSON.stringify({expression}));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def test_resolution_reuses_architecture_and_reports_no_complete_chain() -> None:
    result = js("window.SPDecisionAuthority.decisionAuthorityResolution")
    assert result["primaryTarget"] == "brown-planthopper"
    assert result["completeChains"] == 0
    assert result["currentEligibleChains"] == 0
    assert result["recommendationProduced"] is False


def test_product_registration_number_join_fails_at_exact_recorded_steps() -> None:
    lead = js("window.SPDecisionAuthority.decisionAuthorityResolution.productLeads[0]")
    assert lead["registrationNumber"] == "405-2555"
    assert lead["officialMatch"] == "OFFICIAL_IDENTITY_MATCH"
    assert lead["joinMethod"] == "EXACT_REGISTRATION_NUMBER"
    assert lead["cropBinding"] is False
    assert lead["targetBinding"] is False
    assert lead["useBinding"] is False
    assert lead["reviewStatus"] == "REJECTED"
    assert "CURRENT_STATUS_UNRESOLVED" in lead["rejectionReasons"]


def test_nine_part_acceptance_never_waives_missing_authority() -> None:
    result = js(
        "window.SPDecisionAuthority.evaluateRegulatoryLead({registrationNumber:'405-2555',exactIdentity:true,officialEvidence:true,evidence:'GS-DOA-HAZARDOUS-REGISTRY-2568-001/v1',cropBinding:false,targetBinding:false,useBinding:false,currentStatus:'EXPIRED_DATE_RECORDED_CURRENT_RENEWAL_UNRESOLVED'})"
    )
    assert result["complete"] is False
    assert result["eligibility"] == "REGISTRATION_STATUS_UNRESOLVED"
    assert {"crop", "target", "use", "current"}.issubset(result["missing"])


def test_leaffolder_thai_action_evidence_preserves_stage_and_sampling_limits() -> None:
    evidence = js("window.SPDecisionAuthority.actionEvidence['leaffolder-thai']")
    assert evidence["thresholdType"] == "ACTION_THRESHOLD"
    assert evidence["thaiApplicability"] == "THAI_OPERATIONAL_EVIDENCE_WITH_LIMITATION"
    assert "15-40" in evidence["cropStage"]
    assert any("denominator" in item for item in evidence["limitations"])


def test_leaffolder_gate_uses_thai_criterion_without_chemical_eligibility() -> None:
    payload = {
        "subject": "leaffolder",
        "identificationState": "PROVISIONAL_IDENTIFICATION",
        "alternativesResolved": True,
        "activityState": "CURRENT_ACTIVITY_SUPPORTED",
        "cropStage": "rice_15_40_days",
        "measurements": {"percentAffectedLeaves": 16},
    }
    result = js(f"window.SPDecisionGates.evaluateNeedForAction({json.dumps(payload)})")
    assert result["needForAction"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert result["chemicalGate"] == "CHEMICAL_REVIEW_ELIGIBILITY_UNRESOLVED"
    assert result["recommendation"] is None


def test_bph_end_to_end_key_a_passes_key_b_remains_closed() -> None:
    payload = {
        "subject": "brown-planthopper",
        "identificationState": "PROVISIONAL_IDENTIFICATION",
        "alternativesResolved": True,
        "activityState": "CURRENT_ACTIVITY_SUPPORTED",
        "measurements": {"insectsPerPlant": 10, "unit": "insects_per_plant"},
    }
    result = js(f"window.SPDecisionGates.evaluateNeedForAction({json.dumps(payload)})")
    assert result["needForAction"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert result["twoKeyGate"]["keyA"]["satisfied"] is True
    assert result["twoKeyGate"]["keyB"]["satisfied"] is False
    assert result["chemicalGate"] == "CHEMICAL_REVIEW_ELIGIBILITY_UNRESOLVED"


def test_matrix_and_rejection_ledger_cover_every_priority_target() -> None:
    result = js("window.SPDecisionAuthority.decisionAuthorityResolution")
    assert len(result["matrix"]) == 6
    assert len(result["rejectedCandidates"]) >= 4
    assert all(row["blocker"] for row in result["matrix"])
