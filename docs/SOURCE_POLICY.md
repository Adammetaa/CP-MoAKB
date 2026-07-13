# Source Policy

## Purpose

This policy governs how future information sources may be evaluated, registered, versioned, cited, reviewed, replaced, and deprecated. It extends the current official-source controls in [Data Governance](DATA_GOVERNANCE.md) without changing existing manifests, sources, canonical data, or parser behavior.

Source tier describes the authority and nature of a source. It is separate from the assertion-specific evidence level defined in [Evidence Levels](EVIDENCE_LEVELS.md).

## Source hierarchy

### Tier 1: primary official authority

- official classification bodies;
- official government registration databases;
- official labels;
- official standards; and
- authoritative government and intergovernmental publications.

Tier 1 is required for binding regulatory facts and is preferred for official classifications within the issuing authority's scope.

### Tier 2: scientific and institutional authority

- peer-reviewed literature;
- recognized scientific institutions; and
- university extension publications.

Tier 2 can support scientific, technical, and agronomic assertions within the source's methods, date, geography, and stated limitations.

### Tier 3: declared technical and reviewed field material

- manufacturer technical material, clearly labeled as manufacturer-supplied;
- expert-reviewed field protocols; and
- curated field observations that have passed a defined review process.

Tier 3 requires clear authorship, conflicts-of-interest context where applicable, review status, and corroboration appropriate to the claim.

### Tier 4: unverified reports

- unverified field reports;
- informal observations; and
- community reports.

Tier 4 can identify questions, anomalies, or hypotheses. **Tier 4 cannot independently support a chemical recommendation.** It cannot establish registration, legal label conditions, causality, efficacy, safety, or resistance.

## Candidate official source families

Potential future source families include:

- IRAC for insecticide resistance and Mode of Action classification;
- FRAC for fungicide resistance and Mode of Action classification;
- HRAC, or the current authoritative herbicide-resistance classification body, for herbicide classification;
- Thailand Department of Agriculture for applicable Thai official registration and label information;
- FAO;
- WHO;
- OECD; and
- EPPO.

This list identifies candidates, not integrations. Only the registered IRAC v11.5 material currently present in the repository is integrated into the approved canonical pipeline. No other candidate source is claimed as acquired, licensed, parsed, current, or approved.

## Source selection by information type

| Information type | Minimum source expectation |
| --- | --- |
| Mode of Action classification | Current version from the responsible official classification body. |
| Legal registration or permitted use | Current official government registration record and official label for the jurisdiction. |
| Label rate, PPE, PHI, REI, or use limit | Current official label; never inferred from secondary material. |
| Biological identity and taxonomy | Appropriate recognized taxonomic or scientific authority with version context. |
| Agronomic mechanism or efficacy | Evidence appropriate to the crop, target, method, environment, and claim; usually Tier 2 or better, with conflicts shown. |
| Extension or field practice | Recognized institutional or expert-reviewed guidance, labeled with scope and review. |
| Field pattern or local observation | Structured observation under [Field Knowledge Policy](FIELD_KNOWLEDGE_POLICY.md), not automatically a fact. |
| Price or operating cost | Dated and localized observation with currency, unit, and collection method. |

## Canonical source registration

A source becomes canonical only through an approved registration event. Registration should record:

- responsible organization and source family;
- document, dataset, database, or label title;
- stable source identity and retained path or governed retrieval location;
- exact version or edition;
- cryptographic checksum for retained immutable files;
- publication, release, or effective source date;
- retrieval date and retrieval method;
- jurisdiction and issuing authority where applicable;
- media type and file size where relevant;
- license, terms, attribution, redistribution, and usage constraints;
- reviewer identity and approval date;
- canonical status and relationship to prior versions; and
- known limitations or unavailable metadata.

A filename or URL alone is not proof of identity. Dynamic official databases require a governed snapshot or retrieval record appropriate to the assertion.

## Checksum and integrity

Retained immutable source files require a strong cryptographic checksum, currently SHA-256 by repository convention. A mismatch blocks processing until the file and registration record are reviewed. A changed checksum must never be accepted silently as the same source version.

For dynamic sources where whole-source checksums are not meaningful, future governance must define request parameters, response identity, retrieval timestamp, relevant record identifiers, and an immutable retained representation where permitted.

## Version, source date, and retrieval date

These dates answer different questions:

- **Version** identifies the declared edition or state.
- **Source date** records publication, issue, release, or effective date.
- **Retrieval date** records when CP-MoAKB obtained or verified the material.

All three should be retained when available. Retrieval date cannot substitute for an unknown effective date, and a newer retrieval does not prove that a source record is still legally active.

## Jurisdiction

Regulatory and legal assertions require an explicit jurisdiction. Thai legal-use guidance must rely on applicable current Thai official records and labels. Material from another country or international body may provide scientific context but cannot establish Thai legal permission.

## License and usage constraints

Before ingestion or publication, review whether the source permits storage, transformation, quotation, redistribution, commercial use, and derived datasets. Store the decision and restrictions with the source registration. Lack of a known license is a review blocker, not permission to assume unrestricted use.

## Replacement, deprecation, and no silent replacement

- Retain prior source versions when permitted and necessary for audit.
- Register a new version separately before changing canonical status.
- Link the newer version with an explicit supersession relationship.
- Mark deprecated sources without erasing assertions that were historically based on them.
- Revalidate affected assertions, golden expectations, and downstream decisions through an approved process.
- Never overwrite a retained source or manifest silently.

## Conflicting sources

Conflicts are preserved as separately sourced assertions. Review should determine whether the conflict results from scope, method, terminology, date, jurisdiction, source authority, or genuine disagreement. A resolution records its rationale and reviewer; it does not delete the losing evidence. Regulatory conflicts are escalated to the current issuing authority and official record.

## Source review and update approval

Source review should verify identity, authority, scope, currency, integrity, jurisdiction, license, completeness, and compatibility with the intended assertion. Updates require explicit approval proportional to impact. Changes affecting frozen parsers, schemas, semantic rules, golden baselines, or canonical data require a separate design and release decision.

## Prohibited practices

- Do not substitute unofficial mirrors for an available official source.
- Do not synthesize missing values or silently normalize source content.
- Do not treat manufacturer material as independent regulatory or scientific authority.
- Do not use source tier as a proxy for local efficacy or recommendation strength.
- Do not publish proprietary or personal material without documented permission.
- Do not claim an integration until its source is registered, reviewed, and implemented.
