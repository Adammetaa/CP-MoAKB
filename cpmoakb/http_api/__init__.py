"""Minimal read-only HTTP transport over the Runtime application facade."""

from .app import RUNTIME_HTTP_API_VERSION, create_http_app

__all__ = ["RUNTIME_HTTP_API_VERSION", "create_http_app"]
