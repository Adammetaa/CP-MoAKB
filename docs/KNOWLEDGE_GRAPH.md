# Conceptual Knowledge Graph

## Status and purpose

The knowledge graph is a future conceptual integration model. It is not implemented, no graph database technology has been selected, and this document does not authorize a schema migration. Its purpose is to describe how governed identities, assertions, relationships, evidence, regulation, observations, and decisions could be connected without losing provenance or context.

This direction is governed by [ADR-003](ARCHITECTURE_DECISIONS/ADR-003-knowledge-graph-is-conceptual-not-yet-implemented.md) and uses the vocabulary in the [Conceptual Domain Model](DOMAIN_MODEL.md).

## Node categories

Conceptual node categories include:

- **Biological entities:** Crop, Variety, PlantPart, Insect, Mite, Nematode, Weed, Pathogen, Disease, and life stages.
- **Phenomena and context:** GrowthStage, Symptom, Sign, PhysiologicalProcess, abiotic cause, EnvironmentalCondition, and Measurement.
- **Management knowledge:** ManagementOption, MonitoringMethod, IPMProgram, EconomicThreshold, and management-practice types.
- **Chemical knowledge:** ActiveIngredient, ModeOfAction, TargetSite, ChemicalClass, ResistanceGroup, Formulation, and Mixture.
- **Regulatory knowledge:** CommercialProduct, Registration, Label, ApprovedCrop, ApprovedTarget, and label-defined constraints.
- **Safety and environment:** Hazard, ExposureRoute, safety constraint, EnvironmentalRisk, NonTargetOrganism, and WaterProtectionConstraint.
- **Evidence and provenance:** Source, SourceVersion, Citation, EvidenceAssertion, review action, and ProvenanceRecord.
- **Field records:** Field, Observation, ImageObservation, ObservationLocation, ApplicationRecord, and follow-up outcome.
- **Economics and operations:** price observation, cost scenario, ROIModel, DronePlatform, Nozzle, spray parameter, and WeatherWindow.

A node may carry multilingual display labels, but identity must not be based solely on a label.

## Edge categories

Edges express typed assertions rather than unqualified links. Candidate relationship types include:

| Relationship | Conceptual meaning |
| --- | --- |
| `hasGrowthStage` | Crop or biological entity uses a governed growth-stage concept. |
| `hasPlantPart` | Crop is associated with an anatomical concept. |
| `exhibitsSymptom` | Host, PlantPart, or Observation exhibits a Symptom. |
| `showsSign` | Observation records a direct Sign. |
| `attacks` | Biotic pest attacks a Crop or PlantPart in a stated context. |
| `causes` | Evidence supports a causal relationship; stronger than association. |
| `indicates` | A finding raises a possible cause without establishing it. |
| `differentialOf` | A possible cause belongs to a differential set for a finding or case. |
| `affects` | One entity affects a biological entity, process, or target. |
| `inhibits` / `activates` | A sourced directional biological effect. |
| `hasModeOfAction` | ActiveIngredient is classified under a ModeOfAction. |
| `hasTargetSite` | ModeOfAction or ActiveIngredient is associated with a TargetSite. |
| `belongsToChemicalClass` | ActiveIngredient belongs to a versioned ChemicalClass. |
| `containsActiveIngredient` | CommercialProduct or Mixture contains an ActiveIngredient. |
| `registeredForCrop` | Registration permits a product for a crop in a jurisdiction and period. |
| `registeredForTarget` | Registration permits a product for a target in a jurisdiction and period. |
| `hasApplicationRate` | Label defines a legal rate statement; the value is never inferred. |
| `requiresPPE` | Label or official rule defines PPERequirement. |
| `hasPHI` / `hasREI` | Label defines the respective interval. |
| `managedBy` | Target may be managed by a supported ManagementOption. |
| `preventedBy` | Practice may reduce occurrence or risk under stated conditions. |
| `monitoredBy` | Pest, condition, or threshold is evaluated with a MonitoringMethod. |
| `supportedBy` | Assertion is supported by evidence or a SourceVersion. |
| `contradictedBy` | Assertion is challenged by evidence or another assertion. |
| `observedIn` | Observation or finding occurred in a Field, locality, or context. |
| `validInJurisdiction` | Regulatory assertion is scoped to a jurisdiction. |
| `supersedes` | A newer version or assertion explicitly replaces an earlier one. |

Inverse links may be derived for navigation, but the authoritative assertion direction and provenance must remain unambiguous.

## Assertion metadata and provenance

Graph relationships that convey knowledge must retain:

- **source:** the organization, publication, label, dataset, expert record, or observation origin;
- **source version:** the exact edition, release, label version, or immutable representation;
- **retrieval or publication date:** when the source was obtained or published, with the distinction preserved;
- **validity period:** effective start and end dates when the assertion is time-bound;
- **reviewer status:** machine-extracted, human-reviewed, domain-approved, disputed, or another governed status;
- **jurisdiction:** the country or regulatory authority for legal assertions;
- **confidence:** a governed expression of uncertainty, not an unexplained numeric score; and
- **assertion type:** scientific, regulatory, observational, interpretive, or recommendation-related.

Without this metadata, the graph cannot answer whether a link is current, legal, reviewed, locally applicable, or merely observed. Provenance should attach to the assertion or edge itself, not only to its endpoint nodes.

## Confidence and review status

Confidence represents uncertainty within a specific assertion and context. It must record its method or rationale. Review status represents workflow state and authority; it is not a synonym for confidence. A high-confidence machine extraction can still require human review, while a domain-approved assertion may retain scientific uncertainty.

Allowed review statuses are defined in [Evidence Levels](EVIDENCE_LEVELS.md). Conflicting assertions remain separately addressable and can use `supportedBy` and `contradictedBy` links.

## Temporal and regulatory validity

Taxonomy, classification, regulation, labels, prices, and recommendations can change on different schedules. The graph therefore needs assertion-level effective dates and supersession links. A current query should not erase historical truth; it should select the version valid for the requested time and expose later supersession where relevant.

Regulatory facts require:

- an explicit jurisdiction;
- an official source and version;
- registration or label identity;
- effective and expiry dates where available;
- current review status; and
- a retrieval date appropriate to the decision.

Scientific evidence cannot be used as a substitute for legal permission. Registration indicates legal permission only under the applicable label conditions, not guaranteed field performance.

## Jurisdiction

Jurisdiction is mandatory for legal-use assertions and optional only where an assertion is genuinely jurisdiction-independent. Future Thai product and application guidance must use current official Thai sources and labels. Cross-jurisdiction statements remain distinct even when product or active-ingredient names appear similar.

## Versioning and supersession

- SourceVersion records are immutable.
- Corrections create a new version or provenance event; they do not silently replace source content.
- `supersedes` identifies deliberate replacement and preserves the earlier record.
- Classification mappings retain the issuing authority and classification version.
- A recommendation, if ever implemented, retains the versions of every material input used at decision time.

## Multilingual labels and synonyms

Entities may have Thai, English, scientific, and source-specific labels. Each label should retain:

- language and script;
- label type, such as preferred, common, scientific, historical, or source-specific;
- source and source version;
- jurisdiction or community where relevant;
- validity or review status; and
- the stable entity identity to which it maps.

Thai common names must not be assumed unique. Scientific names require authority and taxonomic context where available. Synonyms are mappings with provenance, not duplicate entities merged by spelling alone. Homonyms remain separate identities.

## Entity identity rules

1. Assign stable internal identifiers independent of display names.
2. Use authoritative external identifiers when available, but retain the issuing source and version.
3. Do not merge entities on normalized text alone.
4. Represent uncertain identity as an explicit candidate mapping with review status.
5. Preserve historical and deprecated identities with `supersedes` or governed mappings.
6. Keep commercial product identity jurisdiction- and registration-aware.
7. Keep Observation identity separate from the entity or cause it may describe.

## Worked conceptual example: rice and an insect pest

This example illustrates graph structure only and does not provide a pesticide recommendation or application rate.

1. A **Crop** node for rice `hasPlantPart` a leaf concept and `hasGrowthStage` a governed stage concept.
2. A field **Observation** `observedIn` an anonymized Field records leaf damage and `exhibitsSymptom` a governed Symptom.
3. The Observation also records distribution, date, weather context, and an image with consent and provenance.
4. The Symptom `indicates` several possible causes. One candidate is an insect-pest identity that may `attacks` rice, supported by an authoritative biological source.
5. The candidate remains `differentialOf` the case until discriminating Signs or measurements are reviewed. The observation does not create a `causes` assertion automatically.
6. Relevant MonitoringMethods and non-chemical ManagementOptions may be connected with `monitoredBy`, `managedBy`, or `preventedBy`, each carrying evidence and context.
7. Any later chemical-option evaluation would separately require current Thai registration, official label, safety, resistance, and IPM checks. None is inferred from the pest identity or IRAC classification.

## Current IRAC authority and freeze

The current repository's IRAC v11.5 hierarchy is the authoritative canonical classification for its approved scope. Its parser behavior, hierarchy, golden baseline, semantic validation, exporter layouts, and canonical counts remain frozen. A future graph may reference those governed IRAC identities and their source version, but it must not reinterpret, repair, extend, or replace the hierarchy without a separately approved source-registration and design process.

The graph concept does not make IRAC a recommendation system. IRAC classification identifies Mode of Action relationships; it does not establish crop registration, target suitability, label conditions, field efficacy, safety, or economic value.

## Architectural gates

Implementation would require approved decisions on identity, assertion storage, temporal queries, provenance granularity, multilingual governance, privacy, review workflows, and physical technology. Until those gates are accepted through [Architecture Decisions](ARCHITECTURE_DECISIONS/README.md), this document remains conceptual.
