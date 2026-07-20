"""Library-first FastAPI application factory over RuntimeApplicationService."""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from cpmoakb.application import (
    RUNTIME_APPLICATION_API_VERSION,
    QueryAndExplainRequest,
    QueryRecordsRequest,
    RuntimeApplicationService,
    classify_application_error,
)
from cpmoakb.runtime_api import RUNTIME_API_VERSION
from cpmoakb.serialization import RUNTIME_JSON_PROJECTION_VERSION

from .errors import error_response
from .models import QueryAndExplainHttpRequest, QueryHttpRequest
from .version import RUNTIME_HTTP_API_VERSION


def create_http_app(
    runtime_application_service: RuntimeApplicationService,
) -> FastAPI:
    """Create an independent HTTP adapter from one mandatory injected facade."""

    if not isinstance(runtime_application_service, RuntimeApplicationService):
        raise TypeError("runtime_application_service must be RuntimeApplicationService")

    app = FastAPI(
        title="CP-MoAKB Runtime HTTP API",
        version=RUNTIME_HTTP_API_VERSION,
        docs_url=None,
        redoc_url=None,
        openapi_url="/openapi.json",
        debug=False,
    )

    @app.exception_handler(RequestValidationError)
    def handle_validation_error(
        request: Request, error: RequestValidationError
    ) -> JSONResponse:
        del request, error
        return error_response("transport-validation-error")

    @app.exception_handler(Exception)
    def handle_application_error(request: Request, error: Exception) -> JSONResponse:
        del request
        return error_response(classify_application_error(error))

    @app.get("/health")
    def health() -> dict[str, str]:
        return {
            "status": "ok",
            "http_api_version": RUNTIME_HTTP_API_VERSION,
            "application_api_version": RUNTIME_APPLICATION_API_VERSION,
            "runtime_api_version": RUNTIME_API_VERSION,
            "projection_version": RUNTIME_JSON_PROJECTION_VERSION,
        }

    @app.post("/v1/query")
    def query(payload: QueryHttpRequest) -> JSONResponse:
        request = _query_request(payload)
        response = runtime_application_service.query_and_project(request)
        return JSONResponse(content=response.projection)

    @app.post("/v1/query-and-explain")
    def query_and_explain(payload: QueryAndExplainHttpRequest) -> JSONResponse:
        query_request = _query_request(payload)
        request = QueryAndExplainRequest(query_request, payload.match_index)
        response = runtime_application_service.query_explain_and_project(request)
        return JSONResponse(content=response.projection)

    return app


def _query_request(payload: QueryHttpRequest) -> QueryRecordsRequest:
    return QueryRecordsRequest.from_values(
        domain_type=payload.domain_type,
        label_text=payload.label_text,
        label_scope=payload.label_scope,
        language=payload.language,
        locale=payload.locale,
        match_mode=payload.match_mode,
        predicate=payload.predicate,
    )
