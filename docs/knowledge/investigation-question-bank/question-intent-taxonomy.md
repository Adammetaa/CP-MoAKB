# Question Intent Taxonomy

Status: Active

Version: 1.0

## Purpose

Question Intent identifies the neutral investigative purpose served by a
Question Pattern. Intents aid governance and discovery; they do not select a
pattern, determine an answer, or establish a branching order.

## Required Intents

| Intent | Neutral purpose | Boundary |
|---|---|---|
| clarification | resolve ambiguity in an existing account | does not correct or reject automatically |
| localization | establish where a feature or event was situated | does not imply causal location |
| structural location | relate a feature to a described structure | does not confirm identity or mechanism |
| morphology | request observable form or shape | does not name a condition from shape |
| color or visible state | request bounded visible appearance | does not infer cause or severity |
| count | request a bounded enumeration | does not imply prevalence or threshold meaning |
| measurement | request a value, method, and unit | does not imply precision beyond the method |
| temporal history | request attributable timing or sequence | does not infer progression or cause |
| spatial distribution | request arrangement within a bounded area | does not generalize beyond that area |
| progression | request reported or observed change over time | does not assume worsening or diagnosis |
| specimen capture | establish whether relevant material was captured | does not create Evidence |
| management history | request attributable management events | does not imply responsibility or efficacy |
| environmental context | request bounded environmental conditions | does not assert causality |
| comparison | request explicit similarities or differences | does not rank hypotheses |
| contradiction resolution | clarify incompatible accounts | does not choose a winner automatically |
| verification | request review of a specific assertion or record | does not presuppose confirmation |
| provenance clarification | request origin, custody, method, or transformation context | does not authenticate automatically |

## Multi-intent Patterns

A pattern may have more than one intent only when each is explicit and the
combination remains neutral. Multiple labels do not create a sequence or make a
pattern more important. If combined intents obscure purpose, authors should
separate the pattern for independent review.

## Scope Interaction

Intent and Question Scope are distinct. Localization may be structure-level,
site-level, or field-level; verification may concern provenance or review. Scope
must be authored separately and must not be inferred from an intent name.

## Extension and Review

New intents require evidence that existing meanings are insufficient, boundary
review for overlap, terminology review in each supported language, and
non-inference review. Crop names, diagnoses, treatments, and response formats
are not intents. Translation must preserve distinctions rather than merging
conveniently similar labels.
