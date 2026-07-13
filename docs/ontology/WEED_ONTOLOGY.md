# Weed Ontology

## Purpose and boundary

The Weed Ontology defines concepts for plants considered weeds in a stated crop, habitat, management, place, and time context. “Weed” is a contextual role, not an intrinsic taxonomic rank. This document creates no herbicide recommendation, susceptibility fact, or resistance designation.

## Core concepts

| Concept | Meaning and important relationships |
| --- | --- |
| WeedTaxon | A source-versioned plant taxonomic identity that may play a WeedRole in context. |
| WeedRole | The contextual classification of a plant as unwanted or interfering for a stated purpose. |
| CommonName | A language- and region-qualified name; it may be ambiguous and does not replace scientific identity. |
| LifeCycle | A governed classification such as a sourced life-history category, with scope and uncertainty. |
| Morphology | Observed or sourced structural characteristics used in description or identification. |
| GrowthStage | A stage according to a cited scale, including observation method and confidence. |
| Habitat | Environmental and land-use context in which an organism is observed or reported. |
| CropAssociation | A scoped statement that the weed occurs with or affects a crop in a defined context. |
| CompetitionContext | Crop, weed population, resources, timing, density, distribution, and environmental conditions relevant to a competition claim. |
| PropagationMethod | A sourced or observed mechanism of reproduction/dispersal with stage and context. |
| HerbicideSusceptibilityClaim | A statement about response under specified organism identity, population, ingredient/product, dose/use, method, environment, and time. |
| ResistanceStatusClaim | A versioned claim about a defined population, herbicide or Mode-of-Action scope, confirmation method, evidence, geography, and review status. |
| WeedObservation | A case-bound observation of a plant, population, morphology, distribution, abundance, or response. |
| WeedIdentification | A reviewed conclusion linking observations to a taxon at a stated confidence and diagnostic status. |

## Identification and claim boundaries

An observed plant or image is not a confirmed identification. Identification evidence may include morphology, reproductive structures, measurements, images, expert review, or an approved verification method; the record MUST retain alternatives, missing features, confidence, and taxonomic scope.

The following remain distinct:

- **weed identification evidence:** supports or contradicts taxonomic identification;
- **herbicide Mode-of-Action classification:** an authority/version-specific classification of an active ingredient or action, not a response prediction;
- **resistance evidence:** supports a population-specific resistance claim under a stated method and scope;
- **regulatory product permission:** current legal use for an exact product, crop, target/use pattern, jurisdiction, and time; and
- **treatment recommendation:** a later decision that also requires problem significance, alternatives, evidence, safety, label, economics, and operational context.

Observed survival after treatment MUST NOT by itself establish resistance. Classification similarity MUST NOT establish susceptibility. Permission MUST NOT be inferred from scientific evidence or another jurisdiction.

## Key relationships and context

- WeedTaxon **has name**, **has sourced life cycle**, and MAY **exhibit morphology**.
- WeedObservation **records** growth stage, distribution, population measure, habitat, crop association, region, season, and method.
- WeedRole **applies in** a field/production context.
- Weed **competes with** crop only through an evidence-backed CompetitionClaim with time, density, crop stage, weed stage, environment, and outcome scope.
- PropagationMethod **applies to** a taxon/population under stated evidence and context.
- Observation **supports or contradicts** WeedIdentification, HerbicideSusceptibilityClaim, or ResistanceStatusClaim without becoming the claim.

Future herbicide classification references require an approved official source integration and mapping design. No herbicide vocabulary or dataset is integrated by this sprint.
