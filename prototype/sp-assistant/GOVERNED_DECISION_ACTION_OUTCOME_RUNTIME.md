# Governed Human Decision → Management Action → Outcome Runtime

## Purpose and authority boundary

Step F2 is the server-authoritative bridge from a current Step F1 review to an explicit Human Decision, an explicitly planned or performed Management Action, and descriptive Outcome evidence. It does not recommend an option, infer that an action happened, calculate efficacy, infer causality or resistance, resolve a Case, schedule reminders, or promote canonical knowledge.

The boundary is intentionally strict:

- F1 option ≠ Human Decision.
- Human Decision ≠ Management Action.
- planned action ≠ performed action.
- performed action ≠ Outcome.
- Outcome ≠ efficacy.
- association ≠ causality.
- Investigation Field Action (`field-action-handoff/v1`) ≠ F2 Management Action.

## Human Selection and immutable Decision Snapshot

The server accepts only an explicit authenticated selection against the current F1 `management_review_id`. The snapshot freezes the complete visible option set, selected option state, scientific and regulatory authority references, Step C assessment/revision, F1 revision/context hash, Investigation Bundle hash, limitations, knowledge gaps, exact selection source, and optional source span.

Decision types are `SELECT_MANAGEMENT_OPTION`, `CONTINUE_MONITORING`, `NO_ACTION_CURRENTLY`, `REQUEST_EXPERT_REVIEW`, `DEFER_DECISION`, `DECLINE_OPTION`, and `CANCEL_PRIOR_DECISION`. Lifecycle states are `DRAFT`, `CONFIRMED`, `DEFERRED`, `DECLINED`, `REVIEW_REQUIRED`, `SUPERSEDED`, and `CANCELLED`.

Unsupported, authority-blocked, not-applicable, and more-evidence-required options cannot become confirmed decisions. An option marked `HUMAN_REVIEW_REQUIRED` remains `REVIEW_REQUIRED`. A Chemical Review selection can only enter a future governed chemical-review layer; it cannot create an application plan or performed application.

Changes of mind and corrections append a new immutable decision that explicitly supersedes the current decision. Prior JSON is never rewritten. Optimistic current-ID checks prevent stale clients from silently replacing state.

## Management Action and historical facts

The Management Action schema records the Human Decision reference, option class, description, bounded parameters, planning/performance times, actor and source, location and application context references, limitations, provenance, revision, and supersession link.

`PLAN` produces `PLANNED`; it never claims execution. `CONFIRM_PERFORMED` requires an explicit human confirmation and exact `performed_at`, and creates a governed Investigation `MANAGEMENT_EVENT`. `RECORD_HISTORICAL_ACTION` may preserve a user-reported product/input name and raw rate as historical facts when the existing event schema supports them. Those facts remain unverified reports: `system_recommendation:false`, `legality_inferred:false`, and `efficacy_inferred:false`.

Investigation Field Actions continue to collect evidence under `field-action-handoff/v1`. F2 Management Actions represent human-selected management activity. Neither architecture aliases or auto-creates the other.

## Outcome Observation, T0/T1/T2, and comparison

Each Outcome Observation is an explicit submission tied to a performed Management Action and its Human Decision. It records exactly one declared phase (`T0`, `T1`, or `T2`), observation time, declared relation to the action, subject, raw value, unit, denominator, count basis, sample size, sampling method/context, spatial scope, visual references, evidence state, limitations, provenance, revision, and optional correction link. The server never infers a missing phase.

Each submission also creates a governed Investigation `OUTCOME`, so the authoritative bundle changes. Step C and F1 then reassess naturally from that new bundle; prior assessments and reviews remain in history.

Sampling comparability is descriptive and closed: `SUPPORTED`, `COMPARISON_LIMITED`, `NOT_COMPARABLE`, or `UNKNOWN`. Units, denominators, count bases, methods, contexts, spatial scopes, and sample sizes are compared without invented conversion or normalization.

A Human Outcome Comparison may record `DECREASE_OBSERVED`, `INCREASE_OBSERVED`, `NO_CLEAR_CHANGE`, `COMPARISON_LIMITED`, `NOT_ASSESSABLE`, or `UNKNOWN`. It preserves the human statement but does not become efficacy, treatment success/failure, causality, resistance, susceptibility, a higher-dose recommendation, reapplication, tank mixing, mode-of-action switching, product superiority, or company preference.

Poor or unclear outcomes keep alternative explanations open, including identity uncertainty, timing, coverage, reinfestation, prior progression, environment, sampling variation, execution uncertainty, other causes, and resistance uncertainty. None are ranked or concluded automatically.

## Persistence, provenance, history, and cross-device memory

SQLite migration 10 adds append-only tables for Human Decisions, Management Actions, Outcome Observations, Human Outcome Comparisons, and versioned Outcome Reviews. User-scoped request IDs provide idempotency; reuse with different input returns a version conflict. Ownership and Field/Season/Case linkage are validated by the authoritative Investigation Backbone.

Outcome Reviews persist their Step C and F1 references and supersede when the governed context hash changes. The server context endpoint returns current state plus full decision/action history, allowing another authenticated device to resume without trusting browser-local memory.

## Step E conversation integration

Step E recognizes explicit management selection, action confirmation, and outcome-report intents. The server still validates every write. “เอาทางติดตามต่อ” can select exactly one matching current F1 option. “เอาทางนี้” asks one clarification and writes nothing. “ทำแล้ว” asks for an explicit performed time when absent. A bounded statement such as “วันนี้เห็นว่าลดลง” may be stored as a Human Outcome Comparison tied to one unambiguous performed action; it is not efficacy.

Provider output cannot select an option, approve Chemical Review, invent action instructions, infer execution, infer efficacy/resistance, resolve a Case, or create product/rate advice. Normal Step E output retains exactly one primary action and zero or one question.

## Authenticated APIs

- `POST /api/pilot/human-decisions`
- `GET /api/pilot/human-decision-history`
- `POST /api/pilot/management-actions`
- `GET /api/pilot/management-action-history`
- `POST /api/pilot/outcome-observations`
- `POST /api/pilot/outcome-comparisons`
- `GET /api/pilot/outcome-review`
- `GET /api/pilot/outcome-review-history`
- `GET /api/pilot/decision-action-outcome-context`

All APIs require an authenticated session and derive the owner from that session. Validation errors return 400, authorization failures 403, and optimistic or idempotency conflicts 409.

## Explicit non-goals

F2 does not push, deploy, release, publish, tag, open a pull request, control a device, prescribe a chemical, choose a product or rate, schedule work, infer an unreported action or phase, calculate efficacy, claim cause, infer resistance, automatically close a Case, or learn into the governed knowledge base.
