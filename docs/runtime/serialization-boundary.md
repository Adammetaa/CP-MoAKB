# Runtime Serialization Boundary

The candidate YAML adapter is input-only. It maps strict schema version `1.0` into domain objects; it is not a canonical Runtime serializer and does not define round-trip output.

No canonical Runtime serializer, writer, persistence format, or object deserializer exists. `repr()` is diagnostic output, not serialization. Dataclass field order and internal tuple order are not persistence contracts unless a future specification explicitly adopts them.

Future JSON or YAML writers MUST define an explicit schema version, compatibility rules, security constraints, and representation-to-domain boundary. Persistence MUST NOT pickle arbitrary Runtime objects, and untrusted Python object formats MUST NOT be deserialized.

Registry snapshots and structured explanations are immutable Runtime values, but their current Python shape is not a wire format. Each requires a future versioned serialization contract before storage or exchange. Sprint-022R implements no serializer, writer, JSON adapter, migration, database, or persistence layer.
