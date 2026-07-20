# HTTP Integration

Prerequisite: install the local `.[http]` extra. Run the offline factory example:

```shell
python -m examples.http.example
```

It creates a FastAPI application from an explicitly composed application service
and prints the approved route set. It does not start a server or open a port.

The adapter supports `GET /health`, `POST /v1/query`,
`POST /v1/query-and-explain`, and `GET /openapi.json`. Request models are strict
and bounded; errors are generic. Authentication, authorization, TLS, byte limits,
rate limiting, deployment logging, and production serving belong to a separately
reviewed deployment. See the [HTTP API handbook](../api/http-api.md).
