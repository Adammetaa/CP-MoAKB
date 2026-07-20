# Quick Start

This journey uses Python 3.11 or 3.12, a local checkout, public APIs, and one
fictional in-memory record. It requires no database, source file, network, secret,
or environment configuration.

1. Follow [installation](installation.md) and install the local package.
2. Run `python -m examples.minimal.example` from the repository root.
3. Continue to [first query](first-query.md) and
   [first explanation](first-explanation.md).
4. Choose [HTTP integration](http-integration.md) or
   [CLI integration](cli-integration.md) only when that adapter fits the caller.
5. Use [verification](verification.md) before contributing changes.

Expected minimal output:

```text
CPM-CAND-E-990001 Fictional Widget
```

The record is synthetic. Loading it does not validate, register, persist, or
promote it. See the [API handbook](../api/README.md) for caller responsibilities
and the [platform boundary](../concepts/platform-not-diagnosis.md) for limitations.
