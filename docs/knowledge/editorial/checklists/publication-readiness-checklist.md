# Publication Readiness Reviewer Checklist

Status: Active
Version: 1.0

## Purpose
Determine whether an exact accepted version is eligible for separate authorization.
## Scope
Knowledge release readiness and its distinction from technical publication events.
## Out of Scope
Completing this checklist MUST NOT publish, tag, release, deploy, or upload.
## Authority
Use under the [handbook](../knowledge-editorial-handbook.md), KGS-005, KGS-006, and Publication Boundary.
## Definitions
**RR** means revision required; **N/A** requires a reason.
## Responsibilities
Release Editor completes; Governance Reviewer verifies; Project Owner authorizes separately.
## Procedure
Mark one result per row; any Fail or RR means not ready; record exact version and decision.
## Required Inputs
Accepted version, review logs, rights, traceability, conflict status, authorization, and rollback plan.
## Required Outputs
Checklist and ready/not-ready disposition, never publication.
## Review Points
| Review item | Pass | Fail | N/A | RR | Reviewer notes |
| --- | --- | --- | --- | --- | --- |
| Exact version and accepted status are fixed | [ ] | [ ] | [ ] | [ ] | |
| Reviewer completion and evidence traceability are complete | [ ] | [ ] | [ ] | [ ] | |
| Source rights, term status, and relationship status are publishable | [ ] | [ ] | [ ] | [ ] | |
| Conflicts, Publication Boundary, and authorization are explicit | [ ] | [ ] | [ ] | [ ] | |
| Rollback preserves history; Git, GitHub, package, and knowledge events remain distinct | [ ] | [ ] | [ ] | [ ] | |
## Failure Modes
Moving version, unknown rights, hidden conflict, implicit authorization, or missing rollback.
## Examples
Unknown redistribution rights produce Fail even when knowledge is accepted.
## Non-examples
A clean build alone MUST NOT pass readiness.
## Escalation
Follow KGS-005; technical actions MUST wait.
## Audit Requirements
Retain version, rows, findings, decision, authorization, and rollback evidence.
## Change Control
Changes require publication-governance impact review.
## Future Considerations
This remains a human instrument, not a software gate.
