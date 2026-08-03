# Exception and Lifecycle Journeys

Status: Active blueprint
Version: 1.0

## Purpose
Keep non-happy paths visible, governed, and recoverable.
## Scope
Rejection, unavailable rights, retraction, conflict, disputes, recusal, denied gates, emergency correction, supersession, and retirement.
## Authority
Subordinate to the [pipeline](end-to-end-knowledge-pipeline.md), KGS-003/004/005/006, and lifecycle templates.
## Audience
Authors, reviewers, editors, governors, release roles, and support designers.
## Information Shown

| Exception | Visible state and evidence | Human path | Prohibited behavior |
| --- | --- | --- | --- |
| Rejected source | reason, authority, version, appeal | retain/revise/appeal/archive | silent delete |
| Rights unknown | Rights Blocker, intended use, missing evidence | exclude use, obtain authority, defer | infer permission |
| Retracted source | retraction, affected evidence/claims | impact review, correct/revise/retract | hide source |
| Conflicting evidence | competing positions and scope | specialist review, preserve unresolved state, escalate | forced consensus |
| Terminology dispute | term candidates, contexts, evidence | Terminology Review/appeal | choose UI convenience |
| Ontology dispute | models/predicates/evidence | Ontology Review/governance escalation | auto-merge semantics |
| Reviewer recusal | declaration, affected work, replacement | pause, reassign, re-review | silent reviewer swap |
| Unresolved causal claim | high-risk finding/evidence gap | narrow/remove/defer/escalate | infer causation |
| Acceptance rejected | gate failures, exact version, reasons | revise, appeal, archive | publish anyway |
| Publication authorization denied | decision/reasons/package | remain accepted but unpublished, revise plan | treat denial as scientific rejection |
| Emergency correction | trigger/risk/minimum action | authorized emergency path + retrospective review | broad unreviewed rewrite |
| Supersession | predecessor/successor/impact | reviewed successor and reference plan | identity reuse |
| Retirement | reason/dependencies/archive | authorized inactive state and retention | destructive purge |

## Actions
Return, defer, reject, recuse, replace, escalate, appeal, correct, supersede, retire, or archive through the competent path.
## Prohibited Actions
No last-write-wins, hidden dissent, author-only closure, automatic deadline action, or public-history rewrite.
## Workflow
Detect → preserve evidence/version → classify → assign competent authority → decide → communicate → audit → re-enter pipeline only if authorized.
## Failure Modes
Exception hidden as “error,” dead-end without owner, inaccessible appeal evidence, or rejection confused with deletion.
## Empty States
No open exceptions states when last checked and which unresolved states are excluded by filters.
## Accessibility
Exceptions use text labels, descriptions, recovery steps, and assertive warnings for blockers without relying on color.
## Governance Boundaries
Emergency paths narrow time, not competence or authority. Appeals preserve original evidence.
## Audit Requirements
Retain trigger, evidence, classifications, assignments, recusals, decisions, notices, appeal, recovery, and finality.
## Examples
Publication denial leaves a fictional version accepted in Lab and absent from Explorer.
## Non-examples
“Resolve conflict” by selecting the newest statement MUST NOT exist.
## Future Implementation Considerations
No automated exception handler or service-level enforcement is authorized.
## Change Control
Exception changes require KGS, lifecycle, review, rights, publication, and safety review.
