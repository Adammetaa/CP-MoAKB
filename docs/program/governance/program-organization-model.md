# Program Organization Model

Status: Active

Version: 1.0

## Interpretation

Program, Portfolio, Initiative, Capability, Epic, Sprint, and Deliverable are
governance and planning abstractions. They do not imply Jira hierarchy, software
modules, code ownership, deployment architecture, repository folders, or
one-to-one teams.

## Permanent Hierarchy

| Level | Definition, purpose, and boundaries | Ownership, office, lifecycle, and relationships | Review, completion, change, and extension |
|---|---|---|---|
| Program | enduring governed mission for CP-MoAKB; includes all portfolios and permanent principles; excludes a single product/release | Program Owner; cross-office governance; Vision through evolution; upstream mission/authority, downstream Portfolios | Executive and all affected Office review; complete only under Program DoD; major control for mission change; may add portfolios |
| Portfolio | coherent set of related Initiatives serving strategic outcomes; excludes operational team grouping | delegated Portfolio owner; PMO coordination and affected Offices; proposed/active/held/closed; upstream Program, downstream Initiatives | strategic/architecture/product/risk review; complete when outcomes and residual work disposed; roadmap change control; extensible by governed domain |
| Initiative | bounded outcome requiring coordinated capabilities; excludes implementation backlog | accountable Initiative owner; PMO plus domain Office; proposed through accepted/closed; upstream Portfolio, downstream Capabilities | gate evidence and Office concurrence; complete when outcome acceptance and dependencies close; major change review; may span releases |
| Capability | user, governance, knowledge, or operational ability; excludes screen/service identity | Capability owner; owning domain Office; candidate/defined/validated/retired; upstream Initiative, downstream Epics | architecture/product/knowledge review as applicable; complete by domain DoD; semantic change control; implementation-neutral extension |
| Epic | bounded body of outcome-oriented work delivering part of a Capability; excludes software-only container | Epic owner; owning Office with PMO sequencing; planned/active/accepted/closed; upstream Capability, downstream Sprints/Deliverables | dependency/readiness review; complete when intended evidence accepted; normal/major change based on impact; may mix disciplines |
| Sprint | time-bounded governed work scope producing reviewable Deliverables; excludes automatic release unit | Sprint owner; relevant Office and PMO; authorized/active/reviewed/closed; upstream Epic, downstream Deliverables | baseline/scope/validation review; complete when sprint objective and report accepted; scope changes classified; no fixed team implication |
| Deliverable | exact reviewable artifact or bounded result; excludes approval merely by existence | named author/owner; one or more accountable Offices; draft/review/accepted/rejected/superseded/retired; upstream Sprint/Epic, downstream consumers | all applicable domain reviews; complete by artifact DoD; versioned change control; reusable across Initiatives where governed |

## Milestones

A Milestone is an evidence-based Program or Portfolio decision point spanning
one or more hierarchy levels. It aggregates accepted Deliverables, gate results,
dependencies, risks, and residual conditions; it is not another parent level or
a date-only promise. Milestone achievement requires its own review record.

## Multiple Governance Reviews

A Deliverable may require Architecture, Knowledge, Scientific, Product, Privacy,
Human Review, Validation, Runtime, and Release reviews. The review plan names
advisory reviews, mandatory concurrences, final accountability, and execution
authority separately. Multiple reviews do not create shared ambiguous approval:
each Office decides only its domain and unresolved mandatory concurrence blocks completion.

## Completion and History

Closure preserves unfinished dependencies, rejected interpretations,
supersession, residual risks, versions, and downstream impact. Reuse in another
Initiative does not transfer acceptance beyond the original reviewed purpose.
