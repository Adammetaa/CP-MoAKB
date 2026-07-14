# RAS-007: Runtime API Compatibility Contract

**Status:** Active

**Version:** 1.0

This specification governs the public Runtime API independently from application release versions. It applies to the public surfaces established under [RAS-001 through RAS-006](README.md).

## Public boundary and compatibility categories

Only symbols intentionally exported through a package `__init__.py` and its `__all__` are public Runtime APIs. Internal modules, private names, and helper functions are Internal-only unless separately exported.

Every change MUST be classified as Backward compatible, Backward compatible with deprecation, Breaking, or Internal-only. Adding an optional API is normally backward compatible. A documented deprecation preserves behavior temporarily. Internal-only changes MUST NOT alter observable public behavior.

Breaking changes include removing or renaming a public symbol; changing required parameters, return types, documented exceptions, deterministic ordering, identifier or enum semantics, renderer output, validation issue ordering, or YAML schema behavior; and weakening strict parsing or validation guarantees. Breaking changes require Chief Architect review and MUST NOT be hidden in an ordinary sprint.

## Runtime version and deprecation

The initial Runtime API version is `0.1`, exposed deterministically as `cpmoakb.runtime_api.RUNTIME_API_VERSION`. This version is independent from application releases and MUST NOT be interpreted as a broader semantic-versioning promise.

Deprecations MUST be documented, preserve behavior for the governed window, name a replacement, avoid silent behavior changes, and defer removal to a later architecture decision. Deterministic warnings MAY be added only when a real deprecation justifies them. Runtime 0.1 has no active deprecations.

## Contract protection

Public exports and cross-layer behavior MUST be protected by static manifest and contract tests. Tests SHOULD cover YAML-to-domain mapping, validation, registry custody, query semantics, explanation structure/rendering, dependency direction, and repeated deterministic equality.

Domain models are the Runtime source of truth. YAML 1.0 is an input representation, not an object serialization contract. `repr()`, dataclass field order, and incidental internal tuple order MUST NOT be treated as stable serialization unless a future versioned contract explicitly says so. Future JSON/YAML writers and snapshot/explanation serialization require separate schema decisions. No persistence contract is created here.
