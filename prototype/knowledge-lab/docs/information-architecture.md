# Knowledge Lab Prototype Information Architecture

Status: Static prototype documentation
Version: 1.0

## Purpose and Scope

The architecture maps the Sprint-038K blueprint into fifteen static screens. It
describes navigation and information hierarchy, not routes, database queries,
workflow state, permissions, or production behavior.

## Screen Map

| Area | Page | Static purpose |
| --- | --- | --- |
| Dashboard | `index.html` | Operational tasks, blockers, review workload, gates, and packages |
| My Tasks | `tasks.html` | Role-filterable fictional assignments and handoffs |
| Inbox | `inbox.html` | Source, evidence, and candidate triage |
| Sources | `sources.html` | Source identity, authority, scope, rights, and evidence |
| Evidence | `evidence.html` | Evidence roles, locators, conflicts, and clickable traceability |
| Candidates | `candidates.html` | Concept, terminology, and relationship candidate list |
| Candidate Detail | `candidate-detail.html` | Versioned candidate content, findings, requirements, and comparison |
| Review Queue | `review-queue.html` | Competence- and conflict-aware review assignments |
| Review Detail | `review-detail.html` | Fixed-version review, findings, decision options, and escalation |
| Findings | `findings.html` | Finding classes, responses, closure authority, and history |
| Acceptance | `acceptance.html` | Human gate checklist with blocking states |
| Release Package | `release-package.html` | Accepted-version, rights, evidence, and authorization inventory |
| Audit | `audit.html` | Conceptually immutable lifecycle event history |
| Governance | `governance.html` | Subordinate authority and boundary reference |
| Components | `components.html` | Twenty-one reusable static interface patterns |

## Navigation

Every page includes the same Thai primary navigation in raw HTML. Context links
connect source, evidence, candidate, review, finding, gate, package, decision,
audit, and governance views. All links are relative and safe when the built site
is served below a repository subpath.

## Object Context

Screens expose identity, version or lifecycle, owner, linked evidence, findings,
decisions, unresolved issues, and a next conceptual action where applicable.
Missing links are stated as none recorded or not applicable; the interface does
not infer absent relationships.

## Responsive and Accessibility Structure

Desktop uses a working sidebar and content canvas. Tablet retains the sidebar
with compressed grids. Mobile converts navigation to a keyboard-operable menu and
reflows all grids, comparisons, tables, and audit events. Semantic landmarks,
headings, visible focus, 44-pixel targets, Thai wrapping, non-color status labels,
and reduced-motion behavior are represented.

## Boundary

Navigation visibility does not grant authority. There is no backend, persistence,
authentication, authorization, production route layer, or automatic publication.
