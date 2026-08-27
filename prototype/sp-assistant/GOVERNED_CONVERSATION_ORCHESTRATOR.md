# Governed Conversation Orchestrator (Step E)

## Purpose and product boundary

Step E turns natural Thai field conversation into a small, validated set of server actions without making Chat the whole product. Home, Field, Field Inspection, Case, Guidance, visual capture/review, and Knowledge remain first-class product surfaces. The Field Inspection workflow remains usable when conversation intelligence or its network provider is disabled.

The permanent authority split is:

- Conversation and OpenAI may interpret language and propose a structured interpretation.
- The CP-MoAKB server owns identity, memory, validation, capture, scientific assessment, guidance, and visual workflow state.
- Conversation is not Evidence. Raw messages are immutable audit records but do not enter the Investigation Bundle.
- An LLM is not scientific authority. It cannot set a Candidate, diagnosis, probability, support state, management choice, pesticide, product, dose, or rate.
- Step C remains the only Investigation assessment service. Step D remains the only governed field-guidance service. Step B1/B2 remain the visual evidence and perception services.

Step E does not implement management intelligence (Step F), automatic learning or promotion (Step I), diagnosis, treatment selection, product recommendation, or a redesigned chat-first UI.

## Runtime flow

Each meaningful turn follows a two-stage execution boundary:

1. Resolve the user's server-owned context and build a minimum authoritative context package.
2. Interpret the current message locally and, only when configured, with a server-side structured conversation provider.
3. Validate every proposed fact against the closed Step A vocabulary and an exact source span in the current message.
4. Execute only server-approved operations through the existing Investigation Backbone, Step C, Step D, B1, and B2 services.
5. Compose one concise Thai response, one best user action, and at most one clarification question.
6. Append the immutable turn, interpretation, context snapshot, governed references, provider manifest, and response to server storage.

Provider output never executes directly. Malformed output, unsupported vocabulary, forbidden keys, provider timeout, and provider unavailability fail closed before scientific writes.

## Server memory versus provider memory

`governed_conversations` is the server-owned resumable conversation index. It records the current Field, CropSeason, optional Case, entry point, context hash, and optimistic revision.

`governed_conversation_turns` is append-only. Each row keeps a stable turn ID, user-scoped idempotency request ID, immutable raw message, optional correction reference, validated interpretation, authoritative context snapshot, output, provider manifest, and timestamp. Corrections create a new turn and point to the prior turn; they do not rewrite history.

Provider memory is never authoritative and is not required. Every meaningful turn is rebuilt from server state. Browser-local legacy conversations can still support display compatibility, but they are not used as governed conversation memory or Evidence. The list, history, and context endpoints allow another device to resume the same server conversation.

## Context resolution

Context is resolved in this order:

1. explicit UI Field, CropSeason, and Case;
2. an explicit reference supplied by the UI;
3. route context;
4. the existing governed conversation;
5. one unique active Field and CropSeason, plus one unique open Case where needed.

The server validates ownership at every layer. A conversation cannot silently cross Fields. If more than one active Field or relevant open Case remains, Step E asks one concise selection question and performs no scientific write. “แปลงเดิม” reuses the governed conversation context; it does not trigger a foundational interview when that context is unique.

General Knowledge, navigation, and social turns from `GENERAL_CHAT` may remain deliberately unscoped. They do not become field findings.

## Authoritative Context Package

The package is versioned and hashed. It contains only the minimum relevant data:

- Field, CropSeason, Case, Observation, Guidance, and Image references;
- crop profile and authoritative stage with provenance and versions;
- compact Investigation record references and reviewed states;
- the current Step C assessment reference, sufficiency, next-best evidence, stop condition, bundle hash, and rule versions;
- the current non-superseded Step D guidance and its context hash;
- the active B1 visual request and the selected image/latest B2 result;
- explicit boundaries and runtime constraints.

The provider receives an even smaller projection: identity references, entry point, crop/stage, known evidence types, current stop condition, active visual target, and context hash. Unrelated Fields, unrelated Case history, display names, phone data, full management history, raw binary image data, secrets, and browser-local state are excluded.

The package is rebuilt on each meaningful turn and by the context-resume endpoint. Evidence, assessment, guidance, stage, Case, or reviewed visual changes therefore produce a new context hash and conversation revision. Superseded guidance is never selected as current guidance.

## Ask-the-system-first behavior

Before asking the user, Step E checks server lifecycle, Investigation Bundle, Step C assessment, Step D guidance, B1 request, B2 history, and prior governed conversation context. Existing Field, season, stage, management, evidence, assessment, guidance, and visual-target facts are not requested again. Unknown remains a valid state. Step E never emits a checklist or questionnaire and never asks more than one question per turn.

## Intent and fact extraction

The closed intent set is `FIELD_OBSERVATION`, `FIELD_STATUS_UPDATE`, `QUESTION`, `VISUAL_CHECK`, `GUIDANCE_RESPONSE`, `CASE_FOLLOW_UP`, `CONTEXT_SELECTION`, `USER_HYPOTHESIS`, `MANAGEMENT_QUERY`, `KNOWLEDGE_QUERY`, `NAVIGATION_REQUEST`, and `SOCIAL_OR_OTHER`.

Each proposed fact has `EXPLICIT`, `AMBIGUOUS`, or `UNSUPPORTED_INFERENCE` status, an immutable message ID/turn ID, exact source span, governed mapping, provider/version provenance, and timestamp through the turn record. Only `EXPLICIT` facts are eligible for capture.

The governed Thai phrase map covers the Step E golden evidence dimensions:

- “เหลือง” maps to Morphology `YELLOWING`;
- “เป็นหย่อม” maps to spatial pattern `PATCH`;
- “จุดต่ำ” maps to field position `LOW_SPOT`;
- “น้ำลึกกว่าข้างๆ” maps to the explicit comparative fact `DEEPER_WATER_CONTEXT` and the existing governed `WATER_CONTEXT.water_state=UNEVEN_WATER` representation.

“ข้าวดูไม่ดี” does not imply yellowing. Vocabulary gaps and unsupported mappings stay non-captured. Step E does not create vocabulary dynamically.

## One answer, multiple governed evidence records

One user answer can produce one governed Observation plus several typed evidence records. For example, the E1 sentence produces Morphology, Spatial, and Water evidence under one Observation and Case. Every write uses stable action request IDs and the existing Investigation Backbone idempotency, ownership, revision, conflict, and bundle reload behavior. Step E never writes arbitrary scientific tables directly.

Raw conversation remains non-evidence. The output separately lists exact fact-to-record references so reviewers can audit which source span produced which governed record.

## User hypotheses

Phrases such as “น่าจะโรคไหม้” are retained as a `USER_HYPOTHESIS` authored Candidate with `OPEN` support state. They do not create Morphology, do not create a supporting evidence link, and do not become a diagnosis. Step C independently evaluates the authoritative bundle and may leave the hypothesis insufficient or unresolved.

## Step C and Step D integration

After a successful explicit capture, Step E reloads the authoritative Investigation Bundle through Step C and asks Step D for current guidance. It consumes the returned assessment and guidance; it does not reimplement scoring, Candidate comparison, sufficiency, stop conditions, or next-best-evidence selection.

Candidate language remains provisional and contains no percentage. Step D output is translated into concise friendly Thai for SP users. Raw enums and the full context package are available only in a separate SPA technical-detail object.

`NO_ADDITIONAL_INSPECTION`, user-declined, enough-for-current-decision, and resolved states produce no new question. Expert and laboratory stop states produce one clear handoff. Workflow completion is not treated as scientific truth, a diagnosis, Case resolution, or a field action.

## B1/B2 integration

An image turn validates B1 ownership and reuses the active visual target. “ถ่ายแบบนี้ได้ไหม” therefore does not ask the user to restate the target. Step E invokes B2 only on an explicit image/visual-check turn. B2 visible-feature output is presented as a proposal for one concise human confirm/correct action and cannot become Investigation Evidence before B1 review and linking.

If B2 fails, the response says the image was stored and automatic reading is unavailable. It never says “nothing was found.” A governed better-view result produces at most one better-photo request. Field-check, count, measurement, expert, lab, no-more-visual, user-declined, and resolved stop conditions end the photo loop.

## Response and action contract

Every successful or safe-failure turn returns:

- turn, conversation, revision, and resolved context references;
- intent and explicit facts with source spans;
- fact/hypothesis record references and execution audit actions;
- exactly one user-facing governed action;
- Step C, Step D, and visual references;
- one response type, Thai text, optional single question, and one UI action;
- limitations, authority declarations, provider manifest, output version, and timestamp.

The response type and UI-action vocabularies are closed in `CONVERSATION_ENUMS`. SP responses hide raw enums. SPA technical detail is separate and does not change authority.

## Provider and secret boundary

`CONVERSATION_PROVIDER=DISABLED` is the safe default. The deterministic governed phrase interpreter continues to support explicit capture without a network call. `CONVERSATION_PROVIDER=OPENAI` enables the server-only Responses adapter with strict JSON Schema, `store:false`, a configured timeout, and a server-held `OPENAI_API_KEY`. `OPENAI_CONVERSATION_MODEL` and `CONVERSATION_TIMEOUT_MS` are optional.

The OpenAI adapter performs conversation interpretation only. It receives minimum context, cannot receive or return actions or scientific decisions, and has no memory authority. Test-only providers require the explicit test factory and cannot be loaded through production configuration.

## Failure and degraded mode

Provider unavailable, timeout, malformed output, policy rejection, and unsupported vocabulary return a safe `SYSTEM_LIMITATION`/`CONVERSATION_UNAVAILABLE` turn with no interpreted scientific write. Existing Field, Field Inspection, Case, Guidance, visual capture/review, and Knowledge services continue to work. The old `/api/assistant/chat` field endpoint returns `410 MIGRATION_REQUIRED` so legacy free-form generation cannot bypass Step E.

Core endpoints are:

- `POST /api/pilot/conversation-turns` — idempotent governed turn;
- `GET /api/pilot/conversations` — server-owned resumable conversation list;
- `GET /api/pilot/conversation-history?conversation_id=...` — append-only audit history;
- `GET /api/pilot/conversation-context?conversation_id=...` — rebuild current authoritative context.

All endpoints require the existing authenticated pilot session and enforce user, Field, CropSeason, Case, Guidance, and Image ownership.

## Legacy transition and UI preservation

The browser adapter now calls the governed endpoint and discovers an existing active server conversation for the selected Field/CropSeason before creating another. The existing visual layout and Field/Inspection navigation are preserved. Browser messages remain a compatibility projection for the current UI; server conversation memory is authoritative for resume and audit.

The normal app continues to have one runtime owner and no legacy workspace. `legacy.html` remains an isolated compatibility surface and cannot invoke authoritative field conversation through the retired free-form endpoint.

## Non-goals

Step E intentionally leaves untouched: management recommendation and chemical selection, product/rate advice, autonomous diagnosis, autonomous Case resolution, provider-managed memory, automatic image upload analysis, auto-confirmation of B2 proposals, cross-field aggregation, cross-layer learning, vocabulary invention, automatic knowledge promotion, notifications, deployment, release, and production data migration.
