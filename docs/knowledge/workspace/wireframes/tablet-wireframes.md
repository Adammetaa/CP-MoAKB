# Tablet Wireframes

**Status:** Static design blueprint
**Version:** 0.1.0

## Layout Principle

Tablet layouts use a collapsible navigation region and one primary column with contextual drawers. Drawers never contain the only copy of a warning, status, or required action.

## Dashboard and Source Candidate

```text
┌ Knowledge Lab | Role | Menu | Prototype notice ┐
│ Dashboard: My Tasks                            │
│ [task type + object + authority + next step]   │
│ Queues: Draft / Review / Revision / Acceptance │
│ Recent activity                                │
└────────────────────────────────────────────────┘

┌ Source candidate SC-FICTION-001 | Draft | v2 ┐
│ Identity and source details                   │
│ Authority classification (human supplied)     │
│ Citation, access, nomination rationale        │
│ [Governance panel ▾] [Save] [Submit]          │
└───────────────────────────────────────────────┘
```

The dashboard empty state is neutral. Missing source authority or citation information produces a blocking, textual error.

## Evidence Item and Concept Candidate

```text
┌ Evidence EV-FICTION-001 | v1 ┐
│ Parent source + exact locator │
│ Excerpt and preserved context │
│ Scope / limitations           │
│ Provenance | linked claims    │
│ [Revise] [Submit review]      │
└───────────────────────────────┘

┌ Concept CC-FICTION-001 | author revision | v3 ┐
│ Identity / terminology / ontology references  │
│ Scoped claim and evidence                      │
│ Conflict statements                            │
│ Findings drawer: 2 open                        │
│ [Compare versions] [Respond] [Resubmit]        │
└────────────────────────────────────────────────┘
```

The interface records human work; it does not infer concepts, claims, or evidence meaning.

## Review Detail and Finding Resolution

```text
┌ Review RV-FICTION-001 | fixed target v3 ┐
│ Competence declaration | COI clearance   │
│ Candidate context                         │
│ Review checklist                          │
│ [Evidence drawer] [Add finding] [Return]  │
└───────────────────────────────────────────┘

┌ Finding F-01 | major | open ┐
│ Reviewer statement + references           │
│ Author response + revision link            │
│ Reviewer verification                      │
│ [Keep open] [Resolve] [Escalate]            │
│ Preserved history                          │
└────────────────────────────────────────────┘
```

Stale versions and uncleared conflicts fail closed. Disagreement cannot be removed by collapsing its drawer.

## Acceptance Gate

```text
┌ Acceptance | CC-FICTION-001 | fixed v4 ┐
│ Gate checklist                          │
│ Review and finding disposition          │
│ Evidence and authority trace            │
│ Exceptions / recusals                    │
│ Human rationale                          │
│ [Accept] [Reject] [Return]               │
│ Notice: acceptance is not publication   │
└─────────────────────────────────────────┘
```

Missing requirements explain why decision actions are unavailable. No automatic decision or release follows.

## Accessibility, Audit, and Future Work

Touch targets, external-keyboard access, zoom, reflow, focus restoration, and screen-reader order need validation. Role changes, submissions, findings, resolutions, and decisions require future audit events under KGS. No frontend, persistence, or permission implementation is authorized. Changes remain documentation-only.
