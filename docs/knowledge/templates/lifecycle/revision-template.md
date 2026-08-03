# Revision Template

Status: Active
Version: 1.0

## Purpose
Document a material change requiring a new reviewed knowledge-candidate version.
## Scope
Meaning, scope, evidence, terminology, relationship, or other material revision.
## Out of Scope
Revision MUST NOT silently correct published history, deprecate, supersede identity, retire, or publish.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-007, Editorial lifecycle guide, Review Framework, and KGS-003/006.
## When to Use
When proposed changes affect meaning, scope, evidence interpretation, term status, relationships, or review conclusions.
## Who Completes It
Author proposes; Managing Editor classifies; affected specialist reviewers and authority decide.
## Required Inputs
Base identity/version, proposed new version, change evidence, impact map, findings, and required reviews.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Affected identity/version | Identify base | Required | Exact base reference | “latest” | Freeze base | Governance | `fictional-concept-1/v2` | “current” |
| Reason | Explain need | Required | Evidence/finding-based rationale | Cosmetic pretext | State material change | Scientific | “scope evidence changed” | “refresh” |
| Triggering evidence | Support revision | Required | Evidence/finding references | Invented support | Link items | Evidence | `fictional-evidence-9` | “new research” |
| Scope | Bound revision | Required | Fields/claims affected | Whole record by default | Enumerate | Governance | “definition and exclusion” | “everything” |
| Impact | Map consequences | Required | Meaning/review/lifecycle effects | Silent compatibility claim | Identify downstream candidates | Governance | “relationship R needs re-review” | Blank |
| Required reviews | Route competence | Required | All affected review types | Prior approvals reused blindly | Apply review matrix | Governance | “Scientific, Evidence, Ontology” | “editor” |
| Affected relationships | Preserve semantics | Required | References/status | Hidden edge changes | List and route | Ontology | `fictional-rel-2` | Omitted |
| Affected terminology | Preserve terms | Required | References/status | Inline renamed terms | List and route | Terminology | `fictional-term-3` | “labels updated” |
| Replacement/successor | Identify new version | Required | Proposed same-identity new version | New identity without governance | Name version relation | Governance | “v3 revises v2” | Overwrite v2 |
| Effective date | Place decision | Required | Authorized transition date | Automatic timestamp | Record after approval | Governance | “revision day R3” | “immediate” |
| Rollback information | Preserve recovery | Required | Prior version and limits | Destructive revert | State status if revision fails | Release Editor | “v2 remains historical” | Delete v3 |
| Decision authority | Prove approval | Required | Authorized role/body | Author self-approval | Cite scope | Governance | “Knowledge Board scope K” | “maintainer” |
| Audit trail | Preserve change | Required | Diff summary/findings/reviews/decision | Overwritten history | Append references | Governance | `fictional-revision-log-3` | “updated” |

## Completion Rules
Affected specialist approvals MUST be renewed for the proposed version; the base remains immutable history.
## Prohibited Content
Silent overwrite, identity replacement, automatic migration, inferred acceptance, score, diagnosis, recommendation, or publication.
## Review Requirements
Every competence affected by meaning or scope change MUST re-review.
## Failure Modes
Reusing approvals, missing downstream impact, wrong base, or correction misclassification.
## Example
A fictional scope expansion creates v3 and reopens Scientific and Ontology Reviews.
## Non-example
Editing accepted v2 in place MUST NOT pass.
## Audit and Retention
Retain base/new versions, rationale, evidence, impact, findings, approvals, rejection, and rollback.
## Change Control
Template changes require lifecycle, versioning, and Review Framework analysis.
