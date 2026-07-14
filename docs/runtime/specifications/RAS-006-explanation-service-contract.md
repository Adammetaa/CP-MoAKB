# RAS-006: Explanation Service Contract

**Status:** Active

**Version:** 1.0

This specification governs structured explanations built from explicit Runtime objects. It applies [RAS-001](RAS-001-runtime-engineering-standard.md), preserves the [validation](RAS-002-validation-framework.md) and [query](RAS-005-query-service-contract.md) boundaries, and may consume immutable custody entries governed by [RAS-004](RAS-004-registry-contract.md).

## Purpose and explanation types

Explanation services MUST expose traceable reasons already present in supplied Runtime objects and MUST NOT create new agricultural claims. Supported types are Query Match, Validation Issue, Record Evidence, Record Status, and Explanation Unavailable.

Explanations MUST be deterministic, structured, traceable, read-only, side-effect free, based only on explicitly supplied objects, explicit about missing information, and independent of current time, network state, and environment locale.

## Non-inference policy

Services MUST NOT infer diagnosis, recommendation, causation, identity equivalence, source approval, authority ranking, scientific correctness, evidence sufficiency, or publication readiness. They MUST NOT fabricate citations or evidence, generate confidence scores, or fill missing facts with plausible text.

An unavailable scientific, diagnostic, recommendation, causal, or missing-input request MUST return a structured Unavailable explanation rather than a guess. Framework exceptions SHOULD be reserved for contradictory inputs, unsupported object types, and rendering defects.

## Structure and traceability

The structured model is the source of truth. Every explanation SHOULD identify its type, availability, subject where supplied, supporting field facts, canonical references, and limitations. Query explanations SHOULD preserve matched field, actual value, match mode, language, locale, and explicit criteria. Validation explanations SHOULD preserve rule ID, mechanical severity, message, record, field, and supplied remediation.

Evidence explanations MAY expose attached source identifiers, evidence locators and roles, reviewer status, provenance actor/reviewer roles, ambiguity notes, and lifecycle. Attachment MUST NOT be described as proof. Status explanations MAY include explicitly supplied custody state but MUST distinguish custody from record lifecycle and production promotion.

Facts MUST sort by field path, role, value, and reference. References MUST sort by reference type, identifier, and field path. Limitations MUST sort by stable code, message, and missing-input description.

## Rendering boundary

Deterministic text rendering MAY be provided as fixed templating over the structured model. Rendering MUST preserve stable ordering, MUST NOT use randomness or locale-sensitive transformation, and MUST NOT introduce facts absent from the structured explanation. Rendering is not natural-language reasoning.

Explanation operations MUST remain explicit. Query and validation services MUST NOT auto-run explanations, and explanation services MUST NOT mutate their inputs or access persistence, networks, AI systems, or language models.
