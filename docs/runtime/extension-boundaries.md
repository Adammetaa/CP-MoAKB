# Runtime Extension Boundaries

## Planned runtime sequence

- **Sprint-017R:** the constrained YAML candidate adapter is implemented for generic synthetic schema `1.0`; it performs representation and domain construction only.
- **Sprint-018R:** the deterministic validation engine is implemented using explicit profiles and `ValidationResult`.
- **Sprint-019R:** governed candidate-identifier, source, and authority registries with explicit custody and immutable snapshots; allocation remains deferred.
- **Sprint-020R:** deterministic read-only query services over explicit records, immutable registry snapshots, and approved repository iteration.
- **Sprint-021R:** structured explanation services that preserve query traceability, evidence, uncertainty, and non-inference boundaries.

Each sprint requires its own architecture and Design Freeze review. This sequence does not authorize Rice authoring, production promotion, a storage technology, or implementation beyond the current sprint.

The Sprint-017R adapter contract and restrictions are documented in [Constrained YAML Candidate Adapter](yaml-adapter.md). Value-state objects and YAML writing remain deferred.

Reusable Runtime constraints are indexed in the [Runtime Architecture Specifications](specifications/README.md). Implementations must not silently diverge from an Active RAS.

The Sprint-019R contract and boundaries are documented in [Governed Registry Services](registry-services.md). Persistence and remote registry adapters remain deferred.

The Sprint-020R semantics and limits are documented in [Read-Only Query Services](query-services.md). Persistence, remote search, pagination, and graph traversal remain deferred.

The Sprint-021R structure and non-inference policy are documented in [Traceable Explanation Services](explanation-services.md). Generative reasoning, diagnosis, recommendation, and scientific inference remain prohibited.

Sprint-022R stabilizes Runtime API `0.1` through [contract tests](runtime-contract-suite.md) and an explicit [serialization boundary](serialization-boundary.md). It introduces no persistence or application orchestration.

Sprint-023R adds the [output-only JSON projection](json-projection.md) governed by RAS-008. It introduces no JSON input, deserialization, round trip, persistence, file writer, HTTP, CLI, automatic orchestration, or scientific inference.

Sprint-024R adds the [transport-neutral Runtime application service](application-service.md) governed by RAS-009. It coordinates only existing query, query-match explanation, and projection calls; it introduces no transport, persistence, registry mutation, validation orchestration, diagnosis, or recommendation.

Sprint-025R adds the [minimal read-only HTTP adapter](http-api.md) governed by RAS-010. It is an injected library boundary with no server launch, data ownership, persistence, CLI, authentication, deployment stack, or scientific inference.

## Prohibited coupling

- Domain models must not import YAML or JSON-loading libraries.
- Domain models and repository protocols must not import SQLite, an ORM, or database adapters.
- Domain models must not depend on web clients or fetch live sources.
- Repository protocols must remain storage-neutral; adapters belong outside the domain package.
- Runtime validation must not replace scientific, terminology, taxonomy, source/rights, evidence, architecture, or Product Owner review.
- Candidate records must not be treated as production records or automatically converted to canonical identifiers.
- Labels must not be used as identity keys or automatic equivalence evidence.
- Relationships must not gain causal, diagnostic, regulatory, safety, or recommendation meaning from wording alone.
- Lower Runtime layers must not import `cpmoakb.serialization`; projection may depend on their intentional public values only.
- Domain, adapters, validation, registries, query, explain, serialization, and legacy layers must not import `cpmoakb.application`.

## Adapter direction

Future loaders and repositories may depend on `cpmoakb.domain`. The domain package must not depend on them. Format errors should be translated into domain values or validation issues at the adapter boundary; format-specific dictionaries must not become the primary domain model.

The existing IRAC parser/exporter pipeline remains separate. Any future integration must be explicit and must not alter frozen behavior merely to reuse the Runtime Core.

HTTP is now represented only by `cpmoakb.http_api`; future CLI or web transports remain separate adapters. Transports must depend on `cpmoakb.application` rather than coordinate Query, Explanation, or Serialization internals.
