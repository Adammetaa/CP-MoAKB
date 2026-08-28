# Governed Spatial / Local Pattern Runtime

Step H adds a server-authoritative, same-user runtime for asking whether reviewed Cases are sufficiently compatible to examine together as bounded local evidence. It implements the flow:

`Authoritative Case evidence → Cross-Case Comparison → explicit Human Review → Local Pattern Candidate → evidence sufficiency → Human Adjudication → Governed Local Pattern`

This runtime reuses the accepted Sprint-094 comparability semantics and Sprint-095 adjudication semantics. Every comparison has an explicit review question and declared granularity. Results are dimension-by-dimension and use categorical states; there is no score, percentage, weighting, probability, prevalence, incidence, hotspot, spread, causal, efficacy, resistance, product-preference, or Recommendation inference.

## Server authority and history

`spatial-local-pattern-runtime.mjs` reconstructs Case snapshots from the authenticated user's server-owned Field, CropSeason, StageAssessment, Observation, Evidence, Step C assessment, management, temporal, and outcome records. Raw chat and unreviewed perception proposals are not accepted comparison inputs.

SQLite stores immutable Cross-Case Comparison revisions, Local Pattern Candidates, and Human Adjudication revisions. Request IDs provide idempotency; expected revisions provide optimistic concurrency. Source context hashes include the effective Case evidence revisions. A correction makes the prior comparison, Candidate, and adjudication stale without deleting their history.

## Comparison and Candidate boundaries

Supported granularity includes `PHENOTYPE_LEVEL`, `TARGET_LEVEL`, `CANDIDATE_LEVEL`, `MANAGEMENT_CONTEXT_LEVEL`, and `OUTCOME_CONTEXT_LEVEL`, with the accepted older product and active-ingredient levels retained for compatibility. The runtime exposes `COMPARABLE`, `PARTIALLY_COMPARABLE`, `NOT_COMPARABLE`, `INSUFFICIENT_INFORMATION`, and `NEEDS_HUMAN_REVIEW`.

A Local Pattern Candidate can be created only when an explicit Sprint-094-style Human Review includes at least two Cases from a compatible comparison. Candidate means only: “These Cases are sufficiently compatible to examine together.” It remains `canonical = false`, `official_outbreak = false`, and has null efficacy, resistance, recommendation, prevalence, incidence, and risk fields.

## Evidence sufficiency and adjudication

The accepted Sprint-095 dimensions are retained and extended with morphology and bounded environment context. They cover Case count and independence, spatial and temporal diversity, target, crop stage, morphology, outcomes, sampling, management/environment completeness, conflicts, alternatives, source completeness, and correction staleness. There is no hidden weight, sufficiency score, percentage, or universal minimum N.

Human Adjudication supports `CONTINUE_STRUCTURED_REVIEW`, `REQUEST_MORE_EVIDENCE`, `DEFER`, `SPLIT_PATTERN`, and `REJECT_PATTERN`, with the accepted six adjudication states. A split retains the parent Candidate and creates children with `parent_pattern_candidate_id`. A rejection remains traceable. Even a `GOVERNED_LOCAL_PATTERN` is descriptive bounded local evidence, never official surveillance or scientific authority. Stronger inference fails closed as `METHOD_REQUIRED_BEFORE_STRONGER_INFERENCE`; no statistical computation is executed.

## Spatial, privacy, and denominator boundaries

Spatial relationship is limited to `SAME_FIELD`, `ADJACENT_FIELD`, `NEARBY`, `SAME_BOUNDED_AREA`, `DISTINCT_AREA`, or `UNKNOWN`, and only an authoritative relationship may replace `UNKNOWN`. Proximity does not establish transmission. Narrow evidence is not promoted to a Field or local-area claim.

The production scope is the same authenticated user's authorized Fields and Cases. Cross-user identifiable aggregation is not implemented. The privacy-safe projection hides exact coordinates and polygons by default and never exposes farmer names, addresses, Case narratives, or product histories. Counts preserve considered, included, excluded, and unknown Cases. An absent local Field denominator produces `DENOMINATOR_UNKNOWN`; no report is not interpreted as a negative Field.

## Step D, E, G, and I boundaries

Step H emits at most one structured inspection gap/input using the bounded actions `INSPECT_ADDITIONAL_FIELD`, `INSPECT_COMPARISON_AREA`, `COLLECT_MISSING_SPATIAL_EVIDENCE`, `COLLECT_MISSING_TEMPORAL_EVIDENCE`, `VERIFY_CASE_INDEPENDENCE`, or `EXPERT_REVIEW`. Step D remains the Guidance authority and owns one-best-action verbalization.

Step H creates no schedule or Reminder. If a human later plans an inspection, Step G remains the Follow-up, Timing Authority, and Reminder lifecycle owner. Step E receives only bounded Thai context, for example: “ตอนนี้มี 3 เคสที่ข้อมูลบางส่วนเข้ากันได้ แต่ยังเรียกว่าเป็นการระบาดไม่ได้ครับ”. Provider failure cannot create a comparison, Candidate, or adjudication because conversation output is not a Step H write authority.

Step I owns governed learning. Step H never promotes Knowledge, changes Candidate rules or thresholds, trains a model, changes regulatory authority, or learns product performance.

## APIs

Authenticated server endpoints provide create/list operations for Cross-Case Comparisons, Local Pattern Candidates, and Local Pattern Adjudications, plus Local Pattern context, gap, and privacy-safe spatial projections. `ServerWorkspaceAdapter` exposes the same contracts without adding browser scientific authority. Step G's authoritative Timeline may reference Step H review records and labels the adjudication reference as not Evidence.
