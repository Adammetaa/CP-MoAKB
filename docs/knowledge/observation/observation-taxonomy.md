# Observation Taxonomy

Status: Active

Version: 1.0

## Purpose

Provide crop-independent conceptual classification dimensions that make
observations understandable and reviewable without creating controlled
vocabulary values, enums, or a schema.

## Taxonomy Principles

Classification MUST describe the observation responsibility, not its truth,
importance, diagnostic value, or recommendation value. Each assigned category
MUST have declared meaning, authority, provenance, version, and review status.
Unknown or disputed classification MUST remain explicit.

The dimensions are independent. Assigning a category on one dimension MUST NOT
determine another category or create a hidden score.

## Conceptual Dimensions

### Capture Responsibility

An observation MAY distinguish direct human capture, instrument-mediated
capture, attributed third-party report, or combined responsibility. The category
MUST disclose who or what performed capture and who recorded it.

### Result Form

An observation MAY describe qualitative perception, quantitative measurement,
count, categorical classification, image or media capture, text report, or
explicit absence under a declared method. These labels MUST NOT define machine
types or guarantee methodological fitness.

### Temporal Pattern

An observation MAY be instantaneous, interval-bounded, repeated under a declared
protocol, or retrospective report. Repeated MUST NOT imply independent,
representative, or corroborating.

### Spatial and Situational Scope

An observation MAY concern a point, bounded area, sample, individual, group,
process, event, controlled setting, or other declared scope. Privacy-protective
generalization MUST remain distinguishable from original capture resolution.

### Method Status

Method status MAY be declared, partially known, unavailable, disputed, or not
applicable. “Declared” MUST NOT imply validated, standardized, or suitable for a
later Claim.

### Completeness Status

Completeness MAY be sufficient for descriptive review, incomplete, rights-
constrained, context-limited, unavailable for verification, or disputed. It MUST
NOT be converted into a percentage or truth score.

### Review Status

Review status MAY distinguish unreviewed, completeness-reviewed,
descriptively-reviewed, corrected, disputed, withdrawn, superseded, retired, or
archived. Observation review MUST NOT equal Evidence review or Knowledge
acceptance.

## Deterministic Classification

Classification criteria MUST be explicit enough that the same exact observation
version and the same governed criteria yield the same category decision. When
criteria do not resolve a category, the result MUST remain unknown or disputed;
reviewers MUST NOT choose the nearest convenient label.

## Evidence-first Boundary

Taxonomy is for observation management and explanation. Categories MUST NOT
rank Evidence, select a diagnosis, generate a hypothesis, recommend an action,
or infer causal or semantic Relationships.

## Crop Independence

The taxonomy MUST classify how observation occurred rather than what crop,
organism, condition, or product was observed. Domain-specific refinements MAY be
proposed later but MUST conform to these dimensions and receive separate review.

## Fictional Example

Fictional Observation O-Lantern is classified as direct human capture,
qualitative perception, interval-bounded, sample-scoped, declared-method, and
incomplete. Those categories describe custody and capture only.

## Non-example

Classifying O-Lantern as “high confidence diagnostic evidence” combines taxonomy,
Evidence assessment, confidence scoring, and diagnosis and MUST be rejected.

## Future Implementation Considerations

Future vocabularies MAY define governed terms after ADR-007 review. This document
does not create term lists, identifiers, code values, validation rules, or UI
filters.
