# Version Policy

Package version, Runtime API, YAML schema, projection, Application, HTTP, CLI, and
Composition versions are independent authorities. Their current values are read
from metadata and implementation constants by the release verifier.

Documentation-only correction normally changes none. Public or semantic changes
must be classified against the owning RAS before deciding whether a compatible
addition, deprecation, or breaking version increment applies. Never infer contract
versions from the package version or update duplicate prose without changing the
authoritative source and tests. Release preparation does not itself authorize a
version bump.
