# Observation Vocabulary Neutrality and Non-inference Rules

Status: Active

Version: 1.0

## Purpose

This document defines mandatory tests that prevent observation terminology from
encoding inference, diagnosis, or recommendation.

## Core Rules

1. A term MUST name what is observable or measurable, not an inferred cause.
2. A definition MUST NOT require a hypothesis or diagnosis to be true.
3. Damage morphology MUST NOT be named by an inferred pest identity.
4. A color, shape, distribution, or temporal pattern MUST NOT assert disease or
   nutrient status.
5. Presence of an organism MAY be described only when the organism itself was
   observed and its identity basis is separately reviewable.
6. Absence MUST be bounded by method, place, time, and detection conditions.
7. Uncertainty MUST be explicit and MUST NOT be converted into confidence in a
   diagnosis.
8. Composition of individually neutral terms MUST also remain neutral.
9. A label MUST NOT prescribe pesticide need, treatment, safety, regulation,
   prediction, recommendation, decision, or action.
10. Review approval MUST NOT promote Observation to Evidence, Knowledge,
    Hypothesis, Diagnosis, or Recommendation.

## Acceptable Architecture Illustrations

The following forms illustrate morphology- or perception-first language. They
are examples of expression patterns, not approved vocabulary records:

- spindle-shaped lesion;
- linear translucent streak;
- leaf margin discoloration;
- clustered circular spots; and
- insects observed on lower leaf surface.

Each still requires a definition, language review, context, provenance, and
governed approval before any future use as a controlled term.

## Prohibited Architecture Illustrations

The following forms MUST NOT be accepted as neutral observation vocabulary:

- blast lesion;
- bacterial streak damage;
- stem-borer symptom;
- nitrogen-deficiency yellowing; and
- insecticide-resistant population.

They encode or presuppose disease, causal agent, inferred pest identity,
deficiency, resistance, or another downstream interpretation.

## Review Test

For each candidate, reviewers MUST identify the directly observable referent,
remove presumed causes, identify context required for interpretation, and test
whether two independent reviewers can apply the definition without choosing a
diagnosis. A candidate that fails MUST be revised, prohibited for neutral use,
or routed to the correct downstream governance layer.

## Preserving Conflict

When reviewers disagree about whether wording is neutral, the conflict and both
rationales MUST be recorded. Ambiguity MUST NOT be resolved by silently choosing
the more diagnostic interpretation. Publication eligibility MUST wait for an
authorized decision.
