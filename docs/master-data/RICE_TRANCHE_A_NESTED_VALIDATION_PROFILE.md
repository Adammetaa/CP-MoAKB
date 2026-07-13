# Tranche A Nested Candidate-Record Validation Profile

- Status: Approved documentation contract; no implementation or candidate file authorized
- Date: 2026-07-14
- Applies to: exactly 18 future entity candidates; relationship records are prohibited

This profile completes the nested structure required by [ADR-009](../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md) and the [minimal validation contract](RICE_PILOT_VALIDATION_CONTRACT.md). “Required” means the key must exist. A conditional value that is unresolved uses the exact value-state object below; plain null, empty string, and sentinel text are prohibited.

## Exact top-level order

Every Tranche A record has exactly these keys in this order:

1. `candidate_id`
2. `record_type`
3. `entity_type`
4. `candidate_status`
5. `labels`
6. `scientific_name`
7. `external_identifiers`
8. `scope_note`
9. `classification`
10. `sources`
11. `evidence`
12. `language_status`
13. `taxonomy_status`
14. `review`
15. `ambiguity`
16. `supersession`
17. `created_date`
18. `reviewed_date`

All are required. Unknown top-level keys fail. `relationships`, `relationship_references`, inline predicates, subject/object keys, recommendation, diagnosis, regulation, safety, treatment, product, and runtime-ingestion keys are prohibited. There is no empty relationships list: the key must be absent.

## Scalars and controlled values

| Key | Type and value rule |
| --- | --- |
| `candidate_id` | Quoted uppercase string matching `^CPM-CAND-E-[0-9]{6}$`; registry allocation required. |
| `record_type` | Quoted string exactly `entity`. |
| `entity_type` | Exactly `Crop`, `GrowthStageSystem`, `GrowthStage`, or `PlantOrgan`. |
| `candidate_status` | Exactly `draft_candidate`, `in_review`, `changes_requested`, `accepted_candidate`, `rejected`, `withdrawn`, or `superseded`. |
| `scope_note` | Non-empty original prose string; no copied source paragraph and no unsupported claim. |
| `created_date`, `reviewed_date` | Quoted ISO 8601 calendar date `YYYY-MM-DD`; `reviewed_date` may instead be an explicit `unknown` state before review. |

Documentation-only placeholder `CPM-CAND-E-999999` and filename `CPM-CAND-E-999999.yaml` are unmistakably fictional and never allocatable. Real filenames must equal `<candidate_id>.yaml` byte-for-byte. This document does not reserve a number or create a YAML file.

## Explicit value-state objects

An unresolved scalar/object position uses keys in this exact order:

1. `state`
2. `reason`
3. `resolution_action`
4. `owner_role`

`state` is `unknown` or `not_applicable`; all four values are non-empty quoted strings, except that `state` uses its controlled value. `not_applicable` must cite the governing profile rule in `reason`.

A disputed position uses this exact order:

1. `state` = `disputed`
2. `alternatives`
3. `reason`
4. `resolution_action`
5. `owner_role`

`alternatives` is a non-empty list sorted by `value`, each with ordered keys `value`, `source_refs`, `evidence_refs`, and `review_status`. No alternative is silently selected.

## Nested object profiles

Unless a rule below explicitly permits a value-state alternative, every listed nested key is required, appears in the stated order, and no other key is allowed. Conditional applicability changes the value to an explicit state object; it never silently omits a required key.

### `labels`

A non-empty list sorted by language priority (`th`, `en`, then other BCP 47 tags), role priority (`preferred`, `alternative`, `transliteration`, `scientific`), and Unicode code-point value. Each object has exactly:

1. `value` — non-empty string or disputed value-state object
2. `language` — BCP 47 tag; `und` only for language-neutral code/name
3. `script` — ISO 15924 code (`Thai`, `Latn`, or approved value)
4. `role` — `preferred`, `alternative`, `transliteration`, or `scientific`
5. `basis` — `source`, `editorial_translation`, `transliteration`, or `nomenclatural_authority`
6. `status` — `provisional`, `reviewed`, or `approved`
7. `source_refs` — sorted unique source IDs, or `not_applicable` state for an editorial form
8. `evidence_refs` — sorted unique local evidence IDs, or `not_applicable` state
9. `editor_ref` — curator/translator reference, or `not_applicable` state for directly sourced form
10. `ambiguity` — ordered object with `status`, `note`, `resolution_action`; status is `none_identified`, `identified`, or `disputed`

Exactly one preferred label per language is allowed. A provisional form cannot be the sole basis for identity matching.

### `scientific_name`

Either a value-state object or exactly ordered keys:

1. `value`
2. `authorship`
3. `rank`
4. `name_status`
5. `authority_source`
6. `authority_identifier`
7. `concept_scope`
8. `review_status`

All are strings. `name_status` is `accepted`, `synonym`, `historical`, or `unresolved`; `review_status` is `pending`, `approved`, `changes_requested`, or `disputed`. Only Crop may use this object in Tranche A; the other three entity types require `not_applicable`.

### `external_identifiers`

A non-empty list sorted by `authority`, then `identifier`. Each object has exactly `authority`, `identifier`, `mapping_type`, `source_ref`, `evidence_ref`, `authority_version`, `review_status`. `mapping_type` is `taxonomic_anchor`, `nomenclatural_reference`, `framework_code`, or `ontology_mapping`. `review_status` uses `pending`, `approved`, `changes_requested`, or `disputed`. Identifiers never replace the local candidate ID.

### `classification`

A non-empty list sorted by `scheme`, then `code`. Each object has exactly `scheme`, `code`, `label`, `parent_code`, `source_ref`, `evidence_ref`, `review_status`. `parent_code` may use `not_applicable`. Allowed schemes in Tranche A are `CP-MoAKB-Crop-Scope-2026-07-14`, `POWO`, `BBCH-2018-rice`, and `Plant-Ontology-2026-01-09`.

### `sources`

A non-empty list sorted by `source_id`. Each object has exactly `source_id`, `claim_scopes`, `use_status`, `access_date`. `claim_scopes` is a non-empty sorted unique list of controlled claim-scope strings. `use_status` must be `Approved for Pilot Use`; other source statuses fail for material candidate content. `access_date` is a quoted ISO date.

### `evidence`

A non-empty list sorted by local `evidence_id`. Each object has exactly:

1. `evidence_id` — `E` plus two digits, unique within the record
2. `source_id`
3. `locator`
4. `supports`
5. `method`
6. `interpretation`

`method` is `direct_label`, `normalized_label`, `structured_fact`, or `editorial_mapping`. `interpretation` is concise original prose. A bare URL, copied paragraph, unreviewed image, or portal-only locator fails.

### `language_status`

Exactly ordered keys `thai`, `english`, `scientific`, `unresolved_actions`. The first three values are `not_applicable`, `unknown`, `provisional`, `reviewed`, or `approved`. `unresolved_actions` is a sorted unique list of non-empty strings, empty only when every applicable language status is approved.

### `taxonomy_status`

Exactly ordered keys `applicability`, `status`, `authority_refs`, `reviewer_role`, `note`. `applicability` is `required` or `not_applicable`; `status` is `not_applicable`, `pending`, `approved`, or `disputed`; `authority_refs` is a sorted unique list or a matching value-state object. An `approved` status requires a recorded Taxonomy Reviewer decision.

### `review`

A non-empty list sorted by the repository role order in the Reviewer Matrix. Each object has exactly `role`, `assignment_ref`, `status`, `reviewer_ref`, `review_date`, `scope`, `conflict_of_interest`, `decision_note`. `status` is `pending`, `approved`, `changes_requested`, `blocked`, or `not_required`; `conflict_of_interest` is `none_declared`, `declared`, or `unknown`. Unknown reviewer/date values use value-state objects. Approval by an unassigned role fails.

### `ambiguity`

Exactly ordered keys `status`, `issues`, `resolution_action`, `owner_role`. `status` is `none_identified`, `identified`, or `disputed`. `issues` is a sorted unique list; it may be empty only for `none_identified`. Other fields remain non-empty and cite the review basis or action.

### `supersession`

For a new record, use the `not_applicable` value-state object. Otherwise use exactly `predecessor_id`, `reason`, `effective_date`, `review_ref`; the predecessor must resolve, must not equal the current ID, and must never be deleted or reused.

## Entity-type profiles

| Entity type | Count | Required specializations |
| --- | ---: | --- |
| `Crop` | 1 | Thai and English preferred labels; scientific-name object; POWO taxonomic anchor and IPNI nomenclatural identifier; crop/taxon distinction in scope; POWO and agricultural classifications/evidence. |
| `GrowthStageSystem` | 1 | English preferred label and language-neutral `BBCH`; scientific name `not_applicable`; DOI/edition external identifier; BBCH classification identifying the complete rice system while scope notes the eight-stage pilot subset. |
| `GrowthStage` | 8 | One BBCH code external identifier/classification; exact selected principal code 0, 1, 2, 3, 4, 5, 6, or 8; system source and page evidence; scientific name `not_applicable`; Thai status follows the Thai-label policy. |
| `PlantOrgan` | 8 | One exact PO ontology mapping and anatomical-level classification from the selected set; rice-applicability evidence; scientific name `not_applicable`; whole/part/near-neighbor exclusions in scope. |

Any other count, entity type, BBCH code, or PO mapping fails the Tranche A profile. No relationship candidate, relationship field, or automatic inverse is permitted.
