# RAS-004: Registry Contract

**Status:** Active

**Version:** 1.0

This specification governs storage-neutral Runtime registries for identity custody and explicit reference lookup. It applies [RAS-001](RAS-001-runtime-engineering-standard.md), preserves the [validation boundary](RAS-002-validation-framework.md), and implements the stable-identity direction of ADR-006, ADR-008, and ADR-009.

## Purpose and limits

Registries MUST govern typed identity custody and reference lookup. Registry presence MUST NOT be presented as scientific truth, regulatory approval, source reliability, authority superiority, diagnostic validity, or recommendation suitability.

The Runtime defines three registry contracts:

- a Candidate Identifier Registry for non-production candidate custody;
- a Source Registry for immutable `SourceReference` values keyed by `SourceIdentifier`; and
- an Authority Registry for immutable `AuthorityReference` values keyed by `AuthorityIdentifier`.

All registries MUST be deterministic, explicit, non-global, storage-neutral, network-free, and side-effect controlled. They MUST reject duplicate or incompatible identity claims and MUST expose immutable snapshots. They MUST NOT contain persistence, filesystem discovery, live service handles, or implicit environment-dependent state.

## Candidate identifier custody

Candidate custody states are Reserved, Registered, Abandoned, Rejected, and Superseded. Custody state is distinct from candidate-record lifecycle. Reservation is not publication, registration is not canonical promotion, and neither action authorizes real candidate content.

An identifier MUST be explicitly reserved before registration. A reserved identifier MAY be abandoned. A registered identifier MAY be rejected or superseded through an explicit operation and reason. Supersession MUST name a distinct registered successor. Abandoned, rejected, and superseded identifiers MUST remain in registry state permanently and MUST NOT be released, recycled, or reissued. Incompatible transitions MUST fail without mutation.

Candidate entries MUST be immutable and retain the typed identifier, custody state, optional reservation note, applicable record association, applicable change reason, optional successor, and optional actor-role reference. Implementations MUST NOT require personal names or generate timestamps.

## Source and authority identity

Source and authority identifiers are the sole registry identity keys. A matching title, URL, label, or name MUST NOT establish identity or cause merging. Re-registration under the same identifier MAY be idempotent only when the entire immutable domain payload is equal. Any unequal same-ID payload MUST raise an explicit conflict; no field is silently overwritten.

Source registration MUST NOT approve, rank, fetch, or infer rights for a source. Authority registration MUST NOT rank authorities, infer claim scope, resolve jurisdiction, or establish scientific truth.

## Snapshots and ordering

Snapshots MUST be immutable, deterministic, independent of later live-registry mutations, and free of mutable mappings or service handles. They MUST preserve every reserved or registered identifier, including terminal custody states, and SHOULD support equality, hashing, typed lookup, and audit comparison.

Candidate, source, and authority entries MUST sort by the canonical string form of their typed identifier. Lookups MUST NOT mutate state.

## Allocation boundary and errors

Automatic production identifier allocation is prohibited. An explicit synthetic allocator MAY be introduced by a future engineering sprint only with deterministic, non-global, non-reusing behavior and clear non-governance warnings. Sprint-019R defers allocation and requires explicitly supplied candidate identifiers.

Ordinary conflicts and invalid transitions MUST raise typed registry exceptions with deterministic messages. Implementations MUST NOT silently overwrite, return ambiguous `None` failures, or hide programming defects.
