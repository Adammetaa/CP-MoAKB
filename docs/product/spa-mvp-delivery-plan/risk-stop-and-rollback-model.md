# Risk, Stop, and Rollback Model

Status: Active

Version: 1.0

## Mandatory Stop Conditions

Pause affected work and trigger accountable review for: a safety-sensitive Case
outside authority; privacy/consent breach; provenance-affecting data loss;
repeated Observation-to-Diagnosis collapse; unsupported Management Option;
unavailable required reviewer; unresolved role authority; systematic evidence
context loss; unexplained ranking; inability to distinguish provisional from
reviewed content; repeated field failure from excessive burden; or any governance violation.

There is no silent continuation, timeout acceptance, or completion-based waiver.

## Conceptual Rollback

Rollback may pause the pilot, revert to a prior increment, disable a workflow
capability, return to manual external review, reduce case scope, withdraw a
Question Pattern or Knowledge Package, require added review, reopen affected
cases, and notify affected users. Historical Case and audit records are retained
and never deleted or rewritten. This is not technical deployment rollback.

## Architecture Risk Register

| Risk | Cause and consequence | Mitigation | Detection and stop/escalation |
|---|---|---|---|
| oversized single release | complete logical MVP treated as one delivery; learning arrives too late | independent A/B/C value and gates | unvalidated coupling; Owner scope stop |
| A becomes simple form | completion fields replace investigation semantics | manual gaps/questions/evidence/provenance and field observation | high completion but unusable review packages; redesign A |
| B becomes approval screen | review status hides reasoning | candidates, criteria, adverse evidence, disagreement | approval without rationale; stop review |
| C infers efficacy | Outcome conflated with cause | bounded Outcome and no causal language | efficacy claim without authority; stop C |
| reviewer bottleneck | insufficient capacity/poor packages | confirm capacity, clear handoffs, unresolved closure | queues/turnaround and ownerless stalls; pause expansion |
| easy-case bias | selection optimizes success | diversity frame and hard/unresolved cases | sample audit; revise sample |
| insufficient diversity | narrow channel/difficulty/context | staged sampling and bias account | recurring untested conditions; extend round |
| SPA entry burden | oversized data demands | purpose-minimum capture and incomplete save | debrief, abandonment, duplicate entry; simplify/pause |
| field-season dependency | cases/follow-up unavailable | plan bands and seasonal disclosure | missing outcome opportunities; defer claims |
| incomplete follow-up | ownership or access weak | assigned owner and visible deferral | overdue/externally tracked work; stop C exit |
| external-tool dependency | core reasoning escapes case | continuity and explanation acceptance | chat/notebook reconstruction; fail increment |
| privacy/location leakage | excessive access or capture | sensitivity classification and purpose handling | breach/debrief/audit; immediate stop |
| premature Options | pressure for advice before review | eligibility gate and exclusion from A/B | option shown early; immediate stop |
| Vertical Slice not ready | unreviewed/weak content used | Gate B and content authority audit | missing provenance/reviewer challenge; block B |
| unresolved authority | roles assumed from job title | approved matrix and case assignment | refusal/conflict/unclear approval; stop review |
| false completion success | counts replace quality/value | observable boundary and usability evidence | high counts with failure signals; reject exit |
| deferred AI reintroduced | convenience workaround enters pilot | explicit scope audit and manual acceptance | model-driven selection/rank/diagnosis; stop pilot |
| learning bypasses governance | nomination treated as approved change | review-pending state and Knowledge Review | direct product/knowledge change; rollback nomination |

## Stop Resolution

Resolution records affected cases, containment, notification, evidence, root
boundary, required reviewers, corrections, residual risk, reopening decision,
and Owner approval. The same condition must be retested before resumption.
