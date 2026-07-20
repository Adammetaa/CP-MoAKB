# Deterministic Serialization

**Purpose:** project a query result and print canonical JSON.
**Prerequisites:** local core installation.
**Command:** `python -m examples.serialization.example`

Output is a single compact Unicode JSON envelope with sorted keys, projection
schema/version, Runtime version, `query-result` kind, criteria, and one match. The
APIs are `project_query_result` and `to_canonical_json`. Serialization is
output-only and rejects arbitrary objects; it does not write files. See the
[Serialization API](../../docs/api/serialization-api.md).
