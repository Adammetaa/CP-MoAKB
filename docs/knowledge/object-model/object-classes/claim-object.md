# Claim Object

Status: Active

Version: 1.0

## Purpose

Govern one reviewable proposition with explicit scope, attribution, evidence relationships, version, and dispute preservation.

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

Govern one reviewable proposition with explicit scope, attribution, evidence relationships, version, and dispute preservation.

## Canonical Responsibility

One bounded proposition and its semantic scope, exclusions, applicability, attribution, and claim lifecycle.

## Identity Responsibility

Claim identity MUST remain independent from Concept, Evidence, Relationship, recommendation, sentence wording, and representation.

## Version Responsibility

Material change to proposition, scope, qualification, applicability, or limitation MUST create a new Knowledge Version; disputed prior versions MUST remain preserved.

## Lifecycle Responsibility

The assigned Knowledge Author and Domain Editor steward nomination, draft, review, revision, acceptance, dispute, correction, deprecation, supersession, retirement, and archive under KAS-007.

## Required Meaning

A Claim MUST state one attributable proposition, declared subject or context, scope, exclusions, time and jurisdiction where applicable, evidence links, uncertainty, and status.

## Permitted References

It MAY reference Concepts, Evidence, Sources, Authority, Relationships, Reviews, Findings, Decisions, Unresolved Issues, Lifecycle Events, and Publications.

## Prohibited Content

It MUST NOT be a Concept definition by accident, Evidence item, implicit Relationship, diagnosis, recommendation, universalized source statement, numeric confidence score, or inferred conclusion.

## Ownership

Knowledge Author during proposal custody and delegated Domain Editor or semantic steward for governed lifecycle custody.

## Review Requirements

Scientific, domain, Evidence, Authority, regulatory, safety, rights, or other competence proportional to Claim risk.

## Relationship to Knowledge Asset

Claims are canonical scientific-meaning carriers that MAY form an Asset's semantic nucleus.

## Relationship to Knowledge Package

A Package selects an exact Asset version containing or referencing the Claim; it MUST NOT copy the Claim into independent package meaning.

## Explorer Presentation

Explorer MAY present exact accepted and authorized Claim versions with scope, evidence, authority, conflicts, and publication context.

## Knowledge Lab Presentation

Lab MAY present candidate wording, fixed versions, evidence matrix, high-risk flags, Findings, responses, disputes, and proposed revisions.

## Audit Requirements

Audit MUST preserve authorship, exact wording and scope, Evidence considered, adverse material, high-risk classification, reviews, dissent, Decisions, and every material version.

## Example

Fictional Claim C-Veil states one bounded editorial proposition about Concept Nadir in Context Pale. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

“Concept Nadir works everywhere” presented without scope, evidence, or review.

## Failure Modes

High-risk causal, efficacy, safety, or regulatory Claims without explicit competent governance MUST remain blocked; missing scope or Evidence MUST NOT be inferred.

## Future Implementation Considerations

Future machine projections MAY expose exact Claim versions but MUST NOT generate, rank, or infer them. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
