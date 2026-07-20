"""Stateless orchestration of approved Runtime read-only use cases."""

from __future__ import annotations

import json
from collections.abc import Callable

from cpmoakb.explain import Explanation, ExplanationService
from cpmoakb.query import QueryResult, QueryService
from cpmoakb.runtime_api import RUNTIME_API_VERSION
from cpmoakb.serialization import (
    JsonValue,
    ProjectionContractError,
    RUNTIME_JSON_PROJECTION_VERSION,
    SerializationError,
    project_query_result,
    project_structured_explanation,
)

from .errors import (
    ApplicationContractError,
    ApplicationDependencyError,
    UnsupportedApplicationRequestError,
)
from .requests import ExplainQueryRequest, QueryAndExplainRequest, QueryRecordsRequest
from .responses import (
    ExplainQueryResponse,
    ProjectedApplicationResponse,
    QueryAndExplainResponse,
    QueryRecordsResponse,
)

RUNTIME_APPLICATION_API_VERSION = "0.1"
_APPLICATION_SCHEMA = "cpmoakb-runtime-application"
_OPERATION = "query-and-explain"

QueryProjector = Callable[[QueryResult], dict[str, JsonValue]]
ExplanationProjector = Callable[[Explanation], dict[str, JsonValue]]


class RuntimeApplicationService:
    """Transport-neutral facade over injected read-only Runtime services."""

    __slots__ = (
        "_explanation_projector",
        "_explanation_service",
        "_query_projector",
        "_query_service",
    )

    def __init__(
        self,
        query_service: QueryService,
        explanation_service: ExplanationService,
        *,
        query_projector: QueryProjector = project_query_result,
        explanation_projector: ExplanationProjector = project_structured_explanation,
    ) -> None:
        if not callable(getattr(query_service, "search", None)):
            raise ApplicationContractError("query dependency must provide search")
        if not callable(getattr(explanation_service, "explain_query_match", None)):
            raise ApplicationContractError(
                "explanation dependency must provide explain_query_match"
            )
        if not callable(query_projector) or not callable(explanation_projector):
            raise ApplicationContractError("projection dependencies must be callable")
        self._query_service = query_service
        self._explanation_service = explanation_service
        self._query_projector = query_projector
        self._explanation_projector = explanation_projector

    def query_records(self, request: QueryRecordsRequest) -> QueryRecordsResponse:
        if not isinstance(request, QueryRecordsRequest):
            raise UnsupportedApplicationRequestError(
                "query_records requires QueryRecordsRequest"
            )
        return QueryRecordsResponse(self._query_service.search(request.criteria))

    def explain_query_result(
        self, request: ExplainQueryRequest
    ) -> ExplainQueryResponse:
        if not isinstance(request, ExplainQueryRequest):
            raise UnsupportedApplicationRequestError(
                "explain_query_result requires ExplainQueryRequest"
            )
        explanation = self._explain_at(request.query_result, request.match_index)
        return ExplainQueryResponse(explanation, request.match_index)

    def query_and_explain(
        self, request: QueryAndExplainRequest
    ) -> QueryAndExplainResponse:
        if not isinstance(request, QueryAndExplainRequest):
            raise UnsupportedApplicationRequestError(
                "query_and_explain requires QueryAndExplainRequest"
            )
        query_result = self.query_records(request.query).query_result
        explanation = self._explain_at(query_result, request.match_index)
        return QueryAndExplainResponse(query_result, explanation, request.match_index)

    def query_explain_and_project(
        self, request: QueryAndExplainRequest
    ) -> ProjectedApplicationResponse:
        if not isinstance(request, QueryAndExplainRequest):
            raise UnsupportedApplicationRequestError(
                "query_explain_and_project requires QueryAndExplainRequest"
            )
        response = self.query_and_explain(request)
        try:
            query = self._query_projector(response.query_result)
            explanation = self._explanation_projector(response.explanation)
        except SerializationError:
            raise
        except (TypeError, ValueError) as error:
            raise ApplicationDependencyError(
                "projection dependency failed its application contract"
            ) from error
        projection: dict[str, JsonValue] = {
            "application_schema": _APPLICATION_SCHEMA,
            "application_version": RUNTIME_APPLICATION_API_VERSION,
            "runtime_api_version": RUNTIME_API_VERSION,
            "projection_version": RUNTIME_JSON_PROJECTION_VERSION,
            "operation": _OPERATION,
            "query": query,
            "explanation": explanation,
        }
        canonical_json = _canonical_application_json(projection)
        return ProjectedApplicationResponse(projection, canonical_json)

    def _explain_at(self, result: QueryResult, match_index: int) -> Explanation:
        if match_index >= result.total_count:
            raise ApplicationContractError("match index is outside the query result")
        return self._explanation_service.explain_query_match(
            result.matches[match_index], result.criteria
        )


def _canonical_application_json(projection: dict[str, JsonValue]) -> str:
    try:
        return json.dumps(
            projection,
            ensure_ascii=False,
            allow_nan=False,
            sort_keys=True,
            separators=(",", ":"),
        )
    except (TypeError, ValueError) as error:
        raise ProjectionContractError(
            "application projection contains a non-JSON-compatible value"
        ) from error
