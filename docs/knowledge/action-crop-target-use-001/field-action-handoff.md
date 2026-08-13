# Field action handoff and execution readiness

Status: accepted bounded Decide-to-Execute projection; `not_published`

`field-action-handoff/v1` turns exactly one highest-value decision-evidence gap
into a concrete action that a human can perform. It composes the existing Case,
observation, Need-for-Action, management-suitability, photo-mission, progression,
and Human Review structures. It is not a workflow engine, task-management
platform, prescription system, drone mission, or farm-operations platform.

The bounded projection records `action_id`, Case reference, creation time,
source decision, action type, purpose, instructions, target observation,
optional location context, plant part, sampling context, optional photo mission,
measurement and unit, completion state and time, result, limitations, and
provenance. Supported actions are `OBSERVE`, `COUNT`, `INSPECT`, `COMPARE`,
`PHOTOGRAPH`, `RECORD`, `RE_INSPECT`, `MEASURE`,
`VERIFY_APPLICATION_CONTEXT`, `PREPARE_EXPERT_HANDOFF`,
`REPEAT_OBSERVATION`, and `OTHER_GOVERNED_FIELD_ACTION`. Spray, product
application, mixing, dose increase, and MoA change are deliberately absent.

Every mission says what to do, why it matters, what to record through its target
observation, what decision it can change through its source-decision link, and
what limitation applies. The interaction modes remain compatible with the
frozen mobile chat grammar: take or choose a photo, structured answer, numeric
measurement, unsure, and a scientifically valid skip. Photo receipt is not
analysis and cannot complete the observation without human confirmation.

States are `READY_FOR_FIELD_ACTION`, `MORE_INFORMATION_REQUIRED`,
`HUMAN_REVIEW_REQUIRED`, `BLOCKED_BY_AUTHORITY`, `IN_PROGRESS`,
`COMPLETED_BY_USER`, and `CANCELLED_BY_USER`. Completion requires both an
explicit user-completed signal and a result. Completion means the action was
performed, not that diagnosis was confirmed. Unable, not-found, unsure, skip,
and cancellation select an alternate evidence path or Human Review and never
fabricate completion.

On explicit completion, the human result becomes a timestamped observation
with subject, value, unit, denominator, source, sampling limitation, and action
provenance. The existing candidate/identification, activity, progression,
Need-for-Action, and management-suitability gates are rerun deterministically;
the result is one next Field Action. A correction supersedes the prior
observation and stale decisions are not retained as active. Bounded Case history
records the request, performance, result, time, and effect on Case state.

The BPH slice requests `insects_per_plant` without inventing a sampling method.
Eight insects per plant returns to continued monitoring; ten or more justifies
management review. The Thai regulatory Key B still blocks chemical review, so
neither result produces a product, active ingredient, rate, mixture, spray
program, application time, or drone parameter. Incompatible sampling units are
not silently normalized and ambiguous denominator semantics require Human
Review.

Historical leaffolder damage prompts inspection inside a folded leaf for live
larvae or fresh feeding; it is not current infestation. Stem-borer missions
capture crop stage and stem-interior evidence without species inference.
Disease missions compare lesion morphology and new/old tissue without pathogen
confirmation. Weed missions capture morphology and distribution without
herbicide execution. Abiotic missions compare plant, root, water, treated, or
untreated context without fertilizer, water, recovery-product, or biostimulant
prescription. Failed-control missions record prior application context without
claiming resistance or creating re-treatment.

Application-pattern inspection can distinguish pass, overlap, interruption, or
field-wide patterns, but neither drone settings nor pattern confirms deposition.
Weather retrieval remains a separate explicit flow. GPS is never requested
automatically, is optional, and is not persisted or transmitted. Action creation,
observation, symptom, application, and biological-onset times remain distinct.
T1/T2 repeat missions require an explicit human comparison; two photos do not
automatically prove progression.

`PREPARE_EXPERT_HANDOFF` packages available governed Case description, crop and
stage, field context, observations and photos, candidates, supporting and
contradicting evidence, missing evidence, activity, progression, burden,
weather, nearby context, intervention and failed-control history, application
context, Need-for-Action, management options, regulatory state, knowledge gaps,
and one specific expert question. The package stays browser-local and is not
transmitted.

Traceability is preserved as Case observation → evidence gap → decision state →
management option → next decision evidence → Field Action → human result → new
observation → reevaluation. Case outcomes remain Case evidence only and cannot
be promoted automatically into Canonical Knowledge, efficacy claims, threshold
authority, or recommendation rules.
