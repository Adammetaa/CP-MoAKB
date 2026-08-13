# Multi-Source Knowledge Integration 001

Status: accepted internal architecture and representative slice; `not_published`

See [Golden Slice Validation 1: Brown Planthopper](brown-planthopper-golden-slice-validation.md)
for the evidence-driven end-to-end chain and Sprint-088 gap decision.

## Sprint-090P governed product comparison

### What Product Comparison is

Product Comparison is a governed presentation of differences among existing Product Identity, Active Ingredient, MoA, Registration, Source Assertion, Authority Status, and Human Review records. The bounded proof uses the context **Thai rice insect-control regulatory knowledge** and shows two separately targeted insect-product records side by side: Plenum 50 WG for the governed Brown Planthopper relationship and Prevathon 5.17% W/V SC for the governed Rice Leaffolder relationship. This is explicitly not a same-target treatment-choice comparison.

### What Product Comparison is not

It is not a recommendation, ranking, prescription, efficacy evaluation, treatment selector, spray program, or commercial decision. No product score, winner, suitability value, expected control, yield effect, ROI, or visual “green means preferred” state exists. Product presence means only that a governed relationship explains why the identity is relevant to the stated comparison context.

### Inclusion logic and neutral ordering

An exact Product Identity may appear only when a cited official or manufacturer assertion explains its rice-insect knowledge relationship. The comparison references the normalized product, active-ingredient, manufacturer/registrant, registration, source, and Sprint-089R candidate records; it does not create a parallel product database. Candidates use deterministic ascending English trade-name keys (`plenum 50 wg`, then `prevathon`). Manufacturer, current/expired status, authority completeness, Case history, and commercial interest never affect inclusion or order. Chia Tai and every other manufacturer use the same schema and receive no priority.

### Authority display and missing evidence

Product identity, registration identity, registration status, Rice Authority, Exact Target Authority, and Exact CTU are displayed separately. Registration `405-2555` remains `EXPIRED`; registration `7-2554` remains `CURRENT`; both exact CTU states remain `AUTHORITY_BLOCKED`. The comparison therefore preserves `CURRENT_REGULATORY_POSITIVE_SOURCE_GAP`: a current registration cannot render as current crop-target-use authorization without the missing approved label/certificate and stable identifier binding.

Missing evidence is part of each card. The view exposes unavailable current labels, unbound guidance, absent manufacturer or independent efficacy sources, historical/Case-only context, and the need for Human Review. Manufacturer assertions and scientific context remain visually and semantically separate from Regulatory Authority. IRAC 9B and IRAC 28 are descriptive classification facts only.

### Recommendation, Case, rate, and Learn boundaries

The comparison can be explored without a Case or linked from `CHEMICAL_REVIEW_INFORMATION_ONLY`. Case Evidence never selects or sorts a product. A previous application renders only as **Previous Application / Case History** and does not establish failure, resistance, inferiority, or a replacement. The BPH `20 g per 20 L water` entry remains an attributed official-guidance fact, not a dose for a Case. Human Review cannot upgrade incomplete authority. Case outcomes do not rank products, change ordering, update efficacy, or promote knowledge automatically.

## Sprint-089R current positive-path search

Sprint-089R reused the Sprint-088R binding model and conducted a bounded, source-driven search in the required target order. Governed repository evidence was reviewed first, followed by exact official Thai DOA product-registration and label/certificate queries. No company was preselected, no registry was mass-ingested, and search-result snippets were navigation aids rather than Evidence.

| Candidate | Target | Registration | Status | Label | Stable ID | Rice | Target | Use | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| เพลนั่ม 50 ดับบลิวจี; pymetrozine 50% WG | Brown Planthopper / เพลี้ยกระโดดสีน้ำตาล / *Nilaparvata lugens* | `405-2555` | `EXPIRED` 2024-03-22 | no | no shared CTU ID | explicit in separate official guidance | explicit in separate official guidance | explicit in separate official guidance | `REJECTED_EXPIRED` |
| พรีวาธอน / Prevathon; chlorantraniliprole 5.17% W/V SC; FMC AG (Thailand) Co., Ltd. | Rice Leaffolder / หนอนห่อใบข้าว / *Cnaphalocrocis medinalis* | `7-2554` | `CURRENT`; 2023-04-07 through 2029-04-06 | no official label/certificate located | no | explicit in separate official guidance | explicit in separate official guidance | explicit in separate official guidance | `REJECTED_NO_LABEL` |
| no product identity accepted | Rice Stem Borers / หนอนกอข้าว | not established | `STATUS_UNKNOWN` | no | no | explicit in guidance | grouped target covers multiple species | use pattern only | `REJECTED_NO_STABLE_IDENTIFIER` |
| บลาสวัน; tricyclazole 75% WP; Global Crops Co., Ltd. | Rice Blast / โรคไหม้ | `602-2555` | `CURRENT`; 2024-04-17 through 2030-04-16 | no official label/certificate located | no | absent from registry row | absent from registry row | absent from registry row | `REJECTED_NO_LABEL` |
| no product identity accepted | Brown Spot / โรคใบจุดสีน้ำตาล | not established | `STATUS_UNKNOWN` | no | no | unresolved | unresolved | unresolved | `NEEDS_REVIEW` |

Current registrations `7-2554` and `602-2555` prove that the architecture can preserve exact current identity and validity separately from use authority. They do not prove rice, exact target, or approved use. The official insect guidance provides crop-target-use facts for insect candidates but no registration, certificate, regulator-record, or approved-label identifier. No candidate therefore meets the complete positive-path standard.

Sprint classification: **`CURRENT_REGULATORY_POSITIVE_SOURCE_GAP`**. Selected positive slice: **`NO QUALIFIED POSITIVE SLICE`**. The single highest-value next gap is one public official approved rice-use label or certificate sharing a current Thai registration identifier.

The Website projection exposes the five candidate outcomes and current identity facts while retaining the separate BPH `EXPIRED` / `AUTHORITY_BLOCKED` card. Neither a current registry identity, manufacturer source, scientific source, nor IRAC/FRAC/HRAC classification becomes approved-use authority, product selection, Case recommendation, ranking, execution, or automatic Learn promotion.

## What is integrated, and what is not merged

The `multi-source-knowledge-integration/v1` projection composes independently governed source assertions through normalized identities and traceable relationships into an existing Knowledge View. It supports Field/Case evidence, scientific and agronomic knowledge, Thai regulatory records, IRAC/FRAC/HRAC classification, and manufacturer/product information.

Integration does not copy all source material into one canonical object, create a global confidence score, or transfer one source's authority to another. Every assertion retains its source class, identity, date/version, locator, direct-or-inferred status, limitations, and authority state.

The composition path is:

> Source Fact -> normalized entity identity -> governed Relationship -> source-specific Assertion -> provenance -> authority/conflict state -> Website Knowledge View

## Source authority

The six roles remain separate:

- **Case Evidence** establishes only what a Case records.
- **Scientific Authority** supports scientific or agronomic knowledge within source scope.
- **Regulatory Authority** establishes only the registration or use facts explicitly present in its records.
- **Regulatory-supporting Official Material** may establish bounded crop, target, use-pattern, or rate facts but cannot replace a required approved-label or registration join.
- **MoA Classification Authority** establishes IRAC, FRAC, or HRAC classification and explanatory context.
- **Manufacturer / Commercial Source** establishes attributed manufacturer product information or claims, not independent scientific or regulatory truth.

No role is collapsed into another. Human Review can interpret evidence but cannot invent missing regulatory authority.

## Field Evidence boundary

Representative BPH and rice-blast Case projections demonstrate `Observed in this Case` separately from `General governed knowledge`. Observations, photographs, measurements, application context, T1/T2 comparison, and failed-control outcomes remain Case-scoped. A field result does not become a canonical efficacy or resistance Claim, a threshold, product ranking, or universal recommendation. Promotion remains a future governed Learn process; no automatic learning occurs.

## Identity resolution and product identity

Biological identities preserve crop/problem concepts and causal uncertainty. Chemical identities preserve the active ingredient and any material salt or ester identity. Product identity requires the complete tuple:

> product name + manufacturer/registrant + active ingredient + concentration + formulation + source identity

Name similarity alone never merges records. Trade name is not active ingredient; active ingredient is not formulation; formulation is not registered product; registered product is not an approved crop-target-use relationship.

The representative product slice reuses the governed Sprint-083 lead for `เพลนั่ม 50 ดับบลิวจี`, pymetrozine 50% WG, Syngenta, and registration identity `405-2555`. The source roles remain separate: a manufacturer-attributed rice/BPH claim is `NEEDS_REVIEW`, while the official Thai row supports only the exact registration identity and administrative dates.

## Regulatory binding and freshness

The BPH official row records expiry on 22 March 2024 and is classified `EXPIRED` in the current listing context. It exposes no official crop, target, use, or approved-label binding. Therefore the exact identity relationship is visible while the crop-target-use relationship remains `AUTHORITY_BLOCKED`.

Registration identity known, current registration known, and exact crop-target-use authority established are three separate states. Historical or expired-date evidence is never presented as current merely because a name remains discoverable. Source version/date, retrieval date, and locator remain attached wherever available; an unavailable manufacturer version is explicitly marked rather than treated as timeless truth.

## Relationships, conflicts, and Human Review

Each cross-source Relationship identifies its supporting source Assertions and whether it is direct or inferred. Allowed visible states are `SUPPORTED`, `INCOMPLETE`, `CONFLICTING`, `AUTHORITY_BLOCKED`, `NEEDS_REVIEW`, and `NOT_APPLICABLE`.

Field evidence that differs from textbook morphology remains visible alongside the scientific assertion as `CONFLICTING`; neither overwrites the other. Manufacturer crop/target claims with no exact current Thai authority remain `AUTHORITY_BLOCKED`. Ambiguous identity, missing joins, and interpretive relationships remain visible and require Human Review.

## Website projection and discovery

The existing Crop Protection Management page in Knowledge Explorer renders `WV-MSI-BPH-001/v1` using the established card, status, trace, and boundary-note patterns. It visibly separates:

- Observed in this Case;
- Scientific Knowledge;
- Mode of Action;
- Regulatory Status;
- Related Product Information;
- Source and Provenance; and
- Gaps and Conflicts.

The same model also contains a rice-blast view with Case evidence, scientific morphology knowledge, FRAC context, conflict visibility, and unresolved authority. Relationships support future discovery from problem, active ingredient, product, classification, registration, or Case without manufacturer ranking.

## Manufacturer and recommendation boundaries

Chia Tai, Syngenta, Bayer, and ADAMA use the same manufacturer identity schema. Chia Tai has no privileged field, ordering, score, or eligibility rule. Only source-supported assertions are materialized; empty manufacturer slots demonstrate extensibility without inventing claims.

Product display is informational. A `CHEMICAL_REVIEW` option may link to this knowledge, but it does not select an active ingredient, product, formulation, rate, mixture, timing, program, MoA switch, retreatment, or application method. The projection creates no recommendation, ranking, prescription, execution task, drone instruction, or commercial preference.
