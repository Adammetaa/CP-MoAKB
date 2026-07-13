# Vocabulary Release Policy

## Purpose and release independence

A vocabulary release is a governed, versioned publication event for accepted terms and their language metadata. It MUST remain distinct from:

- **software release:** version of runtime code and executable behavior;
- **ontology release:** version of concept/relationship semantics;
- **dataset release:** versioned collection of knowledge or source-derived records; and
- **source-document version:** edition or immutable representation issued by an external authority.

These releases MAY reference one another for compatibility, but matching version numbers, dates, or repository commits do not make them the same release.

## Release prerequisites

Before a future vocabulary release, governance MUST confirm:

- declared vocabulary authority, scope, languages, audience, and intended use;
- accepted term set and stable concept references;
- completed quality gates and required specialist reviews;
- source, evidence, license, provenance, and external-authority constraints;
- change log covering additions, renames, relationship changes, deprecations, merges, splits, restores, withdrawals, and corrections;
- compatibility and migration impact for known consumers;
- unresolved ambiguity, exceptions, limitations, and prohibited inferences;
- release owner, approvers, release date, version, and supersession relationship; and
- rollback/withdrawal and long-term retention expectations.

This is a conceptual checklist, not a production release manifest.

## Versioning principles

- Release versions identify the published vocabulary collection, not the enduring identity of each concept.
- A label correction can occur in a new vocabulary release without changing its concept identifier.
- Material concept-meaning changes require ontology/identifier governance and MUST NOT be hidden as a vocabulary-only release.
- Historical releases remain auditable and SHOULD remain retrievable where license/privacy permit.
- A release MUST NOT silently replace or rewrite a prior release.
- Deprecation and replacement relationships include the release in which they become effective.
- Consumers SHOULD be able to identify the vocabulary release used for a displayed term or historical decision.

No semantic-versioning scheme, calendar format, branch model, file format, or delivery channel is selected here.

## Publication and compatibility

A release note SHOULD state compatibility with relevant ontology, identifier-policy, dataset, software, and source versions without coupling their release cadence. It SHOULD distinguish additive language coverage, editorial correction, changed preference, deprecated usage, and identity/meaning-impacting changes.

SQL, REST, graph databases, RDF, OWL, SKOS, and JSON-LD MAY later carry a vocabulary release. The governed release meaning must remain portable across representations. Publication in any format does not select that technology as the canonical architecture.

## Emergency withdrawal

A release or individual term MAY be withdrawn from normal distribution for privacy, license, harmful language, legal, integrity, or critical semantic reasons. The withdrawal retains a safe audit record, reason, authority, effective time, affected versions, consumer guidance, and planned review. Corrected publication uses a new release event rather than overwriting the withdrawn artifact.

## Current release boundary

No vocabulary release is created by Sprint-014. Existing software baseline, official IRAC source/version, golden baseline, and generated validation artifacts remain unchanged.
