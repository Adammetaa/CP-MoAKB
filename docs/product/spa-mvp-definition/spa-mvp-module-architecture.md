# SPA MVP Module Architecture

Status: Active

Version: 1.0

## Interpretation and Dependency Direction

Modules are cohesive product responsibilities, not software components, screens,
routes, services, or databases. The conceptual direction is:

> Case Intake -> Observation and Information State -> Information Gaps ->
> Questions -> Evidence Needs and Evidence -> Knowledge Consultation ->
> Hypothesis Candidates -> Differential Comparison -> Human Review -> Reviewed
> Findings -> Management Options Eligibility -> Decision -> Action -> Outcome ->
> Learning Candidate

No downstream module rewrites upstream history. Question work is not a decision
tree, and Learning Candidates never become Knowledge automatically.

## Coordination and Intake Modules

| Module | Purpose, user, and responsibility | Boundaries, inputs, outputs, dependencies | Assets, review, visibility, extension, and MVP reason |
|---|---|---|---|
| SPA Home and Work Queue | SPA coordination of assigned cases, urgency, pauses, and handoffs | includes navigation and status summaries; excludes diagnosis and priority inference; inputs assignments/status, outputs human work selection; depends on Case Intake and review status | authority vocabulary; SPA-visible; review urgent/safety labels; future multi-role queue; Must Have only as minimal coordination |
| Case Intake | SPA creates bounded, attributable case context | includes reports, responsibility, safety, consent, channel; excludes Observation inference; outputs case basis and gaps; upstream receipt, downstream all case work | Investigation Blueprint and terminology; SPA review; sensitive visibility; extensible channels; Must Have |
| Investigation Workspace | SPA coordinates the bounded inquiry and unresolved work | includes references to case investigation entities; excludes owning their semantics; inputs case/gaps, outputs investigation context; depends on specialized workspaces | Investigation Ontology; human case review; SPA/Agronomist; future richer coordination; Must Have, kept thin to avoid duplication |

## Capture and Inquiry Modules

| Module | Purpose, user, and responsibility | Boundaries, inputs, outputs, dependencies | Assets, review, visibility, extension, and MVP reason |
|---|---|---|---|
| Observation Workspace | SPA/Agronomist authors bounded direct Observations | excludes reports, Evidence, and Diagnosis; inputs capture context, outputs Observation; depends on intake, feeds gaps/evidence | Observation Architecture/Vocabulary; provenance review; role-bounded; future capture assistance; Must Have |
| Information Gap Workspace | SPA exposes Information States and unresolved requirements | excludes negative Observation and question selection; inputs case/observations, outputs states/gaps; feeds Questions and Needs | Investigation Ontology; SPA review; SPA/reviewer visible; future gap suggestions only under authority; Must Have |
| Question Workspace | SPA manually considers patterns, authors instances, records responses/skips | excludes automatic selection, decision trees, and inference; inputs gaps/patterns, outputs instances/responses; feeds evidence and states | Question Bank; neutrality review; SPA-visible, reviewer trace; future suggestions advisory only; Must Have |
| Evidence Workspace | SPA attaches material, tracks needs, custody, quality, and relevance assessments | excludes automatic acceptance and merges of quality/relevance; inputs needs/material, outputs inventory and governed evidence references; feeds comparison/review | Evidence standards and Source Objects; qualified review; sensitive role visibility; future capture aids; Must Have |

## Knowledge and Reasoning Modules

| Module | Purpose, user, and responsibility | Boundaries, inputs, outputs, dependencies | Assets, review, visibility, extension, and MVP reason |
|---|---|---|---|
| Knowledge Reference Workspace | SPA/reviewers consult exact governed knowledge and record use state | excludes hidden retrieval, Product Knowledge priority, and case Evidence substitution; inputs references, outputs consultation rationale; feeds candidates/comparison | Knowledge/Source/Concept/Terminology Objects; Knowledge review; role-visible; future packages; Must Have |
| Hypothesis Workspace | SPA explicitly authors provisional candidates and rationale | excludes generation, ranking, Diagnosis; inputs observations/evidence/knowledge, outputs candidates/issues; feeds differential | Investigation Ontology; Agronomist review; provisional visibility; future advisory suggestions; Must Have |
| Differential Comparison Workspace | SPA/Agronomist compare alternatives using explained criteria | excludes score, winner, and hidden rank; inputs candidates/evidence, outputs scoped comparison; feeds Human Review | differential model and Evidence Objects; Agronomist review; reviewer-first; future assistance; Must Have |
| Human Review Workspace | qualified humans challenge, return, approve for purpose, reject, or mark unresolved | excludes automatic approval and role substitution; inputs review package, outputs review record/disposition; feeds findings/eligibility | Review Objects and authority policies; mandatory Agronomist path; restricted visibility; future specialist panels; Must Have |
| Investigation Output Workspace | SPA presents reviewed finding, limits, unresolved issues, and eligibility explanation | excludes Claim, Diagnosis, Recommendation, and report-layout design; inputs reviewed records, outputs explanation package; feeds decision | Finding/Review Objects; output review; audience-bounded; future report rendering; Must Have |

## Post-investigation and Learning Modules

| Module | Purpose, user, and responsibility | Boundaries, inputs, outputs, dependencies | Assets, review, visibility, extension, and MVP reason |
|---|---|---|---|
| Decision and Action Workspace | SPA records user Decision and actual Action separately | excludes option selection, assumed action, or efficacy; inputs reviewed output/attributable reports, outputs Decision and Action records; feeds follow-up | Decision/Action governance; provenance review; sensitive case roles; future integrations; Must Have |
| Follow-up and Outcome Workspace | SPA schedules follow-up and records bounded Outcome | excludes prediction, causal inference, and historical rewrite; inputs action/issues/new observations, outputs follow-up/outcome; feeds learning | Outcome and Observation boundaries; review as needed; case roles; future longitudinal work; Must Have |
| Learning Candidate Workspace | SPA/reviewers nominate reviewable gaps, patterns, and usability findings | excludes approved Knowledge and self-learning; inputs reviewed case/outcome/friction, outputs candidate nomination; feeds Knowledge Review only | authoring/review governance; Knowledge review mandatory; internal visibility; future analytics; Should Have, minimal nomination may support MVP learning |
| Case History and Audit Workspace | all authorized roles reconstruct sources, edits, reviews, and layer transitions | includes provenance and status history; excludes silent mutation and implementation logging design; inputs all governed acts, outputs traceable history | provenance/review authorities; audit review; role-sensitive; future enterprise oversight; Must Have |

## Module Quality Review

Each module has one primary responsibility. The Investigation Workspace
coordinates but does not duplicate specialized content. History observes rather
than owns case entities. Outputs consume reviewed records without editing them.
Dependencies flow forward through explicit references, while returns for
clarification preserve history. This controls coupling and permits independent evolution.
