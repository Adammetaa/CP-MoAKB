# First Query

Run the standalone public-API example:

```shell
python -m examples.query.example
```

It loads one fictional candidate from an inline YAML string, constructs
`QueryService` from that explicit record, and searches with `QueryCriteria`.
Expected output is:

```text
matches=1
CPM-CAND-E-990001 labels.preferred Fictional Widget
```

Queries are deterministic filters over supplied records. They do not rank,
diagnose, recommend, fetch data, or infer missing facts. Invalid criteria raise a
typed query error. Public symbols and compatibility are documented in the
[Runtime API handbook](../api/runtime-api.md).
