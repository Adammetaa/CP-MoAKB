# Conceptual Entity Catalog

This catalog specifies future entity boundaries; it creates no records. Every entity requires a governed type, identity rationale, labels or label status, definition or structured description, scope, provenance readiness, jurisdiction/time where relevant, review status, and change history.

| Entity | Purpose and inclusion boundary | Exclusions and ambiguity risks | Expected authority and reviewer | Likely relationships |
| --- | --- | --- | --- | --- |
| Crop | A cultivated crop concept used as the host/domain anchor. | Not a planted field instance; species, crop use, and variety may be conflated. | National crop authority plus crop/taxonomy reviewers. | taxon, variety, stage system, organ, host relationships. |
| Crop Taxon | Verified taxonomic mapping for a crop. | Not the local crop concept or an unverified scientific label. | Scientific taxonomic authority; taxonomy reviewer. | maps to crop and external authority. |
| Crop Variety or Cultivar | A named cultivated form with source-backed identity. | Not a species, market label, seed lot, or planted instance. | Breeding/registration authority; crop reviewer. | variety of crop, suitable context. |
| Growth Stage | A node in one identified crop-stage system and version. | Not a free-text observation or silently merged BBCH/local stage. | Stage-system owner and crop reviewer. | belongs to system, applies to crop, precedes/follows stage. |
| Plant Organ | A governed crop-relevant anatomical concept. | Not a symptom location string or specimen instance. | Botanical/crop sources; crop reviewer. | part of crop, bears symptom/sign/damage. |
| Disease | A governed disease concept supported for a host/context. | Not a symptom, causal organism, diagnosis, or case. | National crop/pathology sources; plant pathologist. | affects crop, has causal agent, manifests symptom. |
| Disease Complex | A reviewed disease concept involving multiple or uncertain causes. | Not a bucket for unresolved duplicates. | Plant pathology literature; plant pathologist/evidence reviewer. | component/causal relationships, symptoms. |
| Causal Agent | A role-bearing agent proposed or established as causing disease. | Not automatically identical to a pathogen taxon; causality may be uncertain. | Pathology evidence; pathologist/evidence reviewer. | causes disease, maps to pathogen taxon, produces sign. |
| Pathogen Taxon | Verified identity of a biological pathogen. | Not evidence that the taxon causes a particular disease. | Specialist taxonomic authority; taxonomy reviewer. | external mapping, may act as causal agent. |
| Insect or Arthropod Pest | Organism identity with a reviewed pest role for crop/context. | Not every organism observation; beneficial organisms require distinct roles. | Rice Department plus taxonomy/entomology authority; entomologist. | pest of crop, causes damage, relevant at stage. |
| Other Animal Pest | Non-insect animal with a reviewed crop-pest role. | Not a taxonomic dumping category or observation. | Crop/zoological authority; relevant specialist. | pest of crop, causes damage. |
| Weed | Contextual role of a plant competing with a crop. | Not equivalent to Weed Taxon in every habitat. | Crop/weed authority; weed scientist. | competes with crop in production context. |
| Weed Taxon | Verified plant taxonomic identity. | Taxon alone does not establish weed status. | Botanical taxonomic authority; taxonomy reviewer. | may act as weed, external mapping. |
| Symptom | Host response associated with disease or stress. | Not a pathogen sign, diagnosis, or causal proof. | Plant pathology/agronomy sources; domain reviewer. | manifested by disease, occurs on organ. |
| Sign | Directly observable evidence of a causal organism or its structures. | Not a host response or automatic identification. | Plant pathology sources; pathologist. | produced by causal agent, occurs on organ. |
| Observable Characteristic | Governed descriptor usable in structured observations. | Not the observation event or conclusion. | Domain measurement guidance; domain/terminology reviewers. | characterizes symptom, sign, organism, or damage. |
| Damage Mechanism | The process by which a pest injures a crop. | Not the resulting visible pattern. | Entomology/zoology sources; domain reviewer. | caused by pest, produces damage pattern. |
| Damage Pattern | A governed visible/spatial injury pattern. | Not a mechanism, symptom diagnosis, or field instance. | Crop-protection sources; domain reviewer. | results from mechanism, affects organ. |
| Feeding Guild | Reviewed behavioral classification under a named scheme. | Not a universal trait inferred from a label. | Entomological authority; entomologist. | classifies pest/mechanism. |
| Habitat or Production Context | A governed context qualifying applicability. | Not a field location or private operational record. | National production guidance; agronomist. | qualifies role or relationship. |
| Environmental or Predisposing Factor | A factor reported to alter risk or expression. | Not causality, forecast, or recommendation. | Research/extension evidence; evidence reviewer. | predisposes disease/damage in context. |
| Source | Identity and version metadata for a publication or authority record. | Not evidence quality or blanket authority. | Publisher metadata; Source Curator. | publishes/supports evidence. |
| Evidence | A traceable support or contradiction object for a statement. | Not an entity label, diagnosis, or truth flag. | Evidence policy; Evidence Reviewer. | supports/contradicts statement. |
| Jurisdiction | Governed applicability area for legal or local statements. | Not inferred from publisher location alone. | Official jurisdictional authority; regulatory reviewer. | constrains statement. |
| Review Status | Governed workflow state and responsible decision. | Not an evidence level or truth score. | Governance policy; Data Steward. | qualifies entity/statement/release. |

An external authority record remains source-owned. A local entity may map to it only after evidence-backed identity review; matching labels never establish equivalence.
