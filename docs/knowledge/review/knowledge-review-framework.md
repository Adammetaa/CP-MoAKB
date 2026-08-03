# Knowledge Review Framework

Status: Active
Version: 1.0

## Purpose

This framework MUST make knowledge-candidate review consistent, competent,
independent, explainable, and auditable without converting review into software.

## Scope

It governs review assignment, sequence, evidence packages, non-numeric findings,
revision, closure, escalation, appeal, acceptance gates, and completion evidence.

## Out of Scope

It MUST NOT create scientific truth, agricultural content, automated scoring,
confidence percentages, reviewer rankings, schema, forms, workflow software,
diagnosis, recommendation, inference, acceptance, or publication by itself.

## Authority

The framework is subordinate to the [Knowledge Constitution](../constitution/knowledge-constitution.md),
[KAS-001 through KAS-007](../README.md), [KGS-001 through KGS-006](../governance/README.md),
and [Editorial Handbook](../editorial/knowledge-editorial-handbook.md). It MUST
preserve [ADR-005 through ADR-009](../../ARCHITECTURE_DECISIONS/README.md),
[RAS-001 through RAS-015](../../runtime/specifications/README.md), [Source
Policy](../../SOURCE_POLICY.md), [Evidence Levels](../../EVIDENCE_LEVELS.md),
[Design Freeze](../../maintainers/design-freeze.md), and
[Publication Boundary](../../release/publication-boundary.md).

## Definitions

- **Review**: a scoped human assessment by documented competence.
- **Finding**: a traceable issue or observation, never a numeric score.
- **Blocker**: a finding that prohibits the applicable next state until closure.
- **Decision**: an authorized disposition with reasons and audit evidence.

## Required Inputs

The exact candidate identity and version, candidate type, lifecycle state,
evidence package, authority versions, assigned review types, competence records,
conflict declarations, and prior findings MUST be available.

## Procedure

1. Verify package completeness and candidate version.
2. Assign each required review to an independently suitable reviewer.
3. Obtain conflict declarations before substantive review.
4. Run Evidence and Rights Reviews early. Scientific, Terminology, and Ontology
   Reviews MAY run in parallel when their inputs are stable and dependencies are explicit.
5. Run Governance Review after specialist findings are available.
6. Classify findings without numeric aggregation and assign response authority.
7. Return revisions to the Author; independently verify material closure.
8. Escalate unresolved competence, authority, scientific, or rights disputes.
9. Apply the applicable acceptance gate to one fixed version.
10. Assess publication readiness only after acceptance and under separate authority.

Sequential review MUST be used when one review changes another review's required
input. Parallel review MUST NOT conceal dependency or produce implicit consensus.

## Decision Rules

Blocking, Rights Blocker, and Governance Blocker findings prohibit acceptance.
Major, Evidence Gap, Conflict, and Clarification Required findings require an
explicit disposition appropriate to the gate. Minor and Editorial findings MAY
remain only when the responsible reviewer records why they do not alter meaning.
No majority vote may override a competent unresolved scientific or rights blocker.

Permitted review decisions are approve, approve with required revision, return
for revision, reject, defer, escalate, and recuse. No review automatically creates truth.

## Responsibilities

Managing Editors coordinate packages and assignments. Reviewers act only within
approved competence and disclose conflicts. Authors answer findings without
self-closing independently verified items. Governance bodies decide only within
KGS authority. Release Editors and the Project Owner retain separately governed
publication responsibilities.

## Failure Modes

Failures include reviewing the wrong version, title-only competence, undisclosed
conflict, numeric scoring, majority override, erased dissent, author-only closure,
unstated dependency, review outside scope, and acceptance treated as publication.

## Escalation

Disagreements MUST follow [KGS-004](../governance/KGS-004-conflict-management.md).
Appeals MUST preserve the original decision and evidence. Rights uncertainty
remains blocking. A conflict with higher authority MUST stop the affected review.

## Audit Requirements

Audit evidence MUST include assignment, competence, independence declaration,
fixed version, inputs, questions, findings, responses, verification, decisions,
recusals, escalation, appeal, closure, and timestamps or dates supplied by accountable humans.

## Examples

The [fictional passing review](examples/fictional-passing-review.md) shows separate
specialist decisions and a non-publication acceptance gate.

## Non-examples

A dashboard that averages review findings into 87% confidence MUST NOT be used.

## Change Control

Normative changes require cross-authority impact review, KGS approval, versioned
history, and preserved prior decisions. This framework MUST NOT amend its authorities.

## Future Considerations

Templates or tooling MAY be proposed separately, but human competence,
independence, decisions, and audit accountability MUST remain authoritative.
