# Term Lifecycle

## Purpose

The term lifecycle records vocabulary workflow and publication state while preserving stable concept identity, prior labels, provenance, and decisions. It does not replace the [Identifier Lifecycle](../identifiers/IDENTIFIER_LIFECYCLE.md), evidence review status, ADR status, regulatory status, or ontology versioning.

## Conceptual states

| State | Meaning |
| --- | --- |
| Draft | Proposal is being prepared and is not approved for governed use. |
| Terminology Review | Lexical clarity, label type, ambiguity, synonyms, usage, and style are under review. |
| Domain Review | Meaning, scope, category, scientific context, and domain distinctions are under qualified review. |
| Architecture Review | Boundaries with identity, ontology, evidence, regulation, and cross-domain vocabulary are under review. |
| Accepted | Required reviewers have approved the term for inclusion in a future vocabulary release. |
| Published | The accepted term is included in a governed vocabulary release. |
| Deprecated | Retained term is no longer preferred for new use; replacement/reason is shown when available. |
| Withdrawn | Term is removed from normal use because authority, consent, license, integrity, or governance basis is insufficient. |
| Rejected | Proposal was reviewed but not accepted; rationale and record are retained. |

These are conceptual governance states, not a runtime state machine. Accepted and Published do not mean scientifically proven, legally approved, safe, diagnostically confirmed, or recommended.

## Transition requirements

Every transition MUST record:

- term/concept reference and prior/new state;
- actor/reviewer role and authority;
- decision date and applicable validity date;
- rationale, evidence, source/version, and review comments;
- language/script and regional scope affected;
- unresolved conflicts, exceptions, and limitations;
- related change request and affected labels/definitions/mappings;
- release impact and migration guidance where applicable; and
- rollback, restoration, deprecation, or supersession relationship.

Transitions return to Draft when material meaning, evidence, language, or scope changes during review. Publication requires the release gates in [Release Policy](RELEASE_POLICY.md). Rejection and withdrawal MUST NOT erase the proposal or permit reuse of its concept identifier.

## Relationship to concept identity

A label can move through lifecycle states while the concept identifier remains stable. A materially changed referent or concept boundary triggers identity review and may require a new identifier; term governance MUST NOT decide that silently. Merges and splits therefore require both vocabulary change governance and identifier/ontology review.

Deprecated, historical, obsolete, withdrawn, or rejected terms SHOULD remain discoverable for audit and migration under appropriate access controls. They MUST be clearly marked so interfaces do not present them as current preferred labels.

## Restoration

Restoration reactivates a deprecated or withdrawn term only after the cause, sources, conflicts, intervening releases, and downstream impacts are reviewed. Restoration creates a new attributed lifecycle event; it does not delete the earlier deprecation/withdrawal history or imply that the former decision was invalid at its time.
