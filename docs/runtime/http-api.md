# Minimal Read-only HTTP API

FastAPI is available through the optional `http` extra. The package boundary is
lazy so base, application, composition, and CLI imports do not require FastAPI.
There is no default app or server executable: callers install the extra, compose
a `RuntimeApplicationService`, and pass it to `create_http_app`. HTTP API remains
`0.1` and no host, port, authentication, or persistence policy is introduced.

`cpmoakb.http_api` is a library-first FastAPI `0.139.2` transport over an explicitly injected `RuntimeApplicationService`. Its independent HTTP API version is `0.1`.

The factory exposes `GET /health`, `POST /v1/query`, `POST /v1/query-and-explain`, and static `/openapi.json`. Query bodies accept a strict, bounded subset of existing query criteria. Unknown fields, coercion, arrays, arbitrary nested objects, paths, and URLs are rejected. Query-and-explain requires one explicit bounded `match_index`.

The query endpoint returns the existing RAS-008 query projection. Query-and-explain returns the unchanged RAS-009 application envelope. The transport does not call Query, Explanation, Registry, or projection functions directly and does not expose Python Runtime objects.

Errors use stable machine codes and generic messages. Invalid transport bodies are 422; invalid application match selection is 400; dependency and unexpected failures are 500. Exception messages, reprs, tracebacks, module names, and paths are not exposed.

Request strings are bounded, model coercion and unknown fields are rejected, and
the match index is bounded from 0 through 10,000. Unsupported paths and methods
remain outside the application surface. Authentication, authorization, rate
limiting, TLS termination, proxy limits, and deployment logging are explicitly
the responsibility of a separately reviewed deployment boundary.

Interactive Swagger and ReDoc pages are disabled to avoid remote UI assets; `/openapi.json` documents only approved routes. No ASGI server, CLI, deployment stack, registry/data ownership, persistence, startup I/O, authentication, CORS expansion, diagnosis, recommendation, ranking, confidence, or scientific inference is included.

The [reference CLI](cli.md) is a separate sibling transport. It does not call HTTP routes or import HTTP framework internals; it shares only public version information and the application facade boundary.

Fictional example:

```json
{
  "label_text": "Fictional Unicode ข้อมูล",
  "match_mode": "exact"
}
```

The normative contract is [RAS-010](specifications/RAS-010-runtime-http-transport-contract.md).
