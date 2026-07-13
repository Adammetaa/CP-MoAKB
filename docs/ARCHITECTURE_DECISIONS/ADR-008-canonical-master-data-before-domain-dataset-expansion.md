# ADR-008: Adopt canonical master-data governance before domain dataset expansion

- Status: Proposed
- Date: 2026-07-13
- Decision owners: Product Owner, Architecture Governor, and relevant domain/source reviewers

## Context

CP-MoAKB has conceptual ontology, identity, and controlled-vocabulary governance, but no approved production agricultural master-data model or Rice Domain dataset. Creating broad records first would invite label-based identity, mixed authority, flattened provenance, silent merges, and accidental conversion of descriptive guidance into diagnosis or recommendation.

## Decision

Before expanding domain datasets, CP-MoAKB will require a bounded master-data specification, claim-scoped source assessment, entity and relationship boundaries, provenance readiness, staged curation, quality gates, versioning rules, and an approved pilot scope.

Source authority is separate from truth: an official source is assessed for a particular claim, jurisdiction, version, and time. Master data is separate from observations, diagnoses, regulatory decisions, safety conclusions, and recommendations.

This Proposed ADR does not authorize implementation or production records.

## Rationale

Governance-first sequencing makes identity, ambiguity, evidence, multilingual terminology, source conflicts, rights, and change history reviewable before scale makes correction expensive. A bounded Rice Domain pilot can test these controls without claiming completeness.

## Consequences

- Future dataset work needs explicit source/scope approval and applicable terminology, domain, taxonomy, evidence, regulatory, rights, architecture, and release review.
- Records and relationships retain provenance, uncertainty, context, temporal/jurisdictional validity, and non-destructive history.
- Broad imports, flat all-purpose master tables, label-based merges, and implied source universality are prohibited.
- Initial curation is slower and requires unresolved states, but later releases become more explainable and reproducible.

## Relationship to earlier ADRs

This proposal builds on, but does not accept or modify, [ADR-005](ADR-005-layered-conceptual-ontology-before-physical-implementation.md), [ADR-006](ADR-006-stable-identifiers-before-controlled-vocabularies.md), and [ADR-007](ADR-007-controlled-vocabulary-governance-before-vocabulary-construction.md). Ontology meaning, stable identity, and governed language remain distinct prerequisites. Their current Proposed statuses require separate authorized closeout.

## Alternatives considered

- **Build the complete Rice dataset immediately:** rejected because authority, identity, rights, and review boundaries are unresolved.
- **Use one official source as universal truth:** rejected because authority is claim-, jurisdiction-, version-, and time-specific.
- **Use labels as records and merge matches:** rejected because multilingual and scientific labels are mutable and ambiguous.
- **Choose storage technology first:** deferred because a bounded pilot should expose review, provenance, relationship, and validation requirements.

## Explicit non-decisions

This ADR does not select CSV, JSON, YAML, SQLite, relational, graph, RDF, or other physical representation; select database or graph technology; approve a full Rice Domain inventory; approve real identifiers; integrate new external sources; or authorize diagnostic/recommendation logic. A future ADR should select physical representation after pilot-specification approval.

## Relationship to Design Freeze

The decision preserves the parser, exporter, schema, validation logic, official IRAC datasets, golden baseline, and tests. Any implementation affecting frozen components requires separate explicit approval.
