# Sprint-016 Rice Master Data Pilot Specification

## Status and purpose

This specification defines the architecture gate and exact first tranche for a later Sprint-016. It creates no candidate or production record, identifier, source approval, schema, or dataset. Authoring cannot begin until [ADR-009](../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md) is Accepted and every blocking gate below is satisfied.

## Exact entity/context tranche

The tranche contains exactly **64 candidate entity/context records** if authorized:

| Category | Count | Why included; source and authority | Minimum provenance and reviewer | Acceptance and exclusions; ambiguity risks |
| --- | ---: | --- | --- | --- |
| Crop | 1 | Anchors cultivated rice pilot scope; assessed national rice source plus verified crop/taxonomy authority. | Exact source unit/version, scope rationale; Agricultural Domain and Taxonomy Reviewers. | Must distinguish crop concept from taxon, cultivar, and planted instance; no variety records. |
| Crop-stage system | 1 | Preserves one selected sourced framework; framework owner/publication is authoritative for its own scheme. | Edition/version, full stage-system citation, selection decision; Agricultural Domain and Architecture Reviewers. | No silent BBCH/local crosswalk, mixed framework, or inferred equivalence. |
| Growth Stage | 8 | Tests stage-specific relationships using eight explicitly selected nodes from the one framework. | Stage definition/location and framework reference; Agricultural Domain Reviewer. | Must be framework-scoped; excludes free-text field states and unreviewed crosswalks. |
| Plant Organ | 8 | Covers anatomical locations required by the selected disease/pest cases; botanical/rice authority. | Definition/location source and crop applicability; Agricultural Domain Reviewer. | Excludes symptom-location strings and observed specimens; organ granularity can conflict across sources. |
| Disease | 3 | Exercises distinct rice disease identity and symptom/sign modeling; item-level Rice Department material plus pathology evidence. | Disease page/publication locator, version/date status, scope; Plant Pathology Reviewer. | Excludes symptoms, diagnoses, disease-name duplicates, and unsupported complexes. |
| Causal Agent | 3 | One directly required causal-agent candidate per selected disease; pathology evidence and taxonomic authority. | Claim-level causal evidence plus taxon mapping evidence; Plant Pathology, Evidence, and Taxonomy Reviewers. | No causality from page grouping or label match; agent role remains separate from pathogen taxon. |
| Insect/arthropod organism identity | 3 | Preserves biological identity separately from pest role; specialist taxonomy authority. | Authority record/version and mapping rationale; Entomology and Taxonomy Reviewers. | Excludes beneficial-role inference and unverified scientific names. |
| Insect/arthropod pest-role context | 3 | Tests contextual “pest of rice” statements for those identities; Rice Department item plus corroboration where needed. | Crop/context/evidence locator and role rationale; Entomology and Evidence Reviewers. | Not universal organism identity or observation; no recommendation content. |
| Other-animal organism identity | 1 | Tests a non-insect animal boundary; appropriate zoological authority. | Authority record/version; Taxonomy or Zoology-capable Reviewer. | Excludes a generic animal-pest bucket and unverified species identity. |
| Other-animal pest-role context | 1 | Tests rice-specific animal pest role; assessed crop-protection source. | Crop/context/evidence locator; Agricultural Domain and specialist reviewer. | Role is contextual and does not imply every occurrence causes damage. |
| Weed Taxon | 3 | Preserves plant identity separately from weed role; botanical taxonomic authority. | Authority record/version and mapping; Weed Science and Taxonomy Reviewers. | Excludes label-based taxonomic equivalence. |
| Weed-role context | 3 | Tests weed-of-rice/production-context statements; item-level Rice Department evidence. | Production context and evidence locator; Weed Science and Evidence Reviewers. | Not an intrinsic property of the taxon; no management advice. |
| Symptom | 10 | Supports only the three selected diseases; pathology descriptions. | Exact descriptive evidence and affected-organ context; Plant Pathology Reviewer. | Excludes signs, diagnoses, damage patterns, and uniqueness claims. |
| Sign | 4 | Tests observable causal-organism evidence where directly required; pathology/mycology evidence. | Exact sign and agent evidence; Plant Pathology and Taxonomy Reviewers. | Excludes host response and automatic organism identification. |
| Damage Mechanism | 6 | Tests how selected pest roles injure rice; entomology/zoology evidence. | Pest/host/context evidence; relevant specialist reviewer. | Excludes visible outcome, symptom diagnosis, and unsupported causality. |
| Damage Pattern | 6 | Tests visible injury descriptions tied to mechanisms; assessed descriptive sources. | Pattern/location evidence; Agricultural Domain and specialist reviewers. | Excludes mechanisms, field observations, and diagnostic certainty. |

Relationship statements are separate candidates and have no target quota: evidence, not a numeric goal, determines whether they exist. Their scope is strictly limited to connecting these 64 candidates through `crop has stage system`, `system has stage`, `crop has organ`, `disease has causal agent`, `disease manifests symptom`, `agent may produce sign`, `symptom/sign/damage affects organ`, `organism has contextual pest/weed role`, `role relevant to crop/stage/context`, `role causes damage mechanism`, and `mechanism produces damage pattern`. No other predicate enters the tranche.

## Source selection

Only sources listed in [Rice Pilot Source Register](RICE_PILOT_SOURCE_REGISTER.md) may be considered. A navigation page supports discovery and scope only, never a specific scientific claim. At least one item-level source must be Approved for Pilot Use for each candidate claim; taxonomic and causal claims require the appropriate specialist authority in addition to Rice Department material.

## Minimum record and review rules

Every item must satisfy the [Candidate Record Envelope](CANDIDATE_RECORD_ENVELOPE.md), use the format in Accepted ADR-009, retain evidence/conflicts, and receive all roles required by the [Reviewer Matrix](RICE_PILOT_REVIEWER_MATRIX.md). Unknown or disputed fields remain explicit. Missing specialist staffing blocks the affected candidate and release.

## Checkpoints and acceptance

1. Approve the frozen source list and one growth-stage framework.
2. Accept ADR-009 and approve the candidate template/validation contract.
3. Approve candidate-ID allocation rules without minting production IDs.
4. Review one record and one relationship exemplar structurally before scaling.
5. Complete source/rights, language, domain, taxonomy, evidence, and relationship reviews.
6. Pass deterministic validation and the [Candidate-to-Production Gate](CANDIDATE_TO_PRODUCTION_GATE.md).
7. Obtain Chief Architect approval and Product Owner release decision through a separate promotion action.

## Explicit exclusions and stop conditions

No cultivar, product, active ingredient, Mode-of-Action mapping, registration, pesticide use, treatment, safety conclusion, diagnostic rule, field observation, private data, source image/text mirror, full Rice Domain inventory, inferred equivalence, or runtime implementation is in scope.

Stop the tranche if ADR-009 is not Accepted; a source/rights/stage framework is unresolved; required reviewers are unavailable; taxonomy or causality cannot be represented honestly; deterministic validation cannot preserve meaning; scope would exceed the exact counts; or frozen/runtime changes become necessary.
