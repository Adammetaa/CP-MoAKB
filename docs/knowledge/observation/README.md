# Observation Knowledge Architecture

Status: Active

Version: 1.0

## Purpose

Define a crop-independent, explainable, deterministic, evidence-first,
traceable, and human-reviewable conceptual architecture for observations in
CP-MoAKB.

## Scope

This family governs what an Observation means, how its identity and context
remain bounded, how it is classified conceptually, how uncertainty is disclosed,
and how provenance permits reconstruction. It describes observations as
epistemic inputs that MAY later be evaluated as Evidence for a precise Claim.

## Authority

[ADR-002](../../ARCHITECTURE_DECISIONS/ADR-002-separate-observation-evidence-and-recommendation.md)
remains authoritative for separating Observation, Evidence, regulation, and
recommendation. The [Knowledge Constitution](../constitution/knowledge-constitution.md),
[KAS-003](../KAS-003-evidence-standard.md), [Evidence Levels](../../EVIDENCE_LEVELS.md),
[Ontology Principles](../../ontology/ONTOLOGY_PRINCIPLES.md),
[Knowledge Asset Architecture](../architecture/README.md), and
[Knowledge Object Model](../object-model/README.md) retain their authority.

An Observation Object is a specialized conceptual object at the observation
boundary. It does not amend the canonical Knowledge Object catalog. When an
observation is nominated as source material, a Source Object governs the record's
source identity and custody; an Evidence Object separately governs its relevance
to a Claim.

## Documents

- [Observation Object](observation-object.md)
- [Observation Ontology](observation-ontology.md)
- [Observation Taxonomy](observation-taxonomy.md)
- [Observation Context](observation-context.md)
- [Observation Confidence and Uncertainty](observation-confidence.md)
- [Observation Provenance](observation-provenance.md)

## Core Boundary

An Observation records what was reported, perceived, measured, counted, imaged,
or otherwise captured in a particular context. It MUST NOT establish cause,
identity confirmation, general truth, regulatory status, safety, efficacy, or
recommended action.

Observation MUST remain distinct from Source, Evidence, Claim, Concept,
Relationship, interpretation, diagnosis, recommendation, and hypothesis.
Repeating, aggregating, reviewing, or displaying observations MUST NOT silently
cross those boundaries.

## Quality Principles

- **Explainable:** a reviewer MUST understand what was observed, by whom or what,
  how, where, when, and with which limitations.
- **Deterministic:** the same preserved observation basis and declared rules MUST
  yield the same descriptive account and reference ordering.
- **Evidence-first:** use as Evidence MUST begin with an explicit Claim and
  separate Evidence review; observation presence alone proves nothing.
- **Traceable:** identity, context, provenance, transformations, versions,
  custody, and review history MUST remain connected.
- **Human-reviewable:** uncertainty, missing context, conflicts, corrections, and
  exclusions MUST be visible to competent reviewers.
- **Crop-independent:** the architecture MUST work for any domain without making
  crop, organism, condition, method, language, or location part of its structure.

## Out of Scope

This family defines no schema, field list, serialization, database, graph,
Runtime behavior, API, parser, registry, validator, identifier syntax,
confidence score, inference, automated classification, agricultural record,
diagnosis, recommendation, or hypothesis-generation process.

## Change Control

Material change requires review against ADR-002, the Constitution, KAS, KGS,
Evidence Levels, the Asset Architecture, Object Model, Source Policy, Design
Freeze, and Publication Boundary. This family MUST NOT silently supersede them.
