# Packages, Website Views, and Traceability

## Package and View Set

The corpus creates `CKP-RDC-001/v1` through `CKP-RDC-016/v1`, one reusable Disease
CKP per inventory subject. Each contains exact Evidence, Claim, Concept,
Terminology, Relationship, review, limitation, and unresolved-issue versions.
Existing Concepts reused from Wave 1 remain members by their existing IDs.

`WV-RDC-001/v1` through `WV-RDC-016/v1` consume the matching CKPs. All are
Thai-first, internal preview, rights-safe, and `not_published`. A view shows only
supported sections; it never renders empty pseudo-content.

## Traceability Invariant

> Website disease card/detail -> `WV-RDC-NNN/v1` -> `CKP-RDC-NNN/v1` ->
> exact Claim -> Evidence A and/or B -> exact governed Source ID -> one-based PDF
> page(s) -> slide heading/context -> bounded passage

Reverse resolution follows the same chain. Multi-Source rows retain both Evidence
chains and do not average, vote, or select a Source silently. Batch 001 and Rice
Disease Wave 1 remain unchanged and resolvable.

Website payloads may contain independently authored summaries, IDs, counts,
source metadata, locators, status, reconciliation state, and limitations. They
exclude Source photographs, diagrams, tables, layout, and bounded passage text.
