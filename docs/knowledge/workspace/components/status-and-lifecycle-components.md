# Status and Lifecycle Components

Status: Active blueprint
Version: 1.0

## Purpose
Define accessible, non-scoring status representations.
## Scope
Lifecycle, review, finding, rights, authority, competence, COI, unresolved issue, and publication state.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md), KAS-007, Review Framework, and Publication Boundary.
## Information Shown

| Component | Required text | Supporting cue | Accessible description |
| --- | --- | --- | --- |
| Lifecycle badge | Candidate, Draft, Accepted, Deprecated, etc. | shape/icon optional | state, version, decision reference |
| Review-status badge | Requested, In review, Returned, Approved, Deferred, Recused | review icon | review type and responsible role |
| Finding badge | full finding class | class-specific shape | blocking effect and status |
| Rights-status badge | Verified, Restricted, Unknown, Blocked | rights icon | intended use and evidence status |
| Authority badge | authority name/scope | reference icon | jurisdiction/version/limits |
| Competence badge | approved scope/current state | qualification icon | review type and limitations |
| COI indicator | Declaration required/Cleared/Mitigated/Recused | warning/person icon | assessment and replacement status |
| Unresolved-issue indicator | issue type and effect | open-question icon | owner, due stage, escalation |
| Publication-state badge | Not published/Ready for authorization/Authorized/Published/Withdrawn | boundary icon | exact event and authority |

## Actions
Open the governing record, filter by status, or inspect history; badges MUST NOT act as decisions.
## Prohibited Actions
No color-only status, numeric confidence, progress-to-truth, or combined acceptance/publication badge.
## Workflow
Human decision changes the underlying record; the component then represents that recorded state.
## Failure Modes
“Approved” without review type, green candidate confused with public, or Unknown displayed as empty.
## Empty States
Absence of status is an error requiring explanation, never implicit Draft or Not applicable.
## Accessibility
Text is primary; icons are labelled; contrast and patterns support color; tooltips are not the only explanation.
## Governance Boundaries
UI status is not scientific confidence. Operational priority is not scientific importance.
## Audit Requirements
State changes retain prior state, actor role, decision, version, reason, and effective point.
## Examples
“Accepted — not published” uses two separate badges and an explanatory notice.
## Non-examples
A 75% circular lifecycle indicator MUST NOT exist.
## Future Implementation Considerations
Exact visual styling and localized strings are deferred to static prototype work.
## Change Control
Status vocabulary changes require lifecycle, terminology, accessibility, and governance review.
