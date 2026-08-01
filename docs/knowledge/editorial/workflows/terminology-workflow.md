# Terminology Workflow

Status: Active
Version: 1.0

## Purpose
Govern term nomination and disposition while keeping labels separate from identity.

## Scope
Thai and English preferred terms, scientific name, common and local names,
synonym, spelling variant, abbreviation, acronym, transliteration, deprecated,
historical, ambiguous, and trade terms.

## Out of Scope
UI translation, spelling equality, or automation MUST NOT accept terminology.
UI localization does not create accepted terminology.

## Authority
This workflow applies the [handbook](../knowledge-editorial-handbook.md),
[KAS-005](../../KAS-005-terminology-standard.md), ADR-006, and ADR-007.

## Definitions
**Preferred term** is accepted for a language and scope; **transliteration** maps
script, not meaning; **trade name** is contextual and not a scientific identity.

## Responsibilities
Author nominates; Terminology Reviewer assesses language and usage; Scientific
Reviewer handles scientific names; Domain Editor preserves local context.

## Procedure
1. Link the term nomination to an existing candidate identity.
2. Declare language, term type, context, jurisdiction, source, and uncertainty.
3. Review Thai preferred and English preferred terms independently.
4. Review scientific names separately from common, local, and trade names.
5. Distinguish translation from transliteration and record translation notes.
6. Decide approve, revise, reject, defer, deprecate, or supersede through review.
7. Preserve ambiguous, historical, and deprecated terms with status and scope.

## Required Inputs
Candidate identity, proposed term, language, term type, usage evidence, context, and conflicts.

## Required Outputs
Term decision, scope, status, evidence, reviewer role, uncertainty, and history.

## Review Points
Identity separation, language, equivalence, scientific governance, local farmer
context, ambiguity, trade-name context, and UI/editorial separation.

## Failure Modes
Identical spelling treated as identity, automatic translation equivalence, local
usage made universal, uncertain Thai hidden, or UI text treated as accepted term.

## Examples
A Thai-first UI label MAY remain a UI translation while its terminology candidate
is explicitly not reviewed.

## Non-examples
Matching English spellings MUST NOT merge two concepts.

## Escalation
Language disputes go to Terminology Review; scientific-name disputes to competent
Scientific Review; identity conflicts to governance.

## Audit Requirements
Retain nominations, language and scope, sources, decisions, dissent, status changes,
and successor links.

## Change Control
Changes MUST preserve KAS-005 and ADR-006/007 sequencing.

## Future Considerations
Future vocabulary construction requires separate authorization.
