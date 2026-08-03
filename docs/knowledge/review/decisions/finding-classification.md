# Finding Classification

Status: Active
Version: 1.0

## Purpose
Provide consistent non-numeric finding classes and closure rules.
## Scope
All knowledge reviews governed by this framework.
## Out of Scope
Classes MUST NOT be summed, averaged, ranked, weighted, or converted to confidence.
## Authority
Subordinate to the [framework](../knowledge-review-framework.md), KGS-003/004, and Editorial Handbook.
## Definitions
**Closure authority** is the competent independent role permitted to verify resolution.
## Required Inputs
Candidate/version, review type, observed issue, evidence, impact, reviewer competence, and authority.
## Procedure
Select the narrowest applicable class; state facts, impact, required response,
owner, closure authority, and evidence; open a separate finding for materially distinct issues.
## Decision Rules

| Class | Meaning and fictional example | Acceptance effect | Required response and closure authority | Audit evidence |
| --- | --- | --- | --- | --- |
| Blocking | Fundamental defect; wrong candidate identity | Prohibits applicable gate | Correct or reject; originating competent reviewer closes | Before/after record and verification |
| Major | Material meaning or process defect; scope overstatement | Blocks unless corrected and verified | Revise; competent specialist closes | Finding, response, re-review |
| Minor | Bounded non-material defect; incomplete explanatory note | MAY remain only with explicit disposition | Correct or justify; reviewer verifies | Rationale and disposition |
| Editorial | Presentation defect with no meaning change; punctuation | Does not alone block | Correct; editor MAY verify | Edit and no-meaning-change note |
| Clarification Required | Ambiguity prevents review; unclear exclusion | Blocks affected decision | Clarify; requesting reviewer verifies | Question, answer, verification |
| Evidence Gap | Required support absent or inaccessible | Blocks claim/gate needing it | Supply evidence, narrow, defer, or reject; Evidence Reviewer closes | Gap and new evidence/disposition |
| Conflict | Credible unresolved disagreement | Blocks where material; otherwise explicit unresolved status | Preserve and escalate; competent authority closes | Both positions and decision |
| Out of Scope | Issue does not pertain to this review | Does not resolve the issue elsewhere | Refer to correct review; Managing Editor verifies routing | Referral and receiving record |
| Rights Blocker | Permission is absent, unknown, or incompatible | Prohibits affected use/publication | Remove use or obtain verified permission; rights authority closes | Rights evidence and decision |
| Governance Blocker | Authority or required process is violated | Prohibits acceptance/publication | Restore compliant process or authorized exception; governance closes | Authority, remediation, approval |

## Responsibilities
Reviewer classifies; Managing Editor assigns; Author responds; closure authority independently verifies when required.
## Failure Modes
Severity bargaining, numeric aggregation, duplicate masking, author-only closure, or class downgrade without reasons.
## Escalation
Classification disagreement goes to the competent review authority and KGS-004 if unresolved.
## Audit Requirements
Record original class, changes, reasons, assignments, responses, verification, closure, and reopening.
## Examples
A missing fictional locator is an Evidence Gap, not a percentage deduction.
## Non-examples
“Score 8/10, therefore accepted” MUST NOT be used.
## Change Control
Class meaning changes require framework and governance approval.
## Future Considerations
Additional non-numeric classes MAY be proposed with overlap analysis.
