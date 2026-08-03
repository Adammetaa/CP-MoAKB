# Knowledge Explorer and Knowledge Lab Boundary

Status: Active blueprint
Version: 1.0

## Purpose
Keep unpublished authoring/review material separate from approved public knowledge.
## Scope
Conceptual movement from Lab candidates to Explorer publication.
## Out of Scope
No deployment, API, synchronization, database, or publication implementation is defined.
## Authority
Subordinate to the [primary blueprint](../knowledge-workspace-blueprint.md), KGS-005/006, and Publication Boundary.
## Audience
Authors, reviewers, release roles, product teams, and public-experience designers.
## Definitions
**Lab material** includes draft, rejected, deferred, confidential discussion, and
unpublished decisions. **Explorer material** is explicitly authorized public knowledge.
Explorer is the read side; Lab is the write/review side.
## Information Shown
Lab shows unresolved issues, findings, revisions, competence, unpublished and
rejected material. Explorer shows approved public knowledge with evidence and authority traceability.
## Actions
Lab MAY assemble a fixed release package. Only separately authorized publication
may create an Explorer-visible version.
## Prohibited Actions
Explorer MUST NOT display candidates as published; confidential draft discussion
MUST NOT be public by default; Lab MUST NOT publish automatically.
## Workflow
Accepted version → readiness review → separate authorization → verified publication event → Explorer presentation.
## Failure Modes
Candidate badge omitted, rejected content indexed publicly, or package assembly treated as publication.
## Empty States
Explorer absence MUST NOT imply rejection; Lab absence MUST NOT imply published status.
## Accessibility
Boundary notices require explicit text such as “Candidate—not published” and “Public approved version.”
## Governance Boundaries
Only exact authorized content, evidence/authority traceability, permissible rights,
and public-facing notes may move. Internal comments move only under explicit reviewed authority.
## Audit Requirements
Retain source Lab version, acceptance, readiness, authorization, publication event, public version, and withdrawal history.
## Examples
A fictional accepted candidate remains Lab-only after publication authorization is denied.
## Non-examples
Merging a change set into a repository MUST NOT populate Explorer.
## Future Implementation Considerations
Any transfer mechanism requires separate security, privacy, rights, ADR/RAS, and release review.
## Change Control
Boundary changes require KGS-005/006 and Publication Boundary approval.
