"""Lazy public boundary for the optional read-only HTTP transport."""

from __future__ import annotations

from typing import TYPE_CHECKING

from .version import RUNTIME_HTTP_API_VERSION

if TYPE_CHECKING:
    from fastapi import FastAPI

    from cpmoakb.application import RuntimeApplicationService


def create_http_app(
    runtime_application_service: RuntimeApplicationService,
) -> FastAPI:
    """Load FastAPI only when the caller explicitly creates an HTTP app."""

    from .app import create_http_app as create_app

    return create_app(runtime_application_service)


__all__ = ["RUNTIME_HTTP_API_VERSION", "create_http_app"]
