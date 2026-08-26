# Investigation Evidence Backbone

## Purpose and authority

The Investigation Evidence Backbone is the server-authoritative persistence,
validation, service, and API boundary for Step A field evidence. It records what
was observed and how it was supported without producing diagnosis, candidate
ranking, treatment, recommendation, or canonical knowledge.

The authoritative identity chain remains `User -> Field -> CropSeason`.
`Observation` may exist before `Case`. A case organizes investigation evidence;
it does not turn an observation into an interpretation.

## Runtime mapping

| Foundation | Server runtime structure |
| --- | --- |
| A1 Rice Stage | Existing `stage_assessments`; every new `investigation_observations.stage_assessment_id` references the authoritative row and preserves its provenance. CMP operational stage remains a separate value inside that row. |
| A2 Field / Spatial Pattern | `investigation_evidence` with type `SPATIAL` and a validated spatial payload. Local/point evidence is rejected as `SP3_FIELD_SUPPORTED`. |
| A3 Plant Part + Morphology | `investigation_evidence` with type `MORPHOLOGY`; plant part, phenotype, descriptive primitives, observability, image references, and explicit negative-evidence states are validated. There is no diagnosis field. |
| A4 Severity | `investigation_evidence` with type `SEVERITY_MEASUREMENT`; concept, unit, raw count/value/range, sampling and plant-part references are retained. Percentages from numerator/denominator are server-derived. |
| A5 Sampling | `investigation_evidence` with type `SAMPLING`; mode, unit, method, site/unit counts when known, representativeness, and evidence level remain explicit. Missing protocol/counts remain null. |
| A6 Weather + Water | Separate `WEATHER` and `WATER` evidence records. Each preserves source/confidence and may declare conflict without rewriting the other. |
| A7 Management History | `management_events`; reported product identity, raw/normalized rates, method, tank mix, and provenance are validated. Active ingredient requires resolved identity. |
| A8 Differential Candidates | `investigation_candidates` and `candidate_evidence_links`; categorical support state and supporting, contradicting, or missing links remain explainable. No probability field exists. |
| A9 Time Course | `temporal_evidence` and `temporal_relationships`; first noticed, earliest evidence, onset, observation, precision/ranges, progression, and ordering are distinct. Timeline output is derived from authoritative records. |
| A10 Follow-up / Outcome | `follow_up_plans` and `investigation_outcomes`; plans, comparable evidence references, optional executed-action reference, outcome/attribution confidence, and review state remain separate. Learning defaults to `CASE_ONLY`. |

The pre-existing browser `Case`, `Observation`, `Evidence`, `FollowUp`, and
`Outcome` collections remain a compatibility envelope for the prototype UI.
New Step A writes use the normalized server records and do not make that browser
envelope authoritative. The existing selection-only `DecisionLog` and governed
Field Action handoff are not duplicated; an Outcome may optionally retain an
external executed-action stable ID.

## Ownership and validation

All creates and reads derive `owner_user_id` from the authenticated session.
Client ownership fields are rejected. Before any write, the server verifies:

- Field belongs to User;
- CropSeason belongs to that Field and User;
- optional Case, Observation, Evidence, Candidate, and cross-record references
  remain in the same User + Field + CropSeason scope; and
- an Observation references the current authoritative StageAssessment.

The SQLite migration is additive, deterministic, idempotent, and non-destructive.
It uses versioned `investigation_schema_migrations` and preserves lifecycle and
legacy workspace data.

## Provenance, evidence, and uncertainty

Records use categorical provenance, review states, confidence bands, and
domain-specific evidence levels (`SP`, `MO`, `SV`, `SM`, `WC`, `WT`, `TC`, and
`OC`). Unknown and partial evidence is valid. The server does not invent sample
counts, thresholds, source facts, active ingredients, or numerical confidence.
`SEARCHED_NOT_FOUND` is accepted only when the target was observable by the
declared inspection; it remains distinct from `NOT_OBSERVED`,
`NOT_ASSESSABLE`, and `UNKNOWN`.

## Service and API contract

`PilotStore` exposes three cohesive application-service operations:

- `createInvestigationRecord(userId, recordType, record)`;
- `getInvestigationBundle(userId, scope)`; and
- `getInvestigationTimeline(userId, scope)`.

The authenticated HTTP adapter maps these to:

- `POST /api/pilot/investigation-records`;
- `GET /api/pilot/investigation-bundle`; and
- `GET /api/pilot/investigation-timeline`.

The bundle contains enough structured data to explain what, where, stage, raw
magnitude, sampling, environmental context, prior events, candidate evidence,
gaps, follow-up, and outcomes. It emits explicit non-inference boundary flags
and no narrative diagnosis.

## Permanent guardrails

- Observation is not Interpretation.
- Candidate is not Diagnosis.
- Selection is not Field Action; Field Action is not Outcome.
- Temporal association is not causation.
- Treatment failure is not resistance.
- One point or image is not whole-field evidence.
- Rainfall is not field ponding.
- Unknown is not error.
- Case outcome is not automatically canonical knowledge.

## Intentionally not implemented

This sprint adds no image recognition, LLM diagnosis, candidate ranking,
Guidance Intelligence Engine, Chat Investigation Orchestrator, pesticide or
fertilizer selection, rate prescription, threshold population, treatment
recommendation, resistance conclusion, outbreak intelligence, learning-center
promotion, ML training, deployment, release, or publication.

Future Guidance and Chat services can attach by stable User + Field + Season +
Case/Observation identifiers. Step B visual evidence can add an analyzed
evidence type only after a separate governed contract; current photo receipt
continues to mean `PHOTO_RECEIVED != PHOTO_ANALYZED != DIAGNOSIS_CONFIRMED`.
