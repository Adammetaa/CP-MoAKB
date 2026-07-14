# Canonical Agricultural Master Data Foundation

## Purpose and status

Canonical agricultural master data provides governed reference entities and relationships for future CP-MoAKB datasets. It is needed so labels, evidence-bearing statements, field observations, diagnoses, and recommendations can refer to stable, reviewable concepts without becoming the concepts themselves.

Sprint-015 and its readiness follow-ups are documentation-only. They create no production records, allocated identifiers, runtime models, schemas, or physical datasets. The catalogs describe future record types, not accepted agricultural facts.

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
- [Tranche A Item-Level Source Assessment](RICE_TRANCHE_A_SOURCE_ASSESSMENT.md)
- [Rice Growth-Stage Framework Decision](RICE_GROWTH_STAGE_FRAMEWORK_DECISION.md)
- [BBCH Rice-Key Visual Review](RICE_BBCH_VISUAL_REVIEW.md)
- [Rice Crop Scope Decision](RICE_CROP_SCOPE_DECISION.md)
- [Tranche A Plant-Organ Selection](RICE_TRANCHE_A_PLANT_ORGAN_SELECTION.md)
- [Tranche A Thai-Label Policy](RICE_TRANCHE_A_THAI_LABEL_POLICY.md)
- [Rice Pilot Taxonomic Authority Policy](RICE_PILOT_TAXONOMIC_AUTHORITY_POLICY.md)
- [Rice Pilot Candidate Identifier Rule](RICE_PILOT_CANDIDATE_IDENTIFIER_RULE.md)
- [Rice Pilot Validation Contract](RICE_PILOT_VALIDATION_CONTRACT.md)
- [Tranche A Nested Validation Profile](RICE_TRANCHE_A_NESTED_VALIDATION_PROFILE.md)
- [Rice Pilot Reviewer Matrix](RICE_PILOT_REVIEWER_MATRIX.md)
- [Tranche A Reviewer Nomination Register](RICE_TRANCHE_A_REVIEWER_NOMINATION_REGISTER.md)
- [Tranche A Review Assignment Matrix](RICE_TRANCHE_A_REVIEW_ASSIGNMENT_MATRIX.md)
- [Tranche A Thai Terminology Review Package](RICE_TRANCHE_A_THAI_TERMINOLOGY_REVIEW_PACKAGE.md)
- [Tranche A Plant-Structure Review Sheet](RICE_TRANCHE_A_PLANT_STRUCTURE_REVIEW_SHEET.md)
- [Tranche A Crop-Scope Review Sheet](RICE_TRANCHE_A_CROP_SCOPE_REVIEW_SHEET.md)
- [Tranche A BBCH Terminology Review Sheet](RICE_TRANCHE_A_BBCH_TERMINOLOGY_REVIEW_SHEET.md)
- [Tranche A Product Owner Action Guide](RICE_TRANCHE_A_PRODUCT_OWNER_ACTION_GUIDE.md)
- [Sprint-016 Tranche A Entry Checklist](SPRINT_016_TRANCHE_A_ENTRY_CHECKLIST.md)
- [Candidate Record Envelope](CANDIDATE_RECORD_ENVELOPE.md)
- [Candidate-to-Production Gate](CANDIDATE_TO_PRODUCTION_GATE.md)
- [Sprint-016 Execution Plan](SPRINT_016_EXECUTION_PLAN.md)

## Explicit non-goals

This foundation does not create a complete Rice Domain dataset, approve source-derived facts, mint identifiers, select storage technology, integrate external classifications, publish private evidence, create diagnostic rules, or provide regulatory, safety, product, pesticide-use, or treatment advice.
