# Revision and Comparison Model

**Status:** Design blueprint
**Version:** 0.1.0

## Purpose

Describe how a future Knowledge Lab could make human-authored revisions understandable and comparable.

## Scope and Authority

The design covers candidate and evidence revision presentation. KAS defines authoring standards, KGS defines review authority, and ADR-009 remains authoritative for canonical candidate record format. This document defines no schema.

## Out of Scope

Version-control algorithms, persistence, merging, canonical record changes, automated reconciliation, and Runtime behavior are excluded.

## Audience and User Goals

Authors need to explain changes; reviewers need to verify responses; editors need to see the version presented for decision. Every view should identify the compared versions, responsible human, reason for change, and related findings.

The comparison presents the current candidate version, prior version, changed
sections, author change summary, reviewer-requested changes, accepted changes,
rejected changes, unresolved changes, superseded versions, and any governed
rollback reference. A rollback reference identifies history only; it is not an
implementation command or automatic reversion.

## Conceptual Actions

- Select two fixed versions for comparison.
- View additions, removals, unchanged context, evidence-link changes, terminology changes, and an author-supplied revision note.
- Link a change to a finding response and request another revision.

## Prohibited Actions

The interface must not overwrite prior versions, silently merge disagreements, treat the latest version as accepted, rewrite evidence, or infer the meaning of a change.

## Workflow, Empty States, and Failures

An author submits a revision with a rationale; a reviewer compares it with the reviewed version; the decision cites an immutable comparison pair. A first version has an explicit “no earlier version” state. Missing versions, incomplete comparisons, and stale review targets block decision presentation and direct the user to human resolution.

## Accessibility

Differences require textual labels in addition to color. A linear reading mode, keyboard access, and summaries of changed regions are future requirements.

## Governance and Audit Requirements

The audit view must preserve version identifiers, comparison selection, revision rationale, finding linkage, and reviewer verification. Revision never erases conflict or prior evidence.

## Examples and Non-examples

Example: version 2 narrows a fictional claim and records the reviewer finding it answers. Non-example: the interface combines two incompatible claims and calls the result consensus.

## Future Implementation Considerations

Implementation mapping belongs to a later authorized sprint and must adopt, not redefine, governed identity and record authorities.

## Change Control

Documentation-only changes require review against ADR-009, KAS, and KGS.
