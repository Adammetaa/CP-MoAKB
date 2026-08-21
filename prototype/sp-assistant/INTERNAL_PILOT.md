# SP Assistant Internal Pilot

This runtime is for a small trusted internal pilot. The fixed password `1234`
is prototype access, not production authentication.

## Local start

1. Copy `.env.example` to `.env.local` and keep the real file out of Git.
2. Run `node server.mjs` from this directory.
3. Open `http://127.0.0.1:4173` and log in.
4. On first login, review and confirm the one-time browser-data import. The
   browser copy is retained.

Live files are stored below `data/` by default and are ignored by Git:

- `data/pilot.sqlite` — authoritative Field/Season/Stage/Guidance lifecycle
  records plus compatibility snapshots for the remaining pilot domains
- `data/uploads/` — user-submitted evidence; never sent to OpenAI in this block
- `data/exports/` — timestamped JSON, CSV, and SQLite backups

Use Profile → Internal Pilot to inspect counts, export data, and create a
backup. Exported data is UTF-8 and preserves stable identifiers and Thai text.

See `LIFECYCLE_ARCHITECTURE.md` for the server-authority, browser-cache,
identity, migration, and StageAssessment boundaries.

## Trusted LAN pilot

Do not expose this server to the public internet. For a trusted local network,
set both values explicitly:

```text
PILOT_HOST=0.0.0.0
PILOT_ALLOW_LAN=true
```

Start the server, find the host computer's private LAN address, and share
`http://PRIVATE_LAN_IP:4173` only with the authorized pilot team. The server
refuses non-local binding unless `PILOT_ALLOW_LAN=true` is present.

## Restore

1. Stop the pilot server.
2. Keep the current `data/pilot.sqlite` as a recoverable copy.
3. Copy a timestamped `pilot-backup-*.sqlite` from `data/exports/` to the
   configured `PILOT_DB_PATH`.
4. Start the server and log in again.
5. Confirm Profile → Internal Pilot counts and reopen one Field Chat.

Never overwrite the only available backup. Evidence files are backed up
separately from the SQLite database and must be copied with `data/uploads/`.
