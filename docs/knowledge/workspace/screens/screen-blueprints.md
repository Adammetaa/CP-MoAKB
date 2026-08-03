# Knowledge Lab Screen Blueprints

Status: Active blueprint
Version: 1.0

## Purpose
Define all required future screens without producing functional HTML or software.
## Scope
Primary user, sections, actions, statuses, links, warnings, empty/error states, accessibility, mobile, and governance boundaries.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md), role model, pipeline, and component library.
## Audience
Product, UX, accessibility, knowledge-governance, and future prototype teams.
## Information Shown

| Screen | Primary user / purpose | Main sections and linked objects | Actions/statuses | Warnings, empty/error, accessibility/mobile, governance |
| --- | --- | --- | --- | --- |
| Workspace Dashboard | all roles / orient work | tasks, reviews, blockers, findings, rights, lifecycle counts, gates, packages | open assigned/saved views | counts operational only; no score/leaderboard; stacked mobile cards |
| My Tasks | assigned role / own work | assignments, handoffs, due stage, blockers, object links | accept/return/recuse/open | owner ≠ authority; empty explains assignment scope |
| Inbox | authors/editors / triage submissions | source/evidence/claim/candidate tabs, version/owner/status | inspect/assign/return | no auto-priority; filters announced |
| Source Candidate Detail | Author/Evidence/Rights / intake | identity, version, authority, status, rights, corrections, evidence links | revise/request reviews/return | candidate and rights warnings; missing identity error |
| Evidence Item Detail | Author/Evidence/Scientific / verify | source locator/context, supported/contradicted claims, limits, rights | open finding/compare/decide | Evidence is not diagnosis; unavailable source state |
| Claim Candidate Detail | Author/Scientific / scope | claim, evidence map, contradiction, scope, issues | revise/request review | no causal inference; missing support error |
| Concept Candidate Detail | Author/specialists / meaning | identity, definition, scope, terms, relationships, evidence, reviews | revise/submit/inspect | Candidate is not accepted knowledge |
| Terminology Candidate Detail | Terminology Reviewer / language | concept identity, language/locale/type, evidence, ambiguity, status | finding/decision/deprecate proposal | Translation is not accepted terminology |
| Relationship Candidate Detail | Ontology/Scientific / assertion | endpoints, predicate/direction, risk, evidence/conflict, jurisdiction | finding/decision/return | high-risk and no-inference notice |
| Review Queue | reviewers/editors / scoped workload | assignment, type, version, competence, COI, blockers | accept assignment/recuse/open | no ranking; overdue operational only |
| Review Detail | assigned reviewer / decide | fixed version, competence, COI, evidence, content, findings, decision, audit | create finding/request revision/decide/escalate | no merge or out-of-competence approval; comparison reflows mobile |
| Finding Resolution | Author/closure reviewer / resolve | class, effect, evidence, response, revision, closure authority/history | answer/verify/close/reject/escalate/reopen | text labels for all classes; author cannot self-close independent item |
| Acceptance Gate | Managing/Governance/authority / gate | exact version, completion, blockers, rights, traceability, terms, relationships | return/reject/defer/accept | Acceptance is not publication; missing review error |
| Release Package | Release/Governance/Rights/Owner / readiness | inventory, acceptance, rights, boundary, rollback, authorization | assemble/review/return/record separate decision | no push/tag/release/publish action |
| Audit History | all governed roles / inspect | chronological events, versions, ownership, COI, findings, decisions, lifecycle | filter/open evidence/compare | immutable conceptually; linear accessible view |
| Governance Reference | all roles / understand authority | Constitution/KAS/KGS/Handbook/Review/Templates/ADR/RAS/boundaries | navigate/cite | reference does not grant authority; offline-friendly |
| Archive | editors/observers / historical lookup | retired/rejected/superseded versions, reasons, retention, successors | inspect/request governed reinstatement | no destructive restore/delete; clear inactive state |

## Dashboard Blueprint

The Dashboard MAY show assigned tasks, awaiting review, blockers, unresolved
findings, rights blockers, required conflict declarations, review workload,
candidate lifecycle distribution, upcoming acceptance gates, and release packages
awaiting authorization. These are operational counts and human-assigned work
signals only. It MUST NOT show an automated scientific quality score, reviewer
leaderboard, acceptance percentage as truth quality, recommendation confidence,
or AI-generated priority.

## Required Boundary Notices

Relevant screens MUST present these warnings in text: **Candidate is not accepted
knowledge**; **Evidence is not diagnosis**; **Knowledge is not recommendation**;
**Acceptance is not publication**; **Publication is not regulatory permission**;
**UI status is not scientific confidence**; **Operational priority is not
scientific importance**; **Discussion is not a decision**; and **Translation is
not accepted terminology**. A notice MUST remain near the content or action to
which it applies and MUST NOT depend on color alone.

## Actions
Actions MUST display required role, object/version, effect, and missing prerequisites before commitment.
## Prohibited Actions
No combined approve/publish, automatic merge, score, AI suggestion, inferred next state, or destructive audit edit.
## Workflow
Dashboard/queue → object detail → traceability/review → finding/decision → gate/package → audit.
## Failure Modes
Mobile hides authority, status only color, action lacks version, or empty state encourages fabrication.
## Empty States
Every screen states absence category, active filters, and safe next human action.
## Accessibility
Thai-first future copy, bilingual precision, headings/landmarks, keyboard actions,
focus management, screen-reader status, non-color cues, and responsive tables/cards.
## Governance Boundaries
Screens expose conceptual actions only. They define no permissions or implementation.
## Audit Requirements
Actions with governance effect identify actor, role, version, evidence, reason, and resulting state.
## Examples
Review Detail shows v1/v2 side by side with author response and reviewer closure decision.
## Non-examples
Dashboard MUST NOT show acceptance percentage as truth quality.
## Future Implementation Considerations
Static Sprint-039U prototype SHOULD use fictional data and no backend.
## Change Control
Screen changes require product, role, accessibility, safety, and governance review.
