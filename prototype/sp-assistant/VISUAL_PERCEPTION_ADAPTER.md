# Governed Visual Perception Adapter (Step B2)

## Purpose and authority boundary

Step B2 answers one bounded question: **what is visibly observable in this Image Evidence?** It does not answer what disease, pest, causal agent, treatment, product, rate, resistance state, or Candidate state applies.

The permanent authority chain is:

```text
Image Evidence
  -> explicit Perception Request
  -> provider proposal
  -> schema, vocabulary, scope, and policy validation
  -> VE2 visible-feature proposal
  -> explicit Human Review
  -> VE3 reviewed visible feature
  -> explicit B1 Investigation link
  -> VE4 field-linked reviewed visual Evidence
  -> Step C reassessment
```

Model proposal is not Human Review. Human Review is not Investigation Evidence. Investigation Evidence is not Diagnosis. Raw provider output never enters Step C.

## B1 versus B2 responsibility

Step B1 owns Image Evidence identity, capture metadata, quality/observability semantics, visible-feature records, human review, VE maturity, Investigation linking, and the one-at-a-time visual request. Step B2 owns explicit provider invocation, provider abstraction, minimum-context assembly, structured proposal validation, immutable provider results, failure handling, idempotency, and diagnostics.

Upload never invokes network perception automatically. B2 runs only through an explicit governed `requestVisualPerception` call or its authenticated API. The legacy receipt-only upload path remains `NOT_ANALYZED`.

## Provider interface and types

`VisualPerceptionProvider.analyzeImage(...)` receives server-owned Image Evidence identity, the requested visual target, minimum necessary authoritative capture context, the allowed visual vocabulary and version, and—only for a network adapter—the server-loaded image bytes. The application and scientific runtimes do not depend on a model vendor.

Provider identity types are:

- `TEST_ONLY_VISUAL_PERCEPTION_PROVIDER`, constructible only through the explicit deterministic test factory;
- `MANUAL_STRUCTURED_PROVIDER`, which accepts an explicit structured proposal and performs no network call;
- `NETWORK_MULTIMODAL_PROVIDER`, implemented by the optional server-side OpenAI Responses adapter; and
- `NO_PROVIDER`, the safe default.

The network adapter is selected only when `VISUAL_PERCEPTION_PROVIDER=OPENAI`. It reuses the server-side `OPENAI_API_KEY` convention and accepts `OPENAI_VISUAL_MODEL`, `VISUAL_PERCEPTION_TIMEOUT_MS`, and `VISUAL_PERCEPTION_MAX_IMAGE_BYTES`. It sends `store:false`, uses a strict JSON Schema, enforces JPEG/PNG/WebP and size limits, applies a timeout, and never returns the API key. `VISUAL_PERCEPTION_PROVIDER=MANUAL_STRUCTURED` selects the non-network provider. Missing or disabled configuration fails safely.

## Structured proposal contract

An accepted result retains image, provider, provider-version, request, target, vocabulary, and result identities; categorical quality proposals; categorical observability proposals; governed visible-feature proposals; limitations; an opaque provider response reference; provider and acceptance timestamps; hashes; outcome; and explicit non-authority flags.

Quality entries use governed dimensions and `GOOD`, `ACCEPTABLE`, `LIMITED`, `UNUSABLE`, or `UNKNOWN`. Observability separately uses `ASSESSABLE`, `PARTIALLY_ASSESSABLE`, `NOT_ASSESSABLE`, `NOT_IN_VIEW`, `OBSCURED`, `INSUFFICIENT_SCALE`, or `UNKNOWN`. A good canopy image may therefore leave `ROOT_CONDITION` not in view.

Provider feature states are limited to `OBSERVED`, `NOT_OBSERVED`, `NOT_ASSESSABLE`, and `UNKNOWN`. The provider cannot emit `SEARCHED_NOT_FOUND` or `EXPECTED_FEATURE_ABSENT`. `NOT_OBSERVED` remains a proposal and is never promoted automatically to absence. Features require matching observability, governed plant-part and object scope, and a spatial scope no broader than the B1 image. Counts are always `IMAGE_FRAME_ONLY`.

## Allowed and forbidden outputs

Only current Investigation phenotype vocabulary concepts are accepted. An unsupported concept fails with `VOCABULARY_VALIDATION_FAILED` and an explicit `VISUAL_VOCABULARY_GAP`; vocabulary is never expanded silently.

Strict recursive validation rejects Diagnosis, probability or numeric confidence, Candidate or Candidate state, causal claims, disease certainty, pest certainty, treatment, pesticide class, fertilizer recommendation, active ingredient, product, dose/rate, resistance, economic-threshold decision, and field-wide severity/prevalence. Prohibited fields or statements fail closed as `PROVIDER_POLICY_REJECTION`. Free prose cannot bypass the structured contract.

## Candidate-blind and minimum-context behavior

The default provider context contains only crop, requested target/plant part, captured view, capture intent, affected/normal role and its B1 source, and image spatial scope. It excludes user name, phone, unrelated history, purchasing history, management history, and active Candidate names. Nested prohibited context is rejected before provider invocation.

Affected and `NORMAL_COMPARISON` roles remain B1 user/human metadata. A provider may preserve and describe scoped visible differences; it cannot assign or change which sample is normal.

Known backend facts are reused. Given an active B1 `ROOT_COMPARISON` request, the caller can omit `requested_target`; B2 resolves it from Step D/B1. The user is not asked to repeat crop, stage, phenotype, patch, field position, water, variety, age, or management context. This supports a future “ถ่ายแบบนี้ได้ไหม” orchestrator response without implementing chat or questionnaires.

## Request lifecycle, immutability, and idempotency

Requests support `QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, `REJECTED`, and `SUPERSEDED`. Each stores request/image/provider identity, provider and vocabulary versions, requested target, input-context hash, reuse key, lifecycle timestamps, failure category, and result identity. Provider results are inserted once and never overwritten. A changed provider version, context, target, or vocabulary version creates a new request/result revision while history retains prior output.

The reuse key covers image content hash, provider identity/version, requested target, minimum-context hash, and visual-vocabulary version. An identical successful request returns the existing result without another network invocation. Images are never sent to a network provider merely because they were uploaded.

## Failure handling and stop conditions

Failure categories are `NETWORK_TIMEOUT`, `NETWORK_UNAVAILABLE`, `AUTH_CONFIGURATION_ERROR`, `UNSUPPORTED_MEDIA`, `IMAGE_TOO_LARGE`, `MALFORMED_PROVIDER_OUTPUT`, `SCHEMA_VALIDATION_FAILED`, `VOCABULARY_VALIDATION_FAILED`, `PROVIDER_POLICY_REJECTION`, and `UNKNOWN_PROVIDER_ERROR`.

A provider failure returns `PERCEPTION_UNAVAILABLE`. It does not delete or change Image Evidence, create negative Evidence, change Candidate state, invalidate Guidance, resolve an Investigation, or create training eligibility. Retry remains explicit.

Successful outcomes are `PERCEPTION_COMPLETE`, `BETTER_VIEW_REQUIRED`, `TARGET_NOT_VISUALLY_ASSESSABLE`, `FIELD_CHECK_REQUIRED`, `COUNT_REQUIRED`, `MEASUREMENT_REQUIRED`, `EXPERT_REVIEW_REQUIRED`, and `LAB_EVIDENCE_REQUIRED`. A wrong or blurry image produces one better-view action rather than a checklist. A further unusable view stops the loop as not visually assessable.

## Human review, Step C, and Step D

Validated provider proposals enter B1 only at `VE2_VISIBLE_FEATURE_PROPOSED`, retaining provider provenance. `CONFIRM_FEATURE`, `CORRECT_FEATURE`, `REJECT_FEATURE`, `MARK_NOT_ASSESSABLE`, `REQUEST_BETTER_VIEW`, and `MARK_UNRESOLVED` remain explicit human actions. Corrections retain the immutable original proposal and do not train the provider.

Only confirmed/corrected B1 evidence can be explicitly linked into the Investigation Backbone. That reviewed link—not the provider result—changes the authoritative bundle hash and triggers Step C reassessment. Step D remains the source of the active requested target and of non-visual stop conditions.

## Authenticated API and diagnostics

- `POST /api/pilot/visual-perception` explicitly requests analysis;
- `GET /api/pilot/visual-perception?analysis_request_id=...` reads one scoped request/result;
- `GET /api/pilot/visual-perception-history?image_evidence_id=...` reads immutable history; and
- `GET /api/pilot/visual-perception-health` exposes provider ID/type/version, availability, vocabulary version, last invocation state, request counts, and error category without secrets.

All routes require the pilot session and validate Image Evidence ownership. The browser never receives or calls with an OpenAI API key.

## Explicit non-goals

No chat, questionnaire, Step E orchestration, Diagnosis, disease classifier, causal-agent classifier, automatic pest identity as field truth, Candidate generation/ranking/state change, probability, numeric confidence, field-wide inference, Management Option, treatment, chemical/active ingredient/product/dose/rate, resistance conclusion, economic-threshold decision, reminder, cross-field pattern, knowledge promotion, automatic learning, model training, deployment, release, publication, or billing logic is implemented.
