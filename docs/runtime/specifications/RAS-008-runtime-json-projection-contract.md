# RAS-008: Runtime JSON Projection Contract

**Status:** Active

**Version:** 1.0

## Purpose and non-goals

This specification governs a deterministic, versioned, output-only JSON projection for selected immutable Runtime results. It provides an explicit exchange representation for future consumers while preserving Runtime API `0.1` semantics.

It does not define JSON input, deserialization, domain reconstruction, round trips, persistence, file writing, YAML output, HTTP, CLI orchestration, caching, database access, diagnosis, recommendation, ranking, confidence, or scientific inference.

## Schema identity and envelope

The schema identity is `cpmoakb-runtime-json`; its independent projection version is `1.0`. Every top-level projection MUST contain exactly these fields in this construction order:

```json
{
  "projection_schema": "cpmoakb-runtime-json",
  "projection_version": "1.0",
  "runtime_api_version": "0.1",
  "kind": "<closed-supported-kind>",
  "data": {}
}
```

No generated timestamp, random identifier, environment value, or machine path may be added.

## Supported kinds and field mapping

The closed kinds are `validation-result`, `registry-snapshot`, `query-result`, and `structured-explanation`. There is no arbitrary kind extension point.

- Validation projections explicitly map domain `ValidationResult`/`ValidationIssue` and homogeneous public `ValidationFinding` collections. Domain issue fields are rule, severity, message, field, record reference, and remediation hint. Parser findings use their existing node and parent references.
- Registry projections explicitly distinguish candidate-identifier, source, and authority snapshots. All public snapshot-entry fields are mapped. Governed dates use ISO `YYYY-MM-DD` strings.
- Query projections map the explicit criteria, total count, and ordered match traceability. A match contains only its record identifier and existing matched field, value, mode, language, and locale; it does not serialize an arbitrary record or introduce ranking.
- Explanation projections map explanation type, availability, subject reference, facts, supporting references, limitations, and summary. Rendered text is not substituted for structure and rendering is not invoked.

Fields MUST be explicitly coded. Implementations MUST NOT use `dataclasses.asdict()`, `__dict__`, recursive reflection, `repr()`, generic object fallback, hidden omission, or silent coercion. A present optional field is represented by JSON `null`, not silently dropped.

## Ordering and canonical encoding

Source-governed ordering MUST be preserved: validation issue sort order, snapshot identifier order, query match order, and explanation fact/reference/limitation order. Projection MUST NOT re-rank or semantically reorder results. Object insertion order is documented for readability but semantic consumers MUST use field names.

Canonical JSON text MUST use UTF-8-safe Unicode characters, lexicographically sorted object keys, compact `,` and `:` separators, no trailing whitespace or newline, and no non-finite number values. Repeated calls over equal source values MUST produce identical text.

## Failures

All failures are deterministic and non-mutating. `SerializationError` is the base failure; `UnsupportedProjectionTypeError` rejects unsupported Runtime targets; `ProjectionContractError` rejects invalid envelopes, kinds, versions, keys, non-string dictionary keys, non-finite numbers, or non-JSON values. Errors MUST NOT contain raw internal object dumps, tracebacks, or silently stringified values.

## Compatibility

The projection schema version is independent from application releases, Runtime API `0.1`, and YAML input schema `1.0`. Adding the optional `cpmoakb.serialization` package is backward compatible under RAS-007 and does not change existing signatures, behavior, ordering, renderer text, or Runtime version.

A compatible implementation may fix internals without changing projected values. Adding optional fields, kinds, changing field meaning/type/order semantics, changing canonical text, or removing support requires explicit compatibility analysis. Breaking projection changes require a new projection version and architecture review. Future kinds must be explicitly specified and tested; they must never enter through a generic arbitrary-object mechanism.

## Security and boundaries

Projection MUST use freshly allocated JSON-compatible containers and MUST NOT share mutable source references. It MUST NOT execute data, import user modules, use dynamic class lookup, expose private internals, deserialize untrusted content, use `pickle`, access networks or databases, persist values, or write files. Filesystem paths may appear only if already present as an explicit governed public value; the projector never discovers paths.

YAML `1.0` remains a constrained input adapter and is not a serialization or round-trip format. This contract creates no JSON parser, deserializer, persistence contract, canonical domain reconstruction, HTTP endpoint, CLI, or automatic orchestration.
