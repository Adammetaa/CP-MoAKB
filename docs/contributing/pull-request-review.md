# Pull-Request Review

Authors should state scope, affected contracts, compatibility classification,
synthetic-data status, commands run, and known limitations. Reviewers check:

- behavior matches documentation and the relevant ADR/RAS;
- public, version, dependency, security, and artifact boundaries remain explicit;
- tests cover success, failure, determinism, and prohibited shortcuts;
- no real knowledge, secrets, generated outputs, or machine-specific content leaks;
- release or publication authority is not implied.

Request changes when evidence is incomplete. Security vulnerabilities use the
private process in [SECURITY.md](../../SECURITY.md). There is no review SLA or
automatic acceptance promise.
