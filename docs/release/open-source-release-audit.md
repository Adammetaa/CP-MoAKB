# Open-Source Release Audit

## Identity, baseline, and scope

This engineering audit evaluates commit
`8b5d7a3473d02c6ab796046f8d761e8aa95227eb` as the baseline for an initial
open-source release candidate of package `0.1.0`. It does not call the package
or project `v1.0`: Design Freeze `v1.0`, YAML schema `1.0`, JSON projection
`1.0`, and RAS document versions are independent authorities. Historical tag
`v0.8.0` identifies an earlier repository baseline, not this package version;
the next tag remains an owner decision.

The audit covers repository architecture, public contracts, documentation,
examples, security controls, dependencies, licensing, build artifacts,
installation, reproducibility, and publication gates. It excludes new Runtime
features, agricultural knowledge, deployment infrastructure, credentials,
tagging, releases, artifact upload, and package-index publication.

## Integrity findings

- Architecture and frozen behavior remain unchanged. Release work is confined
  to governance documents, development verification, tests, and read-only CI.
- The static public API manifest contains 165 entries and agrees with package
  exports. All package and contract versions remain independently governed.
- HTTP documentation describes only the implemented injected adapter routes;
  CLI documentation describes only `version`, `query`, and
  `query-and-explain`.
- Governed documentation, executable synthetic examples, and their links and
  claims are checked offline. Examples bundle no real agricultural knowledge.
- Wheel and sdist policy includes Apache-2.0 licensing and required Runtime
  files while excluding docs, examples, tests, official publications, data,
  references, databases, generated CSV, caches, local configuration, and VCS
  metadata.

## Security, supply chain, and licensing

Workflows retain `contents: read`, immutable official action SHAs, disabled
checkout credentials, and no release, tag, package, OIDC, or secret use.
Direct dependencies remain exactly pinned and unchanged; the HTTP framework is
optional and no production server dependency exists.

Repository source is governed under Apache-2.0. Third-party dependencies retain
their own licenses. Official reference publications are not relicensed or
distributed: only identity, provenance, checksums, retrieval instructions, and
deterministic parser expectations are retained. The detailed engineering review
is in [License and Attribution Audit](license-and-attribution-audit.md).

## Reproducibility and clean-room use

The candidate procedure builds twice with the governed source-date epoch,
compares normalized archive paths and member content, inspects metadata, and
verifies editable, wheel, sdist, core-without-FastAPI, and HTTP-extra
installations without dependency resolution during verification. The
[Release Candidate Checklist](release-candidate-checklist.md) records executable
commands and evidence boundaries.

## Known limitations and deferred risks

- Package `0.1.0` is an alpha engineering platform, not production-ready.
- The HTTP component is a minimal injected adapter, not a production server.
- Authentication, authorization, persistence, telemetry, deployment controls,
  signing, and publication automation are intentionally absent.
- The installed package contains no usable agricultural corpus.
- Source-dependent IRAC parser regression requires a developer to retrieve and
  checksum-verify the official publication; the repository cannot redistribute
  it.
- Dependency advisories and official-source currency change over time and need
  review at the eventual publication gate.
- The final tag is unresolved because the historical `v0.8.0` repository tag and
  package `0.1.0` use distinct histories.

## Publication prerequisites and recommendation

Candidate acceptance, tag terminology, tag creation, GitHub Release creation,
artifact upload, and any package-index publication are separate owner gates.
Security reports requiring confidentiality follow `SECURITY.md`. Artifact
checksums are evidence from the final build and are not permanent version
authority.

The repository is recommended for owner review as a prepared release candidate
only after every non-approval checklist item passes. This audit does not approve
or publish a release.
