# RAS-013: Runtime Security and Release Readiness Contract

**Status:** Active

**Version:** 1.0

## Purpose, scope, and posture

This specification governs security evidence and release-readiness gates for the
existing Runtime, application, serialization, HTTP, CLI, composition, packaging,
build, and CI boundaries. It adds no product feature or production-security claim.
Determinism, confidentiality of public errors, explicit state ownership, artifact
integrity, and compatibility are the protected properties.

## Supported threat boundaries and public attack surface

Supported boundaries are caller-to-HTTP, caller-to-CLI, transport-to-application,
application-to-injected services, consumer-to-composition, repository-to-CI, and
build-to-artifact. Public symbols MUST match RAS-007. Imports MUST NOT access files,
networks, secrets, persistence, registries, or create services.

HTTP remains limited to health, query, query-and-explain, and OpenAPI routes.
Interactive docs remain disabled. Strict request models MUST reject extra fields,
coercion, unbounded text/tag values, and invalid indexes. CLI remains limited to
version, query, and query-and-explain with explicit arguments, service, and streams.
Request byte limits, rate limits, TLS, proxy behavior, authentication,
authorization, and availability are deployment responsibilities.

## Error confidentiality and deterministic behavior

HTTP and CLI failures MUST use fixed classifications and messages. They MUST NOT
expose tracebacks, exception text or repr, class/module names, filesystem paths,
local configuration, timestamps, random identifiers, or sensitive values.
Serialization MUST remain closed, canonical, Unicode-safe, and free of
`default=str`, arbitrary reflection, or object fallbacks.

## Composition and prohibited operations

Composition MUST require caller-owned query and explanation services and create a
new facade without defaults, singletons, registries, data, files, environment,
network, persistence, plugins, dynamic imports, or fallback behavior.

Governed Runtime/public code MUST NOT use `eval`, `exec`, pickle, subprocesses,
shell execution, dynamic importing, outbound HTTP clients, sockets, filesystem
discovery, environment-secret lookup, traceback output, or unapproved repr fallback.
AST checks MUST be deterministic, repository-bounded, and use explicit narrow
allowlists. Frozen legacy validation and its exact deterministic record-order repr
are documented exclusions; no new exemption is implicit.

## Dependency, supply-chain, and CI rules

Direct dependencies and the build backend MUST be exactly pinned. URL, Git, local,
editable, alternate-index, dynamic-version, production-server, and untrusted build
plugin dependencies are prohibited. FastAPI remains optional and `httpx2` remains
development-only. A known vulnerability in a direct pin stops release work pending
an applicability and compatibility decision.

CI permissions MUST be explicitly `contents: read`. Official actions MUST use
governed immutable SHAs with readable release comments. Pull-request write access,
OIDC, secrets, persistent checkout credentials, `pull_request_target`, remote shell
downloads, publishing, tags, and release creation are prohibited.

## Repository, package, and artifact integrity

Tracked secrets, private-key patterns, local credentials/configuration, caches,
build outputs, distributions, generated databases, and generated CSVs are
prohibited. The three frozen legacy validation CSVs are source-governance fixtures,
not generated release artifacts, and are the only CSV allowlist. Wheel and sdist
rules remain RAS-012 and MUST exclude all CSV, PDF, database, reference, test,
cache, secret, and local-configuration content.

## Release-readiness and compatibility gates

A release candidate MUST pass public manifest, version, metadata, license,
dependency, workflow-permission, sensitive-file, security AST, test, lint, format,
type, `pip check`, repeated build, artifact, and isolated installation checks. The
machine-readable manifest MUST be verified against authoritative constants and MUST
contain no timestamp, path, user, host, transient run, secret, or Git SHA.

Distribution `0.1.0`, Runtime `0.1`, YAML `1.0`, projection `1.0`, Application
`0.1`, HTTP `0.1`, CLI `0.1`, and Composition `0.1` remain unchanged. No route,
command, signature, envelope, error/exit code, query behavior, explanation, or
dependency category may change without its existing compatibility governance.

## Publication boundary, limitations, and extensions

Tags, PyPI publication, GitHub Releases, release automation, production deployment,
and official data distribution require separate explicit approval. RAS-013 provides
engineering controls, not certification, complete vulnerability detection, a bug
bounty, or production hardening. Authentication, authorization, perimeter security,
tenant isolation, databases, DDoS protection, logging, and secret storage are
non-goals.

Extensions MUST remain deterministic, read-only, dependency-direction safe, and
explicitly governed. RAS-013 extends RAS-007 public compatibility, RAS-008 closed
serialization, RAS-009 application errors, RAS-010 HTTP, RAS-011 CLI, and RAS-012
packaging/composition without changing those contracts. Future documentation,
release, and deployment-security work remains separately governed.
