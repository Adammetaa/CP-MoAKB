# Minimal Read-only HTTP API

`cpmoakb.http_api` is a library-first FastAPI `0.139.2` transport over an explicitly injected `RuntimeApplicationService`. Its independent HTTP API version is `0.1`.

The factory exposes `GET /health`, `POST /v1/query`, `POST /v1/query-and-explain`, and static `/openapi.json`. Query bodies accept a strict, bounded subset of existing query criteria. Unknown fields, coercion, arrays, arbitrary nested objects, paths, and URLs are rejected. Query-and-explain requires one explicit bounded `match_index`.

The query endpoint returns the existing RAS-008 query projection. Query-and-explain returns the unchanged RAS-009 application envelope. The transport does not call Query, Explanation, Registry, or projection functions directly and does not expose Python Runtime objects.

Errors use stable machine codes and generic messages. Invalid transport bodies are 422; invalid application match selection is 400; dependency and unexpected failures are 500. Exception messages, reprs, tracebacks, module names, and paths are not exposed.

Interactive Swagger and ReDoc pages are disabled to avoid remote UI assets; `/openapi.json` documents only approved routes. No ASGI server, CLI, deployment stack, registry/data ownership, persistence, startup I/O, authentication, CORS expansion, diagnosis, recommendation, ranking, confidence, or scientific inference is included.

Fictional example:

```json
{
  "label_text": "Fictional Unicode ข้อมูล",
  "match_mode": "exact"
}
```

The normative contract is [RAS-010](specifications/RAS-010-runtime-http-transport-contract.md).
