# Dependency and Supply-Chain Policy

All direct dependencies and the setuptools build backend use exact versions.
Runtime libraries are `pandas`, `pdfplumber`, and `PyYAML`. FastAPI is optional;
`httpx2` is development/test-only. Build, packaging, setuptools, tests, formatting,
typing, lint, and pre-commit tooling remain development/build concerns. Production
servers are prohibited.

Git, URL, local-path, editable, alternative-index, dynamic-version, and untrusted
build-plugin dependencies are prohibited in release metadata. `pyproject.toml` is
authoritative; `requirements-dev.txt` must equal the union of base and development
requirements. Resolver-selected transitive dependencies are reviewed at release
time but are not represented as a lock file in version `0.1.0`.

Security review must query an authoritative advisory source for every direct pin.
If a known vulnerability is returned, release work stops until applicability,
identifier, fixed version, and compatibility impact are reported and governed.
Updates are never made silently. Automated network vulnerability scans are not CI
gates because they are time-varying; the deterministic repository gate verifies
the declared policy offline.

Only official `actions/checkout` and `actions/setup-python` are used. Workflow
references are immutable commit SHAs with human-readable release comments.
Workflow permissions are `contents: read`; credentials are not persisted, secrets
and OIDC are not used, and no job publishes packages or releases.
