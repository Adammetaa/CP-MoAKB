# Knowledge Editorial Handbook

Status: Active
Version: 1.0

## Purpose

This handbook MUST provide repeatable human procedures from source nomination to
release authorization without creating agricultural content or software behavior.

## Scope

It governs editorial intake, extraction, candidate preparation, specialist
review, revision, audit evidence, and publication-readiness assessment.

## Out of Scope

It MUST NOT define schema, Runtime, parser, registry, validation, API, diagnosis,
recommendation, inference, rankings, confidence scores, or publication authority.

## Authority

The handbook is subordinate to the [Knowledge Constitution](../constitution/knowledge-constitution.md),
[KAS-001 through KAS-007](../README.md), and [KGS-001 through KGS-006](../governance/README.md).
It MUST preserve [ADR-005 through ADR-009](../../ARCHITECTURE_DECISIONS/README.md),
[RAS-001 through RAS-015](../../runtime/specifications/README.md), the
[Source Policy](../../SOURCE_POLICY.md), [Evidence Levels](../../EVIDENCE_LEVELS.md),
[Design Freeze](../../maintainers/design-freeze.md), and
[Publication Boundary](../../release/publication-boundary.md). ADR-009 remains
the format authority only for its Rice pilot; this handbook defines no format.

## Definitions

- **Candidate**: material proposed for review, not accepted knowledge.
- **Acceptance**: a governed knowledge decision, not publication.
- **Publication readiness**: documented eligibility for a separate authorization.
- **Handoff**: an explicit transfer of records and responsibility between roles.

## Responsibilities

Knowledge Authors prepare traceable candidates. Evidence, Terminology,
Scientific, and Ontology Reviewers decide only within competence. Domain and
Managing Editors coordinate revision. Governance Reviewers preserve authority
and conflicts. Release Editors assess the approved release package; the Project
Owner retains explicit authorization as governed by KGS-005.

## Editorial Principles

Editors MUST work evidence before knowledge, official-source-first within claim
scope, identity before labels, and review before publication. They MUST preserve
epistemic layers, scientific neutrality, disagreement, uncertainty, provenance,
and negative findings. They MUST NOT silently infer, harmonize, diagnose, or
recommend.

UI translation MUST NOT create accepted terminology.
Field observation MUST remain an evidence candidate rather than accepted knowledge.
Evidence attachment MUST NOT become diagnosis.
Accepted knowledge MUST NOT become advice.

## Procedure

The lifecycle is:

1. **Nomination** by an identified role.
2. **Intake** with source identity and status.
3. **Source verification** against the source and authority scope.
4. **Rights review** for access, quotation, and redistribution.
5. **Evidence extraction** with locators, context, and limitations.
6. **Claim scoping** with meaning, exclusions, jurisdiction, and time.
7. **Terminology review** with identity kept separate from labels.
8. **Relationship nomination** as an independently evidenced assertion.
9. **Scientific review** within documented competence.
10. **Ontology review** for layer and relationship semantics.
11. **Governance review** for authority, conflict, and process compliance.
12. **Acceptance** through the applicable KGS decision.
13. **Publication readiness** through the separate checklist and release scope.
14. **Release authorization** only through KGS-005 and the Publication Boundary.

No step is automatic, and completion of one step MUST NOT imply the next.

## Required Inputs

Inputs MUST include identifiable source candidates, rights status, bounded
evidence items, scoped claims, candidate identities, reviewer assignments,
conflict disclosures, and the applicable authority versions.

## Required Outputs

Outputs MUST include traceable candidate records, review decisions, revision
history, unresolved issues, rights disposition, lifecycle state, and audit links.
These are editorial records, not a prescribed implementation schema.

## Role Handoffs

Each handoff MUST name sender role, recipient role, item identity, lifecycle
state, required action, open issues, and decision record. A recipient MUST return
an incomplete package rather than invent missing evidence. Recusal or competence
limits MUST trigger reassignment under KGS-002 and KGS-003.

## Review Points

Mandatory gates are source identity, rights, evidence, terminology, scientific,
ontology, governance, acceptance, and publication readiness. High-risk causal,
management, safety, and regulatory relationships require explicit competent
review. Publication requires a separate authorization record.

## Failure Modes

Failures include label-based identity, missing locator, unsupported extrapolation,
collapsed unknown states, undisclosed conflict, excessive copying, inferred
rights, out-of-competence approval, silent disagreement removal, and treating
acceptance as publication.

## Examples

The [fictional good example](examples/fictional-good-example.md) demonstrates a
traceable candidate while intentionally asserting no real-world fact.

## Non-examples

The [fictional bad example](examples/fictional-bad-example.md) shows prohibited
certainty, missing identity, diagnosis, recommendation, and absent review.

## Escalation

Scientific disputes MUST follow KGS-004. Authority conflicts MUST go to the
Governance Committee or Knowledge Board as scoped. Publication disputes MUST
follow KGS-005. A conflict with higher authority MUST stop the affected work.

## Audit Requirements

Review, decision, evidence, publication, and revision logs MUST satisfy KGS-006.
Records MUST preserve rejected and superseded reasoning without personal data
beyond what governance requires.

## Change Control

Normative changes require a scoped proposal, cross-authority impact review,
approval under KGS, a new version when meaning changes, and preserved history.
Editorial corrections MAY retain version 1.0 only when meaning is unchanged.

## Future Considerations

Templates, domain pilots, and implementation mappings MAY be proposed only in
separately approved sprints. They MUST NOT be inferred from this handbook.
