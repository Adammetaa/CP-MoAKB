# Controlled Pilot Operations

This runtime is a **Controlled Pilot Ready Candidate**. It is not Production Certified, diagnostically or agronomically validated, publicly deployable, or evidence that real Field Validation passed. `REAL_FIELD_VALIDATION` remains `NOT_RUN` until governed work with actual participants and cases is completed under the existing Field Validation Plan.

## Profiles and startup

Use `DEVELOPMENT`, `TEST`, or `CONTROLLED_PILOT` through `PILOT_PROFILE`. The default host is loopback. A non-loopback host requires the operator to set `PILOT_ALLOW_LAN=true` deliberately. Controlled Pilot startup requires `PILOT_AUTH_PASSWORD`; secrets remain server-side and must not be committed, exported, logged, or returned by health/readiness. TLS termination is the host operator's responsibility. Run only one application process against the SQLite database.

Before startup, resolve and protect `PILOT_DB_PATH`, `PILOT_EXPORT_DIR`, and `PILOT_UPLOAD_DIR`. Keep them outside any static-file tree in an operator-controlled directory. Startup refuses unsupported future schemas and an invalid or missing current-version completion marker. A Controlled Pilot migration first makes and verifies a pre-migration SQLite backup, then coordinates base, lifecycle, and A–J schema initialization in one transaction. The required-component fingerprint and completion marker are written last. Any injected or real subsystem failure rolls back, stops startup, and permits a deterministic retry without claiming completion.

Start with `npm start`; stop with the process supervisor's graceful termination. The server persists authority in SQLite/WAL and reconstructs A-I state after restart. `/health` only reports process/runtime health. `/readiness` and authenticated `/api/pilot/readiness` report gate state and never imply scientific, diagnostic, field, or production certification.

## Backup, restore, export, and retention

Use authenticated `POST /api/pilot/verified-backups`. Each server-managed SQLite snapshot is integrity checked. Rehearse with `POST /api/pilot/restore-verifications` and its `backup_file`; the runtime copies it to an isolated server-generated path, checks integrity, schema, and reconstructability, and never overwrites the live database. A backup is not considered restore-verified until this rehearsal passes. Keep copies under operator access control and test recovery before pilot sessions.

`POST /api/pilot/export` emits a deterministic, authenticated-user-only JSON projection; it does not export another user's workspace, credentials, secrets, provider prompts, or operational paths. A complete deletion/retention policy is not yet established. This is declared `PRIVACY_GOVERNANCE_DEBT`; operators must not promise automated deletion and must use documented manual custody until policy approval.

## Security and degraded operation

Sessions use HttpOnly, SameSite=Strict cookies, bounded lifetimes, explicit logout, authentication before pilot APIs, and same-origin checks when browsers send `Origin`. Put TLS and an approved network boundary in front of any authorized LAN exposure. JSON content types, sizes, identifiers, image MIME/byte counts, and server-managed paths are validated. Client errors contain correlation IDs but no stack, secret, database path, or provider payload. Operational audit records use event codes and hashes; raw private case text, image bytes, credentials, and provider content are excluded.

Feature flags can disable Conversation provider, Visual Perception provider, F1, F2, H, or I entry points. F1 and F2 are `REQUIRED` for the integrated A–J controlled-pilot profile; Conversation, Visual Perception, H, and I are `OPTIONAL`. There are no `OUT_OF_SCOPE` runtime flags in this profile. Configuration is loaded once at startup, audited, and exposed without secrets through the authenticated capability manifest; changing it requires restart. Disabled mutations and fresh computations fail closed and are audited. Existing F1/F2 history remains readable, while manual B1 visual evidence remains available when B2 is disabled. Provider output is never scientific evidence and cannot directly write diagnosis, product/dose, outbreak, canonical Knowledge, training, or regulatory authority.

The declared `CONTROLLED_PILOT_A_J` capability profile is: Field/Lifecycle `REQUIRED`; Capture `REQUIRED`; Investigation `REQUIRED`; Guidance `REQUIRED`; B1 Visual Evidence `REQUIRED`; Conversation Orchestrator `REQUIRED`; external Conversation provider `OPTIONAL`; B2 Visual Perception provider `OPTIONAL`; F1 `REQUIRED`; F2 `REQUIRED`; G Follow-up/Reminder/Timeline `REQUIRED`; H `OPTIONAL`; I `OPTIONAL`. No listed capability is `OUT_OF_SCOPE`. Disabling required F1 or F2 blocks readiness; disabling optional H or I makes readiness conditional with an explicit reason.

The 19 readiness gates are executable current checks, not a percentage score. Every response carries the gate state, reason codes, check type, check time, evidence references, results, blocker state, limitations, runtime model version, schema version, and schema fingerprint. A restore rehearsal only satisfies `BACKUP_RESTORE` when its integrity, schema version, and fingerprint match the active runtime. Missing restore evidence is `CONDITIONAL`; an incomplete migration or active mandatory stop is `BLOCKED`. `REAL_FIELD_VALIDATION` remains `NOT_RUN` until separately performed and accepted.

## Incidents, stops, and rollback

Immediately stop the pilot for cross-user exposure, data loss, history rewrite, scientific/regulatory bypass, provider-authoritative writes, unrecoverable corruption, silent migration failure, lost provenance, automatic Knowledge promotion, or unexpected public exposure. Preserve redacted correlation/audit records, isolate the service, protect the live database and latest verified backup, and do not edit history to hide the incident.

Recovery is forward-only: diagnose against an isolated copy; verify the selected backup; start the last known compatible runtime with that isolated copy; validate schema, integrity, ownership, A-I reconstruction, and readiness; then obtain accountable approval before replacing service custody. Do not use Git reset/rebase/amend as an operational database rollback. Never restore over the live database during a rehearsal.

## Pilot validation and metrics

Reuse `docs/product/spa-mvp-delivery-plan/field-validation-plan.md`. Validation records distinguish automated runtime tests, internal synthetic walkthroughs, and real Field Validation. Feedback is product evidence only: it cannot mutate scientific evidence, canonical Knowledge, rules, or training eligibility. Track workflow completion, blocked/degraded flows, friction, external manual work, provider failures, privacy/safety issues, boundary violations, and time-to-completion. Representative test timings characterize this build only; they are not an SLO, capacity claim, or production benchmark.

Known non-blocking debt is available from `/api/pilot/debt-register`: retention governance, single-process SQLite infrastructure, and real Field Validation. Review all gates before every controlled session and return to the full A-J architecture audit after Step J; do not deploy or begin another implementation sprint automatically.
