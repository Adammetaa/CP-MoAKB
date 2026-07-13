# ADR-009: Canonical Candidate Record Format for the Rice Master Data Pilot

- Status: Proposed
- Date: 2026-07-13
- Decision owners: Chief Architect, Product Owner, Architecture Reviewer, and Data Steward

## Context

Sprint-016 needs a reviewable source of truth for nested multilingual labels, claim-scoped provenance, uncertainty, and evidence-bearing relationships. The pilot must remain visibly non-production and must not select future runtime database, graph, ontology, or exchange technology.

## Decision

Use a constrained YAML profile as the human-authored source format for Sprint-016 candidate records. YAML is selected because the bounded records require nested provenance and relationship structures while remaining readable in pull-request diffs. The project MUST define deterministic authoring rules and mechanically validate the profile before any candidate may be reviewed for promotion.

A JSON Schema MAY later be proposed as the machine-validation contract for this YAML profile. ADR-009 does not create or approve that schema. Generated JSON, SQLite, RDF, or other projections are disposable artifacts and never manually edited sources of truth.

## Scope and candidate status

This decision applies only to the Rice pilot described in [Rice Pilot Specification](../master-data/RICE_PILOT_SPECIFICATION.md). Every file and record MUST carry Candidate status and remain isolated from production datasets. Acceptance of this ADR authorizes a pilot format, not agricultural content, production identifiers, promotion, or runtime ingestion.

## Source-of-truth and file organization

The future authoring root is `data/candidates/rice/`, with one YAML file per candidate item under an entity-type directory and one YAML file per relationship statement under `relationships/`. This sprint does not create that path.

Filenames use a validated candidate identifier, not a Thai, English, or scientific label. A candidate item appears exactly once. Generated indexes, reverse relationships, JSON, databases, reports, and graph projections MUST declare their generator/input revision and MUST NOT be edited as authority.

## Record granularity and identifiers

An entity/context file represents one candidate identity. A relationship file represents one subject-predicate-object assertion with its own evidence, context, uncertainty, and review status. Entity files may reference relationship candidate identifiers but MUST NOT duplicate relationship facts inline.

Candidate identifiers are non-production review handles allocated under an approved Sprint-016 registry rule. They MUST be visibly candidate-only, opaque or minimally semantic, label-independent, unique, non-reused, and non-resolvable as published identities. This ADR allocates no identifiers and does not decide production syntax.

## Labels, provenance, and relationships

- Labels are ordered objects containing value, language, script, role/status, provenance, and ambiguity where applicable. Scientific names are authority-governed nomenclatural forms, not translations.
- Provenance identifies source-register reference, source version/date status, exact evidence locator, extraction/paraphrase method, access date, curator, and review history.
- Relationships contain candidate statement identity, subject, controlled predicate, object/value, context, evidence references, confidence/uncertainty basis, temporal/jurisdictional applicability, and review status.
- Label equality MUST NOT create identity or relationship equivalence. Relationships MUST NOT silently imply causation, diagnosis, regulation, safety, or recommendation.

## Missing and contested values

Plain YAML nulls (`null`, `~`, or an empty value) are prohibited in authored candidates. An omitted optional field means “not supplied.” A required or conditional field without a resolved value uses an explicit object with one of `unknown`, `not_applicable`, or `disputed`, plus reason, source/reviewer status, and resolution action. `not_applicable` requires a scope justification. `disputed` preserves competing values and their separate evidence; it is never resolved by last-write-wins.

## Ordering and deterministic serialization

UTF-8 without BOM, LF line endings, two-space indentation, explicit quoted strings for dates and YAML-ambiguous scalars, ISO 8601 dates, and a documented top-level key order are required. Mapping keys are unique. Lists with semantic order retain that order; set-like lists sort by stable candidate/source identifier. Anchors, aliases, custom tags, merge keys, duplicate keys, and implicit timestamps are prohibited. A future validator/formatter must fail rather than silently rewrite meaning.

## Human review and validation

Pull requests show the authored YAML, source assessment, and review decisions. Mechanical checks must cover parse safety, permitted keys/value states, identifier uniqueness and references, required fields, controlled statuses, deterministic ordering, source/evidence references, language metadata, and relationship shape. Mechanical success is not domain, taxonomy, rights, regulatory, or architecture approval.

## Generated-artifact policy

Generated projections are reproducible, clearly labeled, excluded from manual curation, and either untracked or committed only under a separately approved release policy. Candidate validation MUST NOT modify frozen code, schemas, official sources, golden baselines, or candidate inputs. No generated artifact may be promoted merely because it validates.

## Alternatives considered

- **CSV:** excellent simple diffs, but unsuitable as the sole source for nested provenance, multilingual forms, value-state objects, and first-class relationships.
- **JSON:** precise machine interchange, but noisier for sustained human authoring and comments/rationale; it remains a possible generated exchange form.
- **JSON Lines:** useful for streaming independent flat records, but weak for manual review of nested multi-file provenance and relationship changes.
- **SQLite:** strong constraints/querying, but binary diffs and manual-edit risks make it unsuitable as pilot authoring truth.
- **RDF/Turtle:** expressive for relationships, but would prematurely select graph semantics and tooling before ontology/runtime decisions.
- **Unconstrained YAML:** rejected because implicit typing, aliases, duplicate keys, and ordering ambiguity undermine deterministic review.

## Consequences and migration

The pilot gains readable nested records and auditable statement granularity, at the cost of a strict profile and future validator work. Sprint-016 must approve a minimal template/validation contract before authoring. Migration to another source format must preserve candidate identities, explicit value states, labels, provenance, relationships, review history, and deterministic equivalence, with a reviewed migration report.

## Future runtime neutrality

YAML is an authoring decision only. Future runtime storage, API and exchange formats, SQL/SQLite, document stores, graph databases, RDF, JSON-LD, and other technologies remain deferred to later evidence and ADRs.

## Relationship to Design Freeze

The proposal changes no parser, exporter, database schema, validation implementation, official IRAC dataset, golden baseline, runtime, test, or dependency. Any implementation affecting frozen components requires separate approval.
