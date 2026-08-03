# Review Decision Template

Status: Active
Version: 1.0

## Purpose
Record a reasoned specialist or governance decision for one fixed candidate version.
## Scope
Review decision, revisions, unresolved issues, escalation, date, and audit notes.
## Out of Scope
This template MUST NOT define a software record, create acceptance automatically, or authorize publication.
## Authority
Governed by [Template Governance](../template-governance.md), Review Framework decision record, KGS-003, and KGS-006.
## When to Use
At the conclusion or formal deferral/escalation of a required review.
## Who Completes It
The assigned competent reviewer completes and attests; Managing Editor checks completeness.
## Required Inputs
Candidate/version, review assignment, competence, conflict declaration, reviewed inputs, finding log, and authority.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Candidate/version | Fix target | Required | Exact governed reference | “latest” | Verify before decision | Governance | `fictional-concept-1/v2` | “current” |
| Review type | Bound decision | Required | One framework review type | Overall approval | Match assignment | Governance | “Terminology Review” | “all reviews” |
| Reviewer competence | Prove authority | Required | Approved scope reference/summary | Job title alone | Link competence record | Governance | “F-language term scope” | “Senior Scientist” |
| Conflict declaration | Prove independence | Required | Declaration/assessment reference | Silent none | Link current declaration | Governance | `fictional-coi-1: cleared` | Blank |
| Inputs reviewed | Bound evidence | Required | Exact document/evidence versions | Unversioned package | Enumerate material inputs | Reviewer | `fictional-term-1/v1` | “all files” |
| Findings | Link issues | Required | Finding references or none raised | Hidden oral issues | Reconcile log | Reviewer | `fictional-finding-2` | “minor concerns” |
| Decision | State disposition | Required | Approve, approve with required revision, return, reject, defer, escalate, recuse | Numeric result | Use framework terms | Reviewer | “defer” | “82% approved” |
| Required revisions | Define next work | Conditional | Finding-linked revisions | New unsupported conclusion | Required for revision decision | Reviewer | “answer finding 2” | “improve quality” |
| Unresolved issues | Preserve limitations | Required | Issue references/none identified | Silent omission | State effect | Reviewer | `fictional-issue-2` | Blank |
| Escalation | Record routing | Required | None/pending/decision reference | Informal bypass | Cite authority | Governance | “not escalated” | “ask boss” |
| Date | Place decision in history | Required | Human-recorded review date | Generated timestamp requirement | Record governed precision | Governance | “review date R2” | “recently” |
| Audit notes | Explain reasoning | Required | Concise rationale and authority | Personal data excess | State why decision follows findings | Reviewer | “deferred for evidence gap” | “seems right” |

## Completion Rules
Every finding MUST have a disposition. A material revision requires re-review of affected scope.
## Prohibited Content
Scores, confidence percentages, out-of-competence approval, hidden conflict, acceptance/publication implication, and machine types.
## Review Requirements
Managing Editor checks completeness; Governance Review checks authority; appeals preserve this original record.
## Failure Modes
Wrong version, missing competence, blank conflict declaration, unreconciled findings, or unsupported approval.
## Example
A fictional Terminology Review MAY defer because ambiguity remains, with a named reopening condition.
## Non-example
“Team consensus: pass” without reviewers and reasons MUST NOT pass.
## Audit and Retention
Retain decision version, inputs, competence, declaration, findings, reasons, revisions, appeals, and supersession.
## Change Control
Field changes require Review Framework decision-record and KGS impact analysis.
