# Runtime API

**Version:** `0.1`
**Purpose:** immutable domain values plus deterministic adapter, validation,
registry, query, and explanation contracts.

Public packages are `cpmoakb.domain`, `cpmoakb.adapters`,
`cpmoakb.adapters.yaml`, `cpmoakb.validation`, `cpmoakb.registries`,
`cpmoakb.query`, `cpmoakb.explain`, and `cpmoakb.runtime_api`. Their exact symbols
and stability categories are linked from [public symbols](public-symbols.md).

Typical shapes are `load_candidate_yaml(text) -> CandidateRecord`,
`QueryService.from_records(records) -> QueryService`,
`QueryService.search(QueryCriteria) -> QueryResult`, and
`ExplanationService.explain_query_match(match, criteria) -> Explanation`.
Callers provide text, records, repositories, snapshots, and criteria explicitly.

Collections and results have stable deterministic ordering. Invalid domain,
adapter, validation, registry, query, or explanation inputs raise their public
typed errors. Loading is not validation; candidates are not production records;
query is not ranking; explanation is not inference. Lifecycle and compatibility
are governed by RAS-001 through RAS-007. See the
[query example](../../examples/query/README.md).
