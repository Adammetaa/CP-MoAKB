# Runtime Application Service

`cpmoakb.application` is the transport-neutral boundary for approved read-only query and query-explanation use cases. Its independent application API version is `0.1`.

`RuntimeApplicationService` receives existing `QueryService` and `ExplanationService` instances. It can query records, explain an explicitly selected query match, combine those operations, or compose their existing RAS-008 projections in a deterministic application envelope. It never copies query matching or explanation-building logic.

Requests and structured responses are frozen typed values. `QueryCriteria`, `QueryResult`, and `Explanation` remain the underlying Runtime contracts. Projected responses return isolated JSON-compatible containers plus canonical Unicode JSON text; nested RAS-008 envelopes are unchanged.

Existing typed Query, Explanation, and Serialization errors propagate. Application errors cover unsupported request objects, invalid request/index contracts, and untyped injected projection dependency defects.

This package provides no HTTP transport, CLI, persistence, file or database access, JSON deserialization, registry mutation, YAML orchestration, authentication, async work, diagnosis, recommendation, ranking, confidence scoring, or scientific inference. Future transports should call this facade for its supported operations rather than coordinate internal modules directly.

The normative contract is [RAS-009](specifications/RAS-009-runtime-application-service-contract.md).
