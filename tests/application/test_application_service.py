from __future__ import annotations

from dataclasses import FrozenInstanceError
from typing import Any, cast

import pytest

from cpmoakb.application import (
    ApplicationContractError,
    ApplicationDependencyError,
    ExplainQueryRequest,
    QueryAndExplainRequest,
    QueryRecordsRequest,
    RuntimeApplicationService,
    UnsupportedApplicationRequestError,
)
from cpmoakb.explain import ExplanationService, render_explanation
from cpmoakb.query import QueryCriteria, QueryError, QueryService
from cpmoakb.serialization import (
    project_query_result,
    project_structured_explanation,
)
from tests.query._support import entity


class TrackingQueryService(QueryService):
    calls = 0

    def search(self, criteria: QueryCriteria):  # type: ignore[no-untyped-def]
        self.calls += 1
        return super().search(criteria)


class TrackingExplanationService(ExplanationService):
    calls = 0

    def explain_query_match(self, match, criteria):  # type: ignore[no-untyped-def]
        self.calls += 1
        return super().explain_query_match(match, criteria)


class FailingQueryService(QueryService):
    def search(self, criteria: QueryCriteria):  # type: ignore[no-untyped-def]
        raise QueryError("synthetic query dependency failure")


def _service() -> RuntimeApplicationService:
    return RuntimeApplicationService(
        QueryService.from_records(
            (
                entity(991002, preferred_text="Fictional Beta"),
                entity(991001, preferred_text="Fictional Unicode ข้อมูล"),
            )
        ),
        ExplanationService(),
    )


def _request() -> QueryAndExplainRequest:
    return QueryAndExplainRequest(
        QueryRecordsRequest(QueryCriteria(label_text="Fictional Unicode ข้อมูล"))
    )


def test_query_delegates_and_equals_direct_deterministic_result() -> None:
    records = (
        entity(991002, preferred_text="Fictional Beta"),
        entity(991001, preferred_text="Fictional Unicode ข้อมูล"),
    )
    tracking = cast(TrackingQueryService, TrackingQueryService.from_records(records))
    service = RuntimeApplicationService(tracking, ExplanationService())
    request = QueryRecordsRequest(QueryCriteria())
    direct = QueryService.from_records(records).search(request.criteria)

    first = service.query_records(request)
    second = service.query_records(request)
    assert first == second
    assert first.query_result == direct
    assert tracking.calls == 2
    assert tuple(str(record.identifier) for record in records) == (
        "CPM-CAND-E-991002",
        "CPM-CAND-E-991001",
    )


def test_explain_delegates_and_preserves_renderer_output() -> None:
    query_result = _service().query_records(_request().query).query_result
    tracking = TrackingExplanationService()
    service = RuntimeApplicationService(QueryService.from_records(()), tracking)
    request = ExplainQueryRequest(query_result)
    direct = ExplanationService().explain_query_match(
        query_result.matches[0], query_result.criteria
    )
    rendered = render_explanation(direct)

    response = service.explain_query_result(request)
    assert response.explanation == direct
    assert tracking.calls == 1
    assert render_explanation(response.explanation) == rendered


def test_query_and_explain_matches_separate_operations_without_inference() -> None:
    service = _service()
    request = _request()
    combined = service.query_and_explain(request)
    separate_query = service.query_records(request.query).query_result
    separate_explanation = service.explain_query_result(
        ExplainQueryRequest(separate_query, request.match_index)
    ).explanation

    assert combined.query_result == separate_query
    assert combined.explanation == separate_explanation
    rendered = render_explanation(combined.explanation).casefold()
    assert "rank" not in rendered
    assert "recommend" not in rendered
    assert "diagnosis" not in rendered


def test_projected_operation_composes_ras_008_and_is_canonical_unicode_safe() -> None:
    service = _service()
    first = service.query_explain_and_project(_request())
    second = service.query_explain_and_project(_request())
    structured = service.query_and_explain(_request())

    assert first == second
    assert first.projection == {
        "application_schema": "cpmoakb-runtime-application",
        "application_version": "0.1",
        "runtime_api_version": "0.1",
        "projection_version": "1.0",
        "operation": "query-and-explain",
        "query": project_query_result(structured.query_result),
        "explanation": project_structured_explanation(structured.explanation),
    }
    assert "Fictional Unicode ข้อมูล" in first.canonical_json
    assert "timestamp" not in first.canonical_json
    assert "\\" not in first.canonical_json
    with pytest.raises(FrozenInstanceError):
        first.canonical_json = "changed"  # type: ignore[misc]


def test_projection_response_does_not_alias_dependency_mapping() -> None:
    captured: dict[str, Any] = {}

    def projector(value):  # type: ignore[no-untyped-def]
        captured["value"] = {"nested": []}
        return cast(Any, captured["value"])

    service = RuntimeApplicationService(
        QueryService.from_records((entity(991001),)),
        ExplanationService(),
        query_projector=projector,
    )
    response = service.query_explain_and_project(
        QueryAndExplainRequest(QueryRecordsRequest(QueryCriteria()))
    )
    captured["value"]["nested"].append("changed")
    response_projection = cast(dict[str, Any], response.projection)
    assert "changed" not in response_projection["query"]["nested"]


def test_contract_failures_and_existing_typed_errors_are_preserved() -> None:
    service = _service()
    empty_result = service.query_records(
        QueryRecordsRequest(QueryCriteria(label_text="No fictional match"))
    ).query_result
    with pytest.raises(ApplicationContractError, match="outside"):
        service.explain_query_result(ExplainQueryRequest(empty_result))
    with pytest.raises(UnsupportedApplicationRequestError):
        service.query_records(cast(Any, object()))

    failing = RuntimeApplicationService(
        FailingQueryService.from_records(()), ExplanationService()
    )
    with pytest.raises(QueryError, match="synthetic"):
        failing.query_records(QueryRecordsRequest(QueryCriteria()))


def test_dependency_wrapping_preserves_exception_chain() -> None:
    def broken_projector(value):  # type: ignore[no-untyped-def]
        raise ValueError("synthetic projector defect")

    service = RuntimeApplicationService(
        QueryService.from_records((entity(991001),)),
        ExplanationService(),
        query_projector=broken_projector,
    )
    with pytest.raises(ApplicationDependencyError) as captured:
        service.query_explain_and_project(
            QueryAndExplainRequest(QueryRecordsRequest(QueryCriteria()))
        )
    assert isinstance(captured.value.__cause__, ValueError)


def test_two_instances_are_stateless_and_equivalent() -> None:
    assert _service().query_and_explain(_request()) == _service().query_and_explain(
        _request()
    )
