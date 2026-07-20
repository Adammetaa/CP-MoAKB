# HTTP API

**Version:** `0.1`
**Public symbols:** `RUNTIME_HTTP_API_VERSION`, `create_http_app`.

`create_http_app(runtime_application_service) -> FastAPI` requires the optional
HTTP extra and a caller-composed facade. It creates an independent app with only:

| Method | Path | Result |
| --- | --- | --- |
| GET | `/health` | Static version/health object |
| POST | `/v1/query` | Query projection |
| POST | `/v1/query-and-explain` | Combined application projection |
| GET | `/openapi.json` | OpenAPI schema |

Strict bounded models reject coercion and unknown fields. Known contract failures
map to stable codes/statuses; unexpected failures remain generic. Swagger and
ReDoc are disabled. The factory does not start a server, own data, or implement
authentication, TLS, rate limiting, CORS, or deployment policy. Governed by
RAS-010 and RAS-013; see the [HTTP example](../../examples/http/README.md).
