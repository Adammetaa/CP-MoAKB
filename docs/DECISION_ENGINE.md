# Conceptual Decision-Support Workflow

## Status and boundary

This document defines a future decision-support workflow only. It does not implement diagnosis, recommendation, product selection, or rate calculation. It does not authorize new runtime behavior, data integration, schema changes, or regulatory claims.

The workflow applies the principles in [Product Vision](PRODUCT_VISION.md), the concepts in [Domain Model](DOMAIN_MODEL.md), and the governance in [Source Policy](SOURCE_POLICY.md), [Evidence Levels](EVIDENCE_LEVELS.md), and [Field Knowledge Policy](FIELD_KNOWLEDGE_POLICY.md).

## Staged process

### 1. Collect context

Record the user's objective, jurisdiction, field context, date, available evidence, and urgency. Show which required fields remain missing.

### 2. Identify crop and growth stage

Resolve the crop and, where possible, variety, age, and growth stage using governed identities. Preserve uncertainty if identification is incomplete.

### 3. Record plant part and symptoms

Describe affected plant parts and symptoms using structured terms plus the observer's original wording. Do not infer a cause from symptom labels.

### 4. Record signs and field distribution

Capture direct signs, spatial pattern, affected proportion, within-plant distribution, and progression. Distinguish Signs from Symptoms.

### 5. Gather environment and management history

Record weather, irrigation, soil context, neighboring patterns, recent practices, inputs, timing, and relevant prior interventions without silently correcting the report.

### 6. Generate differential causes

Produce multiple plausible biotic and abiotic causes, each linked to supporting and contradicting evidence. Do not present the highest-ranked possibility as confirmed.

### 7. Request discriminating observations

Ask for the observations, measurements, sampling, expert inspection, or laboratory confirmation most likely to distinguish among candidates. Explain why each request matters.

### 8. Assess severity and economic threshold

Use a governed monitoring method and context-appropriate threshold when available. If no reliable threshold is available, state that limitation rather than inventing one.

### 9. Select non-chemical management options

Consider prevention, monitoring, cultural, mechanical, and biological options, including the option to observe without immediate intervention. Describe evidence, feasibility, and constraints.

### 10. Determine whether chemical intervention is justified

Evaluate whether the diagnosis confidence, severity, threshold, expected loss, timing, and non-chemical options justify considering a chemical option. Diagnosis uncertainty must remain visible.

### 11. Check MoA and resistance history

Review relevant Mode of Action classification and field treatment history for resistance-management context. MoA membership alone does not establish suitability or legal use.

### 12. Check current Thai registration and official label

For Thailand, verify the current official registration and current official label for the specific product, crop, target, and use pattern. If verification is missing or stale, do not recommend the use.

### 13. Check safety, PPE, PHI, REI, and environmental constraints

Extract constraints from current official sources and labels. Do not infer missing requirements. Identify conflicts with worker safety, harvest timing, water protection, non-target organisms, or site conditions.

### 14. Compare legal and agronomically suitable options

Compare only options that pass legal and material safety gates. Separate evidence for biological suitability from registration and label permission.

### 15. Calculate cost scenarios

Use dated price and operational inputs, explicit assumptions, uncertainty ranges, expected duration, reapplication risk, and expected loss. A cost scenario is not an efficacy guarantee.

### 16. Provide an explainable recommendation

If sufficient evidence and authority exist, present the proposed action, alternatives, confidence, assumptions, missing information, legal basis, safety constraints, and evidence trail. Otherwise provide a next-step plan rather than an unsupported recommendation.

### 17. Record follow-up outcome

Capture what was done, observed result, timing, environment, and review. Keep the outcome as a field observation until it passes the governed promotion lifecycle.

## Mandatory safeguards

- Never diagnose conclusively from one image alone.
- Never recommend an unregistered use.
- Never invent an application rate.
- Never treat MoA membership as proof of field suitability.
- Never equate low price with best value.
- Clearly separate diagnosis confidence from treatment confidence.
- Require current label verification.
- Prioritize IPM and non-chemical options.
- Show missing information.
- Show alternative explanations and contradictory evidence.
- Allow expert override only with identity, rationale, evidence, date, and an audit trail.
- Do not translate treatment response into automatic proof of diagnosis or resistance.
- Stop when legal, safety, source, or identity requirements are unresolved.

## Confidence separation

At least four confidence dimensions should remain separate:

- **Observation confidence:** reliability and completeness of the reported or measured facts.
- **Diagnosis confidence:** support for a proposed cause relative to alternatives.
- **Treatment confidence:** support for expected management suitability in the specific context.
- **Regulatory confidence:** freshness and authority of registration and label verification.

A high score in one dimension cannot compensate for failure in another. For example, a well-supported pest identification does not create legal permission for a product use.

## Explainable output contract

A future output should show:

1. the context used;
2. the leading and alternative explanations;
3. evidence for and against each material assertion;
4. missing and requested information;
5. severity or threshold basis;
6. IPM and non-chemical options considered;
7. regulatory and label verification state;
8. safety and environmental constraints;
9. cost assumptions if calculated;
10. confidence by dimension; and
11. an auditable reason for the conclusion or decision to defer.

## Sample question flow: rice leaf symptom

This example names no commercial product, pesticide, or application rate.

1. Which rice variety and growth stage are present, and when did the symptom first appear?
2. Which leaf position and plant parts are affected: older leaves, younger leaves, margins, tips, veins, or the whole blade?
3. What does the symptom look like in the observer's own words, and how has it progressed?
4. Are there direct Signs such as organisms, feeding evidence, deposits, structures, or exudates?
5. Is the field pattern scattered, edge-associated, patchy, row-related, low-area concentrated, or uniform?
6. What proportion of plants and leaves is affected, using a stated sampling method?
7. What recent weather, water, soil, fertilizer, and management events occurred?
8. Do neighboring fields or unaffected areas share the same environment and management history?
9. Which additional close-up, whole-plant, and field-pattern images or physical samples are available?
10. Which observations would distinguish likely insect, disease, nutrient, water, weather, or chemical-injury explanations?
11. Is there a validated monitoring method or economic threshold for the confirmed cause and current stage?
12. Which preventive or non-chemical actions remain feasible while confirmation is pending?

If the cause cannot be discriminated reliably, the correct output is a structured uncertainty statement and a plan for further observation or qualified review, not a chemical recommendation.

## Expert override

Expert override is a governed future action, not an unrecorded shortcut. It must retain the original system assessment, expert identity and role, timestamp, rationale, sources, changed decision, confidence, and follow-up requirement. Overrides do not erase contradictory evidence or bypass legal and safety gates.

## Implementation gates

Before implementation, the Product Owner and domain governance process must approve data sources, identity rules, privacy controls, confidence semantics, threshold governance, regulatory freshness requirements, review responsibilities, and audit retention. Physical architecture remains undecided.
