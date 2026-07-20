# Runtime Compatibility Change Checklist

For packaging changes, also confirm distribution version and metadata,
`cpmoakb.__version__`, Composition API `0.1`, optional HTTP isolation, deterministic
artifact manifests, clean installed imports, and RAS-012 package-data exclusions.
Package release versions never imply a change to Runtime, YAML, projection,
Application, HTTP, or CLI contract versions.

Future Runtime changes MUST review this checklist:

- [ ] Public symbol added and classified in the manifest.
- [ ] Public symbol removed or renamed.
- [ ] Required or optional signature changed.
- [ ] Return type changed.
- [ ] Documented exception behavior changed.
- [ ] Deterministic ordering changed.
- [ ] YAML schema or restriction changed.
- [ ] Validation rule, ID, severity, or issue ordering changed.
- [ ] Registry transition, compatibility, or non-reuse behavior changed.
- [ ] Query normalization or match traceability changed.
- [ ] Explanation structure or renderer output changed.
- [ ] Dependency direction changed.
- [ ] Runtime version impact classified.
- [ ] JSON projection schema, kind, field mapping, canonical encoding, or ordering changed.
- [ ] Projection version impact classified independently from Runtime and YAML versions.
- [ ] Application request, response, operation, dependency, error, or envelope contract changed.
- [ ] Application API version impact classified independently from Runtime, YAML, and projection versions.
- [ ] HTTP endpoint, request bound, response, error, OpenAPI, factory, or dependency contract changed.
- [ ] HTTP API version impact classified independently from other Runtime versions.
- [ ] CLI command, argument, output, newline, error, exit-code, or injection contract changed.
- [ ] CLI API version impact classified independently from other Runtime versions.
- [ ] Security boundary, threat model, dependency pins, action pins, artifact policy, or release evidence changed.
- [ ] Security and release-readiness verifiers updated without broadening an allowlist silently.
- [ ] Documentation and API manifest updated.
- [ ] Contract tests updated without weakening the prior guarantee.
- [ ] Deprecation documents behavior window and replacement.
- [ ] Chief Architect approval obtained for every breaking change.
