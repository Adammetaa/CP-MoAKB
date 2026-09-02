# HTTPS Mobile Pilot Operations

Status: hosting-ready configuration, not deployed. This is not production readiness, scientific validation, diagnostic-accuracy validation, or evidence that `REAL_FIELD_VALIDATION` passed.

## Architecture and startup

Run exactly one Node SP Assistant process behind a managed HTTPS endpoint or reverse proxy. Keep SQLite, exports/backups, and uploads on the same protected persistent volume, outside the static application directory. The deployment manifest uses `/var/data/pilot.sqlite`, `/var/data/exports`, and `/var/data/uploads`; none is served as a public directory. Use a process supervisor that restarts the single instance after failure and performs graceful termination before planned maintenance.

Set the variables in `pilot-mobile.env.example` through the host secret/environment manager. `PILOT_PUBLIC_BASE_URL` must be the exact root HTTPS origin. `PILOT_USERS_JSON` must contain at least three enabled, server-owned credentials, including a bounded SPA reviewer and two distinct Field users. Replace every placeholder; never commit the populated values. Keep F1, F2, Step H, and Step I disabled through the `FIELD_CAPTURE_ALPHA` profile.

Before admitting users, check `GET /health` for process/runtime health and `GET /readiness` for current bounded gates. A degraded optional OpenAI or B2 provider does not authorize a scientific write and must leave Field, Case, Conversation, retry, and B1 capture available. Stop for any blocked gate or mandatory stop condition.

The bounded startup line reports profile, network mode, bind address, public base URL, secure-cookie state, Conversation/B2 availability, and Google/OSM state. It must never contain a password, session token, API key, raw Chat, filesystem database path, or image bytes.

## HTTPS and browser configuration

TLS terminates at the managed HTTPS endpoint. Keep the application and API same-origin. Sessions use `HttpOnly; SameSite=Strict; Secure` under the configured HTTPS public URL, and no token is placed in a URL or browser storage.

Create a Google Maps JavaScript browser key restricted to the production Maps API and this exact HTTP referrer pattern:

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

## Exact activation boundary

This repository only prepares hosting. Before public deployment, an accountable operator must review the commit, choose the final host/domain, provision the single persistent instance, set all secrets, restrict the Google key, execute and retain a successful database-plus-images restore rehearsal, review health/readiness, authorize deployment explicitly, and then perform the real-device checklist. Do not publish, release, tag, or invite pilot users from this sprint alone.
