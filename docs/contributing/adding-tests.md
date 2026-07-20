# Adding Tests

Use public APIs when testing contracts and narrowly scoped internals only for
unit behavior owned by that module. Fixtures must be fictional, deterministic,
small, and free of real agricultural claims. Tests may not require network,
secrets, wall-clock values, random identifiers, persistent databases, or execution
order.

Assert observable contracts: types, ordering, error classes/codes, canonical
output, import boundaries, and read-only behavior. Add regression tests before a
fix when practical. Do not import user-facing examples from tests as hidden
fixtures; example execution has its own manifest and verifier.
