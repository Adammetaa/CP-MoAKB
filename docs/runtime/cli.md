# Minimal Reference CLI Consumer

Packaging intentionally defines no console entry point. `run_cli(...)` remains a
library-first function requiring an explicitly composed
`RuntimeApplicationService` and caller-owned streams. Installation performs no
file discovery, data loading, registry construction, or network access. CLI API
remains `0.1`.

`cpmoakb.cli` is a deterministic, read-only, library-first consumer of `RuntimeApplicationService`. Its independent CLI API version is `0.1`.

```python
run_cli(argv, runtime_application_service, stdout, stderr) -> int
```

All dependencies are explicit. The CLI does not use implicit process arguments or streams, load data, discover files, own registries, read configuration or environment variables, or access networks.

Argument values are bounded before application dispatch. Parser, application,
Runtime, dependency, and unexpected failures use fixed codes and messages and do
not echo exception text, paths, representations, or tracebacks. Deployments must
provide any authentication, access control, audit sink, or rate policy outside
this reference consumer.

Commands are `version`, `query`, and `query-and-explain`. Query options are `--domain-type`, `--label-text`, `--label-scope`, `--language`, `--locale`, `--match-mode`, and `--predicate`. Query-and-explain additionally requires `--match-index`.

Fictional library arguments:

```text
query --label-text "Fictional Unicode ข้อมูล" --match-mode exact
```

Success writes exactly one canonical JSON document and trailing newline to stdout, leaving stderr empty. Errors write exactly one stable JSON error document and newline to stderr, leaving stdout empty.

| Exit | Meaning |
| ---: | --- |
| 0 | Success |
| 2 | CLI argument contract |
| 3 | Application contract |
| 4 | Unsupported application request |
| 5 | Application dependency failure |
| 6 | Typed Runtime failure |
| 70 | Unexpected internal failure |

Query output comes directly from the facade’s canonical projection string. The CLI implements no matching, explanation, diagnosis, recommendation, ranking, or inference logic.

There is no console script or `main()` wrapper in this sprint. A safe executable needs a future approved composition root; hidden data or synthetic defaults are not substituted. See [RAS-011](specifications/RAS-011-runtime-cli-transport-contract.md).
