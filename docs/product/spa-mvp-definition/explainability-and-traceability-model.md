# Explainability and Traceability Model

Status: Active

Version: 1.0

## Explanation Chain

> Case -> Reported Information -> Observation -> Information Gap -> Question and
> Response -> Evidence -> Knowledge Reference -> Hypothesis Candidate ->
> Differential Comparison -> Human Review -> Finding -> Management Option ->
> Decision -> Action -> Outcome

This chain is reconstructive, not inferential. A link states an authored,
reviewed relationship with scope and provenance; traversing links does not prove
or promote anything.

## SPA Explanation Responsibilities

The SPA must be able to explain:

- what was reported and by whom;
- what was directly observed, measured, or otherwise captured;
- what remains unknown, unavailable, not recorded, conflicting, or not applicable;
- which material was collected and its provenance, quality, and limitations;
- which Knowledge References were consulted and their case-use states;
- why each provisional candidate was authored;
- what supports, challenges, conflicts with, or remains missing for each candidate;
- which criteria structured comparison and why;
- who reviewed the case, under what authority, and with what dissent;
- why a finding was accepted for purpose or remained unresolved;
- why Management Options were eligible, if separately authorized;
- what the user decided, what action occurred, and what outcome was later captured.

## Output Status

Every report and explanation distinguishes provisional, reviewed, unresolved,
rejected, withdrawn, publication eligible, and internal-only content. Review
status is scoped: review of one evidence relationship does not approve the whole
case. Publication eligibility is not publication.

## Minimum Report Outputs

The conceptual outputs are SPA case summary, Observation summary,
missing-information summary, evidence inventory and limitation summary,
hypothesis comparison summary, reviewer finding, unresolved-issue summary,
Management Options eligibility summary, Decision and Action record, follow-up
plan, and Outcome record. No report layout or generation implementation is defined.

## No Hidden Knowledge or Ranking

Every reference used in rationale is visible with version, role, applicability,
and reviewer. Candidate order, interface emphasis, completeness, popularity,
prior cases, product association, or model output cannot create rank. No
Recommendation may appear without a complete explanation path and separately
authorized recommendation governance; the first MVP authors none.

## Audit Expectations

Traceability preserves author, reviewer, source, observer, time, language,
context, transformations, previous versions, disagreements, skipped questions,
unavailable material, lifecycle decisions, and reason for every return or
escalation. Later corrections append governed history rather than rewriting the
past account.
