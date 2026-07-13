# Architecture Decision Records

## Purpose

Architecture Decision Records (ADRs) capture important, durable choices and the reasoning available when they were made. They help reviewers distinguish accepted direction from proposals, implementation details, and superseded assumptions.

An ADR documents a decision; it does not automatically authorize code, schema, source, dataset, or release changes. Design Freeze and normal approval rules still apply.

## Status values

- **Proposed:** under review and not binding.
- **Accepted:** approved as current architectural direction.
- **Superseded:** replaced by a newer ADR, which must be linked.
- **Rejected:** considered but not adopted.
- **Deprecated:** retained for history but no longer recommended; replacement may or may not exist.

Only an authorized architecture or Product Owner review may change status. Preserve status history in Git and link superseding decisions explicitly.

## File and numbering convention

- Use `ADR-NNN-short-kebab-title.md`.
- Allocate the next unused number; never renumber an existing ADR.
- Keep one primary decision per ADR.
- Use professional, technology-neutral language where a technology is not yet selected.
- Link related policies, ADRs, issues, and approved implementation work.

## Governance workflow

1. Identify a decision with material long-term consequences or meaningful alternatives.
2. Draft a **Proposed** ADR with context, scope, consequences, and alternatives.
3. Review implications for evidence, sources, regulation, privacy, security, releases, and Design Freeze.
4. Obtain the designated Product Owner and domain or architecture approvals.
5. Set the outcome to Accepted or Rejected and record the review reference.
6. Implement only through separately approved work when implementation is required.
7. Create a new ADR to supersede an accepted decision; do not rewrite history to hide the earlier choice.

## Compact template

```markdown
# ADR-NNN: Title

- Status: Proposed
- Date: YYYY-MM-DD
- Decision owners: Product Owner and relevant reviewers

## Context

What problem, constraints, evidence, and uncertainty require a decision?

## Decision

What is decided, and what is explicitly not decided?

## Consequences

What becomes easier, harder, required, or prohibited?

## Alternatives considered

Which credible alternatives were reviewed, and why were they not selected?

## Scope

Which domains, systems, users, and time horizon are covered or excluded?

## Relationship to Design Freeze

Does this ADR preserve frozen components, or what separate approval would be required?
```

## Initial records

- [ADR-001: Evidence-first and traceable](ADR-001-evidence-first-and-traceable.md)
- [ADR-002: Separate observation, evidence, regulation, and recommendation](ADR-002-separate-observation-evidence-and-recommendation.md)
- [ADR-003: Knowledge graph is conceptual, not yet implemented](ADR-003-knowledge-graph-is-conceptual-not-yet-implemented.md)
- [ADR-004: Thailand-first regulatory context](ADR-004-thailand-first-regulatory-context.md)
- [ADR-005: Layered conceptual ontology before physical implementation](ADR-005-layered-conceptual-ontology-before-physical-implementation.md) — Proposed
- [ADR-006: Stable identity governance before controlled vocabulary implementation](ADR-006-stable-identifiers-before-controlled-vocabularies.md) — Proposed
