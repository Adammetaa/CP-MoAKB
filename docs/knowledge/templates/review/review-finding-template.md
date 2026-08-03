# Review Finding Template

Status: Active
Version: 1.0

## Purpose
Record one classified, evidence-backed review finding through closure.
## Scope
One finding for one review type and candidate version.
## Out of Scope
This template MUST NOT aggregate scores, decide acceptance alone, or replace the finding log.
## Authority
Governed by [Template Governance](../template-governance.md), Review Framework finding classification, and KGS-003/006.
## When to Use
Whenever a reviewer identifies a distinct issue, observation, blocker, or clarification need.
## Who Completes It
Reviewer opens; Author or assigned role responds; closure authority verifies.
## Required Inputs
Fixed candidate/version, review type, reviewer competence/declaration, evidence, and applicable authority.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Finding identity | Track issue | Required | Governed finding handle | Description as identity | Assign on opening | Governance | `fictional-finding-1` | “scope issue” |
| Candidate/version | Fix target | Required | Exact identity/version | “latest” | Copy reviewed version | Governance | `fictional-concept-1/v2` | “current draft” |
| Review type | Identify competence | Required | Framework review type | Generic review | Name one primary type | Governance | “Evidence Review” | “QA” |
| Reviewer | Establish accountability | Required | Governed reviewer identity/role | Anonymous team | Link assignment | Governance | “Evidence Reviewer E” | “reviewers” |
| Finding class | Determine effect | Required | Approved non-numeric class | Score/severity number | Cite classification | Governance | “Evidence Gap” | “7/10” |
| Description | State defect | Required | Specific neutral statement | Personal judgment | Describe observable issue | Originating reviewer | “locator is missing” | “poor work” |
| Affected section | Locate issue | Required | Human-readable template/claim location | Machine path requirement | Be narrow | Originating reviewer | “Evidence: exact source location” | “somewhere” |
| Evidence | Support finding | Required | Reviewed references/observed absence | Unsupported accusation | Cite basis | Originating reviewer | `fictional-source-1 lacks locator` | “obvious” |
| Required response | Define remediation | Required | Correct, clarify, narrow, supply, remove, defer | Prescribed scientific conclusion | State verifiable outcome | Originating reviewer | “supply verifiable locator” | “make it true” |
| Blocking effect | State gate impact | Required | Block/non-block with authority reason | Percentage/rank | Name affected gate | Governance | “blocks Evidence acceptance” | “minus 20 points” |
| Closure authority | Preserve independence | Required | Competent reviewer/body | Author alone where independent | Match finding scope | Governance | “originating Evidence Reviewer” | “submitter” |
| Status | Track lifecycle | Required | Open/answered/verified/closed/etc. | “done” without verification | Use finding lifecycle | Closure authority | “answered; verification pending” | “fixed” |
| Audit history | Preserve actions | Required | Ordered role/action/evidence notes | Rewritten single summary | Append changes | Governance | “v2 response rejected” | Delete original |

## Completion Rules
One finding covers one material issue. Class, effect, response, and closure authority MUST align.
## Prohibited Content
Numeric scores, reviewer ranking, personal attacks, author-only independent closure, diagnosis, recommendation, or machine workflow syntax.
## Review Requirements
Originating reviewer verifies responses; Governance Review handles disputed class/effect; appeal follows KGS.
## Failure Modes
Wrong version, combined issues, missing evidence, class bargaining, or closure without verification.
## Example
A fictional missing locator is an Evidence Gap that blocks Evidence acceptance until verified.
## Non-example
“Quality 6/10; improve” MUST NOT be recorded.
## Audit and Retention
Retain opening, assignment, every response, rejection, verification, closure, escalation, and reopening.
## Change Control
Field changes require Review Framework and KGS-006 impact analysis.
