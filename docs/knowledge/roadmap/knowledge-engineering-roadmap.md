# Knowledge Engineering Roadmap

Status: Planning only

This roadmap describes a possible governed sequence for future knowledge work.
It is not an approval, implementation contract, dataset plan, publication event,
or commitment. Every sprint MUST receive separate owner authorization before
work begins and MUST comply with the [Knowledge Constitution](../constitution/knowledge-constitution.md),
applicable KAS, accepted ADRs, Design Freeze, Source Policy, RAS boundaries, and
the Publication Boundary.

This roadmap MUST NOT create data, schema, Runtime behavior, diagnosis,
recommendation, inference, automation, or AI. It MUST NOT authorize source
acquisition, domain population, pilot records, production identifiers, or public
publication.

## Phase Model

| Phase | Purpose | Included sprints | Boundary |
| --- | --- | --- | --- |
| Governance work | Define subordinate rules and review controls under the Constitution. | Sprint-032K to Sprint-034K | MUST remain policy and review documentation. |
| Authoring preparation | Prepare editorial guidance and implementation-neutral templates. | Sprint-033K to Sprint-035K | MUST NOT create canonical records or schemas. |
| Pilot knowledge authoring | Test governed authoring questions in bounded, separately approved pilots. | Sprint-036K to Sprint-039K | MUST remain candidate-only and MUST NOT imply production acceptance. |
| Domain population | Consider scaled content only after pilot evidence and explicit approval. | Future, unscheduled | MUST NOT begin under this roadmap. |
| Future implementation mapping | Map accepted knowledge needs to possible engineering work after evidence and architecture review. | Future, unscheduled | MUST NOT select or modify schema, Runtime, API, inference, automation, or AI. |

Phase overlap identifies different concerns within a sprint; it does not merge
their approval gates. Completion of one phase MUST NOT automatically authorize
the next.

## Planned Governance Work

### Sprint-032K — Knowledge Governance Standards

This sprint defines subordinate governance standards, authority roles, change
control, and conflict handling under the Constitution. Its resulting KGS family
MUST NOT amend the Constitution or duplicate accepted ADR decisions. Completion
of Sprint-032K MUST NOT authorize a later roadmap sprint.

### Sprint-033K — Knowledge Editorial Handbook

This sprint SHOULD prepare human editorial guidance that applies approved
governance to clear, neutral, traceable writing. The handbook MUST NOT establish
facts, terminology, diagnosis, recommendation, or a physical record format.

### Sprint-034K — Knowledge Review Framework

This sprint SHOULD define review roles, gates, evidence expectations, conflict
disposition, and audit evidence. Mechanical review MUST remain distinct from
scientific, domain, terminology, ontology, regulatory, rights, and publication
approval.

## Planned Authoring Preparation

### Sprint-035K — Knowledge Editorial Handbook delivery

The owner separately authorized Sprint-035K to deliver the operational handbook
originally described as a future editorial-handbook capability. The delivered
family remains subordinate guidance for source intake, evidence extraction,
candidate preparation, specialist review, and publication readiness. This status
note does not alter the planning-only nature of the roadmap, authorize content,
or imply completion of the canonical-template work below.

### Earlier Sprint-035K planning entry — Canonical Knowledge Authoring Templates

This sprint SHOULD prepare implementation-neutral authoring templates for human
review. Templates MUST NOT be schemas, Runtime contracts, candidate data,
production identifiers, or authority to populate a domain. If work intersects
ADR-009's Rice pilot YAML format, ADR-009 MUST remain the format authority.
The scheduling label is retained as roadmap history; this work was not delivered
by the separately authorized Sprint-035K editorial-handbook scope and requires a
new owner scheduling decision before implementation.

## Planned Pilot Knowledge Authoring

### Sprint-036K — Knowledge Review Framework delivery

The owner separately authorized Sprint-036K to deliver the human-governed review
framework originally planned as a future review capability. This delivery
standardizes competence, findings, decisions, acceptance gates, escalation, and
audit evidence without creating knowledge content, scores, schemas, or software.

### Earlier Sprint-036K planning entry — Rice Growth Stage Pilot

This sprint MAY propose a separately authorized, bounded candidate-authoring
exercise concerning growth-stage concepts. It MUST NOT create or approve records
under this roadmap, claim completeness, or imply diagnosis or recommendation.
The scheduling label is retained as roadmap history; the pilot was not delivered
by the separately authorized review-framework sprint and requires a new owner
scheduling decision.

### Sprint-037K — Rice Plant Anatomy Pilot

This sprint MAY propose a separately authorized, bounded candidate-authoring
exercise concerning anatomy concepts. It MUST preserve identity, terminology,
ontology, evidence, and conflict boundaries and MUST NOT populate production
knowledge.

### Sprint-038K — Observation Trait Framework

This sprint MAY propose governance for describing observable traits while
preserving the separation among observation, evidence, knowledge, and reasoning.
It MUST NOT create an inference, scoring, or diagnostic framework.

### Sprint-039K — Symptom and Sign Framework

This sprint MAY propose governance for distinguishing symptoms and signs as
descriptive concepts. It MUST NOT connect those descriptions to causal
confirmation, diagnosis, treatment, recommendation, ranking, or automated
decision-making.

## Later Gates

Domain population MUST require successful pilot review, approved source and
rights scope, identity and terminology authority, evidence and conflict review,
publication planning, and explicit owner authorization. It MUST remain a future
decision rather than an assumed consequence of these sprints.

Future implementation mapping MUST begin only after accepted knowledge
requirements exist. It MUST produce proposals for separate architecture review;
it MUST NOT retrofit planning language into schema, Runtime, API, validation,
inference, recommendation, automation, or AI behavior.
