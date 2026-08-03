# Visibility and Action Matrix

Status: Active blueprint
Version: 1.0

## Purpose
Describe conceptual action expectations while preserving competence and separation of duties.
## Scope
View, propose, edit, submit, review, return, approve, accept, authorize publication, and archive.
## Authority
Subordinate to KGS and the [primary blueprint](../knowledge-workspace-blueprint.md).
## Audience
Governance, product, security, role, and accessibility reviewers.
## Definitions
`Scoped` means only within approved competence and assignment; `Reserved` means explicit KGS/owner authority.
## Information Shown

| Role | Object types | View | Propose/Edit/Submit | Review/Return/Approve | Accept | Authorize publication | Archive |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Author | sources/evidence/claims/candidates/responses | Scoped | Yes, own drafts | respond; no independent approve | No | No | No |
| Specialist reviewer | assigned evidence/term/relationship/claim/review | Scoped | findings/decision only | Scoped; recuse when required | No | No | No |
| Rights Reviewer | sources/media/packages | Scoped | rights findings | Scoped rights decision | No | No | No |
| Domain/Managing Editor | coordinated objects/packages | Scoped broad | coordinate/submit/return | completeness only unless separately competent | No by ownership | No | propose only |
| Governance Reviewer | review/decision/gates/escalations | Governed broad | governance findings | Scoped governance approval | only where KGS assigns | No unless separately reserved | verify decision |
| Release Editor | accepted versions/release packages | Scoped | assemble/return | readiness decision | No | No | execute only authorized archive action |
| Knowledge Board | governed candidate/appeal/acceptance objects | Required scope | decision materials | Scoped decision | KGS-scoped | No owner-reserved action | authorize lifecycle where governed |
| Project Owner | authorization package/audit | Required scope | owner decision | reserved review | only if expressly governed | Reserved explicit decision | reserved where governed |
| Observer | authorized read objects | Yes | No | No | No | No | No |

## Actions
The matrix informs future design; each action still requires object state, competence, assignment, independence, and authority checks.
## Prohibited Actions
No row grants blanket permission, bypasses recusal, or converts visibility into authority.
## Workflow
Propose → submit → scoped review → return/approve → governed acceptance → separate authorization → archive by lifecycle authority.
## Failure Modes
Checkbox permissions interpreted literally, role inheritance assumed, or author allowed to close own blocker.
## Empty States
Unavailable actions explain the missing authority, assignment, competence, state, or declaration.
## Accessibility
Disabled actions MUST expose reasons to keyboard and assistive-technology users.
## Governance Boundaries
Project Owner reserved powers and publication separation MUST remain explicit.
## Audit Requirements
Future actions, denials, recusals, delegated tasks, and reserved decisions require governed evidence.
## Examples
A Scientific Reviewer can return an assigned claim but cannot authorize publication.
## Non-examples
A visible Release Package does not grant the Author a publish action.
## Future Implementation Considerations
No role-based access control or authorization engine is defined.
## Change Control
Matrix changes require KGS, security, product, and segregation-of-duties review.
