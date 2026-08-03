# Deprecation Template

Status: Active
Version: 1.0

## Purpose
Document why continued future use is discouraged while preserving identity and history.
## Scope
Deprecation reason, impact, replacement guidance where known, review, notice, and audit.
## Out of Scope
Deprecation MUST NOT delete, supersede automatically, retire access, or publish a replacement.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-007, Editorial lifecycle guide, Review Framework, and KGS-003/005/006.
## When to Use
When an identity/version remains historically valid but future use should be discouraged.
## Who Completes It
Domain Editor proposes; affected reviewers assess; governance authority decides; Release Editor handles authorized notices.
## Required Inputs
Affected identity/version, rationale/evidence, impact, alternatives, review records, and authority.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Affected identity/version | Fix target | Required | Exact reference | Label-only target | Include all affected versions | Governance | `fictional-term-1/v1` | “old term” |
| Reason | Explain discouragement | Required | Evidence/authority-based rationale | Preference alone | State risk/obsolescence | Domain | “ambiguous in fictional scope” | “unpopular” |
| Triggering evidence | Support action | Required | Findings/evidence/decision | Unsupported opinion | Link record | Evidence | `fictional-finding-9` | “everyone agrees” |
| Scope | Bound deprecation | Required | Language/jurisdiction/use/version | Global by default | State where it applies | Terminology | “F-language preferred use” | “all use” |
| Impact | Identify consumers | Required | Candidate/term/relationship/release effects | Hidden breakage | List known impacts | Governance | “three fictional term refs” | Blank |
| Required reviews | Route competence | Required | Affected specialist/governance/publication reviews | Single editor approval | Use matrix | Governance | “Terminology + Governance” | “maintainer” |
| Affected relationships | Preserve links | Required | References/none | Silent deletion | State consequences | Ontology | “none” | Omitted |
| Affected terminology | Preserve term history | Required | Term references/status | Erased label | Link decisions | Terminology | `fictional-term-1` | Delete term |
| Replacement/successor | Guide future use | Conditional | Governed reference or none identified | Invented replacement | Distinguish from supersession | Governance | `fictional-term-2 proposed` | “use new one” |
| Effective date | Place status | Required | Authorized date/point | Backdated concealment | Record decision | Governance | “deprecation day D1” | “always deprecated” |
| Rollback information | Address reversal | Required | Reinstatement evidence/process | Silent status flip | State required reviews | Governance | “new evidence + review required” | “undo flag” |
| Decision authority | Prove status authority | Required | KGS-authorized role/body | Author alone | Cite scope | Governance | “Terminology authority T” | “team” |
| Audit trail | Preserve notices/history | Required | Proposal/reviews/decision/notices | Deleted prior usage | Link records | Governance | `fictional-deprecation-log-1` | “deprecated” |

## Completion Rules
Deprecation retains identity/history and MUST state whether a successor is merely proposed or governed.
## Prohibited Content
Silent deletion, identity reuse, automatic supersession, unreviewed replacement, or publication authorization.
## Review Requirements
Affected specialist, governance, and publication reviews are mandatory as scoped.
## Failure Modes
No reason, no impact analysis, replacement presented accepted, or history removed.
## Example
A fictional ambiguous term MAY be deprecated while retained for historical lookup.
## Non-example
Deleting the term and reusing its identity MUST NOT pass.
## Audit and Retention
Retain all versions, reasons, evidence, impacts, decisions, notices, replacements, and reversals.
## Change Control
Template changes require lifecycle, terminology, and KGS impact analysis.
