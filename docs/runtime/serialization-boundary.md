# Runtime Serialization Boundary

RAS-012 does not change projection schema `1.0`. Composition uses the existing
`RuntimeApplicationService` defaults for the two governed projectors; no package
metadata or build helper enters projection envelopes.

The candidate YAML adapter is input-only. It maps strict schema version `1.0` into domain objects; it is not a canonical Runtime serializer and does not define round-trip output.

The [Runtime JSON projection](json-projection.md) now provides a narrow canonical output representation for selected validation, registry snapshot, query result, and structured explanation values. Its explicit schema is governed by [RAS-008](specifications/RAS-008-runtime-json-projection-contract.md). `repr()` remains diagnostic output, not serialization, and dataclass field order remains outside the wire contract.

No JSON parser, object deserializer, YAML output, canonical domain round trip, persistence format, file writer, HTTP adapter, or CLI exists. A future input or persistence boundary requires its own schema and security review. Persistence MUST NOT pickle arbitrary Runtime objects, and untrusted Python object formats MUST NOT be deserialized.

The [Runtime application service](application-service.md) may compose existing query and explanation projections into its own deterministic output envelope. This is still output-only: it adds no parser, reconstruction, writer, transport, or persistence behavior, and it does not alter the nested RAS-008 envelopes.

The [HTTP adapter](http-api.md) returns these approved projections as JSON responses without reparsing canonical JSON or redefining projection fields. HTTP request validation creates only application query requests; it is not JSON-to-domain deserialization and provides no round trip.

The [reference CLI](cli.md) writes the application facade’s canonical JSON strings directly for projected commands. Its static version document contains only governed version strings; the CLI does not serialize Runtime objects or define another projection mapping.

Registry snapshots and structured explanations have an explicit output projection, but their Python shape is still not itself a wire format. Projection does not reconstruct domain objects and creates no storage or exchange transport. Sprint-023R adds no parser, writer, migration, database, or persistence layer.
