# Review Object

Status: Active

Version: 1.0

## Purpose

Govern a review event or process performed by competent people against fixed object versions.

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

Govern a review event or process performed by competent people against fixed object versions.

## Canonical Responsibility

Review scope, plan, assignments, competence, independence, fixed inputs, Findings, responses, dissent, completeness, and review disposition.

## Identity Responsibility

Review identity MUST be independent from reviewed objects, reviewer identity, Finding, Decision, and publication.

## Version Responsibility

A changed input, scope, review plan, competence basis, or reopened round MUST create or identify a new Review Version; prior rounds remain preserved.

## Lifecycle Responsibility

The Managing Editor owns assignment and custody; the Review Board governs completeness, reopening, return, completion, appeal linkage, and archive.

## Required Meaning

It MUST state fixed reviewed Object Versions, review type and scope, required competence, assignments, conflicts, inputs, procedure, Findings, responses, dissent, and disposition.

## Permitted References

It MUST reference fixed Object Versions and MAY reference reviewers, Authority, Evidence, Findings, Decisions, Unresolved Issues, Lifecycle Events, and appeals.

## Prohibited Content

Review MUST NOT edit scientific content, become a Decision, imply acceptance, publish, conceal dissent, average competence, or rely on floating versions.

## Ownership

Managing Editor for process custody; Review Board for completeness authority.

## Review Requirements

Competence is review-type specific under the Knowledge Review Framework; independence and conflicts MUST be declared.

## Relationship to Knowledge Asset

Review governs an exact Asset or object version but is not part of its scientific meaning.

## Relationship to Knowledge Package

A Package MAY collect exact Review evidence for selected versions; package readiness does not alter the Review outcome.

## Explorer Presentation

Explorer MAY show public review provenance, competence category, decision linkage, limitations, and publication relevance where authorized.

## Knowledge Lab Presentation

Lab MAY show assignments, fixed inputs, checklists, Findings, responses, dissent, completion, and appeal routes.

## Audit Requirements

Audit MUST preserve plan, assignments, competence, conflicts, versions reviewed, Evidence, Findings, responses, dissent, completeness, dates, and linked Decisions.

## Example

Fictional Review V-Clear evaluates exact Concept Nadir K2 and Claim C-Veil K3 and records one Finding. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A reviewer edits the Claim, closes their own objection, and labels the Review accepted.

## Failure Modes

Changed input, missing competence, conflict, incomplete Evidence, absent dissent, or lost Finding MUST block completion or reopen review.

## Future Implementation Considerations

Future workflow tools MAY route Reviews but MUST NOT perform judgment, assign authority, or infer completion. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
