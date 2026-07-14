from dataclasses import replace

import pytest

from cpmoakb.domain import LabelSet, ValidationSeverity
from cpmoakb.validation import (
    GENERIC_BATCH_PROFILE,
    GENERIC_CANDIDATE_PROFILE,
    InvalidValidationProfileError,
    ValidationLayer,
    validate_record,
)

from ._support import load_synthetic_record


def test_public_profiles_rule_ids_and_scientific_boundary() -> None:
    candidate_ids = GENERIC_CANDIDATE_PROFILE.rule_ids
    batch_ids = GENERIC_BATCH_PROFILE.rule_ids
    assert candidate_ids == (
        "CPM-VAL-STR-001",
        "CPM-VAL-STR-002",
        "CPM-VAL-STR-003",
        "CPM-VAL-STR-004",
        "CPM-VAL-DOM-001",
        "CPM-VAL-DOM-002",
        "CPM-VAL-DOM-003",
        "CPM-VAL-DOM-004",
        "CPM-VAL-DOM-005",
    )
    assert batch_ids[: len(candidate_ids)] == candidate_ids
    assert all(
        rule.metadata.layer is not ValidationLayer.SCIENTIFIC
        for rule in GENERIC_BATCH_PROFILE.rules
    )


def test_validation_result_and_ordering_contract() -> None:
    result = validate_record(load_synthetic_record(), GENERIC_CANDIDATE_PROFILE)
    assert result.is_valid
    assert result.issues == ()
    assert ValidationSeverity.ERROR.value == "error"


def test_profile_misuse_is_a_framework_exception_not_an_issue() -> None:
    with pytest.raises(InvalidValidationProfileError):
        validate_record(load_synthetic_record(), GENERIC_BATCH_PROFILE)


def test_ordinary_invalid_content_is_a_deterministic_issue() -> None:
    record = load_synthetic_record()
    without_preferred = replace(
        record,
        labels=LabelSet(
            tuple(replace(label, preferred=False) for label in record.labels.labels)
        ),
    )
    result = validate_record(without_preferred, GENERIC_CANDIDATE_PROFILE)
    assert tuple(issue.code for issue in result.issues) == ("CPM-VAL-STR-001",)
