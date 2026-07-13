# Rice Pilot Minimal Deterministic Validation Contract

- Status: Approved documentation contract; implementation not authorized
- Date: 2026-07-14
- Applies before: first Rice candidate YAML is authored

This contract specializes [ADR-009](../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md). It defines failure conditions but creates no schema, validator, candidate directory, or record. Mechanical success never asserts scientific correctness, rights clearance, diagnosis, regulation, safety, or recommendation validity.

## Canonical top-level key order

When applicable, keys appear exactly in this order; inapplicable optional keys are omitted:

1. `candidate_id`
2. `record_kind`
3. `entity_type`
4. `candidate_status`
5. `labels`
6. `scientific_name`
7. `authority_references`
8. `scope_note`
9. `subject`
10. `predicate`
11. `object`
12. `context`
13. `source_references`
14. `evidence_references`
15. `provenance`
16. `language_status`
17. `taxonomy_verification`
18. `ambiguity`
19. `relationship_references`
20. `supersession`
21. `dates`
22. `review`

`entity_type`, entity content, and `relationship_references` apply to entity/context records. `subject`, `predicate`, `object`, and relationship context apply to relationship records. A profile approved before implementation must define nested key order and the exact allowed entity types and predicates; until it exists, candidate authoring is blocked.

## Check classes

### Syntactic checks

- File bytes are valid UTF-8 without BOM; line endings are LF; indentation is two spaces; tabs and trailing whitespace fail.
- A safe YAML 1.2 parser reads exactly one document whose root is a mapping.
- Mapping keys are unique at every depth. Duplicate keys fail before construction.
- Anchors, aliases, merge key `<<`, custom tags, directives, explicit complex keys, and executable/object construction features fail.
- Plain null, `~`, empty mapping values, and implicit timestamp objects fail. Dates and YAML-ambiguous strings are explicitly quoted.
- Parser limits for document size, nesting depth, and alias expansion must be set before implementation; aliases remain prohibited even with limits.

### Structural checks

- Only the ordered top-level allowlist above is permitted; unknown or out-of-order keys fail.
- `record_kind` is exactly `entity`, `context`, or `relationship`. For structural Tranche A, only `entity` is permitted; context and relationship records remain prohibited until separately scoped.
- Tranche A `entity_type` is exactly `crop`, `growth_stage_system`, `growth_stage`, or `plant_organ`. Later types require a reviewed contract revision.
- `candidate_status` is exactly `draft_candidate`, `in_review`, `changes_requested`, `accepted_candidate`, `rejected`, `withdrawn`, or `superseded`. These are all candidate-workflow states; production/published status is prohibited.
- `candidate_id` matches `^CPM-CAND-[ER]-[0-9]{6}$`; `E` is required for entity/context and `R` for relationship.
- Filename is exactly `<candidate_id>.yaml`, including case, and the file is under the approved record-kind directory.
- Common, entity/context, and relationship conditional fields follow the [Candidate Record Envelope](CANDIDATE_RECORD_ENVELOPE.md). Empty required strings and fabricated placeholders fail.
- An unresolved required value is an object whose state is exactly `unknown`, `not_applicable`, or `disputed`, with the state-specific reason, review basis, and resolution action. Plain sentinel strings such as `N/A` fail.
- Every label contains a value or explicit value state, BCP 47 language tag, ISO 15924 script, label role/status, provenance reference, and ambiguity status. Scientific names are not modeled as translations.
- Dates are quoted ISO 8601 calendar dates or date-times in the profile-approved precision; timezone is mandatory for date-times.
- Set-like lists are sorted by their declared stable identifier and contain no duplicates. Meaningfully ordered lists retain documented order.

### Referential checks

- Candidate identifiers are unique across the allocation registry, filenames, and record bodies, including retained rejected/superseded history.
- Every source reference resolves to one source-register ID whose status and explicitly approved claim scope cover the field using it.
- Every material claim has an evidence locator in the source-specific format defined by its assessment. A bare URL or portal page is insufficient.
- Relationship subject and candidate-object references resolve to existing candidate records; typed literal objects follow their approved type profile.
- Every predicate exists in the versioned pilot allowlist. The Tranche A predicate allowlist is empty, so relationship records fail. Inverses, transitivity, equivalence, causality, and diagnosis are never inferred.
- Supersession and relationship references resolve, are non-self-referential where prohibited, and do not form invalid cycles.

### Semantic-governance checks

- Files exist only below the future approved `data/candidates/rice/` root and carry candidate-only status and identifiers.
- Production identifiers, production/published status, runtime-ingestion directives, and automatic-promotion flags fail.
- Recommendation, diagnosis, treatment, pesticide guidance, regulatory status, safety, efficacy, and unsupported causal fields fail because they are outside Tranche A.
- Approved source claim boundaries are enforced. Discovery-only, Restricted, Under Assessment, Rejected, or Superseded sources cannot support candidate content outside an explicitly approved exception.
- Missing/conflicting evidence remains explicit; string matching, translation, navigation grouping, or co-occurrence cannot create identity or relationships.

### Human-review-only decisions

Mechanical checks cannot approve scientific or agricultural correctness, taxonomic concept identity, translations, stage/organ applicability, source currency, rights, evidence strength, causal truth, contextual pest/weed/pathogen roles, reviewer qualifications, or conflict-of-interest dispositions. Each requires the reviewer function named by policy and an auditable decision.

## Determinism and failure behavior

Validation is read-only: it must not rewrite candidate files, frozen source, official datasets, golden baselines, or generated artifacts. Given identical repository bytes and declared tool versions, it must produce the same ordered diagnostics and exit status. Diagnostics sort by path, line, rule ID, and message. A formatter, if separately approved later, must fail on semantic ambiguity rather than choose a meaning.

## Implementation gate

Before any YAML is created, Chief Architect approval must record the nested field profile, controlled candidate statuses, entity types, predicate allowlist, registry format, parser/size limits, and validator location. Implementing this contract may not modify the frozen existing semantic-validation implementation without separate architecture approval.
