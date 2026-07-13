# Strategic Roadmap 2.0

## Status

This is a strategic roadmap, not a release commitment. It does not replace the approved release roadmap, release baseline v0.8.0, GitHub milestones, or Product Owner prioritization. Phase names describe possible capability growth and architectural dependencies; they do not claim that unimplemented modules exist.

Each phase requires approved scope, sources, acceptance criteria, privacy and legal review where applicable, tests, and an architecture decision when a new binding choice is introduced. Design Freeze v1.0 remains active until explicitly changed through an approved process.

## Phase 1 — Trusted Foundation

### Direction

- official source governance;
- deterministic parser behavior;
- semantic validation;
- golden baseline protection; and
- continuous integration.

The repository currently implements a limited IRAC-focused subset of this foundation. That implementation must not be generalized into claims about other domains.

### Dependencies

- identifiable official source and retained provenance;
- frozen schema, parser, exporter, and validation contracts;
- repeatable development environment and read-only tests; and
- review ownership.

### Architectural gates

- source registration and replacement policy accepted;
- checksums and version identity verified;
- deterministic output and canonical expectations approved;
- no generated-artifact leakage in CI; and
- any frozen-component change receives separate design approval.

## Phase 2 — Knowledge Access

### Possible capabilities

- query engine;
- search;
- structured summaries;
- REST API; and
- documentation website.

### Dependencies

- Phase 1 reliability;
- approved query and citation use cases;
- stable public identity and version semantics; and
- access-control and source-license review.

### Architectural gates

- API and query contracts approved;
- every returned assertion exposes provenance and review status;
- caching does not obscure source currency;
- authorization and rate/abuse controls assessed; and
- summaries distinguish source text, extraction, and interpretation.

## Phase 3 — Multi-Domain Knowledge

### Possible capabilities

- FRAC classification;
- herbicide Mode of Action classification;
- crop anatomy and physiology;
- pest and disease taxonomy;
- symptom ontology; and
- IPM practices.

### Dependencies

- source-specific registration and licensing;
- identity and synonym governance;
- conceptual domain model review;
- multilingual label policy; and
- domain-review capacity.

### Architectural gates

- each authority remains versioned and independently attributable;
- cross-domain mappings do not alter authoritative source hierarchies;
- symptom-to-cause links express uncertainty and assertion type;
- conflicting taxonomies and evidence remain visible; and
- physical ontology or graph technology is selected only through an accepted ADR.

## Phase 4 — Thai Regulatory Layer

### Possible capabilities

- commercial product registry;
- label versioning;
- legal crop-target combinations;
- PHI;
- REI;
- PPE requirements; and
- registration status.

### Dependencies

- approved Thailand Department of Agriculture source access;
- source terms, license, retention, and redistribution review;
- product and registration identity rules;
- Thai-language governance; and
- regulatory review ownership.

### Architectural gates

- current official source and label verification is reproducible;
- jurisdiction and effective dates are mandatory;
- superseded, expired, suspended, or cancelled states remain auditable;
- application rates and label constraints are extracted, never invented; and
- scientific evidence cannot bypass a regulatory gate.

## Phase 5 — Explainable Decision Support

### Possible capabilities

- guided diagnosis;
- differential reasoning;
- threshold assessment;
- Mode of Action rotation context;
- safety checks; and
- economic comparison.

### Dependencies

- Phases 2–4 as applicable;
- governed evidence assertions;
- approved decision workflow and confidence semantics;
- current regulatory and label checks; and
- IPM and threshold sources.

### Architectural gates

- safeguards in [Decision Engine](DECISION_ENGINE.md) are testable;
- diagnosis and treatment confidence remain separate;
- alternatives, missing data, and conflicting evidence are shown;
- every recommendation is explainable and traceable;
- expert override has an audit trail; and
- Product Owner and qualified domain reviewers approve the operating boundary.

## Phase 6 — Field Intelligence

### Possible capabilities

- structured field observations;
- image-assisted assessment;
- regional patterns;
- treatment follow-up; and
- expert review workflow.

### Dependencies

- [Field Knowledge Policy](FIELD_KNOWLEDGE_POLICY.md);
- consent, privacy, anonymization, and retention controls;
- observation identity and provenance;
- reviewer roles and promotion workflow; and
- secure media storage decisions.

### Architectural gates

- observations remain distinct from evidence and recommendations;
- one image cannot produce a conclusive diagnosis;
- original images and derived labels retain provenance;
- regional aggregation passes re-identification review;
- treatment outcomes do not automatically establish diagnosis or resistance; and
- publication requires explicit domain and data-governance approval.

## Phase 7 — Application Intelligence

### Possible capabilities

- drone parameters;
- spray quality;
- weather constraints;
- coverage analysis; and
- cost and operational models.

### Dependencies

- governed application records;
- equipment, nozzle, droplet, weather, and measurement sources;
- applicable official standards and labels;
- calibrated units and uncertainty; and
- qualified application-domain review.

### Architectural gates

- operational parameters remain context- and equipment-specific;
- application models cannot override legal labels or safety constraints;
- units, calibration, assumptions, and measurement uncertainty are explicit;
- no default rate or operational setting is invented; and
- model validation and field-testing policy is approved.

## Phase 8 — Farm Intelligence

### Possible capabilities

- field history;
- resistance-risk history;
- seasonal planning;
- local intelligence; and
- decision audit trail.

### Dependencies

- prior phase governance as needed;
- stable farm and Field identity with privacy controls;
- longitudinal versioning;
- data ownership and portability rules; and
- durable audit and access-control architecture.

### Architectural gates

- personal and proprietary data are minimized and access-controlled;
- historical decisions retain the sources and models used at the time;
- local patterns do not become universal scientific claims;
- retention, deletion, correction, and export rights are defined; and
- automated planning remains explainable, reviewable, and jurisdiction-aware.

## Cross-phase dependencies

The following gates apply throughout:

- source identity, license, version, and provenance;
- stable entity identity and multilingual labels;
- evidence level, review status, confidence, and assertion type;
- temporal and jurisdictional validity;
- privacy, consent, security, and auditability;
- deterministic validation and regression protection;
- separation of observation, evidence, regulation, interpretation, and recommendation; and
- explicit Product Owner and domain approval for scope transitions.

## Roadmap governance

A phase may be split, reordered, deferred, or rejected. Entry requires a scoped proposal and accepted prerequisites; exit requires evidence that its architectural gates are met. GitHub Issues and approved release plans remain the operational source of truth. Strategic wording in this document must never be used as authorization to change frozen components or publish new datasets.
