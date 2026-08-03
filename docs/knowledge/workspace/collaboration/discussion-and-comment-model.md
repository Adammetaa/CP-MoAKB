# Discussion and Comment Model

**Status:** Design blueprint
**Version:** 0.1.0

## Purpose

Define a future, human-governed discussion model for the Knowledge Lab without implementing messaging, storage, or workflow automation.

## Scope

The model covers contextual discussion attached to a candidate, evidence item, review, finding, or decision. It is subordinate to the Knowledge Constitution, KAS, and KGS.

## Out of Scope

Chat, real-time collaboration, notification delivery, database design, access-control implementation, and automatic decisions are out of scope.

## Authority and Audience

Comments provide context; they never constitute acceptance, publication approval, scientific authority, or a governance decision. Authors, reviewers, editors, and governance participants are the intended future audiences, subject to their governed roles.

## Information and User Goals

A discussion should show its parent object, author role, timestamp, message, visibility label, resolution state, and links to related findings or revisions. Users should be able to understand why a question was asked and how it was resolved.

The presentation must distinguish editorial discussion, a scientific finding, a
governance decision, and a publication decision. Supported collaboration records
include comments, threaded discussion, requested changes, reviewer questions,
author responses, mentions, handoff notes, dissent notes, resolution notes,
internal editorial notes, and publication-facing notes. Each record carries its
own audience and authority label.

## Conceptual Actions

- Start a scoped thread, reply, request clarification, link a finding, and mark a discussion resolved or reopened.
- Mention an authorized participant, record a requested change, and add a scoped
  handoff, dissent, resolution, editorial, or publication-facing note.
- Preserve the original record when a clarification changes.
- Distinguish informal discussion from normative review findings and formal decisions.

## Prohibited Actions

The future interface must not silently edit comments, convert consensus into approval, infer agreement from inactivity, expose restricted discussion, or diagnose or recommend from discussion content.

## Workflow and Failure Modes

Discussion begins in context, receives human replies, and may be resolved with a recorded rationale. Missing context, unavailable participants, conflicting visibility, and a deleted parent object must produce explicit non-destructive states. An empty thread should invite an authorized user to ask a scoped question without implying that review is complete.

## Accessibility

Thread order, nesting, author role, and resolution state must be conveyed in text and not by color alone. Keyboard navigation and readable timestamps are required future considerations.

## Governance and Audit Requirements

Discussion history, visibility changes, resolution, reopening, and links to formal decisions must remain auditable. Retention follows KGS authority; this blueprint grants no deletion power.

## Examples and Non-examples

Example: a reviewer asks which excerpt supports a narrowly framed fictional claim. Non-example: a comment marked “looks good” automatically accepts the candidate.

## Future Implementation Considerations

Any implementation requires separately governed identity, permissions, retention, and accessibility decisions. No implementation is authorized here.

## Change Control

Changes to this model require documentation review and must not amend the Constitution, KAS, KGS, ADR, or RAS by implication.
