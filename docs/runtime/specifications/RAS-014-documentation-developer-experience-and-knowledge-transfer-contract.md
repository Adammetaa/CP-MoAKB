# RAS-014: Documentation, Developer Experience, and Knowledge Transfer Contract

**Status:** Active

**Version:** 1.0

## Purpose and scope

This specification governs repository documentation, contributor and maintainer
onboarding, executable examples, navigation, and offline consistency evidence. It
describes the existing engineering platform and adds no Runtime feature, public
API, knowledge content, deployment, or publication authority.

## Audience model and documentation authority

Documentation MUST provide stable entry points for new users, integrators,
contributors, maintainers, security reviewers, release reviewers, and
knowledge-governance contributors. Implementation constants, package metadata,
the public API manifest, accepted ADRs, and Active RAS documents remain
authoritative. Explanatory prose MUST link to them and MUST NOT become a duplicate
authority.

## Consistency, capability claims, and versions

Documentation MUST describe implemented behavior, separate current scope from
future vision, and state limitations. It MUST NOT claim diagnosis,
recommendation, ranking, confidence scoring, scientific inference, AI/LLM
capability, bundled real knowledge, production readiness, certification, package
publication, or deployment when absent. Educational negation of those capabilities
is permitted and required where ambiguity is likely.

Distribution, Python, license, Runtime, YAML, projection, Application, HTTP, CLI,
and Composition version claims MUST match their authoritative sources. A prose
change cannot authorize a version or compatibility change.

## Executable examples and synthetic data

Executable examples MUST use intentional public APIs, explicit dependencies, and
fictional synthetic records. They MUST run offline, deterministically, without
secrets, database, file discovery, network, server startup, background process, or
generated repository output. Each MUST document prerequisites, command, expected
behavior/output, APIs, limitations, and related guidance.

The example manifest MUST explicitly enumerate executable entry points, required
extras, expected exits/output evidence, and demonstrated public packages. Example
helpers MUST remain private repository material, MUST NOT hide composition, and
MUST NOT be packaged as public API. Verification MAY use fixed subprocesses because
independent executability is the property under test; Runtime code remains subject
to the RAS-013 subprocess prohibition.

## Public API documentation and navigation

Every governed public package MUST be covered by the API handbook and linked to
the exact 165-entry manifest. Signatures MUST be derived from repository
inspection, not guessed or generated through a new Runtime reflection feature.
HTTP routes and CLI commands MUST match their frozen contracts.

Top-level repository, documentation, examples, architecture, API, contributor,
maintainer, governance, concept, project, release, security, and Runtime indexes
MUST resolve through relative links. Documentation MUST contain no machine paths,
usernames, transient CI run IDs, secrets, or unresolved placeholders.

## Contributor onboarding and maintainer knowledge transfer

Contributor guidance MUST explain setup, deterministic verification, Design
Freeze, synthetic-data policy, official-source policy, change classification,
public review, and ADR/RAS triggers without promising acceptance. Maintainer
guidance MUST explain doctrine, version and compatibility custody, rejection
conditions, release preparation, urgent fixes, rollback boundaries, and the
separation of Engineering and Knowledge Tracks.

Knowledge transfer MUST be recoverable from repository evidence without private
author context. Ambiguity MUST be recorded or governed, not filled by invention.

## Decision traceability and release documentation

Maps SHOULD use Decision → Contract → Public Surface → Verification →
Implementation only where repository evidence supports the relationship. Missing
direct ADR relationships MUST be stated rather than invented.

Release documentation covers candidate preparation and verification. Tags,
GitHub Releases, package publication, credentials, and destructive rollback
actions remain behind explicit approval and external procedures.

## Offline verification and documentation security

Repository-owned documentation and example verifiers MUST be deterministic,
offline, read-only, repository-bounded, stable in error ordering, and cache-free.
They MUST check required documents, link targets, versions, capability claims,
navigation, public-package coverage, example manifest/entry points, deterministic
execution, prohibited imports, and machine-specific content. CI MUST run them with
read-only permissions, no secrets, and no publication authority.

## Non-goals and extension rules

RAS-014 does not introduce a documentation framework, hosted site, screenshots,
network link checker, plugin system, public example API, real knowledge, Runtime
semantics, or production guidance. New documentation categories or examples MUST
remain navigable, accurate, synthetic where executable, and covered by deterministic
verification. A requested example that needs a new public API or semantic change
requires a separately governed engineering scope.

RAS-014 extends RAS-007 public compatibility, RAS-008 projection documentation,
RAS-009 application boundaries, RAS-010 HTTP, RAS-011 CLI, RAS-012 packaging and
composition, and RAS-013 security/release evidence without altering them. Future
publication and knowledge authoring remain separate approval boundaries.
