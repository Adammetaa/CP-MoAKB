"""Immutable structured responses from approved application operations."""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass

from cpmoakb.explain import Explanation
from cpmoakb.query import QueryResult
from cpmoakb.serialization import JsonValue


@dataclass(frozen=True, slots=True)
class QueryRecordsResponse:
    query_result: QueryResult


@dataclass(frozen=True, slots=True)
class ExplainQueryResponse:
    explanation: Explanation
    match_index: int


@dataclass(frozen=True, slots=True)
class QueryAndExplainResponse:
    query_result: QueryResult
    explanation: Explanation
    match_index: int


@dataclass(frozen=True, slots=True, init=False)
class ProjectedApplicationResponse:
    _projection: dict[str, JsonValue]
    canonical_json: str

    def __init__(self, projection: dict[str, JsonValue], canonical_json: str) -> None:
        object.__setattr__(self, "_projection", deepcopy(projection))
        object.__setattr__(self, "canonical_json", canonical_json)

    @property
    def projection(self) -> dict[str, JsonValue]:
        """Return a fresh JSON-compatible application projection."""

        return deepcopy(self._projection)
