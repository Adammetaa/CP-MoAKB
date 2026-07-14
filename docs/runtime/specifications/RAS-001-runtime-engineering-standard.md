# RAS-001: Runtime Engineering Standard

**Status:** Active

**Version:** 1.0

This specification applies reusable constraints to CP-MoAKB Runtime Engineering. It complements [ADR-005 through ADR-009](../../ARCHITECTURE_DECISIONS/) and does not replace sprint Design Freeze instructions.

## Runtime requirements

- Runtime code MUST support the Python versions exercised by hosted CI; new syntax MUST remain compatible with the oldest supported version, currently Python 3.11.
- Dependencies MUST point inward toward stable domain abstractions. The domain MUST NOT import adapters, persistence, services, or validation implementations.
- Packages MUST expose intentional APIs and SHOULD preserve compatible public behavior. Internal helpers SHOULD remain internal.
- New code MUST be typed and pass the repository mypy scope without broad suppressions. Immutable domain values SHOULD be preferred.
- The standard library SHOULD be preferred. A new dependency MUST have a concrete need, compatibility review, and explicit documentation.
- Boundary exceptions MUST translate representation or infrastructure failures without hiding programming defects. Ordinary invalid data MUST use validation results where that contract applies.
- Observable output MUST be deterministic. Code MUST NOT depend implicitly on locale, environment variables, filesystem discovery, network state, unordered iteration, or current time.
- Runtime components MUST NOT use hidden mutable global state, allocate identifiers automatically, or add automatic timestamps.
- Unit tests MUST use synthetic or fictional records and MUST NOT require network access. Real governed data requires its own authorization.
- Public behavior and architecture boundaries MUST be documented. Material decisions SHOULD reference the applicable ADR and RAS.
- Implementations MUST comply with the active sprint Design Freeze and MUST preserve backward compatibility unless an explicitly governed change authorizes otherwise.
- Work MUST remain within the sprint objective. Dynamic plugins, premature service layers, speculative abstractions, and unrelated refactoring SHOULD NOT be introduced.
- A sprint MAY add a small stateless abstraction when it has a current, tested role and respects these dependency boundaries.

These rules standardize engineering qualities; they do not authorize scientific claims, data promotion, or product capabilities.
