from __future__ import annotations

import ast
import inspect
from pathlib import Path

import pytest

from cpmoakb.application import ApplicationContractError, QueryRecordsRequest
from cpmoakb.composition import (
    RUNTIME_COMPOSITION_API_VERSION,
    create_runtime_application_service,
)
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryCriteria, QueryService

ROOT = Path(__file__).parents[2]


def test_composition_api_is_explicit_and_versioned() -> None:
    signature = inspect.signature(create_runtime_application_service)
    assert RUNTIME_COMPOSITION_API_VERSION == "0.1"
    assert tuple(signature.parameters) == ("query_service", "explanation_service")
    assert all(
        parameter.kind is inspect.Parameter.KEYWORD_ONLY
        and parameter.default is inspect.Parameter.empty
        for parameter in signature.parameters.values()
    )


def test_repeated_composition_with_same_inputs_is_behaviorally_equivalent() -> None:
    query_service = QueryService.from_records(())
    explanation_service = ExplanationService()
    first = create_runtime_application_service(
        query_service=query_service, explanation_service=explanation_service
    )
    second = create_runtime_application_service(
        query_service=query_service, explanation_service=explanation_service
    )
    request = QueryRecordsRequest(QueryCriteria())
    assert first is not second
    assert first.query_records(request) == second.query_records(request)


def test_invalid_dependencies_use_existing_stable_application_error() -> None:
    with pytest.raises(
        ApplicationContractError, match="query dependency must provide search"
    ):
        create_runtime_application_service(
            query_service=object(),  # type: ignore[arg-type]
            explanation_service=ExplanationService(),
        )


def test_composition_contains_no_hidden_io_discovery_or_service_instance() -> None:
    path = ROOT / "cpmoakb" / "composition" / "__init__.py"
    tree = ast.parse(path.read_text(encoding="utf-8"))
    imports = {
        node.module
        for node in ast.walk(tree)
        if isinstance(node, ast.ImportFrom) and node.module is not None
    }
    assert imports == {"cpmoakb.application", "cpmoakb.explain", "cpmoakb.query"}
    prohibited_calls = {
        "open",
        "getenv",
        "environ",
        "socket",
        "run",
        "Popen",
        "import_module",
    }
    called = {
        node.func.id
        for node in ast.walk(tree)
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name)
    }
    assert called.isdisjoint(prohibited_calls)
