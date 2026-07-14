"""Reusable mechanical validation results; scientific correctness is external."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, TypeVar

from .enums import ValidationSeverity
from .exceptions import DomainError
from .identifiers import CandidateIdentifier, CanonicalIdentifier


@dataclass(frozen=True, slots=True)
class ValidationIssue:
    code: str
    severity: ValidationSeverity
    message: str
    field_path: str | None = None
    record_id: CandidateIdentifier | CanonicalIdentifier | None = None
    remediation_hint: str | None = None

    def __post_init__(self) -> None:
        if not self.code or self.code != self.code.strip():
            raise DomainError("validation issue code must be non-empty")
        if not self.message or self.message != self.message.strip():
            raise DomainError("validation issue message must be non-empty")

    @property
    def sort_key(self) -> tuple[str, str, str, str, str]:
        return (
            self.severity.value,
            str(self.record_id or ""),
            self.field_path or "",
            self.code,
            self.message,
        )


@dataclass(frozen=True, slots=True)
class ValidationResult:
    issues: tuple[ValidationIssue, ...] = ()

    def __post_init__(self) -> None:
        object.__setattr__(
            self, "issues", tuple(sorted(self.issues, key=lambda issue: issue.sort_key))
        )

    @property
    def is_valid(self) -> bool:
        return all(
            issue.severity is not ValidationSeverity.ERROR for issue in self.issues
        )

    def for_severity(self, severity: ValidationSeverity) -> tuple[ValidationIssue, ...]:
        return tuple(issue for issue in self.issues if issue.severity is severity)

    def combine(self, *others: ValidationResult) -> ValidationResult:
        combined = self.issues + tuple(
            issue for result in others for issue in result.issues
        )
        return ValidationResult(combined)


RecordT = TypeVar("RecordT", contravariant=True)


class Validator(Protocol[RecordT]):
    def validate(self, record: RecordT) -> ValidationResult:
        """Return deterministic mechanical issues without mutating the record."""

        ...
