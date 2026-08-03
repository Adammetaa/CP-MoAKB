# Object Reference Model

Status: Active

## Purpose

Define permitted conceptual references without prescribing reference syntax.

## Permitted Reference Pattern

- Evidence MUST reference an exact Source version, locator, and affected Claim.
- Claim MAY reference Evidence, Authority, scope, Concepts, Relationships,
  Reviews, Decisions, and Unresolved Issues without absorbing them.
- Concept MAY reference Claims, Terminology, Relationships, Authority, Reviews,
  Decisions, Evidence, and Unresolved Issues.
- Relationship MUST reference source and target Concepts plus Evidence and scope.
- Review MUST bind to fixed Object Versions and MAY reference Findings.
- Finding MUST reference its Review and affected object responsibility.
- Decision MUST reference Reviews, Findings, responses, dissent, and authority.
- Publication Record MUST reference exact accepted versions and authorization.
- Representation MUST reference an exact Asset version.
- Package Membership MUST reference exact Asset and Package versions.

## Reference Precision

Material, review, decision, publication, audit, and reproducibility references
MUST bind to exact versions. A governed “current” relationship MAY exist only
when its moving semantics, authority, resolution time, and failure behavior are
explicit. Floating references are prohibited for accepted evidence bases,
reviews, decisions, publication contents, and package membership.

## Forbidden Patterns

Circular ownership, copied canonical objects, label-based resolution, unreviewed
inverse links, latest-wins selection, and a reference that silently changes
meaning are prohibited. Broken or ambiguous references MUST remain visible and
MUST NOT be repaired by similarity or inference.

## Future Implementation and Change Control

Resolvers, foreign keys, graph edges, links, and URI forms remain future choices.
Any mapping MUST preserve exactness and authority and requires separate review.
