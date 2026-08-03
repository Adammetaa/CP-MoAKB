# Delivery Increment Model

Status: Active

Version: 1.0

## Definition

A Delivery Increment is a bounded, reviewable, operational product slice that
creates user value, preserves all governed boundaries, and can be validated
independently without requiring the complete future platform.

## Required Account

Every increment defines:

- objective and user value;
- included and excluded capabilities;
- required knowledge assets and Human Review capability;
- upstream and downstream dependencies;
- minimum operational readiness;
- observable validation evidence;
- success and failure criteria;
- mandatory stop conditions;
- conceptual rollback expectations;
- unresolved risks; and
- prerequisites for expansion.

These responsibilities do not imply fields, tickets, services, screens, or deployments.

## Delivery Gates

| Gate | Required evidence before proceeding |
|---|---|
| A — Architecture readiness | approved dependencies; layer boundaries preserved; no automatic inference, ranking, or workflow |
| B — Knowledge readiness | required vocabulary/content approved with authority and provenance; no unreviewed production content |
| C — Human readiness | trained SPA; available qualified reviewer; role authority understood and conflicts addressed |
| D — Field readiness | approved case sample; consent/privacy/location handling; safe field operation and practical follow-up |
| E — Validation readiness | observable success/failure evidence, stop conditions, collection responsibilities, and debrief process ready |
| F — Expansion readiness | prior increment validated; critical issues resolved; remaining risk explicitly accepted by Owner |

No gate is satisfied solely by implementation completion. Failed or unknown
readiness remains explicit.

## Independent Validation

Increment A can close or refer cases without B. Increment B consumes reviewable
A packages but may return them rather than force a finding. Increment C consumes
reviewed or explicitly unresolved outputs but never rewrites A or B history.
Each increment has its own user value, stop conditions, and rollback boundary.

## Expansion Rule

Expansion requires validated value, acceptable burden, preserved provenance,
available review capacity, resolved critical boundary failures, and Owner
approval. Success counts alone do not authorize expansion.
