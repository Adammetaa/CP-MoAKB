# Terminology Object

Status: Active

Version: 1.0

## Purpose

Govern a language-, context-, authority-, and status-specific expression linked to a Concept.

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

Govern a language-, context-, authority-, and status-specific expression linked to a Concept.

## Canonical Responsibility

The meaning and governance of preferred, alternative, scientific, common, local, transliterated, abbreviated, historical, deprecated, or ambiguous terms.

## Identity Responsibility

Terminology identity MUST remain distinct from Concept identity; identical strings across languages, regions, authorities, or contexts MUST NOT imply identity or equivalence.

## Version Responsibility

Material change to form, language, scope, status, authority, mapping, or usage note MUST create a new terminology version or successor.

## Lifecycle Responsibility

The Terminology steward owns proposal, review, preferred or alternative designation, ambiguity, deprecation, replacement, retirement, and archive within declared scope.

## Required Meaning

It MUST state the expression, language and locale, term type, linked Concept, authority and context, status, validity, ambiguity, and usage limitations.

## Permitted References

It MUST reference a Concept; it MAY reference nomenclatural or terminology Authority, Sources, Evidence, Reviews, Findings, Decisions, Unresolved Issues, and replacement Terms.

## Prohibited Content

A Term MUST NOT replace Concept identity, create automatic translation equivalence, become accepted through UI localization, or imply scientific, regulatory, diagnostic, or recommendation meaning.

## Ownership

Terminology steward or Domain Editor under terminology authority.

## Review Requirements

Terminology and language competence, plus nomenclatural or domain competence where scientific or authority-owned names apply.

## Relationship to Knowledge Asset

Terminology is a scientific-meaning carrier expressing a Concept; it does not own all Concept meaning.

## Relationship to Knowledge Package

A Package MAY select representations containing exact governed Terms, but package membership MUST NOT change preferred status.

## Explorer Presentation

Explorer MAY show authorized preferred and alternative Terms, language, authority, ambiguity, and deprecated status for the published Concept version.

## Knowledge Lab Presentation

Lab MAY show term candidates, translation review, ambiguity, mappings, terminology Findings, and separate UI-localization text.

## Audit Requirements

Audit MUST preserve expression, language, term type, Concept link, authority, preferred-status decisions, translations, ambiguity, deprecation, and reviewers.

## Example

Fictional Terminology T-Blue records “Nadir demonstration object” as an English preferred term in an invented editorial scope. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A Thai UI translation automatically promoted to accepted Terminology and used as Concept identity.

## Failure Modes

Missing Concept link, unknown language, false equivalence, authority conflict, or ambiguous unqualified use MUST remain explicit.

## Future Implementation Considerations

Future vocabulary tools MAY manage Term views but MUST NOT mint Concept identity or approve equivalence automatically. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
