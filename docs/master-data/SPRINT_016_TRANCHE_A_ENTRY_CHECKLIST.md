# Sprint-016 Tranche A Entry Checklist

- Verification date: 2026-07-14
- Overall result: **FAIL — DO NOT START CANDIDATE AUTHORING**
- Scope ceiling: exactly 18 entity candidates — one Crop, one GrowthStageSystem, eight GrowthStage, and eight PlantOrgan
- Relationship candidates: prohibited

Every mandatory row must be `PASS`. `FAIL` cannot be waived by documentation completeness or mechanical validation.

| Requirement | Evidence | Owner role | Status | Blocking reason | Resolution action | Verified |
| --- | --- | --- | --- | --- | --- | --- |
| ADR-009 Accepted | [ADR-009](../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md) | Chief Architect | **PASS** | None | Preserve acceptance scope. | 2026-07-14 |
| Rice Crop scope approved | [Crop Scope Decision](RICE_CROP_SCOPE_DECISION.md) and [Crop-Scope Review Sheet](RICE_TRANCHE_A_CROP_SCOPE_REVIEW_SHEET.md) | Agricultural Domain + Taxonomy | **FAIL** | Scope and authority split are defined and a review sheet exists, but no assigned qualified reviewers have approved it. | Staff all sign-off roles and record their decisions. | 2026-07-14 |
| BBCH framework and eight-stage subset approved | [Framework Decision](RICE_GROWTH_STAGE_FRAMEWORK_DECISION.md) | Chief Architect | **PASS** | None | Preserve version and do not represent subset as complete scale. | 2026-07-14 |
| BBCH visual/boundary review complete | [BBCH Visual Review](RICE_BBCH_VISUAL_REVIEW.md), official pp. 23–27 | Source and Rights + Agricultural Domain | **PASS** | Source inspection is complete; agricultural candidate approval remains staffing-gated. | Use only recorded principal labels and concise paraphrases. | 2026-07-14 |
| Crop taxonomy source approved | RDP-SRC-013 POWO and RDP-SRC-014 IPNI | Taxonomy Reviewer | **PASS** | Source roles and scopes are approved. | Obtain reviewer decision when authoring is authorized. | 2026-07-14 |
| Crop agricultural-scope source approved | RDP-SRC-016 and [Source Assessment](RICE_TRANCHE_A_SOURCE_ASSESSMENT.md) | Agricultural Domain Reviewer | **PASS** | Source coverage is approved; reviewer is unassigned. | Preserve claim boundary and staff the reviewer. | 2026-07-14 |
| Eight Plant Organ identities approved | [Organ Selection](RICE_TRANCHE_A_PLANT_ORGAN_SELECTION.md), [Plant-Structure Review Sheet](RICE_TRANCHE_A_PLANT_STRUCTURE_REVIEW_SHEET.md), RDP-SRC-015 | Plant Anatomy/Botany Reviewer | **FAIL** | Exact identities and mappings are selected and a term-level sheet exists, but no qualified anatomy/botany approval is recorded. | Assign the reviewer and record term-by-term approval or corrections. | 2026-07-14 |
| Rice applicability approved for all eight organs | RDP-SRC-010/018 locators and [Plant-Structure Review Sheet](RICE_TRANCHE_A_PLANT_STRUCTURE_REVIEW_SHEET.md) | Plant Anatomy/Botany + Agricultural Domain | **FAIL** | Source evidence and review fields exist per organ, but mandatory specialist approvals are absent. | Assign the reviewers and record per-organ decisions. | 2026-07-14 |
| Thai-label policy approved | [Thai-Label Policy](RICE_TRANCHE_A_THAI_LABEL_POLICY.md) | Thai Terminology + Agricultural Domain | **PASS** | Policy is complete; individual preferred forms remain reviewer-gated. | Enforce explicit unknown/provisional status until reviewed. | 2026-07-14 |
| Thai preferred-label source coverage complete | RDP-SRC-016/017; [Thai Terminology Package](RICE_TRANCHE_A_THAI_TERMINOLOGY_REVIEW_PACKAGE.md); [BBCH Review Sheet](RICE_TRANCHE_A_BBCH_TERMINOLOGY_REVIEW_SHEET.md) | Thai Terminology Reviewer | **FAIL** | Provisional editorial proposals now expose the gaps, but no Thai stage form is approved; exact source support remains absent for several structures; no qualified mapping review exists. | Authorize qualified reviewers, decide every proposal, and obtain or document adequate source/editorial basis. | 2026-07-14 |
| Source rights/use boundaries documented | [Source Assessment](RICE_TRANCHE_A_SOURCE_ASSESSMENT.md) and BBCH Visual Review | Source and Rights Reviewer | **PASS** | None for documentation scope; candidate extraction remains review-gated. | Enforce minimal-use boundaries and exclude images/full tables/prose. | 2026-07-14 |
| Candidate identifier rule approved | [Identifier Rule](RICE_PILOT_CANDIDATE_IDENTIFIER_RULE.md) | Architecture Reviewer | **PASS** | No IDs allocated. | Create registry only after start authorization. | 2026-07-14 |
| Nested deterministic validation profile approved | [Nested Profile](RICE_TRANCHE_A_NESTED_VALIDATION_PROFILE.md) and [Validation Contract](RICE_PILOT_VALIDATION_CONTRACT.md) | Architecture Reviewer | **PASS** | Documentation contract is complete; validator location/limits still require start authorization. | Record parser limits, registry format, and validator location before first YAML. | 2026-07-14 |
| Mandatory reviewer functions assigned | [Reviewer Matrix](RICE_PILOT_REVIEWER_MATRIX.md), [Nomination Register](RICE_TRANCHE_A_REVIEWER_NOMINATION_REGISTER.md), and [Product Owner Guide](RICE_TRANCHE_A_PRODUCT_OWNER_ACTION_GUIDE.md) | Product Owner | **FAIL** | A fillable register exists, but every mandatory function still lacks a named authorized assignee with qualification basis, consent, conflicts, and separation review. | Product Owner completes and authorizes the register without inventing or self-approving specialist competence. | 2026-07-14 |
| Candidate/production separation confirmed | ADR-009, identifier rule, and nested profile | Architecture Reviewer | **PASS** | None | Keep candidate-only path/status and prohibit promotion automation. | 2026-07-14 |
| Design Freeze preserved | Sprint-015C diff audit | Architecture Reviewer | **PASS** | None | Continue documentation-only work. | 2026-07-14 |
| Chief Architect start authorization recorded after Sprint-015D review | Repository history / explicit approval record | Chief Architect | **FAIL** | Baseline approval covers Sprint-015B and framework selection, not a post-Sprint-015D authorization to start candidate authoring. | Review the completed Sprint-015D commit and record an explicit start decision. | 2026-07-14 |

## Gate decision

Source structure, BBCH inspection, exact organ selection proposal, identifier governance, nested validation documentation, and the empty specialist review package are complete. Forms do not constitute decisions. Tranche A remains blocked because crop/anatomy/applicability approvals are absent, Thai preferred-label coverage is incomplete, mandatory qualified reviewers are unassigned, and post-Sprint-015D Chief Architect start authorization does not exist.

Until every mandatory row passes, do not create `data/candidates/rice/`, allocate an identifier, or author candidate YAML.
