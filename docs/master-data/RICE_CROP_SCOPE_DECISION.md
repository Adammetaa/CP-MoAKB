# Rice Pilot Crop Scope Decision

- Status: Governance scope defined; Agricultural Domain and Taxonomy approval pending
- Decision date: 2026-07-14
- Applies to: the one future Tranche A Crop candidate

## Decision

The future Crop entity represents **cultivated rice as an agricultural crop concept in the Thailand-first pilot**, anchored to the accepted species taxon *Oryza sativa* L. It is neither identical to the taxon nor restricted to one field, season, production system, variety, or cultivar.

The local Crop identity therefore combines two separately governed assertions:

1. a taxonomic identity anchor to *Oryza sativa* L.; and
2. an agricultural scope statement covering rice cultivated as a crop in Thailand.

The taxon anchor is a classification reference, not the complete Crop identity. POWO and IPNI do not by themselves establish cultivated status, Thai production context, or the local Crop boundary.

## Included and excluded scope

| Topic | Decision |
| --- | --- |
| *Oryza sativa* L. | Included as the accepted taxonomic anchor, subject to Taxonomy Review. |
| Cultivated rice | Included as the agricultural concept, subject to Agricultural Domain Review. |
| Rice grown in Thailand | Included as pilot geographic and production context, not as a separate taxon or a claim that all *O. sativa* is grown in Thailand. |
| Wild or weedy *O. sativa* | Excluded from the Crop concept; identity may share the species anchor, but agricultural role differs. |
| Wild relatives such as *O. rufipogon* | Excluded and deferred as separate organism identities. |
| African rice, *Oryza glaberrima* | Excluded; it is a different species and would require a separate Crop decision. |
| Hybrids and breeding material | Deferred; parentage and taxonomic treatment require their own identity model. |
| Subspecies, variety groups, landraces, varieties, and cultivars | Deferred; none is silently subsumed as a separately asserted identity, even when instances fall within *O. sativa*. |
| Field, planted stand, seed lot, harvested grain, or product | Excluded; these are instances, materials, or products, not the governed Crop reference entity. |

## Crop versus Crop Taxon

`Crop` is a human agricultural-use concept with geographic and production context. `Crop Taxon` is the biological classification anchor. The future record may map the Crop to the taxon using an explicit `taxonomic_anchor` classification entry, but equality, synonymy, or universal crop role must not be inferred. Agricultural statements attach to the Crop; accepted name, authorship, rank, and taxonomic placement attach to the taxon reference.

## Claim authority

- POWO RDP-SRC-013 controls accepted-name status, rank, and placement at the recorded access date.
- IPNI RDP-SRC-014 controls the scientific-name string, authorship, publication citation, and LSID.
- Thai Rice Department RDP-SRC-016 supports the bounded assertion that rice is cultivated and produced in Thailand in rainfed and irrigated contexts.
- JKI RDP-SRC-010 directly prints the English heading “rice” with *Oryza sativa* L. in the rice key, but does not define the local Crop concept.

Taxonomic facts require Taxonomy Reviewer approval. Cultivated role, Thai production scope, and Crop boundary require Agricultural Domain Reviewer approval. Combining those reviews is necessary; neither substitutes for the other.

## Label status

- English `rice`: source-backed common label, proposed preferred; Agricultural Domain Review required.
- Thai `ข้าว`: directly observed in RDP-SRC-016, proposed source-backed preferred; Thai Terminology and Agricultural Domain Review required.
- Scientific name *Oryza sativa* L.: authority-backed nomenclatural form and taxon anchor, not an English or Thai translation and not a Crop preferred label.
- Alternative or regional forms: deferred until individually sourced, language-tagged, scoped, and reviewed.

This decision defines the scope and authority split for specialist approval. It does not create the Crop record or approve any cultivar, production recommendation, regulatory statement, or relationship.
