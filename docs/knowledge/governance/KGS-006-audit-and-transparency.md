# KGS-006: Audit and Transparency

Status: Active

Version: 1.0

## Purpose

Define the human-readable logs, revision history, traceability, retention,
access, and accountability required to audit CP-MoAKB knowledge governance.

## Scope

This standard applies to review logs, decision logs, evidence logs, publication
logs, revision history, conflict and appeal records, recusals, corrections,
deprecations, retirements, retractions, and withdrawals.

## Out of Scope

This standard does not prescribe a database, schema, serialization, API, audit
software, cryptographic system, Runtime behavior, retention technology, or
public-disclosure platform. It does not create knowledge, data, diagnosis,
recommendation, inference, or publication authority.

## Definitions

- **Audit trail** is the connected, chronological evidence needed to reconstruct
  what was proposed, reviewed, decided, changed, accepted, published, corrected,
  or retired; by whom; under which authority; and why.
- **Review log** records assignments, qualifications, recusals, findings,
  responses, and dispositions for a review.
- **Decision log** records a governed question, authority, participants,
  deliberation basis, result, rationale, minority positions, and appeal route.
- **Evidence log** connects a proposal and review to the evidence considered,
  including adverse, excluded, unavailable, or superseded evidence.
- **Publication log** records the exact knowledge release, approvals, contents,
  versions, channel, time, restrictions, and later public dispositions.
- **Revision history** preserves each material version, changes, author,
  rationale, review impact, and relationship to earlier and later versions.
- **Transparency** means relevant governance information is accessible to the
  appropriate audience without violating rights, privacy, security, or law.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. Audit evidence MUST be sufficient for an independent
qualified person to reconstruct the governed decision without private memory.

## Governance Rules

### Common Record Requirements

Every governance record MUST have a stable reference, record type, subject and
version, timestamp, accountable custodian, participants and roles, governing
authority, status, related records, and retention disposition. Times,
jurisdictions, identities, and versions MUST be unambiguous within their scope.

Records MUST distinguish facts supplied by sources, participant statements,
review findings, governance decisions, and administrative metadata. Corrections
MUST append or link a corrected record; they MUST NOT silently overwrite history.

### Review Log

The Managing Editor MUST maintain a review log for each submission. It MUST
record the review plan, assigned and replacement reviewers, qualification basis,
conflict disclosures and recusals, dates, versions reviewed, findings, author
responses, reopened reviews, dispositions, and Review Board completeness
decision. Missing or unavailable review evidence MUST remain explicit.

### Decision Log

The chair or designated recorder of each deciding body MUST maintain a decision
log. It MUST record the question, scope, competent authority, quorum, eligible
participants, recusals, consensus attempt, votes and abstentions where used,
evidence and records considered, objections and minority rationales, decision,
conditions, effective date, accountable owner, and appeal route.

A summary MAY be published, but it MUST NOT falsely claim unanimity or omit a
material unresolved limitation.

### Evidence Log

The Evidence Reviewer MUST ensure the evidence log identifies sources, versions,
locators, provenance, claim relationship, applicability, limitations, conflicts,
rights status, review status, and reasons for exclusion or retirement as required
by KAS-003, KAS-004, Source Policy, and ADR-008. The log MUST retain material
adverse evidence and MUST NOT infer missing support.

An evidence log records governance evidence; it MUST NOT become an agricultural
dataset or silently establish knowledge acceptance.

### Publication Log

The Release Editor MUST maintain a publication log containing the release
identity, exact included knowledge versions, acceptance and readiness decisions,
Project Owner authorization, publication boundary and channel, release time,
rights and attribution status, known limitations, custodian, and any correction,
deprecation, retraction, withdrawal, or supersession notices.

The log MUST distinguish knowledge publication from repository push, Git tag,
GitHub Release, artifact upload, package publication, and source integration.
Each separately governed action MUST have its own authority record.

### Revision History

The Knowledge Author and Managing Editor MUST preserve material proposal
versions and link each revision to its rationale, author, date, changed meaning,
review findings addressed, and required re-review. Accepted and published
versions MUST be immutable as historical records. Editorial corrections MUST be
identified as non-semantic or receive the review required for a meaning change.

Deprecation, retirement, supersession, retraction, and withdrawal MUST add
history; they MUST NOT erase identity, provenance, evidence, decisions, or prior
publication status.

### Audit Trail Integrity

The Governance Committee MUST periodically assess whether governance records are
complete, internally consistent, traceable, retained, and protected from silent
alteration. An audit MUST identify scope, auditor independence, sampled records,
method, findings, limitations, corrective actions, owners, and follow-up status.

Audit failure MUST NOT be concealed by reconstructing undocumented approvals.
Material gaps MUST be reported to the Knowledge Board and Project Owner and MAY
block acceptance or publication until resolved.

### Transparency and Access

Governance decisions, authorities, conflicts, limitations, and publication
status SHOULD be visible to the people relying on them. Access MAY be restricted
only for documented privacy, confidentiality, security, rights, legal, or
protective reasons. A restricted record SHOULD expose a non-sensitive statement
of existence, authority, restriction reason, and accountable custodian when
permitted.

Redaction MUST be minimal, authorized, and logged. It MUST NOT be used to hide
dissent, error, sponsorship, missing evidence, or governance misconduct.

### Accountability

Every open finding, condition, correction, and audit action MUST have an
accountable owner and disposition. Governance bodies MUST review overdue material
risks and MUST NOT close an item solely because time passed. Good-faith reporting
of errors, conflicts, or audit concerns MUST be protected from retaliation.

## Examples

- A decision log records a two-thirds vote and includes the minority rationale
  without implying scientific unanimity.
- A publication log distinguishes an approved knowledge release from an
  unapproved repository tag.
- A privacy-protected review exposes a public summary of the decision authority
  and restriction while retaining the detailed record under controlled access.

These examples describe recordkeeping, not implementation schemas.

## Non-examples

- Keeping the reason for acceptance only in a private conversation.
- Deleting a superseded review record.
- Recording approval without the exact version reviewed.
- Redacting a conflict of interest merely to avoid embarrassment.
- Treating a green test result as a publication decision log.

## Reviewer Notes

Reviewers SHOULD trace a sample from submission through current disposition and
confirm that every authority, version, finding, conflict, and public action is
reconstructable. A log that lists events without rationale or exact-version links
SHOULD be treated as incomplete.

## Future Work

Future work MAY define retention schedules, audit sampling guidance, transparency
reports, record templates, and access classifications. It MUST remain
implementation-neutral until separately approved and MUST NOT prescribe or
create a schema, registry, Runtime service, or publication system.
