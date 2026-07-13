# Synonym Policy

## Purpose and terminology boundary

Synonym governance describes lexical relationships among terms and the concepts they label. It MUST NOT merge concept identities or replace the identity-mapping policy in [External Reference Policy](../identifiers/EXTERNAL_REFERENCE_POLICY.md).

Under the [Label and Synonym Policy](../identifiers/LABEL_AND_SYNONYM_POLICY.md), a governed true synonym denotes the same concept within stated scope. The phrases “broad synonym” and “narrow synonym” are therefore treated here as conventional lexical labels for terms associated with broader or narrower **different concepts**; they are not exact synonyms and MUST NOT justify identity equivalence.

## Classification and appropriate use

| Type | Meaning | Appropriate use and safeguard |
| --- | --- | --- |
| Exact synonym | Reviewed term denotes the same concept and scope as the preferred term in the declared language/context. | Use as an alternative search/display label only after identity, scope, evidence, and review agree. |
| Near synonym | Meanings overlap closely but differ in nuance, scope, register, or use. | Preserve the difference in a usage note; do not substitute automatically. |
| Broad synonym | Conventional lexical relationship to a term for a broader concept. | Represent as a broader-concept relationship/search aid, not a synonym of identical identity. |
| Narrow synonym | Conventional lexical relationship to a term for a narrower concept. | Represent as a narrower-concept relationship/search aid, not a synonym of identical identity. |
| Translation | Reviewed expression of comparable meaning in another language. | Record languages, source, reviewer, scope, and semantic limitations; not automatically exact. |
| Transliteration | Script conversion using a named scheme/version. | Preserve source form and scheme; it does not translate or prove identity. |
| Abbreviation | Shortened form of a term. | Record expansion, domain, language, case/punctuation, and ambiguity. |
| Acronym | Abbreviation formed from initial letters or parts. | Treat as potentially ambiguous across domains and languages. |
| Historical term | Previously used term with a stated period/context. | Retain for provenance/search; do not present as current preferred unless restored. |
| Obsolete term | Term no longer accepted for current use. | Mark reason, validity, and preferred replacement; retain audit history. |
| Trade name | Commercial name controlled/used by an owner in a market/jurisdiction. | Link only with verified product/owner/registration context; never infer ingredient or permission. |
| Marketing name | Promotional/commercial expression, possibly less formally tied to registration identity. | Clearly label source and purpose; never use as scientific or regulatory equivalence. |
| Local name | Community- or region-specific vernacular form. | Record region/community, language/script, source, ambiguity, and review. |
| Misspelling | Documented erroneous form. | MAY support search/quality correction; MUST NOT display as preferred or silently normalize source evidence. |

## Ambiguity policy

The Thai string `เพลี้ย` is an illustrative ambiguity example required for governance discussion; it is **not a vocabulary record or accepted mapping**. Depending on speaker, region, crop, context, and evidence, the string may be used for multiple concepts. The system MUST NOT automatically select or merge a concept from that string.

An ambiguous label requires:

- exact original text and language/script;
- context such as crop, organism features, life stage, damage/sign, region, source, and time where lawful;
- candidate concepts kept separately identified;
- evidence for, against, and missing for each candidate;
- terminology, language, and domain review;
- an unresolved state when evidence is insufficient; and
- an auditable decision if a mapping is later accepted.

Search normalization, dictionaries, fuzzy matching, or machine models MAY propose candidates, but MUST NOT establish synonymy, concept identity, diagnosis, or treatment relevance.

## Synonym proposal metadata

Every future synonym/lexical-relation proposal SHOULD include concept references, exact term forms, relationship type/direction, language/script, region/audience, source/version, evidence/rationale, reviewer, confidence or uncertainty, lifecycle status, validity, conflicts, and provenance.

If two labels reveal different referents, the outcome is separate concepts and a reviewed relationship—not a synonym merge. Regulatory, commercial, scientific, and local labels require their respective authority and scope checks.
