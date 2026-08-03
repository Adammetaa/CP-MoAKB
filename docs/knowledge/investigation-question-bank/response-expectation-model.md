# Response Expectation Model

Status: Active

Version: 1.0

## Expected Response Type

An Expected Response Type describes the kind of response requested by a
Question Pattern. It is not the response itself, does not guarantee that a
response will be supplied, and does not determine validity, truth, evidence
status, or downstream interpretation.

## Response Types

- **Free description:** bounded narrative in the respondent's own words.
- **Yes/no/unknown:** an explicit three-way response where binary wording is appropriate.
- **Controlled observation term:** a separately governed neutral term, with uncertainty allowed.
- **Count:** a bounded enumeration with subject, area, method, and limitations.
- **Measurement with unit:** value, unit, method, context, and uncertainty.
- **Date or time range:** attributable time point, interval, or explicitly unknown bound.
- **Spatial location:** described location at the declared scope and reference frame.
- **Image:** image material with capture context and provenance.
- **Specimen:** specimen availability or capture account with custody context.
- **Management event:** attributable event, timing, scope, and source.
- **Environmental record:** bounded condition record with method and provenance.
- **Source reference:** exact source or origin reference for later governance.
- **Reviewer judgment:** accountable, scoped judgment with rationale and limitations.

An image, specimen, record, or source response is not automatically an
Observation or Evidence Object.

## Response Constraints

A Response Constraint may govern permitted response form, required context,
unit expectation, uncertainty allowance, and explicit allowances for `not
observed`, `not recorded`, `unknown`, `unavailable`, and `not applicable`.
Constraints clarify meaning; they are not schemas, validators, coercion rules,
scores, or interpretations.

## Missing Information

Questions must permit the respondent to distinguish missing and unresolved
states when relevant. An omitted answer must not be silently mapped to “no,”
`not observed`, or `not applicable`. A forced response must not manufacture
precision, a date, a count, an identity, or certainty. Contradictory responses
remain conflicting pending human review.

## Response Review

A human reviewer assesses whether the response matches the requested type,
retains necessary scope and provenance, expresses uncertainty faithfully, and
may address the Information Gap. This assessment does not automatically convert
the response into an Observation, Evidence Need satisfaction, Evidence Object,
Claim, Hypothesis, or Diagnosis.

## Localization and Units

Thai-first labels, date expressions, spatial language, and units require
language and terminology review. Conversion or normalization must preserve the
original expression, method, precision, and uncertainty. Interface controls may
assist entry but may not narrow the approved missing-state choices.
