# Controlled Vocabulary Governance

## Purpose and status

This documentation defines how future CP-MoAKB controlled vocabularies should be proposed, reviewed, changed, quality-checked, and released. A controlled vocabulary governs the language used to label and describe concepts consistently; it is a **language layer, not a truth layer**.

Sprint-014 is documentation-only. It creates no vocabulary records, glossary, curated terms, runtime enums, identifiers, ontology structures, database objects, APIs, graph models, or serializations. The required examples illustrate governance problems only and are not accepted vocabulary content.

## Scope boundaries

| Artifact | Purpose | Vocabulary boundary |
| --- | --- | --- |
| Vocabulary | Governs preferred and alternative language used for concepts within a declared scope. | Does not prove the concept, assertion, diagnosis, regulation, or recommendation is true. |
| Ontology | Defines concepts, distinctions, and relationship meaning. | Vocabulary labels ontology concepts but MUST NOT redefine their semantics. |
| Identifier | Provides stable identity independent of display language. | A term points to an identity; the label MUST NOT become the identifier. |
| Taxonomy | Organizes concepts into a classification hierarchy. | Vocabulary can label nodes but does not establish hierarchy or taxonomic authority. |
| Dataset | Publishes a versioned collection of records/assertions. | A vocabulary release is distinct from any dataset release using it. |
| Knowledge graph | Connects governed identities and evidence-bearing statements. | Vocabulary provides labels for navigation; it is not the graph or its truth/provenance model. |

The [Ontology Foundation](../ontology/README.md) defines conceptual meaning, while the [Knowledge Identifier Strategy](../identifiers/README.md) governs identity. Evidence and source policies govern support and authority. Regulation remains jurisdiction- and time-specific. Vocabulary MUST NOT replace any of these layers.

## Documents

- [Vocabulary Governance](VOCABULARY_GOVERNANCE.md)
- [Future Term Model](TERM_MODEL.md)
- [Term Lifecycle](TERM_LIFECYCLE.md)
- [Term Review Process](TERM_REVIEW_PROCESS.md)
- [Multilingual Policy](MULTILINGUAL_POLICY.md)
- [Synonym Policy](SYNONYM_POLICY.md)
- [Term Change Policy](TERM_CHANGE_POLICY.md)
- [Quality Criteria](QUALITY_CRITERIA.md)
- [Release Policy](RELEASE_POLICY.md)

## Future compatibility

The governance model is intended to remain conceptually compatible with SQL tables, REST representations, graph databases, RDF, OWL, SKOS, and JSON-LD. Compatibility means that identity, labels, language/script, definitions, provenance, status, relationships, and releases can be represented without changing their governed meaning.

No listed technology is selected, implemented, or required. SQL does not make a term relational truth; REST does not define identity; graph storage does not prove a relationship; and RDF/OWL/SKOS/JSON-LD serializations do not replace evidence, review, or governance. Physical representation requires a future architecture decision.

## Explicit non-goals

This sprint does not:

- construct a crop, pest, disease, symptom, safety, diagnostic, question, product, or Mode-of-Action vocabulary;
- assign preferred terms, identifiers, definitions, synonyms, or mappings to real domain concepts;
- import, scrape, normalize, or curate external terminology;
- change the frozen IRAC hierarchy, codes, labels, parser, validator, exporter, schema, data, or baseline;
- create CSV, JSON, YAML, RDF, OWL, Turtle, JSON-LD, SHACL, SKOS, database, API, or graph artifacts; or
- treat vocabulary acceptance or publication as scientific, regulatory, safety, or recommendation approval.
