# Observation Vocabulary Concept Model

Status: Active

Version: 1.0

## Purpose

This document distinguishes the conceptual responsibilities involved in
observation terminology. It is not a data model or implementation schema.

## Conceptual Distinctions

| Responsibility | Meaning | Boundary |
| --- | --- | --- |
| Ontology concept | Governed meaning in a conceptual ontology | Identity and relations are not created by a label |
| Vocabulary term | Governed linguistic expression associated with a concept | Does not redefine the concept |
| Terminology entry | Reviewable editorial account of an expression and its use | Is not an observation event |
| Preferred label | Preferred expression for one language and governed scope | Preference is contextual, not universal truth |
| Alternative label | Accepted non-preferred expression | Must not be treated as exact equivalence without review |
| Synonym | Expression reviewed as sharing meaning within a declared scope | Similarity alone is insufficient |
| Prohibited label | Expression disallowed for a stated ambiguity or inference risk | Prohibition does not erase historical traceability |
| Local expression | Community, farmer, regional, or local-language expression | Is neither automatically a diagnosis nor automatically equivalent |
| Observation instance | Particular report, perception, measurement, or record | Uses terminology but is not a term definition |
| Dataset record | Representation in a particular dataset | Is outside this architecture and has no authority over meaning |

## Relationship Rules

1. Concept identity MUST remain independent of labels.
2. A term MUST be associated with an already governed conceptual meaning or be
   treated as a candidate pending the applicable ontology and identity review.
3. Label preference MUST be declared per language, locale, audience, and scope.
4. Alternative labels, synonyms, translations, transliterations, and mappings
   MUST remain distinguishable.
5. A local expression MUST preserve attribution and usage context.
6. An observation instance MAY use a governed term but MUST preserve the
   originally reported expression when traceability requires it.
7. A dataset field or code MUST NOT become an ontology concept or preferred
   label merely through repeated use.

## Identity Authority

This architecture does not allocate identifiers. Concept and asset identity
remain governed by existing identity authorities and the
[Knowledge Object Model](../object-model/README.md). Terminology review MUST NOT
merge identities based solely on spelling, translation, or apparent similarity.

## Ontology Authority

Broader, narrower, and related relationships are conceptual proposals until
approved by the applicable ontology authority. A vocabulary editor MUST NOT use
term hierarchy to silently alter ontology meaning.

## Implementation Boundary

The distinctions above are responsibilities, not fields, classes, keys, types,
cardinalities, controlled values, or validation behavior. Any physical model
requires separate authorization under the protected architecture.
