"""Immutable, explicitly typed query criteria."""

from __future__ import annotations

from dataclasses import dataclass

from cpmoakb.domain import (
    AuthorityIdentifier,
    CandidateIdentifier,
    CanonicalIdentifier,
    ExternalIdentifier,
    RecordKind,
    RecordLifecycle,
    SourceIdentifier,
)

from .enums import LabelScope, TextMatchMode
from .errors import InvalidQueryCriteriaError

RecordIdentifier = CandidateIdentifier | CanonicalIdentifier


@dataclass(frozen=True, slots=True)
class QueryCriteria:
    """Conjunctive criteria; an empty instance means deterministic list-all."""

    identifier: CandidateIdentifier | None = None
    record_kind: RecordKind | None = None
    domain_type: str | None = None
    lifecycle: RecordLifecycle | None = None
    label_text: str | None = None
    label_scope: LabelScope = LabelScope.ANY
    language: str | None = None
    locale: str | None = None
    match_mode: TextMatchMode = TextMatchMode.EXACT
    external_identifier: ExternalIdentifier | None = None
    relationship_subject: RecordIdentifier | None = None
    relationship_object: RecordIdentifier | None = None
    predicate: str | None = None
    source_identifier: SourceIdentifier | None = None
    authority_identifier: AuthorityIdentifier | None = None

    def __post_init__(self) -> None:
        for field_name in ("domain_type", "label_text", "predicate"):
            value = getattr(self, field_name)
            if value is not None and not value.strip(" \t\r\n\f\v"):
                raise InvalidQueryCriteriaError(
                    f"{field_name} must contain non-whitespace text"
                )
        for field_name in ("language", "locale"):
            value = getattr(self, field_name)
            if value is not None and (not value or value != value.strip()):
                raise InvalidQueryCriteriaError(
                    f"{field_name} must be non-empty and trimmed"
                )

    @property
    def has_label_criteria(self) -> bool:
        return any(
            (
                self.label_text is not None,
                self.language is not None,
                self.locale is not None,
                self.label_scope is not LabelScope.ANY,
            )
        )
