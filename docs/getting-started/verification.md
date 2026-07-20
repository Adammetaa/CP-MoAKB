# Local Verification

The checks are read-only apart from ignored build and tool outputs, which must be
removed after validation. From a development environment run:

```shell
python -m ruff check .
python -m pytest -q
python -m pip check
python scripts/verify_security_contract.py
python scripts/verify_release_readiness.py
python scripts/verify_documentation.py
python scripts/verify_examples.py
```

Formatting and typing use the scopes recorded in
[Runtime contract suite](../runtime/runtime-contract-suite.md). Release candidates
also build twice and run distribution plus installation verification. These
commands do not publish, tag, or create a release. Failures should be fixed at
their authoritative source; never weaken a manifest or allowlist merely to make a
gate pass.
