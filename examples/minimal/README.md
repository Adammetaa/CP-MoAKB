# Minimal Candidate

**Purpose:** load one fictional candidate through the public YAML adapter.
**Prerequisites:** local core installation; run from repository root.
**Command:** `python -m examples.minimal.example`
**Expected output:** `CPM-CAND-E-990001 Fictional Widget`

Demonstrated APIs are `load_candidate_yaml`, `EntityRecord`, identifier, and label
values. Loading does not validate, register, persist, or promote the candidate.
The input is inline synthetic text. See the [quick start](../../docs/getting-started/quick-start.md)
and [Runtime API](../../docs/api/runtime-api.md).
