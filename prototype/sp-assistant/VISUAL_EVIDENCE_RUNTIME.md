# Governed Visual Evidence Runtime (Step B1)

## Purpose and permanent boundary

Step B1 records what a supplied image can reliably contribute to an Investigation, what is not assessable, and which single view would help next. Its permanent rule is **Image is not Diagnosis**.

The governed flow is:

`capture intent -> server Image Evidence -> quality + observability -> visible-feature proposal -> human review -> Investigation Evidence link -> Step C reassessment`

Upload is not Observation, ground truth, training permission, Candidate support, or Candidate resolution. A perception proposal is not human confirmation, and human confirmation is still not Diagnosis.

## Image Evidence object and storage

`ImageEvidence` retains a stable ID, authenticated User/Field/CropSeason scope, optional Case/Observation/Guidance/Sampling/CaptureSession/site references, capture and receipt times, source, capture intent, plant-part and spatial scope, view type, media metadata, dimensions/orientation, server-computed SHA-256 content hash, status, VE maturity, comparison identity/role, runtime/provider provenance, and ground-truth/learning state.

SQLite stores metadata, assessments, feature proposals, reviews, links, and duplicate capture events. Binary files remain in the existing server upload directory and are never copied into scientific `investigation_evidence` rows. API responses expose `SERVER_MANAGED`, not the filesystem storage key.

An exact binary duplicate in the same authorized User/Field/Season scope reuses the Image Evidence identity and records a capture event with `scientific_amplification=false`.

## Capture intent and views

Capture intents include general context, whole plant/hill, leaf/sheath/stem base/root/panicle, organism/damage/lesion detail, affected-versus-normal, water context, and other. Intent records why the image was captured; it is not interpretation.

Governed views include field/patch context, whole plant/hill, plant-part context, detail/macro, affected sample, normal comparison, affected-versus-normal pair, and root comparison. A runtime request selects one appropriate view; it never requires every view.

Context and detail images can share a CaptureSession while retaining separate identities and feature observations. Session membership never implies identical symptoms.

## Quality versus observability

Quality dimensions are `FOCUS`, `EXPOSURE`, `MOTION_BLUR`, `OCCLUSION`, `SUBJECT_SIZE`, `FRAMING`, `RESOLUTION`, `COLOR_RELIABILITY`, and `DEPTH_OF_FIELD`. Values are categorical: `GOOD`, `ACCEPTABLE`, `LIMITED`, `UNUSABLE`, or `UNKNOWN`. There is no aggregate score.

Observability separately records whether a target is `ASSESSABLE`, `PARTIALLY_ASSESSABLE`, `NOT_ASSESSABLE`, `NOT_IN_VIEW`, `OBSCURED`, `INSUFFICIENT_SCALE`, or `UNKNOWN`. A technically good canopy image can therefore leave `ROOT_CONDITION` not assessable. Not visible is not absent.

## Visible features and vocabulary

Visible features are limited to the existing governed Investigation phenotype vocabulary. Unsupported proposed terms produce `VISUAL_VOCABULARY_GAP`; the runtime does not invent scientific vocabulary.

Feature states are `OBSERVED`, `NOT_OBSERVED`, `SEARCHED_NOT_FOUND`, `EXPECTED_FEATURE_ABSENT`, `NOT_ASSESSABLE`, and `UNKNOWN`. `NOT_OBSERVED` is not automatically negative evidence. `SEARCHED_NOT_FOUND` requires an assessable, appropriate view and an explicit review basis.

A visible count retains target, manual method, image identity, and `IMAGE_FRAME_ONLY` basis. It is never converted into population density, field incidence, severity, or an economic threshold without separate Sampling Evidence.

## VE maturity and review lifecycle

Visual maturity is categorical provenance, not Candidate confidence:

- `VE0_RAW_IMAGE_ONLY`;
- `VE1_QUALITY_AND_CONTEXT_ESTABLISHED`;
- `VE2_VISIBLE_FEATURE_PROPOSED`;
- `VE3_HUMAN_REVIEWED_VISIBLE_FEATURE`;
- `VE4_FIELD_LINKED_REVIEWED_VISUAL_EVIDENCE`.

Review actions are `CONFIRM_FEATURE`, `CORRECT_FEATURE`, `REJECT_FEATURE`, `MARK_NOT_ASSESSABLE`, `REQUEST_BETTER_VIEW`, `LINK_TO_OBSERVATION`, and `MARK_UNRESOLVED`. Every review retains reviewer, revision, timestamp, reason, prior value, current value, and the original proposal. Corrections never overwrite the proposal.

Only a human-reviewed feature can be linked into the authoritative Investigation Backbone. The link creates a reviewed `MORPHOLOGY_EVIDENCE` record referencing the Image Evidence ID. Raw images and unreviewed proposals stay outside the Step C bundle, so they cannot change Candidate state. A reviewed link changes the authoritative bundle hash and uses the existing Step C invalidation path.

## Affected versus normal and scale limits

Comparison roles are `AFFECTED`, `NORMAL_COMPARISON`, and `UNKNOWN_ROLE`. A non-unknown role requires `USER_PROVIDED` or `HUMAN_REVIEWED` authority; visual appearance never assigns “normal.” Pair and CaptureSession identities are preserved.

Each image retains sampled-object/spatial scope. A detail image can support a feature on that sampled object, not a whole-field claim. Multiple images remain distinct observations even when grouped.

## Step D integration and next visual request

B1 consumes the current Step D item without changing its scientific reason. A `ROOT_COMPARISON` Guidance item becomes one capture request for an affected root sample and a nearby user-confirmed normal comparison at comparable scale. The request carries target, intent, view, why, where, how, Guidance/Assessment/gap references, reused backend context, and a completion condition.

Known crop, field, season, stage, yellowing, patch, low spot, water, and management context are not requested again. A wrong whole-canopy photo remains valid Image Evidence but leaves root condition `NOT_IN_VIEW`/`NOT_ASSESSABLE`, causing one better root request—not a false “normal roots” conclusion.

Visual stop results are `NO_MORE_VISUAL_EVIDENCE_NEEDED`, `VISUAL_EVIDENCE_NOT_USEFUL_FOR_CURRENT_GAP`, `FIELD_CHECK_REQUIRED_INSTEAD`, `COUNT_REQUIRED_INSTEAD`, `MEASUREMENT_REQUIRED_INSTEAD`, `EXPERT_REVIEW_REQUIRED`, and `LAB_EVIDENCE_REQUIRED`. A non-photographic gap stops the photo loop.

## Provenance, ownership, and learning gate

Provenance retains image hash/source/intent/view, runtime and vocabulary versions, optional perception-provider identity/version, quality assessment version, reviewer/revision, Investigation-link revision, and timestamps. All reads and writes inherit authenticated User/Field/CropSeason ownership; optional Case, Observation, Guidance, Sampling, and CaptureSession references must remain in scope.

Ground-truth states remain separate: `RAW_IMAGE -> VISUAL_OBSERVATION -> HUMAN_REVIEW -> FIELD_CONFIRMATION -> GOVERNANCE_REVIEW -> APPROVED_REFERENCE -> TRAINING_ELIGIBLE`. B1 stops at field confirmation. Default uploads remain `CASE_ONLY`, `training_eligible=false`; there is no automatic learning or promotion.

## Perception provider boundary and APIs

`VisualPerceptionProvider` is a future adapter boundary. Production B1 uses no automated perception and performs no network call. `TEST_ONLY_VISUAL_PERCEPTION_PROVIDER` is available only through an explicit test factory and cannot load normally.

Authenticated routes are:

- `POST/GET /api/pilot/visual-evidence`;
- `GET /api/pilot/visual-evidence-bundle`;
- `POST /api/pilot/visual-evidence-assessments` for explicit structured input;
- `POST /api/pilot/visual-evidence-reviews`;
- `GET /api/pilot/visual-evidence-request`.

## Explicit non-goals

No OpenAI Vision, LLM reasoning, chat orchestration, natural-language extraction, disease/pest classifier, raw-image Candidate nomination, Diagnosis, probability, numerical confidence, Management Options, chemical/active ingredient/product/rate, resistance conclusion, reminder, notification, cross-field pattern, automatic learning, model training, deployment, release, or publication is implemented.
