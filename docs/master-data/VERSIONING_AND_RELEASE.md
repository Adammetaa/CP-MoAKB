# Versioning and Release

## Independent version dimensions

- **Entity identity** remains stable across ordinary corrections; an **entity revision** records changed entity metadata.
- A **relationship revision** records changes to an evidence-bearing statement without rewriting entity history.
- A **source revision** is publisher-owned and separately identified from CP-MoAKB retrieval or assessment revisions.
- A **dataset release** packages an approved set of entity and relationship revisions.
- Vocabulary, ontology, and software releases have independent compatibility and approval histories.
- A regulatory effective date and an evidence review date are applicability metadata, not dataset versions.

## Change rules

- **Addition:** mint only after identity review; record first release and provenance.
- **Correction:** preserve identity when intended referent is unchanged; record old/new value, reason, and evidence.
- **Deprecation:** retain the record and replacement guidance; never reuse its identifier.
- **Merge:** preserve all identifiers as historical mappings, select a surviving identity through explicit review, and reassess inbound relationships.
- **Split:** mint new identities, retain lineage, and reassess every ambiguous statement; do not distribute old claims automatically.
- **Source withdrawal:** retain audit metadata, mark availability/authority impact, and trigger affected-record review.
- **Contradictory evidence:** add the contradiction, reassess confidence/status, and do not overwrite the earlier evidence.
- **Jurisdiction change:** create or revise the time-bound jurisdictional statement rather than changing scientific reference identity.
- **Re-review:** record trigger, source cutoff, reviewers, decision, and next review condition/date.

Every release must identify included revisions, source/version cutoff, scope and gaps, validation results, approvals, changes/deprecations, known conflicts, and reproduction instructions. A prior release remains reconstructable. The physical version-number and serialization formats remain undecided.
