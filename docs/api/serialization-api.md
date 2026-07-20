# Serialization API

**Projection version:** `1.0`
**Purpose:** deterministic output-only JSON projection for a closed set of Runtime
results.

Public symbols are `JsonScalar`, `JsonValue`, the three serialization error types,
`RUNTIME_JSON_PROJECTION_VERSION`, four typed projection functions,
`project_runtime_value`, and `to_canonical_json`; the exact list is in the
[manifest](public-symbols.md).

Supported categories are validation results, registry snapshots, query results,
and structured explanations. Projection returns a versioned envelope;
`to_canonical_json(value) -> str` uses Unicode, sorted keys, compact separators,
and no generated metadata. Unsupported targets and invalid envelopes raise public
typed errors.

There is no JSON input, round trip, arbitrary dataclass reflection, `default=str`,
object representation fallback, or file writer. Governed by RAS-008; see the
[serialization example](../../examples/serialization/README.md).
