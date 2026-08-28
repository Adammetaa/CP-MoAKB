# Governed Follow-up, Reminder, and Timeline Runtime

## Purpose and authority boundary

Step G turns an already-authorized future revisit into durable operational state. Its contract is `Follow-up Plan → Reminder lifecycle → notification eligibility → authoritative timeline`. It does not diagnose, choose management, interpret outcomes, resolve a Case, or promote knowledge.

The hard separations are: Guidance is not a Follow-up Plan; a Follow-up Plan is not a Reminder; a Reminder is not a Notification; a Reminder is not Evidence; a Timeline Event is not Evidence; an Observation is not an Outcome; and Reminder completion is not Case resolution.

## A10 Follow-up Plan integration

Every governed plan is backed by the existing A10 `follow_up_plans` record. The Step G table stores an immutable governed extension and supersession history, not a second browser-local follow-up concept. Step D continues to read the same A10 bundle and retains ownership of its existing active/DUE priority behavior.

Plans preserve source type and source reference, what/where/how fields, expected evidence type, optional comparison and sampling details, timing basis and authority, limitations, a frozen context hash, and optional Step C, Guidance, F1, Decision, Action, or Outcome-review references. Missing sampling method, unit, denominator, or sample size stays missing.

## Timing authority and modes

The closed timing modes are `EXACT_TIME`, `TIME_WINDOW`, `EVENT_RELATIVE`, and `UNSCHEDULED`. Scheduled plans require an explicit authority and source reference. Event-relative timing resolves only from a source event with a real `occurred_at`; no event means no schedule. Missing timing remains `TIMING_NOT_ESTABLISHED`, with no default three-day or seven-day interval.

Human-authored relative timing is resolved from the injected server clock and recorded as `HUMAN_AUTHORED`. The runtime preserves UTC instants and the Reminder preserves its IANA timezone, including `Asia/Bangkok`. This provenance does not claim the selected time is scientifically optimal.

## Reminder lifecycle and notification boundary

A Reminder references one Follow-up Plan and has append-only revisions. States are `SCHEDULED`, `DUE`, `ACKNOWLEDGED`, `IN_PROGRESS`, `COMPLETED`, `DISMISSED`, `CANCELLED`, `EXPIRED`, and `SUPERSEDED`. Optimistic revision checks reject stale writes, terminal states cannot be resurrected, and a superseded Plan supersedes its non-terminal Reminder.

Due and overdue are operational attention states only. Acknowledgement is not completion. Completion creates no Observation, Evidence, Outcome, efficacy conclusion, or Case resolution. Dismissal and expiry infer no scientific refusal, treatment failure, or negative evidence.

Notification eligibility is a separate read projection: `ELIGIBLE`, `NOT_DUE`, or `SUPPRESSED`. Step G has no external push, email, SMS, delivery provider, or production background worker. A delivery failure therefore cannot mutate Reminder state.

## Authoritative timeline

The timeline is a server projection over existing lifecycle, investigation, F2, Follow-up Plan, and Reminder records. It does not create a parallel event truth store. Each event exposes a stable source type and ID, `occurred_at` and `recorded_at`, time precision, status, provenance, supersession relationship, and UI target.

Ordering uses occurred time, recorded time, and stable ID. Original and corrected/superseding records remain visible for audit. Timeline text is deliberately descriptive and contains no diagnosis, efficacy, causal, resistance, prevalence, urgency, or recommendation conclusion.

## Step E conversation integration

Step E recognizes explicit scheduling and Reminder-action language locally. “กลับมาดูอีก 3 วัน” is Human-authored timing calculated from the injected server clock. Ambiguous timing such as an unspecified morning, multiple candidate plans, or multiple candidate Reminders produces one clarification question and no write. A conversation provider cannot manufacture scheduling authority; provider failure writes no Plan or Reminder.

## Persistence, ownership, and cross-device reconstruction

Plans and Reminder revisions live in authenticated server SQLite storage. Request IDs are idempotent, hashes reject changed retries, ownership and Field/CropSeason/Case scope are validated through the Investigation Backbone, and stale revisions return a version conflict. Repeated reads reuse the same current Reminder and stable timeline events.

## Authenticated APIs

The server exposes authenticated capabilities for Follow-up Plan create/list/history, Reminder create/list/action/history/due, notification eligibility, reconciliation, timeline, and the combined context. The browser adapter calls only these server APIs and holds no authoritative Reminder database.

## Explicit non-goals

Step G does not implement external notification delivery, diagnosis, chemical or product selection, rate or dose advice, spray timing, automatic re-treatment, automatic outcome interpretation, automatic Case closure, local-pattern aggregation, model training, or canonical knowledge promotion. Spatial/local pattern work belongs to Step H; governed learning belongs to Step I.
