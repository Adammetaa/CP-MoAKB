# Investigation Blueprint

Status: Active

Version: 1.0

## Purpose

This product blueprint defines how a real crop investigation case may progress
from incomplete intake through human-reviewed investigation without jumping to
diagnosis or pesticide recommendation. It bridges governed Knowledge
Architecture, future SPA workflow, evidence collection, human review, a future
Rice Vertical Slice, and an Explainable Investigation MVP.

The primary production user is the Service Provider Advisor (SPA). Secondary
users are Service Providers, Agronomists, Scientific Reviewers, and Knowledge
Reviewers. Role names describe responsibilities, not permanent technical identities.

## Authority

The [Investigation Ontology](../../knowledge/investigation/README.md) controls
investigation meaning. The
[Investigation Question Bank Architecture](../../knowledge/investigation-question-bank/README.md)
controls question-pattern use. Observation, evidence, knowledge, review, and
publication authorities remain unchanged.

## Permanent Separation

> Observation -> Evidence -> Knowledge -> Investigation -> Hypothesis ->
> Differential Comparison -> Human Review -> Management Options -> Decision ->
> Action -> Outcome

Reported information is not verified information. Information Gap is not a
negative Observation. Question Pattern is not a Question Instance. Evidence Need
is not an Evidence Object. Hypothesis Candidate is not Diagnosis. Investigation
Finding is not Claim. Management Option is not Recommendation or Decision.
Decision, Action, and Outcome remain separate.

## Governed Journey

> Case Received -> Case Intake -> Information State Review -> Observation
> Capture -> Information Gap Identification -> Investigation Question Selection
> -> Evidence Collection -> Evidence Sufficiency Review -> Hypothesis Candidate
> Authoring -> Differential Comparison -> Human Review -> Reviewed Investigation
> Finding -> Management Options Eligibility -> Decision -> Action -> Outcome Follow-up

This journey is a traceability model, not executable workflow logic. No arrow
means automatic progression, question selection, evidence acceptance, hypothesis
ranking, diagnosis, recommendation, or decision.

## Documents

- [Purpose and Boundary](investigation-blueprint-purpose-and-boundary.md)
- [Investigation Case Model](investigation-case-model.md)
- [SPA Investigation Journey](spa-investigation-journey.md)
- [Investigation Stage Model](investigation-stage-model.md)
- [Intake and Information Readiness](intake-and-information-readiness.md)
- [Evidence Collection Blueprint](evidence-collection-blueprint.md)
- [Hypothesis and Differential Workspace](hypothesis-and-differential-workspace.md)
- [Human Review and Escalation](human-review-and-escalation-model.md)
- [Output and Visibility](investigation-output-and-visibility-model.md)
- [Minimum SPA MVP Scope](minimum-spa-mvp-scope.md)
- [Architecture Pattern Examples](blueprint-pattern-examples.md)

## Out of Scope

This family defines no software, Runtime behavior, dataset, diagnosis system,
schema, storage, identifier, API, UI screen, wireframe, form, decision tree,
scoring model, selection logic, pesticide content, recommendation logic, AI,
image classification, or release artifact.
