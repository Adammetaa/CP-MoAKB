# Knowledge Asset Architecture

Status: Active

Version: 1.0

The Knowledge Asset Architecture defines the canonical, implementation-neutral
answer to what one governed unit of CP-MoAKB knowledge is, how it retains stable
identity and history, how packages assemble exact versions, and how many views
refer to the same asset without duplicating knowledge.

## Authority

This architecture MUST conform to the
[Knowledge Constitution](../constitution/knowledge-constitution.md), accepted
ADRs, KAS, KGS, the Editorial Handbook, the Knowledge Review Framework, the
Workspace Blueprint, Design Freeze, Source Policy, and Publication Boundary.
It is subordinate to the Constitution and accepted ADRs and MUST remain within
the separate authority of Design Freeze, RAS, Source Policy, and the Publication
Boundary.
Within that authority envelope, later knowledge-asset design, authoring guidance,
templates, pilots, and implementation mappings MUST conform to this architecture
unless it is explicitly amended or superseded by competent authority.

This architecture MUST NOT amend ADR-006 identity governance, generalize the
ADR-009 Rice-pilot YAML profile, weaken ADR-008 source-authority boundaries, or
change any RAS, Runtime, schema, parser, registry, validation behavior, public
API, or Design Freeze baseline.

## Document Set

| Document | Governs |
| --- | --- |
| [Knowledge Philosophy](knowledge-philosophy.md) | Separate meanings of knowledge, information, evidence, claims, concepts, relationships, representation, package, publication, version, identity, authority, provenance, and lifecycle |
| [Knowledge Asset and Package Model](knowledge-asset-and-package-model.md) | Canonical asset, package boundary, conceptual object graph, ownership, review, publication, retirement, archive, and fictional examples |
| [Identity, Version, Reference, and Namespace Model](identity-version-reference-and-namespace-model.md) | Stable identity philosophy, independent version axes, reference meanings, and scalable namespace governance |
| [Representation, Repository, and Evolution Model](representation-repository-and-evolution-model.md) | One-asset/many-representations rule, digital-twin views, repository model, ownership boundaries, future evolution, and implementation options |

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. Examples are fictional governance illustrations and
MUST NOT be interpreted as knowledge records, schemas, identifiers, or approval.

## Scope Boundary

This document family governs conceptual architecture only. It creates no data,
master data, agricultural knowledge, controlled vocabulary, ontology content,
production identifier, file organization mandate, serialization, database,
graph, API, application, inference, diagnosis, recommendation, AI, publication,
or release.
