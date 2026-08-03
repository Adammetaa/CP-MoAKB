# Object Versioning Model

Status: Active

## Purpose

Apply Sprint-040K's independent version axes to Knowledge Objects without
choosing version syntax.

## Version Responsibilities

Concept, Claim, Relationship, and Terminology objects carry independent
Knowledge Versions when their governed meaning changes. Source, Evidence,
Authority, Unresolved Issue, and Package Membership objects require preserved
object versions when their scoped responsibility or disposition materially
changes. Representation uses Representation Version. Review and Finding changes
belong to preserved Review Versions or successor records. Publication Record,
Decision, and Lifecycle Event are immutable conceptual events; correction MUST
append a correcting or superseding object rather than overwrite history.

Package Membership MUST bind an exact Package Version to an exact Asset Version.
Publication Record MUST bind exact accepted Knowledge and Package Versions.
Authority Version MUST be preserved independently from the knowledge reviewed
under it.

## Exact and Current References

Exact versions are mandatory for evidence extraction, review input, findings,
decisions, acceptance, membership, publication, correction, and audit. A current
reference is permitted only for discovery where the consumer is warned that the
target may change and no historical or governance conclusion depends on it.

## Supersession and Correction

Material meaning change creates a new version. Correction, deprecation, split,
merge, replacement, withdrawal, retraction, and supersession MUST preserve prior
identity and exact-version links. Versions MUST NOT be reused or collapsed across
Knowledge, Review, Representation, Publication, Package, and Authority axes.

## Future Implementation and Change Control

Numbers, hashes, dates, tokens, and revision algorithms remain unselected.
Mappings require separate approval and MUST preserve every version axis.
