# Observation Context

Status: Active

Version: 1.0

## Purpose

Define the conceptual context required to explain the bounded meaning of an
Observation without prescribing fields or mandatory machine structure.

## Context Principle

Observation meaning is inseparable from the conditions under which capture
occurred. Context MUST be sufficient for a competent reviewer to understand the
descriptive account, its limitations, and whether it can be considered for a
later Evidence question. Missing context MUST remain missing.

## Context Dimensions

Depending on the observation purpose, relevant context MAY include:

- observed referent identity or explicit unresolved status;
- observer, reporter, custodian, or instrument responsibility;
- observation time, duration, sequence, and recording time;
- location or setting at the minimum resolution permitted by privacy, rights,
  security, and scientific need;
- capture method, protocol reference, instrument state, units, calibration, and
  detection or classification limits;
- sample, individual, group, area, event, or process scope;
- environmental, operational, or situational conditions that affect what could
  be perceived or measured;
- language, terminology, transcription, translation, and reporting channel;
- selection, sampling, missingness, access, consent, custody, and rights
  limitations; and
- related observation identities and declared dependency.

This list states conceptual questions, not schema fields. A dimension MAY be not
applicable, unknown, unavailable, withheld under authority, or disputed with a
reason.

## Context Versus Meaning

Context bounds an Observation but MUST NOT be treated as cause, explanation,
diagnosis, recommendation, hypothesis, or proof of a Relationship. Temporal
sequence does not establish causality. Spatial proximity does not establish
identity or association. A reported prior action does not establish efficacy or
confirm any interpretation.

## Determinism

Context transformations MUST be declared and reproducible. Unit conversion,
time normalization, terminology mapping, privacy generalization, or translation
MUST preserve the original value or reference, the rule and version used, the
responsible actor or process, and known loss. Silent normalization is prohibited.

## Traceability and Review

Every context statement SHOULD trace to the observer, instrument, source record,
method, or authorized transformation that supplied it. Review MUST distinguish
observed context from reported context, derived administrative context, and
unknown context.

## Privacy and Rights

Context MAY contain sensitive location, person, organization, or custody
information. Access, redaction, generalization, retention, and publication MUST
follow competent privacy, rights, and publication authority. Public absence of
restricted detail MUST NOT be represented as absence in the original record.

## Crop Independence

Context roles MUST remain general. A future domain MAY reference crop-specific
Concepts or methods, but it MUST NOT alter the epistemic distinction between
what was captured and why it may matter.

## Fictional Example

Fictional Context C-North records an invented time interval, declared Method
M-Window, sample scope, language, and an unavailable instrument-state detail.
The missing detail stays visible and limits review.

## Non-example

“Observed after Event Ember, therefore caused by Event Ember” converts temporal
context into a causal conclusion and MUST be rejected.

## Future Implementation Considerations

Future privacy models, unit services, context vocabularies, or capture systems
require separate approval. This document defines no data shape or automation.
