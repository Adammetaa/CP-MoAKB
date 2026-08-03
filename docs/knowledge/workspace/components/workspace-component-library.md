# Workspace Component Library

Status: Active blueprint
Version: 1.0

## Purpose
Define reusable conceptual UI components and their governance-safe content.
## Scope
Cards, panels, chains, banners, notices, events, comparisons, and empty states.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md).
## Audience
Product, UX, accessibility, content, and governance designers.
## Information Shown

| Component | Purpose / required information | Optional information / actions | Warnings / accessibility / mobile | Misuse risks |
| --- | --- | --- | --- | --- |
| Task Card | assignment, object/version, owner, due stage, blocker | accept/return/open | text status; stacked | due date as authority |
| Source Card | source identity/version/type/authority/rights | open evidence/status | retraction/rights text; compact | source rank |
| Evidence Card | identity, locator, role, claim links, withdrawal | compare/open source | contradiction label; linear | truth score |
| Claim Card | claim/version/scope/evidence/issues | submit/revise | candidate warning | claim shown as fact |
| Candidate Card | identity/type/version/lifecycle/reviews | open/submit | not-accepted notice | label as identity |
| Terminology Card | term/concept/language/type/status/ambiguity | compare terms | language announced | UI label as authority |
| Relationship Card | endpoints/predicate/direction/risk/status | open evidence | high-risk text | inferred inverse |
| Review Card | review type/version/reviewer/competence/COI/decision | open/recuse | competence warning | reviewer ranking |
| Finding Card | class/effect/evidence/status/closure authority | answer/verify/escalate | text + icon; no color-only | numeric severity |
| Decision Card | decision/version/authority/reasons/issues | inspect appeal | finality description | consensus as truth |
| Acceptance Gate Card | version/completions/blockers/rights/authority | open gate | acceptance ≠ publication | progress = quality |
| Release Package Card | identity/version/inventory/readiness/authorization/rollback | inspect/return | no publication action | ready = published |
| Audit Event | actor role/action/object version/reason/evidence | expand context | chronological text | editable history |
| Handoff Panel | sender/recipient/package/action/conditions | accept/return/recuse | owner ≠ authority | implicit reassignment |
| Version Comparison Panel | prior/current/change summary/findings/responses | filter sections | linear diff alternative | auto-merge |
| Traceability Chain | Candidate→Claim→Evidence→Source→Authority→Review→Decision | expand links | ordered text alternative | hidden inference |
| Authority Panel | authority/scope/version/jurisdiction/limits | open reference | authority ≠ truth | rank badges |
| Rights Panel | intended use/evidence/status/restrictions | open finding | blocker description | access = permission |
| Conflict Banner | conflict type/positions/evidence/escalation | inspect/recuse | persistent accessible alert | false consensus |
| Empty State | absence category/filters/next safe action | guidance link | plain language | invented suggestions |
| Boundary Notice | candidate/evidence/acceptance/publication/translation warning | authority link | prominent text/icon | dismiss hides boundary |

## Actions
Components expose only contextually permitted conceptual actions and link to full evidence/authority.
## Prohibited Actions
No component decides, scores, ranks, infers, publishes, or collapses role boundaries.
## Workflow
Cards summarize; detail panels support review; findings/decisions/gates record human outcomes; audit events preserve history.
## Failure Modes
Summary omits version, component action bypasses a gate, status depends on color, or mobile truncates authority.
## Empty States
The Empty State component distinguishes no data, no visible data, no assignment, Unknown, and Not applicable.
## Accessibility
Every component has a text name, descriptive status, keyboard order, adequate target size, and responsive reading sequence.
## Governance Boundaries
Component availability is a product expectation, not permission or decision authority.
## Audit Requirements
Only governance-relevant actions generate conceptual audit events; mere card viewing need not.
## Examples
A Finding Card names “Rights Blocker” and closure authority without a red-only cue.
## Non-examples
A Candidate Card showing “92% accepted” MUST NOT exist.
## Future Implementation Considerations
No framework, component code, design token, or asset is created.
## Change Control
Component changes require accessibility, role, safety, and governance review.
