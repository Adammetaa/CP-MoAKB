# Fictional Reviewer Journey

**Status:** Illustrative design example
**Version:** 0.1.0

## Purpose

Demonstrate a governed review from competence and conflict checks through an acceptance handoff, using only domain-neutral fictional material.

## Scope and Authority

The actor is a fictional Scientific Reviewer. KGS defines review authority and conflict procedure; KAS defines authoring expectations. Acceptance and publication remain separate KGS authorities.

## Scenario and User Goal

Reviewer R is offered `REVIEW-FICTION-001` for `CONCEPT-FICTION-001` version 2 about abstract **Subject Alpha**. All objects and content are invented. The reviewer must provide a transparent human judgment without changing the candidate.

## Journey

1. **Competence check:** Reviewer R reads the review scope and records a human declaration of relevant competence or declines with a reason. The workspace does not infer expertise.
2. **Conflict-of-interest check:** The reviewer completes the governed declaration. An unresolved conflict blocks access to consequential review actions and routes recusal or governance review.
3. **Evidence review:** With clearance recorded, Reviewer R opens the fixed candidate version, traces `EVIDENCE-FICTION-001` to `SOURCE-FICTION-001`, reads limitations and conflicts, and evaluates only the submitted scope.
4. **Finding:** The reviewer creates `FINDING-FICTION-003`, assigns the governed finding class, cites the exact candidate version and fictional evidence locator, explains the concern, and requests a bounded revision. The system does not write or rank the finding.
5. **Revision verification:** Author A submits version 3 with a response. Reviewer R compares fixed versions 2 and 3, verifies the cited change, preserves the original finding, and records whether it is resolved, remains open, or requires escalation.
6. **Review decision:** When every required finding has a disposition, Reviewer R records a review recommendation and rationale within their role. This is not acceptance.
7. **Acceptance handoff:** The candidate, fixed version, review record, evidence trace, conflicts, recusals, findings, and rationale move to the separately authorized Acceptance Gate. The reviewer cannot approve publication.

## Conceptual Actions and Prohibited Actions

The reviewer may accept or decline assignment, declare competence and interests, inspect, add findings, verify revisions, preserve disagreement, and submit a review decision. They may not edit the candidate, infer evidence, diagnose, recommend, accept outside their authority, or publish.

## Failure and Empty States

Missing evidence produces an incomplete-review state, not a negative conclusion. A stale candidate version blocks decision. An unresolved conflict prompts recusal or escalation. No findings means “none recorded,” not automatic approval. Failed quorum or disputed authority follows KGS.

## Accessibility

The future review flow must expose fixed versions, declarations, finding types, errors, and decision context in text, with keyboard access and a linear alternative to side-by-side comparison.

## Governance and Audit Requirements

Assignment, competence and interest declarations, evidence access, findings, revision verification, decision, recusal, escalation, and acceptance handoff require future audit records. Prior positions remain visible.

## Non-example

The interface notices that version 3 changed and automatically resolves the finding or recommends acceptance. That would replace human review with prohibited inference.

## Future Implementation Considerations

This journey authorizes no accounts, permissions, storage, workflow engine, UI framework, or publication integration.

## Change Control

Keep the scenario fictional and subordinate to the Constitution, KAS, KGS, ADR, RAS, and Publication Boundary.
