"""Stable HTTP error envelopes and application-to-HTTP mapping."""

from __future__ import annotations

from fastapi.responses import JSONResponse

_ERRORS: dict[str, tuple[int, str]] = {
    "transport-validation-error": (
        422,
        "The request body violates the HTTP contract.",
    ),
    "application-contract-error": (
        400,
        "The request violates the application contract.",
    ),
    "unsupported-application-request": (
        400,
        "The application request type is unsupported.",
    ),
    "application-dependency-error": (
        500,
        "An application dependency failed.",
    ),
    "runtime-query-error": (500, "The Runtime query operation failed."),
    "runtime-explanation-error": (
        500,
        "The Runtime explanation operation failed.",
    ),
    "runtime-serialization-error": (
        500,
        "The Runtime projection operation failed.",
    ),
    "internal-error": (500, "An internal transport error occurred."),
}


def error_response(code: str) -> JSONResponse:
    status_code, message = _ERRORS.get(code, _ERRORS["internal-error"])
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message}},
    )
