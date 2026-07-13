# Rice Pilot Taxonomic and Nomenclatural Authority Policy

- Status: Approved for Tranche A governance
- Date: 2026-07-14
- Scope: authority selection and review rules; no organism records or mappings are created

## Distinctions that must remain explicit

- An **accepted name** is the name adopted for a taxonomic concept by a named authority at a stated version/date.
- A **scientific-name string** is a nomenclatural form and authorship, not proof of accepted status or organism identity.
- A **nomenclatural authority** records publication, authorship, type, and standing under the applicable code.
- A **taxonomic concept** is an authority's circumscription at a version/date; matching name strings may denote changed concepts.
- An **external identifier** is a mapping target in another authority, never the local identity.
- A **synonym** or **historical name** is versioned, directional authority evidence; neither is deleted nor silently promoted.
- **Organism identity** is distinct from a field observation, strain, isolate, cultivar, or common label.
- An **agricultural role** such as crop, weed, pathogen, pest, vector, or beneficial organism is contextual and separately evidenced.

## Authority matrix

| Organism group | Selected authority and role | Status and review rule |
| --- | --- | --- |
| Cultivated rice taxon | Plants of the World Online (POWO) for accepted taxon concept/status; International Plant Names Index (IPNI) for name string, authorship, original publication, and LSID | **Selected for Tranche A.** Record source version/access date and mapping type. Neither authority proves cultivar identity or cultivated role. |
| Other plant and weed taxa | POWO for accepted vascular-plant concept; IPNI for nomenclature. A current specialist flora may supplement geographic concepts. | **Selected policy.** Every taxon still needs item-level verification. Weed role requires separate production-context evidence. |
| Fungi | MycoBank for registered nomenclatural details; an identified current specialist taxonomic treatment or Species Fungorum/Index Fungorum record for accepted concept | **External Review Required.** No fungal authority record is approved in Tranche A; a mycology/taxonomy reviewer must select and version the concept authority per organism. |
| Bacteria and archaea | List of Prokaryotic names with Standing in Nomenclature (LPSN) for nomenclatural standing, correct name, type, and citation; current primary taxonomic literature for disputed circumscriptions | **Selected policy, not activated.** LPSN is not evidence of pathogenicity, host association, or strain identity. Specialist review is required when first used. |
| Viruses | International Committee on Taxonomy of Viruses (ICTV) Master Species List and Taxonomy Browser at an explicitly recorded release | **Selected policy, not activated.** Use the current ratified release and preserve historical mappings. ICTV taxonomy does not prove isolate identity, host association, or disease causality. |
| Insects and other arthropods | A taxon-specific, current specialist catalog selected by the Taxonomy and Entomology Reviewers; Catalogue of Life may be a discovery/cross-check source only | **Blocked until an organism is selected.** No single authoritative catalog has been approved for all pilot arthropods. GBIF/Catalogue of Life matches cannot by themselves establish the accepted concept. |
| Molluscs and other non-arthropod invertebrates | A current specialist catalog such as MolluscaBase/WoRMS when the relevant group is selected; Catalogue of Life only for discovery/cross-check | **Blocked until an organism is selected** and the specialist authority/version is assessed. |
| Birds | A current specialist global or national checklist selected for the named taxon and geographic scope | **Blocked until an organism is selected.** Checklist edition and treatment must be approved; common-name matching is insufficient. |
| Rodents and other mammals | A current specialist mammal authority selected for the named taxon, supplemented by national evidence where geographic concepts differ | **Blocked until an organism is selected.** Versioned specialist and geographic review required. |
| Other animal pests | The closest specialist authority for the organism group, selected before candidate authoring | **Blocked by default.** Catalogue of Life and GBIF are discovery/cross-check tools, not automatic concept authorities. |

## Authority-role rationale

POWO explicitly distinguishes accepted taxonomic status from IPNI's nomenclatural index role. LPSN is selected for prokaryotic nomenclature because it documents names with standing and related nomenclatural information. ICTV is selected because its ratified Master Species List is the official current virus taxonomy by release. Catalogue of Life integrates many sources and acknowledges variable completeness and quality; GBIF uses an integrated management taxonomy. Both are valuable for discovery and reconciliation, but neither replaces a named specialist authority where a concept is disputed or high-stakes.

Primary authority and role documentation:

- POWO record and Kew backbone role: <https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:316812-2>
- IPNI scope: <https://www.ipni.org/about>
- MycoBank: <https://www.mycobank.org/>
- Index Fungorum / Species Fungorum: <https://www.indexfungorum.org/>
- LPSN scope and citation guidance: <https://lpsn.dsmz.de/>
- ICTV Master Species List: <https://ictv.global/msl>
- Catalogue of Life release and quality statement: <https://www.catalogueoflife.org/>
- GBIF taxonomy interpretation: <https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation>
- MolluscaBase: <https://www.molluscabase.org/>

## Verification record requirements

Every applicable candidate must preserve organism group, asserted name, rank, accepted/synonym/historical status, authority identifier, authority role, authority release or access date, exact record locator, mapping type, concept uncertainty, and Taxonomy Reviewer decision. The review must also state what the authority does not establish.

Automated or label-based matches remain unresolved until a qualified reviewer confirms them. Conflicting authorities are retained as separate attributed assertions; no last-write-wins merge is allowed.

## Tranche A decision

For the Rice Crop candidate, RDP-SRC-013 (POWO) controls accepted-name status and placement, while RDP-SRC-014 (IPNI) controls nomenclatural facts. This resolves authority selection, but candidate authoring remains blocked until a named qualified Taxonomy Reviewer and Agricultural Domain Reviewer are assigned and cultivated-rice scope evidence is approved.
