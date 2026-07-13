# Rice Pilot Minimal Deterministic Validation Contract

- Status: Approved documentation contract; implementation not authorized
- Date: 2026-07-14
- Applies before: first Rice candidate YAML is authored

This contract specializes [ADR-009](../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md). It defines failure conditions but creates no schema, validator, candidate directory, or record. Mechanical success never asserts scientific correctness, rights clearance, diagnosis, regulation, safety, or recommendation validity.

## Canonical profile

The [Tranche A Nested Validation Profile](RICE_TRANCHE_A_NESTED_VALIDATION_PROFILE.md) defines the exact 18-key top-level order, every nested key order and type, four entity-type profiles, controlled values, value-state objects, list ordering, and prohibited fields. It is normative for Tranche A. Relationship records and relationship fields are prohibited rather than represented as empty values.

## Check classes

### Syntactic checks

- File bytes are valid UTF-8 without BOM; line endings are LF; indentation is two spaces; tabs and trailing whitespace fail.
- A safe YAML 1.2 parser reads exactly one document whose root is a mapping.
- Mapping keys are unique at every depth. Duplicate keys fail before construction.
- Anchors, aliases, merge key `<<`, custom tags, directives, explicit complex keys, and executable/object construction features fail.
- Plain null, `~`, empty mapping values, and implicit timestamp objects fail. Dates and YAML-ambiguous strings are explicitly quoted.
- Parser limits for document size, nesting depth, and alias expansion must be set before implementation; aliases remain prohibited even with limits.

### Structural checks

- Only the ordered top-level and nested allowlists in the Tranche A profile are permitted; unknown or out-of-order keys fail.
- `record_type` is exactly `entity`; context and relationship records remain prohibited until separately scoped.
- Tranche A `entity_type` is exactly `Crop`, `GrowthStageSystem`, `GrowthStage`, or `PlantOrgan`. Later types require a reviewed contract revision.
- `candidate_status` is exactly `draft_candidate`, `in_review`, `changes_requested`, `accepted_candidate`, `rejected`, `withdrawn`, or `superseded`. These are all candidate-workflow states; production/published status is prohibited.
- `candidate_id` matches `^CPM-CAND-E-[0-9]{6}$`; relationship identifiers and records are prohibited in Tranche A.
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
- The Tranche A predicate allowlist is empty, so relationship records and relationship fields fail. Inverses, transitivity, equivalence, causality, and diagnosis are never inferred.
- Supersession references resolve, are non-self-referential, and do not form invalid cycles.

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

The nested field profile, controlled candidate statuses, entity types, and empty predicate allowlist are now documented. Before any YAML is created, Chief Architect start authorization must still record the registry format, parser/size limits, and approved validator location. Implementing this contract may not modify the frozen existing semantic-validation implementation without separate architecture approval.
