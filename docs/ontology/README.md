# Ontology Foundation

## Purpose and status

This documentation defines a shared conceptual vocabulary for the future CP-MoAKB **Explainable Crop Protection Intelligence Platform**. It aligns crop, weed, insect, disease, safety, diagnostic, and question concepts so later designs can remain explainable, traceable, and evidence-based.

Sprint-012 is documentation-only. No ontology runtime, physical data model, inference engine, curated ontology dataset, or public field-case collection is implemented. The concepts are proposals for architecture and domain review, not approved agronomic facts or operating guidance.

## Architectural relationships

- **Current IRAC pipeline:** the frozen parser, in-memory model, validator, exporter, schema, official source, and golden baseline remain unchanged. A future insect or treatment model may reference an IRAC identity and version through an evidence-backed mapping; it MUST NOT reinterpret or modify the existing IRAC hierarchy.
- **Future knowledge graph:** these documents refine the conceptual entities and relationships described in [Knowledge Graph](../KNOWLEDGE_GRAPH.md). They do not select graph technology or claim that graph persistence exists.
- **Identity governance:** the [Knowledge Identifier Strategy](../identifiers/README.md) defines how future concepts, records, labels, namespaces, and external mappings can remain stable and reviewable without assigning operational identifiers.
- **Future decision engine:** the [Decision-Support Workflow](../DECISION_ENGINE.md) may consume reviewed statements from these domains. Diagnostic output alone is not a recommendation, and recommendation remains behind evidence, regulation, safety, IPM, operational, and economic gates.
- **Evidence and sources:** statements follow [Source Policy](../SOURCE_POLICY.md) and [Evidence Levels](../EVIDENCE_LEVELS.md). Source authority, assertion-level support, uncertainty, scope, time, jurisdiction, and review status remain distinct.
- **Private Field Vault:** raw observations, images, notes, personal information, precise locations, and unreviewed cases MUST remain outside the public repository. Their future custody and publication path is described below and governed by [Field Knowledge Policy](../FIELD_KNOWLEDGE_POLICY.md).

## Field-knowledge lifecycle

```text
Private Field Vault
→ Structured Cases
→ Reviewed Cases
→ Domain Approved
→ Curated Dataset
→ Knowledge Base
```

This is the custody and publication lifecycle. It complements the evidence-promotion stages in Field Knowledge Policy: corroborated patterns and candidate knowledge assertions are review activities between Reviewed Cases and Domain Approved. Domain approval applies to a versioned assertion for a defined use; it does not publish private source material automatically. Promotion requires consent, privacy, licensing, provenance, evidence, and domain-governance checks at every applicable gate.

## Documents

- [Shared Ontology Principles](ONTOLOGY_PRINCIPLES.md)
- [Crop Ontology](CROP_ONTOLOGY.md)
- [Weed Ontology](WEED_ONTOLOGY.md)
- [Insect Ontology](INSECT_ONTOLOGY.md)
- [Disease Ontology](DISEASE_ONTOLOGY.md)
- [Safety Ontology](SAFETY_ONTOLOGY.md)
- [Diagnostic Ontology](DIAGNOSTIC_ONTOLOGY.md)
- [Question Ontology](QUESTION_ONTOLOGY.md)

## Explicit non-goals

This foundation does not:

- add code, database objects, migrations, dependencies, serialization, validation shapes, or graph-runtime files;
- choose RDF, OWL, JSON-LD, relational, document, search, or graph technology;
- publish scientific, regulatory, safety, diagnostic, or agronomic claims;
- integrate FRAC, herbicide classification, taxonomic, regulatory, label, or field datasets;
- create treatment recommendations or an automated diagnostic or conversation engine; or
- authorize collection, export, or publication of raw/private field data.

Physical modeling, technology selection, controlled-vocabulary approval, source integration, and production use each require separate review and future decisions.
