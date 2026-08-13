# Golden Slice Validation 1: Brown Planthopper

Status: Sprint-088R authority resolution validated against repository baseline `91f92182a38efc424c4d0f6e48de09449920fb91`; `not_published`

Validation date: 2026-08-13

## Verdict

Sprint-088R produces a defensible negative current-authority result. Registration `405-2555` is `EXPIRED`: the current Thai Department of Agriculture (DOA) registry page identifies the official listing as updated 16 July 2026, while the governed row for this identity records issue on 23 March 2018 and expiry on 22 March 2024. No cancellation date is recorded, and no current successor registration is bound. Absence of a cancellation or a similar trade name is not treated as proof of current status or lineage.

The DOA Plant Protection Research and Development Office 2023 guidance independently supports the source facts `ข้าว` / rice, exact Brown Planthopper (*Nilaparvata lugens*), pymetrozine 50% WG, and rate **20 g per 20 L water**. It is regulatory-supporting official material, not an approved label for `405-2555`. It exposes no registration number, certificate number, approved-label identifier, trade name, or product-record identifier. Consequently the two official artifacts cannot be joined by a defensible stable identifier.

The current Product / Registration Identity -> Rice -> Brown Planthopper -> Approved Use chain remains `AUTHORITY_BLOCKED`. Crop, target, use-pattern, and rate exist as source facts, but their binding to `405-2555` is `BLOCKED_NO_SHARED_IDENTIFIER`; the matched registration is also expired. Sprint outcome: **`REGULATORY_SOURCE_COVERAGE_GAP`**.

## Sprint-088R regulatory source set

| Source | Authority role | Version / retrieval | Locator | Bounded result |
| --- | --- | --- | --- | --- |
| `GS-DOA-HAZARDOUS-REGISTRY-2026-001/v2` | Thai DOA Agricultural Regulatory Division; regulatory authority | listing updated 2026-07-16; reviewed 2026-08-13 | official hazardous-substance listing landing page; governed 3,501-page snapshot; SHA-256 `8b28fcfa31a40a021645645a33864fe858769af8f2264db22776e549df6916fe` | current listing context; no crop, target, use, or approved-label fields |
| `GS-DOA-HAZARDOUS-REGISTRY-2568-001/v1` | Thai DOA Agricultural Regulatory Division; regulatory authority | 2025-09-15; reviewed 2026-08-13 | row 765 / PDF p.136 | exact `405-2555` product-registration identity; issued 2018-03-23; expired 2024-03-22 |
| `GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1` | Thai DOA Plant Protection Research and Development Office; regulatory-supporting official material | 2023-12; reviewed 2026-08-13 | rice table; BPH group; pymetrozine 50% WG row | exact crop, target, use-pattern, formulation, concentration, and rate facts; no stable product or registration identifier |
| `MS-SYN-PLENUM-001/v1` | manufacturer / commercial source | original version unavailable; retained review lead | `RR-083-TH-DECISION-AUTHORITY-001/v1` | product identity lead only; Manufacturer Claim != Thai Regulatory Approval |

Search-result snippets were navigation aids only and are not Evidence. The official landing page and already-governed snapshots remain the provenance anchors; protected source pages, tables, and layouts are not republished.

## Registration, label, and lineage resolution

- Product identity binding: `SUPPORTED` for เพลนั่ม 50 ดับบลิวจี + Syngenta Crop Protection Co., Ltd. + pymetrozine + 50% + WG + registration `405-2555`.
- Registration current status: `EXPIRED` as of the 2026-07-16 listing context; recorded expiry 2024-03-22.
- Cancellation status: `NOT_RECORDED`; this does not make the registration current.
- Lineage: `NEEDS_REVIEW`. The record retains a registration number from Buddhist year 2555 while listing an issue date in 2018, but the administrative row does not itself classify that event as renewal or establish a replacement. No current successor is bound.
- Official approved label or certificate for `405-2555`: not located.
- Stable identifier binding from the official BPH guidance to `405-2555`: `BLOCKED_NO_SHARED_IDENTIFIER`.
- Rice source fact: `SUPPORTED`; rice-to-registration binding: `AUTHORITY_BLOCKED`.
- Brown Planthopper source fact: `SUPPORTED` with exact Thai, English, and scientific identity; target-to-registration binding: `AUTHORITY_BLOCKED`.
- Use-pattern and 20 g per 20 L water rate facts: `SUPPORTED` only within the 2023 official guidance. They are not a current approved-use assertion for this product and must never be rendered as “use this now.”
- Approved Use binding: `AUTHORITY_BLOCKED`.
- Human Review: `REQUIRED`; Human Review cannot manufacture the missing label identifier, current successor, or legal authorization.

Scientific knowledge establishes biological context only. IRAC Group 9B classifies pymetrozine only. Neither source class establishes Thai registration, crop, target, approved use, efficacy, Case suitability, or recommendation.

The existing multi-source architecture can represent a real Brown Planthopper (`เพลี้ยกระโดดสีน้ำตาล`, *Nilaparvata lugens*) Case and connect it through scientific, management-review, active-ingredient, IRAC, product, manufacturer, Thai registration-identity, Website View, and provenance layers without recommending a product.

The chain is partial at regulatory authority. Product identity and expired registration identity can be bound with explicit limitations, but no governed current official record path shares a stable identifier across product/registration, rice, Brown Planthopper, and approved use. Key B therefore remains `AUTHORITY_BLOCKED`.

## Identity and Case validation

`BIO-BPH` references the existing `rice-insect-corpus-001:BPH` identity rather than creating another canonical biological Concept. The governed identity preserves the Thai and English names, *Nilaparvata lugens*, pest category, rice relationship, alias `BPH`, and Rice Department provenance. Other BPH mentions in disease views are bounded relationship representations, not competing identities; no duplicate exists inside the integration slice.

The representative browser-local human Observation records rice, timestamp `2026-08-13T12:00:00+07:00`, `10 insects_per_plant`, denominator `plant`, and `CURRENT_ACTIVITY_SUPPORTED`. Crop stage is explicitly `NOT_RECORDED`. Limitations remain visible, photographs do not infer burden, and previous reports, damage, or treatment do not become current burden.

The unchanged decision gate produces:

- 8 insects/plant -> `CONTINUE_MONITORING`;
- 10 insects/plant -> `MANAGEMENT_REVIEW_JUSTIFIED`.

At 10 insects/plant the Website View exposes `CHEMICAL_REVIEW_INFORMATION_ONLY`; it selects no product.

## Golden Slice gap register

| Chain Step | Status | Evidence | Gap | Next Resolution |
| --- | --- | --- | --- | --- |
| Field Case | `CONNECTED` | `CASE-087-BPH/v1`; `AS-CASE-BPH-001` | crop stage not recorded; sampling limitation retained | capture stage and repeat count through existing Case/Field Action path if decision-relevant |
| BPH identity | `CONNECTED` | `BIO-BPH` -> `rice-insect-corpus-001:BPH`; `GS-RD-RICE-PESTS-2007-001/v1` | no duplicate in integration slice | retain the canonical reference; review other bounded BPH representations rather than merging silently |
| Scientific knowledge | `CONNECTED` | `AS-SCI-BPH-001`; RD pp.4-7 / PDF pp.15-18 | source scope does not diagnose this Case | preserve Case/scientific separation |
| Current versus historical | `CONNECTED` | `AS-CASE-BPH-001.details` | historical reports cannot establish current burden | retain explicit temporal roles in every Case projection |
| Management Review | `CONNECTED` | `AE-076-BPH-001/v1`; `MANAGEMENT_REVIEW_JUSTIFIED` | threshold has sampling-unit limitations | preserve Human Review and existing threshold wording |
| Active ingredient | `NEEDS_REVIEW` | `AI-PYMETROZINE`; `REL-BPH-PYM` | relationship comes from attributed product lead and does not establish efficacy/suitability | locate independently governed BPH/ingredient evidence if required |
| IRAC | `CONNECTED` | `AS-IRAC-PYM-001`; `GS-IRAC-MOA-11.5-001/v1`; Group 9B | classification does not establish use or efficacy | retain classification-only scope |
| Product identity | `CONNECTED` | `PRODUCT-SYN-PLENUM-50WG-001` complete six-part identity key | similar-name candidates remain unresolved | require the full identity key for any additional binding |
| Manufacturer assertion | `NEEDS_REVIEW` | `MS-SYN-PLENUM-001/v1`; `AS-MFR-PLENUM-001` | original source URL/version unavailable in governed evidence | capture the exact dated manufacturer document without laundering its claims |
| Registration identity | `CONNECTED` | `TH-REG-405-2555`; DOA row 765 / PDF p.136; current listing context updated 2026-07-16 | `EXPIRED`; cancellation not recorded; no current successor bound | retain the expired identity separately; investigate lineage only through authoritative stable identifiers |
| Product-registration binding | `CONNECTED` | `REL-PRODUCT-REG`; exact trade name, ingredient, 50%, WG, and registrant alignment | binding is historical identity only | confirm with current official product record sharing registration ID |
| Rice authority | `AUTHORITY_BLOCKED` | 2023 DOA guidance explicitly supports rice; registry supports `405-2555` identity | `BLOCKED_NO_SHARED_IDENTIFIER` between guidance and registration | obtain a current official label/certificate sharing a stable registration ID and rice field |
| BPH target authority | `AUTHORITY_BLOCKED` | 2023 DOA guidance explicitly supports Brown Planthopper / *Nilaparvata lugens* | `BLOCKED_NO_SHARED_IDENTIFIER` between guidance and registration | obtain a current official label/certificate sharing a stable registration ID and exact target |
| Exact use authority | `AUTHORITY_BLOCKED` | `TH-USE-BPH-PYM-UNBOUND-001`; `REL-REG-GUIDANCE-CTU-UNBOUND` | official guidance has CTU/rate facts but no product-registration join; `405-2555` is expired | locate current official label/certificate and current registration record sharing the same stable identifier |
| Website rendering | `CONNECTED` | `WV-MSI-BPH-001/v1` on existing Crop Protection Management page | none structural | retain frozen presentation patterns |
| Provenance | `CONNECTED` | every displayed Assertion and Relationship has source identity/locator | manufacturer original version remains unavailable and disclosed | preserve source-specific attribution and freshness metadata |

## Product, manufacturer, and registration result

The complete product identity is `เพลนั่ม 50 ดับบลิวจี` + Syngenta Crop Protection Co., Ltd. + pymetrozine + 50% + WG + `MS-SYN-PLENUM-001/v1`. The official Thai row confirms registration `405-2555`, the corresponding product/ingredient/formulation/registrant identity, issue on 23 March 2018, and expiry on 22 March 2024. Cancellation is not recorded. The current 2026 listing context supports classification as `EXPIRED`; no current successor is bound.

Accordingly, product-to-registration identity binding is `CONNECTED` for expired identity, while current rice/BPH/use authority remains `AUTHORITY_BLOCKED`. Manufacturer information remains `MANUFACTURER_COMMERCIAL_SOURCE` and cannot supply regulatory authority.

## Failed-control and recommendation boundaries

Prior application information remains Case history. It creates no resistance conclusion, regional resistance claim, general product-failure claim, stronger-chemistry inference, dose increase, re-treatment, mixture, timing, drone instruction, or MoA-switch advice.

The Website View labels the material as Product Information, exposes its manufacturer provenance, historical/current regulatory distinction, and authority gap, and never presents it as a Recommended Product.

## Sprint-088R decision

Dominant gap classification: **`REGULATORY_SOURCE_COVERAGE_GAP`**.

CP-MoAKB should next obtain a current official approved label or certificate that shares a stable identifier with a current registration record and explicitly binds rice, Brown Planthopper, and approved use. This is a source-coverage and authority gap, not a Website or recommendation-architecture gap.
