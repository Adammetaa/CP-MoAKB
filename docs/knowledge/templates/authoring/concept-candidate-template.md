# Concept Candidate Template

Status: Active
Version: 1.0

## Purpose
Prepare one evidence-backed concept candidate for separate specialist reviews.
## Scope
Identity, meaning, language references, evidence, relationships, ontology proposal, and lifecycle.
## Out of Scope
This template MUST NOT define a schema, allocate production identity, or accept knowledge.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-002/005/006/007, ADR-005/006, Editorial Handbook, and Review Framework.
## When to Use
After candidate identity custody and enough evidence exist to propose bounded meaning.
## Who Completes It
Knowledge Author completes; Evidence, Scientific, Terminology, Ontology, and Governance Reviewers assess their scopes.
## Required Inputs
Governed candidate handle, evidence items, intended scope, source authority, and review assignment.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Governed candidate identity | Preserve identity | Required | Candidate-only review handle | Preferred term as identity | Cite custody | Governance | `fictional-concept-1` | “Blue object” |
| Candidate type | Route review | Required | Concept class description | Machine enum/type | Use editorial wording | Governance | “concept candidate” | `type: string` |
| Preferred term | Propose display term | Conditional | Term-candidate reference | Accepted status by inclusion | Link term review | Terminology | `fictional-term-1` | Unreviewed label asserted official |
| Alternative terms | Preserve variants | Optional | Term references with status | Comma-separated inferred synonyms | Link each nomination | Terminology | `fictional-term-2` | “same as anything similar” |
| Thai term | Support Thai authoring | Conditional | Thai term-candidate reference | UI translation as authority | State review status | Terminology | `fictional-th-term-1` | Copied UI label |
| English term | Support English precision | Conditional | English term-candidate reference | Automatic Thai equivalence | Review separately | Terminology | `fictional-en-term-1` | “translation therefore accepted” |
| Scientific name | Preserve nomenclature | Conditional | Reviewed name reference | Common name as scientific identity | N/A with reason if inapplicable | Scientific | “not applicable: synthetic object” | Invented binomial claimed valid |
| Definition | State what it is | Required | Neutral, scoped, evidenced wording | Circularity, advice, diagnosis | Distinguish adjacent concepts | Scientific | “synthetic review object…” | “Alpha is Alpha” |
| Scope | Bound meaning | Required | Included context/time/jurisdiction | Universal assertion | Mirror evidence | Scientific | “editorial example only” | “all settings” |
| Exclusions | Prevent overreach | Required | Explicit excluded meanings | Hidden limitations | Name adjacent exclusions | Scientific | “excludes real-world entities” | Blank |
| Disambiguation | Separate similar concepts | Conditional | Evidence-backed distinctions | Label equality/merge | Link comparison | Terminology | “distinct from fictional Beta by scope” | “different because name differs” |
| Source authority | Bound authority | Required | Source/authority references with scope | Universal authority rank | Cite ADR-008 context | Governance | `fictional-source-1` for definition | “official truth” |
| Evidence references | Trace claims | Required | Evidence-item references | Bibliography-only list | Map to definition/scope | Evidence | `fictional-evidence-1` | “many studies” |
| Terminology references | Link language review | Required | Term candidate/decision references | Inline ungoverned synonyms | Include statuses | Terminology | `fictional-term-1: pending` | Raw labels only |
| Relationship references | Link separate assertions | Required | Relationship candidate references | Duplicated relationship facts | Reference one-edge proposals | Ontology | `fictional-rel-1` | “causes Beta” inline |
| Ontology placement proposal | Invite conceptual review | Conditional | Implementation-neutral layer/category proposal | Table/class/graph design | State uncertainty | Ontology | “domain-entity layer proposed” | “database table X” |
| Unresolved issues | Preserve gaps | Required | Issue references or none identified | Silent uncertainty | Link issue template | Governance | `fictional-issue-1` | Blank |
| Author identity | Establish accountability | Required | Governed author role/identity | Unattributed team | Record responsible role | Governance | “Knowledge Author A” | “staff” |
| Review requirements | Route competence | Required | Required review types/scopes | Self-approval | Use review matrix | Governance | “Scientific + Terminology” | “general review” |
| Lifecycle status | Track candidate state | Required | KAS lifecycle state | Accepted/published by completion | Cite decision | Governance | “Candidate” | “canonical” |
| Change history | Preserve revisions | Required | Version/reason/role references | Overwritten prose | Append changes | Governance | “v2: scope narrowed” | “updated” |
| Diagnosis | Prevent epistemic collapse | Prohibited | Explicit absence | Diagnostic assertion | Remove and escalate | Scientific | “No diagnosis” | “This confirms…” |
| Recommendation/ranking/score | Prevent advice/scoring | Prohibited | Explicit absence | Advice, rank, percentage | Do not include | Governance | “None permitted” | “Best, 90%” |
| Unsupported causal/regulatory assertion | Prevent high-risk claim | Prohibited | Separate reviewed relationship reference only | Inline causation/permission | Nominate separately | Ontology | `fictional-rel-1 pending` | “causes and is permitted” |

## Completion Rules
Every meaning-bearing statement MUST map to evidence and scope. Conditional term,
name, disambiguation, and ontology fields require applicability reasons.
## Prohibited Content
Unsupported diagnosis, recommendation, ranking, confidence percentage, causal or regulatory assertion, and machine types.
## Review Requirements
Evidence, Scientific, Terminology, Ontology, and Governance Reviews follow the review matrix.
## Failure Modes
Label identity, inline relationships, hidden unknowns, unscoped definition, or accepted-by-completion.
## Example
A fictional concept with a separate pending term and non-causal relationship MAY be reviewed.
## Non-example
A “canonical” concept containing advice and 95% confidence MUST NOT pass.
## Audit and Retention
Retain every version, evidence/term/relationship link, finding, decision, issue, and lifecycle transition.
## Change Control
Field changes require KAS, ADR-005/006, handbook, and review-framework analysis.
