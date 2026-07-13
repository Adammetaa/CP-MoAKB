# Sprint-016 Tranche A Entry Checklist

- Assessment date: 2026-07-14
- Decision: **BLOCKED — DO NOT START CANDIDATE AUTHORING**
- Scope ceiling: one Crop, one Growth-stage-system, eight Growth Stage, and eight Plant Organ candidates

Every mandatory row must be `PASS`. `FAIL` cannot be waived by mechanical validation or by reducing documentation detail.

| Mandatory condition | Result | Evidence or unresolved condition |
| --- | --- | --- |
| ADR-009 Accepted | **PASS** | [ADR-009](../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md) records Chief Architect approval following Sprint-015A review. |
| One growth-stage framework selected | **PASS** | [Growth-Stage Framework Decision](RICE_GROWTH_STAGE_FRAMEWORK_DECISION.md) selects the 2018 JKI BBCH rice key and exact eight-stage subset. |
| Applicable sources Approved for Pilot Use | **FAIL** | [Source Assessment](RICE_TRANCHE_A_SOURCE_ASSESSMENT.md) approves sources for several scoped claims, but cultivated-rice scope, stage boundaries, Thai preferred labels, and final eight-organ rice applicability lack approved evidence. |
| Source-use boundaries documented | **PASS** | The source assessment records rights, safe-use boundaries, prohibited copying, and claim-specific restrictions. |
| Taxonomic authority selected for Rice | **PASS** | [Taxonomic Authority Policy](RICE_PILOT_TAXONOMIC_AUTHORITY_POLICY.md) selects POWO for accepted concept/status and IPNI for nomenclature. |
| Candidate identifier rule approved | **PASS** | [Candidate Identifier Rule](RICE_PILOT_CANDIDATE_IDENTIFIER_RULE.md) defines syntax, future registry, allocation, non-reuse, history, and filename mapping without allocating an ID. |
| Deterministic validation contract approved | **PASS** | [Validation Contract](RICE_PILOT_VALIDATION_CONTRACT.md) defines minimum checks; implementation and nested profiles remain a pre-authoring action under Chief Architect control. |
| Required reviewer functions assigned | **FAIL** | [Reviewer Matrix](RICE_PILOT_REVIEWER_MATRIX.md) records mandatory curator, agricultural, taxonomy, rights, evidence, architecture, and Product Owner staffing gaps. |
| Candidate/production separation confirmed | **PASS** | ADR-009 and the identifier rule prohibit production identifiers/status, runtime ingestion, and automatic promotion. No candidate directory or record exists. |
| Design Freeze preserved | **PASS** | Sprint-015B is documentation-only and changes no parser, exporter, database schema, existing validation implementation, official IRAC dataset, or golden baseline. |
| Chief Architect authorization to start Tranche A recorded | **FAIL** | ADR-009 content acceptance is recorded, but no authorization to begin Sprint-016 candidate authoring is present. |

## Required blocker dispositions

Before reassessment:

1. Approve an item-level source for cultivated-rice scope.
2. Record human visual review and exact locators for BBCH rice-stage boundaries.
3. Approve sources and reviewers for Thai preferred labels.
4. Select the exact eight Plant Ontology terms and approve their rice applicability.
5. Record named, qualified, authorized assignees for every mandatory reviewer function with separation of duty.
6. Complete the pre-authoring nested profile and controlled allowlists required by the validation contract.
7. Record Chief Architect authorization for the bounded Tranche A start.

Until every row passes, Sprint-016 may resolve governance and staffing blockers but must not create `data/candidates/rice/`, allocate identifiers, or author candidate records.
