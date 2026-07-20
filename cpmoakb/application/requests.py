"""Immutable, transport-neutral application request contracts."""

from __future__ import annotations

from dataclasses import dataclass

from cpmoakb.query import QueryCriteria, QueryResult

from .errors import ApplicationContractError


def _require_match_index(value: int) -> None:
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise ApplicationContractError("match index must be a non-negative integer")


@dataclass(frozen=True, slots=True)
class QueryRecordsRequest:
    criteria: QueryCriteria

    def __post_init__(self) -> None:
        if not isinstance(self.criteria, QueryCriteria):
            raise ApplicationContractError("query request requires QueryCriteria")


@dataclass(frozen=True, slots=True)
class ExplainQueryRequest:
    query_result: QueryResult
    match_index: int = 0

    def __post_init__(self) -> None:
        if not isinstance(self.query_result, QueryResult):
            raise ApplicationContractError("explain request requires QueryResult")
        _require_match_index(self.match_index)


@dataclass(frozen=True, slots=True)
class QueryAndExplainRequest:
    query: QueryRecordsRequest
    match_index: int = 0

    def __post_init__(self) -> None:
        if not isinstance(self.query, QueryRecordsRequest):
            raise ApplicationContractError(
                "query-and-explain request requires QueryRecordsRequest"
            )
        _require_match_index(self.match_index)
