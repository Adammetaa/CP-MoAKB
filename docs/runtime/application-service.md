# Runtime Application Service

Installed consumers obtain this facade through the optional convenience boundary
`create_runtime_application_service(query_service=..., explanation_service=...)`.
RAS-012 adds no defaults and does not change the constructor or Application API
`0.1`; callers continue to own every meaningful dependency.

`cpmoakb.application` is the transport-neutral boundary for approved read-only query and query-explanation use cases. Its independent application API version is `0.1`.

`RuntimeApplicationService` receives existing `QueryService` and `ExplanationService` instances. It can query records, project a query through `query_and_project`, explain an explicitly selected query match, combine those operations, or compose their existing RAS-008 projections in a deterministic application envelope. It never copies query matching or explanation-building logic.

`QueryRecordsRequest.from_values` is the narrow application-owned construction boundary used by the HTTP adapter. It supports only domain type, label text/scope, language, locale, match mode, and predicate and delegates all meaning to `QueryCriteria`.

Requests and structured responses are frozen typed values. `QueryCriteria`, `QueryResult`, and `Explanation` remain the underlying Runtime contracts. Projected responses return isolated JSON-compatible containers plus canonical Unicode JSON text; nested RAS-008 envelopes are unchanged.

Existing typed Query, Explanation, and Serialization errors propagate. Application errors cover unsupported request objects, invalid request/index contracts, and untyped injected projection dependency defects.

This package itself provides no transport, CLI, persistence, file or database access, JSON deserialization, registry mutation, YAML orchestration, authentication, async work, diagnosis, recommendation, ranking, confidence scoring, or scientific inference. The separate [HTTP adapter](http-api.md) calls this facade rather than coordinating internal modules.

The separate [reference CLI](cli.md) also consumes canonical application responses directly. Both transports require an explicitly injected facade and neither owns data or registries.

The normative contract is [RAS-009](specifications/RAS-009-runtime-application-service-contract.md).
