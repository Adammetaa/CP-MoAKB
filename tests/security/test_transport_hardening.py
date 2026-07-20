from __future__ import annotations

from tests.cli._support import invoke
from tests.http_api._support import client


def test_http_malformed_input_has_a_bounded_generic_error() -> None:
    response = client().post(
        "/v1/query",
        content=b'{"label_text":',
        headers={"content-type": "application/json"},
    )
    assert response.status_code == 422
    assert response.json() == {
        "error": {
            "code": "transport-validation-error",
            "message": "The request body violates the HTTP contract.",
        }
    }
    assert len(response.content) < 256


def test_http_surface_excludes_interactive_and_unapproved_routes() -> None:
    http = client()
    assert http.get("/docs").status_code == 404
    assert http.get("/redoc").status_code == 404
    assert http.post("/v1/admin", json={}).status_code == 404


def test_cli_rejects_oversized_input_without_echoing_it() -> None:
    marker = "PRIVATE-MARKER-" + "x" * 300
    exit_code, stdout, stderr = invoke(("query", "--label-text", marker))
    assert exit_code == 2
    assert stdout == ""
    assert marker not in stderr
    assert stderr.count("\n") == 1
    assert len(stderr) < 256
