# Knowledge Explorer Localization Policy

## Status and scope

This policy governs user-interface localization in the static Knowledge Explorer
prototype. It does not govern agricultural knowledge, create accepted
terminology, or alter the CP-MoAKB Runtime, schema, API, parser, validation, or
registries.

## 1. Thai-first user experience

Thai MUST be the default display language on a first visit. Every Explorer page
MUST expose the same visible, keyboard-operable Thai/English selector. A user
MAY store the display preference in `localStorage`; the interface MUST remain
usable with Thai as its deterministic default when browser storage is blocked
or unavailable. Cookies, analytics, and remote localization services MUST NOT
be used.

## 2. English preservation rules

Scientific names, source and record identifiers, lifecycle codes, checksums,
version strings, and official document titles without an official Thai title
MUST remain in English. English MAY remain beside Thai when it removes domain
ambiguity. Preservation is a presentation decision, not an authority claim.

## 3. Scientific-name policy

Scientific names MUST NOT be translated. Where practical, mixed-language
markup SHOULD identify scientific-name content with `lang="en"`. This sprint
contains no real scientific name; its explicit placeholder MUST remain visibly
non-assertive.

## 4. Standards and specifications policy

IRAC, FRAC, HRAC, BBCH, ADR, RAS, KAS, KGS, Runtime, API, checksums, and version
values MUST retain their official identifiers. Explanatory interface copy MAY
be localized, but localization MUST NOT change the scope or authority of a
standard, specification, or repository document.

## 5. Thai and English dual-label policy

Important scientific-domain navigation labels SHOULD show Thai and English
together, for example `โรค (Disease)`. Dual labels are aids to navigation. They
MUST NOT be interpreted as an accepted equivalence, canonical synonym, or
approved vocabulary record.

## 6. Terminology uncertainty handling

When an authoritative Thai term is unavailable, unclear, or disputed, the
English term MUST be retained and the uncertainty MUST be recorded for future
terminology review. Interface authors MUST NOT resolve scientific uncertainty
by choosing a convenient translation.

## 7. Prohibited invented translations

Authors MUST NOT invent Thai scientific names, organism names, regulated
classification terms, accepted synonyms, causal claims, diagnostic labels, or
recommended actions. Fictional record titles MAY be localized only as clearly
fictional, non-substantive interface placeholders.

## 8. Review responsibility

The prototype maintainer is responsible for translation-key completeness,
accessibility, and preservation of prototype boundaries. A qualified
terminology reviewer MUST review any future domain term before it can be
proposed for governed vocabulary. Scientific, terminology, ontology, evidence,
and publication review authorities remain distinct under the Knowledge
Constitution and KGS.

## 9. Future governed-vocabulary connection

Future implementations MAY obtain approved labels from a separately governed
vocabulary only after its authority, version, identifier, and review status can
be traced. The current static dictionaries MUST NOT be promoted into that role
without a separately authorized knowledge-governance process.

## 10. UI localization versus knowledge translation

UI localization translates navigation, instructions, controls, notices, and
fictional demonstration copy. Knowledge translation would translate governed
definitions, claims, evidence interpretations, terminology, or relationships
and therefore requires separate scientific and governance authority.

**UI translation does not make a term an accepted CP-MoAKB vocabulary term.**
No translation in this sprint is authoritative agricultural knowledge.

## Review notes

- Thai and English dictionaries MUST have identical key structures.
- Missing keys MUST fail deterministic validation; the interface MUST NOT hide
  missing translations behind silent fallback.
- Every mock record MUST retain the literal lifecycle status
  `fictional-placeholder`.
- The indexing boundary `noindex,nofollow` MUST remain on every Explorer page.

## Future work

Future work MAY define terminology-review evidence, governed vocabulary
identifiers, and translation provenance. It MUST remain separate from this UI
localization layer until explicitly authorized.
