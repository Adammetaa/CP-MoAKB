# Versioning and Compatibility

The distribution, Runtime API, YAML schema, projection, Application API, HTTP API,
CLI API, and Composition API are independently governed. Current values are
verified by the release-readiness script; documentation is not their authority.

RAS-007 protects public imports, documented signatures, typed failures,
deterministic ordering, and classified behavior. RAS-008 through RAS-012 add
surface-specific compatibility. A breaking change requires architecture review,
an appropriate contract-version decision, migration documentation, tests, and
explicit approval. Adding a package release number alone does not alter an API or
schema contract.

Experimental symbols in the manifest remain intentional public imports but need
additional review before being declared stable. Deprecation requires a documented
replacement and window; silent removal is prohibited. Use the
[compatibility checklist](../runtime/runtime-compatibility-checklist.md).
