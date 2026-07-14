# Traceable Explanation Services

The `cpmoakb.explain` package implements [RAS-006](specifications/RAS-006-explanation-service-contract.md). It converts explicit Runtime facts into immutable structured explanations; it does not reason beyond those facts.

## Structured model and public API

`Explanation` contains a controlled type and availability, optional subject, ordered `ExplanationFact` values, ordered `ExplanationReference` values, ordered `ExplanationLimitation` values, and an optional deterministic summary. Facts identify field path, explicit value, role, and optional reference. No model contains a confidence score or automatic timestamp.

`ExplanationService` provides explicit methods for one query match, one validation issue, record evidence, record status, and unavailable requests. Equivalent pure builder functions and `render_explanation()` are intentional public APIs.

## Explanation behavior

- Query explanations preserve record ID, matched field, actual matched value, mode, language/locale, and supplied criteria. Label matches carry a limitation that matching does not establish identity.
- Validation explanations preserve rule ID, mechanical severity, message, record/path, supplied remediation, and optional rule metadata. They do not reinterpret severity as scientific risk.
- Evidence explanations distinguish source metadata references, evidence locators and roles, provenance, review status, uncertainty, and ambiguity. Missing evidence produces a Partial explanation with a stable limitation.
- Status explanations expose record kind, lifecycle, ambiguity, supersession, and separately supplied identifier custody. Lifecycle is not custody, scientific truth, or publication readiness.
- Scientific, diagnostic, recommendation, causal, and missing-input requests return structured Unavailable explanations without placeholder facts.

Facts sort by field path, role, value, and reference; references by type, identifier, and path; limitations by code, message, and missing input. The renderer uses a fixed plain-text template with separate Facts, Supporting references, and Limitations sections. It renders only structured fields and is not generative reasoning.

All operations are explicit. Query and validation do not auto-run explanations. The package performs no network, persistence, AI, LLM, graph, diagnosis, or recommendation operation and uses only supplied immutable Runtime objects.

Tests use synthetic fictional data only. Explanation is not diagnosis, recommendation, or scientific proof. It does not approve sources, rank authorities, create missing evidence, or promote candidates. Real Rice candidate authoring remains blocked.
