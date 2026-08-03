# Review Decision Record

Status: Active
Version: 1.0

## Purpose
Define the conceptual content proving a human review decision.
## Scope
All specialist, governance, acceptance, and readiness decisions.
## Out of Scope
This document MUST NOT define a software schema, database form, serialization, or API.
## Authority
Subordinate to the [framework](../knowledge-review-framework.md), KGS-003/006, and Editorial Handbook.
## Definitions
A **decision record** is human-readable audit evidence for one review of one version.
## Required Inputs
Candidate identity/version; review type; reviewer identity and approved competence;
conflict declaration; review date; inputs; findings; cited evidence; decision;
required revisions; unresolved issues; escalation and closure status; audit notes.
## Procedure
Identify the fixed version; state review scope and competence; list inputs and
findings; give reasoned decision; assign revisions; preserve unresolved issues;
record escalation, closure, reviewer attestation, and references.
## Decision Rules
Missing identity/version, competence, conflict declaration, findings, reasons, or
closure status makes the record incomplete. The record MUST use a permitted decision.
## Responsibilities
Reviewer authors and attests; Managing Editor checks completeness; audit custodian preserves history.
## Failure Modes
Retrospective reconstruction, mutable version reference, blank reasons, hidden dissent, or personal data excess.
## Escalation
Incomplete or contested records return to the reviewer or governance authority.
## Audit Requirements
Preserve every issued version, correction, signature/attestation method, appeal, and supersession link.
## Examples
A fictional record states “defer” and names the missing evidence and reopening condition.
## Non-examples
“Approved by team” without reviewer, version, and reasons MUST NOT pass.
## Change Control
Conceptual responsibilities MAY change only through governance review.
## Future Considerations
Any implementation format requires separate architecture approval.
