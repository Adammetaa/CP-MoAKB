# Governed Guidance Intelligence (Step D)

## Purpose and authority

Step D answers one operational question: **what is the single most useful thing the user should inspect, complete, or hand off next?** It is a deterministic server-side application service. It consumes the authoritative Field/CropSeason, StageAssessment, Investigation Bundle, and current Step C assessment. It does not repeat Step C adjudication and does not use an LLM.

The authority chain is `authoritative facts -> Step C evidence gap or governed workflow source -> one Guidance item -> attributed reason`.

Guidance is intentionally separate from nearby concepts:

- Guidance is not Investigation adjudication. Step C owns Candidate comparison, evidence relations, sufficiency, and stop conditions.
- Guidance is not Evidence. Completing an item never manufactures an Observation or Evidence record.
- Guidance is not Management. It does not select treatment, chemistry, product, dose, rate, or an action to perform on the crop.
- Guidance is not a Reminder. It has no scheduler, notification delivery, or recurrence behavior.
- Guidance is not Diagnosis. It cannot resolve a Candidate or Case and cannot claim a cause.

The older browser-local `GuidanceService` and `guidance_states` projection remain a transitional pilot UI contract. The governed Step D runtime uses separate `governed_guidance_items` and `governed_guidance_transitions` tables and is authoritative for the new scoped APIs.

## Guidance object

A durable item retains identity/scope; type/domain/title/instruction; categorical priority; reason, why, what, where, and how; evidence concept/comparison; Candidate and gap references; source/rule provenance; authoritative stage and environment context; limitations; lifecycle timestamps; engine/provider versions; assessment revision; context hash; semantic key; and supersession link. Explicit boundary flags record that Guidance is not Diagnosis, Management, Evidence, chemical output, or Reminder.

The current engine version is `governed-guidance-engine/v1`. History keeps the original item plus attributed transition records. Lifecycle changes do not overwrite the Step C snapshot.

## Types, domains, and priority

The five types are `ROUTINE_INSPECTION`, `CONTEXT_RISK_INSPECTION`, `FOLLOW_EXISTING_CASE`, `EVIDENCE_COMPLETION`, and `NO_ADDITIONAL_INSPECTION`.

Inspection domains are `CROP_DEVELOPMENT`, `DISEASE_INSPECTION`, `INSECT_INSPECTION`, `WEED_INSPECTION`, `ABIOTIC_INSPECTION`, `WATER_INSPECTION`, `ROOT_INSPECTION`, `MANAGEMENT_HISTORY_CHECK`, `SAMPLING_COMPLETION`, `VISUAL_EVIDENCE`, and `GENERAL_FIELD_INSPECTION`.

Priority is categorical, never a score:

- `P0`: required expert or laboratory handoff after an authoritative stop condition;
- `P1`: high-value Step C evidence or a due follow-up;
- `P2`: medium-value evidence or a planned existing follow-up;
- `P3`: low-value/routine work or the explicit no-additional-inspection state.

## Lifecycle

The lifecycle is `GENERATED -> SHOWN -> ACKNOWLEDGED -> IN_PROGRESS -> COMPLETED`, with valid terminal alternatives `DISMISSED`, `EXPIRED`, and `SUPERSEDED`. The service validates every transition and can use `expected_status` for optimistic concurrency.

`ACKNOWLEDGED` is not `COMPLETED`. `COMPLETED` does not create Evidence or resolve a Case. `DISMISSED` records that the user declined the item; it does not resolve the Investigation. A stale active item becomes `SUPERSEDED`, preserving its transition history.

## Source authority and production knowledge boundary

Allowed sources are `INVESTIGATION_NEXT_BEST_EVIDENCE`, `ACTIVE_CASE_FOLLOW_UP`, `GOVERNED_STAGE_INSPECTION_RULE`, `GOVERNED_CONTEXT_INSPECTION_RULE`, `WORKFLOW_GUIDANCE_RULE`, and `TEST_ONLY_FIXTURE`.

The production runtime contains operational Step C-to-Guidance translation rules only. These map a structured evidence request to a capture domain and safe workflow wording; they do not add a scientific conditional. This sprint does not author broad stage or context agronomy. If no authoritative source supports an inspection, the result is `NO_ADDITIONAL_INSPECTION` with `GUIDANCE_KNOWLEDGE_GAP`.

`TEST_ONLY_FIXTURE` is rejected by normal constructors and can enter only through the explicit test-only factory. Duplicate identical fixture rules collapse by stable identity; conflicting duplicate identities are rejected.

## Selection and stage behavior

The engine returns one object, never a generated checklist. Selection order is:

1. expert/laboratory handoff required by Step C;
2. the single Step C Next Best Evidence request;
3. a due or planned active-case follow-up;
4. a governed context inspection rule;
5. a governed routine/stage inspection rule;
6. `NO_ADDITIONAL_INSPECTION`.

An open Case suppresses routine Guidance. A targeted Step C request or existing Case follow-up wins instead. No external weather request is made; only authoritative Evidence already in the bundle can appear as environment context.

Unknown Stage is valid. Step C evidence completion, handoff, and active Case follow-up can proceed with an unknown Stage. A governed stage rule runs only when its declared authoritative Stage matches. User-confirmed or user-overridden StageAssessment provenance is retained from the lifecycle authority.

## Backend reuse and explainability

The item links the authoritative field, season, case, observations, StageAssessment, Candidates, Evidence gaps, and environment Evidence. It asks only for the structured Step C target. Known crop, stage, symptom, spatial, water, and management facts are context—not questions to ask again.

`why_now`, `reason_code`, `source_ref`, Candidate/gap references, and rule provenance support a future UI explanation. The explanation comes from the Step C relation or governed workflow source; it is never fabricated by an LLM.

## Stop conditions, suppression, and invalidation

- `ENOUGH_FOR_CURRENT_DECISION`, `CASE_RESOLVED`, and management-review sufficiency produce `NO_ADDITIONAL_INSPECTION`.
- `USER_DECLINED` suppresses ordinary follow-up.
- `EXPERT_REVIEW_REQUIRED` and `FIELD_EVIDENCE_EXHAUSTED` produce one expert handoff.
- `LAB_EVIDENCE_REQUIRED` produces one laboratory handoff.

Repeated reads return the same active Guidance identity. Equivalent recently completed or dismissed items produce one stable no-additional-inspection suppression result rather than recreating the task. New authoritative Evidence, Step C assessment revision, Stage/case/follow-up change, or Guidance provider version/hash changes the context hash, supersedes the active item, and recomputes one current item. History remains auditable.

## Authenticated APIs and diagnostics

- `GET /api/pilot/guidance?field_id=...&season_id=...&case_id=...` returns one current governed item. Omitting `case_id` preserves the transitional browser projection during migration.
- `GET /api/pilot/guidance-history?field_id=...&season_id=...&case_id=...` returns scoped history with transitions.
- `POST /api/pilot/guidance-actions` accepts `guidance_id`, `action`, optional `rationale`, and optional `expected_status`.
- `GET /api/pilot/guidance-diagnostics?field_id=...&season_id=...&case_id=...` exposes engine/provider version, assessment revision, active/superseded counts, suppression reasons, and current rule identity.

All routes require the pilot session. The backbone validates ownership across user, field, season, and case before reads or generation.

## Explicit non-goals

This runtime does not implement OpenAI/LLM reasoning, chat orchestration, natural-language extraction, computer vision, image diagnosis, Visual Evidence interpretation, Management Options, chemical/active-ingredient selection, product ranking, rate/dose, registration decisions, reminder scheduling, push notifications, outbreak detection, automatic learning, knowledge promotion, deployment, release, or publication.
