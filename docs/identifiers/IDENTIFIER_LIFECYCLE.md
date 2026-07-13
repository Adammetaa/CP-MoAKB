# Identifier Lifecycle

## Purpose

The identifier lifecycle records how a candidate identity is minted, reviewed, published, corrected, related, deprecated, and retained. Lifecycle status describes identifier governance only; it does not express scientific confidence, evidence level, regulatory status, diagnosis, safety, or recommendation approval.

## Conceptual states

| State | Meaning |
| --- | --- |
| draft | Candidate identity under preparation; not published or guaranteed stable outside its governed workspace. |
| reserved | Key held to prevent collision while review proceeds; reservation does not approve meaning. |
| active | Published/usable identity under its authority and declared scope. |
| deprecated | Retained identity no longer preferred, with reason and replacement guidance where available. |
| superseded | A newer identity or model deliberately replaces it for a stated scope. |
| merged | Review determined that its referent is represented by another identity; the old identifier remains a resolvable alias/tombstone. |
| split | Review determined that one identity conflated multiple referents; new identities are linked without rewriting history. |
| withdrawn | Removed from normal use because publication, consent, license, privacy, or governance basis no longer permits it. |
| rejected | Candidate was reviewed and not accepted; its key remains unavailable for reuse. |
| tombstoned | Minimal durable resolution record retained when content cannot or should not be served. |

These states are examples for future review. A physical state machine, transition permissions, and storage are not implemented.

## Transition governance

Every transition MUST record prior/new status, time, actor/role, authority, reason, evidence, review/approval reference, affected mappings/statements, and rollback or remediation guidance. Required review depends on identity category:

- Identifier Registrar controls allocation and collision checks.
- Namespace Owner confirms scope and policy compliance.
- Domain Reviewer confirms meaning, merges, splits, and material scope changes.
- Evidence Reviewer reviews mapping/assertion support.
- Regulatory Reviewer reviews registration/legal identity and equivalence.
- Data Steward reviews duplicates, privacy, custody, and publication transitions.
- Architecture Governor reviews cross-namespace exceptions.
- Release Manager publishes approved releases without changing entity identity.

No role is assumed currently staffed. Automation MAY execute approved transitions but MUST NOT be the sole authority for merges, splits, regulatory equivalence, or public release.

## Lifecycle operations

- **Minting:** verify authority, namespace, category, collision history, privacy class, and minimum provenance before allocation.
- **Review/publication:** approve meaning and labels separately from key allocation; publication makes stability and non-reuse obligations durable.
- **Correction:** append an attributed correction. Typographical or metadata correction normally preserves identity.
- **Label change:** preserve identity and label history unless review finds that the referent changed.
- **Scope clarification:** preserve identity only when the defining referent is unchanged; material narrowing, broadening, or changed meaning MAY require a new identity and mapping.
- **Deprecation/replacement:** retain the old identity with reason, effective date, replacement, and historical use.
- **Merge:** select a continuing identity through evidence-based review; retain all old identifiers and provenance with `merged into`/`duplicate of` relationships.
- **Split:** mint distinct identities, link them using `split into`, preserve the former identity, and avoid silently reassigning old statements without review.
- **Mistaken duplication:** record the duplicate decision and reversible mapping; do not delete the losing record or reuse its identifier.
- **Rollback:** restore the prior governance state or publish a corrective transition while preserving the erroneous event. Rollback MUST NOT erase audit history.
- **Withdrawal/tombstone:** expose only safe minimum metadata and reason/status where privacy, legal, license, or integrity constraints prevent normal resolution.

Expected lifecycle relationships include `replaced by`, `supersedes`, `merged into`, `split into`, `deprecated because`, `equivalent after review`, and `duplicate of`. Each is a reviewed statement with provenance, time, confidence/status, and scope—not a database shortcut.

Identifiers SHOULD normally remain resolvable after deprecation, supersession, merge, split, withdrawal, or rejection. Resolution may return a tombstone rather than restricted content. Identifiers MUST never be reassigned.

## Versioning policy

| Version/time concept | Meaning |
| --- | --- |
| Identifier stability | Continuity of the governed referent across non-material revisions. |
| Entity revision | A change to labels, metadata, scope clarification, or review record for the same referent. |
| Dataset release | A published collection snapshot containing versions of identities/statements; not the identity of each member. |
| Schema version | Version of a physical structural contract; no future schema is selected here. |
| Ontology version | Version of a conceptual/physical ontology release; distinct from each concept identity. |
| Source-document version | Edition/release/immutable representation issued or retained for a source document. |
| Assertion validity period | Time during which a statement applies or is asserted to apply. |
| Regulatory effective date | Time at which a legal/registration/label state becomes effective in a jurisdiction. |
| Retrieval date | When CP-MoAKB obtained or verified a source representation. |
| Review date | When an identified reviewer assessed an identity, mapping, source, or assertion. |

Changing a label or correcting a typo does not normally change the identifier. Changing the referent or material meaning may require a new identity. Historical assertions MUST retain their original identity, version, validity, jurisdiction, evidence, and review context; later releases do not rewrite them.

Dataset, schema, and ontology releases MUST NOT be confused with entity identity. An official-source update creates a new review/version event and does not automatically replace all prior assertions. Temporal and jurisdictional applicability usually belongs to statements/mappings rather than the core concept identifier. This conceptual guidance does not modify the frozen dataset-version policy or current source manifests.

## Public/private transition

Private Field Vault case, observation, image/artifact, person/organization, farm, and exact-location identities remain under consent, custody, access-control, retention, and redaction rules. Publication requires purpose, permission, provenance, domain review, and re-identification assessment.

A public anonymized publication identity MAY be minted instead of exposing the private operational identifier. Pseudonymization and redaction MUST be reviewed together; neither guarantees anonymity. The private-to-public crosswalk, if retained, stays access-controlled and outside public Git. Withdrawal must preserve the minimum lawful audit/tombstone record without exposing restricted content.

## Resolution non-goal

This lifecycle specifies expected behavior, not a resolution service. No API, redirect, URI, landing page, database, tombstone endpoint, or machine-readable representation is created in Sprint-013.
