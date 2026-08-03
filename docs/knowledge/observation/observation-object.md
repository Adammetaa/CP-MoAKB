# Observation Object

Status: Active

Version: 1.0

## Purpose

Define the conceptual responsibility of one Observation Object without defining
a machine record.

## Definition

An **Observation Object** is a stable-identity, context-bound account that a
declared observer or instrument perceived, measured, counted, imaged, reported,
or otherwise captured something at a declared time and setting. It preserves
what was captured and the conditions of capture without converting that account
into explanatory or generalized knowledge.

## Canonical Responsibility

One Observation Object owns one coherent observation event or bounded set of
inseparable capture acts. It MUST preserve:

- stable observation identity independent from label, filename, location, and
  representation;
- the observed referent or explicitly unresolved referent;
- the descriptive result as captured, including units or categories only when
  declared by the observation method;
- observation context, method, observer or instrument responsibility, time,
  scope, limitations, and provenance;
- exact version and correction history; and
- review status without implying scientific acceptance.

These are conceptual responsibilities, not fields or data types.

## Epistemic Separation

Observation is not Source identity, although an observation record MAY be
nominated through a Source Object. Observation is not Evidence until an Evidence
Object evaluates it against a precise Claim. Observation is not a Claim, Concept,
Relationship, interpretation, diagnosis, recommendation, or hypothesis.

An observation that reports an attributed interpretation MUST preserve that
statement as reported content and MUST NOT adopt the interpretation as the
Observation Object's own meaning.

## Identity and Version

Identity MUST be label-independent, non-reused, and governed under ADR-006.
Correction of transcription, context, method, observer attribution, result, or
limitation MUST produce a preserved successor version or correction relationship.
The prior version MUST NOT be overwritten.

Two reports of apparently similar circumstances MUST remain separate
Observation identities unless competent governance determines that they are the
same capture event. Similarity, proximity, shared observer, or matching values
MUST NOT establish identity.

## Lifecycle

Conceptual lifecycle MAY include nominated, captured, under completeness review,
reviewed for descriptive fidelity, corrected, disputed, rights-constrained,
withdrawn, superseded, retired, and archived. These states MUST remain distinct
from Evidence review, Claim acceptance, and publication.

## Explainability and Determinism

A qualified reviewer MUST be able to reconstruct the descriptive account from
the preserved context and provenance without guessing missing values. Ordering
of set-like references SHOULD use stable governed identities. Unknown,
unavailable, not observed, not assessed, and not applicable MUST remain distinct;
no missing context MAY be filled by plausibility.

## Ownership and Review

An Observation Custodian owns record integrity and custody. Descriptive review
requires competence in the declared method, context, units or classifications,
and provenance. Custody or review MUST NOT grant authority to diagnose, recommend,
infer a cause, or formulate a hypothesis as observation content.

## Permitted References

An Observation MAY reference Context, Provenance, observer or instrument
Authority, Method, Source, related Observations, Reviews, Findings, Decisions,
Unresolved Issues, and later Evidence Objects. Every reference MUST state its
meaning and exact-version requirement.

## Prohibited Content

The object MUST NOT contain an unstated cause, inferred identity, predicted
outcome, treatment choice, recommendation, diagnosis, hypothesis, numeric truth
score, evidence grade, or automatic relationship. It MUST NOT copy a Source,
Evidence assessment, or Claim into its observation identity.

## Crop Independence

The same responsibilities MUST apply to any observable referent, setting, method,
language, or domain. Domain-specific terms MAY be referenced through governed
Terminology but MUST NOT redefine Observation identity or architecture.

## Fictional Example

Fictional Observation **O-Lantern** records that Observer **A-Pale** used Method
**M-Window** at Time **T-Quiet** and captured descriptive Result **R-Blue** under
Context **C-North**. The result is invented and has no real-world referent. It
does not identify a cause or support an action.

## Non-example

“R-Blue proves Cause Ember and should be treated immediately” collapses an
Observation into causal interpretation, diagnosis, and recommendation and MUST
be rejected.

## Future Implementation Considerations

Future physical mappings MAY be proposed separately. They MUST preserve identity,
context, provenance, corrections, exact versions, privacy, rights, and epistemic
separation and MUST NOT claim that this document is a schema.
