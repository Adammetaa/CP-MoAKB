# ADR-001: Evidence-First and Traceable

- Status: Accepted
- Date: 2026-07-13
- Decision owners: CP-MoAKB Product Owner and architecture governance

## Context

Crop-protection knowledge combines scientific classification, regulation, field reports, expert interpretation, and context-specific decisions. These sources differ in authority, scope, currency, and jurisdiction. A statement without provenance cannot be reliably reviewed, updated, contradicted, or applied to a decision.

Future recommendations also carry consequences that make opaque ranking or unexplained automation unsuitable. Users and reviewers need to understand the evidence, assumptions, constraints, alternatives, and missing information behind an output.

## Decision

Every published assertion and every future recommendation must retain provenance and explainability.

At minimum, a material assertion retains its source, source version, citation or locator, assertion type, relevant dates, jurisdiction where applicable, review status, and scope. A future recommendation additionally retains the context, alternatives considered, evidence used, regulatory and safety gates, confidence dimensions, reasoning, and any expert override.

Conflicting evidence is preserved and shown. Source or assertion updates use explicit versioning and supersession rather than silent replacement.

## Consequences

- Provenance is part of the knowledge model rather than optional display metadata.
- Query and decision interfaces must expose citations, currency, uncertainty, and review status.
- Data ingestion must preserve source values and transformation history.
- Regulatory, scientific, observational, and interpretive assertions can be audited independently.
- Storage and review workflows will be more complex than an unversioned fact table.
- Outputs may need to defer a conclusion when evidence or traceability is insufficient.

## Alternatives considered

### Store only final normalized facts

Rejected because normalization without retained provenance hides conflicts, source changes, and review decisions.

### Attach citations only to documents or final reports

Rejected because assertion-level support, contradiction, jurisdiction, and temporal validity would remain ambiguous.

### Provide recommendations from an opaque ranking score

Rejected because a score alone cannot explain legal gates, alternatives, missing information, or evidence applicability.

## Scope

This decision governs future published knowledge, evidence assertions, regulatory facts, field-derived knowledge, and recommendations. It does not require that every raw technical log become public, but material decision inputs and transformations must remain auditable under appropriate access controls.

## Relationship to Design Freeze

This ADR is documentation-only and changes no parser, exporter, schema, validator, source, golden baseline, or generated artifact. Implementing assertion-level provenance may require future schema or technology decisions; those require separate approval and must not be inferred from this ADR.

Related documents: [Product Vision](../PRODUCT_VISION.md), [Source Policy](../SOURCE_POLICY.md), [Evidence Levels](../EVIDENCE_LEVELS.md), and [Knowledge Graph](../KNOWLEDGE_GRAPH.md).
