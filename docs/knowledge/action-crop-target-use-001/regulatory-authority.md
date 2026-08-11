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
