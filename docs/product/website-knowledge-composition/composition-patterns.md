# Composition Patterns

Status: Active

Version: 1.0

## Pattern Use

Patterns are reusable conceptual arrangements. They prescribe responsibilities
and integrity checks, not pages, templates, routes, rendering, or fixed content.

| Pattern | Typical View responsibilities | Primary integrity concern |
|---|---|---|
| Knowledge Detail Page | Concept, Source, Relationship, Review, Explainability | exact identity, scope, provenance, and status |
| Investigation Page | Investigation, Observation, Evidence, Source, Review, Explainability | separation of question, evidence, finding, and decision |
| Observation Page | Observation, Source, Relationship, Provenance, Limitation | no promotion to Evidence, cause, or Diagnosis |
| Relationship Page | Relationship, source/target Concept, Source, Review, Version | only asserted edge, type, direction, basis, and scope |
| Knowledge Package Page | Package, member Views, Version, Review, Limitation | exact membership and compatible versions |
| Explainability Page | Explainability, Provenance, Source, Relationship, Review, Limitation | reconstructable origin, authority, status, and non-implications |

## Pattern Constraints

Every pattern declares purpose, audience, eligible Views, Section boundaries,
required explanation, traceability, and exclusions. A pattern cannot broaden a
View's eligibility or make optional the provenance, authority, review,
publication, version, or limitation information material to interpretation.

## Reuse and Extension

Patterns may be reused or extended for a new presentation purpose if the same
boundaries are retained and composition review confirms eligibility and semantic
fidelity. Reuse creates no shared scientific conclusion or canonical class.
