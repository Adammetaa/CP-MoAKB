# Read-only Query

**Purpose:** search one explicitly supplied fictional record.
**Prerequisites:** local core installation.
**Command:** `python -m examples.query.example`

Expected output reports one match and its identifier, matched field, and value.
The APIs are `QueryCriteria`, `QueryService.from_records`, and `search`. Querying
is conjunctive deterministic filtering—not ranking, inference, diagnosis, or
recommendation. See [first query](../../docs/getting-started/first-query.md).
