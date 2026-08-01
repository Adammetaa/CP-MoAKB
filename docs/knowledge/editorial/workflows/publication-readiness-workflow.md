# Publication Readiness Workflow

Status: Active
Version: 1.0

## Purpose
Assess readiness for a separately authorized knowledge release.

## Scope
Accepted status, review closure, rights, traceability, version, conflicts, boundary,
authorization evidence, and rollback planning.

## Out of Scope
Readiness MUST NOT publish, tag, release, upload a package, or authorize itself.

## Authority
It applies the [handbook](../knowledge-editorial-handbook.md),
[KGS-005](../../governance/KGS-005-publication-governance.md), KGS-006, and the
[Publication Boundary](../../../release/publication-boundary.md).

## Definitions
**Accepted knowledge** passed knowledge review; **published knowledge** was
released through knowledge authority; **release candidate** awaits authorization;
**public repository state**, **Git tag**, **GitHub Release**, **package publication**,
and **knowledge release** are distinct external or governed events.

## Responsibilities
Release Editor assembles findings; Governance Reviewer confirms authority;
Project Owner supplies explicit authorization where KGS-005 requires it.

## Procedure
1. Freeze the exact candidate version without changing knowledge meaning.
2. Verify accepted status and completion of all assigned reviewers.
3. Verify source rights, evidence traceability, terminology status, relationship
   status, and explicit unresolved-conflict disposition.
4. Verify Publication Boundary classification and release authorization record.
5. Verify rollback readiness preserves evidence and public identity.
6. Record ready, not ready, defer, escalate, or recuse. Do not publish.

## Required Inputs
Exact version, acceptance decision, review and audit logs, rights findings,
conflict register, boundary classification, authorization, and rollback plan.

## Required Outputs
Readiness decision with blocking findings and evidence links; never a publication event.

## Review Points
Every input above MUST be independently checked and unresolved status MUST remain visible.

## Failure Modes
Acceptance treated as publication, moving version, incomplete reviews, unknown
rights, hidden conflict, conflated Git/package/knowledge events, or absent rollback.

## Examples
An accepted item with unknown image rights MUST be marked not ready.

## Non-examples
A clean repository or passing test suite MUST NOT authorize a knowledge release.

## Escalation
Publication disagreement follows KGS-005; rights and governance blockers go to
their competent authorities; no escalation MAY be bypassed by technical action.

## Audit Requirements
Retain exact version, checklist, findings, approvals, blockers, authorization,
publication decision, and rollback evidence.

## Change Control
Changes require KGS-005, KGS-006, and Publication Boundary impact review.

## Future Considerations
Publication automation MUST remain outside scope until separately governed.
