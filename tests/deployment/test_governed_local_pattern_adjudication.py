from __future__ import annotations

import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT
from tests.deployment.test_multi_source_knowledge_integration import project

AUTHORITY = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-authority.js"
GATES = ROOT / "prototype" / "sp-assistant" / "assets" / "decision-gates.js"


def evaluate(payload: dict) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(AUTHORITY))});require({json.dumps(str(GATES))});"
        "process.stdout.write(JSON.stringify("
        f"window.SPDecisionGates.evaluateLocalPatternAdjudication({json.dumps(payload)})));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def case(case_id: str, **values: object) -> dict:
    return {
        "id": case_id,
        "caseReference": f"CASE-{case_id}",
        "outcomeReviewReference": f"ORV-{case_id}",
        "applicationEventReference": f"APP-{case_id}",
        "applicationContextReference": f"ACV-{case_id}",
        "depositionEvidenceReference": f"DCV-{case_id}",
        "target": "brown-planthopper",
        "targetIdentityState": "SUPPORTED",
        "crop": "rice",
        "cropStage": "tillering",
        "effectiveOutcomePhases": ["T0", "T1", "T2"],
        "humanComparison": "DECREASE_OBSERVED",
        "independenceState": "INDEPENDENT",
        "spatialContext": f"field-{case_id}",
        "temporalContext": f"application-date-{case_id}",
        "samplingState": "COMPATIBLE",
        "applicationContextState": "COMPLETE",
        "depositionState": "TARGET_LOCATION_MEASURED",
        "rawOutcomeValues": {"T0": 10, "T1": 6, "T2": 3, "unit": "insects/plant"},
        "alternativeExplanations": [],
        "sourceRevision": "v1",
        "adjudicationRevision": "v1",
        "provenance": [f"CASE-{case_id}", f"ORV-{case_id}", f"APP-{case_id}"],
        **values,
    }


def candidate(*case_ids: str, **values: object) -> dict:
    return {
        "id": "LPC-095-TEST",
        "reviewQuestion": "Is this BPH pattern suitable for further governed review?",
        "granularity": "PRODUCT_LEVEL",
        "descriptivePattern": "Included Cases show a similar recorded direction.",
        "caseIds": list(case_ids),
        "excludedCases": [],
        "comparisonFindings": ["PARTIALLY_COMPARABLE"],
        "limitations": ["Case-derived evidence only"],
        "conflicts": [],
        "correctionLineage": [],
        "provenance": ["CCS-094", "LPC-095-TEST"],
        **values,
    }


def review(
    state: str, decision: str = "REQUEST_MORE_EVIDENCE", **values: object
) -> dict:
    return {
        "submittedExplicitly": True,
        "state": state,
        "decision": decision,
        "reviewer": "REVIEWER-1",
        "reviewerRole": "AGRONOMIC_REVIEWER",
        "reviewerScope": "evidence sufficiency only",
        "rationale": "Explicit governed Human Review.",
        **values,
    }


def base(**values: object) -> dict:
    return {
        "adjudicationId": "LPA-095-TEST",
        "patternCandidate": candidate("A", "B"),
        "cases": [case("A"), case("B")],
        "comparableCaseCount": 2,
        "partiallyComparableCaseCount": 0,
        "intendedReviewStrength": "EXPLORATORY_PATTERN",
        **values,
    }


def dimensions(result: dict) -> dict[str, dict]:
    return {item["id"]: item for item in result["dimensions"]}


def test_pattern_candidate_enters_adjudication_with_identity_and_scope() -> None:
    result = evaluate(base())
    pattern = result["patternCandidate"]
    assert result["model"] == "local-pattern-adjudication/v1"
    assert pattern["id"] == "LPC-095-TEST"
    assert pattern["reviewQuestion"].startswith("Is this BPH pattern")
    assert pattern["granularity"] == "PRODUCT_LEVEL"
    assert pattern["includedCaseIds"] == ["A", "B"]
    assert pattern["descriptivePattern"]
    assert pattern["provenance"] == ["CCS-094", "LPC-095-TEST"]


def test_all_sufficiency_dimensions_and_case_counts_are_explainable() -> None:
    result = evaluate(base())
    expected = {
        "case_count",
        "case_independence",
        "spatial_diversity",
        "temporal_diversity",
        "target_consistency",
        "crop_stage_consistency",
        "outcome_completeness",
        "sampling_consistency",
        "application_context_completeness",
        "target_deposition_evidence",
        "outcome_direction",
        "magnitude_compatibility",
        "conflicting_evidence",
        "alternative_explanations",
        "source_completeness",
        "correction_staleness",
    }
    dimension_map = dimensions(result)
    assert set(dimension_map) == expected
    assert dimension_map["case_count"]["totalConsidered"] == 2
    assert dimension_map["case_count"]["included"] == 2
    assert dimension_map["case_count"]["excluded"] == 0
    assert dimension_map["case_count"]["universalMinimum"] is None
    assert all(item["hiddenWeight"] is None for item in result["dimensions"])
    assert result["rationale"]["hiddenWeighting"] is False
    assert result["rationale"]["sufficiencyScore"] is None


def test_case_independence_detects_duplicate_case_and_application_event() -> None:
    duplicate = case("A")
    duplicate["applicationEventReference"] = "APP-A"
    result = evaluate(
        base(
            patternCandidate=candidate("A", "A"),
            cases=[case("A"), duplicate],
            humanAdjudication=review("SUFFICIENT_FOR_FURTHER_REVIEW"),
        )
    )
    independence = dimensions(result)["case_independence"]
    assert independence["state"] == "CONFLICTING"
    assert independence["duplicateCaseIds"] == ["A"]
    assert independence["duplicatedEvents"] == ["APP-A"]
    assert result["adjudicationState"] == "CONFLICTING_EVIDENCE"


def test_spatial_temporal_target_crop_and_stage_assessments_are_bounded() -> None:
    same_context = case(
        "B", spatialContext="field-A", temporalContext="application-date-A"
    )
    result = evaluate(base(cases=[case("A"), same_context]))
    dimension_map = dimensions(result)
    assert dimension_map["spatial_diversity"]["state"] == "LIMITED"
    assert dimension_map["temporal_diversity"]["state"] == "LIMITED"
    assert dimension_map["target_consistency"]["state"] == "ADEQUATE"
    assert dimension_map["crop_stage_consistency"]["state"] == "ADEQUATE"
    conflicting = evaluate(base(cases=[case("A"), case("B", target="leaffolder")]))
    assert dimensions(conflicting)["target_consistency"]["state"] == "CONFLICTING"


def test_outcome_sampling_application_and_deposition_completeness_remain_explicit() -> (
    None
):
    limited = case(
        "B",
        effectiveOutcomePhases=["T0", "T1"],
        samplingState="LIMITED",
        applicationContextState="INCOMPLETE",
        depositionState="TARGET_LOCATION_UNMEASURED",
    )
    result = evaluate(base(cases=[case("A"), limited]))
    dimension_map = dimensions(result)
    assert dimension_map["outcome_completeness"]["state"] == "LIMITED"
    assert dimension_map["sampling_consistency"]["state"] == "LIMITED"
    assert dimension_map["application_context_completeness"]["state"] == "LIMITED"
    assert dimension_map["target_deposition_evidence"]["state"] == "LIMITED"
    assert result["evidenceRequest"]["count"] == 1
    assert result["evidenceRequest"]["treatmentTask"] is False
    assert result["evidenceRequest"]["repeatTreatmentTask"] is False
    assert result["evidenceRequest"]["doseIncreaseTask"] is False


def test_direction_conflicts_and_alternative_explanations_are_not_suppressed() -> None:
    no_change = case(
        "C",
        humanComparison="NO_CLEAR_CHANGE",
        alternativeExplanations=["weather", "neighboring treatment"],
    )
    result = evaluate(
        base(
            patternCandidate=candidate("A", "B", "C"),
            cases=[case("A"), case("B"), no_change],
            retainedConflictingCases=["C"],
        )
    )
    dimension_map = dimensions(result)
    assert dimension_map["outcome_direction"]["state"] == "CONFLICTING"
    assert dimension_map["conflicting_evidence"]["state"] == "CONFLICTING"
    assert dimension_map["conflicting_evidence"]["retainedCases"] == ["C"]
    assert dimension_map["alternative_explanations"]["state"] == "LIMITED"
    assert result["adjudicationState"] == "CONFLICTING_EVIDENCE"


def test_all_six_adjudication_states_are_supported_with_safeguards() -> None:
    sufficient = evaluate(
        base(
            humanAdjudication=review(
                "SUFFICIENT_FOR_FURTHER_REVIEW", decision="CONTINUE_STRUCTURED_REVIEW"
            )
        )
    )
    deferred = evaluate(base(humanAdjudication=review("DEFERRED_PENDING_EVIDENCE")))
    needs_review = evaluate(base())
    insufficient = evaluate(base(patternCandidate=candidate("A"), cases=[case("A")]))
    conflicting = evaluate(
        base(cases=[case("A"), case("B", humanComparison="INCREASE_OBSERVED")])
    )
    stale = evaluate(base(cases=[case("A"), case("B", sourceRevision="v2")]))
    assert sufficient["adjudicationState"] == "SUFFICIENT_FOR_FURTHER_REVIEW"
    assert deferred["adjudicationState"] == "DEFERRED_PENDING_EVIDENCE"
    assert needs_review["adjudicationState"] == "NEEDS_EXPERT_REVIEW"
    assert insufficient["adjudicationState"] == "INSUFFICIENT_EVIDENCE"
    assert conflicting["adjudicationState"] == "CONFLICTING_EVIDENCE"
    assert stale["adjudicationState"] == "STALE_REVIEW_REQUIRED"


def test_sufficient_for_review_creates_only_noncanonical_review_input() -> None:
    result = evaluate(
        base(
            humanAdjudication=review(
                "SUFFICIENT_FOR_FURTHER_REVIEW", decision="CONTINUE_STRUCTURED_REVIEW"
            )
        )
    )
    assert result["furtherReviewInput"] == {
        "state": "GOVERNED_LOCAL_PATTERN_REVIEW_INPUT",
        "patternCandidateId": "LPC-095-TEST",
        "canonical": False,
        "efficacyClaim": None,
        "resistanceClaim": None,
        "recommendation": None,
    }
    assert result["humanAdjudication"]["canDeclareEfficacy"] is False
    assert result["humanAdjudication"]["canCreateAuthority"] is False


def test_statistical_method_boundary_never_executes_inference() -> None:
    descriptive = evaluate(base())
    stronger = evaluate(base(intendedReviewStrength="STRONGER_INFERENCE"))
    undefined = evaluate(base(statisticalMethodRequired=True))
    approved = evaluate(
        base(governedStatisticalMethod={"approved": True, "reference": "METHOD-FUTURE"})
    )
    assert descriptive["statisticalMethod"]["state"] == (
        "NOT_REQUIRED_FOR_CURRENT_REVIEW"
    )
    assert stronger["statisticalMethod"]["state"] == (
        "METHOD_REQUIRED_BEFORE_STRONGER_INFERENCE"
    )
    assert undefined["statisticalMethod"]["state"] == "METHOD_NOT_DEFINED"
    assert approved["statisticalMethod"]["state"] == "METHOD_APPROVED"
    for result in (descriptive, stronger, undefined, approved):
        assert result["statisticalMethod"]["computationsExecuted"] == []
        assert result["statisticalMethod"]["strongerInferenceAuthorized"] is False


def test_pattern_splitting_and_rejection_preserve_parent_lineage() -> None:
    split = evaluate(
        base(
            humanAdjudication=review(
                "CONFLICTING_EVIDENCE",
                decision="SPLIT_PATTERN",
                splitGroups=[
                    {"id": "DRONE", "caseIds": ["A"]},
                    {"id": "GROUND", "caseIds": ["B"]},
                ],
            )
        )
    )
    rejected = evaluate(
        base(
            humanAdjudication=review(
                "INSUFFICIENT_EVIDENCE",
                decision="REJECT_PATTERN",
                rationale="Unusable provenance.",
            )
        )
    )
    assert split["patternSplitting"]["performed"] is True
    assert split["patternSplitting"]["parentRetained"] is True
    assert all(
        item["parentPatternCandidateId"] == "LPC-095-TEST"
        for item in split["patternSplitting"]["groups"]
    )
    assert rejected["rejection"] == {
        "rejected": True,
        "traceable": True,
        "reason": "Unusable provenance.",
    }


def test_correction_staleness_overrides_prior_sufficient_adjudication() -> None:
    result = evaluate(
        base(
            cases=[case("A"), case("B", sourceRevision="v2")],
            humanAdjudication=review("SUFFICIENT_FOR_FURTHER_REVIEW"),
        )
    )
    assert result["adjudicationState"] == "STALE_REVIEW_REQUIRED"
    assert dimensions(result)["correction_staleness"]["state"] == "CONFLICTING"
    assert dimensions(result)["correction_staleness"]["staleCaseIds"] == ["B"]
    assert result["furtherReviewInput"] is None


def test_product_regulatory_authority_learn_and_privacy_boundaries_hold() -> None:
    result = evaluate(base(humanAdjudication=review("DEFERRED_PENDING_EVIDENCE")))
    assert not any(result["boundaries"].values())
    assert result["productComparisonInteraction"] == {
        "orderingChanged": False,
        "badgesAdded": False,
        "scoreChanged": False,
        "preferredProduct": None,
    }
    assert not any(result["learn"].values())
    assert result["privacy"]["persistence"] == "BROWSER_LOCAL_ONLY"
    assert not any(
        value for key, value in result["privacy"].items() if key != "persistence"
    )


def test_website_adjudication_and_conflict_slice_preserve_all_boundaries() -> None:
    projection = project()
    view = projection["localPatternAdjudication"]
    conflict = projection["localPatternConflict"]
    assert view["id"] == "LPA-095-BPH-001/v1"
    assert view["adjudication_state"] == "DEFERRED_PENDING_EVIDENCE"
    assert view["case_counts"] == {
        "total_considered": 3,
        "included": 2,
        "excluded": 1,
        "comparable": 2,
        "partially_comparable": 1,
        "universal_minimum": None,
    }
    assert conflict["adjudication_state"] == "CONFLICTING_EVIDENCE"
    assert conflict["pattern_splitting"]["parent_retained"] is True
    assert view["promotion"] == {"canonical": False, "automatic": False}
    assert projection["regulatoryBinding"]["approved_use"] == "AUTHORITY_BLOCKED"
    assert [item["id"] for item in projection["productComparison"]["candidates"]] == [
        "PC-CAND-PLENUM-001",
        "PC-CAND-PREVATHON-001",
    ]
    app = (ROOT / "prototype" / "knowledge-explorer" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    document = (
        ROOT
        / "docs"
        / "knowledge"
        / "action-crop-target-use-001"
        / "application-failed-control-investigation.md"
    ).read_text(encoding="utf-8")
    for required in (
        "Local Pattern Adjudication",
        "Evidence Sufficiency",
        "Statistical Method Boundary",
        "Human Adjudication",
        "Conflict Representative Slice",
        "Hidden sufficiency score",
        "Sufficient for further review",
        "No product ranking, recommendation",
    ):
        assert required in app
    for required in (
        "Sprint-095K governed local pattern adjudication",
        "Local pattern adjudication and evidence sufficiency",
        "Case independence and evidence dimensions",
        "Conflicting evidence and resistance boundary",
        "Statistical method boundary",
        "Human adjudication, splitting, and rejection",
        "Reviewed local pattern and promotion boundary",
    ):
        assert required in document
    assert 'locale === "th"' in app
