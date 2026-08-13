# Sprint-077R Regulatory Resolution

Status: Accepted for bounded internal use; `not_published`

Review timestamp: 2026-08-13T00:00:00+07:00
Reviewer role: Regulatory evidence reviewer

## Resolution method

This review used record-by-record Human Review. It did not repeat broad identity
scanning and did not accept ingredient, concentration, formulation, trade-name,
or company similarity as a regulatory join. A relationship could be accepted
only when official Thai Department of Agriculture (DOA) evidence supplied a
stable identifier shared by crop-target-use evidence and a current registration
record.

The official Agricultural Regulatory Division page was manually inspected on
2026-08-13. It linked the current hazardous-substance registration list as
updated **16 July 2026**. The linked PDF could be opened in the official browser
flow, but its server rejected independent retrieval with HTTP 403. The current
listing therefore confirms the available status authority and snapshot date; it
does not supply a defensible crop-target-use join by itself.

Targeted official-domain searches for `ข้าว` with
`เพลี้ยกระโดดสีน้ำตาล`, `หนอนห่อใบข้าว`, and `โรคไหม้` did not locate an
official label or certificate exposing a registration number together with the
required crop, target, use, and product identity. Search snippets were used only
for navigation and are not Evidence.

## Official artifacts reviewed

| Institution | Artifact / URL | Retrieval date | Authority role | Record identifier | Limitation |
| --- | --- | --- | --- | --- | --- |
| Thai DOA, Plant Protection Research and Development Office | [Official insecticide-use guidance](https://www.doa.go.th/plprotect/wp-content/uploads/2023/12/%E0%B8%84%E0%B8%B3%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%86%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%A1%E0%B8%A5%E0%B8%87%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C%E0%B8%A8%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B9%E0%B8%9E%E0%B8%B7%E0%B8%8A%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B8%A0%E0%B8%B1%E0%B8%A21.pdf) | 2026-08-13 | crop, target, use-pattern authority | `GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1` | no registration number or stable product-record identifier |
| Thai DOA, Agricultural Regulatory Division | [Hazardous-substance registration listing](https://www.doa.go.th/ard/?page_id=386) | 2026-08-13 | current administrative registration/status authority | `GS-DOA-HAZARDOUS-REGISTRY-2026-001/v2`; page states update 2026-07-16 | registry does not bind crop-target-use; linked PDF rejects independent retrieval with HTTP 403 |
| Thai DOA | [DOA service systems](https://www.doa.go.th/th/nsw-2/) | 2026-08-13 | identifies official registration/permit service | service page; no product record ID | application/service entry point is not a crop-target-use record |

## Regulatory resolution table

| Crop | Target | Product/Record | Registration No. | Ingredient/Mixture | Use | Status | Source | Join Key | Eligibility |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ข้าว | เพลี้ยกระโดดสีน้ำตาล | unresolved | unresolved | Imidacloprid; Buprofezin; Fipronil candidate identities, retained separately | official guidance entry | `STATUS_UNRESOLVED` | DOA guidance + current registry listing | none | `HUMAN_REVIEW_REQUIRED` |
| ข้าว | หนอนห่อใบข้าว | unresolved | unresolved | Cartap hydrochloride; Fipronil; Chlorantraniliprole candidate identities, retained separately | official guidance entry | `STATUS_UNRESOLVED` | DOA guidance + current registry listing | none | `HUMAN_REVIEW_REQUIRED` |
| ข้าว | โรคไหม้ | unresolved | unresolved | Isoprothiolane; Tricyclazole candidate identities, retained separately | historical source context only | `STATUS_UNRESOLVED` | current registry listing; no resolved official crop-target-use artifact | none | `REGISTRATION_IDENTITY_MATCH_ONLY` |

Candidate identities in one row are not a mixture, option set, or accepted
registration relationship. They are separate unresolved search leads. No
component inherits eligibility from a mixture.

## Human Review record

- Official artifacts reviewed: the DOA insect guidance, the current ARD registry
  page and linked registry artifact, the DOA service-systems page, and targeted
  official-domain result pages.
- Stable join key accepted: none.
- Relationship accepted: none.
- Relationships rejected: all ingredient/formulation/name-only joins between
  guidance and registry records.
- Relationships unresolved: all three priority crop-target pairs.
- Reason: no official artifact accessible in this review shared a registration
  number or other stable DOA record identifier across crop, exact target, use,
  product identity, and current registration status.
- Unresolved limitation: a competent reviewer still needs an official label or
  certificate plus current registry verification sharing the same stable ID.

## Gate result and boundaries

Complete chains: **0**. Current eligible chains: **0**. Historical/expired
chains: **0**. Ambiguous/Human-Review chains: **2**. Status-unresolved chains:
**0 accepted joins**. Identity-only matches: **1 priority target group**.

The regulatory key remains closed. Even when
`MANAGEMENT_REVIEW_JUSTIFIED` is true, the absence of an
`ELIGIBLE_FOR_DECISION_REVIEW` record keeps
`CHEMICAL_OPTIONS_READY_FOR_DECISION_REVIEW` false. No recommendation, ranking,
comparative efficacy, case-specific dose, dose escalation, or resistance
inference is produced. `CONTROL FAILURE != RESISTANCE` remains mandatory.
