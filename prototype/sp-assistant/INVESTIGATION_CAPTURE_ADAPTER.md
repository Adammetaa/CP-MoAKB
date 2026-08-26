# Governed Investigation Capture Adapter

## Purpose

The capture adapter is the thin application/browser bridge between the existing
field-facing pilot and the server-authoritative Investigation Evidence
Backbone. It supports capture, local draft continuity, safe retry, authoritative
refresh, resume, and revision-checked updates. It performs no scientific
interpretation.

The normal flow is:

`Field + CropSeason -> local draft -> typed server write -> authoritative bundle refresh`

A routine Observation does not require a Case. Every persisted Observation
continues to reference the server's existing authoritative StageAssessment.

## Authority boundary

Investigation records in SQLite and returned bundles are authoritative. The
browser stores only a non-authoritative draft envelope under
`cpmoakb.investigation-drafts.v1`. Drafts never enter the legacy workspace
collections and never replace server records.

After every successful create or update, the adapter reloads
`/api/pilot/investigation-bundle`. Server-derived percentages, revision,
timestamps, stage provenance, and normalized values shown by the capture screen
come from that bundle.

## Draft states

- `DRAFT_LOCAL`: editable only in the browser;
- `PENDING_SYNC`: explicitly queued for a server attempt;
- `SYNCING`: a write is in progress;
- `SYNCED`: the write and authoritative refresh completed;
- `SYNC_FAILED`: validation, authorization, network, or server failure;
- `CONFLICT`: the expected revision was stale;
- `ABANDONED`: retained as intentionally abandoned local work.

Every draft has a stable draft ID, stable record IDs, stable request IDs,
scope, the original typed operations, completed-request markers, timestamps,
and explicit authority/error state. `VALIDATION_ERROR`,
`AUTHORIZATION_ERROR`, `NETWORK_ERROR`, `SERVER_ERROR`, and
`VERSION_CONFLICT` remain distinct.

## Retry and idempotency

The browser reuses the same request ID after timeout or network loss. The server
atomically stores the request fingerprint and created/updated representation in
`investigation_write_requests`. Replaying the same request returns
`IDEMPOTENT_REPLAY`; reusing its ID with different content returns a conflict.
This prevents duplicate Observations or Evidence when the first response was
lost after commit.

Partially completed multi-record drafts persist completed request IDs. A retry
continues from the remaining operations, while the server request ledger also
protects the operation whose response may have been lost.

## Optimistic update conflicts

Observations and typed Evidence use integer `revision` values. A capture update
supplies `expected_revision`; the update succeeds only when it matches the
current server value and then increments the revision.

A stale write returns HTTP 409 with `VERSION_CONFLICT`. The browser retains the
unsaved draft, can refresh the authoritative bundle for review, and may create a
new deliberate update against the current revision. There is no automatic
semantic merge or distributed lock.

## Thin capture interface

The pilot Field screen now links to a small capture form for:

- Observation note and time;
- optional local spatial pattern/extent;
- optional plant part and morphology primitive;
- optional affected/observed tiller counts;
- optional observed field-water state; and
- optional management event with an unresolved reported product name.

The form submits the existing typed A1-A10 contracts. It does not expose the
full vocabulary as a scientific configuration form and does not calculate the
incidence percentage in the browser.

## Legacy and extension boundaries

The legacy `WorkspaceRepository`, guided inspection, conversation, photo
receipt, DecisionLog, and Field Action handoff continue unchanged. Legacy
untyped observations are not reinterpreted as governed evidence. The new draft
repository and capture API operate alongside that compatibility envelope.

Existing image uploads remain `PHOTO_RECEIVED != PHOTO_ANALYZED !=
DIAGNOSIS_CONFIRMED`. A future Step B adapter can attach visual records by
Field, Season, Observation, Case, and Sampling Site identifiers without changing
draft authority. Future Investigation Intelligence may consume authoritative
bundles, but it must be separately governed and cannot be inferred from this
capture adapter.

## Explicit non-goals

This adapter adds no image analysis, candidate generation/ranking, evidence
sufficiency evaluation, diagnosis, LLM reasoning, Guidance Intelligence,
thresholds, pesticide/product selection, fertilizer or treatment advice,
resistance conclusion, automatic knowledge promotion, CRDT, deployment,
release, or publication.
