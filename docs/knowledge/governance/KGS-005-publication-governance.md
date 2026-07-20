# KGS-005: Publication Governance

Status: Active

Version: 1.0

## Purpose

Define who may approve and execute a CP-MoAKB knowledge publication, how versions
and freezes are governed, and how emergency publication, retraction, and
withdrawal preserve accountability.

## Scope

This standard applies to accepted knowledge proposed for inclusion in a declared
knowledge release. It governs human approval authority and publication records,
not the implementation mechanism used to distribute material.

## Out of Scope

This standard does not authorize the current repository to publish, push, tag,
release, upload artifacts, or publish packages. It does not create knowledge,
data, a release system, schema, Runtime behavior, API, diagnosis,
recommendation, inference, or AI.

## Definitions

- **Knowledge release** is an explicitly identified collection of exact accepted
  knowledge versions approved for a declared audience and publication boundary.
- **Version approval** confirms that the exact version proposed for release is
  the version reviewed and accepted.
- **Knowledge freeze** is a controlled period in which release contents and
  accepted meaning MUST NOT change except through an authorized correction.
- **Publication approval** is explicit Project Owner authorization to make the
  defined knowledge release public.
- **Publication execution** is the Release Editor's act of carrying out an
  approved publication through a separately authorized mechanism.
- **Retraction** declares that published knowledge MUST no longer be relied upon
  while preserving its identity and history.
- **Withdrawal** removes a release or item from availability for a stated reason
  without falsely representing that it never existed.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. Publication authority MUST be explicit, versioned,
scoped, and recorded; it MUST NOT be inferred from access or prior approval.

## Governance Rules

### Who May Publish

Only a currently appointed Release Editor MAY execute an approved knowledge
publication. The Release Editor MUST act only after the Knowledge Board has
certified readiness and the Project Owner has explicitly authorized the exact
knowledge release and publication boundary.

An Author, reviewer, board, editor, maintainer, repository contributor, or
automated system MUST NOT publish merely because they prepared, reviewed,
accepted, merged, built, or can technically access the material.

### Approval Authority

The Review Board MUST certify completion and independence of required reviews.
The Knowledge Board MUST certify that every included item is accepted, scoped,
version-aligned, conflict-disclosed, and suitable for the proposed collection.
The Release Editor MUST verify rights, attribution, release records, and
publication prerequisites. The Project Owner alone MAY grant final public
knowledge-publication approval under KGS.

Approval MUST identify release identity, exact contents and versions, audience,
scope, exclusions, effective date, publication channel, restrictions, approver,
and authorization date. Approval for one release or channel MUST NOT authorize
another.

The repository [Publication Boundary](../../release/publication-boundary.md)
remains separately authoritative for public pushes, tags, GitHub Releases,
artifacts, and packages. KGS approval MUST NOT substitute for any required
software or repository publication approval.

### Version Approval

Every release item MUST resolve to the exact accepted version and associated
review record. The Release Editor MUST compare the assembled content to that
version. Any material change after acceptance MUST return to affected review and
receive new version approval. Display formatting MAY change only when it cannot
alter meaning, citations, provenance, warnings, or scope.

### Knowledge Release

A knowledge release MUST have a unique governed identity, release date or
planned date, included versions, excluded or unresolved material, applicable
jurisdictions and audiences, known limitations, rights and attribution status,
decision references, and custodian. A knowledge release MUST remain distinct
from software, source, schema, vocabulary, ontology, and dataset releases unless
each independently governed component is explicitly approved.

### Knowledge Freeze

The Managing Editor MUST declare the proposed release contents before final
review. During freeze, authors and editors MUST NOT change meaning, membership,
evidence, citations, or version identity. A required change MUST reopen the
affected review and produce a new release candidate or documented emergency
correction. Freeze MUST NOT suppress newly discovered risk or evidence.

### Emergency Publication

Emergency publication MAY occur only to reduce credible imminent material harm
through a warning, correction, retraction notice, or similarly narrow action.
The Project Owner MUST explicitly authorize it; the Release Editor MUST execute
it; and at least one competent reviewer for every affected substantive scope MUST
support it when available. If urgency prevents ordinary review, the record MUST
state the missing review and reason, the action MUST be minimal and reversible,
and retrospective review MUST begin immediately.

Emergency publication MUST NOT introduce new agricultural guidance, diagnosis,
recommendation, inference, or unreviewed replacement knowledge.

### Retraction

The Knowledge Board MUST recommend retraction when published knowledge has a
material integrity, scientific, evidence, rights, authority, or safety defect
that makes continued reliance inappropriate. The Project Owner MUST approve the
public retraction. The notice MUST identify the affected version, reason,
effective time, scope, evidence, decision authority, and replacement status.
The original record MUST remain preserved and clearly marked where legally and
technically permissible.

### Withdrawal

The Project Owner MAY approve withdrawal for rights, privacy, legal, security,
distribution, duplication, or other documented governance reasons. Withdrawal
MUST preserve an internal audit record and SHOULD leave an appropriate public
notice when permitted. It MUST NOT be used to conceal error, dissent, prior
publication, or misconduct. If reliability is at issue, retraction terminology
MUST be used rather than a silent withdrawal.

## Examples

- A Release Editor blocks publication because one citation changed after
  acceptance and routes the exact version back for review.
- The Project Owner authorizes one named knowledge release for one channel; the
  authorization does not permit a repository tag or package upload.
- A narrow emergency warning is published and immediately enters retrospective
  review without adding replacement advice.

These examples do not authorize an actual publication.

## Non-examples

- Publishing because the Knowledge Board accepted content.
- Letting an Author serve as the sole publication approver.
- Adding a late item during freeze without review.
- Replacing a defective public version without a correction or retraction record.
- Calling a repository commit a knowledge release.

## Reviewer Notes

Reviewers SHOULD compare content hashes or equivalent exact-version evidence
where available, confirm authorization is channel-specific, and verify that
rights and attribution gates remain distinct from scientific acceptance. Any
unclear publication authority MUST result in no publication.

## Future Work

Future work MAY define knowledge-release naming, freeze calendars, publication
checklists, and public notice templates. It MUST remain planning or governance
documentation until separately authorized and MUST NOT create a delivery system
or publication event.
