# Version Boundaries

Package version and contract versions answer different questions. Package
`0.1.0` identifies the distribution. Runtime API `0.1`, YAML schema `1.0`, JSON
projection `1.0`, and Application/HTTP/CLI/Composition `0.1` independently govern
their compatibility surfaces.

A documentation correction does not itself change a version. A public signature,
schema, envelope, route, command, exit-code, or semantic change requires analysis
under its owning RAS and may require a contract version change. Distribution
version changes follow release governance and do not automatically alter contract
versions.

Authoritative values are verified from package metadata and implementation
constants by `scripts/verify_release_readiness.py`; see the
[versioning handbook](../api/versioning-and-compatibility.md).
