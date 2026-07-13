# Canonical Agricultural Master Data Foundation

## Purpose and status

Canonical agricultural master data provides governed reference entities and relationships for future CP-MoAKB datasets. It is needed so labels, evidence-bearing statements, field observations, diagnoses, and recommendations can refer to stable, reviewable concepts without becoming the concepts themselves.

Sprint-015 is documentation-only. It creates no production records, identifiers, runtime models, schemas, or physical dataset format. The catalogs describe future record types, not accepted agricultural facts.

Master data provides governed reference entities and relationships. It does not prove that a field diagnosis is correct and does not independently authorize a recommendation.

## Architectural relationships

- The [Ontology Foundation](../ontology/README.md) defines conceptual meaning; master data would instantiate approved concepts within bounded datasets.
- The [Identifier Strategy](../identifiers/README.md) governs durable identity; labels and external identifiers remain separate.
- [Vocabulary Governance](../vocabulary/README.md) governs language forms; accepting a label does not validate an entity or assertion.
- [Source Authority](../source-authorities/README.md), evidence, and provenance support statements at the appropriate claim, jurisdiction, and time.
- Future knowledge statements may connect governed entities with contextual evidence. A knowledge graph is only a possible representation, not proof.
- The decision engine may consume reviewed statements, but diagnosis, regulation, safety, and recommendation remain separate gates.
- Private observations, images, locations, and case data remain in the Field Vault unless independently cleared and promoted under [Field Knowledge Policy](../FIELD_KNOWLEDGE_POLICY.md).

## Documents

- [Master Data Principles](MASTER_DATA_PRINCIPLES.md)
- [Master Data Scope](MASTER_DATA_SCOPE.md)
- [Entity Catalog](ENTITY_CATALOG.md)
- [Relationship Catalog](RELATIONSHIP_CATALOG.md)
- [Dataset Boundaries](DATASET_BOUNDARIES.md)
- [Curation Workflow](CURATION_WORKFLOW.md)
- [Quality Standard](QUALITY_STANDARD.md)
- [Versioning and Release](VERSIONING_AND_RELEASE.md)
- [Rice Domain Pilot Plan](RICE_DOMAIN_PILOT_PLAN.md)
- [Sprint-016 Rice Pilot Specification](RICE_PILOT_SPECIFICATION.md)
- [Rice Pilot Source Register](RICE_PILOT_SOURCE_REGISTER.md)
- [Rice Pilot Reviewer Matrix](RICE_PILOT_REVIEWER_MATRIX.md)
- [Candidate Record Envelope](CANDIDATE_RECORD_ENVELOPE.md)
- [Candidate-to-Production Gate](CANDIDATE_TO_PRODUCTION_GATE.md)
- [Sprint-016 Execution Plan](SPRINT_016_EXECUTION_PLAN.md)

## Explicit non-goals

This foundation does not create a complete Rice Domain dataset, approve source-derived facts, mint identifiers, select storage technology, integrate external classifications, publish private evidence, create diagnostic rules, or provide regulatory, safety, product, pesticide-use, or treatment advice.
