# Decision Authority Model

Status: Active

Version: 1.0

## Authority Roles

**Author** prepares the proposal. **Reviewer** supplies advisory or mandatory
domain review. **Required approver** gives mandatory concurrence or final
accountability. **Executor** performs an authorized release/publication action.
These roles remain distinct. Any listed mandatory Office may reject or return
within its domain; PMO may escalate but not approve the domain.

## Decision Matrix

| Decision | Author / reviewers | Required approval and optional consultation | Reject, return, escalate, execute | Required evidence and prohibited shortcuts |
|---|---|---|---|---|
| Program Vision | Owner/PMO; all Offices review | Owner final, mandatory protected-domain concurrence; stakeholders consulted | affected Office rejects/returns; PMO escalates; no executor | Charter, impact, principles; no schedule bypass |
| Architecture | ARO/architect; affected Offices | ARO mandatory; Owner for major cross-program choice | ARO rejects/returns; conflict escalates; no release execution | alternatives, boundaries, ADR where required; no implementation-first approval |
| Knowledge Architecture | KO; ARO/SAO | KO and ARO, SAO where scientific meaning | any mandatory Office rejects/returns; Owner escalation cannot waive | authority/ontology impact; no content convenience shortcut |
| Knowledge Content | qualified author; KO/SAO | KO plus SAO scientific concurrence as applicable | KO/SAO reject/return; RO executes Knowledge Release later | sources, evidence, provenance, reviews; no pilot promotion |
| Scientific Interpretation | qualified scientist; SAO/peers | SAO | SAO rejects/returns; scientific conflict escalation | exact evidence/method/limits; no Product vote |
| Product Vision | PO; ARO/KO/SAO/FVO | PO, Owner for major direction; mandatory domain concurrence | PO/domain rejects/returns; PMO escalates | user evidence, boundaries, deferral; no science override |
| MVP Scope | PO; ARO/KO/HRO/FVO/PMO | PO and Owner; mandatory readiness concurrence | reviewers return/hold; Owner cannot waive protected gap | value, dependencies, acceptance, risks; no feature pressure |
| Delivery Increment | PO/PMO; affected Offices | PO; Owner expansion; gate concurrence | Office rejects/returns; PMO escalates | prior validation, readiness, stop status; no build-complete shortcut |
| Runtime Change | REA; ARO/tests/security | REA within approved scope; ARO for architecture impact | REA/ARO return; RO executes release only later | classified change/tests/contracts/rollback; no hidden behavior |
| Design Freeze Exception | proposer; ARO/owning RAS/REA | explicit authorized freeze authority and Owner where applicable | ARO/contract owner rejects; escalation cannot waive contract | necessity, minimal scope, compatibility, rollback; never implicit |
| Pilot Start | FVO/PO; HRO/KO/SAO/privacy/PMO | FVO and Owner with all mandatory readiness | any mandatory Office stops/returns; FVO coordinates execution | sample, consent, reviewers, stops, readiness; no demo shortcut |
| Pilot Pause | FVO or any stop owner; affected Offices | FVO may pause immediately; Owner notified | no rejection of safety pause; escalate resolution | stop evidence, affected cases, containment |
| Pilot Stop | FVO/Governance/Owner; all affected | FVO/Owner according to severity; protected authority controls | Owner cannot overrule legal/safety authority | repeated/critical failure evidence, notifications, audit |
| Investigation Review | case author; HRO-assigned reviewer/SAO as needed | identifiable qualified reviewer for bounded finding | reviewer rejects/returns/marks unresolved/escalates | case/evidence/rationale/provenance; no timeout approval |
| Knowledge Release | KO; SAO/ARO/RO | KO and required SAO; RO eligibility/execution | mandatory Office rejects/returns; RO executes | package/version/reviews/limits; no Product-release implication |
| Internal Release | REA/PO; ARO/security/RO | owning authorities and RO | RO/mandatory Office returns; RO executes | audience, tests, risks, rollback; no production use |
| Production Release | PO/REA; all relevant Offices/RO | Owner final after mandatory concurrence; RO executes | any mandatory authority blocks/returns | all gates, DoDs, limitations, rollback; no implementation-only readiness |
| Publication | content owner; KO/SAO/legal/privacy/RO | all mandatory authorities plus Owner; RO executes publication | any mandatory authority blocks; no schedule override | rights, sources, scientific eligibility, risk, exact artifact |
| Emergency Change | REA/content owner; owning Offices expedited | authorized emergency authority; retrospective concurrence required | safety/legal authority may stop; RO executes emergency release if approved | incident, necessity, minimality, rollback, audit; not normal shortcut |
| Deprecation | owning Office; affected consumers/RO | owning authority and RO | affected mandatory Office returns; RO records/notifies | rationale, migration/limits, version impact |
| Supersession | owning Office; scientific/architecture/product as applicable | owning authority and RO | mandatory Office blocks; RO records relationship | replacement authority, compatibility, preserved history |
| Retirement | owning Office/RO; affected Offices | Owner where Program material, owning authority and RO | risk/retention authority blocks; RO executes retirement | no active dependency, archive, notification, residual obligations |

## Multiple Approval Semantics

Advisory review informs. Mandatory concurrence is a domain veto within scope.
Final accountability decides only after concurrence. Execution authority acts
only on the exact approved artifact. One role holding several assignments must
record each decision separately to preserve non-overlap.
