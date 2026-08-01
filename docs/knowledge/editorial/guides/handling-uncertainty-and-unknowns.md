# Guide: Handling Uncertainty and Unknowns

Status: Active
Version: 1.0

## Purpose
Keep distinct absence and uncertainty states explicit.
## Scope
Unknown, unavailable, not reviewed, insufficient evidence, conflicting evidence,
out of scope, and not applicable.
## Out of Scope
These states MUST NOT be collapsed into null, false, rejection, or certainty.
## Authority
Subordinate to the [handbook](../knowledge-editorial-handbook.md), KAS-003, and KAS-007.
## Definitions
**Unknown** is not established; **unavailable** cannot be accessed; **not reviewed**
lacks review; **insufficient** lacks support; **conflicting** has unresolved evidence;
**out of scope** is excluded; **not applicable** does not pertain.
## Responsibilities
Author selects the narrowest supported status; reviewer verifies reason and scope.
## Procedure
Identify the question; choose exactly the justified state; state reason, evidence,
owner, and reopening condition; never substitute a plausible value.
## Required Inputs
Question, available evidence, access status, review history, and scope.
## Required Outputs
Explicit state, reason, responsible role, and next permissible action.
## Review Points
Correct distinction, evidence, wording, scope, and reopening condition.
## Failure Modes
Blank ambiguity, “unknown” used for conflict, or “not applicable” used to avoid review.
## Examples
An inaccessible fictional appendix is “unavailable,” not “insufficient evidence.”
## Non-examples
Guessing a missing value MUST NOT pass.
## Escalation
Disputed status goes to the competent reviewer and then KGS-004 if unresolved.
## Audit Requirements
Retain state, reason, evidence, reviewer, changes, and reopening events.
## Change Control
Status changes require new evidence or review and preserved history.
## Future Considerations
Implementation encodings require separate architecture approval.
