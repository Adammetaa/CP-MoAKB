# Workspace Site Map

Status: Active blueprint
Version: 1.0

## Purpose
Define complete navigation without defining routes, queries, or implementation.
## Scope
Primary/secondary navigation, breadcrumbs, search, filters, saved views, and cross-workspace links.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md).
## Audience
All Lab roles and future product designers.
## Information Shown

Primary areas MUST include Dashboard, My Tasks, Inbox, Sources, Evidence, Claims,
Concept Candidates, Terminology Candidates, Relationship Candidates, Review Queue,
Findings, Acceptance Gates, Release Packages, Corrections, Deprecations,
Supersessions, Archive, Audit History, Governance Reference, and Templates and Guidance.

Secondary navigation SHOULD expose recent items, assigned items, blocked items,
awaiting review, overdue review, unresolved conflicts, and publication-ready packages.
## Actions
Navigate by identity/version, use breadcrumbs, apply human-readable filters, save
personal views, and cross-link to Explorer public versions where authorized.
## Prohibited Actions
Search MUST NOT infer synonymy, truth, relevance, diagnosis, or scientific priority.
Saved views MUST NOT become authority or shared decisions.
## Workflow
Dashboard → work area → queue/view → object detail → linked evidence/review/history → permitted handoff.
## Failure Modes
Ambiguous “Knowledge” bucket, hidden candidate state, filter presented as policy, or Explorer link to unpublished material.
## Empty States
Show active filters, permissions expectation, reason for absence where known, and links to guidance.
## Accessibility
Consistent landmarks, Thai-first labels with precise English support, keyboard breadcrumbs, and descriptive link text.
## Governance Boundaries
Navigation visibility does not grant action or approval authority.
## Audit Requirements
Navigation itself need not be audited; saved/shared governance views and action transitions require attribution.
## Examples
“Blocked items” is an operational view, not a ranking of scientific importance.
## Non-examples
“Most scientifically important” sorted by an algorithm MUST NOT exist.
## Future Implementation Considerations
No URL structure, database query, search index, or persistence model is selected.
## Change Control
Top-level area changes require product, role, accessibility, and governance review.
