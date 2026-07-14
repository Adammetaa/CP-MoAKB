"""Pure, deterministic execution of validation profiles."""

from __future__ import annotations

from collections.abc import Iterable

from cpmoakb.domain import CandidateRecord, ValidationIssue, ValidationResult
from cpmoakb.validation.context import ValidationContext
from cpmoakb.validation.enums import RuleApplicability
from cpmoakb.validation.errors import (
    InvalidValidationProfileError,
    UnsupportedValidationTargetError,
)
from cpmoakb.validation.profiles import ValidationProfile


def validate_record(
    record: CandidateRecord,
    profile: ValidationProfile,
    context: ValidationContext | None = None,
) -> ValidationResult:
    """Validate one record without mutation or external I/O."""

    if not isinstance(record, CandidateRecord):
        raise UnsupportedValidationTargetError(
            f"expected CandidateRecord, received {type(record).__name__}"
        )
    batch_rules = tuple(
        rule.metadata.identifier
        for rule in profile.rules
        if rule.metadata.applicability is RuleApplicability.BATCH
    )
    if batch_rules:
        raise InvalidValidationProfileError(
            "single-record validation cannot execute batch rules: "
            + ", ".join(batch_rules)
        )

    active_context = context or ValidationContext((record,))
    issues: list[ValidationIssue] = []
    for rule in profile.rules:
        issues.extend(rule.validate(record, active_context))
    return ValidationResult(tuple(issues))


def validate_records(
    records: Iterable[CandidateRecord],
    profile: ValidationProfile,
) -> ValidationResult:
    """Validate a batch with stable ordering and an explicit record context."""

    materialized = tuple(records)
    invalid = tuple(
        type(record).__name__
        for record in materialized
        if not isinstance(record, CandidateRecord)
    )
    if invalid:
        raise UnsupportedValidationTargetError(
            "all batch members must be CandidateRecord instances; received "
            + ", ".join(invalid)
        )

    ordered = tuple(
        sorted(materialized, key=lambda record: (str(record.identifier), repr(record)))
    )
    unique_records: dict[str, CandidateRecord] = {}
    for record in ordered:
        unique_records.setdefault(str(record.identifier), record)
    context = ValidationContext(tuple(unique_records.values()))

    issues: list[ValidationIssue] = []
    for rule in profile.rules:
        if rule.metadata.applicability is RuleApplicability.RECORD:
            for record in ordered:
                issues.extend(rule.validate(record, context))
        else:
            issues.extend(rule.validate(ordered, context))
    return ValidationResult(tuple(issues))
