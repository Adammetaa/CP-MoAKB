# Correction Template

Status: Active
Version: 1.0

## Purpose
Document a bounded error correction that does not silently change identity or governed meaning.
## Scope
Editorial or factual correction with affected version, impact, review, notice, and rollback.
## Out of Scope
Use Revision when meaning/scope changes; Correction MUST NOT hide dispute, deprecate, supersede, or retire by implication.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-007, Editorial lifecycle guide, Review Framework, and KGS-003/006.
## When to Use
When a documented error can be corrected while authorized identity/meaning continuity is preserved.
## Who Completes It
Reporter/Author proposes; Managing Editor scopes; affected reviewers and decision authority approve.
## Required Inputs
Affected identity/version, error evidence, proposed correction, impact, reviews, authority, and history.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Affected identity/version | Fix target | Required | Exact reference | Mutable latest | Identify published state if any | Governance | `fictional-concept-1/v2` | “current” |
| Reason | Explain correction | Required | Specific error | Convenience rewrite | State defect | Reviewer | “inverted fictional label” | “improve” |
| Triggering evidence | Support action | Required | Finding/source reference | Unsupported assertion | Link evidence | Evidence | `fictional-finding-7` | “noticed issue” |
| Scope | Bound change | Required | Exact passages/claims | Broad cleanup | List affected content | Scientific | “one label” | “whole record” |
| Impact | Assess meaning | Required | No meaning change or explicit impact | Silent material change | Explain identity/meaning continuity | Governance | “display correction only” | Blank |
| Required reviews | Route competence | Required | Affected review types | Self-approval | Use impact | Governance | “Terminology + Governance” | “editor only” |
| Affected relationships | Preserve edges | Required | References/none affected | Hidden effects | Inspect separately | Ontology | “none affected” | Omitted |
| Affected terminology | Preserve terms | Required | Term references/none | Inline silent rename | Link term decision | Terminology | `fictional-term-1` | “fix names” |
| Replacement/successor | Distinguish action | Required | N/A with reason or reference | Implicit supersession | Correction normally N/A | Governance | “N/A—identity retained” | New identity hidden |
| Effective date | Place history | Required | Authorized effective date | File timestamp alone | Record decision date/point | Governance | “correction day C1” | “now” |
| Rollback information | Preserve recovery | Required | Prior version and reversal limits | History deletion | Link prior state | Release Editor | “restore v2 display” | “undo” |
| Decision authority | Prove approval | Required | KGS-authorized role/body | Author alone | Cite authority | Governance | “Managing Editor within scope” | “team” |
| Audit trail | Preserve process | Required | Proposal/findings/decision/notices | Rewritten summary | Link all records | Governance | `fictional-correction-log-1` | Delete prior text |

## Completion Rules
A correction MUST state why it is not a material Revision. Material uncertainty triggers affected re-review.
## Prohibited Content
Silent meaning change, identity reuse, erased evidence, machine migration instructions, or publication claim.
## Review Requirements
Review every affected scientific, evidence, terminology, ontology, rights, governance, and publication scope.
## Failure Modes
Calling a meaning change editorial, missing prior version, or no notice for published state.
## Example
A fictional inverted display label MAY be corrected with Terminology and Governance approval.
## Non-example
Expanding scope under “typo fix” MUST NOT pass.
## Audit and Retention
Retain before/after versions, evidence, impact, reviews, decision, notices, and rollback record.
## Change Control
Template changes require lifecycle and Review Framework analysis.
