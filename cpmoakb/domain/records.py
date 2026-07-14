"""Storage-neutral candidate entity models with explicit governance state."""

from __future__ import annotations

from dataclasses import dataclass

from .authorities import AuthorityReference
from .enums import RecordKind, RecordLifecycle
from .evidence import EvidenceReference
from .exceptions import InvalidRecordError
from .identifiers import CandidateIdentifier, ExternalIdentifier, SourceIdentifier
from .labels import LabelSet
from .provenance import Provenance


def _nonempty(value: str, field: str) -> None:
    if not value or value != value.strip():
        raise InvalidRecordError(
            f"{field} must be non-empty and have no surrounding whitespace"
        )


@dataclass(frozen=True, slots=True)
class ScientificName:
    """Authority-governed nomenclature, never a language translation."""

    name: str
    authorship: str | None = None
    authority: AuthorityReference | None = None
    external_identifier: ExternalIdentifier | None = None
    verification_status: str = "unverified"
    name_status: str = "unresolved"

    def __post_init__(self) -> None:
        _nonempty(self.name, "scientific name")
        _nonempty(self.verification_status, "scientific-name verification status")
        _nonempty(self.name_status, "scientific-name status")


@dataclass(frozen=True, slots=True)
class ClassificationReference:
    scheme: str
    code: str
    label: str | None = None

    def __post_init__(self) -> None:
        _nonempty(self.scheme, "classification scheme")
        _nonempty(self.code, "classification code")


@dataclass(frozen=True, slots=True)
class CandidateRecord:
    """Common non-production metadata for a governed candidate record."""

    identifier: CandidateIdentifier
    record_kind: RecordKind
    domain_type: str
    lifecycle: RecordLifecycle
    labels: LabelSet
    scope_note: str
    source_ids: tuple[SourceIdentifier, ...]
    evidence: tuple[EvidenceReference, ...]
    provenance: Provenance
    ambiguity_notes: tuple[str, ...] = ()
    external_identifiers: tuple[ExternalIdentifier, ...] = ()

    def __post_init__(self) -> None:
        if self.identifier.kind is not self.record_kind:
            raise InvalidRecordError("candidate identifier kind must match record kind")
        if self.lifecycle is RecordLifecycle.PUBLISHED:
            raise InvalidRecordError(
                "a candidate record cannot have published lifecycle status"
            )
        _nonempty(self.domain_type, "domain type")
        _nonempty(self.scope_note, "scope note")
        object.__setattr__(
            self, "source_ids", tuple(sorted(set(self.source_ids), key=str))
        )
        object.__setattr__(
            self,
            "evidence",
            tuple(sorted(self.evidence, key=lambda item: item.identifier)),
        )
        object.__setattr__(
            self, "ambiguity_notes", tuple(sorted(set(self.ambiguity_notes)))
        )
        object.__setattr__(
            self,
            "external_identifiers",
            tuple(
                sorted(
                    set(self.external_identifiers),
                    key=lambda item: (item.authority, item.value),
                )
            ),
        )


@dataclass(frozen=True, slots=True)
class EntityRecord(CandidateRecord):
    scientific_name: ScientificName | None = None
    classifications: tuple[ClassificationReference, ...] = ()

    def __post_init__(self) -> None:
        CandidateRecord.__post_init__(self)
        if self.record_kind is not RecordKind.ENTITY:
            raise InvalidRecordError("an entity record requires entity record kind")
        object.__setattr__(
            self,
            "classifications",
            tuple(
                sorted(
                    set(self.classifications), key=lambda item: (item.scheme, item.code)
                )
            ),
        )
