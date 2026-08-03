# Publication Readiness Template

Status: Active
Version: 1.0

## Purpose
Document whether one accepted version is eligible for a separate publication authorization decision.
## Scope
Acceptance, reviews, findings, rights, traceability, release identity, authorization path, rollback, and audit.
## Out of Scope
This template MUST NOT publish, tag, release, deploy, upload, or authorize itself.
## Authority
Governed by [Template Governance](../template-governance.md), KGS-005/006, Review Framework publication review, and Publication Boundary.
## When to Use
Only after a fixed version has a valid acceptance record.
## Who Completes It
Release Editor assembles; Governance and Rights Reviewers verify; Project Owner authorization remains separate.
## Required Inputs
Accepted identity/version, review completions, finding log, rights decision, traceability, boundary classification, and rollback plan.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Affected identity/version | Fix release candidate | Required | Exact accepted reference | Moving “latest” | Freeze before review | Governance | `fictional-concept-1/v2` | “main version” |
| Reason | State proposed release purpose | Required | Scoped knowledge-release rationale | Marketing claim | State audience/scope | Governance | “fictional review demonstration” | “production ready” |
| Triggering evidence | Prove acceptance/readiness basis | Required | Acceptance/review references | Test pass alone | Link records | Governance | `fictional-acceptance-1` | “CI green” |
| Scope | Bound proposed publication | Required | Exact content/audience/jurisdiction | Whole repository by implication | Inventory components | Release Editor | “fictional package K1” | “everything” |
| Impact | Assess release consequences | Required | Consumers/rights/withdrawal effects | Unexamined public claim | State known impact | Governance | “documentation-only preview” | Blank |
| Required reviews | Prove gates | Required | Publication, governance, rights + affected reviews | Acceptance only | Link completions | Governance | “all seven complete” | “approved” |
| Affected relationships | Confirm status | Required | Reviewed refs/none | Hidden edges | Verify exact versions | Ontology | `fictional-rel-1 accepted` | Omitted |
| Affected terminology | Confirm status | Required | Reviewed refs/scopes | UI copy | Verify exact versions | Terminology | `fictional-term-1 scope F` | “translated labels” |
| Replacement/successor | Identify release relation | Conditional | Prior knowledge-release reference | Git tag as knowledge successor | N/A for first release | Governance | “none—first fictional release” | “v1 tag” |
| Effective date | Record proposed/authorized point | Conditional | Owner-authorized date when granted | Assumed date | Leave Unknown until authority | Project Owner | “Unknown—authorization pending” | “today” |
| Rollback information | Prepare recovery | Required | Withdrawal/retraction/history plan | Rewrite public history | Preserve identity/evidence | Release Editor | “withdraw package, retain notice” | Delete tag |
| Decision authority | Identify separate authority | Required | KGS-005/owner path | Template completer | Cite authority | Governance | “Project Owner authorization required” | “Release Editor alone” |
| Audit trail | Preserve readiness | Required | Inputs/findings/decision/authorization | Published claim before event | Link records | Governance | `fictional-readiness-log-1` | “ready” |

## Completion Rules
Ready means eligible for separate authorization. Unknown rights, open blocker,
moving version, absent rollback, or missing authority prevents readiness.
## Prohibited Content
Publication claim, assumed authorization, Git/package event conflation, score, production claim, or automated release instruction.
## Review Requirements
Publication Readiness, Governance, and Rights Reviews are mandatory; owner authorization remains a separate event.
## Failure Modes
Accepted-equals-published, test pass as authority, unknown rights, no rollback, or unversioned package.
## Example
A fictional accepted package MAY be “ready for authorization” while `not_published` remains true.
## Non-example
Completing this template and creating a tag MUST NOT occur automatically.
## Audit and Retention
Retain exact version, package inventory, findings, rights, decision, authorization, publication event, and rollback evidence.
## Change Control
Template changes require KGS-005/006, Review Framework, RAS-015, and Publication Boundary analysis.
