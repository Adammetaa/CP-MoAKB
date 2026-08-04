# Release Governance Model

Status: Active

Version: 1.0

## Release Separation

Knowledge Release, Product Release, Runtime Release, Pilot Release, Production
Release, and Publication are distinct. One never implies another automatically.
Release Office execution follows exact eligibility and approval; it does not create readiness.

## Release Types

| Type | Purpose, eligibility, evidence, approvals | Audience, prohibited use, version | Rollback/lifecycle and audit |
|---|---|---|---|
| Draft Artifact | authoring/review preparation; attributable draft | named collaborators; no operational/public reliance; draft version | replace/withdraw freely with history; provenance audit |
| Review Candidate | stable candidate for defined reviews; completeness evidence/owner approval | assigned reviewers; no accepted/production use; candidate version | return/revise; supersession link; review audit |
| Knowledge Release | approved governed Knowledge Package; KO/SAO/RO evidence | authorized consumers; no automatic Product/Diagnosis use; package version | withdraw/deprecate/supersede/retire by KO/RO; source/review audit |
| Pilot Release | bounded validation artifact; Product/FVO/HRO/privacy/technical readiness | approved pilot participants only; no production/public claims; pilot version | FVO/RO pause/rollback/withdraw; case/audience audit |
| Internal Release | internal evaluation/operation under controls; owning authorities/RO | authorized internal users; no public/production implication; internal version | RO rollback/withdraw; notes and access audit |
| Production Candidate | exact candidate after required gates; full evidence pending final decision | final reviewers; no production operation; candidate version | return/replace; eligibility audit |
| Production Release | approved operational artifact; all mandatory gates/Owner/RO | authorized production users; no Publication implication; production version | RO/REA rollback, hotfix, deprecate, supersede, retire; release audit |
| Publication Candidate | exact public candidate with science/rights/privacy evidence | publication reviewers; not public; candidate version | return/withdraw; exact artifact audit |
| Publication | authorized public artifact; all mandatory concurrence/Owner/RO | declared public audience; no use beyond stated limits; publication version | correct/withdraw/deprecate/supersede/archive; notification audit |
| Hotfix or Emergency Release | contain urgent approved defect/risk; exceptional evidence/authority | affected bounded audience; no unrelated scope; hotfix version | immediate rollback and retrospective review; incident audit |
| Deprecated Release | signal discouraged new use while retaining traceability | existing authorized users under limits; no new reliance unless approved | replacement/migration/retirement plan; notices audited |
| Superseded Release | identify approved replacement | consumers following compatibility/migration; old version not current | preserve both and relationship; supersession audit |
| Withdrawn Release | stop availability/use for stated reason | restricted retention/audit audience; no continued use | containment, notification, possible corrected release; withdrawal audit |
| Retired Release | end active lifecycle after obligations/dependencies addressed | archive/governance audience; no operational use | retained archive and final record; retirement audit |

## Version and Compatibility Expectations

Semantic versioning is applied conceptually according to each artifact’s owning
authority and compatibility promise. Knowledge Package, Product, Runtime, and
governance-document versions evolve independently; coordinated releases record
exact compatible combinations without forcing shared numbers.

## Release Evidence

Release notes identify type, exact versions/artifacts, authorities, changes,
compatibility, known limitations, unresolved accepted risks, audience,
dependencies, rollback/withdrawal, deprecation/supersession, and support/retention.
Notifications are required for material corrections, withdrawals, recalls,
supersession, audience restrictions, and risk changes.

## Knowledge Retirement and Archive

Knowledge retirement preserves sources, reviews, version lineage, reasons,
replacement, downstream references, and retention duties. Archives remain
traceable and access-governed; archival does not restore eligibility or authority.
No technical deployment mechanism is prescribed.
