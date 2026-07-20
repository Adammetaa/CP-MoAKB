# KAS-005: Terminology Standard

Status: Active

Version: 1.0

## Purpose

Govern how CP-MoAKB proposes, distinguishes, reviews, uses, changes, and retires
terms across languages and naming authorities without turning labels into
identity or scientific truth.

## Scope

This standard applies to preferred terms, alternative terms, synonyms,
scientific names, Thai and English names, deprecated names, abbreviations, and
spelling variants. It builds on existing
[vocabulary governance](../vocabulary/README.md).

## Out of Scope

This standard does not create a vocabulary, select preferred labels for real
concepts, translate content, resolve taxonomy, define identifiers, implement
search normalization, or approve domain meaning.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative. Lexical similarity MAY initiate review but MUST NOT establish
identity, equivalence, hierarchy, diagnosis, or recommendation relevance.

## Definitions

- **Preferred Term** is the reviewed display term for one concept within a
  declared language, script, audience, region, and validity scope.
- **Alternative Term** is an accepted expression for the same governed concept
  in a stated context but is not the preferred display form there.
- **Synonym** is a reviewed lexical relationship whose exactness and scope are
  stated; it is not inferred from spelling or translation.
- **Scientific Name** is a name governed by a declared nomenclatural or taxonomic
  authority, rank, authorship/status, and authority version where applicable.
- **Thai Name** and **English Name** are language-scoped terms, not independent
  evidence of identity or universal preferred status.
- **Deprecated Name** is retained for history or discovery but is no longer
  preferred for new use in its declared scope.
- **Abbreviation** is a shortened form with an expansion and domain context.
- **Spelling Variant** is an attested orthographic form; it is not automatically
  a synonym or error.

## Governance Rules

Every term proposal MUST reference a stable governed concept identity and record
exact text, language, script, term type, authority/source, scope, status,
provenance, review history, validity, ambiguity, and replacement when relevant.

1. A Preferred Term MUST be unique only within its declared concept and usage
   scope. One globally preferred label MUST NOT be assumed.
2. Alternative Terms and synonyms MUST state whether equivalence is exact,
   contextual, broad, narrow, historical, colloquial, or otherwise qualified.
3. Scientific Names MUST remain attributed to their naming authority. Taxonomic
   synonymy MUST NOT be inferred from common-name equivalence or string matching.
4. Thai and English names MUST record language/script and regional or audience
   context. Translation MUST undergo semantic, language, and domain review;
   transliteration MUST name its scheme and MUST NOT be treated as translation.
5. Deprecated Names MUST remain discoverable for audit and migration, clearly
   marked with reason, validity, and reviewed replacement when one exists.
6. Abbreviations MUST record expansion, case, punctuation, language, domain, and
   ambiguity. An ambiguous abbreviation MUST NOT resolve automatically.
7. Spelling variants and documented misspellings MUST preserve the source form.
   Interfaces MAY support discovery, but source evidence MUST NOT be silently
   normalized.
8. External terminology remains under external authority. A local mapping MUST
   record mapping type, source version, reviewer, scope, and disagreement.
9. Term status MUST follow the applicable vocabulary and
   [knowledge lifecycle](KAS-007-knowledge-lifecycle.md). Accepted is not
   Published, and Published is not proof of scientific, legal, or diagnostic
   validity.
10. Material meaning change, merge, or split MUST trigger concept-identity and
    ontology review; term governance MUST NOT hide it as a label edit.

## Examples

- A fictional concept has different reviewed preferred terms for Thai technical
  readers and English general readers, each with its own source and usage note.
- A fictional abbreviation is retained as ambiguous across two domains and is
  never resolved without context.

These examples establish no real term or mapping.

## Non-examples

- Selecting the most frequent web phrase as the preferred term.
- Treating Thai and English strings as equivalent without semantic review.
- Using a scientific name as a permanent local identifier.
- Deleting an obsolete term and its historical citations.
- Treating a spelling variant as proof that two concepts are the same.

## Reviewer Notes

Terminology reviewers SHOULD check clarity and usage; language reviewers SHOULD
check language/script and cultural context; domain reviewers SHOULD check
referent and scope; evidence reviewers SHOULD check asserted synonymy; ontology
and identity reviewers SHOULD examine merges, splits, and broader/narrower
relations. Missing perspectives MUST remain visible.

## Future Considerations

Future standards may define style guides, transliteration profiles, taxonomic
authority mappings, or machine-assisted candidate generation. Automation MAY
propose terms but MUST NOT approve preferred status, synonymy, concept identity,
or publication.
