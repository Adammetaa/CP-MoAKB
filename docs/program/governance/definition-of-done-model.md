# Definition of Done Model

Status: Active

Version: 1.0

## Interpretation

Done is domain- and purpose-specific evidence, not a universal status. Every DoD
records exact versions, provenance, reviews, approvals, permissible unresolved
conditions, blocking unresolved conditions, and rollback/return expectations.

## Definitions of Done

| DoD | Acceptance evidence, artifacts, reviews, and approvals | Unresolved conditions and provenance/version/rollback | Does not imply |
|---|---|---|---|
| Architecture Done | accepted architecture family, boundary review, ADR where required; ARO plus mandatory domain concurrence | future implementation details may remain; no layer/freeze conflict; sources/versions/history; return or supersede | Implementation Ready or scientific truth |
| Knowledge Architecture Done | approved ontology/object/vocabulary/package structure; KO/ARO/SAO as applicable | content population may remain; no identity/authority ambiguity; versioned rationale; rollback by supersession | Knowledge Content Done |
| Knowledge Content Done | exact sources, evidence, terms/claims, reviews, lifecycle decision; KO/SAO approval | disclosed noncritical gaps allowed; missing authority/rights prohibited; package version/provenance; withdraw/supersede | publication eligibility or case Diagnosis |
| Product Done | accepted purpose, users, journey, scope, dependencies, acceptance/deferral; PO and mandatory Offices | future extensions allowed; unresolved safety/science/readiness prohibited; versioned decisions; return scope | implementation or market readiness |
| Governance Done | authority, gates, risks, dependencies, privacy/regulatory/review operations evidenced; owning Offices concur | named residual conditions allowed; missing mandatory authority prohibited; decision versions/audit; hold/return | waiver of domain governance |
| Implementation Done | behavior matches approved contracts, focused validation/tests, security and rollback evidence; REA/ARO as required | known nonrelease limitations disclosed; contract failure prohibited; build/version provenance; technical rollback | Release Ready |
| Validation Done | approved method executed, sample/limits, success/failure/stops/debrief evidence; FVO/PO/reviewers | honest inconclusive findings allowed; boundary/data-integrity failures unresolved are prohibited; versioned records; repeat/rollback | scientific proof or Production Ready |
| Pilot Done | all approved rounds/exits, participant/reviewer evidence, unresolved-case honesty, stop closure; FVO/Owner | disclosed residual pilot risk allowed; open mandatory stop prohibited; pilot version/audit; pause/reopen | Production Ready |
| Release Done | exact approved artifact executed for declared release type, notes/limits/rollback/notification; RO | disclosed accepted risks allowed; missing concurrence prohibited; immutable release record; withdraw/hotfix | another release type or Publication |
| Publication Done | exact artifact published by authorized executor after scientific/rights/privacy/Owner concurrence | only disclosed acceptable limitations; missing legal/scientific authority prohibited; publication version/archive; correct/withdraw | universal truth or production approval |
| Program Milestone Done | milestone evidence, dependent DoDs/gates, risk/dependency disposition, Owner decision | deferred scope and accepted residual risks documented; open blocking dependency prohibited; milestone baseline; reopen/supersede | Program Done |
| Program Done | mission closure/transition evidence, all material obligations, operation/learning/retention/ownership, Owner and Office concurrence | continued Operation/Learning may remain assigned; unresolved legal/safety/publication duties prohibited; final baseline/archive; reopen evolution | end of knowledge lifecycle or removal of obligations |

## Separation Rules

Implementation Done does not imply Release Ready. Validation Done does not imply
scientific proof. Pilot Done does not imply Production Ready. Knowledge Content
Done does not imply publication eligibility. Program Done must provide continued
Operation and Learning where relevant.
