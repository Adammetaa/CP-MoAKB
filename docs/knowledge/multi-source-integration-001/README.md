# Multi-Source Knowledge Integration 001

Status: accepted internal architecture and representative slice; `not_published`

## What is integrated, and what is not merged

The `multi-source-knowledge-integration/v1` projection composes independently governed source assertions through normalized identities and traceable relationships into an existing Knowledge View. It supports Field/Case evidence, scientific and agronomic knowledge, Thai regulatory records, IRAC/FRAC/HRAC classification, and manufacturer/product information.

Integration does not copy all source material into one canonical object, create a global confidence score, or transfer one source's authority to another. Every assertion retains its source class, identity, date/version, locator, direct-or-inferred status, limitations, and authority state.

The composition path is:

> Source Fact -> normalized entity identity -> governed Relationship -> source-specific Assertion -> provenance -> authority/conflict state -> Website Knowledge View

## Source authority

The five roles remain separate:

- **Case Evidence** establishes only what a Case records.
- **Scientific Authority** supports scientific or agronomic knowledge within source scope.
- **Regulatory Authority** establishes only the registration or use facts explicitly present in its records.
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

The official row records expiry on 22 March 2024; current renewal is unresolved. It exposes no official crop, target, use, or approved-label binding. Therefore the exact identity relationship is visible while the crop-target-use relationship remains `AUTHORITY_BLOCKED`.

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
