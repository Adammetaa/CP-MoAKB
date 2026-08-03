# Review Matrix

Status: Active
Version: 1.0

## Purpose
Map candidate types to mandatory human review, competence, blockers, and next states.
## Scope
Source, evidence, concept, terminology, relationship, revision, deprecation,
supersession, and publication candidates.
## Out of Scope
The matrix MUST NOT execute workflow, score candidates, or replace reviewer judgment.
## Authority
Subordinate to the [framework](../knowledge-review-framework.md), KAS-007, KGS-003/005, and Editorial Handbook.
## Definitions
**Required review** means a completed decision for the fixed version unless an authority records justified N/A.
## Required Inputs
Candidate type/version, intended next state, risk, authority, evidence, rights, and lifecycle history.
## Procedure
Select one row; appoint scope-matched reviewers; document any additional review;
resolve blockers; record permitted next state through the authorized gate.
## Decision Rules

| Candidate type | Required review | Required competence | Blocking conditions | Permitted next state |
| --- | --- | --- | --- | --- |
| Source Candidate | Evidence, Rights, Governance | source identity/methods, publication rights, source authority | identity/version gap, retraction uncertainty, Rights/Governance Blocker | intake accepted, revise, defer, reject |
| Evidence Candidate | Evidence, Scientific as meaning requires, Rights | evidence methods, scoped science, rights | locator/fidelity gap, scope distortion, rights defect | evidence accepted for scoped use, revise, defer, reject |
| Concept Candidate | Evidence, Scientific, Terminology, Ontology, Governance | applicable specialist scopes | incomplete identity/scope, unsupported definition, unresolved specialist blocker | accepted candidate, revise, defer, reject |
| Terminology Candidate | Terminology, Scientific for scientific names, Governance | language/domain, taxonomy as applicable | label-as-identity, unsupported status, ambiguity blocker | term status, revise, defer, reject |
| Relationship Candidate | Evidence, Scientific, Ontology, Governance; Rights as applicable | evidence, domain science, predicate semantics | unsupported/high-risk predicate, ambiguous endpoints, conflict | relationship status, revise, defer, reject |
| Revision Candidate | Every review affected by the change, Governance | original and change-affected competence | unreviewed meaning change, wrong base version, open blocker | revised version eligible, return, reject |
| Deprecation Candidate | Domain/Scientific as applicable, Governance, Publication if public | lifecycle, domain, release authority | missing reason/impact, unsafe continuity, absent authority | deprecated, revise, defer, reject |
| Supersession Candidate | Identity, affected specialists, Governance, Publication if public | identity/lifecycle and affected domains | missing successor, identity reuse, broken provenance | superseded with successor, revise, defer, reject |
| Publication Candidate | Publication Readiness, Governance, Rights | release, governance, rights | not accepted, moving version, blocker, missing authorization/rollback | ready for separate authorization, not ready, defer |

## Responsibilities
Managing Editor applies the matrix; reviewers decide within competence; governance verifies completeness.
## Failure Modes
Skipping rows, treating N/A as blank, assigning one universal reviewer, or automatic progression.
## Escalation
Matrix applicability disputes go to governance; specialist blockers retain their own authority.
## Audit Requirements
Retain selected row, assignments, competence, N/A reasons, findings, decisions, and next-state authority.
## Examples
A fictional Relationship Candidate receives Evidence, Scientific, Ontology, and Governance Review.
## Non-examples
One “overall review” MUST NOT replace required competencies.
## Change Control
Row changes require lifecycle, KAS, KGS, and handbook impact review.
## Future Considerations
Domain-specific additions MAY be approved without creating software logic.
