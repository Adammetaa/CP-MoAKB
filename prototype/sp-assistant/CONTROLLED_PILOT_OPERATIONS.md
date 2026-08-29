# Controlled Pilot Operations

This runtime is a **Controlled Pilot Ready Candidate**. It is not Production Certified, diagnostically or agronomically validated, publicly deployable, or evidence that real Field Validation passed. `REAL_FIELD_VALIDATION` remains `NOT_RUN` until governed work with actual participants and cases is completed under the existing Field Validation Plan.

## Profiles and startup

Use `DEVELOPMENT`, `TEST`, or `CONTROLLED_PILOT` through `PILOT_PROFILE`. The default host is loopback. A non-loopback host requires the operator to set `PILOT_ALLOW_LAN=true` deliberately. Controlled Pilot startup requires `PILOT_AUTH_PASSWORD`; secrets remain server-side and must not be committed, exported, logged, or returned by health/readiness. TLS termination is the host operator's responsibility. Run only one application process against the SQLite database.

Before startup, resolve and protect `PILOT_DB_PATH`, `PILOT_EXPORT_DIR`, and `PILOT_UPLOAD_DIR`. Keep them outside any static-file tree in an operator-controlled directory. Startup refuses unsupported future schemas. A Controlled Pilot migration first makes and verifies a pre-migration SQLite backup, then applies Step J metadata tables in a transaction. A migration error rolls back and stops startup.

Start with `npm start`; stop with the process supervisor's graceful termination. The server persists authority in SQLite/WAL and reconstructs A-I state after restart. `/health` only reports process/runtime health. `/readiness` and authenticated `/api/pilot/readiness` report gate state and never imply scientific, diagnostic, field, or production certification.

## Backup, restore, export, and retention

Use authenticated `POST /api/pilot/verified-backups`. Each server-managed SQLite snapshot is integrity checked. Rehearse with `POST /api/pilot/restore-verifications` and its `backup_file`; the runtime copies it to an isolated server-generated path, checks integrity, schema, and reconstructability, and never overwrites the live database. A backup is not considered restore-verified until this rehearsal passes. Keep copies under operator access control and test recovery before pilot sessions.

`POST /api/pilot/export` emits a deterministic, authenticated-user-only JSON projection; it does not export another user's workspace, credentials, secrets, provider prompts, or operational paths. A complete deletion/retention policy is not yet established. This is declared `PRIVACY_GOVERNANCE_DEBT`; operators must not promise automated deletion and must use documented manual custody until policy approval.

## Security and degraded operation

Sessions use HttpOnly, SameSite=Strict cookies, bounded lifetimes, explicit logout, authentication before pilot APIs, and same-origin checks when browsers send `Origin`. Put TLS and an approved network boundary in front of any authorized LAN exposure. JSON content types, sizes, identifiers, image MIME/byte counts, and server-managed paths are validated. Client errors contain correlation IDs but no stack, secret, database path, or provider payload. Operational audit records use event codes and hashes; raw private case text, image bytes, credentials, and provider content are excluded.

Feature flags can disable Conversation provider, Visual Perception provider, F1, F2, H, or I entry points. Disabled provider features return a bounded unavailable state; deterministic field capture, manual visual evidence, and existing authoritative data remain available. Provider output is never scientific evidence and cannot directly write diagnosis, product/dose, outbreak, canonical Knowledge, training, or regulatory authority.

## Incidents, stops, and rollback

Immediately stop the pilot for cross-user exposure, data loss, history rewrite, scientific/regulatory bypass, provider-authoritative writes, unrecoverable corruption, silent migration failure, lost provenance, automatic Knowledge promotion, or unexpected public exposure. Preserve redacted correlation/audit records, isolate the service, protect the live database and latest verified backup, and do not edit history to hide the incident.

Recovery is forward-only: diagnose against an isolated copy; verify the selected backup; start the last known compatible runtime with that isolated copy; validate schema, integrity, ownership, A-I reconstruction, and readiness; then obtain accountable approval before replacing service custody. Do not use Git reset/rebase/amend as an operational database rollback. Never restore over the live database during a rehearsal.

## Pilot validation and metrics

Reuse `docs/product/spa-mvp-delivery-plan/field-validation-plan.md`. Validation records distinguish automated runtime tests, internal synthetic walkthroughs, and real Field Validation. Feedback is product evidence only: it cannot mutate scientific evidence, canonical Knowledge, rules, or training eligibility. Track workflow completion, blocked/degraded flows, friction, external manual work, provider failures, privacy/safety issues, boundary violations, and time-to-completion. Representative test timings characterize this build only; they are not an SLO, capacity claim, or production benchmark.

Known non-blocking debt is available from `/api/pilot/debt-register`: retention governance, single-process SQLite infrastructure, and real Field Validation. Review all gates before every controlled session and return to the full A-J architecture audit after Step J; do not deploy or begin another implementation sprint automatically.
