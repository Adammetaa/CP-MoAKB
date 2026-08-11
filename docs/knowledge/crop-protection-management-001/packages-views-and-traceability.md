# Package, View, and Traceability Integration

`CKP-CPM-001/v1` composes nine Management Options, eighteen Active Ingredient
Concepts, eighteen authority-specific MoA relationships, failed-control question
set, registration boundary and four unresolved issues. `WV-CPM-001/v1` is its Thai-first
Website View. It references rather than duplicates the 16 disease, 19 insect and
8 weed CKPs.

Traceability paths remain separate:

- Management: `Website/SP Assistant -> WV-CPM-001/v1 -> CKP-CPM-001/v1 ->
  MO-CPM-* -> Claim -> existing Evidence -> technical Source -> exact locator`.
- Classification: `Website/SP Assistant -> View -> Active Ingredient ->
  authority relationship -> authority-specific MoA Claim -> exact Evidence ->
  IRAC v11.5, FRAC 2026 or HRAC 2026 + exact locator`.
- Regulation: `Website/SP Assistant -> regulatory limitation ->
  GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1 -> targeted identity search result`.
  No AI-to-registration/use edge is created because a full record/use chain was
  not safely bound.

The Website view leads with non-chemical categories, then presents classification
reference separately from historical chemical context and the registration layer.
Internal IDs remain secondary disclosure, not the main visual hierarchy.

Architecture Review confirms no new architecture family, schema, parser, registry,
Runtime Core, API, backend, database, AI, product mapping, commercial scoring,
Diagnosis, Recommendation, or Design Freeze change.
