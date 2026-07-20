# Composition API

**Version:** `0.1`
**Public symbols:** `RUNTIME_COMPOSITION_API_VERSION` and
`create_runtime_application_service`.

Signature shape:

```python
create_runtime_application_service(
    *, query_service: QueryService, explanation_service: ExplanationService
) -> RuntimeApplicationService
```

Both dependencies are mandatory keyword-only caller-owned values. Every call
returns a new facade. Existing application contract errors reject invalid
dependencies. Composition performs no discovery, loading, registry creation,
networking, environment access, singleton caching, or fallback construction.

The API is stable under RAS-007 and governed specifically by RAS-012. Any default
state or additional dependency would require contract and compatibility review.
See the [composition example](../../examples/composition/README.md).
