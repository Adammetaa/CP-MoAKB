# End-to-End Knowledge Pipeline

Status: Active blueprint
Version: 1.0

## Purpose
Define visible human journeys from source nomination through separately authorized Explorer publication.
## Scope
Source intake, evidence curation, claim/candidate authoring, review, findings, acceptance, readiness, lifecycle correction, and publication handoff.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md), Editorial Handbook, Review Framework, Templates, KGS, and Publication Boundary.
## Audience
Authors, reviewers, editors, governors, release roles, and product designers.
## Information Shown

| Stage | Input → output | Owner / required role | Evidence and blockers | Permitted next state / user-visible status / audit |
| --- | --- | --- | --- | --- |
| Candidate Source | nomination → source candidate | Author / Domain Editor | identity, version, authority; missing identity blocks | Intake, return, reject; “Source nominated”; record nomination |
| Source Intake | source candidate → reviewed source | Domain Editor / Evidence + Rights | status, correction/retraction, rights; retracted/unknown rights visible | Evidence extraction, defer/reject; “Intake reviewed”; decision log |
| Rights Review | intended use → rights decision | Rights Reviewer | license/permission/media; Rights Blocker | permitted scoped use, exclude, defer; “Rights verified/unknown”; rights audit |
| Evidence Extraction | reviewed source → evidence items | Author / Evidence Reviewer | locator/context/method/limits; missing context blocks | Evidence Review, return; “Evidence candidate”; extraction history |
| Claim Scoping | evidence → scoped claim | Author / Scientific Reviewer | support/contradiction/scope; conflict visible | candidate nomination, revise/defer; “Claim candidate”; mapping audit |
| Concept/Term/Relationship Nomination | claim package → candidate(s) | Author / specialist routes | identity, terms, predicate, evidence; high-risk claims block | specialist review, return; “Candidate submitted”; package/version audit |
| Specialist Reviews | fixed package → decisions/findings | assigned competent reviewers | competence, COI, evidence; recusal/open blocker | approve/return/reject/defer/escalate; status by review; review audit |
| Finding Resolution | findings + responses → verified dispositions | Author coordinator / closure authority | response/revision/verification; author self-close prohibited | close/reject/escalate/reopen; finding lifecycle; full log |
| Governance Review | complete specialist package → governance decision | Managing Editor / Governance Reviewer | authority, duties, conflicts, blockers; governance blocker | gate eligible/return/reject/defer; “Governance reviewed”; decision audit |
| Final Acceptance Gate | exact version → acceptance decision | gate coordinator / authorized authority | all completions, rights, traceability; any blocker stops | accepted/returned/rejected/deferred; “Accepted—not published”; gate audit |
| Publication Readiness | accepted package → readiness decision | Release Editor / Rights + Governance | exact version, boundary, rollback; unknown rights stops | ready/not ready/defer; “Ready for authorization”; readiness audit |
| Separate Publication Authorization | ready package → owner/KGS decision | Project Owner / governed authority | authorization evidence; denial stops | authorized/denied/deferred; “Not published” until event; authority audit |
| Explorer Publication | authorized content → public version | separate publication process | verified event, public rights, exact package | published/withdrawn; “Public approved version”; event audit |
| Correction/Supersession/Retirement | affected version → lifecycle decision | Managing Editor / affected authorities | trigger evidence, impact, reviews, rollback | corrected/revised/deprecated/superseded/retired/archived; lifecycle audit |

## Actions
Humans submit, assign, review, return, revise, verify, decide, hand off, and inspect history.
## Prohibited Actions
No automatic transition, scientific merge, rights inference, score, publication, or Explorer synchronization.
## Workflow
Each stage consumes a fixed package and produces a versioned human record. Parallel
specialist review is allowed only when dependencies are stable and explicit.
## Failure Modes
Skipped rights review, moving version, hidden contradiction, reviewer outside competence, or readiness treated as authorization.
## Empty States
Stage views explain missing prerequisites and the role authorized to provide them.
## Accessibility
Pipeline has a linear text alternative, current-stage text, blocker descriptions, and non-color lifecycle cues.
## Governance Boundaries
Owners coordinate; competent reviewers decide; acceptance and publication authorities remain separate.
## Audit Requirements
Every input/output version, owner, required role, evidence, blocker, state transition, and decision is attributable.
## Examples
A fictional candidate returns from Scientific Review for scope revision and re-enters at the fixed new version.
## Non-examples
A green progress bar reaching 100% MUST NOT publish or establish truth.
## Future Implementation Considerations
No state machine, workflow service, database, or event system is defined.
## Change Control
Stage changes require Handbook, Review Framework, KGS, Publication Boundary, product, and audit review.
