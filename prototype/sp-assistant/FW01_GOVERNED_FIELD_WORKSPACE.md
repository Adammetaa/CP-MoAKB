# FW01 governed Field Workspace

## Architecture reuse map

| FW01 concept | Authority used | Change / rejected duplicate |
| --- | --- | --- |
| Field and Crop Season | `lifecycle_fields`, `crop_seasons`, stage assessments | Reused; no second Field or season authority. |
| Inspection and User Report | `FIELD_INSPECTION` governed conversation, immutable raw turn, `investigation_observations` | Reused; report creates only an unreviewed proposal, not a finding. No report-truth table. |
| Evidence and images | `investigation_evidence`, private user attachments, B1 visual evidence and B2 perception | Reused existing quality/review gates; upload alone cannot confirm a finding. |
| Investigation Thread and Case | `investigation_cases`, governed conversation and Step C/D assessments | Reused one open Case where unambiguous; multiple Cases require an explicit choice. No second thread/Case authority. |
| Evidence action | Existing Step D/B1 next-action outputs | Extended response with one ephemeral primary action; no action table or user-facing checklist. |
| Observation confirmation | `investigation_observations` with review state | New `governed_observation_review_events` is required because generic caller-set review state lacked review authority and evidence trace. |
| Split and merge | Existing Cases | New `governed_case_lineage_events` records explicit links only; neither Case nor evidence is moved or deleted. |
| Field History | Existing governed records | New read-only projection of controlled confirmed/corrected Observations, recorded activities, and governed follow-up plans; raw reports stay in conversation/audit provenance. |
| Assignment and review scope | Pilot identity and ownership checks | New scoped, revocable `governed_access_grants` plus legacy triage tables; no role-only SPA global view or reviewer attachment bypass. |
| Context conflict | Existing stage assessment plus conversation | New `governed_context_conflicts` because a reported stage disagreement must persist without overwriting authoritative crop context. |

## Field flow and authority

The Field Detail keeps current identity and crop context first, then latest controlled findings, open Cases, and a resume or inspection action. A user report is stored verbatim in its governed conversation turn. Step C/D and B1 may suggest the next evidence request, but the system exposes one action at a time. An unreviewed Observation remains an investigation proposal. An authorized Case reviewer may confirm, contradict, mark insufficient evidence, or correct it, recording the evidence references, reviewer, reason and time. A correction creates a new reviewed Observation and supersedes the old proposal without erasing the original wording. Confirmed history is a server projection, not a rewrite of the conversation.

Operational Field/Case assignment and scientific Case review are separate capabilities. Only an Admin or explicitly configured `REVIEW_COORDINATE` capability grants or revokes scoped access. Grants record subject, capability, scope, actor, time and reason; revocation retains that row and immediately denies access. `FIELD_OPERATE` does not confer `CASE_REVIEW`. A Case review grant does not reveal unrelated Fields or attachments. A Review Item grant does not grant private Case attachment download. All scoped grants must remain within the tenant defined by the private pilot credential (`tenant_id`; otherwise the explicit single-pilot default). Newly created records do not inherit scientific review from an SPA role. Legacy unassigned open Cases and review items are available only to Admin/coordinator triage, never to every SPA. Pilot operators must configure distinct Admin/coordinator credentials before assignment workflows are used.

## OpenAI contracts and fallback

Pass 1 uses the existing governed conversation provider to interpret Thai language into a bounded proposal. The original wording is retained, and backend schema, scope, and state validation—not the provider—control writes. If Pass 1 is unavailable, deterministic capture continues; high-stakes Decision/Action/Follow-up chat transitions are suppressed rather than guessed.

Between passes, the backend builds a scoped context, checks stage conflicts, invokes existing investigation and visual evidence rules, and locks a structured response plan. Pass 2 may choose only a short transition from a strict allowlist. The final guard rejects extra fields or unsupported wording and appends the backend-locked text and single requested action. Failed or unsafe composition returns the deterministic response. The model cannot alter facts, diagnosis authority, management eligibility, measurements, or persistence.

An explicit reported stage differing from stored stage is recorded as an unresolved context conflict and requests clarification; the crop-season assessment is not silently changed. Existing Step C/D/B1 rules remain the evidence planner and quality authority. An inadequate image remains in provenance but does not become usable evidence merely because it uploaded; the same evidence need remains until the governed visual review accepts it.

## Persistence, security, and limits

Schema version 15 adds only access grants, legacy triage, Observation review audit, Case lineage, and context-conflict records. Existing Field, Case, Observation, evidence, conversation, follow-up, and outcome records are preserved. Migration classifies unresolved legacy records without guessing an SPA assignment. Private attachment MIME/signature/path/integrity checks remain in force, and read authorization is now scoped. Field History deliberately excludes pre-FW01 caller-set `HUMAN_REVIEWED` Observations lacking a controlled review event, as well as unreviewed/rejected reports.

Limitations: this sprint does not scientifically validate candidate diagnoses, infer causality, approve treatment, or promote knowledge. Case split/merge is lineage-only and does not re-parent records. Stage conflict resolution still requires a separate authorized field-context update after human verification. F2 outcome observations do not enter confirmed Field History solely because a caller supplied an evidence-state label; the existing Case timeline retains their provenance until an independently governed outcome review authority is available. New public deployment and real-field validation are not part of FW01.
