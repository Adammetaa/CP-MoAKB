# Current Capabilities

Implemented capabilities are immutable Runtime domain objects, schema-1.0 YAML
adaptation, deterministic validation, explicit in-memory registries, conjunctive
read-only queries, structured explanations, projection-1.0 canonical JSON,
application-0.1 orchestration, explicit composition, HTTP-0.1 and CLI-0.1 adapters,
and deterministic packaging/security/documentation verification.

The retained legacy path parses an explicitly supplied IRAC PDF, validates its
in-memory hierarchy, and can explicitly export CSV or build the frozen SQLite
schema. It is separate from Runtime composition. The installed package contains no
default dataset or running service. See [architecture](../architecture/README.md).
