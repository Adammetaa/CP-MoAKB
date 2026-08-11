# Thai Crop-Target-Use Regulatory Authority

## Official sources

### `GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1`

- Authority: Plant and Agricultural Materials Control Division, Department of
  Agriculture, Thailand.
- Official listing URL: `https://www.doa.go.th/ard/?page_id=386`.
- Local governed snapshot: 3,501 pages; metadata date 2026-07-16.
- Retrieved/rechecked: 2026-08-11.
- Authority: dated administrative registration identity and record context.
- Excluded inference: crop use, exact target, efficacy, suitability, and
  recommendation unless those fields can be bound to one official record.

### `GS-DOA-AGRI-FACTOR-GUIDANCE-001/v1`

- Authority: Department of Agriculture, Thailand.
- Official URL: `https://www.doa.go.th/th/doa-mobile-application/`.
- Retrieved: 2026-08-11.
- Locator: DOA Agri Factor description.
- Scope: verifies agricultural-input registration using the registration number
  and Buddhist year shown on a label. It is not an open subject-based
  Crop-Target-Use search result.

## Search result

The prior governed 3,501-page interrogation is reused rather than repeated as a
new extraction:

- records/pages searched: 3,501;
- exact active identities searched: 18;
- identities with exact matches: 17;
- exact-identity page hits: 5,166;
- absent identity: Carbofuran;
- complete Crop-Target-Use chains: 0;
- ambiguous identity-only chains: 17;
- rejected absent chains: 1.

The current official web review found no safer public representation that binds
the searched row identity to Rice, exact Target, and Use context. Therefore every
match remains `REGISTRATION_IDENTITY_MATCH_ONLY`; none becomes
`ELIGIBLE_FOR_DECISION_REVIEW`.

## Normalization and mixtures

- Preserve exact source identity, including salt, ester, mixture, concentration,
  formulation, punctuation, spacing, and Thai/English wording.
- Do not treat `rice`, `ข้าว`, `paddy`, and *Oryza sativa* as interchangeable
  regulatory strings without record evidence.
- Do not broaden target strings such as insect, hopper, or brown planthopper.
- A mixture remains one regulatory identity. Its use relationship is never
  projected independently to each component.

Registration is regulatory context, not efficacy, ranking, suitability, or a
case-specific recommendation.

## Sprint-077 regulatory evidence recovery (retrieved 2026-08-11)

The existing Source, Evidence, Claim, and Relationship conventions remain
sufficient. Eligibility is a bounded Case projection and trade-name identity is
source-scoped; no Product, Registration, Label, Recommendation, or Eligibility
ontology is introduced.

The current DOA hazardous-substance page exposed its registered-products
download as updated 16 July 2026. It remains
`REGISTRATION_IDENTITY_AUTHORITY`: registration number, names, formulation,
issue, expiry, and cancellation context are present, but crop-target-use fields
are absent.

`GS-DOA-PPD-INSECT-GUIDANCE-2023-001/v1` is the Plant Protection Research and
Development Office, DOA PDF "คำแนะนำการใช้สารฆ่าแมลงสัตว์ศัตรูพืชอย่างปลอดภัย"
(`https://www.doa.go.th/plprotect/wp-content/uploads/2023/12/%E0%B8%84%E0%B8%B3%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%86%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%A1%E0%B8%A5%E0%B8%87%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C%E0%B8%A8%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B9%E0%B8%9E%E0%B8%B7%E0%B8%8A%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B8%A0%E0%B8%B1%E0%B8%A21.pdf`).
The rice entries headed `เพลี้ยกระโดดสีน้ำตาล` and `หนอนห่อใบข้าว` establish
`CROP_AUTHORITY`, `TARGET_AUTHORITY`, and `USE_PATTERN_AUTHORITY`, including
source ingredient, concentration, formulation, and use wording. They expose no
registration number or stable product-record identifier. Label-like rates are
not materialized in the Case projection.

| Priority target | Exact source wording | Result | Open gaps |
|---|---|---|---|
| Brown planthopper | เพลี้ยกระโดดสีน้ำตาล | `REGULATORY_RELATIONSHIP_AMBIGUOUS` | join, status, efficacy, resistance |
| Rice leaffolder | หนอนห่อใบข้าว | `REGULATORY_RELATIONSHIP_AMBIGUOUS` | action, join, status, efficacy |
| Rice blast | โรคไหม้ | `REGISTRATION_IDENTITY_MATCH_ONLY` | source, join, status, efficacy |

`ข้าว` and each exact target string are retained. Broader terms and unmatched
historical synonyms are not regulatory joins and require Human Review. Attempted
keys were registration number, official product record ID, exact
label-registration reference, trade name, active ingredient, formulation,
concentration, and applicant. Only the first three are acceptable stable keys;
the guidance exposes none, so all similarity joins are rejected.

Complete chains: 0. Priority subjects with a complete chain: 0. Ambiguous
priority evidence groups: 2. Identity-only priority groups: 1. Mixtures remain
one regulatory identity and are never projected to components.

The bounded states are `NO_REGULATORY_EVIDENCE`,
`REGISTRATION_IDENTITY_MATCH_ONLY`, `REGULATORY_RELATIONSHIP_AMBIGUOUS`,
`REGISTRATION_STATUS_UNRESOLVED`, `ELIGIBLE_FOR_DECISION_REVIEW`, and
`HUMAN_REVIEW_REQUIRED`. `CHEMICAL_OPTIONS_READY_FOR_DECISION_REVIEW` requires
both justified Management Review and an eligible chain. Current evidence opens
neither a chemical recommendation nor a dose. Registration remains distinct
from efficacy, Case suitability, ranking, and resistance inference;
`CONTROL FAILURE != RESISTANCE`.

Rights handling retains independently authored facts, identifiers, URLs, and
locators only; full labels, pages, layouts, tables, images, and substantial
passages are not reproduced.
