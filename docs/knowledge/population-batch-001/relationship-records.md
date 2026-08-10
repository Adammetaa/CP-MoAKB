# Accepted Relationship Records

Status: Accepted as source-classification assertions; not published

## Predicate Boundary

`has source-classified cause category` means only that the fixed Source places
the target category within its two-category organization of plant-disease causes.
It does not assert that a category caused a particular disease, Observation, or
field case. No inverse, transitive, diagnostic, or recommendation edge follows.

## RL-KPB-001/v1

- Source Concept: `CO-KPB-001/v1`
- Predicate: `has source-classified cause category`
- Target Concept: `CO-KPB-002/v1`
- Direction: plant disease -> nonliving-cause category
- Support: `CL-KPB-002/v1` -> `EV-KPB-002/v1` -> `P37-S3-A`, item 3.1
- Risk: non-causal classification edge; case-level causal use prohibited.

## RL-KPB-002/v1

- Source Concept: `CO-KPB-001/v1`
- Predicate: `has source-classified cause category`
- Target Concept: `CO-KPB-003/v1`
- Direction: plant disease -> living-cause category
- Support: `CL-KPB-002/v1` -> `EV-KPB-002/v1` -> `P37-S3-A`, item 3.2
- Risk: non-causal classification edge; case-level causal use prohibited.

No relationship is inferred from adjacency, labels, package membership, or
Website navigation.
