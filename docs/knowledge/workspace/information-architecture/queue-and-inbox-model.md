# Queue and Inbox Model

Status: Active blueprint
Version: 1.0

## Purpose
Define human-governed work queues and their visible entry/exit conditions.
## Scope
Operational coordination only; priority does not mean scientific importance.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md), KGS, Review Framework, and Templates.
## Audience
Authors, reviewers, editors, governors, and release roles.
## Definitions
**Queue** is a filtered operational view; **owner** coordinates work but may lack approval authority.
## Information Shown

| Queue | Purpose / objects | Entry / owner | Visible metadata and filters | Human priority and prohibited automation | Exit / audit |
| --- | --- | --- | --- | --- | --- |
| Source Inbox | New source nominations | Submitted nomination / Domain Editor | identity, version, type, authority, rights, owner; filter language/jurisdiction/status | authorized human priority only; no source ranking | accepted for intake, returned, rejected, deferred; record disposition |
| Evidence Inbox | Evidence items awaiting verification | Extracted item / Evidence Reviewer | source, locator, claim links, rights, withdrawal; filter source/status | no truth score or automatic sufficiency | reviewed, returned, deferred; retain findings |
| Claim Inbox | Scoped claim proposals | Evidence-linked claim / Knowledge Author coordinator | claim/version/scope/evidence/issues; filter owner/state | no causal inference | candidate routing, return, reject; audit handoff |
| Candidate Inbox | Concept/term/relationship nominations | Submitted candidate / Managing Editor | identity/type/version/evidence/reviews/blockers | no automated promotion | review request, return, defer, reject |
| Review Queue | Fixed review requests | complete review package / assigned reviewer | type/version/competence/COI/due stage/findings | no reviewer ranking or auto-assignment outside governance | decision, recusal, return, escalation |
| Finding Resolution Queue | Open findings | assigned finding / responsible role | class/effect/version/response/closure authority | no severity score or author self-close | verified closure, rejection, escalation, reopen |
| Governance Escalation Queue | Authority/conflict cases | valid escalation / governance authority | dispute type, authorities, evidence, recusal, appeal | no majority override of competent blocker | reasoned decision/finality/return |
| Acceptance Queue | Completed candidate gates | all mandatory reviews / acceptance coordinator | exact version, blockers, rights, completions, authority | no automatic acceptance | accept, return, reject, defer, escalate |
| Publication Readiness Queue | Accepted package review | fixed accepted version / Release Editor | rights, traceability, boundary, rollback, authorization status | no publication action or readiness score | ready/not ready/defer/escalate |
| Correction Queue | Correction proposals | documented error / Managing Editor | affected version, evidence, impact, reviews, notices | no silent edit | corrected, reclassified revision, rejected, deferred |
| Archive Queue | Retirement/archive actions | authorized lifecycle decision / archive coordinator | identity/version/reason/retention/dependencies | no destructive purge | archived/returned/escalated; retain location/history |

## Actions
Authorized humans assign operational priority, owner, reviewer, due stage, return reason, and escalation.
## Prohibited Actions
No algorithmic ranking, automatic decisions, hidden reassignment, scientific priority inference, or notification-triggered action.
## Workflow
Objects enter only on documented conditions and exit only through a recorded human disposition.
## Failure Modes
Queue membership treated as lifecycle state, owner treated as approver, or overdue status treated as scientific risk.
## Empty States
Show queue definition, filters, entry conditions, and whether no work or no visible work exists.
## Accessibility
Queue status uses text and icons, sortable tables remain keyboard accessible, and priority meaning is described.
## Governance Boundaries
Queues coordinate; KGS roles decide. Recusal and segregation of duties override convenience.
## Audit Requirements
Record entry, assignment, priority author/reason, handoffs, decisions, exit, and reopening.
## Examples
A human marks a Rights Blocker response urgent because a gate is scheduled, not because it is scientifically important.
## Non-examples
AI-generated “highest value candidate” ordering MUST NOT exist.
## Future Implementation Considerations
No query, scheduling engine, notification system, or database representation is defined.
## Change Control
Queue changes require role, review, audit, accessibility, and governance analysis.
