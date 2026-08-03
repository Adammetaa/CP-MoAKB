# Template Governance

Status: Active
Version: 1.0

## Purpose
Govern consistent human template use without defining a physical representation.
## Scope
Versioning, amendment, field obligations, completion, prohibited content, audit, archival, and future mapping.
## Out of Scope
This document MUST NOT create JSON/YAML Schema, database tables, Python models,
forms, Runtime behavior, records, datasets, validation, or publication authority.
## Authority
Subordinate to the [Knowledge Constitution](../constitution/knowledge-constitution.md),
[KAS](../README.md), [KGS](../governance/README.md), [Editorial Handbook](../editorial/README.md),
[Review Framework](../review/README.md), ADR-005 through ADR-009,
RAS-001 through RAS-015, Source Policy, Evidence Levels, Design Freeze, and
Publication Boundary.
ADR-009 remains authoritative only for its governed Rice pilot YAML format.
## When to Use
Use before authorized human authoring or review when no approved physical format is being defined.
## Who Completes It
The responsible Author or reviewer completes content; the named reviewer verifies obligations; governance resolves exceptions.
## Required Inputs
Template name/version, work authorization, authority versions, accountable roles, and intended review or lifecycle purpose.
## Template Fields

| Field status | Purpose | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Required | Essential for review | Supported value or explicit permitted absence state | Blank or invented value | Complete before handoff | Named competent reviewer | “Unknown — identity check pending” | Empty cell |
| Conditional | Required when stated condition applies | Value plus condition evidence | Silent omission when condition applies | State condition and outcome | Reviewer for subject | “ISBN: N/A — not a book” | Omitted ISBN for a book |
| Optional | Useful but not required | Relevant supported note | Filler or speculation | Omit rather than fabricate | Receiving editor | Pronunciation note | Guessed pronunciation |
| Prohibited | Prevent unsafe content | Explicit “prohibited by template” note if needed | The prohibited assertion itself | Remove or route to separate authority | Governance reviewer | “Confidence percentage prohibited” | “92% true” |

## Completion Rules
- `Unknown` means not established.
- `Unavailable` means inaccessible.
- `Not applicable` means outside the field's applicability and MUST include a reason.
- These states MUST NOT be collapsed, represented by an unexplained blank, or treated as false.
- Identity references MUST use governed review handles and MUST NOT use labels as identity.
- Lifecycle, review, finding, evidence, and decision references MUST identify the applicable version.
- Template version changes MUST preserve completed-template history. Normative
  changes require amendment review; editorial changes MAY retain version only when meaning is unchanged.

## Prohibited Content
Unsupported diagnosis, recommendation, ranking, confidence percentage, causal or
regulatory assertion, inferred rights, automated decision, machine type, cardinality,
serialization syntax, validation expression, or real agricultural master data MUST NOT appear.
## Review Requirements
Each completed template MUST receive the specialist and governance reviews named
within it. Completion does not imply scientific validity, acceptance, or publication.
## Failure Modes
Universalizing ADR-009, treating field order as serialization, hiding unknowns,
inventing identity, overwriting prior versions, or omitting conditional-field reasons.
## Example
A human table may request “source version” while explicitly avoiding a machine type or key name.
## Non-example
Declaring `source_version: string, required: true` is a schema and MUST NOT be used.
## Audit and Retention
Retain template versions, amendments, completed instances, referenced authorities,
review decisions, exceptions, supersession, and archival location. Archived templates
MUST remain readable and MUST NOT silently become current.
## Change Control
Amendment requires scope, rationale, authority impact, migration implications,
reviewers, approval, version decision, and preserved supersession links.

A template is not a schema.
A completed template is not automatically accepted knowledge.
Template completion does not imply scientific validity.
Template completion does not authorize publication.
Future implementation mapping requires separate ADR/RAS approval.
