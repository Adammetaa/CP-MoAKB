# KGS-003: Review Process

Status: Active

Version: 1.0

## Purpose

Define accountable human governance for submission, review, revision,
acceptance, publication, correction, deprecation, retirement, rejection, and
appeal of CP-MoAKB knowledge proposals.

## Scope

This standard applies to governance actions and decision responsibilities across
the knowledge lifecycle. KAS-007 remains authoritative for knowledge lifecycle
meaning and state requirements; this KGS governs who performs and approves the
related actions.

## Out of Scope

This standard does not create workflow software, state-machine schema,
validation, data, knowledge, publication automation, diagnosis, recommendation,
inference, or authority to bypass a KAS review.

## Definitions

- **Submission** is a traceable proposal delivered for governance intake.
- **Review plan** identifies required review scopes, reviewers, independence,
  sequence, and decision gates.
- **Finding** is a reviewer's documented approval, condition, question,
  objection, or rejection rationale within their authority.
- **Acceptance** is the governed decision that a version satisfies all required
  knowledge review gates; it is not publication.
- **Publication** is a separately authorized act making an accepted version
  available in a declared knowledge release.
- **Correction** addresses an identified defect while preserving history.
- **Deprecation** marks knowledge as discouraged or no longer current while
  retaining traceability.
- **Retirement** removes knowledge from current use without deleting its history.
- **Rejection** closes a proposal that does not satisfy requirements.
- **Appeal** requests review of a decision on permitted grounds.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. No lifecycle action MAY be inferred from inactivity,
repository presence, or a technical status.

## Governance Rules

### Submission

The Knowledge Author MUST submit a versioned proposal with scope, exclusions,
authority basis, sources, evidence, provenance, known conflicts, uncertainty,
rights status, and requested disposition required by applicable KAS. The
Managing Editor MUST record receipt, check completeness, identify the Author,
and either return an incomplete submission or create a review plan.

Submission MUST NOT imply endorsement, candidate acceptance, or publication.

### Review

The Managing Editor MUST assign qualified, independent reviewers for every
applicable scientific, evidence, terminology, ontology, domain, editorial,
regulatory, rights, privacy, architecture, security, or release scope. Reviewers
MUST disclose conflicts, review only within competence, cite their basis, and
record findings without erasing competing views.

The Review Board MUST verify coverage and independence. Parallel reviews MAY be
used when authority boundaries remain distinct. A missing required review,
unresolved blocking finding, or unavailable qualified reviewer MUST cause
deferral.

### Revision

The Author MUST respond to every material finding by accepting it, proposing a
traceable revision, or documenting disagreement. A revision MUST identify the
changed version and MUST NOT overwrite the reviewed proposal or prior findings.
Material changes MUST return to every affected reviewer. Editors MUST NOT mark a
finding resolved without the competent reviewer's confirmation or a governed
conflict disposition.

### Acceptance

The Review Board MUST certify that required reviews, revisions, conflicts,
recusals, and decision records are complete. The Knowledge Board MAY accept only
the exact reviewed version after all competent approvals are present and no
blocking finding remains. Conditions MUST be explicit and completed before
acceptance unless the acceptance decision explicitly makes them non-publication
conditions with an owner and due date.

Acceptance MUST NOT authorize publication, implementation, Runtime ingestion,
diagnosis, recommendation, inference, or use outside the accepted scope.

### Publication

Publication MUST follow KGS-005. The Release Editor MUST verify that the exact
accepted version, release scope, version approval, rights and attribution review,
publication record, and explicit Project Owner authorization are present.
Publication MUST NOT silently include revisions made after acceptance.

### Correction

Any participant MAY submit a correction request with the affected version,
claimed defect, evidence, urgency, and potential impact. The Managing Editor
MUST triage it, preserve the published and review records, and assign competent
review. Material corrections MUST produce a new reviewed version. Emergency
corrections MUST follow KGS-001 and KGS-005 and MUST receive retrospective review.

### Deprecation

The Knowledge Board MAY approve deprecation after competent impact review.
Deprecation MUST state the reason, effective date, affected scope, replacement if
any, migration guidance where applicable, and continuing historical use. It MUST
NOT silently redirect identity or erase evidence.

### Retirement

The Knowledge Board MAY approve retirement when knowledge no longer belongs in
current use and retention obligations are satisfied. Retirement MUST preserve
identity, versions, evidence, decisions, citations, publication history, and the
reason for retirement. Retired knowledge MUST NOT be represented as deleted or
as never having been accepted.

### Rejection

The competent reviewing body MAY recommend rejection for failed evidence,
authority, meaning, neutrality, rights, scope, or governance requirements. The
Knowledge Board MUST record the exact grounds and may close the proposal after
confirming due process. Rejection MUST NOT erase the submission or prevent a new
materially improved proposal.

### Appeal

Appeals MUST follow KGS-001. The Managing Editor MUST acknowledge and route a
complete appeal to an independent competent body. Appeal review MUST preserve the
original decision, evidence, findings, and contested grounds. The appeal outcome
MUST be recorded as affirmed, amended, vacated, or remanded. Publication MUST be
stayed when continued availability presents a credible material risk and the
competent authority orders the stay.

## Examples

- A revision changes a scientific limitation, so both Scientific and Evidence
  Reviewers reassess it before acceptance.
- A proposal passes editorial review but lacks a qualified ontology review; the
  Review Board defers it.
- A deprecated version remains available for audit with its successor link and
  reason, while current-use guidance points to the successor.

These examples describe workflow governance, not agricultural facts.

## Non-examples

- Treating a merged pull request as knowledge acceptance.
- Letting a Managing Editor resolve a scientific objection alone.
- Publishing a corrected text under the old version without history.
- Deleting rejected submissions and review findings.
- Advancing a proposal because a reviewer missed a deadline.

## Reviewer Notes

Reviewers SHOULD verify exact-version identity at every handoff, independent
coverage of all required scopes, disposition of each finding, and separation of
acceptance from publication. A process record that cannot reconstruct who made
which decision and why MUST fail review.

## Future Work

Future work MAY define service targets, submission forms, review checklists, and
human-readable status vocabularies. It MUST remain implementation-neutral and
MUST NOT create workflow automation, schema, Runtime behavior, or content.
