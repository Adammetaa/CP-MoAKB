# Rice Pilot Growth-Stage Framework Decision

- Status: Selected for Tranche A planning
- Decision date: 2026-07-14
- Decision owner: Chief Architect governance
- Applies to: Rice pilot candidate preparation only

## Decision classification

This is a bounded domain-governance decision under [ADR-008](../ARCHITECTURE_DECISIONS/ADR-008-canonical-master-data-before-domain-dataset-expansion.md) and [ADR-009](../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md), not a new architecture decision. It selects a pilot vocabulary source without changing platform architecture, runtime technology, schema, or future cross-crop stage modeling. A later platform-wide stage-model decision would require its own ADR.

## Selected framework

The pilot selects the rice key in **Growth stages of mono- and dicotyledonous plants: BBCH Monograph**, edited by Uwe Meier, Julius Kühn-Institut (JKI), Quedlinburg, 2018, DOI `10.5073/20180906-074619`, ISBN `978-3-95547-071-5`.

The official locator is <https://www.julius-kuehn.de/en/jki-publication-series/bbch-scale/p>; the official English PDF locator is <https://www.julius-kuehn.de/media/Veroeffentlichungen/bbch%20epaper%20en/page.pdf>. The publication declares CC BY 4.0. The framework is stable, internationally recognized, explicitly includes rice, and provides coded principal stages suitable for precise framework-specific identity.

## Tranche A pilot subset

The following eight principal stages are the complete planned Tranche A subset. They are planning labels, not candidate records or allocated identifiers.

| BBCH principal stage | Official English label used for planning |
| --- | --- |
| 0 | Germination |
| 1 | Leaf development |
| 2 | Tillering |
| 3 | Stem elongation |
| 4 | Booting |
| 5 | Inflorescence emergence / heading |
| 6 | Flowering / anthesis |
| 8 | Ripening |

Principal stage 7 (development of fruit) and principal stage 9 (senescence) remain part of the selected framework but are outside this eight-stage pilot subset. Their omission is a scope decision, not a merge, assertion of equivalence, or alteration of BBCH.

## Assessment summary

| Criterion | Finding |
| --- | --- |
| Issuing authority | JKI, Germany's Federal Research Centre for Cultivated Plants. |
| Purpose and applicability | Standardized phenological coding across crops, with a rice-specific key; applicable as a reference framework rather than local agronomic advice. |
| Granularity | Principal and secondary stages; Tranche A intentionally uses only eight named principal stages. |
| Definitions and boundaries | Published in the rice key; exact boundary wording and page layout require human visual verification before candidate authoring. |
| Version and stability | Citable 2018 monograph with DOI and ISBN. |
| Thai compatibility | Concepts can be mapped for review, but Thai Rice Department terminology is not presumed equivalent. |
| Multilingual feasibility | Codes stabilize framework identity; Thai labels require separately sourced or explicitly editorial mappings. |
| Rights | CC BY 4.0 permits attributed reuse; this pilot is limited to identifiers, concise normalized labels, and paraphrased structured facts. |
| Eight-stage suitability | Eight principal stages provide a bounded establishment-to-ripening subset without inventing hybrid stages. |

## Labels and mappings

- BBCH codes and English principal-stage labels are source-derived.
- Thai preferred labels are not translations supplied by BBCH. They remain provisional editorial mappings until supported by an approved item-level Thai source and reviewed by qualified agricultural and language reviewers.
- IRRI and Thai Rice Department stage systems remain separate framework identities. Their labels must not be silently merged with BBCH stages.
- A cross-framework mapping, if later needed, is a separately evidenced relationship with mapping type, direction, version, reviewer, and uncertainty. Label similarity alone is insufficient.

## Change control

Stage identities are framework- and edition-specific. A new BBCH edition or changed rice key requires a new source assessment, explicit version comparison, and review of every affected label, boundary, and mapping. Existing candidate history must be retained; changes are not applied by silent overwrite.

## Entry limitation

This decision selects the framework but does not authorize candidate authoring. The official PDF's rice pages still require recorded human visual review, Thai labels remain blocked, and the [Tranche A entry checklist](SPRINT_016_TRANCHE_A_ENTRY_CHECKLIST.md) remains controlling.
