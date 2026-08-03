# Observation Vocabulary Architecture

Status: Active

Version: 1.0

## Purpose

This document family defines the governance architecture for language used to
describe observations. It enables explainable, deterministic, evidence-first,
traceable, human-reviewable, crop-independent terminology without constructing
a production vocabulary.

## Authority

This family specializes the observation domain under
[ADR-007](../../ARCHITECTURE_DECISIONS/ADR-007-controlled-vocabulary-governance-before-vocabulary-construction.md)
and [KAS-005](../KAS-005-terminology-standard.md). Those authorities remain
controlling. This family MUST NOT redefine ontology identity, terminology
governance, or the [Observation Knowledge Architecture](../observation/README.md).

The [Knowledge Constitution](../constitution/knowledge-constitution.md),
[Knowledge Object Model](../object-model/README.md), and
[Ontology Principles](../../ontology/ONTOLOGY_PRINCIPLES.md) retain their
respective authority. This architecture creates no new Knowledge Object class.

## Permanent Epistemic Separation

The following layers MUST remain distinct:

> Observation -> Evidence -> Knowledge -> Hypothesis -> Diagnosis ->
> Recommendation -> Decision -> Action -> Outcome

A term, label, mapping, review, or publication decision MUST NOT collapse these
layers or automatically promote content between them.

## Architecture Principles

- **Explainable:** every term decision MUST expose meaning and boundaries.
- **Deterministic:** the same governed inputs MUST produce the same term review
  result; hidden inference MUST NOT choose meaning.
- **Evidence-first:** terminology MUST NOT substitute for evidence assessment.
- **Traceable:** authority, editorial basis, review, and history MUST be visible.
- **Human-reviewable:** accountable reviewers MUST decide acceptance and change.
- **Crop-independent:** the architecture MUST work without assuming a crop.
- **Implementation-neutral:** these documents MUST NOT prescribe storage,
  serialization, API, validation, or runtime behavior.
- **Thai-first compatible:** Thai labels and definitions MUST be supportable
  while English technical alignment remains explicit and independently reviewed.
- **Multi-crop extensible:** later domain terms MAY extend governed concepts
  without changing their neutral observation meaning.

## Documents

- [Purpose and Boundary](vocabulary-purpose-and-boundary.md)
- [Concept Model](vocabulary-concept-model.md)
- [Vocabulary Families](vocabulary-families.md)
- [Term Record Requirements](term-record-requirements.md)
- [Language and Terminology Policy](language-and-terminology-policy.md)
- [Neutrality and Non-inference Rules](neutrality-and-non-inference-rules.md)
- [Authoring and Review Workflow](authoring-and-review-workflow.md)
- [Architecture Examples](observation-vocabulary-examples.md)

## Out of Scope

This family does not create term records, vocabulary identifiers, datasets,
YAML or JSON, registries, schemas, validation rules, APIs, runtime behavior,
diagnoses, hypotheses, recommendations, pesticide guidance, AI behavior, or
image-classification behavior.

## Change Control

Changes MUST receive the reviews required by ADR-007 and KAS-005. A change to
this architecture MUST NOT silently change any protected engineering or
knowledge-governance baseline.
