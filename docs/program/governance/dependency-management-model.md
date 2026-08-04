# Dependency Management Model

Status: Active

Version: 1.0

## Dependency Categories

Vision, Architecture, Knowledge Architecture, Knowledge Content, Scientific
Authority, Governance, Product, Human Capability, Field Operations, Privacy,
Regulatory, Runtime, Validation, Release, and Publication dependencies are distinct.

## Required Declaration

Every Initiative, Epic, and Sprint declares upstream and downstream dependencies;
blocking, non-blocking, optional, and external dependencies; assumptions;
readiness evidence; dependency owner; and review status. A reference to another
artifact is not proof of readiness.

## Dependency States

| State | Meaning |
|---|---|
| identified | dependency is named but not yet assessed |
| unverified | asserted basis has not received required review |
| planned | owner, expected evidence, and sequencing are accepted |
| ready | owning authority accepted exact evidence for stated use |
| partially ready | bounded portion is ready and remaining limits are explicit |
| blocked | work cannot safely proceed for affected scope |
| waived | only a waivable dependency was waived by its explicit authority with rationale |
| obsolete | no longer applicable, with reviewed impact |
| superseded | replaced by an explicit approved dependency and preserved history |

Mandatory scientific, privacy, legal, regulatory, Design Freeze, and Publication
dependencies cannot be waived by schedule authority.

## PMO Coordination

PMO maintains the Dependency Map, solicits owner evidence, exposes Critical Path
effects, schedules reviews, records changes, and prepares Owner decisions. PMO
does not mark a domain dependency ready without the owning Office’s decision.
“Planned” and “partially ready” are never displayed as “ready.”

## Conflict and Escalation

Conflicting dependencies first return to their owners with exact evidence and
affected scope. Cross-domain owners meet in the relevant Office forum. PMO
records schedule consequences. ARO handles architecture conflict; SAO scientific
conflict; privacy/regulatory authorities protected matters; Owner resolves
priority/resource choices only after mandatory authority. Work stops when a
blocking conflict affects safety, legality, science, Design Freeze, or Publication.

## Parallel Work

Parallel work is allowed when its assumptions, isolation boundary, handoff,
blocking evidence, and rollback are explicit. A downstream workstream may draft
against an unverified dependency but cannot claim validation, acceptance, or
release readiness until the dependency becomes ready.

## Review and Change

Dependency review occurs at Sprint, Critical Path, gate, risk, and roadmap
reviews. State changes preserve who decided, evidence version, affected
deliverables, downstream notification, and whether re-review or revalidation is required.
