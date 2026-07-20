# Release Candidate Checklist

Baseline under audit:
`8b5d7a3473d02c6ab796046f8d761e8aa95227eb`. Record command output in the review
record; never treat a checked technical gate as publication approval.

## Repository and contract evidence

- [ ] `git status --short` is empty at the candidate commit.
- [ ] `git rev-list --left-right --count origin/main...main` confirms reviewed
      synchronization before any external action.
- [x] Frozen-component diff review finds no parser, exporter, database, schema,
      golden expectation, Runtime behavior, endpoint, or CLI command change.
- [x] `python scripts/verify_release_candidate.py` confirms package `0.1.0`,
      Python `>=3.11,<3.13`, all seven API/schema versions, Apache-2.0, 165
      public entries, documentation/example counts, and `not_published` state.
- [x] Dependency declarations and optional HTTP-extra isolation match existing
      authorities; no dependency changed.
- [x] Root license, package license expression, attribution audit, official
      reference boundary, and sensitive-file scan pass.

## Static, documentation, and test evidence

- [x] `python -m ruff check .`
- [x] Governed `python -m black --check --no-cache ...`
- [x] Governed cache-free `python -m mypy ...`
- [x] All required focused suites, including `tests/release_candidate`, pass.
- [x] `python -m pytest -q` passes.
- [x] `python -m pip check` passes.
- [x] `python scripts/verify_security_contract.py` passes.
- [x] `python scripts/verify_release_readiness.py` passes.
- [x] `python scripts/verify_documentation.py` passes.
- [x] `python scripts/verify_examples.py` passes with 9 executable and 1
      documentation-only example.
- [ ] Release notes and known limitations receive factual owner review.

## Artifact and clean-room evidence

- [x] Build `dist` and `dist-repeat` with `SOURCE_DATE_EPOCH=315532800` and
      `python -m build --no-isolation`.
- [x] `python scripts/verify_distribution.py --dist-dir dist --compare-dir
      dist-repeat` verifies exact wheel/sdist paths, member content, metadata,
      exclusions, Python requirement, dependencies, and optional HTTP extra.
- [x] Manual archive inspection confirms no official publication, test, data,
      reference, database, generated CSV, local configuration, secret, cache,
      or source-control metadata.
- [x] `python scripts/verify_installation.py --dist-dir dist` verifies editable,
      wheel, sdist, core-only, HTTP-extra, installed-location, and pip-check paths.
- [x] `python scripts/verify_release_readiness.py --dist-dir dist` passes.
- [x] `python scripts/verify_release_candidate.py --dist-dir dist` passes.
- [x] SHA-256 checksums for the two final artifacts are recorded in review output
      only, then build outputs and caches are removed.

## Explicit approval gates — never automate

- [ ] Owner approves release-candidate acceptance.
- [ ] Owner approves the final version terminology and tag name.
- [ ] Owner separately approves Git tag creation.
- [ ] Owner separately approves GitHub Release creation.
- [ ] Owner separately approves artifact upload.
- [ ] Owner separately approves package-index publication, if ever desired.
