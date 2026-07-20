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
from cpmoakb.query import QueryError, QueryService

from ._support import invoke


class FailingService(RuntimeApplicationService):
    failure: Exception

    def query_and_project(self, request: QueryRecordsRequest):  # type: ignore[no-untyped-def]
        raise self.failure


@pytest.mark.parametrize(
    ("failure", "exit_code", "code"),
    (
        (ApplicationContractError("private C:\\path"), 3, "application-contract-error"),
        (
            UnsupportedApplicationRequestError("private repr"),
            4,
            "unsupported-application-request",
        ),
        (
            ApplicationDependencyError("private module"),
            5,
            "application-dependency-error",
        ),
        (QueryError("private Runtime detail"), 6, "runtime-query-error"),
        (RuntimeError("traceback private.module C:\\path"), 70, "internal-error"),
    ),
)
def test_failures_have_stable_stderr_only_documents(
    failure: Exception, exit_code: int, code: str
) -> None:
    service = FailingService(QueryService.from_records(()), ExplanationService())
    service.failure = failure
    actual_exit, stdout, stderr = invoke(("query",), service)
    assert actual_exit == exit_code
    assert stdout == ""
    assert f'"code":"{code}"' in stderr
    assert stderr.count("\n") == 1
    for prohibited in ("traceback", "private", "private.module", "c:\\", "repr"):
        assert prohibited not in stderr.casefold()


def test_no_failure_exit_code_is_zero() -> None:
    for failure in (
        ApplicationContractError(),
        UnsupportedApplicationRequestError(),
        ApplicationDependencyError(),
        QueryError(),
        RuntimeError(),
    ):
        service = FailingService(QueryService.from_records(()), ExplanationService())
        service.failure = failure
        assert invoke(("query",), service)[0] != 0
