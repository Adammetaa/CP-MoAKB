# RAS-003: Adapter Contract

**Status:** Active

**Version:** 1.0

This specification normalizes the boundary implemented by the [constrained YAML adapter](../yaml-adapter.md) under the accepted candidate-format decisions in ADR-009.

- An adapter MAY depend on `cpmoakb.domain`; the domain MUST NOT depend on an adapter.
- Input schemas MUST have an explicit supported version and MUST reject unsupported or missing versions.
- Unknown keys MUST be rejected at every governed schema level.
- Parsers MUST use safe construction, prohibit executable/custom types and aliases where required, bound input, and avoid implicit timestamps.
- Representation failures MUST be translated into stable adapter-boundary errors and SHOULD retain a useful input path when safely available. Programming defects MUST NOT be indiscriminately suppressed.
- Adapters MUST NOT allocate candidate identifiers, infer scientific meaning, promote records, or perform network lookup.
- Equivalent accepted input MUST map deterministically to the same immutable domain values.
- Adapter tests MUST use synthetic fixtures and MUST NOT depend on network access.
- Representation validation and Runtime validation MUST remain separate explicit operations. Loading MUST NOT automatically execute a validation profile.

This RAS does not require refactoring a compliant adapter and does not authorize new formats.
