# Tranche A Rice Plant-Organ Selection

- Status: Exact eight selected for governance review; specialist approval pending
- Selection date: 2026-07-14
- Ontology basis: Plant Ontology release `2026-01-09` / Planteome 6.0

The set deliberately contains anatomical entities at declared levels needed for later annotation. It does not pretend that an organ, organ part, reproductive shoot system, and fruit share one anatomical level. They remain eight distinct, non-overlapping candidate identities; tissue, observation-site, harvested-product, and whole-plant concepts are excluded.

| # | Proposed English preferred label | Plant Ontology mapping and label | Anatomical level | Rice applicability and evidence | Proposed Thai status | Inclusion rationale and terminology risk |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | root | `PO:0009005` root | Plant organ / root system member | RDP-SRC-010, rice key p. 23, BBCH 0 describes radicle/root development. | Thai preferred unknown; specialist source/review required. | Foundational below-ground annotation target. Excludes radicle, root hair, root tip, crown root, and root system as separate concepts. |
| 2 | stem | `PO:0009047` stem | Plant organ; primary shoot axis | RDP-SRC-010 pp. 24–25 uses stem in the rice-specific stages 3 and 4. | `ลำต้น` is source-observed in RDP-SRC-017 but provisional pending exact mapping review. | Provides the anatomical anchor for agronomic `culm`; `culm` is not silently asserted as an exact PO label. Excludes internode, node, tiller, and shoot system. |
| 3 | vascular leaf | `PO:0009025` vascular leaf | Plant organ / phyllome | RDP-SRC-010 pp. 23–25 repeatedly identifies rice leaves and flag leaf; rice is a vascular plant. | `ใบ` is source-observed in RDP-SRC-017 but provisional. | Whole leaf target. Excludes leaf sheath and lamina, which are separately selected parts, and excludes flag leaf as a developmental/positional subtype. |
| 4 | leaf sheath | `PO:0020104` leaf sheath | Cardinal organ part of vascular leaf | RDP-SRC-010 p. 25 uses flag-leaf sheath throughout rice stages 4–5; PO defines the structure for Poaceae/monocots. | `กาบใบ` is source-observed in RDP-SRC-017 but provisional. | Common damage/symptom location in rice. Excludes sheath epidermis, ligule, auricle, and pseudostem. |
| 5 | leaf lamina | `PO:0020039` leaf lamina | Cardinal organ part of leaf | RDP-SRC-018 describes the leaf blade in *O. sativa* morphology; PO supplies the exact leaf-lamina identity. | Thai preferred unknown; do not infer from English `blade`. | Distinguishes blade/lamina observations from whole leaf and sheath. Excludes epidermis, vein, margin, and flag-leaf subtype. |
| 6 | panicle inflorescence | `PO:0030123` panicle inflorescence | Reproductive shoot system / inflorescence subtype | RDP-SRC-010 pp. 24–26 repeatedly uses panicle in the rice key; PO explicitly lists rice (*Oryza* spp.) as an example. | `รวง` is source-observed in RDP-SRC-017 but provisional; everyday use may include harvested structures. | Rice reproductive annotation target. Excludes generic inflorescence, panicle axis/branch, raceme, ear, and harvested panicle. |
| 7 | spikelet | `PO:0009051` spikelet | Reproductive shoot system; terminal grass inflorescence unit | RDP-SRC-010 p. 26 uses spikelets in rice flowering; RDP-SRC-018 describes rice spikelets. | Thai preferred unknown; specialist terminology review required. | Supports precise floral/reproductive annotations. Excludes floret, flower, lemma, palea, glume, and caryopsis. |
| 8 | caryopsis fruit | `PO:0030104` caryopsis fruit | Fruit / plant organ | RDP-SRC-010 p. 23 explicitly identifies the dry seed as caryopsis and p. 27 describes grain ripening; PO identifies caryopsis as characteristic of Poaceae. | `เมล็ดข้าว` is source-observed in RDP-SRC-017 but provisional and potentially broader than caryopsis. | Preserves botanical fruit identity separately from grain/product usage. Excludes seed alone, hull, harvested product, brown rice, milled rice, and grain-quality classes. |

## Source and review boundary

RDP-SRC-015 controls PO identifier, English label, definition, and hierarchy. RDP-SRC-010 or RDP-SRC-018 controls rice applicability as cited per row. RDP-SRC-017 only records observed Thai agricultural usage; it does not prove one-to-one equivalence with a PO concept.

Final anatomy and rice-applicability approval requires a Plant Anatomy or Botany Reviewer and Agricultural Domain Reviewer. Taxonomy Review confirms external-authority version and mapping type but does not replace anatomical review. Thai preferred status requires the Thai Terminology Reviewer. Because those roles are unassigned, the exact selection is documented but not authorized for record creation.
