# ADR-002: Separate Observation, Evidence, Regulation, and Recommendation

- Status: Accepted
- Date: 2026-07-13
- Decision owners: CP-MoAKB Product Owner and architecture governance

## Context

A farmer's field report, a peer-reviewed causal finding, an official registration, an expert interpretation, and a context-specific recommendation are different kinds of records. Treating them as interchangeable can turn association into causality, classification into suitability, or an observed treatment outcome into proof of diagnosis.

These concepts also have different provenance, review, privacy, temporal, and jurisdiction requirements.

## Decision

Field observations, scientific evidence, regulatory facts, expert interpretations, and recommendations are distinct domain concepts with explicit relationships.

- An Observation records what was reported, seen, measured, or done in context.
- Evidence supports or contradicts a precise assertion.
- A regulatory fact records an official jurisdiction-specific legal state or condition.
- Expert interpretation records attributed reasoning over observations and evidence.
- A Recommendation is a future context-specific proposed action after evidence, IPM, regulation, safety, and other constraints are evaluated.

Promotion from observation to published knowledge follows an explicit review lifecycle. No concept is converted silently into another.

## Consequences

- Original field records remain distinguishable from reviewed assertions.
- Treatment response does not automatically confirm diagnosis, efficacy, or resistance.
- Regulatory permission cannot be inferred from scientific literature or classification.
- Recommendation logic must link to, but remain distinct from, evidence and legal facts.
- Interfaces need clear labels for assertion type and review status.
- Additional entities and workflows may be required in a future physical model.

## Alternatives considered

### Use one generic fact record

Rejected because a single undifferentiated record would obscure authority, privacy, causality, review, and legal meaning.

### Promote repeated observations automatically

Rejected because repeated reports may share bias, lack independence, omit alternatives, or reflect the same erroneous diagnosis.

### Treat expert recommendation as evidence

Rejected because a recommendation is an output of contextual reasoning; its supporting evidence must remain separately inspectable.

## Scope

This decision applies to future field intelligence, evidence management, regulatory knowledge, diagnosis support, and recommendations. It also guides terminology in architecture documentation. It does not change the current IRAC node model.

## Relationship to Design Freeze

The decision is conceptual and documentation-only. No existing schema, parser, exporter, validator, test, source, or canonical record is changed. Any physical implementation requires a separate approved model and migration plan.

Related documents: [Domain Model](../DOMAIN_MODEL.md), [Field Knowledge Policy](../FIELD_KNOWLEDGE_POLICY.md), [Evidence Levels](../EVIDENCE_LEVELS.md), and [Decision Engine](../DECISION_ENGINE.md).
