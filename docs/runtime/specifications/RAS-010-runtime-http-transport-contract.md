# RAS-010: Runtime HTTP Transport Contract

**Status:** Active

**Version:** 1.0

## Purpose and architectural context

This specification governs the minimal read-only HTTP transport over `RuntimeApplicationService`. The transport translates a closed JSON request contract into existing application requests, calls only the application facade, and returns existing application-approved projections through deterministic HTTP responses.

The HTTP API version is `0.1`, exposed as `RUNTIME_HTTP_API_VERSION`. It is independent from Runtime API `0.1`, YAML input schema `1.0`, JSON projection `1.0`, Application API `0.1`, and repository releases.

The transport is library-first. `create_http_app(runtime_application_service)` requires an explicitly constructed facade. It owns no registries, records, or data source and has no default service, singleton, service locator, startup/shutdown I/O, environment configuration, background task, or server launch.

## Framework decision and dependency direction

FastAPI `0.139.2` is the smallest safe fit for strict JSON request validation, deterministic in-process routing tests, and explicit exception handlers. HTTPX2 `2.7.0` is a development-only direct pin required by the matching Starlette TestClient. No production ASGI server is included.

Dependency direction is `http_api` to `application`, plus public version constants from `runtime_api` and `serialization`. It MUST NOT import Query, Explanation, Registry, Validation, Domain, YAML adapter, parser, exporter, database, dataset, filesystem, environment, or network-client modules. All lower layers MUST NOT import `http_api`.

The small additive RAS-009 extension `QueryRecordsRequest.from_values` constructs the approved primitive criteria subset inside the application boundary, and `RuntimeApplicationService.query_and_project` returns the existing RAS-008 query projection. This prevents transport access to Query or Serialization behavior and changes no existing envelope or semantics.

## Supported endpoints

- `GET /health` returns exactly status plus HTTP, Application, Runtime, and projection versions.
- `POST /v1/query` accepts the approved query subset and returns the existing RAS-008 `query-result` projection.
- `POST /v1/query-and-explain` additionally requires `match_index` and returns the unchanged RAS-009 `query-and-explain` application envelope.
- `GET /openapi.json` exposes static framework-generated documentation for only the approved routes.

There is no capability, mutation, upload, validation submission, registry, YAML, export, file, database, diagnosis, recommendation, product, authentication, or administration endpoint.

## Request contracts and limits

All request bodies MUST be JSON objects. Unknown fields and type coercion are rejected. The query subset is:

- `domain_type`, `label_text`, and `predicate`: optional strings, 1–256 characters and not ASCII-whitespace-only;
- `language` and `locale`: optional strings, 1–64 characters;
- `label_scope`: `any`, `preferred`, or `alternative`, default `any`;
- `match_mode`: `exact`, `case_insensitive`, or `conservative_normalized`, default `exact`;
- `match_index`: required only for query-and-explain, strict integer from 0 through 10,000.

There are no arrays, arbitrary nested objects, metadata, dynamic operations, class/module names, paths, URLs, forms, multipart bodies, files, XML, YAML, streams, WebSockets, or GraphQL. FastAPI/Pydantic models remain private to `http_api` and are explicitly translated; they never cross into the application layer.

## Response contracts and determinism

Responses use `application/json`. `/health` has no time, hostname, PID, path, environment, dependency version, Git SHA, or random data. Query responses use `ProjectedApplicationResponse.projection`; the transport does not project, serialize and reparse canonical JSON, or expose Runtime Python objects. Unicode is preserved. Equal injected state and equal requests produce semantically equal bodies.

Normal empty query results return HTTP 200 with zero matches. Query-and-explain does not explain all matches; an absent or transport-invalid index is 422, while an in-range transport value outside the actual result is an application contract error mapped to 400.

## Error mapping

Every exposed error has exactly `{ "error": { "code": ..., "message": ... } }`. Exception text, repr, traceback, paths, and module names are never included.

| Failure | Status | Code |
| --- | ---: | --- |
| FastAPI/Pydantic request validation | 422 | `transport-validation-error` |
| `ApplicationContractError` | 400 | `application-contract-error` |
| `UnsupportedApplicationRequestError` | 400 | `unsupported-application-request` |
| `ApplicationDependencyError` | 500 | `application-dependency-error` |
| Typed Query failure classified by application | 500 | `runtime-query-error` |
| Typed Explanation failure classified by application | 500 | `runtime-explanation-error` |
| Typed Serialization failure classified by application | 500 | `runtime-serialization-error` |
| Unexpected exception | 500 | `internal-error` |

Typed errors remain intact until the HTTP exception boundary. `classify_application_error` keeps lower-layer types out of the transport package. No failure becomes HTTP 200.

## OpenAPI and documentation policy

`/openapi.json` remains enabled because it describes only the approved library routes and request schemas without starting a server. Interactive `/docs` and `/redoc` are disabled because their default pages reference remote UI assets. There are no custom scripts or frontend assets.

## Security and prohibited behavior

The adapter MUST NOT execute input, deserialize Python objects, use pickle, eval, exec, dynamic imports, environment secrets, filesystem or outbound network access, debug pages, CORS expansion, cookies, sessions, authentication, authorization, rate limits, metrics, tracing, deployment infrastructure, persistence, registry mutation, record construction, identifier allocation, diagnosis, recommendation, ranking, confidence, causality, economics, or product selection.

Importing the package MUST NOT start a server. No `uvicorn.run` or production server dependency exists. The factory MUST be deterministic and create independent app instances.

## Compatibility and extension rules

Public HTTP symbols MUST be listed in `cpmoakb.http_api.__all__`, the Runtime manifest, and static contract tests. This additive package is backward compatible under RAS-007 and does not change the Runtime version. RAS-008 continues to own nested query projection; RAS-009 owns application requests, orchestration, and the combined envelope.

Changing an endpoint, method, required field, bound, response envelope, error status/code, OpenAPI decision, factory signature, or dependency direction requires compatibility analysis. Breaking transport changes require a new HTTP API version and architecture review.

Future authentication, deployment, interactive documentation, additional criteria, or endpoints require separate architecture and security decisions. They MUST NOT be inferred from this contract.
