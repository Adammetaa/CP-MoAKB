# Risk Management Model

Status: Active

Version: 1.0

## Risk States

Risks may be identified, assessed, accepted, mitigated, monitored, escalated,
blocking, realized, closed, or reopened. Acceptance records residual exposure
and authority; it never means the risk disappears.

## Risk Classes

| Class | Definition, trigger, consequence, and detection | Owner/reviewer, mitigation/contingency, stop/escalation, cadence, closure, residual acceptance |
|---|---|---|
| Program | threatens mission or cross-program delivery; trigger systemic failure; consequence mission loss; gates/status evidence | Owner/PMO; replan/contain; stop major milestone; executive cadence; closure by evidence; Owner accepts eligible residual |
| Strategic | invalidates direction/value; trigger market/user/mission change; consequence wrong investment; research/roadmap evidence | Owner/PO; revise strategy; hold portfolio; strategic review; closure by renewed evidence; Owner |
| Architecture | layer, compatibility, freeze, extensibility failure; review/diff evidence | ARO; redesign/supersede; stop implementation/release; each architecture gate; ARO closure; Owner only residual after ARO concurrence |
| Knowledge | identity, provenance, lifecycle, terminology/package defect; review evidence | KO; correct/withdraw; stop use/release; Knowledge cadence; KO closure; KO/Owner as scope requires |
| Scientific | source/evidence/interpretation invalidity; scientific conflict/correction evidence | SAO; re-review/correct; stop claims/publication; scientific cadence; SAO closure; cannot be accepted by PMO/Owner alone |
| Governance | missing/ambiguous authority or gate bypass; audit evidence | owning Governance Office/Owner; restore controls; stop affected work; gate cadence; evidence of authority; Owner within protected limits |
| Product | wrong user/value/scope or unsafe workflow; validation evidence | PO; rescope/defer; stop increment; Product cadence; accepted validation; PO/Owner |
| Human Review | unqualified/unavailable/conflicted/inconsistent review; review-quality evidence | HRO; reassign/train/return; stop reviewed outputs; review cadence; qualified resolution; HRO/Owner capacity residual |
| Field Validation | biased/unsafe/unusable pilot; sample/debrief/stop evidence | FVO; revise sample/method/pause; stop pilot; each round; accepted revalidation; FVO/Owner |
| Privacy | consent, sensitive person/location exposure; incident/audit evidence | competent Privacy/Governance authority; contain/notify/minimize; immediate stop; continuous/incident; lawful closure; only authorized privacy/legal authority |
| Regulatory | noncompliance/jurisdiction/label issue; authority finding | competent regulatory/Governance authority; contain/review; stop affected use/release; milestone/incident; authority closure; not PMO-waivable |
| Implementation | incorrect behavior/security/compatibility/rollback; tests/incidents | REA; fix/disable/rollback; stop release/operation; sprint/release; verified correction; REA plus affected authority |
| Operational | support, continuity, capacity, data integrity failure; service/audit evidence | operations/REA; continuity plan/manual fallback; stop unsafe operation; operational cadence; stable evidence; Owner/REA |
| Release | wrong artifact/version/audience/readiness; release audit | RO; hold/withdraw/rollback; stop execution; every release; verified record/notification; RO/Owner |
| Publication | rights, science, privacy, irreversibility, incorrect public claim; publication audit | RO plus SAO/legal/privacy; hold/correct/withdraw; immediate stop; every candidate; published correction/withdrawal; mandatory authorities only |
| Reputation | loss of trust from unsupported claims or governance failure; complaints/findings | Owner/communications plus domain Office; transparency/correction; stop harmful communication; executive cadence; stakeholder evidence; Owner after domain concurrence |

## Program Aggregation

PMO aggregates exposure, dependencies, common causes, Critical Path impact, and
decision needs without changing class, owner, evidence, or acceptance authority.
Aggregate reporting never averages away a blocking scientific, privacy, legal,
regulatory, Design Freeze, or Publication risk.

## Minimum Risk Record

Every governed risk preserves definition, trigger, consequence, detection
evidence, accountable owner, reviewing Office, mitigation, contingency, stop
condition, escalation, cadence, closure evidence, residual-risk acceptance
authority, state, dependencies, decisions, and history. This defines semantics,
not an actual register.
