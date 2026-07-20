# Runtime Contract Suite

`tests/packaging` covers metadata, public imports, dependency isolation,
composition, architecture, and package-data policy. CI additionally builds twice,
runs the governed artifact verifier, then verifies editable, wheel, source, and
HTTP-extra installations plus `pip check` without importing from the source tree.

`tests/security` covers the AST prohibition set, exact exclusions and allowlists,
transport confidentiality and bounds, exact dependency pins, immutable action
references, minimal workflow permissions, authoritative versions, and the static
release evidence. `scripts/verify_security_contract.py` and
`scripts/verify_release_readiness.py` are deterministic, read-only gates.

The contract suite protects Runtime API version `0.1` across explicit layers:

```text
Synthetic YAML -> Domain record -> Validation -> Registry snapshots
               -> Read-only query -> Structured explanation
```

Every operation is an independent call. Loading does not validate, validation does not register, registration does not query, and query does not explain automatically. Tests use fictional identifiers and records only, perform no network or persistence access, and cover both successful behavior and bounded typed failures.

The suite protects YAML schema `1.0`, strict unknown-key rejection, identifier kind, labels, source/evidence/provenance and scientific-name separation, deterministic domain collections, validation profiles/rule IDs/severity/order, registry state/non-reuse/conflicts/snapshot isolation, query matching/ordering/one-edge limits, explanation availability/ordering/rendering, JSON projection schema `1.0`, application API `0.1`, HTTP API `0.1`, CLI API `0.1`, static public exports, and dependency direction.

Equivalent scenarios run repeatedly and compare validation results, snapshots, query results, structured explanations, rendered text, and canonical JSON. The suite is a compatibility alarm, not an orchestration service, deserializer, persistence adapter, or scientific acceptance test.

The governed type-check scope is:

```shell
python -m mypy --explicit-package-bases --disable-error-code import-untyped --cache-dir=/dev/null cpmoakb/runtime_api.py cpmoakb/domain cpmoakb/adapters cpmoakb/validation cpmoakb/registries cpmoakb/query cpmoakb/explain cpmoakb/serialization cpmoakb/application cpmoakb/http_api cpmoakb/cli cpmoakb/composition tests/contracts tests/application tests/serialization tests/http_api tests/cli tests/packaging tests/security scripts
```

Only the third-party `import-untyped` diagnostic is disabled. The accepted legacy validation import path reaches the pandas-based legacy parser, for which the repository has no installed pandas stubs. All Runtime type diagnostics remain enabled; no Runtime file or package is excluded.
