# Explicit Composition

**Purpose:** construct a facade from empty caller-owned services.
**Prerequisites:** local core installation.
**Command:** `python -m examples.composition.example`
**Expected output:** `composition=0.1 application=0.1 matches=0`

The example demonstrates the keyword-only composition factory, application
request, and empty deterministic result. It creates no defaults, records,
registries, files, or network clients. See the
[Composition API](../../docs/api/composition-api.md).
