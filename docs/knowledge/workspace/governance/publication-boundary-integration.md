# Publication Boundary Integration

**Status:** Design blueprint
**Version:** 0.1.0

## Purpose

Keep authoring, review, acceptance, release preparation, publication, and public exploration visibly separate.

## Scope and Authority

This blueprint maps interface concepts to the existing Publication Boundary and KGS-005. It grants no publication authority and changes no release process.

## Out of Scope

Deployment, publishing systems, package release, public APIs, repository automation, release artifacts, and production operation are excluded.

## Audience and User Goals

Authors and reviewers need to know that submission or acceptance is not publication. Release editors need to see approved scope and unresolved blockers. Public Explorer users must receive only content that has crossed the separately governed publication boundary.

## Conceptual Stages

1. **Working draft:** private authoring state with no public claim.
2. **Submitted candidate:** ready for governed review, not accepted.
3. **Reviewed candidate:** findings and decisions recorded, not necessarily accepted.
4. **Accepted knowledge candidate:** accepted by authorized humans, still not published.
5. **Release candidate:** assembled under a knowledge freeze and version approval process.
6. **Published knowledge:** released only by KGS publication authority through a separately implemented process.
7. **Explorer presentation:** read-side view of published material, not the source of authority.

## Conceptual Actions

Authorized future users may prepare a release set, inspect gates, record approval references, withdraw an item before publication, and hand a release candidate to a separate publication process.

## Prohibited Actions

The Lab must not publish directly, equate acceptance with release, expose drafts through the Explorer, bypass freeze or version approval, or claim a deployment occurred.
It offers no Git push, tag creation, GitHub Release creation, package publication,
or public data publication action. Each remains outside the Lab and requires its
separately governed authority and process.

## Workflow, Empty States, and Failures

An accepted item enters release preparation only after explicit selection. Empty releases are drafts, not publications. Unresolved findings, missing authority, inconsistent versions, withdrawal, or freeze violations block handoff and remain visible.

## Accessibility

Every stage and blocker needs plain-language text, not color-only badges. Consequential handoffs require accessible review and confirmation.

## Governance and Audit Requirements

Selection, exclusion, freeze, approval, handoff, retraction, withdrawal, and publication references must be auditable under KGS-005 and KGS-006.

## Examples and Non-examples

Example: an accepted fictional candidate waits in a release-preparation queue. Non-example: clicking “accept” makes it visible in Knowledge Explorer.

## Future Implementation Considerations

Publication adapters and deployment remain separate future architecture work requiring explicit authorization.

## Change Control

Updates must preserve the Publication Boundary and cannot revise KGS authority.
