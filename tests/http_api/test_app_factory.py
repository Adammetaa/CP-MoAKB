import importlib
from types import ModuleType

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

import cpmoakb.http_api
from cpmoakb.http_api import create_http_app

from ._support import runtime_service


def test_factory_requires_injected_runtime_application_service() -> None:
    with pytest.raises(TypeError, match="RuntimeApplicationService"):
        create_http_app(None)  # type: ignore[arg-type]


def test_factory_creates_independent_apps_without_hidden_state() -> None:
    first = create_http_app(runtime_service())
    second = create_http_app(runtime_service())
    assert first is not second
    assert first.routes is not second.routes
    assert (
        TestClient(first).get("/health").json()
        == TestClient(second).get("/health").json()
    )


def test_import_does_not_start_server_or_create_global_app() -> None:
    module = importlib.reload(cpmoakb.http_api)
    imported_app = getattr(module, "app", None)
    assert imported_app is None or isinstance(imported_app, ModuleType)
    assert not isinstance(imported_app, FastAPI)
    assert not hasattr(module, "server")


def test_openapi_json_is_available_but_interactive_remote_asset_docs_are_disabled() -> (
    None
):
    client = TestClient(create_http_app(runtime_service()))
    assert client.get("/openapi.json").status_code == 200
    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404
