# Candidate Review Package Template

Status: Active
Version: 1.0

## Purpose
Assemble one fixed candidate version and all materials required for competent review.
## Scope
Candidate template, evidence package, terms, relationships, issues, assignments, findings, decisions, and final gate.
## Out of Scope
The package MUST NOT auto-run review, aggregate scores, accept knowledge, or define a machine bundle.
## Authority
Governed by [Template Governance](../template-governance.md), Editorial Handbook, Review Framework, KAS, and KGS.
## When to Use
Before specialist review and again when submitting a revised fixed candidate version.
## Who Completes It
Knowledge Author assembles; Managing Editor checks completeness; reviewers complete their own records.
## Required Inputs
Candidate identity/version, appropriate authoring template, source/evidence package, review matrix, and role assignments.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Package identity/version | Fix bundle | Required | Governed handle/version | Archive filename | Assign separately | Governance | `fictional-review-package-1/v2` | “final.zip” |
| Candidate identity/version | Fix subject | Required | Exact governed reference | “latest” | Match every constituent | Governance | `fictional-concept-1/v2` | “current candidate” |
| Candidate template | Provide authored meaning | Required | Exact concept/term/relationship template | Mixed candidates in prose | One primary candidate | Governance | `fictional-concept-template-1/v2` | “candidate notes” |
| Source/evidence package | Provide traceability | Required | Package reference/version | Attachments only | Verify scope match | Evidence | `fictional-se-package-1/v1` | “sources folder” |
| Related term candidates | Route terminology | Conditional | Exact term-template refs | Inline unreviewed labels | List all affected | Terminology | `fictional-term-1/v1` | “Thai name” |
| Related relationship candidates | Route ontology | Conditional | Exact relationship-template refs | Inline edges | List all affected | Ontology | `fictional-rel-1/v1` | “causes Beta” |
| Unresolved issues | Preserve gaps | Required | Issue refs/none identified | Blank | State blocker effects | Governance | `fictional-issue-3` | “later” |
| Review matrix | Define required reviews | Required | Human matrix application | Workflow code | Identify N/A reasons | Governance | `fictional-matrix-1` | “auto-review” |
| Competence/COI records | Prove reviewers | Required | Assignment, competence, declarations | Titles alone | Match each review | Governance | `fictional-assignments-1` | “experts” |
| Finding log | Preserve review history | Conditional | Finding refs/statuses | Summary score | Required once review begins | Governance | `fictional-findings-1` | “85% quality” |
| Decision/completion records | Prove outcomes | Conditional | Exact review records | Team consensus note | Reconcile all reviews | Governance | `fictional-completion-1..5` | “approved” |
| Final acceptance gate | Request acceptance | Conditional | Completed human gate | Merge status | Only after mandatory reviews | Governance | `fictional-gate-1` | “PR merged” |
| Package completeness | State readiness | Required | Incomplete/ready/returned/etc. | Accepted by assembly | Managing Editor attests | Governance | “ready for Scientific Review” | “canonical” |

## Completion Rules
All constituents MUST reference the same fixed candidate version or state a reviewed dependency.
Any missing mandatory review input makes the package incomplete.
## Prohibited Content
Aggregate score, automated routing, mixed versions, hidden findings, diagnosis, recommendation, machine bundle rules, or publication claim.
## Review Requirements
Apply the Review Matrix; each competence issues its own decision and completion record.
## Failure Modes
Version drift, missing evidence, no COI declaration, inline relationship, or acceptance inferred from completeness.
## Example
A fictional v2 package MAY be complete for review with one explicit unresolved non-blocking issue.
## Non-example
A folder named “approved” MUST NOT establish review completion.
## Audit and Retention
Retain every package/constituent version, assignment, finding, response, decision, gate, and supersession.
## Change Control
Field changes require Handbook, Review Framework, KAS, and KGS analysis.
