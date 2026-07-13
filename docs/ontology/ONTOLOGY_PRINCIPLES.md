# Shared Ontology Principles

## Scope and normative language

These principles apply to every conceptual ontology domain in Sprint-012. **MUST** identifies an architecture invariant, **SHOULD** identifies strong future guidance, and **MAY** identifies an optional design choice. They describe a conceptual model only.

## Core distinctions

| Principle | Conceptual rule |
| --- | --- |
| Stable concept identity | A concept MUST have an identity independent of its display label. Identity changes, merges, splits, and mappings MUST be explicit and versioned. |
| Human-readable labels | Every user-facing concept SHOULD have a preferred readable label appropriate to language and audience. A label is not identity. |
| Synonym vs canonical term | Synonyms, abbreviations, historical names, spelling variants, and local names MUST point to a governed concept and retain language, region, source, and status. They MUST NOT silently create duplicate concepts. |
| Taxonomy vs ontology | A taxonomy classifies concepts in a hierarchy. An ontology also describes typed relationships, constraints, context, and statement meaning. A taxonomic parent MUST NOT be treated as evidence for every other relationship. |
| Entity vs observation | An entity is the thing or concept being described; an observation is a time- and context-bound record about it. An observation MUST NOT silently become an intrinsic property or universal fact. |
| Class/type vs individual/instance | A class describes a category such as crop species or growth stage; an individual is a particular planted crop, organism, field, case, product, or event. Statements MUST make this level clear. |
| Intrinsic vs contextual property | An intrinsic property belongs to a concept under its defining scope. A contextual property depends on crop, field, stage, location, season, management, jurisdiction, time, or use pattern and MUST carry that context. |
| Asserted vs inferred | An asserted fact records what a source or reviewer states. An inferred conclusion is derived through a named method from inputs. Future systems MUST retain the distinction and the derivation. |
| Source-backed statement | A publishable knowledge statement MUST link to evidence and the source version that provides it. Missing support MUST remain visible. |
| Provenance | Statements and transformations MUST identify origin, source version, extraction or authoring method, reviewer history, and applicable custody record. |
| Temporal validity | Time-dependent statements MUST express observation time, effective/valid time, and supersession where applicable. Retrieval time alone does not establish currency. |
| Jurisdictional validity | Legal, registration, label, and many safety statements MUST name the jurisdiction and authority. Scientific relevance from one jurisdiction does not establish legal permission in another. |
| Confidence and uncertainty | Confidence MUST apply to a specific assertion or conclusion, name its basis, and preserve supporting, contradicting, and missing evidence. It MUST NOT be a proxy for evidence level or legal status. |
| Versioning and deprecation | Concepts, vocabularies, statements, mappings, and review decisions MUST be versionable. Deprecation and supersession MUST preserve prior identity, provenance, and links; history is not silently rewritten. |
| Multilingual readiness | Preferred labels and synonyms SHOULD carry language and regional context. The model MUST permit Thai and English without making either display string the identifier. |
| Thai common vs scientific names | A Thai common name is a language- and region-sensitive label; a scientific name is a source-governed taxonomic label. Neither is automatically a one-to-one substitute for the other. Ambiguity and taxonomic version MUST remain visible. |
| Conceptual vs physical model | These concepts MUST remain independent of serialization, database, graph vendor, API, or programming language until a future approved technology decision. |

Observation, evidence, regulation, and recommendation are separate architecture objects. Evidence may support or contradict a statement; regulation determines legal constraints within scope; a recommendation is a later, audited decision output. None may be substituted for another.

## Conceptual statement pattern

Every future knowledge statement SHOULD be expressible as:

```text
Subject
→ Predicate or relationship
→ Object or value
→ Evidence/provenance
→ Context
→ Time validity
→ Jurisdiction
→ Confidence
→ Review status
```

The object may be another concept, an instance, or a typed value with a unit. Context can include crop, organ, growth stage, field, production system, season, method, population, use pattern, or other applicability conditions. This pattern is not a runtime serialization and does not prescribe how records are stored.

## Layered boundary model

| Layer | Responsibility | Must remain distinct from |
| --- | --- | --- |
| 1. Domain entities | Identity and meaning of crops, organisms, diseases, symptoms, products, ingredients, and related concepts. | Reports about an entity or decisions involving it. |
| 2. Observations and cases | What was observed, measured, imaged, or reported in a particular context. | Confirmed facts, causality, or recommendations. |
| 3. Evidence and provenance | Support, contradiction, sources, methods, versions, applicability, and review. | The claim itself and its decision consequence. |
| 4. Diagnostic reasoning | Candidate causes, differential comparison, uncertainty, verification, and conclusion. | Regulatory permission or treatment choice. |
| 5. Regulation | Registration, permitted use, label status, jurisdiction, authority, and effective time. | Scientific evidence or general guidance. |
| 6. Safety | Hazard, exposure, risk assessment, protective controls, and authoritative safety requirements. | Legal permission alone or efficacy. |
| 7. Recommendation | A versioned, explainable decision output with alternatives, constraints, and rationale. | Any single observation, diagnosis, product, or rule. |
| 8. Economics | Dated local cost, value, threshold, loss, and feasibility assumptions. | Biological identity or legal status. |
| 9. Application and operations | Equipment, method, timing, weather, calibration, access, and execution context. | Label authorization or universal settings. |

These layers MUST NOT collapse into a single “recommendation record.” A flattened record would obscure whether a value was observed, sourced, inferred, legally binding, safety-critical, contextual, or chosen. It would also make version changes and contradictory evidence unauditable. A future recommendation must instead reference the diagnostic conclusion, evidence, current regulation and label, safety assessment, economic assumptions, application context, alternatives, and reviewer or decision process used at that time.

## Conceptual cross-domain relationships

The following examples illustrate possible typed statements; they are not implemented facts or curated knowledge:

- crop **hosts** pest;
- pest **damages** crop organ;
- pathogen **causes** disease;
- disease **manifests as** symptom;
- symptom **is observed on** plant organ;
- weed **competes with** crop in a stated context;
- observation **supports** or **contradicts** diagnostic hypothesis;
- question **seeks** missing evidence;
- recommendation **addresses** a confirmed or sufficiently supported problem;
- active ingredient **has** a source-versioned Mode-of-Action classification;
- legal permission **depends on** product, crop, target, use pattern, jurisdiction, and time;
- safety requirement **constrains** application;
- evidence **supports** a statement;
- source **provides** evidence; and
- reviewer **approves** a versioned item of curated knowledge for a defined use.

## Future implementation constraints

A future physical design:

- MUST use stable, namespaced identifiers and explicit cross-vocabulary mappings;
- SHOULD represent relationships in a graph-ready way without assuming graph storage;
- MUST govern controlled vocabularies, preferred labels, synonyms, language, and status;
- MUST retain statement-level provenance, evidence, context, time, jurisdiction, confidence, and review workflow;
- MUST express temporal and jurisdictional facts without overwriting historical states;
- SHOULD define testable validation constraints for identity, cardinality, units, provenance, and required context;
- SHOULD support interoperable exports and mappings without treating external vocabularies as interchangeable; and
- MUST protect private field data throughout review and publication.

Validation shapes or constraint languages MAY be considered later. RDF, OWL, JSON-LD, relational tables, document models, and graph databases remain alternatives; none is selected here. Technology selection requires a future accepted ADR based on approved use cases, governance, licensing, privacy, scale, query, and operational requirements.
