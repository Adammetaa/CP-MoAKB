# Evidence Object

Status: Active

Version: 1.0

## Purpose

Govern a scoped interpretation of exact Source content as supporting, contradicting, limiting, or contextualizing one or more explicit Claims.

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

Govern a scoped interpretation of exact Source content as supporting, contradicting, limiting, or contextualizing one or more explicit Claims.

## Canonical Responsibility

The claim-specific evidentiary relationship between exact source content and a proposition, including locator, applicability, limitations, conflict, rights, and review disposition.

## Identity Responsibility

An Evidence Object MUST have identity independent from its Source, Claim, citation text, reviewer, and presentation.

## Version Responsibility

Material change to source basis, locator, interpretation, claim relationship, scope, limitation, or disposition MUST create a new Evidence version or successor with history.

## Lifecycle Responsibility

The Evidence Custodian owns proposed, under-review, supported, contradicted, withdrawn, superseded, rights-constrained, incomplete, unavailable, retired, and archived dispositions without forcing a numeric scale.

## Required Meaning

It MUST reference an exact Source version and locator, affected Claim and version, relationship type, scope, method of interpretation, limitations, conflicts, rights, and reviewer status.

## Permitted References

It MUST reference Source and Claim; it MAY reference Authority, citations, competing Evidence, Reviews, Findings, Decisions, Unresolved Issues, and Lifecycle Events.

## Prohibited Content

It MUST NOT become universal truth, diagnosis, recommendation, automatic confidence score, Concept definition by itself, or a copy of the entire Source or Claim.

## Ownership

Evidence Custodian or assigned Evidence Reviewer for review-stage custody.

## Review Requirements

Evidence-method, domain, scientific, source, and rights competence appropriate to the claim and source.

## Relationship to Knowledge Asset

Evidence supports or challenges an Asset's Claims but remains an independently governed supporting object.

## Relationship to Knowledge Package

A Package MAY reference exact Evidence versions required to interpret selected Assets; inclusion does not make Evidence conclusive.

## Explorer Presentation

Explorer MAY show the evidence relationship, source locator, support or conflict role, limitations, and availability for published Claims.

## Knowledge Lab Presentation

Lab MAY show extraction context, competing items, review state, rights blockers, responses, and unresolved gaps.

## Audit Requirements

Audit MUST preserve exact Source and Claim versions, locator, interpretation, limitations, status changes, reviewers, conflicts, withdrawal or supersession, and decisions.

## Example

Fictional Evidence E-Quartz limits Claim C-Veil using one exact passage from Source S-Lantern. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A Source title copied into a confidence gauge and treated as proof.

## Failure Modes

Missing exact source, ambiguous locator, incompatible Claim version, concealed adverse material, rights block, or unavailable content MUST remain explicit and MAY block review.

## Future Implementation Considerations

Future extraction or comparison tools MAY assist presentation but MUST NOT generate evidentiary meaning or scores autonomously. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
