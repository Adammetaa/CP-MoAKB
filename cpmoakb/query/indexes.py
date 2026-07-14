"""Explicit deterministic in-memory indexes over immutable records."""

from __future__ import annotations

from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Mapping, TypeVar

from cpmoakb.domain import (
    CandidateIdentifier,
    CandidateRecord,
    CanonicalIdentifier,
    ExternalIdentifier,
    Label,
    RecordKind,
    RecordLifecycle,
    RelationshipRecord,
)

from .enums import LabelScope
from .errors import DuplicateQueryRecordError, QueryItemNotFoundError

RecordIdentifier = CandidateIdentifier | CanonicalIdentifier
KeyT = TypeVar("KeyT")
ValueT = TypeVar("ValueT")


@dataclass(frozen=True, slots=True)
class _LabelEntry:
    record: CandidateRecord
    label: Label
    scope: LabelScope


@dataclass(frozen=True, slots=True)
class ReadOnlyQueryIndex:
    """Read-only index built only from an explicit record collection."""

    records: tuple[CandidateRecord, ...]
    _by_identifier: Mapping[CandidateIdentifier, CandidateRecord] = field(
        init=False, repr=False, compare=False
    )
    _by_kind: Mapping[RecordKind, tuple[CandidateRecord, ...]] = field(
        init=False, repr=False, compare=False
    )
    _by_domain_type: Mapping[str, tuple[CandidateRecord, ...]] = field(
        init=False, repr=False, compare=False
    )
    _by_lifecycle: Mapping[RecordLifecycle, tuple[CandidateRecord, ...]] = field(
        init=False, repr=False, compare=False
    )
    _by_external: Mapping[ExternalIdentifier, tuple[CandidateRecord, ...]] = field(
        init=False, repr=False, compare=False
    )
    _labels: tuple[_LabelEntry, ...] = field(init=False, repr=False, compare=False)
    _relationships_by_subject: Mapping[
        RecordIdentifier, tuple[RelationshipRecord, ...]
    ] = field(init=False, repr=False, compare=False)
    _relationships_by_object: Mapping[
        RecordIdentifier, tuple[RelationshipRecord, ...]
    ] = field(init=False, repr=False, compare=False)
    _relationships_by_predicate: Mapping[str, tuple[RelationshipRecord, ...]] = field(
        init=False, repr=False, compare=False
    )

    def __post_init__(self) -> None:
        ordered = tuple(sorted(self.records, key=lambda record: str(record.identifier)))
        identifiers = tuple(record.identifier for record in ordered)
        if len(identifiers) != len(set(identifiers)):
            raise DuplicateQueryRecordError(
                "query index contains duplicate candidate record identifiers"
            )

        object.__setattr__(self, "records", ordered)
        object.__setattr__(
            self,
            "_by_identifier",
            MappingProxyType({record.identifier: record for record in ordered}),
        )
        object.__setattr__(self, "_by_kind", self._group(ordered, "record_kind"))
        object.__setattr__(self, "_by_domain_type", self._group(ordered, "domain_type"))
        object.__setattr__(self, "_by_lifecycle", self._group(ordered, "lifecycle"))

        external: dict[ExternalIdentifier, list[CandidateRecord]] = {}
        labels: list[_LabelEntry] = []
        subjects: dict[RecordIdentifier, list[RelationshipRecord]] = {}
        objects: dict[RecordIdentifier, list[RelationshipRecord]] = {}
        predicates: dict[str, list[RelationshipRecord]] = {}
        for record in ordered:
            for identifier in record.external_identifiers:
                external.setdefault(identifier, []).append(record)
            for label in record.labels.labels:
                scope = (
                    LabelScope.PREFERRED if label.preferred else LabelScope.ALTERNATIVE
                )
                labels.append(_LabelEntry(record, label, scope))
            if isinstance(record, RelationshipRecord):
                assert record.subject_id is not None
                assert record.object_id is not None
                subjects.setdefault(record.subject_id, []).append(record)
                objects.setdefault(record.object_id, []).append(record)
                predicates.setdefault(record.predicate, []).append(record)

        object.__setattr__(self, "_by_external", self._freeze_groups(external))
        object.__setattr__(self, "_labels", tuple(labels))
        object.__setattr__(
            self, "_relationships_by_subject", self._freeze_groups(subjects)
        )
        object.__setattr__(
            self, "_relationships_by_object", self._freeze_groups(objects)
        )
        object.__setattr__(
            self, "_relationships_by_predicate", self._freeze_groups(predicates)
        )

    @staticmethod
    def _group(
        records: tuple[CandidateRecord, ...], attribute: str
    ) -> Mapping[object, tuple[CandidateRecord, ...]]:
        grouped: dict[object, list[CandidateRecord]] = {}
        for record in records:
            grouped.setdefault(getattr(record, attribute), []).append(record)
        return ReadOnlyQueryIndex._freeze_groups(grouped)

    @staticmethod
    def _freeze_groups(
        groups: Mapping[KeyT, list[ValueT]],
    ) -> Mapping[KeyT, tuple[ValueT, ...]]:
        return MappingProxyType({key: tuple(values) for key, values in groups.items()})

    def get(self, identifier: CandidateIdentifier) -> CandidateRecord:
        try:
            return self._by_identifier[identifier]
        except KeyError as error:
            raise QueryItemNotFoundError(
                f"candidate record {identifier} was not found"
            ) from error

    def by_kind(self, kind: RecordKind) -> tuple[CandidateRecord, ...]:
        return self._by_kind.get(kind, ())

    def by_domain_type(self, domain_type: str) -> tuple[CandidateRecord, ...]:
        return self._by_domain_type.get(domain_type, ())

    def by_lifecycle(self, lifecycle: RecordLifecycle) -> tuple[CandidateRecord, ...]:
        return self._by_lifecycle.get(lifecycle, ())

    def by_external_identifier(
        self, identifier: ExternalIdentifier
    ) -> tuple[CandidateRecord, ...]:
        return self._by_external.get(identifier, ())

    def label_entries(self) -> tuple[_LabelEntry, ...]:
        return self._labels

    def relationships_by_subject(
        self, identifier: RecordIdentifier
    ) -> tuple[RelationshipRecord, ...]:
        return self._relationships_by_subject.get(identifier, ())

    def relationships_by_object(
        self, identifier: RecordIdentifier
    ) -> tuple[RelationshipRecord, ...]:
        return self._relationships_by_object.get(identifier, ())

    def relationships_by_predicate(
        self, predicate: str
    ) -> tuple[RelationshipRecord, ...]:
        return self._relationships_by_predicate.get(predicate, ())
