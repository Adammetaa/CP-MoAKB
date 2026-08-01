# Guide: Multilingual Authoring

Status: Active
Version: 1.0

## Purpose
Support Thai-first editorial use while preserving precise multilingual authority.
## Scope
Thai, English, scientific names, official titles, transliteration, and translation notes.
## Out of Scope
UI localization MUST NOT accept terminology or establish equivalence.
## Authority
Subordinate to the [handbook](../knowledge-editorial-handbook.md), [KAS-005](../../KAS-005-terminology-standard.md), and the [localization policy](../../../../prototype/knowledge-explorer/docs/localization-policy.md).
## Definitions
**Translation** conveys meaning; **transliteration** represents script; an **official title** remains attributed to its issuing source.
## Responsibilities
Author records language; Terminology Reviewer decides term status; Scientific Reviewer governs scientific names.
## Procedure
Draft Thai-first where suitable; retain English where needed for scientific
precision; preserve official titles; identify language and locale; separate
translation from transliteration; record uncertainty and translator notes; link
only accepted terms to their terminology authority.
## Required Inputs
Candidate identity, source language, term evidence, official wording, and context.
## Required Outputs
Language-specific wording, status, translation/transliteration notes, and reviewer decision.
## Review Points
Meaning, authority, script, locale, scientific name, ambiguity, and UI separation.
## Failure Modes
Automatic equivalence, translated official title presented as original, or UI copy promoted to terminology.
## Examples
A Thai prototype label MAY coexist with an English explanation while both remain editorial UI text.
## Non-examples
Machine translation alone MUST NOT establish a preferred term.
## Escalation
Language ambiguity goes to Terminology Review; scientific names to Scientific Review.
## Audit Requirements
Retain original wording, language, notes, sources, reviewers, and term status.
## Change Control
Meaning-changing translations require re-review.
## Future Considerations
Additional languages MAY be governed separately.
