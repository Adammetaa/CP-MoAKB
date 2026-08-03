# Source Nomination Template

Status: Active
Version: 1.0

## Purpose
Capture enough source identity, authority, status, and rights context for intake review.
## Scope
One source nomination for one intended claim scope.
## Out of Scope
Nomination MUST NOT accept evidence, rank truth, infer rights, or reproduce the source.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-003/004, Source Policy, and Editorial source intake.
## When to Use
Before extracting evidence from a newly proposed source.
## Who Completes It
Nominator completes; Evidence and Rights Reviewers verify; Domain Editor confirms intended scope.
## Required Inputs
Accessible source identity evidence, intended use, nominator role, and applicable jurisdiction.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nomination identity | Track nomination | Required | Governed review handle | Title as identity | Assign before handoff | Governance | `fictional-nomination-1` | “Good paper” |
| Source identity | Distinguish work/version | Required | Governed source reference or Unknown with action | URL as sole identity | Verify independently | Evidence | `fictional-source-1` | Same title = same source |
| Title | Identify displayed title | Required | Exact stated title | Invented translation as official | Preserve language | Evidence | *Fictional Circular A* | Shortened guess |
| Author | Record named person | Conditional | Name exactly as source states | Invented person | N/A with reason when none | Evidence | “Fictional Author Q” | Assumed editor |
| Institutional author | Record organization authorship | Conditional | Stated fictional body | Publisher assumed as author | Distinguish roles | Evidence | “Imaginary Office” | Website owner |
| Publisher | Record issuer | Conditional | Stated publisher | Authority inference | Cite source evidence | Evidence | “Synthetic Press” | “Official” |
| Authority | Bound claim authority | Required | Claim-scoped authority finding or Unknown | Universal truth rank | State scope/jurisdiction | Governance | “Issuer for fictional scope” | “Highest authority” |
| Document type | Route citation/review | Required | Governed source class | File extension alone | Select editorial class | Evidence | “technical manual” | “PDF” |
| Language | Preserve source language | Required | Stated language/locale | Guessed from URL | Inspect work | Terminology | “Fictional language F” | “Probably English” |
| Jurisdiction | Bound applicability | Required | Stated jurisdiction or explicit Unknown | Assumed global scope | Give source basis | Governance | “Imaginary Region One” | “Worldwide” |
| Version | Identify revision | Required | Exact designation or Unknown | Current by assumption | Check source | Evidence | “Version F-2” | “latest” |
| Edition | Identify edition | Conditional | Stated edition | Version duplication | Use when work has editions | Evidence | “Second fictional edition” | Blank for applicable book |
| Publication date | Establish time | Required | Stated date or Unknown with reason | File timestamp | Preserve precision | Evidence | “Fictional year 12” | Download date |
| Retrieval date | Audit access | Required | Human-recorded retrieval date | Publication date substitution | Record actual retrieval | Evidence | “Review day R1” | “recently” |
| Official URL | Locate official copy | Conditional | Verified official location | Unverified mirror | State verification | Evidence | “official fictional locator F” | Search result |
| DOI | External identifier | Conditional | Stated DOI-like identifier | Invented identifier | N/A unless applicable | Evidence | “fictional DOI F-1” | Guessed pattern |
| ISBN | Edition identifier | Conditional | Stated ISBN-like identifier | Invented value | N/A unless book | Evidence | “fictional ISBN B-1” | Publisher code |
| Checksum | Integrity reference | Optional | Verified digest description | Digest as rights proof | State method externally | Evidence | “verified integrity digest” | “safe file” |
| Access status | Describe availability | Required | Accessible, unavailable, restricted, Unknown | Rights conclusion | State observation | Evidence | “restricted access” | “redistributable” |
| Redistribution status | Bound republication | Required | Verified permission, prohibited, or Unknown | Access implies permission | Cite rights evidence | Rights | “Unknown — review open” | “Online, so allowed” |
| Correction status | Identify corrections | Required | None found, corrected, Unknown | Silent assumption | State check basis | Evidence | “correction notice reviewed” | Blank |
| Retraction status | Identify withdrawal | Required | Active, retracted, Unknown | Omitted adverse status | Check issuer | Evidence | “Unknown — issuer inaccessible” | “Probably active” |
| Replacement status | Identify successor work | Required | None identified, replaced, Unknown | Same as supersession without evidence | Name basis | Evidence | “replacement not identified” | Empty |
| Supersession status | Preserve authority history | Required | Current, superseded, Unknown | Last URL wins | Name successor if known | Governance | “superseded by fictional F-3” | Delete F-2 |
| Intended claim scope | Bound proposed use | Required | Specific claim/context | “All facts” | State what will be examined | Scientific | “definition in section 2” | “agriculture” |
| Nominator | Establish accountability | Required | Governed role/identity | Anonymous attribution unless governed | Record accountable role | Governance | “Knowledge Author role A” | “team” |
| Unresolved issues | Preserve gaps | Required | Issue references or “none identified” | Hidden blanks | Link issue templates | Governance | `fictional-issue-1` | “N/A” without reason |
| Review status | Track intake state | Required | Candidate lifecycle state | Accepted/published by completion | Cite decision record | Governance | “Evidence review pending” | “approved source” |
| Agricultural assertions | Prevent content creation | Prohibited | Explicit absence statement | Real claims | Remove from nomination | Scientific | “No domain claim extracted” | A factual crop claim |

## Completion Rules
Required fields need supported values or explicit permitted absence states.
Conditional fields require a stated applicability decision. Optional fields MAY be omitted.
## Prohibited Content
Copied source passages, inferred permissions, source rankings, real agricultural claims, and machine field types.
## Review Requirements
Evidence Review verifies identity/status; Rights Review verifies redistribution; Governance reviews authority scope.
## Failure Modes
URL-as-identity, accessible-equals-redistributable, stale version, or hidden retraction uncertainty.
## Example
A wholly fictional manual with Unknown redistribution MAY be nominated while republication remains blocked.
## Non-example
An uploaded document with no source identity MUST NOT pass intake.
## Audit and Retention
Retain nomination version, source checks, rights evidence, issues, reviews, decisions, and supersession history.
## Change Control
Field changes require KAS, Source Policy, Editorial Handbook, and Review Framework impact review.
