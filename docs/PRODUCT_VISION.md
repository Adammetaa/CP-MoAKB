# Product Vision

## Status and scope

This document describes the long-term product direction for CP-MoAKB. It is not a release commitment, an implementation specification, or evidence that the future modules described here exist. The current implemented baseline remains the source-oriented IRAC parser, exporter, semantic validator, frozen schema, and supporting tests documented in [Project Context](PROJECT_CONTEXT.md).

## Purpose and mission

CP-MoAKB is intended to become an explainable, evidence-first crop-protection intelligence platform. Its purpose is to help people find, evaluate, and apply crop-protection knowledge without obscuring the source, jurisdiction, uncertainty, or reasoning behind an answer.

The mission is to connect scientific classification, crop and pest biology, official regulation, field observations, and management knowledge into decision support that remains reviewable by people.

## North Star

**Every recommendation must be explainable and traceable.**

A future user should be able to see what is known, what is inferred, what remains uncertain, which sources support each statement, which rules apply in the relevant jurisdiction, and why one option was considered more suitable than another.

**Every field observation is a potential knowledge asset.**

Field experience should be capturable and reviewable without being promoted automatically to scientific fact. The intended lifecycle is defined in the [Field Knowledge Policy](FIELD_KNOWLEDGE_POLICY.md).

## Intended users

Potential users include:

- growers and farm managers seeking structured questions and auditable options;
- agronomists, crop advisers, extension personnel, and IPM practitioners;
- researchers and domain reviewers maintaining evidence and biological knowledge;
- regulatory and stewardship teams checking jurisdiction-specific constraints;
- product and data teams building knowledge-access tools on governed sources; and
- drone and application specialists evaluating operational constraints.

The platform should support different levels of expertise without presenting uncertain interpretation as settled fact.

## Core user problems

- Relevant knowledge is distributed across classifications, labels, regulatory records, literature, extension guidance, and field records.
- Scientific identity, legal permission, local suitability, safety, and cost are often conflated even though they answer different questions.
- Symptoms may have multiple biotic or abiotic causes and may require discriminating observations.
- Source versions and regulatory status change over time and across jurisdictions.
- Field observations are valuable but frequently lack consistent metadata, provenance, review, and privacy safeguards.
- Recommendations are difficult to audit when assumptions, evidence, alternatives, and missing information are hidden.

## Product principles

1. **Evidence before assertion.** Published assertions retain sources, versions, dates, and review status.
2. **Explanation before automation.** The system exposes reasoning, uncertainty, alternatives, and constraints.
3. **Jurisdiction before action.** Legal-use statements require current official registration and label verification for the relevant jurisdiction.
4. **IPM before product selection.** Future workflows consider monitoring, prevention, and non-chemical management before chemical intervention.
5. **Observation is not proof.** Field records can generate hypotheses and patterns but do not establish causality by themselves.
6. **No silent correction.** Original values and records remain traceable when reviewed, disputed, deprecated, or superseded.
7. **Version everything material.** Sources, assertions, labels, regulatory facts, and derived knowledge require temporal context.
8. **Human accountability.** Domain approval and expert override are explicit, attributed, and auditable.
9. **Privacy by design.** Personal, farm, image, and location data are minimized and governed.
10. **Modular growth.** Future domains integrate through governed concepts rather than forcing premature schema or technology choices.

## Evidence-first behavior

The intended product separates the statement presented to a user from the records that justify it. An answer should identify its assertion type, evidence level, source tier, review status, jurisdiction, and validity period where relevant. Conflicting evidence is retained and shown rather than collapsed into a false consensus.

Evidence level does not determine recommendation strength on its own. Official classification can establish a classification fact, while a legal-use question requires registration and label evidence, and local performance may require additional agronomic evidence. See [Source Policy](SOURCE_POLICY.md) and [Evidence Levels](EVIDENCE_LEVELS.md).

## Explainability and traceability

Explainability requires more than a citation list. A future decision should expose:

- the user context and observations considered;
- alternative causes or options evaluated;
- assumptions and missing information;
- evidence supporting or contradicting material assertions;
- regulatory, safety, environmental, and operational filters;
- the reasoning that connected evidence to the outcome; and
- reviewer or override actions with timestamps and identities.

Traceability requires stable entity identities and provenance links from displayed knowledge back to source versions and review records. The future conceptual graph is described in [Knowledge Graph](KNOWLEDGE_GRAPH.md).

## Decision-support boundaries

CP-MoAKB is intended to support, not replace, competent human judgment. Future workflows must not:

- diagnose conclusively from a single image;
- invent registrations, label conditions, application rates, safety constraints, or efficacy claims;
- treat Mode of Action membership as proof of crop, target, timing, or field suitability;
- convert field observations directly into validated scientific evidence;
- represent a low price as best value without agronomic and risk context;
- provide medical diagnosis or treatment; or
- conceal uncertainty, conflicts, or missing evidence.

The staged conceptual workflow and safeguards are defined in [Decision Engine](DECISION_ENGINE.md).

## Thailand-first regulatory context

Future product and application guidance is Thailand-first and jurisdiction-aware. Any statement about legal use must be grounded in a current Thai official registration record and official label applicable to the crop, target, use pattern, and time of decision. Scientific or international material cannot substitute for local legal permission.

Thailand-first does not mean Thailand-only. The conceptual model allows other jurisdictions, but each regulatory assertion must retain its jurisdiction and validity. No Thai product registry is implemented in the current repository.

## Distinct knowledge classes

| Knowledge class | Meaning | Required handling |
| --- | --- | --- |
| Scientific fact | A biological, chemical, or agronomic assertion supported by appropriate scientific evidence. | Retain evidence, scope, uncertainty, and review status. |
| Regulatory fact | A legal or administrative assertion valid for a jurisdiction and period. | Require official source, version, jurisdiction, and validity dates. |
| Field observation | A record of what was seen, measured, or done in a particular context. | Preserve original metadata, privacy controls, provenance, and review state. |
| Expert interpretation | A documented professional interpretation of evidence or observations. | Attribute the expert, rationale, date, and confidence; keep alternatives visible. |
| Recommendation | A context-specific proposed action after biological, legal, safety, IPM, and economic checks. | Explain the decision path and link every material premise to evidence. |

These concepts must not be collapsed into one record or status. Their separation is governed by [ADR-002](ARCHITECTURE_DECISIONS/ADR-002-separate-observation-evidence-and-recommendation.md).

## Long-term module map

The following are possible future modules, not current capabilities:

- **Knowledge access:** governed search, query, citation, comparison, and structured summaries.
- **Crop biology:** crops, varieties, growth stages, anatomy, and physiological processes.
- **Pest biology:** insects, mites, nematodes, weeds, pathogens, diseases, life stages, and host relationships.
- **Diagnosis:** guided observation capture, differential causes, discriminating questions, and confidence reporting.
- **IPM:** monitoring, prevention, thresholds, and cultural, mechanical, biological, and chemical options.
- **MoA systems:** governed classification across relevant resistance-management authorities.
- **Safety:** human, environmental, non-target, water-protection, and label-derived constraints.
- **Thai product registry:** versioned registrations, labels, crops, targets, status, and legal conditions.
- **Economics:** price, application cost, duration, reapplication risk, expected loss, and scenario comparison.
- **Drone application:** platform, nozzle, droplet, volume, flight, swath, weather, coverage, and application records.
- **Field intelligence:** structured observations, images, outcomes, patterns, review, and regional learning.

Dependencies and gates for these possible modules are described in [Strategic Roadmap 2.0](ROADMAP_2.0.md).

## Non-goals

This vision does not authorize:

- a database migration or graph database selection;
- a production diagnosis or recommendation engine;
- integration claims for sources not registered in the repository;
- an unofficial pesticide recommendation or product-registration claim;
- an application-rate, dose, medical, or unsupported toxicological claim;
- automatic publication of field reports; or
- replacement of professional, regulatory, or label review.

Architecture decisions that govern this direction are recorded under [Architecture Decisions](ARCHITECTURE_DECISIONS/README.md).
