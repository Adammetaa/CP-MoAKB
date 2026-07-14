"""Immutable structured explanation models."""

from __future__ import annotations

from dataclasses import dataclass

from .enums import (
    ExplanationAvailability,
    ExplanationReferenceType,
    ExplanationType,
)
from .errors import InvalidExplanationInputError


def _required(value: str, field: str) -> None:
    if not value or value != value.strip():
        raise InvalidExplanationInputError(f"{field} must be non-empty and trimmed")


def _optional(value: str | None, field: str) -> None:
    if value is not None:
        _required(value, field)


@dataclass(frozen=True, slots=True)
class ExplanationReference:
    reference_type: ExplanationReferenceType
    identifier: str
    field_path: str | None = None

    def __post_init__(self) -> None:
        _required(self.identifier, "reference identifier")
        _optional(self.field_path, "reference field path")

    @property
    def sort_key(self) -> tuple[str, str, str]:
        return (self.reference_type.value, self.identifier, self.field_path or "")


@dataclass(frozen=True, slots=True)
class ExplanationFact:
    field_path: str
    value: str
    role: str
    reference: ExplanationReference | None = None

    def __post_init__(self) -> None:
        _required(self.field_path, "fact field path")
        _required(self.value, "fact value")
        _required(self.role, "fact role")

    @property
    def sort_key(self) -> tuple[str, str, str, tuple[str, str, str]]:
        reference_key = self.reference.sort_key if self.reference else ("", "", "")
        return (self.field_path, self.role, self.value, reference_key)


@dataclass(frozen=True, slots=True)
class ExplanationLimitation:
    code: str
    message: str
    missing_input: str | None = None

    def __post_init__(self) -> None:
        _required(self.code, "limitation code")
        _required(self.message, "limitation message")
        _optional(self.missing_input, "limitation missing input")

    @property
    def sort_key(self) -> tuple[str, str, str]:
        return (self.code, self.message, self.missing_input or "")


@dataclass(frozen=True, slots=True)
class Explanation:
    explanation_type: ExplanationType
    availability: ExplanationAvailability
    subject_reference: ExplanationReference | None = None
    facts: tuple[ExplanationFact, ...] = ()
    supporting_references: tuple[ExplanationReference, ...] = ()
    limitations: tuple[ExplanationLimitation, ...] = ()
    summary: str | None = None

    def __post_init__(self) -> None:
        _optional(self.summary, "explanation summary")
        object.__setattr__(
            self, "facts", tuple(sorted(self.facts, key=lambda fact: fact.sort_key))
        )
        object.__setattr__(
            self,
            "supporting_references",
            tuple(
                sorted(set(self.supporting_references), key=lambda ref: ref.sort_key)
            ),
        )
        object.__setattr__(
            self,
            "limitations",
            tuple(sorted(self.limitations, key=lambda limitation: limitation.sort_key)),
        )
