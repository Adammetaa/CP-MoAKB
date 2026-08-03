# Final Acceptance Template

Status: Active
Version: 1.0

## Purpose
Document the final human acceptance gate for one exact candidate version.
## Scope
Mandatory review completion, blocker closure, rights, traceability, terminology, relationships, governance, and authority.
## Out of Scope
This template MUST NOT publish, declare scientific truth, or replace publication readiness/authorization.
## Authority
Governed by [Template Governance](../template-governance.md), Review Framework final gate, KAS-007, and KGS-003/005.
## When to Use
Only after all required specialist and governance reviews are complete.
## Who Completes It
Managing Editor assembles; Governance Reviewer verifies; authorized acceptance role/body decides.
## Required Inputs
Exact candidate version, review matrix, completion records, finding log, rights, traceability, and decision authority.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Candidate/version | Fix acceptance target | Required | Exact identity/version | “latest” | Freeze before gate | Governance | `fictional-concept-1/v2` | “current” |
| Mandatory review completion | Prove reviews | Required | Completion references | Summary claim | List all required reviews | Governance | `fictional-completion-1..5` | “reviewed” |
| Blocker closure | Prove eligibility | Required | Independently closed findings | Author assertion | Reconcile log | Governance | “F1 closed by Evidence Reviewer” | “fixed” |
| Unresolved issues | Preserve limitations | Required | References + blocking effect | Hidden open issue | State each effect | Governance | `fictional-issue-4 non-blocking` | Blank |
| Rights status | Bound accepted use | Required | Verified decision/reference | Access implies rights | State use scope | Rights | “metadata use verified” | “public URL” |
| Source/evidence traceability | Prove support | Required | Package/checklist references | Bibliography only | Link exact versions | Evidence | `fictional-package-SE1` | “sources attached” |
| Terminology status | Preserve language authority | Required | Term decision references | UI labels | State scopes | Terminology | `fictional-term-1 approved for F` | “translated” |
| Relationship status | Preserve semantic review | Required | Relationship decision references | Inline inferred edges | List affected candidates | Ontology | `fictional-rel-1 non-causal` | “obvious links” |
| Governance completion | Prove authority/process | Required | Governance completion record | Test pass | Link decision | Governance | `fictional-governance-1` | “CI green” |
| Acceptance authority | Identify decider | Required | KGS-authorized role/body | Author/self-appointed team | Cite authority scope | Governance | “Fictional Knowledge Board role” | “maintainer” |
| Acceptance decision | State outcome | Required | Accept/return/reject/defer/escalate | Percentage | Give reasons | Governance | “accept v2; not published” | “87% accepted” |
| Publication separation | Prevent promotion | Required | Explicit not-authorized statement | Release implication | Link future gate if any | Release Editor | “publication separately controlled” | “ready to publish” |
| Audit attestation | Preserve record | Required | Decision/date/reasons/dissent | Automatic timestamp alone | Attest human decision | Governance | “decision day A1” | Blank |

## Completion Rules
Any unresolved blocker or missing mandatory review prevents acceptance. Acceptance applies only to the fixed version.
## Prohibited Content
Scores, majority override, implicit rights, out-of-competence decisions, or publication authorization.
## Review Requirements
Governance verification and authorized acceptance decision are mandatory; publication remains separate.
## Failure Modes
Wrong version, open blocker, missing rights, implicit N/A, or accepted-equals-published.
## Example
A fictional version MAY be accepted with explicit non-blocking limitations and remain unpublished.
## Non-example
A merged template package MUST NOT count as acceptance.
## Audit and Retention
Retain gate version, inputs, completions, findings, decision, authority, dissent, and lifecycle transition.
## Change Control
Field changes require KAS-007, KGS, Review Framework, and Publication Boundary analysis.
