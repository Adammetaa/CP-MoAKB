"""Rule identity, metadata, protocol, and issue construction."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Protocol, TypeAlias, runtime_checkable

from cpmoakb.domain import CandidateRecord, ValidationIssue, ValidationSeverity

from .context import ValidationContext
from .enums import RuleApplicability, ValidationLayer
from .errors import InvalidValidationProfileError

_RULE_ID = re.compile(r"^CPM-VAL-(?:STR|DOM|XOBJ)-[0-9]{3}$")


@dataclass(frozen=True, slots=True)
class RuleMetadata:
    identifier: str
    name: str
    layer: ValidationLayer
    description: str
    default_severity: ValidationSeverity
    version: str
    applicability: RuleApplicability
    remediation_guidance: str | None = None

    def __post_init__(self) -> None:
        if _RULE_ID.fullmatch(self.identifier) is None:
            raise InvalidValidationProfileError(
                "rule identifier must match CPM-VAL-STR-NNN, CPM-VAL-DOM-NNN, or CPM-VAL-XOBJ-NNN"
            )
        for field_name, value in (
            ("name", self.name),
            ("description", self.description),
            ("version", self.version),
        ):
            if not value or value != value.strip():
                raise InvalidValidationProfileError(
                    f"rule metadata {field_name} must be non-empty"
                )


ValidationTarget: TypeAlias = CandidateRecord | tuple[CandidateRecord, ...]


@runtime_checkable
class ValidationRule(Protocol):
    @property
    def metadata(self) -> RuleMetadata: ...

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]: ...


def issue(
    metadata: RuleMetadata,
    record: CandidateRecord,
    message: str,
    *,
    field_path: str | None = None,
    remediation_hint: str | None = None,
    severity: ValidationSeverity | None = None,
) -> ValidationIssue:
    """Create a traceable issue whose code is the stable rule identifier."""

    return ValidationIssue(
        code=metadata.identifier,
        severity=severity or metadata.default_severity,
        message=message,
        field_path=field_path,
        record_id=record.identifier,
        remediation_hint=remediation_hint or metadata.remediation_guidance,
    )
