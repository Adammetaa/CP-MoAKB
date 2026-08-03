# Supersession Template

Status: Active
Version: 1.0

## Purpose
Document an authorized successor while preserving the superseded identity, version, and provenance.
## Scope
Successor relation, migration impact, review, effective point, rollback, and audit.
## Out of Scope
Supersession MUST NOT recycle identity, delete history, imply equivalence, or publish the successor.
## Authority
Governed by [Template Governance](../template-governance.md), ADR-006, KAS-007, Editorial lifecycle guide, Review Framework, and KGS.
## When to Use
When governance determines that a distinct governed identity/version replaces another for future use.
## Who Completes It
Domain/Managing Editor proposes; identity, specialist, governance, and applicable publication authorities decide.
## Required Inputs
Predecessor and successor identities/versions, evidence, equivalence/difference analysis, impacts, and reviews.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Affected identity/version | Identify predecessor | Required | Exact governed reference | Label-only identity | Preserve permanently | Governance | `fictional-concept-1/v2` | “old Alpha” |
| Reason | Explain replacement | Required | Evidence/authority rationale | Convenience rename | State why successor needed | Domain | “scope split approved” | “newer is better” |
| Triggering evidence | Support action | Required | Evidence/findings/decisions | Unsupported preference | Link all material basis | Evidence | `fictional-decision-8` | “obvious” |
| Scope | Bound relation | Required | Uses/jurisdictions/versions superseded | Global assumption | State partial/full scope | Governance | “future F-context use” | “everything” |
| Impact | Map consumers | Required | Identity/term/relationship/release effects | Silent migration | Enumerate known references | Governance | “R1 must point to successor” | Blank |
| Required reviews | Route competence | Required | Identity + affected specialists/governance | Author alone | Use matrix | Governance | “Identity, Ontology, Governance” | “editor” |
| Affected relationships | Preserve graph meaning | Required | References and disposition | Automatic endpoint rewrite | Review each relation | Ontology | `fictional-rel-1 requires revision` | Bulk replace |
| Affected terminology | Preserve label history | Required | Term refs/disposition | Term equality implies successor | Review each term | Terminology | `fictional-term-1 retained historical` | Rename only |
| Replacement/successor | Identify successor | Required | Distinct governed identity/version | Unregistered label | Verify custody | Governance | `fictional-concept-2/v1` | “new Alpha” |
| Effective date | Place transition | Required | Authorized date/point | Silent retroactivity | Record decision | Governance | “supersession day S1” | “immediately” |
| Rollback information | Address error | Required | Reversal/governance limits | Identity recycling | State public-history constraint | Governance | “suspend successor; retain both” | Delete successor |
| Decision authority | Prove approval | Required | KGS-authorized role/body | Author/self-appointed role | Cite scope | Governance | “Knowledge Board scope I” | “maintainer” |
| Audit trail | Preserve chain | Required | Proposal/analysis/reviews/decision/notices | Last-write-wins | Link predecessor/successor | Governance | `fictional-supersession-log-1` | Overwrite predecessor |

## Completion Rules
Predecessor and successor remain distinct and auditable. Reference migration requires separate reviewed work.
## Prohibited Content
Identity reuse, silent endpoint rewrite, equivalence inference, deletion, machine migration, or publication claim.
## Review Requirements
Identity, all affected specialist, governance, rights, and publication reviews apply by impact.
## Failure Modes
Missing successor custody, unreviewed relationship migration, hidden scope, or deleted predecessor.
## Example
A fictional concept MAY be superseded by a distinct successor while both histories remain.
## Non-example
Renaming a label and claiming a new identity MUST NOT pass.
## Audit and Retention
Retain predecessor/successor versions, custody, evidence, impacts, decisions, notices, and reversal actions.
## Change Control
Template changes require ADR-006, KAS-007, and governance impact analysis.
