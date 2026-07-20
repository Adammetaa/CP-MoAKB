# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| `0.1.0` on `main` | Yes |
| Earlier or modified versions | No governed security support statement |

This policy covers the CP-MoAKB source repository and the `cp-moakb` package. It
does not claim production certification, deployment hardening, availability, or a
bug bounty.

## Report a vulnerability privately

Use this repository's GitHub **Private vulnerability reporting** mechanism on the
Security tab. Do not open a public issue containing exploit details, secrets,
private data, or a reproducible attack before maintainers have had an opportunity
to coordinate disclosure. No separate security email address is governed.

Include the affected version and boundary, prerequisites, reproduction steps,
impact, minimal proof of concept, and any proposed mitigation. Remove real
agricultural, personal, credential, or unrelated sensitive data. Maintainers will
acknowledge and assess reports as capacity permits; this repository does not
promise a response or remediation time.

## In scope

- Public Runtime, application, serialization, composition, HTTP, and CLI contracts
- Package metadata, wheel/source contents, and installation behavior
- Deterministic error confidentiality and input constraints
- Dependency declarations and GitHub Actions supply-chain boundaries
- Unexpected filesystem, network, environment, persistence, or code execution

## Out of scope

Production perimeter controls, authentication, authorization, TLS termination,
rate limiting, DDoS protection, tenant isolation, databases, secret storage,
operational logging, and downstream deployment configuration are not implemented
by this repository. Reports about a consumer's deployment should be directed to
that operator unless the root cause is CP-MoAKB code or packaging.
