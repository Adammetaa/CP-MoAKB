# Package Evolution and Compatibility

Status: Active

Version: 1.0

Evolution preserves immutable Package Version history, exact member/dependency
references, change rationale, review, and supersession. Consumers declare which
exact Package Versions and profiles they can use.

Compatibility considers semantic scope, member versions, dependency versions,
rights, review, publication, authority, language, and consumer eligibility.
Unknown or incompatible dependencies block use; they are never silently upgraded.

Direct and optional dependencies remain explicit. Superseded dependencies retain
history and approved replacement context. Circular dependency is prohibited.
No Package evolution silently changes Knowledge, Publication, or Representation Version.
