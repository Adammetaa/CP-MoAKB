"""Structured creation, review, source, and supersession provenance."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime

from .exceptions import DomainError
from .identifiers import CandidateIdentifier, SourceIdentifier

TemporalValue = date | datetime


@dataclass(frozen=True, slots=True)
class CreationProvenance:
    created_at: TemporalValue
    created_by: str

    def __post_init__(self) -> None:
        if not self.created_by.strip():
            raise DomainError("creation actor or role must be non-empty")


@dataclass(frozen=True, slots=True)
class ReviewProvenance:
    reviewed_at: TemporalValue
    reviewer_role: str
    decision_note: str | None = None

    def __post_init__(self) -> None:
        if not self.reviewer_role.strip():
            raise DomainError("reviewer role must be non-empty")


@dataclass(frozen=True, slots=True)
class SupersessionProvenance:
    predecessor_id: CandidateIdentifier
    change_reason: str

    def __post_init__(self) -> None:
        if not self.change_reason.strip():
            raise DomainError("supersession change reason must be non-empty")


@dataclass(frozen=True, slots=True)
class Provenance:
    creation: CreationProvenance
    source_ids: tuple[SourceIdentifier, ...] = ()
    evidence_ids: tuple[str, ...] = ()
    reviews: tuple[ReviewProvenance, ...] = ()
    editorial_note: str | None = None
    supersession: SupersessionProvenance | None = None
    change_reason: str | None = None

    def __post_init__(self) -> None:
        if len(set(self.evidence_ids)) != len(self.evidence_ids):
            raise DomainError("provenance evidence references must be unique")
        object.__setattr__(
            self, "source_ids", tuple(sorted(set(self.source_ids), key=str))
        )
        object.__setattr__(self, "evidence_ids", tuple(sorted(self.evidence_ids)))
        object.__setattr__(
            self,
            "reviews",
            tuple(
                sorted(
                    self.reviews,
                    key=lambda review: (
                        review.reviewed_at.isoformat(),
                        review.reviewer_role,
                    ),
                )
            ),
        )
