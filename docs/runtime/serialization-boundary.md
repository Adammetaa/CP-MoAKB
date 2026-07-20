# Runtime Serialization Boundary

The candidate YAML adapter is input-only. It maps strict schema version `1.0` into domain objects; it is not a canonical Runtime serializer and does not define round-trip output.

The [Runtime JSON projection](json-projection.md) now provides a narrow canonical output representation for selected validation, registry snapshot, query result, and structured explanation values. Its explicit schema is governed by [RAS-008](specifications/RAS-008-runtime-json-projection-contract.md). `repr()` remains diagnostic output, not serialization, and dataclass field order remains outside the wire contract.

No JSON parser, object deserializer, YAML output, canonical domain round trip, persistence format, file writer, HTTP adapter, or CLI exists. A future input or persistence boundary requires its own schema and security review. Persistence MUST NOT pickle arbitrary Runtime objects, and untrusted Python object formats MUST NOT be deserialized.

Registry snapshots and structured explanations have an explicit output projection, but their Python shape is still not itself a wire format. Projection does not reconstruct domain objects and creates no storage or exchange transport. Sprint-023R adds no parser, writer, migration, database, or persistence layer.
