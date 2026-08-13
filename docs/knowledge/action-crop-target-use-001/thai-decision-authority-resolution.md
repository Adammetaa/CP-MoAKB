# Sprint-083 Thai decision-authority resolution

Status: accepted bounded resolution; `not_published`

Review date: 2026-08-13

## Verdict

CP-MoAKB did **not** establish its first defensible Thai chemical-decision
eligibility chain. The review found a stable product registration-number lead
and an exact official identity row, but it did not find one authoritative record
path that simultaneously establishes current status and official rice x exact
target x use binding.

## Official sources and strategy

The review used record-level exact queries rather than repeating broad ingredient
similarity searches:

- Thai DOA Plant Protection Research and Development Office, [2023 official
  insecticide-use guidance](https://www.doa.go.th/plprotect/wp-content/uploads/2023/12/%E0%B8%84%E0%B8%B3%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%86%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%A1%E0%B8%A5%E0%B8%87%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C%E0%B8%A8%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B9%E0%B8%9E%E0%B8%B7%E0%B8%8A%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A5%E0%B8%AD%E0%B8%A0%E0%B8%B1%E0%B8%A21.pdf):
  official rice, exact-target, ingredient/formulation, use, rate, stage, and
  action-context authority; it exposes no registration number or stable product
  identifier.
- Thai DOA Agricultural Regulatory Division, [official 2554-2568 registration
  listing](https://www.doa.go.th/ard/wp-content/uploads/2025/09/%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%B8%E0%B8%AD%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%9A%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%99%E0%B8%B4%E0%B8%94-%E0%B8%9B%E0%B8%B5-2554-25681.pdf),
  row 765 / PDF p.136: stable registration identity and administrative dates;
  no crop, target, use, or label fields.
- Current [ARD registration landing page](https://www.doa.go.th/ard/?page_id=386):
  current listing context, but no resolved product-level renewal or CTU join.

Search-result snippets were navigation aids only and are not Evidence.

## Product-registration-number lead and verification

| Target | Lead source/scope | Original identity | Lookup | Official result | Decision |
| --- | --- | --- | --- | --- | --- |
| brown planthopper | commercial product page; `PRODUCT_IDENTITY_LEAD` only | `เพลนั่ม 50 ดับบลิวจี`; pymetrozine 50% WG; registration `405-2555`; claimed rice/BPH use | exact `405-2555` official-domain lookup | DOA row 765 confirms registration number, trade name, pymetrozine, 50% WG, Syngenta, and expiry 22 March 2024 | rejected: official CTU absent; current renewal/status unresolved; commercial use claim cannot supply regulatory authority |

This satisfies the required integration test through the official lookup and
exact identity step, then fails explicitly at official CTU and current status.
The historical administrative row is not classified as current.

## Action-authority resolution

- **Brown planthopper:** `ACTION_AUTHORITY_OPERATIONAL_WITH_LIMITATION`. Existing
  Sprint-076/082 10-insects/plant evidence is unchanged, including the
  point-versus-plant wording limitation.
- **Rice leaffolder:** `ACTION_AUTHORITY_LIMITED`. The official Thai guidance
  supplies stage-specific affected-leaf criteria: more than 15% for rice aged
  15-40 days and 10% at flag-leaf stage. `AE-083-LF-TH-001/v1`,
  `CL-083-LF-ACTION-001/v1`, and `EV-083-LF-ACTION-001/v1` preserve the missing
  sampling-denominator limitation and do not establish registration.
- **Blast, brown spot, broadleaf, sedge:** `ACTION_AUTHORITY_UNRESOLVED`. Targeted
  review did not establish Thai operational monitoring/action criteria. Disease
  descriptions, weather associations, weed presence, and historical chemical
  context were rejected as action triggers.

## Regulatory resolution and rejection ledger

| Target/lead | Stable ID | Official crop | Official exact target | Official use | Current status | Rejection |
| --- | --- | --- | --- | --- | --- | --- |
| BPH / `405-2555` | yes | no | no | no | expiry 2024; current renewal unresolved | `OFFICIAL_CTU_NOT_BOUND`; `CURRENT_STATUS_UNRESOLVED`; `COMMERCIAL_USE_CLAIM_ONLY` |
| BPH / imidacloprid, buprofezin, fipronil identity hits | no shared CTU ID | guidance only | guidance only | guidance only | unresolved | `NO_STABLE_IDENTIFIER_SHARED_WITH_CTU` |
| leaffolder / fipronil 5% SC | no shared CTU ID | guidance only | guidance only | guidance only | unresolved | `NO_STABLE_IDENTIFIER_SHARED_WITH_CTU` |
| disease and weed identity leads | none completing chain | unresolved | unresolved | historical/context only | unresolved | `NO_COMPLETE_CURRENT_OFFICIAL_CTU_REGISTRATION_JOIN` |

Mixtures remain whole identities. Similar names, ingredients, concentrations,
formulations, companies, or commercial claims cannot replace the missing shared
official identifier. Human Review cannot waive those requirements.

## Decision authority matrix

| Target | Identification | Action Authority | Management Gate | Regulatory CTU | Current Registration | Chemical Eligibility | Main Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Brown planthopper | governed | operational with limitation | available with valid measurement | guidance only; no stable join | unresolved | Human Review required | official label/certificate sharing ID plus current status |
| Rice leaffolder | governed | limited Thai stage/incidence criterion | requires stage and incidence | guidance only; no stable join | unresolved | Human Review required | stable registration join and current status |
| Rice blast | provisional; causal confirmation unavailable | unresolved | no determination | unresolved | unresolved | identity match only | action criterion and complete chain |
| Brown spot | provisional; causal confirmation unavailable | unresolved | no determination | unresolved | unresolved | identity match only | action criterion and complete chain |
| Rice broadleaf group | group level | unresolved | no determination | unresolved | unresolved | identity match only | exact target, action criterion, complete chain |
| Sedge group | group level | unresolved | no determination | unresolved | unresolved | identity match only | exact target, action criterion, complete chain |

## Gate and scientific boundaries

The strongest BPH test reaches `MANAGEMENT_REVIEW_JUSTIFIED` with valid Action
Evidence (Key A), but Key B remains false, so chemical review is blocked or
eligibility-unresolved. Registration remains distinct from efficacy, Case
suitability, MoA, resistance, and recommendation. No product, active ingredient,
rate, dose, spray, ranking, or failed-control inference is produced.
