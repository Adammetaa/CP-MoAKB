# Server-backed Field Lifecycle

## Authority and ownership

The authoritative identity chain is `User -> Field -> CropSeason`. The pilot
server persists lifecycle records in normalized SQLite tables and validates
that every Field belongs to the authenticated `user_id`. A CropSeason must
belong to that Field. Requests cannot change `field_id` to read another user's
record.

`lifecycle_fields`, `crop_seasons`, `stage_assessments`, and
`guidance_states` are the authoritative lifecycle representation. The legacy
workspace JSON remains a compatibility envelope for investigation, chat, and
other pilot collections while those domains are migrated incrementally.

## Browser boundary

The server is authoritative. Browser `localStorage` is a cache, draft, and
degraded fallback only. At boot, an authenticated client pulls the server
workspace and replaces cached lifecycle collections. Client saves are queued
in order. If a save cannot reach the server, the UI labels the state as cached
and not yet server-confirmed; it does not claim that the mutation is durable.

## StageAssessment provenance

Each current Field + CropSeason pair has one StageAssessment containing crop
age, crop stage, CMP stage, provenance, model/configuration versions, and
assessment time. `SYSTEM_ESTIMATED`, `USER_CONFIRMED`, and `USER_OVERRIDDEN`
remain distinct and are never collapsed. The governed nine-stage CMP logic is
unchanged.

## Guidance context

Guidance state is keyed and retrieved by authenticated `user_id + field_id +
season_id`. The server verifies ownership and the Field/Season relationship
before returning guidance. Current rule generation remains unchanged; future
weather, history, variety, planting-method, and case inputs can use this same
identity chain.

## Migration and deferred work

Existing pilot JSON is imported into normalized lifecycle tables once per
user. Primary keys and upserts make the process idempotent. This sprint does
not infer deletion from an absent client record, because a stale cache must
not delete authoritative server data.

Deferred: explicit server-side delete commands, full offline conflict
resolution, field actions/outcomes, reminders, spatial intelligence, the full
Guidance Intelligence Engine, Knowledge Graph work, deployment, and release.
