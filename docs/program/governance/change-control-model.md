# Change Control Model

Status: Active

Version: 1.0

## Change Classes

| Class | Initiation, rationale, impact/dependencies | Review/approval and evidence/version | Rollback, communication, audit, and post-review |
|---|---|---|---|
| Editorial | document owner; accurate nonsemantic clarification | owner/documentation checks; no semantic version impact normally | revert/correct; affected readers; diff audit; verify no meaning change |
| Normal | owner; bounded nonbreaking change | owning Office, focused evidence; compatible version change | defined rollback, notes, record, focused post-review |
| Major | sponsor; material capability/authority impact | all affected Offices and Owner; full impact/gates; major version consideration | return/rollback plan, broad communication, milestone re-review |
| Breaking | owner; incompatibility unavoidable and justified | ARO/owning authority/Owner/RO; migration and compatibility evidence; breaking version | rollback or transition, consumer notice, post-release review |
| Emergency | incident authority; immediate necessity/minimal scope | expedited owning authority, retrospective mandatory review; explicit version | immediate rollback, notification, full audit; never normal shortcut or silent science change |
| Architecture | architect; durable structural decision | ARO and affected Offices; ADR when durable choice; architecture version | supersede/revert design, notify dependents, architecture review |
| Knowledge Architecture | KO; ontology/object/vocabulary/package meaning | KO/ARO/SAO as applicable; governed architecture evidence/version | supersession/migration, package impact notice, re-review |
| Knowledge Content | qualified author; term/claim/source/package change | KO/SAO and lifecycle authority; source/evidence/version | correct/deprecate/withdraw, consumer notice, scientific review |
| Scientific Correction | qualified reviewer when accepted science/content is materially wrong | SAO mandatory plus KO/RO if released; correction evidence and exact versions | correct/supersede/withdraw/recall, affected-user notice, outcome review |
| Product | PO; user/journey/scope/acceptance change | PO plus ARO/KO/SAO/FVO affected; product evidence/version | revert/rescope/defer, roadmap notice, revalidation when behavior/value changes |
| Governance | Office/Owner; authority/gate/process change | affected Offices and Owner; non-overlap/protected-boundary evidence/version | revert/supersede, program-wide notice, governance audit |
| Runtime | REA; authorized behavior/technical change | owning RAS/ARO/REA/security as applicable; tests/contracts/version | technical rollback, release notes, post-implementation validation |
| Validation | FVO; method/sample/measure/stop change | FVO/PO/HRO/SAO/privacy as applicable; method evidence/version | revert method/repeat rounds, participant notice, bias review |
| Release | RO/owner; eligibility/artifact/audience change | RO and release-type authorities; exact artifact/version/evidence | hold/withdraw/hotfix, audience notice, release review |
| Publication | content owner/RO; public artifact/status change | KO/SAO/legal/privacy/Owner/RO; rights and exact publication version | correction/withdrawal/notification/archive, publication review |
| Design Freeze Exception | sponsor; exceptional necessity against frozen boundary | explicit freeze/contract authority, ARO, affected Offices, Owner as applicable | minimal exception rollback, broad dependency notice, retrospective audit |

## Required Triggers

An ADR is required for a new durable architectural choice or material
supersession. A Scientific Correction record is required when accepted or
released scientific meaning is materially corrected. Product re-review is
required when users, value, journey, workflow, scope, visibility, acceptance, or
deferral changes. Revalidation is required when behavior, method, evidence,
assumptions, sample, safety, usability, or acceptance evidence is invalidated.

Released or published content is deprecated when discouraged but retained;
superseded when an approved replacement exists; withdrawn when use/public
availability must stop; recalled when affected recipients require active notice
and containment; and retired when governed lifecycle and obligations end.

## Emergency Boundary

Emergency Change remains exceptional, minimal, attributable, reversible where
possible, fully audited, communicated, and retrospectively reviewed. It never
becomes a shortcut and never silently changes scientific meaning, protected
contracts, Publication Boundary, or mandatory authority.
