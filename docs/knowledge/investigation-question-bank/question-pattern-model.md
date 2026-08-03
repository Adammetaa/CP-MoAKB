# Question Pattern Model

Status: Active

Version: 1.0

## Pattern Meaning

A Question Pattern is reusable guidance for authoring a question, not a stored
question instance or a prompt to execute. Its semantic account includes purpose,
neutral wording structure, scope, applicability, exclusions, expected response,
missing-information allowances, evidence relevance, follow-up meanings,
language context, provenance, review, and lifecycle standing.

These are conceptual responsibilities, not fields or a record format.

## Required Distinctions

A pattern remains distinct from:

- a rendered question instance contextualized for a particular case;
- the Observation that may motivate investigation;
- the Information Gap the question may help address;
- an Evidence Need or Evidence Need Reference;
- any material or separately assessed Evidence Object;
- a Claim or authored Hypothesis Candidate;
- Diagnosis and Recommendation.

Neither pattern approval nor question rendering crosses these boundaries.

## Wording Architecture

Wording should be open or bounded-neutral, ask one reviewable purpose where
practical, identify the relevant scope, and permit uncertainty. Substitution
slots, if a future implementation uses them, must not accept diagnostic or
causal assumptions that alter the approved meaning. A declarative sentence with
an appended confirmation request is not neutral merely because it ends with a question mark.

## Question Instance Boundary

A human authors an instance by choosing a reviewed pattern, establishing its
relevance to a gap, supplying only authorized context, selecting language, and
reviewing the rendered wording. The instance must retain traceability to the
pattern version and human decision. An answer belongs to the case context, not
to the reusable pattern.

## Pattern Relationships

A pattern may express one or more Question Intents, use a Question Scope, have
Applicability, Trigger, and Exclusion Conditions, expect a Response Type with
constraints, reference an Evidence Need, and relate to other patterns through
reviewed follow-up meanings. None of these associations determines use or order.

## Determinism and Versioning

The same approved pattern version, declared context, language basis, and human
authoring choices should produce the same descriptive interpretation. Material
changes to intent, neutrality, scope, conditions, response expectations, or
evidence relevance require revision and review. History and replacement
relationships remain visible.

## Implementation Neutrality

No syntax for pattern identifiers, interpolation, schemas, templates, forms,
APIs, databases, or rendering is defined. Future implementations must preserve
authorship, version traceability, missing-state choices, and independent review.
