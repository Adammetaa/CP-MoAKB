# CLI API

**Version:** `0.1`
**Public symbols:** `RUNTIME_CLI_API_VERSION`, `run_cli`.

Signature shape:

```python
run_cli(argv, runtime_application_service, stdout, stderr) -> int
```

Commands are exactly `version`, `query`, and `query-and-explain`. Dependencies and
streams are explicit. Success writes one canonical JSON document plus a newline to
stdout. Failure writes one stable error document plus a newline to stderr and
returns exit code 2, 3, 4, 5, 6, or 70 according to its governed classification.

There is no console entry point, hidden `sys.argv`, service composition, path or
URL input, file loading, networking, or shell execution. Governed by RAS-011 and
RAS-013; see the [CLI example](../../examples/cli/README.md).
