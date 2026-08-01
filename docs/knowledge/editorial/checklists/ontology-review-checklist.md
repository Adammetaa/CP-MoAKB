# Ontology Reviewer Checklist

Status: Active
Version: 1.0

## Purpose
Review conceptual layers and relationship semantics without physical implementation.
## Scope
Identity boundaries, concept distinction, predicate, direction, inverse, and risk.
## Out of Scope
This checklist MUST NOT define schema, graph behavior, traversal, or inference.
## Authority
Use under the [handbook](../knowledge-editorial-handbook.md), ADR-005, and KAS-006.
## Definitions
**RR** means revision required; **N/A** requires a reason.
## Responsibilities
Ontology Reviewer declares competence and completes every row.
## Procedure
Mark one result per row; separately review each relationship candidate.
## Required Inputs
Concept candidates, relationship candidates, evidence, scope, and predicate definitions.
## Required Outputs
Checklist, semantic disposition, revisions, and escalation.
## Review Points
| Review item | Pass | Fail | N/A | RR | Reviewer notes |
| --- | --- | --- | --- | --- | --- |
| Identity and labels remain separate | [ ] | [ ] | [ ] | [ ] | |
| Epistemic and conceptual layers are not collapsed | [ ] | [ ] | [ ] | [ ] | |
| Predicate, direction, inverse, endpoints, and scope are explicit | [ ] | [ ] | [ ] | [ ] | |
| High-risk relationships have evidence and competent review | [ ] | [ ] | [ ] | [ ] | |
| No transitive, inverse, causal, diagnostic, or recommendation inference appears | [ ] | [ ] | [ ] | [ ] | |
## Failure Modes
Physical-model prescription, duplicate fact, automatic inverse, or implicit causation.
## Examples
A non-causal fictional relationship MAY remain unresolved.
## Non-examples
Co-occurrence converted to causation MUST NOT pass.
## Escalation
Scientific meaning goes to Scientific Review; ontology conflict follows KGS-004.
## Audit Requirements
Retain predicate version, findings, competence, decision, and dissent.
## Change Control
Conceptual changes require ADR/KAS impact review.
## Future Considerations
Implementation mapping requires separate architecture scope; this is not a software form.
