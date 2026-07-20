# Knowledge Authoring Standards

Knowledge Authoring Standards (KAS) are the normative constitution for how
CP-MoAKB knowledge is proposed, evidenced, described, reviewed, published,
changed, and retained. They govern knowledge work, not Runtime engineering or a
physical data format.

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. Each KAS has a lifecycle status and document version.
Active KAS documents apply to future knowledge work; they do not retroactively
create, approve, publish, or reinterpret any record or dataset.

## Index

| Standard | Status | Version | Governs |
| --- | --- | --- | --- |
| [KAS-001](KAS-001-knowledge-authoring-principles.md) | Active | 1.0 | Constitutional principles and separation boundaries |
| [KAS-002](KAS-002-knowledge-record-standard.md) | Active | 1.0 | Governance structure of one knowledge record |
| [KAS-003](KAS-003-evidence-standard.md) | Active | 1.0 | Evidence hierarchy, provenance, conflict, and retirement |
| [KAS-004](KAS-004-citation-standard.md) | Active | 1.0 | Source-type citation and locator requirements |
| [KAS-005](KAS-005-terminology-standard.md) | Active | 1.0 | Multilingual terms, names, variants, authority, and status |
| [KAS-006](KAS-006-relationship-standard.md) | Active | 1.0 | Meaning and review of semantic relationships |
| [KAS-007](KAS-007-knowledge-lifecycle.md) | Active | 1.0 | Knowledge review, publication, and retention states |

## Authority and relationships

Accepted [Architecture Decision Records](../ARCHITECTURE_DECISIONS/README.md)
remain authoritative for durable architectural decisions. KAS translates those
principles into knowledge-authoring obligations without choosing technology.
[Runtime Architecture Specifications](../runtime/specifications/README.md) govern
software engineering; KAS does not modify Runtime behavior, schemas, APIs,
validation, or package versions. A KAS requirement that needs implementation
MUST enter a separately approved engineering scope and applicable ADR/RAS review.

Existing detailed policies remain applicable within their scopes, including
[Source Policy](../SOURCE_POLICY.md), [Evidence Levels](../EVIDENCE_LEVELS.md),
[identifier governance](../identifiers/README.md),
[ontology principles](../ontology/ONTOLOGY_PRINCIPLES.md), and
[vocabulary governance](../vocabulary/README.md). A conflict MUST be recorded and
resolved through governance; an author MUST NOT silently choose the convenient
rule.

## KAS governance

A KAS amendment requires a scoped proposal, impact analysis, cross-reference
review, and explicit knowledge-governance approval. Material semantic changes
require a new document version and migration guidance. Prior versions and
supersession links MUST remain auditable. Editorial corrections MAY retain the
version only when they change no normative meaning.

This family creates no agricultural content, approved terminology, ontology,
dataset, recommendation, diagnosis, inference, or publication event.
