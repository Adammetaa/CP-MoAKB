# CP-MoAKB 0.1.0 Release Candidate Notes

**Status: prepared, not published.** These notes describe an initial open-source
release candidate for package `0.1.0`; they do not identify a tag, GitHub
Release, artifact upload, or package-index event.

## Purpose and principal capabilities

CP-MoAKB is Explainable Agricultural Knowledge Infrastructure: a deterministic,
read-only engineering platform for caller-supplied records. Repository history
supports immutable domain objects, constrained YAML adaptation, layered
validation, governed registries, read-only queries, structured explanations,
canonical JSON projection, a transport-neutral application facade, an injected
HTTP adapter, a library-first CLI, explicit composition, and a retained legacy
IRAC parser/exporter path.

Documentation covers installation, architecture, public APIs, contributor and
maintainer workflows, governance, security, and release preparation. Nine
executable offline examples use fictional data; one extension example is
documentation-only.

## Security, governance, and compatibility

The candidate uses Apache-2.0 for repository source, exact direct dependency
pins, minimal read-only workflow permissions, immutable action SHAs, explicit
publication gates, deterministic verification, and private vulnerability
reporting guidance. Official reference publications are excluded; provenance,
checksums, retrieval instructions, and golden expectations remain.

Package `0.1.0` supports Python `>=3.11,<3.13`. Runtime, YAML, projection,
Application, HTTP, CLI, and Composition contracts remain `0.1`, `1.0`, `1.0`,
`0.1`, `0.1`, `0.1`, and `0.1`. The public manifest remains 165 entries.

## Installation boundary

The project is installable from a reviewed local source tree or verified wheel
and sdist. FastAPI is available only through the `http` extra. No production
server executable or package entry point is supplied. These notes do not claim
that artifacts are available from a package index.

## Limitations, exclusions, and known issues

The package is an alpha engineering platform and not a production server. It is
not a diagnosis engine and not a recommendation engine. It is not a pesticide
selector, ranking or confidence system, AI/LLM system, or complete agricultural
corpus. It supplies no persistence,
authentication, authorization, telemetry, deployment infrastructure, real
agricultural dataset, signing, or publication automation.
It bundles no usable agricultural corpus.

Source-dependent IRAC parser verification requires a separately retrieved
official PDF whose checksum matches repository metadata. The historical
`v0.8.0` tag predates package version authority, so a future tag name requires an
owner decision.

## Upgrade and verification notes

There is no earlier published package release governed by this changelog, so no
package upgrade procedure is asserted. Consumers should treat every public
surface according to its documented compatibility category. Verification covers
static checks, focused and full tests, documentation/examples, security,
repeated builds, archive contents, and isolated installations.

Repository history attributes the commits supporting this candidate to
Adammetaa. This attribution reports Git evidence only and does not create a
copyright or contributor governance statement.
