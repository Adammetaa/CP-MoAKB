# Release Versioning

The distribution version is defined in `cpmoakb/_version.py` and exposed as
`cpmoakb.__version__`. Runtime, YAML, projection, Application, HTTP, CLI, and
Composition contracts have separate implementation constants and governance.

A release candidate must verify all authorities. Changing a package version does
not silently change an API contract; changing a governed schema or public behavior
cannot be hidden inside a package patch. See the
[API compatibility guide](../api/versioning-and-compatibility.md).
