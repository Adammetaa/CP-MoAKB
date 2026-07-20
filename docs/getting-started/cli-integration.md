# CLI Integration

The package installs no console command. The CLI is a library function with
explicit arguments, service, stdout, and stderr:

```shell
python -m examples.cli.example
```

Expected output is one canonical version JSON document followed by
`exit=0`. Callers may instead pass `query` or `query-and-explain` arguments to
`run_cli`. A successful operation writes one document to stdout; a failure writes
one stable error document to stderr and returns its governed exit code.

The CLI never reads hidden `sys.argv`, discovers files, or composes a service.
See the [CLI API handbook](../api/cli-api.md).
