# Program Lifecycle and Roadmap Governance

Status: Active

Version: 1.0

## Governed Lifecycle

| Phase | Purpose, primary and participating Offices | Entry, permitted/prohibited activities, outputs | Exit evidence, review, feedback, and change control |
|---|---|---|---|
| Vision | establish mission/value/principles; Owner/PO with all Offices | enter from Charter need; research/define, no implementation promise; Vision artifacts | Vision Ready evidence; strategic review; feedback from all phases; major control |
| Architecture | define durable boundaries; ARO with KO/PO/SAO/REA | accepted Vision; model/review, no unapproved behavior; architecture/ADRs | Architecture Ready; ARO concurrence; feedback from feasibility/learning; Architecture Change |
| Knowledge | govern structures/content; KO/SAO/ARO | accepted architecture and sources; author/review, no product auto-promotion; packages/gaps | Knowledge Ready; scientific/knowledge review; case learning nominations only; knowledge change |
| Product | define users/journey/scope/increments; PO with ARO/KO/SAO/HRO/FVO | readiness basis; product definition, no build-first decisions; acceptance/deferral | Product Ready; Product review; field feedback; Product Change |
| Governance Readiness | establish authority/risks/dependencies/operations; PMO coordinates owning Offices | accepted domain definitions; assign/review, no waivers; readiness records | Governance Ready; all mandatory concurrence; feedback from blocks; Governance Change |
| Implementation | realize only approved behavior; REA with ARO/PO/KO | Implementation Ready; build/test, no semantic redefinition; implementation evidence | Implementation Done/Validation Ready; technical/architecture review; change class controls |
| Validation | test architecture/value/usability/governance; FVO with PO/HRO/SAO | validated candidate/readiness; execute method, no unsupported proof; validation records | Validation/Pilot Done; round/gate review; findings return to owning domains as candidates |
| Release | govern exact artifact/audience; RO with mandatory Offices | Release Ready; package/execute, no readiness creation; Release Record | Release Done; release/Owner review; operational feedback; Release Change |
| Operation | deliver authorized purpose safely; operations/REA/PO/HRO | Production Release; operate/support/monitor, no hidden expansion; operational records | continued eligibility or hold/rollback; operational review; incidents trigger change |
| Learning | gather outcomes/debriefs/gaps; owning Offices with FVO/HRO/KO | attributable operational evidence; nominate, no automatic alteration; Learning Candidates | Learning Review Ready; domain review; accepted/rejected candidates; controlled changes |
| Program Evolution | revise direction through governance; Owner/PMO/all Offices | reviewed learning/strategy; prioritize/re-architect, no principle weakening; roadmap/charter changes | new Vision/milestone evidence; Executive review; Major/Architecture/Governance change |

Learning never automatically alters Knowledge, Product, Runtime, or Governance.

## Roadmap Constructs

The Master Program Roadmap records approved strategic sequence and evidence-based
milestones. Critical Path identifies current blocking dependency chains.
Milestones aggregate gate/DoD evidence. Program and Initiative Backlogs retain
governed candidate work, not implementation tickets. Sprint sequencing and
parallel work disclose dependencies, assumptions, capacity, review, and rollback.
Deferred scope remains explicit and requires reauthorization.

PMO maintains roadmap, dependency/readiness status, risk/stop/rollback review,
capacity assumptions, and executive reporting. PMO cannot approve domain readiness.

## Review Cadence

Conceptual cadence includes Sprint, Architecture, Knowledge, Product, Risk,
Critical Path, Field Validation, Release, and Executive Program reviews. Cadence
is triggered by lifecycle needs and material change; no calendar dates or meeting tools are prescribed.

Roadmap revision is mandatory for dependency change, major risk realization,
Architecture rejection, scientific correction, Product scope change, failed
validation, reviewer-capacity or field-season constraint, privacy/regulatory
change, release withdrawal, or Program Owner priority change.

## Conflict Resolution

| Conflict | First forum and evidence | Participants, escalation, final accountability, stop, and audit |
|---|---|---|
| Architecture vs Product | ARO/PO review; boundaries, user value, alternatives | ARO/PO plus affected KO/REA; Owner priority after ARO concurrence; stop on protected conflict; Decision Record |
| Product vs Knowledge | PO/KO; readiness, meaning, user need | PO/KO/SAO/ARO; Owner sequencing only; stop unreviewed knowledge use; audit |
| Product vs Scientific Authority | PO/SAO; evidence, safety, interpretation | PO/SAO/HRO/Owner; SAO controls science; stop unsupported claim; audit dissent |
| PMO schedule vs mandatory gate | owning gate Office; readiness/block evidence | PMO/Office/Owner; mandatory Office final in domain; stop; Gate Decision Record |
| Runtime feasibility vs Architecture | REA/ARO; constraints, alternatives, compatibility | REA/ARO/PO; ARO architecture, Owner scope/resource; stop unauthorized deviation; ADR/change audit |
| Field usability vs governance burden | FVO/owning Office; observed burden, risk, alternatives | FVO/PO/HRO/privacy/ARO; Owner prioritizes after protected concurrence; stop unsafe/unusable work; validation record |
| Human Review disagreement | HRO forum; case evidence, qualifications, rationales | reviewers/HRO/SAO as needed; qualified authority final for scope; unresolved allowed; preserve dissent |
| Scientific source disagreement | SAO forum; exact sources/methods/authority | SAO/KO/experts; SAO disposition or unresolved; stop dependent claim; Scientific Review Record |
| Release pressure vs unresolved risk | RO/risk owner; gates, residual evidence | RO/Office/Owner; mandatory risk owner controls block; stop execution; Release/Gate record |
| Owner priority vs protected boundary | owning authority forum; law/science/freeze/publication evidence | Owner and mandatory authority; protected authority controls; stop; explicit Decision Record |

No conflict is resolved by silently weakening a boundary.

## Governance Artifacts

| Artifact | Purpose and conceptual owner |
|---|---|
| Program Charter | mission, principles, authority; Program Owner |
| Master Roadmap / Program Backlog | sequence and governed candidates; PMO |
| Dependency Map / Risk Register | readiness relationships / risk evidence; PMO coordinates, domain owners decide |
| Decision Register | accountable decisions and concurrence; PMO custodian |
| Architecture, Knowledge, Scientific, Product, Human Review Records | domain review evidence; respective ARO, KO, SAO, PO, HRO |
| Field Validation Record | method, sample, findings, stops, debrief; FVO |
| Gate Decision / Change / Milestone Review Records | transitions, controlled changes, milestone evidence; accountable Office with PMO custody |
| Release / Publication Records | exact eligibility, approval, execution, audience; RO |
| Deprecation / Supersession / Withdrawal Records | lifecycle reason, impact, notification, lineage; owning Office and RO |

These are conceptual artifacts only. No actual register, board, template, or dataset is created.
