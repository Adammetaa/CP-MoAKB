# Finding Log and Closure Instrument

Status: Active
Version: 1.0

## Purpose
Track every finding from opening through verified closure or preserved disposition.
## Scope
Opening, assignment, answer, revision, verification, closure, rejection, escalation, and reopening.
## Out of Scope
The log MUST NOT aggregate scores or permit authors to self-close independent findings.
## Authority
Subordinate to the [framework](../knowledge-review-framework.md), finding classification, KGS-003/004/006.
## Definitions
**Open** awaits response; **answered** awaits verification; **closed** is independently verified where required; **reopened** has new material basis.
## Required Inputs
Finding identity, candidate/version, class, review type, statement, evidence,
owner, required response, closure authority, and due/review condition if governed.
## Procedure
Open with evidence; assign; Author answers and links revision; originating or
authorized reviewer verifies; close, reject response, escalate, or reopen with
reasons. Preserve rejected and superseded responses.
## Decision Rules
Blocking classes remain open until competent closure. Editorial items MAY be
editor-verified only when meaning is unchanged. New evidence, failed remediation,
or version change MAY reopen a finding.
## Responsibilities
Reviewer opens/classifies; Managing Editor assigns; Author answers; closure authority verifies; audit custodian preserves.
## Failure Modes
Deleted findings, overwritten answers, author-only closure, class downgrade, or closure on another version.
## Escalation
Disputed response or closure follows the review-specific escalation path.
## Audit Requirements
Record every state transition, actor role, date, evidence, response, verification, reason, and prior version.
## Examples
A fictional Evidence Gap closes only after Evidence Reviewer verifies the new locator.
## Non-examples
Marking “done” because text changed MUST NOT close a finding.
## Change Control
Closure semantics require governance approval.
## Future Considerations
Software tracking is not authorized.
