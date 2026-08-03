# Concept Object

Status: Active

Version: 1.0

## Purpose

Govern stable identity and meaning for a distinguishable concept, including definition, scope, exclusions, and disambiguation.

## Scope

This object governs its named conceptual responsibility inside or around a
Knowledge Asset and Package. It applies before any physical representation.

## Out of Scope

It defines no machine fields, data types, schema, serialization, database table,
Python class, API payload, validation code, identifier syntax, registry,
persistence, inference, diagnosis, recommendation, score, ranking, or AI.

## Authority

The [Knowledge Object Model](../knowledge-object-model.md), [Knowledge Asset
Architecture](../../architecture/README.md), Constitution, applicable KAS and
KGS, ADRs, RAS, Source Policy, Evidence Levels, Design Freeze, and Publication
Boundary retain authority. This object MUST NOT supersede them.

## Definition

Govern stable identity and meaning for a distinguishable concept, including definition, scope, exclusions, and disambiguation.

## Canonical Responsibility

Concept identity and governed meaning, distinct from every statement, term, observation, evidence item, instance, and relationship about it.

## Identity Responsibility

Concept identity MUST be stable, label-independent, non-reused, namespace-governed, and preserved through rename, translation, split, merge, and repository change.

## Version Responsibility

Material change to definition, scope, exclusions, or disambiguation MUST create a new Knowledge Version or explicit successor; label-only change MAY belong to Terminology.

## Lifecycle Responsibility

A Concept steward owns candidate, review, accepted, disputed, corrected, deprecated, split, merged, superseded, retired, and archived history under competent governance.

## Required Meaning

The Concept MUST state what is meant, what is excluded, its category, scope, adjacent distinctions, ambiguity, and disambiguation basis without pretending every related Claim is definitional.

## Permitted References

It MAY reference Terminology, Claims, Evidence, Relationships, Authority, Reviews, Decisions, Unresolved Issues, Lifecycle Events, and Publications.

## Prohibited Content

It MUST NOT embed all supporting records as copied text; use a Term, filename, scientific name, or external identifier as local identity; or contain diagnosis, recommendation, or inferred relationships.

## Ownership

Delegated Concept steward or Domain Editor; identity authority remains separately governed.

## Review Requirements

Domain, ontology, terminology, scientific, Evidence, and Authority competence appropriate to meaning and scope.

## Relationship to Knowledge Asset

Concept is a canonical scientific-meaning carrier and MAY anchor one Knowledge Asset or participate in another Asset's coherent semantic nucleus.

## Relationship to Knowledge Package

Package selection references the exact Asset and Concept version; membership does not transfer stewardship.

## Explorer Presentation

Explorer MAY show definition, scope, exclusions, terms, Relationships, supporting Claims, evidence traceability, and exact published version.

## Knowledge Lab Presentation

Lab MAY show candidate identity, disambiguation work, proposed definition, terms, Relationships, Findings, conflicts, and version comparison.

## Audit Requirements

Audit MUST preserve identity authority, definition versions, terms, mappings, splits, merges, conflicts, reviews, Decisions, and supersession.

## Example

Fictional Concept Nadir is an invented editorial object defined by explicit review-only scope and exclusions. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

The label “Nadir” used as identity while copied Evidence and advice are embedded in its definition.

## Failure Modes

Circular definition, label-based identity, ambiguous category, silent merge, or missing disambiguation MUST remain unresolved and MAY block acceptance.

## Future Implementation Considerations

Future ontology or vocabulary implementations MAY map Concepts only after separate ADR and identifier-governance approval. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
