# Observation Confidence and Uncertainty

Status: Active

Version: 1.0

## Purpose

Govern transparent discussion of observation reliability and uncertainty without
creating a numeric confidence score, truth probability, diagnosis, recommendation,
hypothesis, or automatic decision.

## Confidence Boundary

For Observation, “confidence” MUST mean an explainable review of named dimensions
of capture and record reliability. It MUST NOT mean confidence that a cause,
identity, Claim, diagnosis, recommendation, or hypothesis is correct.

No single score, percentage, grade, color, ranking, or badge MAY replace the
underlying dimensions. Evidence level and Source tier MUST remain separate from
observation reliability.

## Review Dimensions

A human review MAY describe, with reasons:

- **record integrity:** whether the preserved account is complete and unaltered;
- **provenance integrity:** whether origin, custody, and transformations are
  reconstructable;
- **observer attribution:** whether responsibility and relevant competence are
  known without treating prestige as proof;
- **method transparency:** whether the capture method and limitations are known;
- **instrument or medium condition:** whether relevant state, calibration,
  resolution, or degradation is documented;
- **context completeness:** whether material time, setting, scope, and conditions
  are available;
- **repeatability information:** whether repeated capture used a declared method,
  without assuming independence or generality;
- **result ambiguity:** whether the descriptive Result admits multiple readings;
  and
- **rights and availability:** whether authorized reviewers can inspect the
  necessary basis.

Each dimension SHOULD be expressed qualitatively with rationale, supporting
provenance, reviewer identity, date, exact Observation version, and limitations.

## Uncertainty Types

Uncertainty MAY arise from missing context, observer limitation, instrument
limitation, sampling, classification ambiguity, transcription, translation,
transformation, dependence among observations, unavailable source material,
conflicting accounts, or rights restrictions. Different types MUST NOT be merged
into an unexplained value.

## Deterministic and Human-reviewable Assessment

The assessment procedure and permitted qualitative outcomes MUST be explicit and
versioned. The same exact inputs and rule version SHOULD yield the same mechanical
completeness observations, while substantive judgment remains attributable to a
qualified human reviewer. Disagreement MUST be preserved rather than averaged.

## Evidence-first Rule

Observation reliability assessment determines whether the descriptive record is
reviewable for a purpose. It does not determine whether it supports a Claim.
Evidence assessment MUST occur separately through an Evidence Object with an
exact Claim, Source, locator, applicability, and review basis.

## Prohibited Uses

Observation confidence MUST NOT:

- confirm identity or cause;
- promote repetition into general knowledge;
- generate or rank diagnoses;
- generate a recommendation;
- generate, select, or strengthen a hypothesis;
- establish regulatory permission, safety, or efficacy;
- automate acceptance or publication; or
- conceal missing or adverse information behind a summary status.

## Fictional Example

A reviewer records that fictional Observation O-Lantern has traceable custody
and declared method but incomplete context and an unavailable instrument-state
detail. No aggregate rating is assigned, and no conclusion follows.

## Non-example

“92% confident, therefore Cause Ember” invents a score and converts observation
review into causal and diagnostic meaning. It MUST be rejected.

## Future Implementation Considerations

Future review instruments MAY present named dimensions and rationales. Automated
scores, predictive models, rankings, or LLM assessments are outside scope and
require separate authority.
