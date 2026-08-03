# Relationship Candidate Template

Status: Active
Version: 1.0

## Purpose
Nominate one explicit, scoped relationship for competent evidence and semantic review.
## Scope
Identity, endpoints, predicate, direction, evidence, risk, uncertainty, jurisdiction, and lifecycle.
## Out of Scope
This template MUST NOT infer inverse, transitive, causal, regulatory, safety, diagnostic, or recommendation meaning.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-006, ADR-005/006, Editorial relationship workflow, and Review Framework.
## When to Use
Whenever a candidate assertion connects a source concept to a target concept.
## Who Completes It
Knowledge Author nominates; Evidence, Scientific, Ontology, Governance, and applicable Rights Reviewers assess.
## Required Inputs
Governed endpoint identities, predicate proposal, scope, evidence items, and required competence.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Relationship candidate identity | Track assertion | Required | Governed review handle | Triple text as identity | Allocate separately | Governance | `fictional-rel-1` | “A relates B” |
| Source concept | Identify subject | Required | Governed identity/version | Label endpoint | Cite candidate handle | Ontology | `fictional-concept-A/v1` | “Alpha” |
| Predicate | State semantics | Required | Governed predicate proposal | Vague “related” without definition | Link meaning authority | Ontology | `illustrates` | “somehow affects” |
| Target concept | Identify object | Required | Governed identity/version | Label endpoint | Cite candidate handle | Ontology | `fictional-concept-B/v2` | “Beta” |
| Direction | Preserve orientation | Required | Source-to-target statement | Assumed symmetry | State explicitly | Ontology | “A → B” in prose | “both ways” |
| Proposed inverse | Request separate review | Conditional | Predicate proposal with scope | Automatic generated fact | N/A or separate proposal | Ontology | “none proposed” | “inverse implied” |
| Scope | Bound assertion | Required | Context/time/domain limits | Universal edge | Mirror evidence | Scientific | “fictional example context” | “always” |
| Evidence references | Trace assertion | Required | Evidence-item references | Unmapped bibliography | Link support/contradiction | Evidence | `fictional-evidence-3` | “known fact” |
| Assertion status | State epistemic position | Required | Proposed/disputed/deferred/etc. | Truth score | Use lifecycle language | Governance | “candidate assertion” | “92% true” |
| High-risk flag | Trigger review | Required | Yes/no with reason, non-numeric | Risk score | Check predicate list | Governance | “Yes — causal predicate proposed” | “risk 8” |
| Causal status | Prevent inference | Required | Non-causal, causal candidate, disputed, N/A | Implied causation | State evidence and review | Scientific | “non-causal” | Blank |
| Regulatory status | Bound regulation | Required | Non-regulatory, candidate, Unknown, N/A | Permission inference | Cite jurisdiction authority | Governance | “not applicable” with reason | “allowed” by assumption |
| Jurisdiction | Bound regulated claims | Conditional | Supported jurisdiction | Global inference | Required for regulatory predicate | Governance | “Imaginary Region One” | “all countries” |
| Uncertainty | Preserve limits | Required | Narrative basis/status | Percentage confidence | Link evidence conflict | Scientific | “scope uncertain; review open” | “70% confident” |
| Contradictory evidence | Preserve disagreement | Required | Evidence references/none identified | Hidden conflict | Link separate items | Evidence | `fictional-evidence-4` | Delete adverse evidence |
| Reviewer competence required | Route review | Required | Scientific/ontology/regulatory scopes | Reviewer ranking | State exact competence | Governance | “causal science + predicate semantics” | “senior reviewer” |
| Lifecycle status | Track state | Required | Candidate/review/deferred/etc. | Accepted by completion | Cite decision | Governance | “Ontology Review pending” | “canonical” |
| Unresolved issues | Preserve gaps | Required | Issue references/none identified | Blank | Link issue template | Governance | `fictional-issue-3` | “later” |
| Inferred edges | Prevent automation | Prohibited | Explicit absence | Inverse/transitive/path conclusions | Nominate separately | Ontology | “No inference permitted” | “A→C follows” |

High-risk predicates include `causes`, `prevents`, `controls`,
`effective_against`, `managed_by`, `safe_for`, `permitted_in`, and `prohibited_in`.

## Completion Rules
One template covers exactly one relationship candidate. High-risk flags require
explicit reviewer competence and evidence; no inference is permitted.
## Prohibited Content
Numeric confidence, automatic inverse, path inference, unsupported causation, regulation, safety, diagnosis, or advice.
## Review Requirements
Evidence and Ontology Reviews are mandatory; Scientific, Governance, Rights, and regulatory competence apply by risk.
## Failure Modes
Label endpoints, vague predicate, hidden conflict, missing scope, or unreviewed high-risk assertion.
## Example
A fictional `illustrates` candidate MAY be explicitly non-causal and scoped to documentation.
## Non-example
Co-occurrence converted into `causes` with 80% confidence MUST NOT pass.
## Audit and Retention
Retain proposal versions, endpoint/predicate authorities, evidence, findings, decisions, conflicts, and supersession.
## Change Control
Field or risk-list changes require KAS-006, ADR-005, handbook, and review-framework analysis.
