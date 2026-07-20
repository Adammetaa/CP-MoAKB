from __future__ import annotations

import pytest

from cpmoakb.application import (
    ApplicationContractError,
    ApplicationDependencyError,
    QueryRecordsRequest,
    RuntimeApplicationService,
    UnsupportedApplicationRequestError,
)
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryService

from ._support import client


class FailingService(RuntimeApplicationService):
    failure: Exception

    def query_and_project(self, request: QueryRecordsRequest):  # type: ignore[no-untyped-def]
        raise self.failure


@pytest.mark.parametrize(
    ("failure", "status", "code", "message"),
    (
        (
            ApplicationContractError("sensitive C:\\private\\path"),
            400,
            "application-contract-error",
            "The request violates the application contract.",
        ),
        (
            UnsupportedApplicationRequestError("private object repr"),
            400,
            "unsupported-application-request",
            "The application request type is unsupported.",
        ),
        (
            ApplicationDependencyError("private module defect"),
            500,
            "application-dependency-error",
            "An application dependency failed.",
        ),
        (
            RuntimeError("traceback C:\\private\\path internal.module"),
            500,
            "internal-error",
            "An internal transport error occurred.",
        ),
    ),
)
def test_typed_and_unexpected_failures_map_to_stable_safe_envelopes(
    failure: Exception, status: int, code: str, message: str
) -> None:
    service = FailingService(QueryService.from_records(()), ExplanationService())
    service.failure = failure
    response = client(service).post("/v1/query", json={})
    assert response.status_code == status
    assert response.json() == {"error": {"code": code, "message": message}}
    body = response.text.casefold()
    for prohibited in ("traceback", "private", "internal.module", "c:\\"):
        assert prohibited not in body


def test_invalid_match_index_is_documented_application_contract_400() -> None:
    response = client().post(
        "/v1/query-and-explain",
        json={"label_text": "No fictional match", "match_index": 0},
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "application-contract-error"


def test_no_failure_is_converted_to_http_200() -> None:
    service = FailingService(QueryService.from_records(()), ExplanationService())
    service.failure = cast_failure = ApplicationDependencyError("synthetic")
    assert isinstance(cast_failure, Exception)
    assert client(service).post("/v1/query", json={}).status_code == 500
