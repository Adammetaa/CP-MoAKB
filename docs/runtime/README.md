# Runtime Core

## Purpose

`cpmoakb.domain` is the first generic, storage-neutral runtime boundary for future CP-MoAKB capabilities. It supplies immutable value objects and protocols for identity, labels, authority, sources, evidence, provenance, governed candidate records, explicit relationships, and mechanical validation results.

The Runtime Core is additive. It does not replace or modify the existing IRAC parser, semantic validator, exporter, importer, or frozen SQLite schema. Those components retain their existing APIs and implemented source-oriented purpose.

## Relationship to Knowledge Governance

Runtime types encode structural invariants from the accepted architecture while leaving scientific decisions to qualified governance. Entity identity is not a claim; label equality is not equivalence; evidence is not diagnosis; relationship presence is not causation; and mechanical validity is not scientific correctness. A candidate is non-production even when repository governance has accepted it for a later gate.

The Rice governance track remains blocked pending qualified review. This runtime package contains no Rice record, agricultural candidate, source extraction, or production data. Its tests use identifiers in a clearly synthetic range and fictional labels, authorities, sources, and evidence.

## Current capabilities

- typed candidate, canonical, external, authority, and source identifiers;
- immutable multilingual labels with deterministic ordering;
- claim-scoped authority and source metadata;
- evidence and structured provenance primitives;
- generic entity and relationship candidate records;
- validation issues, results, and a validator protocol; and
- storage-neutral record, source, and authority repository protocols.
- a [constrained YAML candidate adapter](yaml-adapter.md) for schema version `1.0`, using synthetic inputs only.
- a [deterministic validation engine](validation-engine.md) governed by the [Runtime Architecture Specifications](specifications/README.md).
- [governed registry services](registry-services.md) for explicit candidate-identifier custody and source/authority lookup.
- [read-only query services](query-services.md) over explicit records and immutable registry snapshots.
- [traceable explanation services](explanation-services.md) over explicit query, validation, evidence, and status facts.
- a [deterministic output-only JSON projection](json-projection.md) for selected immutable Runtime results.
- a [transport-neutral application service](application-service.md) for approved read-only query, explanation, and projection composition.
- a [minimal read-only HTTP adapter](http-api.md) requiring an injected application service.
- a [minimal reference CLI consumer](cli.md) with explicit service and stream injection.

Runtime API stability is governed by [RAS-007](specifications/RAS-007-runtime-api-compatibility-contract.md), the [API manifest](runtime-api-manifest.md), and the [contract suite](runtime-contract-suite.md). Future changes use the [compatibility checklist](runtime-compatibility-checklist.md); [RAS-008](specifications/RAS-008-runtime-json-projection-contract.md) governs the narrow output projection and the remaining unsupported serialization capabilities stay explicit at the [serialization boundary](serialization-boundary.md).

[RAS-009](specifications/RAS-009-runtime-application-service-contract.md) governs the application facade. Transports use this facade for its supported operations.
[RAS-010](specifications/RAS-010-runtime-http-transport-contract.md) governs the first HTTP adapter. It is library-first and includes no server, CLI, persistence, deployment stack, or hidden data source.
[RAS-011](specifications/RAS-011-runtime-cli-transport-contract.md) governs the library-first CLI consumer. Executable packaging remains deferred until a safe composition root exists.

The intentional public API is exported from `cpmoakb.domain`. Individual modules remain available for maintainers, but callers should prefer those package exports.

## Deferred capabilities

Installation is governed by [RAS-012](specifications/RAS-012-runtime-packaging-and-composition-contract.md).
The installed distribution contains no default knowledge base; consumers use the
[explicit composition boundary](composition.md). Packaging, deployment, and data
distribution remain distinct governance concerns.

The Runtime Core domain remains representation-neutral. Separate HTTP and CLI adapters expose only approved read-only application operations; no layer deserializes projected values, guarantees round trips, allocates identifiers, persists data, writes projection files, diagnoses, recommends, or promotes candidates. See [Extension Boundaries](extension-boundaries.md) for prohibited coupling.

For model details, see [Runtime Domain Model](domain-model.md).
