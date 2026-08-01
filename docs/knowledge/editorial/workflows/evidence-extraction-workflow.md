# Evidence Extraction Workflow

Status: Active
Version: 1.0

## Purpose
Create bounded evidence items with two-way traceability and minimal copying.

## Scope
Human extraction of support, contradiction, context, limitations, and locators.

## Out of Scope
This workflow MUST NOT define machine extraction, truth scores, diagnosis, or inference.

## Authority
It applies the [handbook](../knowledge-editorial-handbook.md),
[KAS-003](../../KAS-003-evidence-standard.md), [KAS-004](../../KAS-004-citation-standard.md),
and [Evidence Levels](../../../EVIDENCE_LEVELS.md).

## Definitions
An **evidence item** is a bounded representation of what a source supports or
contradicts; a **locator** identifies the source passage without replacing it.

## Responsibilities
The Author extracts; Evidence Reviewer verifies source fidelity; Scientific
Reviewer evaluates domain meaning; rights review controls quotations and media.

## Procedure
1. Assign evidence identity and source identity.
2. Record passage locator, source context, supported or contradicted claim,
   population or scope, method, limitations, date and jurisdiction relevance.
3. Record translation notes, granularity, uncertainty, missing context, and access.
4. Prefer faithful paraphrase. Keep quotations within necessary and lawful limits.
5. Review figures and tables separately for meaning and rights; link rather than
   reproduce unless permission is verified.
6. Mark inaccessible or withdrawn evidence; preserve its history and effect.
7. Link source to evidence and evidence to every claim using it.
8. Preserve conflicting evidence without silent correction or harmonization.

## Required Inputs
An intake-reviewed source candidate, rights disposition, intended claim, and locator.

## Required Outputs
Evidence item, bidirectional traceability, limitations, translation notes, rights
handling, lifecycle state, and reviewer disposition.

## Review Points
Fidelity, scope, method, locator, date, jurisdiction, quotation, translation,
contradiction, withdrawal, and claim fit MUST be checked.

## Failure Modes
Excessive copying, context stripping, unsupported extrapolation, omitted adverse
evidence, invented precision, inaccessible-source certainty, or automatic scoring.

## Examples
A short fictional paraphrase with an exact section locator and a stated limitation
is acceptable for review.

## Non-examples
A copied chapter or a conclusion stronger than its passage MUST NOT pass.

## Escalation
Uncertain interpretation goes to Scientific Review; source conflict to KGS-004;
rights questions to rights review; missing context returns to the Author.

## Audit Requirements
Retain source version, locator, extraction author role, revisions, review decision,
rights finding, and all support/contradiction links.

## Change Control
Changes MUST preserve KAS evidence and citation semantics.

## Future Considerations
Automation MAY be proposed separately but MUST NOT replace competent human review.
