# Canonical Concepts, Terminology, and Relationships

## Disease Concepts and Terms

Disease Concepts `CO-RDC-001/v1` through `CO-RDC-016/v1` follow the inventory
order, except `RAGGED-STUNT` reuses `CO-RDW1-003/v1` and `YELLOW-ORANGE` reuses
`CO-RDW1-001/v1`. Each disease has one governed Thai label and one Source-provided
English label where present, yielding 32 Terminology records
`TM-RDC-001/v1` through `TM-RDC-032/v1`. Alternative Thai terminology is attached
to the same Concept; it never creates a per-Source duplicate.

The 22 supporting Concepts `CO-RDC-AUX-001/v1` through
`CO-RDC-AUX-022/v1` represent only explicitly named pathogen, vector, plant-organ,
stage, spread, or environmental-factor identities needed by accepted edges. No
scientific name absent from the Sources is added. Total Concepts in this corpus:
38, including the two reused disease identities.

## Relationships

`RL-RDC-001/v1` through `RL-RDC-032/v1` are exact source-supported edges. Each
disease has one `source-describes-cause` edge and one additional supported edge
selected from `has-observed-symptom`, `affects-organ`, `associated-with-stage`,
`transmitted-by`, `spread-by`, or `influenced-by`. Every edge cites the applicable
`CL-RDC-*` and `EV-RDC-*` versions.

`source-describes-cause` is deliberately source-attributed where nomenclature or
etiologic framing differs. `transmitted-by` does not mean insect causal organism.
Observation relationships do not imply that observing a feature confirms a
Diagnosis. Management adjacency creates no efficacy or treatment edge.
