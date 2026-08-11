import json
from typing import cast

from tests.deployment.test_action_crop_target_use_authority import evaluate, run_js


def state(chain: dict) -> str:
    return cast(str, run_js(f"window.SPDecisionAuthority.evaluateRegulatoryChain({json.dumps(chain)})"))


def test_bounded_eligibility_states_are_complete() -> None:
    assert set(run_js("window.SPDecisionAuthority.eligibilityStates")) == {
        "NO_REGULATORY_EVIDENCE", "REGISTRATION_IDENTITY_MATCH_ONLY",
        "REGULATORY_RELATIONSHIP_AMBIGUOUS", "REGISTRATION_STATUS_UNRESOLVED",
        "ELIGIBLE_FOR_DECISION_REVIEW", "HUMAN_REVIEW_REQUIRED",
    }


def test_identity_ambiguous_status_and_complete_chain_scenarios() -> None:
    assert state({"officialEvidence": True, "identity": "A"}) == "REGISTRATION_IDENTITY_MATCH_ONLY"
    assert state({"officialEvidence": True, "identity": "A", "crop": "ข้าว", "target": "T", "useContext": "U"}) == "REGULATORY_RELATIONSHIP_AMBIGUOUS"
    joined = {"officialEvidence": True, "identity": "A", "crop": "ข้าว", "target": "T", "useContext": "U", "recordIdentifier": "R-1", "defensibleJoinKey": True}
    assert state(joined) == "REGISTRATION_STATUS_UNRESOLVED"
    assert state({**joined, "registrationStatus": "CURRENTLY_REGISTERED"}) == "ELIGIBLE_FOR_DECISION_REVIEW"


def test_mixture_remains_one_regulatory_identity() -> None:
    chain = {"officialEvidence": True, "identity": "A + B", "crop": "ข้าว", "target": "T", "useContext": "U", "recordIdentifier": "R-2", "defensibleJoinKey": True, "registrationStatus": "CURRENTLY_REGISTERED"}
    assert state(chain) == "ELIGIBLE_FOR_DECISION_REVIEW"
    assert chain["identity"] == "A + B"


def test_recovered_priority_evidence_remains_blocked_without_join_key() -> None:
    review = run_js("window.SPDecisionAuthority.priorityRegulatoryReview")
    assert review["brown-planthopper"]["status"] == "REGULATORY_RELATIONSHIP_AMBIGUOUS"
    assert review["leaffolder"]["status"] == "REGULATORY_RELATIONSHIP_AMBIGUOUS"
    assert review["blast"]["status"] == "REGISTRATION_IDENTITY_MATCH_ONLY"
    assert all(not item["defensibleJoinKey"] for item in review.values())


def test_two_key_gate_stays_closed_for_ambiguous_production_evidence() -> None:
    result = evaluate(["organ_stem", "hopper"], {"insectsPerPlant": 12})
    assert result["needForAction"]["status"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert result["management"]["registrationStatus"] == "REGULATORY_RELATIONSHIP_AMBIGUOUS"
    assert result["management"]["chemicalGate"] == "CHEMICAL_REVIEW_BLOCKED"
    assert result["management"]["chemicalRecommendation"] == "BLOCKED"
