# Minimum Candidate-Record Envelope

This is a documentation contract, not a YAML template, schema, identifier allocation, or agricultural record. Sprint-016 must translate it into a separately reviewed candidate template only after ADR-009 is Accepted.

## Common fields

| Field | Obligation | Rule |
| --- | --- | --- |
| Candidate identifier | Required | Candidate-only review handle; unique, label-independent, non-reused, and visibly non-production. No values are allocated in Sprint-015A. |
| Entity/item type | Required | One approved pilot category or relationship-statement type; type does not imply truth. |
| Candidate status | Required | Must remain `Candidate` or an approved candidate workflow state; production/published status is prohibited before promotion. |
| Preferred Thai label | Required for label-bearing entities | Source-backed, language/script-qualified, reviewed for intended scope; unresolved values use explicit state. |
| Preferred English label | Conditionally required | Required when a suitable source supports it; otherwise record `unknown` with review action, never invent a translation. |
| Alternative labels | Optional | Each form carries language/script, type, source, ambiguity, and review status; label match never establishes identity. |
| Scientific name | Conditionally required | Only for applicable biological identities and only with taxonomy-verification metadata; never ordinary translation. |
| Authority identifier | Conditionally required | Required when an applicable selected authority provides one; preserve authority/version and mapping type. It is not the local identity. |
| Concise scope note | Required | Defines inclusion, exclusion, entity/role/context boundary, and prohibited inference in original prose. |
| Source references | Required | References to Approved-for-Pilot source-register items for material content. Discovery pages alone are insufficient. |
| Source-specific evidence references | Required | Exact page, section, table/figure locator, authority-record locator, or stable fragment plus supported claim. |
| Provenance note | Required | Source/version/access, authoring or paraphrase method, curator, transformations, and custody/review history. |
| Language status | Required | Records completeness/review of Thai, English, scripts, transliteration, and unresolved ambiguity. |
| Taxonomy verification status | Required | `not_applicable`, unresolved, disputed, or reviewer-approved with authority evidence; required even to state non-applicability. |
| Reviewer status | Required | Role-specific decisions, reviewer reference, date, scope, and blockers; workflow state is not truth. |
| Ambiguity/dispute note | Required | Explicit `none_identified` with review basis, or competing interpretations/evidence and resolution action. |
| Relationships or relationship references | Required | Empty reviewed set or references to separate relationship candidates; no inferred back-links or label-derived relationships. |
| Supersession fields | Required | Explicit `not_applicable` for new candidates or predecessor/successor/reason/effective review when applicable. |
| Creation and review dates | Required | Quoted ISO 8601 dates; distinguish creation, source publication/update, access, review, and effective dates. |

## Relationship-specific fields

A relationship candidate additionally requires subject candidate reference, controlled predicate, object candidate reference or typed value, claim scope, context, source/evidence references, temporal/jurisdictional applicability, confidence/uncertainty basis, supporting and contradicting evidence, reviewer decisions, and supersession history. It must state whether the predicate is descriptive, causal, contextual, mapping, or classificatory. No inverse, transitive, equivalence, diagnostic, regulatory, safety, or recommendation semantics are implicit.

## Value-state rules

- **Unknown:** the field applies but evidence/review has not established a value; record reason and resolution owner.
- **Not applicable:** the field does not apply to this type/scope; record the rule and reviewer basis.
- **Disputed:** preserve each candidate value, its evidence, proponents/review state, and the unresolved decision.
- **Omitted:** allowed only for an optional field that was not supplied; omission never means unknown, false, or not applicable.

Plain null is prohibited by ADR-009. Empty strings, sentinel labels such as `N/A`, and fabricated placeholders are prohibited.

## Unsupported-inference prohibition

No field may be populated solely from string similarity, translation, page navigation, co-occurrence, URL structure, source prestige, an image without visual review, or an automated guess. Scientific identity, equivalence, causality, pest/weed role, affected stage/organ, diagnosis, regulatory status, safety, and recommendation each require their own applicable evidence and reviewer authority.
