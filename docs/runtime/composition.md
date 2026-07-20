# Explicit Runtime Composition

Composition API version `0.1` consists of exactly:

- `RUNTIME_COMPOSITION_API_VERSION`
- `create_runtime_application_service`

The factory requires keyword-only, caller-created `QueryService` and
`ExplanationService` values and returns a new `RuntimeApplicationService`.
Existing application validation supplies stable typed contract failures.
Repeated calls with the same inputs create distinct facades with equivalent
behavior.

The composition package owns no registry, records, dataset, singleton, service
locator, filesystem path, environment setting, network client, database, or
plugin mechanism. It imports only approved public query, explanation, and
application boundaries. Synthetic examples in tests are fictional and are not
packaged knowledge. Future loaders, deployments, data distributions, and
production composition belong to separately governed boundaries.

The security contract statically rejects environment access, plugin or module
discovery, filesystem discovery, network clients, subprocesses, and shell calls
in the governed Runtime surface. Composition therefore cannot acquire hidden
configuration or authority during import or factory execution.
