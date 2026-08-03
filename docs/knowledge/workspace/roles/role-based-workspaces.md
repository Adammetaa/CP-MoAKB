# Role-Based Workspaces

Status: Active blueprint
Version: 1.0

## Purpose
Define product expectations for each governed role without implementing permissions.
## Scope
Goals, dashboard, queues, actions, prohibitions, handoffs, escalation, and audit visibility.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md) and KGS-002.
## Audience
Product designers, role holders, editors, governors, and security reviewers.
## Information Shown

| Role | Goals / dashboard / default queues | Conceptual actions and handoffs | Prohibited actions / escalation / audit visibility |
| --- | --- | --- | --- |
| Knowledge Author | drafts, responses, blockers; My Tasks/Source/Claim/Candidate | nominate, draft, answer, revise, submit to editor | no self-acceptance/closure; escalate evidence or authority; own full item history |
| Evidence Reviewer | locators, conflicts, withdrawals; Evidence/Review queues | verify fidelity, open findings, return/decide | no scientific truth or rights decision; escalate meaning; evidence audit |
| Scientific Reviewer | claims, methods, adverse evidence; Review Queue | assess scoped meaning, findings, decisions | no diagnosis/advice/out-of-scope approval; scientific escalation; review audit |
| Terminology Reviewer | term status/ambiguity; Terminology/Review queues | review language, equivalence, deprecation | no identity merge/UI acceptance; terminology escalation; term history |
| Ontology Reviewer | layers/predicates; Relationship/Review queues | review semantics/direction/risk | no physical schema/inference; ontology escalation; relationship history |
| Rights Reviewer | rights/media/use; Source/Readiness queues | decide permitted use/restrictions | no permission inference; rights escalation; rights evidence |
| Domain Editor | portfolio scope/intake; Candidate Inbox | coordinate scope, route work, hand off | no specialist substitution; domain escalation; portfolio audit |
| Managing Editor | workload/completeness; all coordination queues | assign, return, assemble gates, coordinate | ownership is not approval; governance escalation; full coordination audit |
| Governance Reviewer | blockers/authority/appeals; Escalation/Acceptance | verify authority/process, decide within scope | no scientific truth by vote; KGS escalation; complete governance audit |
| Release Editor | packages/rights/rollback; Readiness Queue | assemble and assess readiness, hand off authorization | no owner authorization/push/tag/release; publication escalation; release audit |
| Knowledge Board | acceptance/conflict matters; Acceptance/Escalation | issue scoped governed decisions | no external-rights override; appeal/finality routes; decision audit |
| Project Owner | reserved approvals; authorization requests | exercise expressly reserved owner powers | no implicit delegation by UI; record final authority; full authorization audit |
| Read-only Observer | visible authorized status/history | inspect and navigate | no propose/edit/review/approve; report concerns; read-only audit visibility |

## Actions
Default views MAY differ by role but MUST NOT hide competence, recusal, or authority limits.
## Prohibited Actions
No universal admin-reviewer metaphor, action outside competence, or UI-granted publication power.
## Workflow
Roles receive scoped tasks, act or recuse, hand off complete packages, and preserve decisions.
## Failure Modes
Title-only competence, Managing Editor shown as universal approver, or observer controls displayed as active.
## Empty States
Explain no assignments, recusal, visibility scope, and how to request governed reassignment.
## Accessibility
Role dashboards keep consistent navigation and label actions with authority consequences.
## Governance Boundaries
This is a product expectation matrix, not a permission or authorization implementation.
## Audit Requirements
Assignments, competence, COI, actions, handoffs, decisions, and reserved-power use remain visible by governed scope.
## Examples
A Managing Editor owns coordination while an Evidence Reviewer owns the evidence decision.
## Non-examples
“Workspace owner can approve everything” MUST NOT exist.
## Future Implementation Considerations
Authentication and authorization require separate security architecture and KGS mapping.
## Change Control
Role changes require KGS-002, product, security, and audit review.
