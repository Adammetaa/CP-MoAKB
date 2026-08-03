# Handoff and Ownership Model

Status: Active blueprint
Version: 1.0

## Purpose
Make coordination ownership and authority visibly distinct.
## Scope
Current owner, responsible role, assigned/backup reviewer, reason, package, action, due stage, return, escalation, and audit.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md), KGS, Editorial Handbook, and Review Framework.
## Audience
Authors, reviewers, editors, governors, and product designers.
## Information Shown
Current owner; responsible role; assigned reviewer; approved backup reviewer;
handoff reason; exact handoff package/version; expected action; due stage; return
conditions; escalation conditions; open blockers; competence/COI status; audit evidence.
## Actions
Assign, accept handoff, return incomplete package, recuse, reassign under authority,
escalate, and acknowledge completion.
## Prohibited Actions
Owner MUST NOT be shown as approver unless separately authorized. Backup MUST NOT
silently replace a reviewer. Due stage MUST NOT auto-decide or auto-escalate.
## Workflow
Prepare package → completeness check → identify competent independent recipient →
record handoff → recipient accepts/returns/recuses → action → evidence-backed return handoff.
## Failure Modes
Unversioned package, implicit ownership transfer, hidden backup, overdue auto-approval, or missing return reason.
## Empty States
Unassigned items explain required assigning authority and remain visibly blocked from scoped review.
## Accessibility
Ownership and authority labels are separate text fields; handoff history is chronological and keyboard navigable.
## Governance Boundaries
Ownership coordinates work; it never equals scientific, governance, acceptance, or publication authority.
## Audit Requirements
Record sender, recipient, reason, package/version, assignment evidence, expected action, acceptance, return, recusal, escalation, and completion.
## Examples
An Author owns revision coordination while the originating reviewer retains finding-closure authority.
## Non-examples
“Owned by Managing Editor” MUST NOT imply accepted.
## Future Implementation Considerations
No task engine, due-date scheduler, or reassignment automation is selected.
## Change Control
Changes require KGS role, audit, review-independence, and product analysis.
