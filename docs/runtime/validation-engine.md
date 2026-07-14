# Deterministic Validation Engine

The `cpmoakb.validation` engine performs format-neutral mechanical validation of constructed candidate records according to [RAS-002](specifications/RAS-002-validation-framework.md). It is additive to the legacy IRAC document validator and does not change that API.

## Public API and execution

`ValidationLayer`, `RuleMetadata`, `ValidationRule`, `ValidationContext`, `ValidationProfile`, `GENERIC_CANDIDATE_PROFILE`, `GENERIC_BATCH_PROFILE`, `validate_record`, `validate_records`, and the framework exception types are intentional public APIs. Metadata, profiles, and contexts are immutable. Rule codes are stable IDs and profiles declare an explicit rule order.

`validate_record` runs a record-capable profile against one record and optional explicit context. `validate_records` materializes and deterministically orders an explicit batch, builds its bounded in-memory context, then executes record and batch rules. It collects all ordinary issues and returns the existing Runtime Core `ValidationResult`. The result sorts issues by severity value, record identifier, field path, rule ID, then message. Inputs are never mutated; no timestamp or identifier is allocated.

The layers are Representation, Structural, Domain, CrossObject, and Scientific. Representation belongs primarily to adapters. Scientific is an architectural marker only and no Scientific rules are registered.

## Built-in rules

Structural rules check preferred-label presence, ambiguity-note content, evidence-key uniqueness, and current relationship endpoint identifier form. Domain rules check scientific-name/label separation, evidence/source linkage, self-supersession, inactive lifecycle caution, and provenance/evidence linkage. Cross-object rules check duplicate record identifiers, relationship reference existence and entity resolution, relationship self-reference, and supersession predecessor existence.

Every issue carries its rule ID in `code`, severity, message, relevant field path and record ID, and remediation guidance. Invalid candidate data yields issues. Duplicate profile IDs, invalid contexts, invalid profiles, and unsupported targets are framework configuration/programming errors and raise `ValidationFrameworkError` subclasses.

## Boundaries

The engine imports only the Runtime domain and its own modules. It performs no YAML/JSON parsing, persistence, registry lookup, graph traversal, query, explanation, filesystem, network, or scientific inference. YAML loading and validation remain separate calls: the adapter produces a domain record and a caller may then pass that record to the engine.

Tests use synthetic fictional values only and require no network. A valid result does not prove scientific correctness. Validation does not approve sources, confer regulatory status, produce recommendations, diagnose crop conditions, or promote candidate records. Real Rice candidate authoring remains blocked.
