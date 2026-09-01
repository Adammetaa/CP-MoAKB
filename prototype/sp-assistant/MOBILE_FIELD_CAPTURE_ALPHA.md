# Mobile Field Capture Alpha

`FIELD_CAPTURE_ALPHA` is a capture-only startup profile for authenticated mobile field work. Its primary flow is Login → Field/Season → Chat → governed structured capture → current gap or one next question.

## Authority boundary

The server remains authoritative for User, Field, CropSeason, Case, Conversation, raw turns, structured facts, B1 visual evidence, assessments, guidance, follow-up state, and correction lineage. Browser storage is compatibility presentation state only. OpenAI may interpret language and help phrase one bounded question; it cannot create a diagnosis, candidate resolution, management option, chemical/product/rate/dose advice, drone parameters, resistance conclusion, regulatory authority, Evidence, Learning Candidate, or Canonical Knowledge.

The alpha profile enables conversation capture and B1 visual evidence. B2 is optional and must fail back to human-reviewable B1. F1, F2, Step H, and Step I routes are disabled by startup capability controls. The existing Controlled Pilot profile remains unchanged for authorized A–J/Round-0 testing.

## Network and identity configuration

Configure `PILOT_PROFILE=FIELD_CAPTURE_ALPHA` and at least three enabled identities in `PILOT_USERS_JSON`. For LAN binding, explicitly set `PILOT_HOST`, `PILOT_ALLOW_LAN=true`, and `PILOT_PUBLIC_BASE_URL`. Any non-loopback public base URL must be HTTPS; the server then marks session cookies `Secure`. TLS termination remains an operator responsibility. Startup health and capability responses report mode, binding, public base URL, and secure-cookie state without exposing credentials.

## Capture behavior

Each turn retains the raw message, validated interpretation, minimum governed context, response, timestamp, and provider manifest. Explicit facts are written through the investigation capture adapter. Known facts are reused, and a response contains at most one question. “ไม่รู้”, “ไม่ได้ดู”, “จำไม่ได้”, “ไม่มีรูป”, and “ไว้ดูทีหลัง” are stored as bounded unresolved learning signals and do not trigger a questioning loop.

Natural corrections append a new turn, point to the corrected turn, retain the original raw turn, mark the earlier structured evidence `SUPERSEDED`, capture any newly explicit fact, and recompute the current assessment/guidance package.

Learning Signals are protected operational review inputs only. The ten classes are `UNANSWERED_QUESTION`, `INTERPRETATION_GAP`, `MISSING_EVIDENCE`, `USER_CORRECTION`, `FAILED_CONTROL_REPORT_CANDIDATE`, `PRODUCT_QUESTION`, `ACTIVE_INGREDIENT_QUESTION`, `MISSING_CANDIDATE`, `MISSING_MANAGEMENT_RELATIONSHIP`, and `USEFUL_COMPLETED_CASE`. A signal is never Evidence, a Learning Candidate, Canonical Knowledge, or an automatic promotion.

## Limitations

- Single-process SQLite remains the supported runtime topology.
- No public deployment is created by this sprint.
- Real field validation, diagnostic accuracy validation, scientific validation, and production readiness are not claimed.
- Retention policy and operational TLS installation remain controlled-pilot operator work.
