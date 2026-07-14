"""Evidence-bearing relationship candidates without graph or causal inference."""

from __future__ import annotations

from dataclasses import dataclass

from .enums import RecordKind
from .exceptions import InvalidRelationshipError
from .identifiers import CandidateIdentifier, CanonicalIdentifier
from .records import CandidateRecord

RecordIdentifier = CandidateIdentifier | CanonicalIdentifier


@dataclass(frozen=True, slots=True)
class RelationshipRecord(CandidateRecord):
    subject_id: RecordIdentifier | None = None
    predicate: str = ""
    object_id: RecordIdentifier | None = None
    context_note: str | None = None
    uncertainty_note: str | None = None

    def __post_init__(self) -> None:
        CandidateRecord.__post_init__(self)
        if self.record_kind is not RecordKind.RELATIONSHIP:
            raise InvalidRelationshipError(
                "a relationship record requires relationship record kind"
            )
        if self.subject_id is None or self.object_id is None:
            raise InvalidRelationshipError(
                "a relationship requires subject and object identifiers"
            )
        if not self.predicate or self.predicate != self.predicate.strip():
            raise InvalidRelationshipError(
                "relationship predicate must be a non-empty explicit value"
            )
