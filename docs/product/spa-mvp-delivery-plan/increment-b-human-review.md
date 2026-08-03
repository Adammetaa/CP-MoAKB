# Increment B — Human Review and Differential Investigation

Status: Active

Version: 1.0

## Objective and Value

Enable qualified reviewers to assess an Increment A package, compare
provisional explanations, and record a reviewed or unresolved Investigation
Finding. The SPA receives an explainable review outcome instead of relying on
unsupported personal judgment.

## Included Capabilities

- Review Request, identifiable reviewer acceptance or refusal, handoff, and status;
- return for clarification and request for additional evidence;
- explicit provisional Hypothesis Candidate authoring and preservation of multiple candidates;
- explained Comparison Criteria and supporting, challenging, missing, and conflicting Evidence references;
- reviewer comments, unresolved issues, disagreement handling, escalation, and provenance;
- reviewed Finding or explicitly unresolved Finding with review completion status.

No reviewed Finding exists without an identifiable reviewer and Review record.

## Excluded Capabilities

Automatic candidate generation, hidden scoring, ranking, Diagnosis, reviewer
assignment, Management Option generation, and recommendation automation are excluded.

## Dependencies and Readiness

Increment A must produce reviewable cases. A reviewed Role and Authority Matrix,
request/return model, disagreement and escalation rules, one governed
crop-investigation Vertical Slice, minimum hypothesis/differential content, and
confirmed reviewer capacity are required. Knowledge assets expose sources,
applicability, terminology, evidence roles, and uncertainty.

## Validation and Success

Evidence includes reviewer observation, turnaround, refusal/return reasons,
clarification frequency, missing evidence recognized late, candidate comparison
clarity, disagreement records, SPA understanding, explanation-chain audit, and
honest unresolved outcomes. Success means a qualified reviewer can understand
and dispose of the case within the governed package without reconstructing core reasoning elsewhere.

Failure includes unclear authority, hidden ranking, missing adverse evidence,
forced findings, review without provenance, repeated external reconstruction, or
review queues without visible ownership. Stop when the required reviewer is
unavailable, role authority is unresolved, provisional/reviewed status is
confused, or automatic ranking appears.

## Rollback, Risks, and Expansion

Rollback returns cases to A, narrows review scope, requires external manual
review, disables the affected review capability, withdraws content, or reopens
findings while preserving audit history. Major risks are an approval-only screen,
review bottleneck, weak vertical-slice content, and disagreement suppression.
Expansion to C requires consistent reviewed or unresolved findings, accepted
review burden, approved Decision/Action boundaries, and follow-up ownership.
