# KAS-007: Knowledge Lifecycle

Status: Active

Version: 1.0

## Purpose

Define the governed states and transitions through which knowledge is proposed,
reviewed, accepted, published, deprecated, retired, archived, or superseded.

## Scope

This lifecycle applies to conceptual knowledge records and relationship
assertions governed by the KAS family. It coordinates, but does not replace,
term lifecycle, identifier custody, evidence review status, source status,
regulatory validity, ADR status, or software release state.

## Out of Scope

This standard does not implement a workflow, assign reviewers, promote existing
content, create publication infrastructure, define datasets, or authorize
automated state transitions.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative. State names express governance meaning, not enum values, database
fields, or Runtime behavior.

## Definitions

- **Transition** is an attributed decision moving one governed version between
  lifecycle states.
- **Acceptance** is approval that required reviews are complete for a declared
  scope; it is not publication.
- **Publication** is inclusion of an accepted version in a governed knowledge
  release.
- **Deprecation** discourages new use while preserving access and migration
  context.
- **Retirement** ends current governed use without erasing historical evidence.
- **Archival** preserves a record outside normal active workflows under declared
  access and retention rules.
- **Supersession** links an older version or record to a reviewed successor for a
  stated scope.

## Governance Rules

### Lifecycle states

| State | Required meaning |
| --- | --- |
| Candidate | A captured proposal with stable candidate custody and provenance; completeness and suitability are not established. |
| Draft | The proposal has sufficient structure for review but remains unapproved and unpublished. |
| Scientific Review | Qualified reviewers assess scientific meaning, evidence, applicability, uncertainty, and conflicts. |
| Terminology Review | Reviewers assess definitions, labels, language, ambiguity, synonymy, and authority. |
| Ontology Review | Reviewers assess identity, conceptual category, relationship semantics, and cross-domain boundaries without selecting implementation. |
| Accepted | All required reviews and dispositions are approved for the declared scope/version. No publication is implied. |
| Published | The accepted version is included in an explicitly governed knowledge release. Publication does not make the claim universal, timeless, legally approved, diagnostically sufficient, or recommended. |
| Deprecated | The version remains available but is no longer preferred for new use; reason, validity, and replacement guidance are visible. |
| Retired | Current governed use has ended because the record is obsolete, unsupported, outside scope, or otherwise withdrawn through review. Historical traceability remains. |
| Archived | The record and decisions are preserved under retention/access rules outside normal active use. Archival does not erase or validate it. |
| Superseded | A reviewed successor replaces the record/version for a stated scope; the predecessor and transition remain resolvable. |

Rejected and Withdrawn MAY be recorded as proposal dispositions. Rejection means
review did not approve the proposal; withdrawal means the sponsor ended it or a
prerequisite failed. Neither permits identity reuse or deletion of provenance.

### Transition requirements

Every transition MUST record record/version identity, prior and new state,
decision date, effective date when different, responsible role and authority,
rationale, evidence/citations, review decisions, unresolved objections,
conditions, affected scope, and successor or rollback information when
applicable.

Candidate normally precedes Draft. Scientific, Terminology, and Ontology Review
MAY be sequenced or repeated according to risk, but each required perspective
MUST reach an explicit disposition before Accepted. Material change during review
MUST return the affected proposal to Draft or the relevant review state.

Accepted MUST precede Published. Publication requires an identified knowledge
release, included version, release authority, quality evidence, rights/privacy
clearance, and explicit approval. A Git commit, software release, API response,
or successful validator MUST NOT trigger publication.

Published knowledge MAY become Deprecated, Retired, or Superseded after impact
review. Supersession MUST name the successor and exact replacement scope; it MUST
NOT imply that the predecessor was false outside that scope. Archived MAY follow
any inactive disposition when retention/access governance requires it, but the
prior semantic state MUST remain recorded.

Restoration from Deprecated or Retired requires review of the original reason,
new evidence, intervening versions, conflicts, and downstream impact. It creates
a new transition and, when meaning or support changed materially, a new version.

## Examples

- A fictional Draft completes scientific and terminology review but remains in
  Ontology Review because its relationship boundary is ambiguous. It cannot be
  Accepted by majority completion.
- A fictional Published version is Superseded only for one jurisdiction and time
  period; the prior version remains historically valid elsewhere.

## Non-examples

- Marking a record Published because tests pass.
- Skipping review because a source is official.
- Deleting a Deprecated or Rejected record.
- Reusing a retired identity for a different concept.
- Treating Archived as proof that the record was Accepted.

## Reviewer Notes

Reviewers SHOULD determine which specialist gates are required by claim type,
including evidence, scientific, terminology, ontology, regulatory, safety,
rights, privacy, and conflict-of-interest review. A transition MUST be blocked
when responsible authority or evidence is missing.

## Future Considerations

Future standards may define knowledge release collections, reviewer-role
competence, service levels, appeal, emergency correction, or machine-readable
workflow mappings. Automation MAY route and verify completeness but MUST NOT
approve, publish, retire, or supersede knowledge autonomously.
