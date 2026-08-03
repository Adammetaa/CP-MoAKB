# Decision Object

Status: Active

Version: 1.0

## Purpose

Govern a formal outcome made by competent authority from fixed inputs, reviews, findings, responses, and preserved dissent.

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

Govern a formal outcome made by competent authority from fixed inputs, reviews, findings, responses, and preserved dissent.

## Canonical Responsibility

The exact governed question, authority, inputs, outcome, rationale, conditions, dissent, effective scope, and appeal route.

## Identity Responsibility

Decision identity MUST be independent from Review, vote, Finding closure, meeting, publication, and current object status.

## Version Responsibility

A Decision is an immutable conceptual event. Correction, appeal, reversal, extension, or supersession MUST create a linked successor Decision rather than edit the original.

## Lifecycle Responsibility

The competent deciding body owns issuance; the Governance recorder preserves effective, conditioned, appealed, stayed, superseded, revoked, and archived relationships.

## Required Meaning

It MUST state the question, fixed input versions, competent authority, participants and recusals, Evidence and Reviews considered, Findings and responses, outcome, rationale, conditions, dissent, effective scope, and appeal.

## Permitted References

It MUST reference Authority and relevant Reviews or fixed inputs and MAY reference Findings, Evidence, responses, Unresolved Issues, Lifecycle Events, and Publication Records.

## Prohibited Content

Review MUST NOT equal Decision; Decision MUST NOT equal Publication; Finding closure MUST NOT equal acceptance; a vote, UI button, or repository merge MUST NOT create authority.

## Ownership

Competent deciding body; designated governance recorder owns record custody.

## Review Requirements

Governance review MUST verify competence, quorum or decision rule, conflicts, fixed inputs, rationale, dissent, and authority scope.

## Relationship to Knowledge Asset

A Decision may accept, return, reject, deprecate, or otherwise govern an exact Asset version but does not become its scientific meaning.

## Relationship to Knowledge Package

Package readiness and membership Decisions MUST identify exact Package and Asset versions and do not authorize publication unless separately scoped.

## Explorer Presentation

Explorer MAY show applicable acceptance and publication decision traceability where authorized.

## Knowledge Lab Presentation

Lab MAY show decision inputs, authority, conditions, dissent, appeal, and effects without exposing a false approve-and-publish action.

## Audit Requirements

Audit MUST preserve question, inputs, participants, competence, recusals, Evidence, Findings, responses, result, rationale, conditions, dissent, effective date, and appeal.

## Example

Fictional Decision D-Hold returns a fixed object network for revision because Finding F-Mist remains unresolved. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A green test creates an “approved” Decision without a Review or competent authority.

## Failure Modes

Missing authority, floating inputs, concealed dissent, unaddressed blocker, or ambiguous effect invalidates the Decision for the claimed scope.

## Future Implementation Considerations

Future decision-record systems MAY preserve objects but MUST NOT automate scientific or publication decisions. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
