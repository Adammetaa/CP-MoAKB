from __future__ import annotations

from fastapi.testclient import TestClient

from cpmoakb.application import RuntimeApplicationService
from cpmoakb.explain import ExplanationService
from cpmoakb.http_api import create_http_app
from cpmoakb.query import QueryService
from tests.query._support import entity


def runtime_service() -> RuntimeApplicationService:
    return RuntimeApplicationService(
        QueryService.from_records(
            (
                entity(992002, preferred_text="Fictional Beta"),
                entity(992001, preferred_text="Fictional Unicode ข้อมูล"),
            )
        ),
        ExplanationService(),
    )


def client(service: RuntimeApplicationService | None = None) -> TestClient:
    return TestClient(
        create_http_app(service or runtime_service()), raise_server_exceptions=False
    )
