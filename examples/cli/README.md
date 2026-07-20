# CLI Library Integration

**Purpose:** invoke `run_cli` with explicit arguments, service, and streams.
**Prerequisites:** local core installation.
**Command:** `python -m examples.cli.example`

Expected output is one canonical version JSON line and `exit=0`. The example does
not use a console entry point or hidden process streams. Query commands require
the same caller-supplied service and produce one JSON document. See
[CLI integration](../../docs/getting-started/cli-integration.md).
