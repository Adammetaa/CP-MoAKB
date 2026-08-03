# Investigation Ontology

Status: Active

Version: 1.0

## Purpose

This document family defines how a governed investigation is structured after
observations have been recorded and before any diagnosis or recommendation is
authored. It provides an explainable, deterministic, evidence-first, traceable,
human-reviewable, crop-independent, and implementation-neutral vocabulary for
organizing unresolved information and competing provisional explanations.

## Authority and Boundary

The [Observation Knowledge Architecture](../observation/README.md) and
[Observation Vocabulary Architecture](../observation-vocabulary/README.md)
remain authoritative for observation meaning and terminology. The
[Knowledge Constitution](../constitution/knowledge-constitution.md),
[KAS-003 Evidence Standard](../KAS-003-evidence-standard.md), and
[Ontology Principles](../../ontology/ONTOLOGY_PRINCIPLES.md) retain their
authority. This family creates no new canonical Knowledge Object class and does
not amend Runtime, Design Freeze, or Publication Boundary contracts.

The permanent epistemic separation is:

> Observation -> Evidence -> Knowledge -> Hypothesis -> Diagnosis ->
> Recommendation -> Decision -> Action -> Outcome

Investigation organizes traceable inquiry across boundaries without collapsing,
converting, or automatically promoting any layer.

## Conceptual Flow

> Observation -> Information State -> Information Gap -> Investigation Focus ->
> Investigation Question -> Evidence Need -> Hypothesis Candidate ->
> Differential Comparison -> Human Review

This is an explanatory ordering of conceptual roles. Every connection must be
explicitly authored and reviewable; no arrow is an automatic transition,
inference, ranking, or workflow instruction.

## Documents

- [Purpose and Boundary](investigation-purpose-and-boundary.md)
- [Investigation Ontology](investigation-ontology.md)
- [Entity Classes](investigation-entity-classes.md)
- [Relationship Model](investigation-relationship-model.md)
- [Information State and Gap Model](information-state-and-gap-model.md)
- [Evidence Need Model](evidence-need-model.md)
- [Hypothesis and Differential Boundary](hypothesis-and-differential-boundary.md)
- [Non-inference and Review Rules](non-inference-and-review-rules.md)
- [Architecture Pattern Examples](investigation-pattern-examples.md)

## Architecture Principles

- Meaning, authorship, basis, uncertainty, conflict, and review remain visible.
- The same declared inputs and rules yield the same descriptive organization.
- Evidence relevance is requested and assessed separately from its source.
- Missing information remains explicit and is never rewritten as an observation.
- Thai-first labels can coexist with explicit English technical alignment.
- Domain concepts may extend the model without introducing crop-specific classes.
- Future SPA and Agronomist experiences may present the model but may not alter
  its epistemic boundaries.

## Out of Scope

This family defines no identifier syntax, schema, serialization, API payload,
class implementation, database table, runtime mapping, dataset, question bank,
real diagnosis, pesticide content, recommendation, AI logic, image
classification, automated ranking, automated promotion, UI workflow, or form.

## Change Control

Material changes require governance review against the controlling authorities.
Examples illustrate architecture only and must not be treated as approved domain
content or executable behavior.
