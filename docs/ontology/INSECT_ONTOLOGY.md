# Insect Ontology

## Purpose and boundary

The Insect Ontology covers insect and other arthropod organisms that may act as pests, beneficial organisms, vectors, or neutral organisms in a stated context. A role is contextual: taxonomic identity alone does not prove pest status, economic significance, causality, or the need for treatment.

## Core concepts

| Concept | Meaning and important relationships |
| --- | --- |
| ArthropodTaxon | A source-versioned taxonomic identity at a stated rank and status. |
| LifeStage | An organism stage in a governed lifecycle vocabulary, observed or inferred with method and confidence. |
| Morphology | Structural features observed or sourced for a taxon/stage; useful for identification but not identical to it. |
| FeedingGuild | A sourced functional grouping by feeding behavior, with scope and source vocabulary. |
| DamageMechanism | A supported mechanism by which an organism can affect a host or organ under stated conditions. |
| HostRelationship | A scoped relationship between organism and host crop/taxon, organ, stage, geography, season, and evidence. |
| OrganismRole | Pest, beneficial, vector, or other role in a defined ecological/agronomic context. Multiple roles may coexist. |
| VectorRelationship | A supported relationship among vector, transmitted agent, host, route, place, and time; presence does not prove transmission in a case. |
| PopulationObservation | A case-bound count, estimate, sampling result, stage composition, distribution, or activity record with method and unit. |
| InfestationLevel | A contextual measurement or interpreted category tied to sampling method, area/unit, crop stage, and uncertainty. |
| InsecticideSusceptibilityClaim | A population- and method-specific response claim with ingredient, exposure, conditions, evidence, and time. |
| ResistanceClaim | A versioned population-level claim with compound/Mode-of-Action scope, confirmation method, geography, evidence, and review status. |
| OrganismIdentification | A diagnostic conclusion about taxon and stage, with evidence, alternatives, confidence, and status. |

## Required distinctions

- **Organism observation:** what organism or feature was seen, sampled, counted, or imaged.
- **Crop damage observation:** what damage was recorded on the crop or organ.
- **Identification:** a reviewed interpretation of organism identity.
- **Causal attribution:** a supported conclusion that an organism caused a finding; co-occurrence alone is insufficient.
- **Economic significance:** a context-specific assessment using population, crop, stage, expected impact, thresholds, uncertainty, and dated local economics.
- **Treatment recommendation:** a separate decision after identification/diagnosis, significance, IPM, evidence, regulation, safety, economics, and operations are assessed.

An organism may be present without causing observed damage. Damage may have multiple causes. A beneficial organism MUST NOT be treated as a pest solely because both share a taxonomic group. Treatment response or failure MUST NOT alone prove original identification or resistance.

## Key relationships

- ArthropodTaxon **has life stage**, **may exhibit morphology**, and **may have feeding guild** under a source vocabulary.
- Organism **uses host** and **damages crop organ** only through scoped, evidence-backed relationships.
- OrganismRole **applies in** crop, ecosystem, stage, location, and time context.
- Vector **may transmit** causal agent through a supported VectorRelationship; a case requires separate evidence.
- PopulationObservation **supports or contradicts** identification, infestation, causality, significance, susceptibility, or resistance claims.
- InfestationLevel **is measured or assessed from** a named method; category thresholds require their own source and context.

## Relationship to IRAC

A future implementation could reference the current IRAC model through a versioned statement such as an active ingredient **has IRAC Mode-of-Action classification**, with IRAC identity, source version, and provenance. That mapping would connect treatment/evidence concepts to the authoritative classification without altering IRAC groups, chemical classes, ingredients, parser output, or frozen schema.

IRAC classification does not establish organism identification, local susceptibility, resistance status, efficacy, registration, label permission, safety, or recommendation. Any new mapping or source version requires separate approved implementation work.
