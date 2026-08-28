# Governed Management Option Runtime

## Purpose and authority boundary

Step F1 answers which management option classes the current Case evidence supports for human review. It does not answer what treatment should be performed. Finding, Management Option, Human Decision, Field Action, and Outcome remain separate records and authorities.

The runtime accepts only the server-authoritative Investigation Bundle and the current persisted Step C assessment revision. Browser state, conversation wording, image bytes, Candidate existence, product availability, and model memory cannot open management review. Step E may verbalize the structured result but cannot add, remove, or change an option state.

## Step C and Need-for-Action gate

`need-for-action-decision/v1` retains the categorical states `MORE_EVIDENCE_REQUIRED`, `CONTINUE_MONITORING`, `NO_ACTION_DETERMINATION_SUPPORTED`, `MANAGEMENT_REVIEW_JUSTIFIED`, and `HUMAN_REVIEW_REQUIRED`. A Candidate or user request is never sufficient. When Step C does not declare `SUFFICIENT_FOR_MANAGEMENT_OPTION_REVIEW`, F1 returns `MORE_EVIDENCE_REQUIRED` and identifies Step D as the next authority.

The gate never emits spray-required, chemical-required, treat-now, a severity score, a percentage, or a rank.

## Management Suitability runtime

`management-case-suitability/v1` evaluates each governed option class separately. Cultural, mechanical, biological, monitoring, no-action, and expert paths are first-class. A non-chemical class requires an explicit Case-relevant governed relationship; generic model knowledge cannot populate it.

The older `WATER_MANAGEMENT` distinction is preserved as `source_option_class` and transparently projected to the canonical `CULTURAL_MANAGEMENT` presentation class. No water-level instruction is inferred.

## Management Option schema and ordering

Each durable option records its stable ID, user/Field/CropSeason/Case scope, Step C assessment and optional reviewed-finding reference, class, categorical eligibility, Need-for-Action state, target reference, supporting/missing/contradicting evidence, authority state and references, Human Review requirement, explanation, limitations, knowledge gaps, rule identity/version, separate scientific and regulatory provenance, context hash, engine version, validity time, supersession time, and status.

The canonical order is `CONTINUE_MONITORING`, `CULTURAL_MANAGEMENT`, `MECHANICAL_MANAGEMENT`, `BIOLOGICAL_MANAGEMENT`, `CHEMICAL_REVIEW`, `EXPERT_REVIEW`, and `NO_ACTION_CURRENTLY_JUSTIFIED`. It is deterministic presentation order only. `presentation_is_ranking` is always false, multiple classes may coexist, and the SP shortlist contains no more than three currently reviewable paths. The complete evaluation set remains in history.

## Eligibility states and explainability

The closed eligibility vocabulary is `SUPPORTED_FOR_REVIEW`, `MORE_EVIDENCE_REQUIRED`, `NOT_SUPPORTED_BY_CURRENT_EVIDENCE`, `BLOCKED_BY_AUTHORITY`, `HUMAN_REVIEW_REQUIRED`, and `NOT_APPLICABLE`.

Every option states why it is open or blocked, which evidence supports it, what is missing or contradictory, which authority controls it, and the next governed layer. Explicit gaps include missing Action Evidence, management relationship, Case-suitability rule, regulatory chain, current authority, conflicting authority, failed-control review, and unknown.

## Chemical two-key gate and Thai authority

`CHEMICAL_REVIEW` opens only when both keys pass:

1. Need-for-Action is `MANAGEMENT_REVIEW_JUSTIFIED`.
2. Current Thai primary-regulator authority completes a defensible exact Crop × Target × Use × Registration chain.

Registration identity alone, market availability, manufacturer material, and IRAC/FRAC/HRAC classification do not satisfy Key B. Historical or conflicting authority fails closed. Human Review cannot waive missing authority. A test-only complete chain is accepted solely through an explicitly test-only provider; the production default retains the repository's current incomplete authority state.

Even with both keys, F1 opens only a future governed chemical-review layer. It creates no active-ingredient or product choice, brand preference, rate, dose, mixture, timing, spray volume, drone setting, repeat treatment, MoA switch, efficacy score, or resistance conclusion.

## Monitoring, no action, expert review, and failed control

`CONTINUE_MONITORING` is a valid option but receives no invented interval. `NO_ACTION_CURRENTLY_JUSTIFIED` is a current evidence state; it does not resolve the Case or prevent later action. `EXPERT_REVIEW` is a valid safe path for material conflict, ambiguous suitability or authority, and governed failed-control review.

Failed-control context retains evidence references and limitations involving identity, timing, activity, application context, coverage, environment, and susceptibility. It never creates resistance, a higher dose, re-treatment, a stronger product, a mixture, or an automatic MoA change.

## Persistence, provenance, invalidation, and history

`governed_management_reviews` stores the Case-level F1 snapshot and `governed_management_options` stores every option evaluation. A context hash covers Field/season/Case identity, stage, authoritative Investigation Bundle, Step C revision and rules, reviewed findings, management/outcome context, and the F1 provider manifest.

Evidence, stage, Step C, Human Review, management history, outcome/failed-control context, regulatory authority, or F1 rule changes supersede the current snapshot. Prior reviews and option states remain queryable and auditable. Scientific and regulatory provenance remain separate.

## Step D, Step E, Field Action, and Human Review

Step D remains the authority when evidence is missing. A missing observable fact points to the existing Guidance or `field-action-handoff/v1` evidence workflow; F1 creates no application task. Step E reads F1, presents friendly Thai wording, and cannot manufacture option classes. A request such as “ใช้ยาอะไรดี?” can only report that Chemical Review is blocked or can proceed to its next governed layer.

F1 ends at option readiness for Human Decision Review. Final human selection, Decision Snapshot, application planning, Field Action execution, scheduling, and Outcome assessment belong to later layers.

## Authenticated APIs

- `GET /api/pilot/management-options`
- `GET /api/pilot/management-option-history`
- `GET /api/pilot/management-review-context`

All routes require the authenticated user's exact Field, CropSeason, and Case scope. Cross-user and cross-context reads fail closed. The browser adapter is read-only with respect to F1 authority.

## Explicit non-goals

Step F1 does not implement final treatment selection, Decision Snapshot, Field Action execution, Outcome assessment, reminder scheduling, application planning, chemical or product selection, rate/dose, mixing, drone parameters, MoA switching, resistance determination, product preference, Step H, Step I, deployment, release, publication, or automatic learning.
