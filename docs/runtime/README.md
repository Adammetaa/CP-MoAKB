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

The intentional public API is exported from `cpmoakb.domain`. Individual modules remain available for maintainers, but callers should prefer those package exports.

## Deferred capabilities

The Runtime Core does not load YAML or JSON, allocate identifiers, persist data, fetch sources, implement a graph, execute queries, diagnose, explain, recommend, or promote candidates. See [Extension Boundaries](extension-boundaries.md) for the planned runtime sequence and prohibited coupling.

For model details, see [Runtime Domain Model](domain-model.md).
