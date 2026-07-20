# Application API

**Version:** `0.1`
**Purpose:** a transport-neutral facade over caller-supplied query and explanation
services.

Public symbols include the request/response types, `RuntimeApplicationService`,
the application error hierarchy, `classify_application_error`, and
`RUNTIME_APPLICATION_API_VERSION`; see the [exact manifest](public-symbols.md).

The facade is constructed as
`RuntimeApplicationService(query_service, explanation_service, *, query_projector=..., explanation_projector=...)`.
Its closed operations are `query_records`, `explain_query_result`,
`query_and_project`, `query_and_explain`, and `query_explain_and_project`, each
accepting its matching typed request and returning its matching immutable response.

Callers own service state and select match indexes explicitly. Projection methods
return canonical deterministic JSON alongside isolated projection values. Typed
Runtime failures remain typed; invalid requests raise application errors; defects
in injected projectors become `ApplicationDependencyError`. No persistence,
validation orchestration, transport, or arbitrary operation dispatch exists.
Governed by RAS-009; see [query-and-explain](../../examples/query_and_explain/README.md).
