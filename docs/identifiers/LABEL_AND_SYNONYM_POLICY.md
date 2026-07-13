# Label and Synonym Policy

## Purpose

Labels help people find and understand governed identities; they are not identities themselves. This policy supports Thai, English, scientific, commercial, historical, and local language while preventing spelling or translation from becoming an unreviewed merge rule. It creates no vocabulary records.

## Label types

| Type | Meaning and boundary |
| --- | --- |
| Canonical preferred label | The preferred display label for a concept within a declared language, audience, region, and validity context; “canonical” does not make the string globally unique. |
| Thai preferred label | Preferred Thai display form with language/script, source, review, and regional context. |
| English preferred label | Preferred English display form with language/script, source, review, and regional context. |
| Scientific name | A name governed by an appropriate taxonomic/nomenclatural authority and version, including rank/status where needed; not automatically a crop concept. |
| Common name | A widely used non-scientific name qualified by language, locality/community, and ambiguity. |
| Alternative label | A reviewed additional label for the same concept within stated scope. |
| Historical label | A previously used label retained for discovery and provenance, with validity period and status. |
| Abbreviation | A shortened form whose expansion, language, domain, and ambiguity are recorded. |
| Misspelling | A documented erroneous form for search/quality purposes; it MUST NOT be presented as preferred. |
| Transliteration | A script conversion linked to its scheme/version and source form; not a translation. |
| Trade name | A commercial label whose owner, market, jurisdiction, product/registration context, and time matter. It is not an active ingredient or legal permission. |
| Local vernacular name | A community/region-specific name with provenance and known ambiguity. |
| Deprecated label | A retained label no longer recommended, with reason and replacement where applicable. |
| Ambiguous label | A string that may refer to multiple governed concepts or categories; it MUST remain ambiguous until context and review resolve it. |

## Required distinctions

- **Identity** is the stable governed referent.
- **Label** is a display/search string attached to an identity in a context.
- **Synonym** is a reviewed claim that another label denotes the same concept within stated scope.
- **Translation** expresses comparable meaning in another language and requires semantic review.
- **Transliteration** converts writing systems and does not establish equivalent meaning.
- **Taxonomic name** belongs to a source-governed nomenclatural/taxonomic context.
- **Commercial name** belongs to an owner, product/market, jurisdiction, and period.

Unreviewed source strings MAY be retained as original observations or candidate labels, but they are not governed synonyms until reviewed. Homonyms remain linked to multiple candidate identities rather than forced into one.

## Multilingual metadata

Every governed label SHOULD retain:

- referenced concept identifier;
- exact Unicode text;
- language tag and script;
- label type and preferred/alternative status;
- jurisdiction, region, community, or market where relevant;
- source, source version, or asserted origin;
- validity period and historical/deprecation state;
- reviewer, review date, and review status; and
- ambiguity notes, transliteration scheme, or taxonomic/commercial authority where applicable.

There MAY be one preferred label per language/script and declared context, not one universal preferred string. Search normalization MUST preserve the original label and MUST NOT alter identity.

## Identity examples and cautions

`Rice`, `ข้าว`, and `Oryza sativa` MUST NOT automatically be declared identical. The first two may be language/context-sensitive common or crop labels; the third may be a scientific taxonomic name under a named authority. A scientific taxon, cultivated crop concept, cultivar, planted crop instance, and field observation may be related but are different identities.

This example is conceptual and assigns no identifier or vocabulary record. The same caution applies to pest names, disease names, symptoms, product trade names, ingredients, and registration records.

## Label governance

- A label change or typo correction normally updates/revises label metadata without changing the concept identifier.
- A change that reveals a different referent or materially changed concept scope requires identity review and MAY require a new identifier.
- Preferred-label selection MUST be attributed and reviewable; frequency or search ranking alone is insufficient.
- Scientific-name matching MUST retain authority, taxonomic version, rank, authorship where material, and synonym status.
- Trade names MUST NOT be used to infer ingredient composition, registration identity, legal status, or equivalence across jurisdictions.
- Deprecated/historical labels remain available for traceability but MUST be visibly non-preferred.
- Offensive, misleading, legally restricted, privacy-revealing, or untraceable labels MAY be prohibited from display while their existence is retained under controlled provenance when audit requires it.

## Prohibited label usage

Labels MUST NOT serve as primary keys, prove identity, establish exact equivalence, establish legal permission, imply evidence quality, or trigger silent merges. Implementations MUST NOT discard diacritics, Thai script distinctions, authorship, punctuation, or word order in the authoritative value merely because normalized forms are used to propose search candidates.
