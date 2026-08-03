# Unresolved Issue Object

Status: Active

Version: 1.0

## Purpose

Preserve a matter that remains unknown, unavailable, conflicting, insufficiently evidenced, pending review, out of scope, rights blocked, or governance blocked.

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

Preserve a matter that remains unknown, unavailable, conflicting, insufficiently evidenced, pending review, out of scope, rights blocked, or governance blocked.

## Canonical Responsibility

The explicit unresolved condition, affected objects and versions, basis, blocking meaning, owner, required authority, next review, and disposition history.

## Identity Responsibility

Issue identity MUST persist independently from comments, Findings, missing values, edited text, and the object it affects.

## Version Responsibility

Material change to issue scope, basis, affected versions, blocking status, or disposition MUST create a new version or successor while preserving the original.

## Lifecycle Responsibility

The Managing Editor and accountable issue owner govern open, blocking, non-blocking, pending, deferred, resolved, accepted limitation, superseded, and archived states without numeric scoring.

## Required Meaning

It MUST state which unresolved category applies, what is known, what is missing or conflicting, affected versions, consequence, blocking basis, accountable owner, and competent resolution authority.

## Permitted References

It MAY reference affected Objects, Sources, Evidence, Authority, Reviews, Findings, Decisions, rights records, and Lifecycle Events.

## Prohibited Content

An issue MUST NOT disappear through editing, default values, last-write-wins, score thresholds, scope concealment, or unsupported assumption.

## Ownership

Managing Editor for custody and a named accountable owner for resolution work.

## Review Requirements

Competence depends on the issue: scientific, Evidence, terminology, ontology, rights, governance, regulatory, publication, or architecture.

## Relationship to Knowledge Asset

An issue qualifies an Asset's reviewability and lifecycle but is not scientific meaning.

## Relationship to Knowledge Package

A Package MUST expose relevant blocking and material non-blocking issues for selected versions.

## Explorer Presentation

Explorer MAY show authorized known limitations, unresolved conflicts, or unavailable evidence necessary for responsible interpretation.

## Knowledge Lab Presentation

Lab SHOULD show issue category, blocking meaning, affected version, owner, authority, history, and safe next step.

## Audit Requirements

Audit MUST preserve creation, basis, affected versions, status, owner, Evidence, decisions, scope changes, resolution, and why it was blocking or non-blocking.

## Example

Fictional Issue U-Pale records an unavailable locator and blocks Evidence review without assigning a score. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A missing source is deleted from the draft so the package appears complete.

## Failure Modes

Unknown owner, hidden blocker, unsupported closure, stale affected version, or numeric auto-resolution MUST keep the issue open.

## Future Implementation Considerations

Future issue trackers MAY represent these states but MUST NOT infer resolution or acceptance. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
