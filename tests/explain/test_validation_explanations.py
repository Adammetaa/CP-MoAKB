from cpmoakb.domain import ValidationIssue, ValidationSeverity
from cpmoakb.explain import ExplanationService
from cpmoakb.validation import GENERIC_CANDIDATE_PROFILE, validate_record

from ._support import record


def test_validation_flow_preserves_rule_severity_field_and_remediation() -> None:
    item = record(preferred=False)
    issue = validate_record(item, GENERIC_CANDIDATE_PROFILE).issues[0]
    metadata = next(
        rule.metadata
        for rule in GENERIC_CANDIDATE_PROFILE.rules
        if rule.metadata.identifier == issue.code
    )
    explanation = ExplanationService().explain_validation_issue(issue, metadata)
    facts = {fact.field_path: fact.value for fact in explanation.facts}
    assert facts["validation.rule_id"] == issue.code
    assert facts["validation.severity"] == issue.severity.value
    assert facts["validation.message"] == issue.message
    assert facts["validation.field_path"] == issue.field_path
    assert facts["validation.remediation_hint"] == issue.remediation_hint
    assert any(
        item.code == "MECHANICAL_VALIDATION_ONLY" for item in explanation.limitations
    )


def test_absent_remediation_is_not_invented() -> None:
    issue = ValidationIssue(
        "CPM-VAL-STR-999",
        ValidationSeverity.WARNING,
        "Synthetic mechanical warning.",
    )
    explanation = ExplanationService().explain_validation_issue(issue)
    assert not any(
        fact.field_path == "validation.remediation_hint" for fact in explanation.facts
    )
