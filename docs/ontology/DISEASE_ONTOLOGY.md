# Disease Ontology

## Purpose and boundary

The Disease Ontology defines concepts for plant disease, causal agents, host response, manifestations, transmission, and diagnostic conclusions. It preserves uncertainty between a field finding and causal explanation. It does not integrate a disease dataset, provide a fungicide recommendation, or claim FRAC support.

## Core concepts

| Concept | Meaning and important relationships |
| --- | --- |
| Disease | A governed disease concept with names, host scope, manifestations, causal model, and source/version; distinct from one diseased plant or case. |
| CausalAgent | The biological or abiotic agent asserted to contribute causally, with relationship type, evidence, and scope. |
| PathogenTaxon | A source-versioned taxonomic identity for a potentially pathogenic organism. Pathogenic role is contextual. |
| DiseaseComplex | A disease concept involving multiple interacting causes or agents; components and causal roles remain explicit. |
| Host | A crop/taxon/instance capable of participating in a scoped host relationship; presence and susceptibility are separate claims. |
| SusceptiblePlantOrgan | A plant organ related to a disease/agent for a defined host stage, infection stage, context, and evidence. |
| DiseaseCycle | A sourced conceptual sequence of survival, transmission, infection, colonization, reproduction, or other stages; not a case timeline unless observed. |
| InfectionStage | A stage in an identified disease process, observed or inferred with method and confidence. |
| Sign | Directly observable evidence of a causal organism or its structure/product, recorded with method and interpretation boundary. |
| Symptom | A host response or abnormal state that may have multiple causes. |
| Syndrome | A governed co-occurring pattern of symptoms/signs, not automatically a disease or confirmed cause. |
| PredisposingCondition | A condition associated with increased likelihood/severity under stated evidence; it is not necessarily a cause. |
| TransmissionRoute | A supported route by which an agent may move between sources/hosts, with medium, vector if any, context, and evidence. |
| Vector | An organism/entity participating in transmission; detection does not prove transmission in a case. |
| DiseaseHypothesis | A candidate explanation linking findings, host, context, and a possible disease/cause. |
| FieldDiagnosis | A diagnostic conclusion based on field evidence with confidence, alternatives, limitations, and verification requirement. |
| LaboratoryConfirmation | A result from a named method, specimen, laboratory/process, time, quality controls, interpretation, and scope. |
| ConfirmedDiagnosis | A conclusion meeting a defined verification criterion; confirmation method and residual limitations remain visible. |
| DifferentialDiagnosis | A compared set of candidate causes with evidence for, against, and missing for each. |

## Required distinctions

- **Symptom:** a host response, not the causal organism or disease name.
- **Sign:** observed evidence more directly associated with an agent, but still subject to identity and method review.
- **Causal organism:** an organism identity; its presence does not alone prove it caused the disease in the case.
- **Disease name:** a governed concept/label, not a diagnosis of a particular case.
- **Disease hypothesis:** a possible explanation awaiting comparison and verification.
- **Laboratory confirmation:** a method-specific evidence result, not an unlimited universal conclusion.
- **Field diagnosis:** a contextual interpretation that may remain preliminary or probable.
- **Treatment recommendation:** a separate decision requiring sufficient diagnosis plus evidence, regulation, safety, alternatives, economics, and application context.

## Relationships and diagnostic use

- PathogenTaxon **may cause** Disease only through a source-backed CausalClaim with host and applicability scope.
- Disease **affects host**, **may affect organ**, and **manifests symptom/sign** through evidence-backed statements.
- Symptom or Sign **is observed on** PlantOrgan in an Observation; the observation does not itself assert Disease.
- PredisposingCondition **supports likelihood of** a disease hypothesis but does not prove it.
- Vector **may transmit** CausalAgent through a versioned VectorRelationship.
- Field and laboratory evidence **supports or contradicts** candidate diagnoses; missing evidence remains explicit.

Abiotic disorders and mixed causal models MAY be represented as candidate causes without being mislabeled as pathogen taxa. Disease complexes MUST preserve each asserted component and uncertainty rather than hiding them behind one undifferentiated label.

## Future relationship to FRAC

A later approved integration could reference a versioned FRAC classification for a relevant active ingredient or fungicide Mode of Action. Such a mapping would remain separate from pathogen identity, diagnosis, local susceptibility, resistance, efficacy, registration, label conditions, safety, and recommendation.

CP-MoAKB does not currently claim FRAC data, parsing, classification support, or currency. FRAC source registration, licensing, modeling, mapping, validation, and implementation would require separate approval and MUST NOT modify the existing IRAC model implicitly.
