# Term Change Policy

## Purpose

Vocabulary change must preserve concept identity, historical language, evidence, reviewer decisions, downstream impact, and release context. No change may silently rewrite an official source, observation, assertion, ontology meaning, or prior release.

## Change operations

| Operation | Governance meaning and required handling |
| --- | --- |
| Rename | Change preferred/alternative display label while normally preserving concept identity; retain old label, reason, effective release, language scope, and migration guidance. |
| Merge | Qualified review determines that two governed concept identities should be treated as one referent. Requires identifier and ontology review, evidence, continuing identity decision, reversible audit links, and term migration. |
| Split | Review determines one concept conflates multiple referents. Requires new identities through identifier governance, statement/mapping impact review, retained former identity, and explicit term allocation. |
| Deprecate | Mark term non-preferred while retaining it for discovery, provenance, history, and migration; record reason and replacement where applicable. |
| Restore | Return a deprecated/withdrawn term to governed use through a new review event after the original cause and intervening changes are assessed. |
| Withdraw | Remove term from normal use because source, license, consent, privacy, integrity, or governance basis is inadequate; retain the minimum permitted audit record. |

## Change request requirements

Every future change request MUST record:

- affected concept and term references;
- requested operation, language/script, and current/proposed forms;
- problem statement and reason;
- source, evidence, provenance, proposer, and date;
- identity/ontology impact and whether meaning changes;
- ambiguity, synonym, translation, external-mapping, and regulatory impact;
- affected releases, datasets, APIs/interfaces, statements, documentation, and users where known;
- privacy, license, jurisdiction, and historical-use considerations;
- required terminology, language, domain, evidence, regulatory, architecture, and release reviews;
- decision, dissent, effective release, migration guidance, and rollback/restoration plan.

## Identity and meaning safeguards

A spelling correction or preferred-label rename normally preserves concept identity. A material change to referent, necessary definition, inclusion/exclusion boundary, taxonomic scope, or regulatory meaning triggers identifier and ontology review and MAY require a new concept identity.

Merge and split are not editorial shortcuts. Automated deduplication MUST NOT execute them. Historical assertions keep the identities, terms, sources, and release context used at the time until each affected mapping is reviewed.

## Source and official terminology

Source wording remains attributable to its source/version. CP-MoAKB MAY change a local preferred display term after governance review, but MUST NOT imply that an external authority changed its official term. Frozen IRAC content cannot be renamed or normalized under this policy.

## Emergency and rollback handling

A harmful, privacy-revealing, legally misleading, or integrity-compromised term MAY be withdrawn from display through a governed emergency action. The action still records authority, reason, time, scope, and later review. Rollback or restoration creates a new event and never erases the original change history.
