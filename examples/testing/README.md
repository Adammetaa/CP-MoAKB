# Testing Determinism

**Purpose:** compare two canonical outputs for identical explicit inputs.
**Prerequisites:** local core installation.
**Command:** `python -m examples.testing.example`
**Expected output:** `deterministic=true matches=1`

The example demonstrates a narrow assertion suitable for a consumer test. It does
not replace the repository contract suite or prove scientific correctness. See
[testing guidance](../../docs/contributing/testing.md).
