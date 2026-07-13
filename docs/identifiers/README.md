# Knowledge Identifier Strategy

## Purpose and status

Stable identifiers allow future CP-MoAKB knowledge to remain traceable when labels, source versions, languages, classifications, and review decisions change. Identity governance also keeps an entity separate from an observation, evidence record, interpretation, diagnosis, regulatory fact, safety constraint, or recommendation.

Sprint-013 is documentation-only. It defines identity policy for future design review; it does not implement an identifier service, assign identifiers to real knowledge entities, create a controlled vocabulary, or alter current IRAC identifiers. Every example in these documents is illustrative and non-operational.

## Architectural relationships

- **Sprint-012 ontology:** identifier categories provide stable handles for the conceptual entities, cases, observations, statements, and relationships in the [Ontology Foundation](../ontology/README.md). They do not approve ontology content or change proposed [ADR-005](../ARCHITECTURE_DECISIONS/ADR-005-layered-conceptual-ontology-before-physical-implementation.md).
- **Future controlled vocabularies:** identity rules are a prerequisite for governed terms. [Controlled Vocabulary Governance](../vocabulary/README.md) defines the future language-review, change, quality, and release process without creating vocabulary records or reserving numeric ranges.
- **Future knowledge graph:** stable identities and reviewed mappings support graph-ready relationships, but no graph storage, serialization, or resolver exists.
- **Evidence and provenance:** an identifier makes a statement addressable; it does not make it true. Evidence, source versions, assertion context, review history, and mappings remain separately attributable.
- **Field cases:** private case, observation, image, person, farm, and precise-location identities remain in the governed Field Vault. A public curated or anonymized identifier MUST NOT expose a private identifier when linkage creates privacy or confidentiality risk.
- **Regulation and external authorities:** CP-MoAKB may later map local identities to source-owned classification, taxonomy, registration, label, or legal identifiers. The external authority retains ownership; mappings require evidence, jurisdiction, time, and review.
- **Current IRAC pipeline:** frozen IRAC codes and deterministic version-scoped export IDs remain unchanged. This strategy neither reassigns nor declares them to be the future universal identifier format.

## Documents

- [Identifier Principles](IDENTIFIER_PRINCIPLES.md)
- [Namespace Policy](NAMESPACE_POLICY.md)
- [Label and Synonym Policy](LABEL_AND_SYNONYM_POLICY.md)
- [External Reference Policy](EXTERNAL_REFERENCE_POLICY.md)
- [Identifier Lifecycle](IDENTIFIER_LIFECYCLE.md)

## Explicit non-goals

This strategy does not:

- add runtime classes, enums, schemas, migrations, dependencies, data records, serializations, or resolution infrastructure;
- select UUIDs, sequential numbers, public URIs, a permanent domain, RDF, JSON-LD, relational storage, or graph/ontology technology;
- register an external namespace or claim control over an external authority;
- assign identifiers to crops, taxa, pests, diseases, symptoms, products, registrations, or field records;
- merge identities from string similarity or create live external mappings; or
- authorize publication of private field, personal, location, image, or operational data.

Physical format, minting services, resolver deployment, controlled-vocabulary content, and source integration require later approved decisions.
