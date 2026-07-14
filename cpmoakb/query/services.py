"""Read-only deterministic query services over explicit Runtime objects."""

from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable

from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    CandidateIdentifier,
    CandidateRecord,
    RecordRepository,
    RelationshipRecord,
    SourceIdentifier,
    SourceReference,
)
from cpmoakb.registries import (
    AuthorityRegistrySnapshot,
    CandidateIdentifierRegistryEntry,
    CandidateIdentifierRegistrySnapshot,
    RegistryItemNotFoundError,
    SourceRegistrySnapshot,
)

from .criteria import QueryCriteria
from .enums import LabelScope, TextMatchMode
from .errors import QueryItemNotFoundError, UnsupportedQueryOperationError
from .indexes import ReadOnlyQueryIndex
from .results import QueryMatch, QueryResult

_ASCII_WHITESPACE = re.compile(r"[ \t\r\n\f\v]+")


def _normalized_text(value: str) -> str:
    normalized = unicodedata.normalize("NFC", value)
    trimmed = normalized.strip(" \t\r\n\f\v")
    return _ASCII_WHITESPACE.sub(" ", trimmed).casefold()


def _text_matches(actual: str, expected: str, mode: TextMatchMode) -> bool:
    if mode is TextMatchMode.EXACT:
        return actual == expected
    if mode is TextMatchMode.CASE_INSENSITIVE:
        return actual.casefold() == expected.casefold()
    return _normalized_text(actual) == _normalized_text(expected)


class QueryService:
    """Coherent read-only record lookup and conjunctive search API."""

    def __init__(self, index: ReadOnlyQueryIndex) -> None:
        self._index = index

    @classmethod
    def from_records(cls, records: Iterable[CandidateRecord]) -> QueryService:
        return cls(ReadOnlyQueryIndex(tuple(records)))

    @classmethod
    def from_repository(cls, repository: RecordRepository) -> QueryService:
        return cls.from_records(repository.iter_records())

    def get(self, identifier: CandidateIdentifier) -> CandidateRecord:
        return self._index.get(identifier)

    def iter_records(self) -> tuple[CandidateRecord, ...]:
        return self._index.records

    def search(self, criteria: QueryCriteria) -> QueryResult:
        records = tuple(
            record
            for record in self._index.records
            if self._record_matches(record, criteria)
        )
        matches: list[QueryMatch] = []
        for record in records:
            if criteria.has_label_criteria:
                matches.extend(self._label_matches(record, criteria))
            else:
                matches.append(self._record_match(record, criteria))
        return QueryResult(criteria, tuple(matches))

    @staticmethod
    def _record_matches(record: CandidateRecord, criteria: QueryCriteria) -> bool:
        if criteria.identifier is not None and record.identifier != criteria.identifier:
            return False
        if (
            criteria.record_kind is not None
            and record.record_kind is not criteria.record_kind
        ):
            return False
        if criteria.domain_type is not None and not _text_matches(
            record.domain_type, criteria.domain_type, criteria.match_mode
        ):
            return False
        if (
            criteria.lifecycle is not None
            and record.lifecycle is not criteria.lifecycle
        ):
            return False
        if (
            criteria.external_identifier is not None
            and criteria.external_identifier not in record.external_identifiers
        ):
            return False
        if criteria.source_identifier is not None:
            source_ids = set(record.source_ids) | {
                source.identifier for source in record.sources
            }
            if criteria.source_identifier not in source_ids:
                return False
        if (
            criteria.authority_identifier is not None
            and criteria.authority_identifier
            not in {authority.identifier for authority in record.authorities}
        ):
            return False

        relationship_criteria = any(
            (
                criteria.relationship_subject is not None,
                criteria.relationship_object is not None,
                criteria.predicate is not None,
            )
        )
        if relationship_criteria and not isinstance(record, RelationshipRecord):
            return False
        if isinstance(record, RelationshipRecord):
            if (
                criteria.relationship_subject is not None
                and record.subject_id != criteria.relationship_subject
            ):
                return False
            if (
                criteria.relationship_object is not None
                and record.object_id != criteria.relationship_object
            ):
                return False
            if criteria.predicate is not None and not _text_matches(
                record.predicate, criteria.predicate, criteria.match_mode
            ):
                return False
        return True

    @staticmethod
    def _label_matches(
        record: CandidateRecord, criteria: QueryCriteria
    ) -> tuple[QueryMatch, ...]:
        matches: list[QueryMatch] = []
        for label in record.labels.labels:
            scope = LabelScope.PREFERRED if label.preferred else LabelScope.ALTERNATIVE
            if (
                criteria.label_scope is not LabelScope.ANY
                and scope is not criteria.label_scope
            ):
                continue
            if (
                criteria.language is not None
                and label.language.casefold() != criteria.language.casefold()
            ):
                continue
            if (
                criteria.locale is not None
                and (label.locale or "").casefold() != criteria.locale.casefold()
            ):
                continue
            if criteria.label_text is not None and not _text_matches(
                label.text, criteria.label_text, criteria.match_mode
            ):
                continue
            matches.append(
                QueryMatch(
                    record=record,
                    matched_field=f"labels.{scope.value}",
                    matched_value=label.text,
                    match_mode=criteria.match_mode,
                    language=label.language,
                    locale=label.locale,
                )
            )
        return tuple(matches)

    @staticmethod
    def _record_match(record: CandidateRecord, criteria: QueryCriteria) -> QueryMatch:
        field = "record"
        value = str(record.identifier)
        mode = TextMatchMode.EXACT
        if criteria.identifier is not None:
            field, value = "identifier", str(record.identifier)
        elif criteria.external_identifier is not None:
            field = "external_identifiers"
            value = f"{criteria.external_identifier.authority}:{criteria.external_identifier.value}"
        elif criteria.relationship_subject is not None:
            field, value = "subject_id", str(criteria.relationship_subject)
        elif criteria.relationship_object is not None:
            field, value = "object_id", str(criteria.relationship_object)
        elif criteria.predicate is not None:
            assert isinstance(record, RelationshipRecord)
            field, value, mode = "predicate", record.predicate, criteria.match_mode
        elif criteria.source_identifier is not None:
            field, value = "source_ids", str(criteria.source_identifier)
        elif criteria.authority_identifier is not None:
            field, value = "authorities", str(criteria.authority_identifier)
        elif criteria.domain_type is not None:
            field, value, mode = "domain_type", record.domain_type, criteria.match_mode
        elif criteria.lifecycle is not None:
            field, value = "lifecycle", record.lifecycle.value
        elif criteria.record_kind is not None:
            field, value = "record_kind", record.record_kind.value
        return QueryMatch(record, field, value, mode)


class RegistrySnapshotQueryService:
    """Exact read-only lookups over separately supplied immutable snapshots."""

    def __init__(
        self,
        *,
        sources: SourceRegistrySnapshot | None = None,
        authorities: AuthorityRegistrySnapshot | None = None,
        candidate_identifiers: CandidateIdentifierRegistrySnapshot | None = None,
    ) -> None:
        self._sources = sources
        self._authorities = authorities
        self._candidate_identifiers = candidate_identifiers

    def list_sources(self) -> tuple[SourceReference, ...]:
        return self._require_sources().entries

    def get_source(self, identifier: SourceIdentifier) -> SourceReference:
        try:
            return self._require_sources().get(identifier)
        except RegistryItemNotFoundError as error:
            raise QueryItemNotFoundError(
                f"source {identifier} was not found"
            ) from error

    def list_authorities(self) -> tuple[AuthorityReference, ...]:
        return self._require_authorities().entries

    def get_authority(self, identifier: AuthorityIdentifier) -> AuthorityReference:
        try:
            return self._require_authorities().get(identifier)
        except RegistryItemNotFoundError as error:
            raise QueryItemNotFoundError(
                f"authority {identifier} was not found"
            ) from error

    def list_candidate_identifiers(
        self,
    ) -> tuple[CandidateIdentifierRegistryEntry, ...]:
        return self._require_candidate_identifiers().entries

    def get_candidate_identifier(
        self, identifier: CandidateIdentifier
    ) -> CandidateIdentifierRegistryEntry:
        try:
            return self._require_candidate_identifiers().get(identifier)
        except RegistryItemNotFoundError as error:
            raise QueryItemNotFoundError(
                f"candidate identifier {identifier} was not found"
            ) from error

    def _require_sources(self) -> SourceRegistrySnapshot:
        if self._sources is None:
            raise UnsupportedQueryOperationError("source snapshot was not supplied")
        return self._sources

    def _require_authorities(self) -> AuthorityRegistrySnapshot:
        if self._authorities is None:
            raise UnsupportedQueryOperationError("authority snapshot was not supplied")
        return self._authorities

    def _require_candidate_identifiers(self) -> CandidateIdentifierRegistrySnapshot:
        if self._candidate_identifiers is None:
            raise UnsupportedQueryOperationError(
                "candidate identifier snapshot was not supplied"
            )
        return self._candidate_identifiers
