# Desktop Wireframes

**Status:** Static design blueprint
**Version:** 0.1.0

## Layout Principle

Desktop layouts use a persistent navigation rail, contextual main region, and optional governance panel. A prototype notice and active-role indicator remain visible. Thai-first labels are anticipated; governed English scientific terms remain available without forced translation.

## Dashboard

```text
┌ Knowledge Lab — future workspace ─ Role: [Author] ─ Prototype notice ┐
│ Nav: My Tasks | Queues | Candidates | Reviews | Governance | Audit   │
├──────────────────────────────────────┬─────────────────────────────────┤
│ My tasks                             │ Queue health (descriptive only) │
│ [type] [object] [human priority]     │ Drafts / review / revision      │
│ [authority] [expected action]        │ No automated score or ranking   │
├──────────────────────────────────────┴─────────────────────────────────┤
│ Recent governed activity — actor, role, event, object version, time   │
└────────────────────────────────────────────────────────────────────────┘
```

Empty tasks state: “No assigned tasks are recorded.” It does not assert that no work exists.

## Source Candidate

```text
┌ Source candidate SC-FICTION-001 — Draft — version 2 ────────────────┐
│ Identity & source type | authority classification | nomination note │
│ Official-source check  | access/citation details  | COI declaration │
├──────────────────────────────────────┬────────────────────────────────┤
│ Candidate details                    │ Governance warnings             │
│ Human-authored rationale             │ Source authority: ADR-008       │
│ Related evidence extractions         │ [Save draft] [Submit for review]│
└──────────────────────────────────────┴────────────────────────────────┘
```

Missing authority or citation details block submission presentation; the interface does not classify the source automatically.

## Evidence Item

```text
┌ Evidence item EV-FICTION-001 — extracted — version 1 ──────────────┐
│ Parent source | exact locator | language | extractor | timestamp    │
├──────────────────────────────────────┬────────────────────────────────┤
│ Verbatim excerpt / faithful record   │ Scope and limitations           │
│ [preserved context]                  │ Supports / conflicts / unclear  │
│                                      │ Human assessment only           │
├──────────────────────────────────────┴────────────────────────────────┤
│ Provenance chain | linked claims | [Revise] [Submit evidence review] │
└───────────────────────────────────────────────────────────────────────┘
```

Unavailable source context is an explicit error; it never becomes invented evidence.

## Concept Candidate

```text
┌ Concept candidate CC-FICTION-001 — in author revision — version 3 ┐
│ Identity proposal | terminology authority | ontology reference      │
│ Scoped human-authored claim | linked evidence | conflict statements │
├──────────────────────────────────────┬────────────────────────────────┤
│ Candidate record aligned to ADR-009  │ Findings requiring response    │
│ (presentation, not schema)           │ F-01 scope / F-02 terminology   │
│ [Compare v2 ↔ v3]                    │ [Respond] [Resubmit]             │
└──────────────────────────────────────┴────────────────────────────────┘
```

The view must not generate a label, relationship, or claim.

## Review Detail

```text
┌ Review RV-FICTION-001 — assigned — fixed target: CC-… version 3 ───┐
│ Reviewer competence | COI: declared/cleared | authority | due note  │
├──────────────────────────────────────┬────────────────────────────────┤
│ Candidate + evidence context         │ Review checklist                │
│ Version cannot drift during review   │ Evidence / terms / ontology     │
│                                      │ [Add finding] [Return review]   │
└──────────────────────────────────────┴────────────────────────────────┘
```

An uncleared conflict or stale target version blocks review completion.

## Finding Resolution

```text
┌ Finding F-01 — major scope issue — open ────────────────────────────┐
│ Raised against CC-… version 3 | reviewer rationale | evidence links │
├──────────────────────────────────────┬────────────────────────────────┤
│ Author response + revision reference │ Reviewer verification          │
│ Disagree / revise / clarify           │ resolved / remains / escalate  │
├──────────────────────────────────────┴────────────────────────────────┤
│ Preserved discussion and audit history — no silent overwrite         │
└───────────────────────────────────────────────────────────────────────┘
```

Disagreement remains visible and follows KGS escalation; inactivity does not resolve it.

## Acceptance Gate

```text
┌ Acceptance gate — candidate CC-… fixed version 4 ──────────────────┐
│ Reviews complete? | findings disposition | COI | authority | audit  │
│ Evidence traceable? | terminology/ontology review | exceptions      │
├──────────────────────────────────────┬────────────────────────────────┤
│ Decision summary and rationale        │ [Accept] [Reject] [Return]     │
│ Authorized human decision only        │ Separate from publication      │
└──────────────────────────────────────┴────────────────────────────────┘
```

Acceptance never publishes; unresolved blockers make decision actions unavailable with textual reasons.

## Accessibility, Governance, and Change Control

Landmarks, headings, semantic tables, keyboard order, visible focus, zoom, and text alternatives are required future considerations. Every consequential action must cite authority and become auditable. This file is documentation-only and may not change governed behavior.
