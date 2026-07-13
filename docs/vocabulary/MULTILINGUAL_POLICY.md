# Multilingual Policy

## Purpose

CP-MoAKB vocabulary governance must support Thai and English now at the conceptual level, scientific nomenclature where applicable, and future Khmer, Lao, and Vietnamese labels without making any language the concept identity. This document creates no multilingual records or translations.

## Language tracks

| Track | Governance expectation |
| --- | --- |
| Thai | Thai language/script, regional usage, register, spelling, ambiguity, and qualified Thai/domain review. |
| English | English language/script, regional/audience scope where material, terminology consistency, and qualified English/domain review. |
| Scientific Latin/nomenclature | Exact scientific name, nomenclatural/taxonomic authority, rank/status, authorship where material, source version, and domain review. It is not assumed to be an ordinary Latin translation. |
| Khmer | Future-ready language/script metadata, qualified review, regional context, and no automatic derivation from Thai/English. |
| Lao | Future-ready language/script metadata, qualified review, regional context, and no automatic derivation from Thai/English. |
| Vietnamese | Future-ready language/script metadata, qualified review, regional context, and no automatic derivation from Thai/English. |

Support means the conceptual model can retain these forms; it does not claim translations, reviewers, vocabularies, or language coverage currently exist.

## Required metadata

Every future language form SHOULD retain:

- stable concept reference;
- exact Unicode text;
- language tag and script;
- region, jurisdiction, community, audience, or register where relevant;
- preferred, alternative, historical, deprecated, or candidate status;
- label relationship type, including translation/transliteration distinction;
- source, evidence, provenance, reviewer role, review date, and review status;
- validity period or historical usage where applicable;
- ambiguity/homonym notes and prohibited inference; and
- transliteration scheme/version when the form is transliterated.

## Translation and transliteration

Translation asserts comparable meaning between language forms and requires semantic plus domain review. Transliteration converts writing systems according to a named scheme and does not establish equivalent meaning. Machine translation or transliteration MAY propose candidates but MUST NOT create preferred labels, exact synonyms, or accepted terms automatically.

A translated definition SHOULD preserve necessary and distinguishing meaning, scope, exclusions, units, and cautionary language rather than mirror word order. Untranslatable distinctions remain documented instead of being flattened.

## Preferred labels and fallback

There MAY be one preferred label for a concept per declared language, script, audience/region, and validity context. Absence of a preferred label remains explicit. A future interface MAY apply a declared fallback policy, but it MUST show the actual language and MUST NOT relabel an English or scientific form as Thai.

## Ambiguity and cultural review

Common and local names may vary across regions or denote different concepts. Review MUST consider homonyms, sensitive/offensive wording, agricultural usage, scientific precision, commercial influence, and cross-border variation. Regional popularity does not establish universal preference or concept equivalence.
