# Knowledge Governance and Authoring Standards

The [Knowledge Constitution](constitution/knowledge-constitution.md) is the
highest normative authority within CP-MoAKB knowledge governance. Knowledge
Authoring Standards (KAS) are subordinate standards for how knowledge is
proposed, evidenced, described, reviewed, published, changed, and retained. They
govern knowledge work, not Runtime engineering or a physical data format.

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. Each KAS has a lifecycle status and document version.
Active KAS documents apply to future knowledge work; they do not retroactively
create, approve, publish, or reinterpret any record or dataset.

## Constitutional and Planning Documents

- [Knowledge Constitution index](constitution/README.md)
- [Knowledge Constitution](constitution/knowledge-constitution.md)
- [Knowledge Engineering Roadmap](roadmap/knowledge-engineering-roadmap.md)

The roadmap is planning documentation only. It does not authorize a sprint,
source, record, dataset, schema, Runtime change, or publication.

## Index

| Standard | Status | Version | Governs |
| --- | --- | --- | --- |
| [KAS-001](KAS-001-knowledge-authoring-principles.md) | Active | 1.0 | Authoring principles that apply the Constitution |
| [KAS-002](KAS-002-knowledge-record-standard.md) | Active | 1.0 | Governance structure of one knowledge record |
| [KAS-003](KAS-003-evidence-standard.md) | Active | 1.0 | Evidence hierarchy, provenance, conflict, and retirement |
| [KAS-004](KAS-004-citation-standard.md) | Active | 1.0 | Source-type citation and locator requirements |
| [KAS-005](KAS-005-terminology-standard.md) | Active | 1.0 | Multilingual terms, names, variants, authority, and status |
| [KAS-006](KAS-006-relationship-standard.md) | Active | 1.0 | Meaning and review of semantic relationships |
| [KAS-007](KAS-007-knowledge-lifecycle.md) | Active | 1.0 | Knowledge review, publication, and retention states |

## Authority and Relationships

The Constitution governs the KAS family and subordinate knowledge policies.
KAS-001 applies constitutional principles to authoring; it is not itself the
Constitution and MUST NOT amend or supersede it.

Accepted [Architecture Decision Records](../ARCHITECTURE_DECISIONS/README.md)
remain authoritative for durable architectural decisions. The Constitution and
KAS MUST conform to ADR-005's implementation-neutral ontology layers, ADR-006's
identity sequencing, ADR-007's vocabulary sequencing, ADR-008's canonical
master-data and claim-scoped source authority, and ADR-009's Rice pilot candidate
YAML format. They MUST NOT duplicate or silently supersede those decisions.

In particular, ADR-008, not KAS, determines the prerequisite governance for
canonical master data and distinguishes source authority from truth. ADR-009,
not KAS, determines the constrained candidate-record format for the Rice pilot.
KAS-002 describes governance information that authors and reviewers need; it is
not an implementation schema and MUST NOT be used to generalize ADR-009.

[Runtime Architecture Specifications](../runtime/specifications/README.md),
RAS-001 through RAS-015, govern software engineering and release contracts. The
Constitution and KAS do not modify Runtime behavior, schemas, APIs, validation,
security controls, release controls, or package versions. A knowledge requirement
that needs implementation MUST enter a separately approved engineering scope and
applicable ADR/RAS review.

Existing detailed policies remain applicable within their scopes, including
[Source Policy](../SOURCE_POLICY.md), [Evidence Levels](../EVIDENCE_LEVELS.md),
[identifier governance](../identifiers/README.md),
[ontology principles](../ontology/ONTOLOGY_PRINCIPLES.md), and
[vocabulary governance](../vocabulary/README.md). A conflict MUST be recorded and
resolved through governance; an author MUST NOT silently choose the convenient
rule.

[Design Freeze](../maintainers/design-freeze.md) MUST remain authoritative for
frozen components. The [Publication Boundary](../release/publication-boundary.md)
MUST remain authoritative for public repository, tag, release, artifact, and
package publication. Knowledge acceptance MUST NOT imply publication approval.

## KAS Governance

A KAS amendment requires a scoped proposal, impact analysis, cross-reference
review, and explicit knowledge-governance approval. Material semantic changes
require a new document version and migration guidance. Prior versions and
supersession links MUST remain auditable. Editorial corrections MAY retain the
version only when they change no normative meaning.

This family creates no agricultural content, approved terminology, ontology,
dataset, recommendation, diagnosis, inference, or publication event.
