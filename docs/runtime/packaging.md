# Governed Runtime Packaging

RAS-012 defines a PEP 517/518/621 build using pinned setuptools. The static
package version lives only in `cpmoakb._version` and is intentionally re-exported
as `cpmoakb.__version__`. Builds never consult Git, time, host state, environment
variables, or a network for version calculation.

The wheel contains Python modules, distribution metadata, the Apache-2.0 license,
and the existing SQL schema required by the explicitly invoked legacy database
builder. The schema is package data, not a database or persistence session. The
wheel excludes repository documentation, tests, workflows, official data,
references, PDFs, CSV outputs, SQLite artifacts, caches, local configuration,
virtual environments, and temporary files. The source distribution adds only the
README and build inputs needed to rebuild that same package; it applies the same
sensitive and generated-file exclusions.

`python -m build` creates a wheel and source distribution. The governed
`scripts/verify_distribution.py` validates metadata, dependency declarations,
required and forbidden contents, and repeat-build content-list/metadata equality.
`scripts/verify_installation.py` checks editable, wheel, source-distribution,
core-without-FastAPI, HTTP-extra, installed-location, and `pip check` behavior.
Artifacts are local verification outputs and are not committed, published to
PyPI, tagged, or released by this contract.

CI fixes `SOURCE_DATE_EPOCH` to the ZIP-compatible Unix epoch `315532800`, which
makes repeated wheel bytes stable. Setuptools source distributions retain some
unavoidable generated-member timestamps, so verification compares their
normalized file lists and file metadata content rather than archive byte hashes.
