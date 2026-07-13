# Future Term Model

## Purpose

This document describes the information a future governed vocabulary term should carry. It is conceptual and implementation-neutral. Capitalized field names are documentation labels, not classes, columns, properties, JSON keys, or production records.

## Conceptual fields

| Field | Meaning and governance boundary |
| --- | --- |
| Concept Reference | Stable identifier of the governed concept being labeled; a term MUST NOT create identity from text. |
| Preferred Label | Preferred human-readable label within one declared language/script/context. |
| Preferred Thai | Preferred Thai label after Thai language and domain review. |
| Preferred English | Preferred English label after English terminology and domain review. |
| Scientific Name | Source-governed nomenclatural name with authority, rank/status, version, and provenance where applicable. |
| Common Name | Non-scientific name qualified by language, region/community, ambiguity, and source. |
| Alternative Label | Reviewed additional label for the same concept and declared scope. |
| Definition | Necessary and distinguishing meaning for vocabulary use, bounded by the ontology concept and supported by sources. |
| Scope Note | Inclusion, exclusion, domain, audience, jurisdiction/region, and concept-boundary clarification. |
| Usage Note | Guidance on correct display/search/use, common confusion, prohibited inference, or contextual limitations. |
| Language | Language tag plus script and region/community where material. |
| Category | Governed term/concept category used for review and consistency, not an identity encoded in the label. |
| Reviewer | Identified reviewer role, decision, date, and review scope. |
| Source | Identifiable source and version from which a label, definition, or usage claim originates. |
| Evidence | Support or contradiction for a definition, synonym, translation, or mapping; distinct from the source record and the term itself. |
| Status | Vocabulary workflow/lifecycle state, independent of scientific confidence or regulatory status. |
| Provenance | Origin, proposal, transformation, source/version, authorship, review, decision, and change history. |

## Required distinctions

- A **term** is a language expression associated with a concept; the **concept** is the governed meaning and identity.
- A **preferred label** is selected for a language/context; it is not a universal canonical string.
- A **definition** explains vocabulary meaning; it is not a scientific assertion, regulation, diagnosis, or recommendation.
- A **source** identifies origin; **evidence** explains support for a particular claim about the term.
- **Reviewer** and **status** document workflow authority; neither proves truth.
- **Scientific Name** is a nomenclatural/taxonomic record under an authority, not automatically the Latin-language translation of a common name.

## Minimum acceptance information

Every future term proposed for acceptance MUST include at least:

- definition;
- scope;
- evidence;
- source;
- reviewer;
- language/script;
- category; and
- status.

It MUST also reference a governed concept identity and carry provenance. If a required element is unavailable, the proposal remains Draft or records an explicit justified exception through governance; it MUST NOT be presented as accepted production content.

## Cardinality guidance

A future concept MAY have multiple labels, definitions, notes, sources, and historical forms. It SHOULD have no more than one preferred label for each declared combination of language, script, audience, region, and validity context. Multiple competing candidates remain separately reviewable until a decision is recorded.

This guidance does not select a database schema, validation language, serialization, or controlled vocabulary.
