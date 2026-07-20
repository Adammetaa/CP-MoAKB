# HTTP Factory Integration

**Purpose:** create and inspect the approved FastAPI route set without serving.
**Prerequisites:** local installation with the `http` extra.
**Command:** `python -m examples.http.example`

Output lists health, OpenAPI, query, and query-and-explain routes with their
methods. The APIs are explicit composition and `create_http_app`. No port,
background process, authentication, deployment middleware, or request is created.
See [HTTP integration](../../docs/getting-started/http-integration.md).
