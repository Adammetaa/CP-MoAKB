# Review and Finding Components

Status: Active blueprint
Version: 1.0

## Purpose
Define the future review surface and finding-resolution interactions.
## Scope
Fixed version, competence, COI, inputs, panels, findings, decisions, revisions, comparison, and audit.
## Authority
Subordinate to the Review Framework, Templates, and [primary blueprint](../knowledge-workspace-blueprint.md).
## Audience
Reviewers, authors, editors, governance, UX, and accessibility teams.
## Information Shown
Review header; fixed candidate version; reviewer competence; conflict declaration;
inputs reviewed; source/evidence panel; candidate content; existing findings; new
finding form; full non-numeric classification; decision options; revisions;
unresolved issues; escalation; history; prior/current/response/closure comparison.

The full finding classification remains **Blocking**, **Major**, **Minor**,
**Editorial**, **Clarification Required**, **Evidence Gap**, **Conflict**,
**Out of Scope**, **Rights Blocker**, and **Governance Blocker**. These are
governed categories, not numbers, ranks, weights, or scientific confidence.
## Actions
Open finding, assign, answer, revise, verify, close, reject response, escalate,
reopen, decide, recuse, and hand off within authority.
## Prohibited Actions
No automatic merge, author self-closure, score, finding-to-decision conversion,
comment-to-finding conversion, out-of-competence approve, or majority override.
## Workflow
Review request → competence/COI check → inspect fixed inputs → create findings →
author response/revision → independent verification → decision → completion record.
## Failure Modes
Version changes during review, class shown by color only, closure lacks authority,
or comparison hides rejected changes.
## Empty States
No findings means none recorded for this review, not “scientifically valid.” No
decision explains review is incomplete or deferred.
## Accessibility
All finding classes use text and descriptions; comparison supports a linear
change list; focus moves to newly opened finding; errors identify affected fields.
## Governance Boundaries
Allowed decisions remain approve, approve with required revision, return, reject,
defer, escalate, and recuse. Acceptance authority is elsewhere.
## Audit Requirements
Record assignments, declarations, inputs, findings, responses, revisions,
verification, decisions, escalation, and completion.
## Examples
A reviewer rejects an Author response and reopens an Evidence Gap with reasons.
## Non-examples
Clicking “resolve discussion” MUST NOT close a scientific finding.
## Future Implementation Considerations
No rich-text editor, merge algorithm, workflow engine, or notification service is selected.
## Change Control
Changes require Review Framework, KGS, accessibility, and product review.
