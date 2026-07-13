# Crop Ontology

## Purpose and boundary

The Crop Ontology defines how future CP-MoAKB designs may identify a cultivated plant and describe its biological, production, field, regional, and temporal context. It supplies host and treatment context to other domains; it does not contain unreviewed agronomic recommendations or assert that any product is suitable.

All statements follow [Shared Ontology Principles](ONTOLOGY_PRINCIPLES.md). Terms below are conceptual and require controlled-vocabulary and domain review before implementation.

## Core concepts

| Concept | Meaning and important relationships |
| --- | --- |
| Crop | A cultivated plant concept for a defined production purpose; linked to a ScientificTaxon and governed names. |
| ScientificTaxon | A source-versioned taxonomic identity, rank, scientific name, authorship where needed, and taxonomic status. |
| CommonName | A language- and region-qualified label, including Thai and English names; not a stable identity or proof of taxonomic equivalence. |
| CultivarOrVariety | A governed cultivated-plant identity within an applicable nomenclature system. It is distinct from species and from one planted population. |
| GrowthStage | A stage in a cited crop-specific or interoperable scale, with scale version and observed/estimated status. |
| PlantOrgan | A governed anatomical concept on which a symptom, sign, organism, residue, damage, or treatment relevance may be stated. It aligns conceptually with the broader `PlantPart` in the domain model. |
| ProductionSystem | Context such as production setting or management system, described without inferring practice quality. |
| CroppingSeason | A locally and temporally bounded production period, not merely a calendar label. |
| FieldContext | The governed context of a particular field or protected production area, with privacy-preserving identity and location precision. |
| AgronomicCondition | A measured, observed, or sourced crop/soil/management condition with method, unit, time, and context. |
| PlantedCropInstance | A particular crop population or planting in a field, season, and production system. |
| CropObservation | A case-bound record of what was seen, measured, imaged, or reported about a Crop or PlantedCropInstance. |

## Key relationships

- Crop **has taxon**, **has preferred/common name**, and MAY **have cultivar**.
- PlantedCropInstance **instantiates crop/cultivar**, **occurs in field context**, **has observed growth stage**, and **occurs during cropping season**.
- Crop or cultivar **is susceptible host for** a pest, pathogen, or disease only through a scoped, evidence-backed SusceptibleHostClaim.
- Crop–pest relationship records biological or field association, role, affected organ, stage, region, season, and evidence; it is not a treatment decision.
- Crop–product or treatment relevance records a sourced relationship such as studied context or label-listed use. Legal permission additionally depends on the exact product, crop, target, use pattern, jurisdiction, label version, and time.
- CropObservation **concerns** a crop entity or planting and retains field, regional, temporal, method, observer, and review context.

## Required distinctions

- **Crop species:** a taxon-aligned cultivated concept.
- **Cultivar or variety:** a named cultivated identity within that crop, not a synonym for species.
- **Planted crop instance:** a particular population in a place and season, potentially with mixed or uncertain identity.
- **Field observation:** a contextual statement about the crop/planting, not an intrinsic property of the crop class.

A statement that a crop is a susceptible host MUST name the affected organism/disease, evidence, applicability, and review status. A finding in one planting MUST NOT be generalized to all crops, cultivars, regions, or seasons.

## Cross-domain and evidence constraints

Crop identity and context connect observations to weed competition, insect host/damage relationships, disease host/organ relationships, diagnosis, regulatory crop uses, safety intervals, economics, and application operations. Conflicting taxonomies and names remain separate mappings. Regional or temporal relevance is contextual, not part of immutable crop identity.

No treatment relevance, observed response, or susceptibility statement constitutes a recommendation. A future recommendation requires separate diagnostic, evidence, regulation, safety, economic, and operational review.
