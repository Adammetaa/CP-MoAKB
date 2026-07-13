# Dataset Boundaries

Future master data should use separately governed logical partitions even if a later physical format stores some together.

| Partition | Boundary |
| --- | --- |
| Reference concepts | Stable local entities and lifecycle state. |
| Labels and language forms | Preferred/alternative forms, language, script, status, and provenance. |
| Taxonomic mappings | Reviewed mappings to versioned external authority records. |
| Crop-stage systems | System-specific stages, order, scope, and separately reviewed crosswalks. |
| Descriptive characteristics | Governed descriptors, definitions, units or value constraints. |
| Host and pest relationships | Contextual host, pest, weed, stage, organ, and damage statements. |
| Disease and causal-agent relationships | Evidence-bearing disease, pathogen, and causality statements. |
| Symptom and sign relationships | Descriptive associations kept separate from diagnostic inference. |
| Source metadata | Publisher, document, version, publication/retrieval data, rights, and extraction metadata. |
| Evidence and provenance | Claim-level support, contradiction, method, quote/location reference, and review. |
| Regulatory data | Jurisdiction- and effective-date-specific legal facts. |
| Safety data | Hazard, exposure, constraint, and authority-specific safety statements. |
| Recommendations | Decision outputs with independent evidence, regulation, safety, IPM, and context gates. |
| Private cases and observations | Access-controlled field events, images, people, locations, and operational details. |

A single flat table would duplicate labels and sources, obscure many-to-many relationships, collapse statement context into entity attributes, encourage silent overwrites, and leak private or time-bound data into public reference content.

## Publication boundary

Reviewed reference concepts, permissible labels, non-restricted source metadata, and approved descriptive relationships may eventually be public. Source text, images, or derived content require rights review. Regulatory and safety statements require current authoritative review. Recommendations require separate approval. Raw field cases, personal data, precise locations, restricted media, unpublished operations, and reversible private-to-public links remain private or access-controlled.
