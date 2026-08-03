# Source and Evidence Package Template

Status: Active
Version: 1.0

## Purpose
Assemble a complete, traceable human package for source and evidence review.
## Scope
Source nominations, evidence items, rights findings, traceability, conflicts, issues, and completeness.
## Out of Scope
The package MUST NOT accept claims, redistribute sources, or become a dataset/schema.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-003/004, Editorial source/evidence workflows, and Review Framework.
## When to Use
Before Evidence, Scientific, Rights, or Governance Review of evidence-backed candidates.
## Who Completes It
Knowledge Author assembles; Evidence Reviewer verifies; Rights Reviewer verifies intended uses; Managing Editor checks completeness.
## Required Inputs
Package identity/version, source nominations, evidence items, intended claims, rights decisions, and unresolved issues.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Package identity/version | Fix package | Required | Governed handle/version | Folder name alone | Assign before review | Governance | `fictional-se-package-1/v1` | “sources-final” |
| Intended review scope | Bound use | Required | Claims/candidates/reviews | “all knowledge” | Enumerate scope | Scientific | “fictional definition claim A” | “general use” |
| Source nominations | Constituent identity | Required | Source-template references | Attached files alone | List exact versions | Evidence | `fictional-source-nom-1/v1` | “three PDFs” |
| Evidence items | Constituent evidence | Required | Evidence-template references | Unmapped notes | Map each claim | Evidence | `fictional-evidence-1..3` | “extracts” |
| Source-to-evidence map | Prove provenance | Required | Human mapping references | Implied folder structure | Cover every item | Evidence | “S1 → E1,E2” | “same filename” |
| Evidence-to-claim map | Prove support/adversity | Required | Scoped support/contradiction map | Truth weights | Include all claims | Evidence | “E1 supports C1; E2 contradicts” | “80% support” |
| Rights review | Bound use | Required | Rights decision references | Access assumption | State each use/media | Rights | `fictional-rights-1` | “public link” |
| Conflicting evidence | Preserve disagreement | Required | Evidence/issue references or none | Harmonized summary only | Keep sources separate | Scientific | `fictional-issue-conflict-1` | Delete E2 |
| Unresolved issues | Preserve gaps | Required | Issue references/none | Blank | State blockers | Governance | `fictional-issue-rights-1` | “later” |
| Completeness checklist | Prove package readiness | Required | Evidence-package checklist | Self-declared complete | Managing Editor verifies | Governance | `fictional-checklist-SE1` | “complete” |
| Review assignments | Route competence | Required | Evidence/Rights/etc. assignments | One universal reviewer | Cite competence | Governance | “Evidence E; Rights R” | “review team” |
| Package disposition | Track state | Required | Incomplete/ready for review/returned/etc. | Accepted knowledge | Cite decision | Governance | “ready for Evidence Review” | “validated” |

## Completion Rules
Every evidence item MUST link to one reviewed source version and every scoped claim use.
Unknown rights blocks affected redistribution but does not erase source metadata.
## Prohibited Content
Original works without verified rights, truth scores, unsupported claims, schema syntax, or publication authority.
## Review Requirements
Evidence and Rights Reviews plus scope-appropriate Scientific and Governance Reviews.
## Failure Modes
Missing source identity, orphan evidence, unmapped claim, unknown rights hidden, or package version drift.
## Example
A fictional package MAY be complete for evidence review while original-document redistribution remains blocked.
## Non-example
A directory of uploaded files with a summary MUST NOT pass.
## Audit and Retention
Retain package versions, constituent versions, mappings, rights, findings, decisions, and withdrawal/supersession history.
## Change Control
Field changes require evidence, citation, rights, package, and Review Framework analysis.
