# HTTPS Mobile Pilot Operations

Status: hosting-ready configuration, not deployed. This is not production readiness, scientific validation, diagnostic-accuracy validation, or evidence that `REAL_FIELD_VALIDATION` passed.

## Architecture and startup

Run exactly one Node SP Assistant process behind Render-managed HTTPS. `render.yaml` fixes `numInstances: 1`, `WEB_CONCURRENCY=1`, `autoDeploy: false`, and a paid persistent disk. Render does not permit a disk-backed service to scale beyond one instance; do not remove the disk, enable autoscaling, create another writable service, or run a second process against this SQLite file. Keep SQLite, exports/backups, and uploads on the same protected persistent volume, outside the static application directory. The deployment manifest uses `/var/data/pilot.sqlite`, `/var/data/exports`, and `/var/data/uploads`; none is served as a public directory. This limitation is accepted only for the controlled 3–5 user pilot and is not a production-scale concurrency claim.

Set the variables in `pilot-mobile.env.example` through the host secret/environment manager. On Render, do not enter `PILOT_PUBLIC_BASE_URL` manually: the Blueprint self-references `RENDER_EXTERNAL_URL`, so it receives the exact assigned root HTTPS origin during service creation. `PILOT_USERS_JSON` must contain at least three enabled, server-owned credentials, including a bounded SPA reviewer and two distinct Field users. Replace every applicable placeholder; never commit the populated values. Keep F1, F2, Step H, and Step I disabled through the `FIELD_CAPTURE_ALPHA` profile.

Classify deployment configuration as follows. `OPENAI_API_KEY` and populated `PILOT_USERS_JSON` are **SECRET** and server-only. `GOOGLE_MAPS_BROWSER_KEY` is **PUBLIC CONFIG** delivered only to authenticated browsers and must be HTTP-referrer/API restricted. `PILOT_PROFILE`, `PILOT_PUBLIC_BASE_URL`, `PILOT_HOST`, `PILOT_ALLOW_LAN`, `WEB_CONCURRENCY`, `PILOT_DB_PATH`, `PILOT_EXPORT_DIR`, `PILOT_UPLOAD_DIR`, and `OPENAI_MODEL` are **OPERATIONAL CONFIG**. Do not print populated values for secrets in logs, reports, support messages, or shell history.

Before admitting users, check `GET /health` for process/runtime health and `GET /readiness` for current bounded gates. A degraded optional OpenAI or B2 provider does not authorize a scientific write and must leave Field, Case, Conversation, retry, and B1 capture available. Stop for any blocked gate or mandatory stop condition.

The bounded startup line reports profile, network mode, bind address, public base URL, secure-cookie state, Conversation/B2 availability, and Google/OSM state. It must never contain a password, session token, API key, raw Chat, filesystem database path, or image bytes.

## HTTPS and browser configuration

TLS terminates at the managed HTTPS endpoint. Keep the application and API same-origin. Sessions use `HttpOnly; SameSite=Strict; Secure` under the configured HTTPS public URL, and no token is placed in a URL or browser storage.

After Render reserves the service hostname, verify that self-wired `PILOT_PUBLIC_BASE_URL` exactly equals `RENDER_EXTERNAL_URL`; do not guess or copy the origin manually. Create a Google Maps JavaScript browser key restricted to the Maps JavaScript API and this exact HTTP referrer pattern:

`https://<pilot-domain>/*`

Provide it as `GOOGLE_MAPS_BROWSER_KEY`. The authenticated browser receives this browser-facing key only; `OPENAI_API_KEY` remains server-side and is never returned. A missing, rejected, timed-out, or failed Google Maps load automatically uses the attributed OpenStreetMap fallback.

Mobile image capture uses `accept="image/*"` and `capture="environment"`. HTTPS is required for the expected mobile camera chooser. Images upload through authenticated same-origin B1 APIs, remain owner-scoped, and have no direct public upload URL.

## Database and image backup

Before first pilot use and before each controlled session:

1. Quiesce planned writes or place the pilot in a controlled maintenance window.
2. Authenticate as the accountable SPA operator and call `POST /api/pilot/verified-backups`.
3. Record the returned SQLite backup, image-manifest file, aligned image-snapshot directory, counts, hashes, and timestamp.
4. Copy the complete three-part set to operator-controlled storage with access controls: `.sqlite`, `.manifest.json`, and `.uploads/`.
5. Call `POST /api/pilot/restore-verifications` with the returned `backup_file`.
6. Require database integrity, current schema/fingerprint, and image integrity all to report `PASS` before admitting users.

Restore verification always creates an isolated database and isolated image directory under the backup area; it never overwrites live data. A database-only copy is not a complete pilot backup. During an actual recovery, stop the process, preserve the failed volume, restore the aligned database and upload snapshot to a new isolated volume, start one compatible application instance, verify `/health`, `/readiness`, ownership, Field/Case/Conversation history and image metadata, then obtain accountable approval before changing service custody.

## Real-device checklist

Record results separately for Android Chrome, iPhone Safari when available, and a second Android or desktop browser. For each applicable device test login, Field list, Field selection, Chat, one adaptive question, “ไม่รู้”, immutable correction, camera chooser, photo upload, reload, logout, login again, Google map, OSM failure fallback, network interruption, and optional-provider outage.

On Device A, use Field User A to create or select a Field, send Chat, and upload one image. On Device B, log in as the same account and verify the same server Field, Case, Conversation, structured facts, and image metadata without Device A browser storage. Then log in as Field User B and attempt navigation plus guessed Field, Case, Conversation, image, and Learning Signal identifiers from User A; every read and write must be denied.

Do not mark `REAL_FIELD_VALIDATION` complete from automated or synthetic checks. Record unavailable iPhone hardware as `NOT_RUN`, not PASS.

## Operator runbook

Deployment remains a manual, accountable operation. After the M0B checkpoint is synchronized, create or review one Render Blueprint from the repository and `main` branch, confirm the paid compute plan, `numInstances: 1`, `/var/data` disk, `autoDeploy: false`, and the `RENDER_EXTERNAL_URL` self-reference, then record the exact generated HTTPS origin. Populate the remaining Render environment values from `pilot-mobile.env.example`, replacing every applicable placeholder but not manually setting `PILOT_PUBLIC_BASE_URL`. Do not deploy until the accountable user explicitly authorizes it.

For observation, request public `GET /health`, then `GET /readiness`; use authenticated readiness for deeper gates. View Render logs through the dashboard using correlation IDs and event codes. Never paste or search logs using passwords, cookies, API keys, `PILOT_USERS_JSON`, raw Chat, database paths, or image bytes. Restart with Render's manual restart only after writes are quiesced; recheck health and readiness afterward.

Before the first user and before each controlled session, run the verified backup and isolated restore sequence above. Retain the timestamped `.sqlite`, `.manifest.json`, and `.uploads/` set outside the service disk under operator-controlled access. A database-only file is not a complete backup.

To rotate a pilot password, generate a new strong password outside the repository, replace only that user's credential in the Render secret value for `PILOT_USERS_JSON`, save, restart the one service, verify the new login, and verify the old password fails. To rotate `OPENAI_API_KEY`, replace it in the Render environment manager, restart, check readiness/provider degradation, and revoke the old key at its provider. To rotate `GOOGLE_MAPS_BROWSER_KEY`, first create and referrer-restrict the replacement to the exact pilot origin, replace the environment value, restart and test Google Satellite plus OSM fallback, then revoke the old key. Never commit any rotated value.

The emergency stop is data-preserving: suspend/disable the Render service **or** set every pilot user to `enabled:false` in `PILOT_USERS_JSON` and restart. Do not delete the disk or database. Preserve the latest verified backup and incident evidence. Resume only after accountable review, corrected configuration, and repeated health/readiness, ownership, backup, and restore checks.

There is no public signup, anonymous Chat, or public user-creation endpoint. Add, remove, or disable identities only through the server-owned secret registry. Pilot Data is not Canonical Knowledge; a Learning Signal is not Evidence; a Learning Candidate is not Scientific Authority; an Outcome is not Efficacy; and an Image is not Diagnosis.

## Pre-deploy gate checklist

The machine-readable authority is `pre-deploy-pilot-checklist.json`. The operator must update evidence outside Git for the actual target and confirm every item immediately before deployment. The following remains unchecked until explicit authorization:

- [ ] M0B checkpoint synchronized
- [ ] target host chosen
- [ ] persistent disk configured
- [ ] exact HTTPS base URL known
- [ ] FIELD_CAPTURE_ALPHA profile
- [ ] 3+ enabled pilot users
- [ ] secure passwords configured
- [ ] OpenAI secret configured if used
- [ ] Google key configured
- [ ] Google domain restriction configured
- [ ] SQLite path persistent
- [ ] image path persistent
- [ ] baseline backup completed
- [ ] isolated restore PASS
- [ ] `/health` PASS
- [ ] `/readiness` acceptable
- [ ] secure cookie verified
- [ ] SPA/Admin review access verified
- [ ] Field User Admin denial verified
- [ ] no public registration
- [ ] single-instance enforcement
- [ ] rollback/kill-switch procedure
- [ ] explicit user deployment authorization

## Exact activation boundary

This repository only prepares hosting. Before public deployment, an accountable operator must review the commit, choose the final host/domain, provision the single persistent instance, set all secrets, restrict the Google key, execute and retain a successful database-plus-images restore rehearsal, review health/readiness, authorize deployment explicitly, and then perform the real-device checklist. Do not publish, release, tag, or invite pilot users from this sprint alone.
