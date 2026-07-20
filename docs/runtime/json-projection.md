# Deterministic Runtime JSON Projection

`cpmoakb.serialization` provides an output-only representation of selected Runtime results. The projection schema is `cpmoakb-runtime-json` version `1.0`, independent from Runtime API `0.1` and YAML input schema `1.0`.

The public entry points are category-specific projection functions, a closed `project_runtime_value()` dispatcher, and `to_canonical_json()`. They support validation results/issues, the three immutable registry snapshot types, query results, and structured explanations. Every call returns newly allocated dictionaries and lists containing JSON-compatible primitives only.

Canonical text preserves Unicode, sorts object keys, uses compact separators, emits no newline or generated metadata, rejects non-finite numbers, and is byte-for-byte deterministic for equal inputs. Collection order comes from the governed source contracts; query matches are never ranked and explanation rendering is never invoked.

This boundary has no JSON parser, deserializer, round-trip guarantee, persistence, writer, file output, HTTP API, CLI, cache, database, network access, orchestration, diagnosis, recommendation, or scientific inference. Unsupported values and malformed supplied envelopes raise typed errors; unknown objects are never silently converted to strings.

The normative contract and exact mappings are in [RAS-008](specifications/RAS-008-runtime-json-projection-contract.md).
