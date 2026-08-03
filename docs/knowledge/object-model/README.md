# Knowledge Object Model

Status: Active

Version: 1.0

The Knowledge Object Model defines the canonical conceptual objects inside and
around a Knowledge Asset. It applies the
[Knowledge Asset Architecture](../architecture/README.md) without defining a
schema, serialization, class hierarchy, database, graph implementation, API, or
Runtime behavior.

## Authority

The Knowledge Constitution, ADRs, KAS, KGS, Source Policy, Evidence Levels,
Design Freeze, RAS, and Publication Boundary retain authority in their scopes.
This model is subordinate to those authorities and to the Knowledge Asset
Architecture. Later object-model design MUST conform to this family unless it is
explicitly amended or superseded by competent authority.

ADR-005 governs conceptual separation, ADR-006 governs identity prerequisites,
ADR-008 governs canonical master-data sequencing and claim-scoped source
authority, and ADR-009 alone governs the Rice-pilot candidate YAML format. This
family MUST NOT generalize ADR-009 or select physical identity syntax.

## Index

- [Canonical model and principles](knowledge-object-model.md)
- [Object classes](object-classes/)
- [Boundary, reference, version, grouping, and lifecycle models](models/)
- [Conceptual graphs](graphs/)
- [Fictional object networks](examples/)

## Object Classes

| Scientific meaning | Evidence and provenance | Review and governance | Lifecycle and publication | Presentation |
| --- | --- | --- | --- | --- |
| Concept, Claim, Relationship, Terminology | Source, Evidence, Authority | Review, Finding, Decision, Unresolved Issue | Lifecycle Event, Publication Record, Package Membership | Representation |

The groups describe responsibility, not importance or status. Every class keeps
its own identity, versions where applicable, ownership, lifecycle, authority,
and audit meaning.

## Boundary

This family creates no data, agricultural knowledge, production identity,
inference, diagnosis, recommendation, scoring, ranking, AI, publication, or
implementation. The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and
**MAY** are normative when capitalized.
