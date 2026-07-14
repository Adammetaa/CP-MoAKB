"""Immutable, traceable query matches and results."""

from __future__ import annotations

from dataclasses import dataclass

from cpmoakb.domain import CandidateRecord

from .criteria import QueryCriteria
from .enums import TextMatchMode


@dataclass(frozen=True, slots=True)
class QueryMatch:
    record: CandidateRecord
    matched_field: str
    matched_value: str
    match_mode: TextMatchMode
    language: str | None = None
    locale: str | None = None

    @property
    def sort_key(self) -> tuple[str, str, str, str, str]:
        return (
            str(self.record.identifier),
            self.matched_field,
            self.language or "",
            self.locale or "",
            self.matched_value,
        )


@dataclass(frozen=True, slots=True)
class QueryResult:
    criteria: QueryCriteria
    matches: tuple[QueryMatch, ...] = ()

    def __post_init__(self) -> None:
        object.__setattr__(
            self,
            "matches",
            tuple(sorted(self.matches, key=lambda match: match.sort_key)),
        )

    @property
    def total_count(self) -> int:
        return len(self.matches)
