# License and Attribution Audit

This is a repository engineering review, not legal advice or legal
certification. Any unresolved rights question remains subject to qualified
review.

## Repository source license

The top-level `LICENSE` is the unmodified Apache License Version 2.0 text.
`pyproject.toml` declares the SPDX expression `Apache-2.0` and includes the
license in built distributions. The project has no governed per-file source
header requirement and no `NOTICE` file or invented notice content.

Repository-authored Python, tests, scripts, workflow configuration,
documentation, Mermaid diagrams, and fictional examples are governed as
repository source. Git history is the available contribution evidence; this
audit does not invent authors, copyright years, contributor lists, or ownership
claims.

## Third-party dependencies and actions

Python dependencies are referenced by exact package/version metadata and are not
vendored into repository or wheel contents. Each dependency remains under its
own license; Apache-2.0 does not relicense it. A publication review must reassess
dependency licenses and advisories against current authoritative sources.

GitHub Actions uses official `actions/checkout` and `actions/setup-python`
revisions pinned by immutable commit SHA. Action code is not copied into this
repository and retains its upstream license and provenance.

## Official reference material boundary

Official-source authority, factual citation, copyright, and redistribution
permission are distinct. The IRAC v11.5 identity, version, publisher, expected
filename, byte size, SHA-256, parser counts, hierarchy expectations, and
retrieval procedure are retained. The copyrighted PDF is not tracked, bundled,
mirrored, uploaded, or represented as Apache-2.0 material. In short, it is not
tracked, bundled, mirrored, uploaded, or relicensed. Its official download
availability is not treated as redistribution permission.

The same boundary applies to future IRAC, FRAC, HRAC, EPPO, FAO, IRRI, OECD,
ISO, ASTM, Rice Department, or other official publications unless explicit
redistribution rights are documented. Factual citations and provenance metadata
do not themselves license copied text, images, tables, or files.

## Package and artifact inclusion

Wheel and sdist policy includes only package/runtime files and required project
metadata. It excludes official publications, `data`, `references`, docs,
examples, tests, PDFs, generated CSV, databases, and local artifacts. Examples
use fictional records and contain no copied agricultural corpus. Release
verification fails if prohibited publication file types become tracked or enter
artifacts.

## Conclusion

The package-distribution boundary is compatible with the governed Apache-2.0
source declaration because no known third-party official publication is
distributed in it. This conclusion is conditional on retaining the verifier,
exclusion, provenance, and retrieval controls and does not certify rights beyond
repository evidence.
