# Identity, Version, Reference, and Namespace Model

Status: Active

Version: 1.0

## Purpose

Define durable identity and reference invariants for Knowledge Assets and
Packages while preserving independent version axes and domain-scalable namespace
governance. This model creates no identifier, registry, resolver, URI pattern,
schema, or storage structure.

## Authority

ADR-006 remains the authority for identity governance before vocabulary or
identifier implementation. This model applies that sequencing to Knowledge
Assets and Packages and MUST NOT decide any physical syntax explicitly left open
by ADR-006. Existing identifier governance remains applicable. ADR-009 candidate
handles remain pilot-specific and MUST NOT be reused or promoted as production
Knowledge Asset identities.

## Stable Identity Philosophy

A stable identity answers which governed referent persists, not how it is
displayed or stored. Each identity family MUST declare competent authority,
namespace ownership, identity category, minting control, lifecycle, non-reuse,
mapping provenance, privacy class, and review process before production use.

Stable Knowledge Asset and Package identities MUST survive:

- rename or editorial relabeling;
- addition, removal, or correction of a translation;
- repository, folder, or filename restructuring;
- change of authoring or publication representation;
- migration among future filesystem, object, database, graph, or cloud choices;
- replacement of a view, search index, export, mobile client, or API; and
- future implementation changes that preserve the same governed referent.

Identity continuity MUST NOT be inferred from matching labels, filenames, URLs,
external identifiers, content similarity, or automated equivalence. Merge,
split, replacement, mapping, and succession require explicit competent review
and non-destructive history.

## Identity-bearing and Non-identity Terms

### Stable IDs

A **Stable ID** is a governed reference to one identity within an authority-owned
namespace. It MUST be label-independent, unique in scope, non-reused, category-
unambiguous, and preserved through lifecycle change. This architecture specifies
no characters, separators, length, sequence, or resolver.

### Human Labels

A **Human Label** is language-, audience-, authority-, and status-sensitive text
used to name or describe an identified referent. Thai, English, scientific,
historical, preferred, alternative, and deprecated labels MAY coexist. A label
MUST NOT serve as identity or establish equivalence.

### File Names and Folder Names

File and folder names are possible repository-location aids. They MAY change for
maintainability and MUST NOT establish canonical identity, semantic hierarchy,
package membership, authority, or lifecycle. This architecture chooses no
repository naming convention.

### URLs

A URL is a location or resolver-facing reference at a time. A stable public URL
MAY represent an identity under future policy, but URL form and hosting remain
separate from identity authority. Redirects, domain changes, offline use, and
future storage migration MUST NOT create new knowledge identities.

### Translations

A translation is a representation of meaning in a declared language and locale.
It MUST reference the same asset and exact semantic basis, disclose material
translation limitations, and receive appropriate review. Translation change MAY
create a Representation Version without creating a Knowledge Version unless the
governed meaning itself changes.

### Version IDs

A Version ID distinguishes one preserved state on one named version axis. It
MUST identify both the governed object and the axis. A Version ID MUST NOT be
reused or interpreted as the stable identity of the object across all versions.

### Publication IDs

A Publication ID identifies one governed publication event or release within a
publication authority and channel scope. It MUST reference exact included
Knowledge and Package Versions. It MUST NOT replace their identities, imply
publication in another channel, or make later versions published.

## Independent Version Model

The following version axes MUST remain separate:

| Version axis | What changes it | What it does not mean |
| --- | --- | --- |
| **Knowledge Version** | Material change to an asset's governed semantic meaning, scope, limitation, or assertion set | Package membership, visual redesign, re-review alone, or publication |
| **Package Version** | Material change to package purpose, membership, selected Knowledge Versions, limitations, or assembly meaning | A new version of every member asset |
| **Representation Version** | Change to a rendering, translation, layout, projection, or audience-specific expression | Changed canonical knowledge unless semantic meaning also changed |
| **Publication Version** | A separately governed release or correction for an exact channel and audience | Knowledge acceptance or universal currentness |
| **Review Version** | A preserved review round, review plan, finding set, or decision basis for exact inputs | A new Knowledge Version unless content changed |
| **Authority Version** | Change to the authority instrument, delegation, scope, jurisdiction, or effective period | Automatic reapproval of knowledge governed under an earlier authority |

Every version reference MUST name its axis. Systems and documents MUST NOT use
an ambiguous word such as “version” when more than one axis can apply. A single
change MAY require coordinated new states on several axes, but those states MUST
remain independently identified and auditable.

## Reference Model

A reference connects independently governed objects without copying identity or
meaning. Every material reference MUST make its relationship, target identity,
required version precision, authority, and resolution limitations clear.

- **Internal Reference:** connects objects governed within CP-MoAKB. It SHOULD
  resolve by stable identity and exact version where reproducibility matters.
- **External Reference:** points to an externally governed object while
  preserving external authority, version, locator, retrieval, rights, and local
  mapping provenance. It MUST NOT claim local ownership.
- **Cross-Package Reference:** connects an asset or package to an asset in
  another package without changing either package's membership. It MUST state
  whether an exact version or an explicitly governed moving relationship is
  intended.
- **Citation:** identifies the source segment or locator supporting review of a
  claim under KAS-004. A citation is not evidence assessment or acceptance.
- **Evidence Link:** states how an evidence item supports, limits, contradicts,
  or leaves unresolved a specific claim and version.
- **Relationship Link:** points to a separately identified semantic relationship
  assertion. It MUST NOT imply an unreviewed inverse or inferred edge.
- **Publication Link:** connects an exact Knowledge or Package Version to a
  governed publication event, release, channel, and disposition.
- **Review Link:** connects an exact reviewed input version to its review plan,
  findings, responses, decision, and competence evidence.
- **Authority Link:** identifies the competent instrument, source, body, or role
  and the exact scope, version, jurisdiction, and effective period relied upon.

Broken, unavailable, superseded, restricted, or ambiguous references MUST remain
visible. A resolver failure MUST NOT be repaired by silently selecting a similar
target.

## Namespace Philosophy

A **namespace** is an authority-owned scope within which identities are allocated
and interpreted without collision. Namespace governance MUST support global and
domain-specific knowledge growth, including Rice, Corn, Cassava, Vegetable,
Fruit, and future domains, without redesigning the identity philosophy.

The namespace model MUST provide:

- a global governance scope for cross-domain identities and shared concepts;
- domain scopes whose ownership and inclusion criteria are explicit;
- distinct identity categories for assets, packages, claims, relationships,
  evidence, sources, reviews, decisions, authorities, and publications;
- collision prevention and non-reuse within each governed scope;
- explicit mappings rather than string-based equivalence across namespaces;
- durable identity when an asset becomes cross-domain or stewardship changes;
- privacy separation between public curated knowledge and restricted cases;
- historical retention for deprecated, merged, split, or retired identities; and
- growth by adding governed namespaces, not by changing existing identifiers.

Domain names in this architecture describe required scalability only. They do
not create domain inventories, concepts, records, master data, or approved
taxonomies. A namespace MUST NOT encode mutable classification, status,
geography, language, or ownership into identity in a way that forces identity
change when those properties change.

## Fictional Example

Fictional asset **K-Lantern** keeps one stable identity while its Thai and
English labels change, its Markdown representation moves folders, and a future
mobile view replaces an older layout. Knowledge Version **V-Three** remains the
semantic basis. Translation revision **T-Seven**, Review Version **R-Two**, and
Publication Version **P-One** are separate references, not aliases for V-Three.

Package **P-Orbit** references K-Lantern V-Three from a different fictional
namespace. The cross-package reference does not copy K-Lantern or make P-Orbit
its identity owner. These placeholder tokens are not a proposed identifier
format.

## Non-examples

- Using a Thai preferred label as the primary key.
- Reusing a retired identifier for a similar concept.
- Treating the same filename in two packages as identity equivalence.
- Calling a redesigned Explorer card a new Knowledge Version.
- Using an external authority's identifier as proof of local acceptance.
- Embedding current package status into an identity that must survive status
  change.

## Future Work

Possible identifier syntax, allocation, resolution, mapping services, privacy
controls, and migration mechanisms require separate evidence and architecture
decisions. None is selected here.
