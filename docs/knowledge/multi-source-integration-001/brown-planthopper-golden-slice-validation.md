# Golden Slice Validation 1: Brown Planthopper

Status: validated against repository baseline `79634911ecd967ce8a428af494e42de62f83b73a`; `not_published`

Validation date: 2026-08-13

## Verdict

The existing multi-source architecture can represent a real Brown Planthopper (`เพลี้ยกระโดดสีน้ำตาล`, *Nilaparvata lugens*) Case and connect it through scientific, management-review, active-ingredient, IRAC, product, manufacturer, Thai registration-identity, Website View, and provenance layers without recommending a product.

The chain is partial at regulatory authority. Product identity and historical registration identity can be bound with explicit limitations, but no governed current official record establishes the complete product/active ingredient -> rice -> Brown Planthopper -> approved-use chain. Key B therefore remains `AUTHORITY_BLOCKED`.

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
| Registration identity | `CONNECTED` | `TH-REG-405-2555`; DOA row 765 / PDF p.136 | issue date and cancellation status unavailable; current renewal unresolved | obtain current official registration record and administrative status |
| Product-registration binding | `CONNECTED` | `REL-PRODUCT-REG`; exact trade name, ingredient, 50%, WG, and registrant alignment | binding is historical identity only | confirm with current official product record sharing registration ID |
| Rice authority | `AUTHORITY_BLOCKED` | manufacturer claim plus official identity row | official registration row contains no crop field | obtain current official label/certificate with stable registration ID and rice field |
| BPH target authority | `AUTHORITY_BLOCKED` | manufacturer claim plus official identity row | official registration row contains no exact-target field | obtain current official label/certificate with stable registration ID and BPH target |
| Exact use authority | `AUTHORITY_BLOCKED` | `REL-MFR-CLAIM-CTU` | no official product-registration-crop-target-use join | resolve the complete current Thai Key B chain through regulatory Human Review |
| Website rendering | `CONNECTED` | `WV-MSI-BPH-001/v1` on existing Crop Protection Management page | none structural | retain frozen presentation patterns |
| Provenance | `CONNECTED` | every displayed Assertion and Relationship has source identity/locator | manufacturer original version remains unavailable and disclosed | preserve source-specific attribution and freshness metadata |

## Product, manufacturer, and registration result

The complete product identity is `เพลนั่ม 50 ดับบลิวจี` + Syngenta Crop Protection Co., Ltd. + pymetrozine + 50% + WG + `MS-SYN-PLENUM-001/v1`. The official Thai row confirms registration `405-2555`, the corresponding product/ingredient/formulation/registrant identity, and recorded expiry on 22 March 2024. Issue date and cancellation status are not available in the governed slice. Current renewal remains unresolved.

Accordingly, product-to-registration identity binding is `CONNECTED` for historical identity, while current rice/BPH/use authority remains `AUTHORITY_BLOCKED`. Manufacturer information remains `MANUFACTURER_COMMERCIAL_SOURCE` and cannot supply regulatory authority.

## Failed-control and recommendation boundaries

Prior application information remains Case history. It creates no resistance conclusion, regional resistance claim, general product-failure claim, stronger-chemistry inference, dose increase, re-treatment, mixture, timing, drone instruction, or MoA-switch advice.

The Website View labels the material as Product Information, exposes its manufacturer provenance, historical/current regulatory distinction, and authority gap, and never presents it as a Recommended Product.

## Sprint-088 decision

Dominant gap classification: **`REGULATORY_BINDING_GAP`**.

Sprint-088 should first resolve—or formally confirm the continued absence of—a current authoritative Thai record path sharing a stable product/registration identifier and explicitly binding rice, Brown Planthopper, and approved use. This is a source/data-authority gap, not a Website or recommendation-architecture gap.
