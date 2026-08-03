# Fictional Author Journey

**Status:** Illustrative design example
**Version:** 0.1.0

## Purpose

Demonstrate the proposed author experience from source nomination through revision and resubmission without creating real knowledge or software behavior.

## Scope and Authority

The actor is a fictional Knowledge Author using fictional objects. KAS governs authoring expectations, KGS governs roles and handoffs, ADR-008 governs source authority, and ADR-009 governs canonical candidate record authority. This example does not redefine them.

## Scenario and User Goal

Author A receives permission to draft a candidate about an abstract entity called **Subject Alpha**. `SOURCE-FICTION-001`, its publisher, excerpt, and all assertions are invented placeholders with no external referent. The goal is to prepare a traceable candidate for human review.

## Journey

1. **Source nomination:** Author A opens Source Candidates, records the fictional source identity, provenance placeholder, access note, nomination rationale, and a human-selected authority classification. The page cites ADR-008 and does not score the source.
2. **Evidence extraction:** The author creates `EVIDENCE-FICTION-001`, preserves a fictional excerpt and surrounding context, records an exact fictional locator, language, limitations, and provenance to the source candidate.
3. **Claim scoping:** The author drafts a narrow, explicitly fictional claim about Subject Alpha. They link the evidence item, state what the excerpt does and does not support, record terminology and ontology authority references, and preserve an alternative interpretation.
4. **Candidate submission:** The author reviews the KAS-aligned template, confirms the version and conflict-of-interest declaration, and submits `CONCEPT-FICTION-001` version 1. Submission creates a handoff, not acceptance or publication.
5. **Revision:** A reviewer returns a major scope finding and a minor terminology finding against fixed version 1. Author A narrows the fictional claim, retains the earlier version, adds a rationale, responds separately to both findings, and creates version 2.
6. **Resubmission:** The author compares versions 1 and 2, confirms the evidence links, and resubmits version 2. The reviewer receives an explicit verification task; the workspace does not infer that the findings are resolved.

## Conceptual Actions and Prohibited Actions

The author may save drafts, link governed references, submit, respond, revise, compare, and resubmit. They may not self-accept, publish, overwrite review history, manufacture evidence, infer scientific meaning, diagnose, recommend, or turn the fictional example into master data.

## Failure and Empty States

If the source authority is unclear, submission pauses for human clarification. If the evidence context is unavailable, extraction remains incomplete. If a template field is empty, the interface names it without filling it. If a finding is disputed, the disagreement follows KGS rather than disappearing.

## Accessibility

The journey must work in logical reading order, identify versions and findings textually, and provide keyboard-accessible comparison and error summaries in any future interface.

## Governance and Audit Requirements

Nomination, extraction, submission, finding response, revision creation, comparison selection, and resubmission need attributable future audit events. Discussion does not substitute for a formal finding or decision.

## Non-example

The workspace suggests a stronger claim from the excerpt and marks the source authoritative. That would violate evidence-before-knowledge, non-inference, and ADR-008 authority.

## Future Implementation Considerations

No identity, persistence, permissions, automation, or UI implementation is authorized by this journey.

## Change Control

Keep all details fictional and review changes against KAS, KGS, ADR-008, ADR-009, and the Publication Boundary.
