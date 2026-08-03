# Unresolved Issue Template

Status: Active
Version: 1.0

## Purpose
Preserve a known question, blocker, conflict, or missing input until governed disposition.
## Scope
Issues associated with source, evidence, concept, term, relationship, review, lifecycle, or publication preparation.
## Out of Scope
The template MUST NOT fabricate closure, replace a review finding, or erase disagreement.
## Authority
Governed by [Template Governance](../template-governance.md), Editorial Handbook, Review Framework, and KGS-004/006.
## When to Use
Whenever a material uncertainty cannot be resolved during the current authoring or review step.
## Who Completes It
Author or reviewer opens; responsible role responds; competent closure authority verifies.
## Required Inputs
Related candidate/version, issue evidence, finding class where reviewed, responsible role, and review stage.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Issue identity | Track issue | Required | Governed issue handle | Description as identity | Assign on opening | Governance | `fictional-issue-1` | “missing info” |
| Related candidate | Bind scope | Required | Identity/version reference | Mutable latest reference | Fix version | Governance | `fictional-concept-1/v2` | “current concept” |
| Issue type | Route response | Required | Evidence/term/rights/etc. class | Numeric severity | Use clear category | Governance | “rights uncertainty” | “level 7” |
| Description | State question | Required | Specific neutral issue | Vague concern | Describe observable gap | Originating reviewer | “permission statement unavailable” | “bad source” |
| Evidence | Support issue | Required | Evidence references/observed absence | Guesses | Cite basis | Evidence | `fictional-source-1 rights page unavailable` | “probably restricted” |
| Responsible role | Assign action | Required | Governed role | Unnamed team | Name competence | Governance | “Rights Reviewer” | “someone” |
| Blocking status | State gate effect | Required | Blocking/non-blocking with reason | Score | Cite class/authority | Governance | “blocking publication use” | “9/10 risk” |
| Finding classification | Align review | Conditional | Review finding class/reference | Invented class | Required once reviewed | Reviewer | “Rights Blocker” | “medium” |
| Due review stage | Prevent silent carry | Required | Named human gate | Calendar automation | State next review point | Managing Editor | “before rights completion” | “later” |
| Escalation status | Track route | Required | Not escalated/pending/decided | Hidden appeal | Link authority | Governance | “pending KGS rights path” | Blank |
| Decision authority | Identify resolver | Required | Competent governed role/body | Author self-authority | State scope | Governance | “competent Rights Reviewer” | “Author” |
| Current disposition | Preserve state | Required | Open/answered/deferred/etc. | Closed without evidence | Use finding lifecycle | Reviewer | “open” | “done” |
| Closure evidence | Prove resolution | Conditional | Decision/evidence references | Author assertion alone | Required for closure | Closure authority | `fictional-rights-decision-1` | “fixed” |
| Audit history | Preserve changes | Required | Dated/ordered role actions | Overwritten latest note | Append, never replace | Governance | “v2 response rejected” | Delete old response |

## Completion Rules
An issue cannot be closed by the Author alone where independent verification is required.
Unknown, unavailable, and N/A MUST remain distinct.
## Prohibited Content
Numeric severity, silent closure, erased responses, unsupported facts, diagnosis, recommendation, and machine workflow rules.
## Review Requirements
The originating competence and closure authority review response and closure; governance reviews escalation.
## Failure Modes
Vague description, no owner, wrong candidate version, hidden blocker, or missing closure evidence.
## Example
Unknown fictional image rights remain a Rights Blocker assigned to Rights Review.
## Non-example
“Resolved” entered by the Author without evidence MUST NOT close the issue.
## Audit and Retention
Retain every state, response, rejection, escalation, closure, reopening, and linked evidence.
## Change Control
Field changes require KGS-004/006 and Review Framework analysis.
