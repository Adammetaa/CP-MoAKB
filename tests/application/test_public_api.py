from dataclasses import FrozenInstanceError

import pytest

import cpmoakb.application as application
from cpmoakb.application import (
    ExplainQueryRequest,
    ExplainQueryResponse,
    QueryAndExplainRequest,
    QueryAndExplainResponse,
    QueryRecordsRequest,
    QueryRecordsResponse,
)
from cpmoakb.explain import ExplanationService, UnavailableRequestType
from cpmoakb.query import QueryCriteria, QueryResult


def test_version_and_public_exports_are_exact() -> None:
    assert application.RUNTIME_APPLICATION_API_VERSION == "0.1"
    assert set(application.__all__) == {
        "ApplicationContractError",
        "ApplicationDependencyError",
        "ApplicationServiceError",
        "ExplainQueryRequest",
        "ExplainQueryResponse",
        "ProjectedApplicationResponse",
        "QueryAndExplainRequest",
        "QueryAndExplainResponse",
        "QueryRecordsRequest",
        "QueryRecordsResponse",
        "RUNTIME_APPLICATION_API_VERSION",
        "RuntimeApplicationService",
        "UnsupportedApplicationRequestError",
        "classify_application_error",
    }


def test_request_and_response_objects_are_frozen_and_explicit() -> None:
    query_request = QueryRecordsRequest(QueryCriteria())
    explain_request = ExplainQueryRequest(QueryResult(QueryCriteria()))
    combined_request = QueryAndExplainRequest(query_request)
    query_response = QueryRecordsResponse(QueryResult(QueryCriteria()))
    explanation = ExplanationService().explain_unavailable(
        UnavailableRequestType.DIAGNOSIS
    )
    responses = (
        ExplainQueryResponse(explanation, 0),
        QueryAndExplainResponse(query_response.query_result, explanation, 0),
    )

    with pytest.raises(FrozenInstanceError):
        query_request.criteria = QueryCriteria()  # type: ignore[misc]
    with pytest.raises(FrozenInstanceError):
        explain_request.match_index = 1  # type: ignore[misc]
    with pytest.raises(FrozenInstanceError):
        combined_request.match_index = 1  # type: ignore[misc]
    for response in responses:
        with pytest.raises(FrozenInstanceError):
            response.match_index = 2  # type: ignore[misc,union-attr]
