# Acceptance Criteria

Status: Active
Version: 1.0

## Purpose
Define explicit human acceptance gates for candidate and knowledge versions.
## Scope
Source, evidence, terminology, relationship, concept, accepted knowledge, and publication-ready versions.
## Out of Scope
Acceptance MUST NOT create publication, production identity, truth, schema, or Runtime behavior.
## Authority
Subordinate to the [framework](../knowledge-review-framework.md), KAS-007, KGS-003/005, and Editorial Handbook.
## Definitions
A **gate** is a required decision for one fixed identity/version and stated next state.
## Required Inputs
Identity, scope, evidence, authority fit, term and relationship status, specialist
reviews, findings, rights, lifecycle, decision record, and audit trail.
## Procedure
Apply only the candidate-type row, verify every universal criterion, record N/A
with reasons, prohibit unresolved blockers, and obtain authorized acceptance.
## Decision Rules

| Gate | Additional required evidence | Permitted next state |
| --- | --- | --- |
| Source candidate | Identity/version, authority scope, correction/retraction and rights status | Evidence review eligible or deferred/rejected |
| Evidence candidate | Locator, context, fidelity, limitations, claim links | Candidate evidence accepted for scoped use or revised/deferred/rejected |
| Terminology candidate | Identity link, language/type, usage evidence, ambiguity review | Scoped term status or revised/deferred/rejected |
| Relationship candidate | Endpoints, predicate, direction, scope, evidence, specialist review | Scoped relationship status or revised/deferred/rejected |
| Concept candidate | Identity, definition, scope/exclusions, terms, evidence, relationships | Concept acceptance review or revised/deferred/rejected |
| Accepted knowledge version | All mandatory approvals, no blocker, lifecycle and decision authority | Accepted, not published |
| Publication-ready knowledge version | Accepted fixed version, rights, boundary, authorization path, rollback | Ready for separate publication authorization |

Every gate MUST also satisfy identity completeness, scope clarity, evidence
traceability, source-authority fit, terminology status, relationship review,
required specialist approvals, no unresolved blocker, rights status, lifecycle
consistency, decision record, and audit trail.

## Responsibilities
Reviewers verify their criteria; Governance Reviewer verifies completeness; authorized body decides acceptance.
## Failure Modes
Wrong version, implicit N/A, missing specialist review, unresolved blocker, or accepted-equals-published.
## Escalation
Disputed criteria follow the relevant specialist and KGS appeal paths.
## Audit Requirements
Retain gate version, criteria evidence, N/A reasons, findings, decision, authority, and date.
## Examples
A fictional concept MAY be accepted while explicitly not publication-ready.
## Non-examples
Repository merge MUST NOT count as acceptance.
## Change Control
Gate changes require KAS/KGS and lifecycle impact review.
## Future Considerations
Domain gates require separate authorization.
