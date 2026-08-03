# Evidence Item Template

Status: Active
Version: 1.0

## Purpose
Capture one bounded interpretation with source and claim traceability.
## Scope
One evidence item supporting, contradicting, or contextualizing scoped claims.
## Out of Scope
The template MUST NOT score truth, perform extraction, or copy excessive source content.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-003/004, Evidence Levels, and Editorial evidence workflow.
## When to Use
After source intake and rights review permit editorial extraction.
## Who Completes It
Knowledge Author extracts; Evidence Reviewer verifies; Scientific Reviewer assesses meaning.
## Required Inputs
Reviewed source identity/version, locator, intended claim, access and rights findings.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Evidence identity | Track item | Required | Governed review handle | Passage text as identity | Allocate explicitly | Governance | `fictional-evidence-1` | “page 2 fact” |
| Source reference | Link authority | Required | Exact source/version reference | Title-only link | Use nomination record | Evidence | `fictional-source-1/F-2` | “manual” |
| Exact source location | Enable verification | Required | Page/section/table locator | Vague chapter | Use narrow stable locator | Evidence | “section 2, paragraph 1” | “somewhere early” |
| Claim supported | Map support | Conditional | Scoped claim reference | New claim hidden here | Link each supported claim | Scientific | `fictional-claim-A` | “everything” |
| Claim contradicted | Map adverse evidence | Conditional | Scoped claim reference | Suppressed contradiction | Link when applicable | Scientific | `fictional-claim-B` | Omitted adverse link |
| Evidence role | State function | Required | Support, contradiction, context | Numeric weight | Choose one or explain multiple | Evidence | “context” | “80% support” |
| Source context | Preserve meaning | Required | Concise relevant context | Decontextualized quote | Paraphrase bounded context | Evidence | “definition section only” | “proves claim” |
| Population or scope | Bound applicability | Required | Source-stated scope or Unknown | Unsupported generalization | Mirror source precision | Scientific | “fictional set Q” | “all cases” |
| Method | Explain production | Required | Source-stated method/Unknown | Invented methodology | Paraphrase faithfully | Evidence | “fictional comparison method” | “scientific method” |
| Result summary | Capture finding | Required | Neutral bounded paraphrase | Diagnosis or advice | State only source result | Scientific | “reported a difference in F context” | “therefore treat” |
| Limitations | Preserve caution | Required | Source or reviewer limitations | Empty certainty | Include missing context | Scientific | “small fictional scope” | “none” by assumption |
| Temporal relevance | Bound time | Required | Stated period/current review finding | Eternal validity | Explain relevance | Scientific | “applies to fictional period P” | “always” |
| Jurisdiction relevance | Bound place/authority | Required | Supported jurisdiction or N/A reason | Global inference | Cite source authority | Governance | “Imaginary Region One” | “universal” |
| Translation notes | Preserve language decisions | Conditional | Translator role and uncertainty | Automatic equivalence | Complete when translated | Terminology | “term F retained” | Silent machine translation |
| Quotation status | Govern copied text | Required | None, limited/authorized, Unknown | Excessive excerpt | State extent and rights | Rights | “no quotation used” | Full page copied |
| Paraphrase status | Record fidelity review | Required | Draft, verified, revision required | Paraphrase as source quote | Name reviewer state | Evidence | “verified against locator” | “accurate” without review |
| Figure/table rights status | Govern media | Conditional | Verified, excluded, Unknown | Embedded unreviewed media | Review each item | Rights | “table referenced, not copied” | Screenshot included |
| Conflicting evidence | Preserve disagreement | Required | Evidence references or none identified | Forced harmonization | Link separate items | Scientific | `fictional-evidence-2` | Delete contradiction |
| Withdrawal status | Preserve source change | Required | Active, withdrawn, Unknown | Silent deletion | State effect | Evidence | “withdrawn; item retained historically” | Remove history |
| Reviewer notes | Capture scoped findings | Optional | Attributed review note | Anonymous authority | Reference finding where material | Reviewer | “scope clarification requested” | “looks true” |
| Lifecycle status | Track state | Required | Candidate/reviewed/deferred/etc. | Published by template completion | Cite decision | Governance | “Evidence Review pending” | “valid” |
| Truth score | Prevent aggregation | Prohibited | Explicit absence | Number/percentage/rank | Do not add | Governance | “No score permitted” | “0.92 confidence” |

## Completion Rules
Support and contradiction MAY both apply but MUST reference distinct scoped claims.
Unknown, unavailable, and N/A MUST remain distinct and reasoned.
## Prohibited Content
Numeric truth scores, excessive quotation, silent correction, extrapolation, diagnosis, recommendation, and machine types.
## Review Requirements
Evidence Review is mandatory; Scientific, Terminology, Rights, and Governance Reviews apply by content.
## Failure Modes
Missing locator, context stripping, adverse evidence omission, invented method, or rights assumption.
## Example
A fictional paraphrase linked to a precise fictional section MAY enter review.
## Non-example
A copied chapter labeled “high confidence” MUST NOT pass.
## Audit and Retention
Retain source/version, extraction, revisions, review findings, withdrawal history, and claim links.
## Change Control
Field changes require evidence, citation, rights, and review-framework impact analysis.
