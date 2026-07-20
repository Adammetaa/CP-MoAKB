# Release Readiness Checklist

Sprint-028R starts from governed baseline
`5c625c70c229773991434a638c831e061dcb92bf`. A later release candidate must record
its reviewed commit in release notes; the readiness manifest intentionally contains
no transient Git SHA.

- [ ] Worktree is clean and candidate commit is reviewed.
- [ ] Package `0.1.0`, Python 3.11/3.12, Apache-2.0, and all seven contract versions
      match authoritative sources.
- [ ] Public API manifest remains exactly approved.
- [ ] Ruff, governed Black, cache-free mypy, `pip check`, all focused suites, and the
      full suite pass.
- [ ] Dependency/advisory and action-provenance reviews are complete.
- [ ] Security and release-readiness scripts pass without network access.
- [ ] Documentation tests, link/version/capability verification, and every governed executable example pass offline.
- [ ] Wheel and sdist build twice; wheel bytes, content lists, and metadata are stable,
      and normalized sdist contents are stable.
- [ ] Artifact manifests exclude forbidden files and contain required metadata.
- [ ] Editable, wheel, sdist, base-without-FastAPI, HTTP-extra, and installed-location
      checks pass.
- [ ] `LICENSE`, `SECURITY.md`, release notes, and user documentation are complete.
- [ ] No real agricultural data, generated database/CSV, secret, cache, local
      configuration, or build output was added.
- [ ] No API/CLI command, endpoint, envelope, exit code, query, explanation, or
      dependency semantics changed without approval.
- [ ] Tag, PyPI publication, and GitHub Release remain absent.
- [ ] Explicit final publication approval is recorded.
