from cpmoakb.adapters.yaml import load_candidate_yaml
from cpmoakb.validation import (
    GENERIC_BATCH_PROFILE,
    GENERIC_CANDIDATE_PROFILE,
    validate_record,
    validate_records,
)

from ._support import entity, relationship


def test_valid_record_returns_valid_result_without_mutation() -> None:
    record = entity()
    before = repr(record)
    result = validate_record(record, GENERIC_CANDIDATE_PROFILE)
    assert result.is_valid
    assert result.issues == ()
    assert repr(record) == before


def test_engine_collects_multiple_traceable_issues() -> None:
    record = entity(preferred=False, ambiguity_notes=("",))
    result = validate_record(record, GENERIC_CANDIDATE_PROFILE)
    assert {issue.code for issue in result.issues} >= {
        "CPM-VAL-STR-001",
        "CPM-VAL-STR-002",
    }
    assert all(issue.record_id == record.identifier for issue in result.issues)
    assert all(issue.remediation_hint for issue in result.issues)


def test_batch_issue_order_is_independent_of_input_order() -> None:
    first = entity(990001, preferred=False)
    second = entity(990002, ambiguity_notes=("",))
    link = relationship(subject=first.identifier, object_=second.identifier)
    forward = validate_records((first, second, link), GENERIC_BATCH_PROFILE)
    reverse = validate_records((link, second, first), GENERIC_BATCH_PROFILE)
    assert forward == reverse
    assert forward.issues
    assert tuple(issue.sort_key for issue in forward.issues) == tuple(
        sorted(issue.sort_key for issue in forward.issues)
    )


def test_yaml_loading_and_validation_are_explicit_separate_operations() -> None:
    record = load_candidate_yaml("""schema_version: "1.0"
candidate_id: "CPM-CAND-E-990080"
record_kind: "entity"
domain_type: "SyntheticConcept"
lifecycle: "candidate"
labels:
  - language: "en"
    text: "Fictional Adapter Widget"
    status: "provisional"
    preferred: true
scope_note: "Synthetic integration input only."
provenance:
  creation:
    created_at: "2026-01-01"
    created_by: "synthetic-role"
""")
    assert validate_record(record, GENERIC_CANDIDATE_PROFILE).is_valid
