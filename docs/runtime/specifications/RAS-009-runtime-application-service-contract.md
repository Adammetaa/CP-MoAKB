# RAS-009: Runtime Application Service Contract

**Status:** Active

**Version:** 1.0

## Purpose and context

This specification governs a small transport-neutral application facade over the existing read-only Query, Explanation, and JSON Projection services. Future HTTP, CLI, or web adapters may call this facade where these approved use cases apply instead of coordinating internal Runtime modules or relying on dataclass layouts.

The application API version is `0.1`, exposed as `RUNTIME_APPLICATION_API_VERSION`. It is independent from Runtime API `0.1`, YAML input schema `1.0`, JSON projection schema `1.0`, and repository releases.

## Supported operations

The closed operation set is:

- `query_records`: apply an existing `QueryCriteria` through an injected public `QueryService` and return its `QueryResult`.
- `query_and_project`: query and return the unchanged RAS-008 query-result projection.
- `explain_query_result`: select an explicit zero-based match from an existing `QueryResult`, call `ExplanationService.explain_query_match`, and return its structured `Explanation`.
- `query_and_explain`: perform the preceding operations in order.
- `query_explain_and_project`: compose the existing RAS-008 query and structured-explanation projections in the application envelope.

The explicit `match_index` MUST be a non-negative integer and MUST identify an existing match. The facade MUST NOT invent an explanation for an empty result or silently substitute another match.

## Requests and responses

Requests and structured responses MUST be immutable, transport-neutral, typed compositions of existing public Runtime values. They MUST NOT accept arbitrary dictionaries, untyped payloads, HTTP fields, user identity, generated time, random request IDs, environment data, or executable predicates.

`QueryRecordsRequest.from_values` MAY construct the approved primitive query subset for transports. It MUST create the existing `QueryCriteria` and MUST NOT add matching semantics.

Structured responses retain `QueryResult` and `Explanation`; JSON dictionaries MUST NOT replace them internally. Projected responses MUST isolate mutable JSON-compatible containers from dependencies and callers. No response contains traceback text, status codes, headers, URLs, or private service state.

## Dependencies, statelessness, and determinism

`RuntimeApplicationService` receives query and explanation services explicitly through construction, with optional typed projection callables for controlled substitution. No dependency-injection framework, service locator, singleton, registry ownership, cache, mutable global state, I/O, async work, or background worker is permitted.

The facade holds only explicit read-only service dependencies and performs no state transition. Equal dependencies and equal requests MUST produce equal responses and canonical text. It MUST delegate matching and explanation construction rather than copying their logic.

Dependency direction is `application` to `query`, `explain`, `serialization`, and `runtime_api`. Lower Runtime and legacy layers MUST NOT import `application`. Application MUST NOT import YAML adapters, parsers, exporters, databases, datasets, web frameworks, filesystem utilities, or network clients.

## Error policy

`ApplicationServiceError` is the application base error. `UnsupportedApplicationRequestError` rejects an object of the wrong request type. `ApplicationContractError` rejects invalid request composition, invalid match selection, or dependency shape. `ApplicationDependencyError` wraps an untyped `TypeError` or `ValueError` emitted by an injected projection dependency and MUST retain exception chaining.

Existing typed Query, Explanation, and Serialization errors MUST propagate unchanged so callers can act on their established contracts. Failures MUST NOT be swallowed, converted into successful responses, assigned HTTP status codes, or rendered with tracebacks.

## Projection composition

The application schema identity is `cpmoakb-runtime-application`, version `0.1`. The only projected operation is `query-and-explain`:

```json
{
  "application_schema": "cpmoakb-runtime-application",
  "application_version": "0.1",
  "runtime_api_version": "0.1",
  "projection_version": "1.0",
  "operation": "query-and-explain",
  "query": {"projection_schema": "cpmoakb-runtime-json"},
  "explanation": {"projection_schema": "cpmoakb-runtime-json"}
}
```

The complete existing RAS-008 envelopes MUST be composed unchanged. Canonical application JSON uses Unicode output, sorted keys, compact separators, no trailing whitespace, and no generated metadata. There is no arbitrary operation dispatcher.

## Compatibility and public API

All public symbols MUST be listed in `cpmoakb.application.__all__`, the Runtime manifest, and static contract tests. The additive application package is backward compatible under RAS-007 and does not change Runtime API `0.1`. Changing required request fields, response types, operation meaning, match selection, error policy, dependency direction, application envelope, or canonical output requires compatibility analysis. Breaking application changes require a new application API version and architecture review.

## Security, non-goals, and extension rules

The facade MUST NOT execute input, deserialize arbitrary objects, dynamically import classes, use `eval`, `exec`, or `pickle`, read environment variables, access filesystems or networks, connect to databases, expose internals, or dispatch from untrusted operation strings.

It MUST NOT load YAML, parse JSON, validate or register candidates, allocate identifiers, mutate registries, persist or write files, implement HTTP or CLI, authenticate, authorize, infer scientific claims, diagnose, recommend, rank, score confidence, calculate treatment costs, or select products.

RAS-005 continues to govern query meaning and ordering; RAS-006 governs explanation structure and rendering; RAS-007 governs public compatibility; RAS-008 governs nested projections. Future transport adapters MUST remain separate and SHOULD depend on this facade for the operations it covers. New operations require an explicit typed request/response, closed public method, dependency review, specification amendment, and contract tests.
