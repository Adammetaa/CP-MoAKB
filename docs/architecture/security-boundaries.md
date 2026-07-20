# Security Boundaries

The repository protects deterministic behavior, contract integrity, source and
artifact integrity, explicit state ownership, and confidential public errors.
Governed Runtime code excludes dynamic execution/import, outbound networking,
filesystem discovery, subprocesses, shell use, environment-secret lookup, and
unsafe serialization fallbacks.

Trust crosses caller-to-transport, transport-to-application, application-to-
service, consumer-to-composition, repository-to-CI, and build-to-artifact. The
[security model](../security/security-model.md), [threat model](../security/threat-model.md),
and RAS-013 are authoritative.

Production perimeter, authentication, authorization, TLS, rate limiting, DDoS
protection, operational logging, tenant isolation, and secret storage are not
implemented. Documentation and examples must not imply otherwise.
