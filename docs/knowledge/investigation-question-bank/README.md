# Investigation Question Bank Architecture

Status: Active

Version: 1.0

## Purpose

This family defines the architecture and governance of reusable, reviewable
question patterns for resolving Information Gaps and requesting relevant
investigation inputs. It is explainable, deterministic, evidence-first,
traceable, human-reviewable, crop-independent, multi-crop extensible,
implementation-neutral, and compatible with Thai-first use.

## Authority and Boundary

The [Investigation Ontology](../investigation/README.md) controls Investigation
Question, Information Gap, Evidence Need, and non-inference boundaries. The
[Observation Knowledge Architecture](../observation/README.md),
[Observation Vocabulary Architecture](../observation-vocabulary/README.md),
[Knowledge Constitution](../constitution/knowledge-constitution.md), and
[KAS-005 Terminology Standard](../KAS-005-terminology-standard.md) retain their
authority. This family creates no canonical Knowledge Object class.

The permanent epistemic separation is:

> Observation -> Evidence -> Knowledge -> Hypothesis -> Diagnosis ->
> Recommendation -> Decision -> Action -> Outcome

Question patterns organize inquiry without collapsing, converting, or
automatically promoting these layers.

## Conceptual Flow

> Information Gap -> Question Intent -> Question Pattern -> Applicability
> Conditions -> Expected Response Type -> Evidence Need Reference -> Human Review

This is a governed traceability model. Every association is explicitly authored
and reviewed. No arrow means automatic selection, rendering, branching,
diagnosis, inference, ranking, or promotion.

## Documents

- [Purpose and Boundary](question-bank-purpose-and-boundary.md)
- [Concept Model](question-bank-concept-model.md)
- [Question Intent Taxonomy](question-intent-taxonomy.md)
- [Question Pattern Model](question-pattern-model.md)
- [Applicability and Trigger Model](applicability-and-trigger-model.md)
- [Response Expectation Model](response-expectation-model.md)
- [Neutrality and Bias Control](neutrality-and-bias-control.md)
- [Authoring, Review, and Lifecycle](authoring-review-and-lifecycle.md)
- [Architecture Pattern Examples](question-pattern-examples.md)

## Architecture Principles

- Meaning, intent, scope, applicability, exclusions, response expectations,
  evidence relevance, authorship, and review remain visible.
- The same governed inputs and rules yield the same descriptive classification.
- Missing information remains explicit and may be answered as unknown,
  unavailable, not recorded, or not applicable.
- Thai-first wording may coexist with independently reviewed English technical alignment.
- Future SPA and Agronomist workflows may present patterns but may not select or
  sequence them automatically under this architecture.

## Out of Scope

This family is not a diagnosis or recommendation engine, decision tree, SPA
form, UI workflow, AI ranking system, or crop-specific dataset. It defines no
identifier syntax, schema, serialization, database, code class, API payload,
runtime mapping, scoring, selection algorithm, production question record,
diagnosis, pesticide guidance, treatment selection, or image-classification logic.

## Change Control

Examples are architecture illustrations only. Material change requires review
against controlling knowledge governance, Design Freeze, and Publication Boundary.
