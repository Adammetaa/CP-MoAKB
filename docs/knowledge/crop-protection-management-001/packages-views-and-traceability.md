# Package, View, and Traceability Integration

`CKP-CPM-001/v1` composes the seven Management Options, six Active Ingredient
Concepts, six authority-specific MoA relationships, failed-control question set,
registration boundary and six unresolved issues. `WV-CPM-001/v1` is its Thai-first
Website View. It references rather than duplicates the 16 disease, 19 insect and
8 weed CKPs.

Traceability paths remain separate:

- Management: `Website/SP Assistant -> WV-CPM-001/v1 -> CKP-CPM-001/v1 ->
  MO-CPM-* -> Claim -> existing Evidence -> technical Source -> exact locator`.
- Classification: `Website/SP Assistant -> View -> Active Ingredient ->
  RL-IRAC-CPM-* -> CL-MOA-CPM-* -> EV-IRAC-CPM-* -> IRAC v11.5 + PDF page`.
- Regulation: `Website/SP Assistant -> regulatory limitation ->
  GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1`. No AI-to-registration/use edge is created.

The Website view leads with non-chemical categories, then presents classification
reference separately from historical chemical context and the registration layer.
Internal IDs remain secondary disclosure, not the main visual hierarchy.

Architecture Review confirms no new architecture family, schema, parser, registry,
Runtime Core, API, backend, database, AI, product mapping, commercial scoring,
Diagnosis, Recommendation, or Design Freeze change.
