# Source Intake Workflow

Status: Active
Version: 1.0

## Purpose
Establish a traceable source candidate before evidence review.

## Scope
Human nomination, identity, status, authority scope, and rights screening.

## Out of Scope
Intake MUST NOT accept evidence, rank truth, copy a work, or authorize redistribution.

## Authority
This workflow is subordinate to the [handbook](../knowledge-editorial-handbook.md),
[KAS-003](../../KAS-003-evidence-standard.md), [KAS-004](../../KAS-004-citation-standard.md),
and [Source Policy](../../../SOURCE_POLICY.md).

## Definitions
**Source candidate** means a nominated work; **authority** means claim-scoped
authority, not universal truth; **redistribution status** means verified permission.

## Responsibilities
The Author nominates; Evidence Reviewer verifies identity and relevance; rights
review verifies permissions; Domain Editor assigns scope. No role MAY infer rights.

## Procedure
1. Assign a candidate identity independent of title or URL.
2. Record title, personal author where stated, institutional author, publisher,
   authority, version, publication date, retrieval date, official URL, checksum,
   language, jurisdiction, and access status.
3. Record redistribution, replacement, supersession, correction, and retraction
   statuses explicitly, including unknown.
4. Classify as official government publication, official authority publication,
   standard or specification, peer-reviewed journal article, book, technical
   manual, dataset, database, conference material, thesis, field observation,
   expert opinion, or unpublished material.
5. Verify identity against the nominated work and authority scope against ADR-008.
6. Complete explicit rights and redistribution review.
7. Route eligible material to evidence extraction; keep unknown redistribution a
   blocker for publication of the original document.

## Required Inputs
Nomination, accessible identity evidence, intended claim scope, and nominator role.

## Required Outputs
Source-candidate record, type, status findings, rights disposition, reviewer,
open issues, and decision. This list MUST NOT be treated as a schema.

## Review Points
Identity, official location, version, jurisdiction, authority scope, integrity,
correction/retraction status, access, and redistribution MUST each be reviewed.

## Failure Modes
Title-as-identity, stale version, unofficial mirror, missing retrieval evidence,
authority overreach, inferred permission, and treating intake as acceptance.

## Examples
A fictional circular with verified identity but unknown redistribution MAY enter
as a candidate while its original file remains blocked from publication.

## Non-examples
A URL alone, or an uploaded file assumed reusable because it is accessible, MUST
NOT pass intake.

## Escalation
Identity or evidence questions go to the Evidence Reviewer; authority disputes to
governance; rights uncertainty to the competent rights-review path.

## Audit Requirements
Preserve nomination, checks, checksum where lawful, findings, decisions, dates,
roles, and replacement or retraction history.

## Change Control
Material workflow changes require KAS/KGS and Source Policy impact review.

## Future Considerations
Future tooling MAY assist recordkeeping but MUST NOT decide identity, rights, or truth.
