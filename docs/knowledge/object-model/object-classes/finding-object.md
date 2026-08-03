# Finding Object

Status: Active

Version: 1.0

## Purpose

Govern one specific review issue that requires an attributed response and competent disposition.

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

Govern one specific review issue that requires an attributed response and competent disposition.

## Canonical Responsibility

The exact issue, affected Object Version and responsibility, severity meaning without numeric score, rationale, evidence, owner, response, and closure disposition.

## Identity Responsibility

Finding identity MUST be independent from comment text, Review, response, Decision, and affected object.

## Version Responsibility

Material restatement, scope change, new Evidence, or reopened disposition MUST create a new Finding or Review Version while preserving the original.

## Lifecycle Responsibility

The assigned reviewer raises the Finding; the Managing Editor tracks response; competent review authority owns open, responded, resolved, accepted-risk, deferred, reopened, and archived dispositions.

## Required Meaning

It MUST state the issue, exact affected object and version, review type, authority basis, required resolution, blocking or non-blocking meaning, and disposition evidence.

## Permitted References

It MUST reference its Review and affected Object Version and MAY reference Evidence, responses, Authority, Decisions, Unresolved Issues, and Lifecycle Events.

## Prohibited Content

A comment MUST NOT silently become a Finding; Finding closure MUST NOT become Knowledge acceptance; status MUST NOT be derived from a numeric score or elapsed time.

## Ownership

Assigned reviewer owns substantive Finding authorship; Managing Editor owns custody and follow-up.

## Review Requirements

The competence required is the competence of the Finding's subject matter; closure requires the same or explicitly competent authority.

## Relationship to Knowledge Asset

A Finding governs review of an Asset or object version but is not scientific meaning.

## Relationship to Knowledge Package

A Package MAY reference open and closed Findings for readiness; it MUST NOT hide blockers or treat closure as acceptance.

## Explorer Presentation

Explorer MAY show material public limitations or review disposition where authorized, not internal commentary by default.

## Knowledge Lab Presentation

Lab MAY show Finding detail, affected responsibility, blocking state, response, evidence, assignee, dissent, and closure authority.

## Audit Requirements

Audit MUST preserve author, competence, exact input, rationale, Evidence, responses, changes, disposition, closure authority, dates, dissent, and reopen history.

## Example

Fictional Finding F-Mist identifies a missing limitation statement in Claim C-Veil K3. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A casual comment marked resolved and counted as scientific acceptance.

## Failure Modes

Missing affected version, unclear remedy, wrong closure competence, concealed blocker, or rewritten Finding history MUST prevent valid closure.

## Future Implementation Considerations

Future tracking tools MAY display Findings but MUST NOT rank reviewers, score knowledge, or close issues automatically. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
