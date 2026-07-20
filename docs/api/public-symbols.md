# Public Symbols

The authoritative human-readable inventory is the
[Runtime API manifest](../runtime/runtime-api-manifest.md). Its machine-readable
conformance copy is `tests/contracts/_api_manifest.py`. Together they enumerate
all 165 package-symbol entries and classify each as Stable for Runtime 0.1 or
Experimental.

The governed packages documented by this handbook are:

- `cpmoakb` and `cpmoakb.runtime_api`;
- `cpmoakb.domain`, `cpmoakb.adapters`, and `cpmoakb.adapters.yaml`;
- `cpmoakb.validation`, `cpmoakb.registries`, `cpmoakb.query`, and `cpmoakb.explain`;
- `cpmoakb.serialization` and `cpmoakb.application`;
- `cpmoakb.http_api`, `cpmoakb.cli`, and `cpmoakb.composition`.

Documentation verification compares these package names with the unchanged static
manifest. It does not reflect over installed objects or generate a second API.
Private helpers, test fixtures, scripts, examples, and packaging utilities are not
public package symbols.
