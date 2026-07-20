# Testing and Verification

Place tests beside the governed concern: domain, adapter, validation, registry,
query, explanation, serialization, application, HTTP, CLI, packaging, security,
or documentation. Tests must be deterministic, offline, and synthetic.

Run the focused suite first, then `python -m pytest -q`. Run Ruff, governed Black,
cache-free mypy, `pip check`, and every repository verifier affected by the change.
Packaging changes also require two builds plus distribution and isolated-install
verification. Remove ignored outputs and caches afterward.

Never update a golden value, manifest, allowlist, or expected error merely to hide
an unexplained behavior change. Determine whether the implementation, test, or
contract is authoritative first.
