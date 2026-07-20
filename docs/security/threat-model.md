# Bounded Threat Model

## Assets and trust boundaries

Protected assets are deterministic Runtime behavior, contract and API integrity,
official-source integrity, artifact integrity, repository secrets, and consumer
environment safety. Trust crosses caller-to-HTTP, caller-to-CLI,
transport-to-application, application-to-injected Runtime services,
consumer-to-composition, repository-to-CI, and build-environment-to-artifact
boundaries.

## Threat actors and mitigations

- A malformed HTTP caller may send invalid JSON, unknown fields, coerced types,
  oversized contract strings, invalid indexes, or unsupported methods. Strict
  bounded models and fixed generic errors contain these inputs.
- A malformed CLI caller may send invalid Unicode, excessive strings, unexpected
  switches, or invalid indexes. Closed parsing, explicit streams, stable exit codes,
  and one error document contain failures.
- An accidental integrator may omit or substitute dependencies. Keyword-only
  composition and application contract errors reject invalid injection without a
  fallback service.
- A malicious package consumer may supply unsupported objects. Closed serializers
  reject them; there is no `default=str`, reflection fallback, pickle, or dynamic
  loading.
- A compromised dependency or action may affect builds. Exact direct pins,
  optional-dependency separation, a pinned build backend, immutable official action
  SHAs, minimal workflow permissions, and no publishing reduce exposure.
- Accidental artifact inclusion is constrained by explicit package-data rules and
  wheel/sdist manifest verification.
- A contributor may introduce forbidden dependency direction or operations. Static
  AST checks, public API manifests, architecture tests, and CI release gates reject
  governed violations.

## Non-goals and residual risk

Authentication, authorization, tenant isolation, production network perimeter,
database security, DDoS protection, availability guarantees, production logging,
secret storage, and secure deployment configuration are outside this model.
Transitive dependencies are resolver-managed rather than fully locked, vulnerability
databases are not complete, and upstream compromise cannot be proven absent. This
model is engineering evidence, not compliance certification.
