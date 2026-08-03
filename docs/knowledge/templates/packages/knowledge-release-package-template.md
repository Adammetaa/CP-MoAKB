# Knowledge Release Package Template

Status: Active
Version: 1.0

## Purpose
Assemble evidence for a separately governed knowledge-release authorization decision.
## Scope
Accepted versions, readiness reviews, rights, inventory, release identity, authorization, rollback, notices, and audit.
## Out of Scope
This package MUST NOT authorize or perform publication, Git tagging, GitHub Release, package upload, deployment, or data release.
## Authority
Governed by [Template Governance](../template-governance.md), KGS-005/006, Review Framework, RAS-015, and Publication Boundary.
## When to Use
Only after exact knowledge versions are accepted and publication-readiness review is authorized.
## Who Completes It
Release Editor assembles; Rights and Governance Reviewers verify; Project Owner authorization remains separate.
## Required Inputs
Release identity/version, accepted candidate packages, readiness records, rights, inventory, boundary classification, and rollback plan.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Release package identity/version | Fix package | Required | Governed human release handle | Git tag alone | Assign before review | Governance | `fictional-knowledge-release-1/v1` | `v1.0` |
| Release purpose/scope | Bound publication proposal | Required | Audience/content/jurisdiction | Production claim | State limitations | Governance | “fictional documentation review” | “public platform” |
| Accepted knowledge inventory | Identify constituents | Required | Exact accepted identity/version refs | Moving branch | Enumerate all items | Governance | `fictional-concept-1/v2` | “latest records” |
| Acceptance records | Prove status | Required | Final gate/decision references | Merge/test result | Link per item | Governance | `fictional-acceptance-1` | “CI passed” |
| Publication-readiness records | Prove review | Required | Exact readiness completion refs | Template completion alone | Reconcile all items | Release Editor | `fictional-readiness-1` | “ready” |
| Rights inventory | Bound public use | Required | Source/media rights decisions | Access assumptions | Cover every component | Rights | `fictional-rights-release-1` | “online sources” |
| Terminology/relationship status | Preserve semantics | Required | Exact decision refs/scopes | UI labels/inferred edges | Verify versions | Terminology/Ontology | `fictional-term-1; rel-1` | “translated graph” |
| Unresolved issues/conflicts | Preserve limitations | Required | References/none, with gate effect | Hidden dissent | State public treatment | Governance | `fictional-issue-5 non-blocking` | Blank |
| Publication Boundary classification | Distinguish events | Required | Repository/tag/release/package/knowledge scopes | Conflated “release” | Name each proposed event | Governance | “knowledge release only proposed” | “ship everything” |
| Authorization record | Prove authority | Conditional | Explicit owner/KGS decision once issued | Assumed approval | Remain pending until event | Project Owner | “pending” | “approved by completion” |
| Effective publication event | Record external fact | Conditional | Verified event reference after occurrence | Future claim as fact | Remain `not_published` now | Governance | `not_published` | “released soon” |
| Rollback/withdrawal plan | Prepare recovery | Required | Notice/withdraw/retract/history plan | Delete public history | Preserve identity/evidence | Release Editor | “withdraw with retained notice” | “remove tag” |
| Audit package | Preserve decisions | Required | Inventory/findings/rights/authorizations/events | Unversioned summary | Link exact records | Governance | `fictional-release-audit-1` | “release notes” |

## Completion Rules
Every constituent MUST be accepted and readiness-reviewed at the exact version.
Until separate authorization and a verified event occur, status remains `not_published`.
## Prohibited Content
Self-authorization, automatic publication instructions, credentials, production claims, tag/package/knowledge conflation, schema, or real content.
## Review Requirements
Publication Readiness, Rights, Governance, KGS-005 authority, and Project Owner authorization apply separately.
## Failure Modes
Moving inventory, missing rights, open blocker, absent rollback, or package completeness presented as release.
## Example
A fictional complete release package MAY await owner authorization while remaining `not_published`.
## Non-example
Completing this document and pushing a tag MUST NOT occur.
## Audit and Retention
Retain package versions, inventories, rights, findings, decisions, authorization, verified events, notices, and rollback evidence.
## Change Control
Field changes require KGS-005/006, Review Framework, RAS-015, and Publication Boundary analysis.
