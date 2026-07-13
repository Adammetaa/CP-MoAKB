# ADR-007: Controlled Vocabulary Governance Before Vocabulary Construction

- Status: Proposed
- Date: 2026-07-13
- Decision owners: CP-MoAKB Product Owner, Chief Architect, vocabulary stewardship, and domain governance

## Context

Future CP-MoAKB concepts need clear, multilingual, source-backed labels and definitions across crop protection, diagnosis, safety, regulation, evidence, questions, economics, and operations. Constructing vocabulary records before defining authority, term structure, review, ambiguity, change, quality, and release rules could turn labels into accidental identities, collapse distinct concepts, obscure source ownership, or imply that accepted terminology is scientific or regulatory truth.

Sprint-012 documented proposed ontology concepts, and Sprint-013 documented proposed stable-identity governance. ADR-005 and ADR-006 remain Proposed. A vocabulary layer needs its own governance boundary before any terms are curated or implemented.

## Decision

Define and review controlled-vocabulary governance before constructing any new CP-MoAKB controlled vocabulary.

Future vocabulary work must preserve stable concept identity, ontology meaning, evidence/provenance, external authority, multilingual review, ambiguity, lifecycle/change history, quality gates, and release independence. Vocabulary governs language only. It must not redefine ontology, identifier, evidence, regulation, safety, diagnosis, or recommendation.

The conceptual review path is Draft → Terminology Review → Domain Review → Architecture Review → Accepted → Published, with language, evidence, regulatory, privacy, and license review added where applicable.

## Rationale

- Governance before content prevents label strings from becoming unreviewed identity or equivalence rules.
- Separate terminology, language, domain, evidence, regulatory, and architecture reviews expose different kinds of error.
- Explicit ambiguity and synonym classification prevent automatic merging across Thai, English, scientific, local, and commercial language.
- Change and release policy preserves historical use, provenance, stable identity, and consumer migration.
- Technology-neutral rules allow later SQL, REST, graph, RDF, OWL, SKOS, or JSON-LD representations without selecting one prematurely.

## Consequences

- No production controlled vocabulary should be constructed until its scope, authority, reviewers, acceptance criteria, and release process are approved.
- Vocabulary work requires qualified language and domain review in addition to technical review.
- Accepted terms may remain unpublished until release quality gates pass.
- Vocabulary releases must be governed independently from software, ontology, dataset, and source releases.
- Ambiguous, near, broader, and narrower lexical relationships require explicit handling and cannot silently merge identities.
- Current runtime, IRAC terminology, data, schema, and release behavior remain unchanged.

## Alternatives considered

### Build a glossary first and add governance later

Not selected because early terms would acquire de facto authority without stable identity, review, provenance, or reversible change history.

### Treat ontology concept names as the controlled vocabulary

Not selected because ontology labels support architecture discussion but are not reviewed multilingual production terms, and ontology semantics are distinct from language governance.

### Import an external vocabulary unchanged

Not selected because external authority, license, scope, version, language coverage, mappings, and local-use suitability require review; CP-MoAKB cannot claim external ownership.

### Let automated normalization select preferred terms and synonyms

Not selected because spelling/frequency cannot resolve concept scope, ambiguity, translation, taxonomic meaning, regulation, or regional usage reliably.

## Explicit non-decisions

This proposal does not decide:

- any production term, preferred label, definition, synonym, or vocabulary identifier;
- a vocabulary file format, database schema, API, validation shape, or runtime model;
- a permanent URI, resolver, or public deployment;
- SQL, graph, RDF, OWL, SKOS, JSON-LD, or other physical technology;
- an automated review or translation system; or
- a vocabulary version-number scheme.

## Relationship to ADR-005 and ADR-006

[ADR-005](ADR-005-layered-conceptual-ontology-before-physical-implementation.md) remains Proposed and separates conceptual ontology layers before physical implementation. [ADR-006](ADR-006-stable-identifiers-before-controlled-vocabularies.md) remains Proposed and defines identity-governance prerequisites. ADR-007 complements them by governing language associated with those conceptual identities. It does not accept, supersede, or implement either proposal.

## Scope

This proposal governs future CP-MoAKB vocabulary scope, term metadata, multilingual forms, synonyms, ambiguity, review, lifecycle, change, quality, and release practices. It creates no vocabulary content or production artifact.

## Relationship to Design Freeze

This ADR is documentation-only. It changes no parser, exporter, schema, validation logic, official source/dataset, golden baseline, test, or generated artifact. Any later implementation affecting frozen components requires separate explicit approval.

Related documents: [Controlled Vocabulary Governance](../vocabulary/README.md), [Vocabulary Governance](../vocabulary/VOCABULARY_GOVERNANCE.md), [Knowledge Identifier Strategy](../identifiers/README.md), and [Ontology Foundation](../ontology/README.md).
