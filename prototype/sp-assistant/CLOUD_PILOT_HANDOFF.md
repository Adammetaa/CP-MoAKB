# Internal Pilot Cloud Handoff

Status: prepared, not deployed.

## Current storage

The running localhost pilot stores shared application state, feedback, exports, backups and uploaded evidence under `prototype/sp-assistant/data/` on the current computer. It is not cloud storage.

## Prepared pilot deployment

The repository-root `render.yaml` defines one paid Node web service with a 1 GB persistent disk mounted at `/var/data`. SQLite, exports and uploaded evidence are explicitly redirected to that disk. `OPENAI_API_KEY` remains a dashboard secret and is never committed.

This configuration is intentionally single-instance because SQLite on a persistent disk must have one writer. It is suitable for a bounded internal pilot, not production scale.

## Before activation

1. Push the reviewed commit.
2. Create a Render Blueprint from the repository.
3. Verify the service is on Starter or higher; free services cannot attach persistent disks.
4. Set `OPENAI_API_KEY` in the Render dashboard.
5. Restrict the Google Maps browser key to the final HTTPS hostname in addition to localhost.
6. Change the prototype shared password before inviting a wider group. The fixed `1234` flow is not production authentication.
7. Import the latest local export only after verifying field and season counts.
8. Test mobile login, field creation, chat persistence, image upload, knowledge search, feedback, export and backup.

## Pilot data location after deployment

- Database: `/var/data/pilot.sqlite`
- Uploaded evidence: `/var/data/uploads/`
- JSON/CSV exports and SQLite backups: `/var/data/exports/`
- Render creates daily persistent-disk snapshots; application exports remain a separate recovery layer.

## Exit criteria before production

Move from the shared prototype password and single-file SQLite to per-user authentication, managed relational storage, object storage, retention/consent policy, audit access controls and tested disaster recovery.
