# Query and Explain

**Purpose:** compose public services and request one match explanation.
**Prerequisites:** local core installation.
**Command:** `python -m examples.query_and_explain.example`
**Expected behavior:** one summary line reports operation, match count, and
explanation kind.

The example demonstrates typed application requests, explicit composition, query,
explanation, and canonical application projection. The selected index must exist.
Explanation traces supplied facts; it is not diagnosis or recommendation. See
[first explanation](../../docs/getting-started/first-explanation.md).
