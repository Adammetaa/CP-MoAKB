# Program Stage-Gate Model

Status: Active

Version: 1.0

## Gate Outcomes

Permissible outcomes are Pass, Pass with documented condition, Return for
revision, Hold, Stop, Reject, and Supersede. A conditional Pass identifies owner,
due evidence, affected scope, and stop consequence; it never waives missing
mandatory authority.

## Permanent Gates

| Gate | Objective, evidence, and artifacts | Office, reviewers, blockers, and exit | Outcomes, Owner, return/rollback, and audit |
|---|---|---|---|
| Vision Ready | confirm mission, users, principles, boundaries; Charter, purpose, strategic evidence | Owner accountable; PO/ARO/KO/SAO/PMO mandatory; block ambiguity or protected conflict; exit accepted direction | all outcomes; Owner approval; return to Vision; audit alternatives and concurrence |
| Architecture Ready | establish coherent implementation-neutral structure; architecture family, ADRs where needed, boundary review | ARO; KO/PO/SAO/REA affected; block layer collapse, freeze conflict, unresolved authority; exit ARO acceptance | Owner only for major milestone; return architecture; preserve review record |
| Knowledge Ready | ensure governed architecture/content/source/evidence/provenance; packages and reviews | KO; SAO/ARO/privacy as applicable; block unreviewed content, rights, science; exit scoped readiness | Owner cannot waive; return authoring/review or stop; audit exact versions |
| Product Ready | establish users, journey, scope, acceptance, deferral, dependencies; product definitions | PO; ARO/KO/SAO/HRO/FVO/PMO; block science override, oversized/untestable scope; exit product acceptance | Owner milestone approval; return scope; audit evidence and exclusions |
| Governance Ready | confirm offices, authority, privacy/regulatory, review operations, risks, decisions | PMO coordinates; owning Offices mandatory; block missing authority/reviewer/controls; exit all required concurrences | Owner proceeds only after concurrence; hold/return; audit assignments |
| Implementation Ready | authorize bounded build from approved inputs; baselines, contracts, change class, tests/rollback plan | REA accountable; ARO/PO/KO/security; block unclear semantics, freeze, missing dependencies; exit implementation authorization | Owner resource approval as needed; return definitions; audit baseline |
| Validation Ready | establish method, sample, participants, measures, stops, consent; validation plan | FVO; PO/HRO/SAO/privacy/PMO; block unsafe/unrepresentative/unreviewable pilot; exit start approval | Owner pilot approval; return plan/readiness; audit sample and limits |
| Release Ready | establish exact artifact eligibility, versions, evidence, limits, rollback; release record draft | RO; all release-type mandatory Offices; block unresolved mandatory risk/gates/rights; exit execution authorization | Owner where required; return owning gate; audit artifact/checksums/decisions |
| Production Ready | confirm operational, product, technical, scientific, privacy/regulatory, support, rollback readiness | Owner accountable; RO/REA/PO/ARO/KO/SAO/HRO/FVO mandatory as applicable | no bypass; hold/stop/return to affected gate; audit residual risk and concurrence |
| Learning Review Ready | route operational/field learning as candidates; provenance, outcome, debrief, nomination | owning Knowledge/Product/Architecture Office; SAO/HRO/FVO as applicable; block raw-case promotion; exit accepted review candidate | Owner not required for routine nomination; return/hold/reject; audit source and no-promotion |

## Non-bypass Rule

No gate is skipped because implementation is complete, a deadline is near, a
demo is requested, a source appears credible, a reviewer is unavailable, speed
is preferred, or a model output appears accurate. Scientific, privacy, legal,
regulatory, Design Freeze, Human Review, and Publication requirements remain mandatory.
