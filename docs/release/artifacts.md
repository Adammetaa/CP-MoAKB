# Release Artifacts

The governed build produces one wheel and one source distribution. The wheel
contains package modules, metadata, Apache-2.0 license, and the frozen SQL schema
needed by the explicitly invoked legacy builder. It excludes docs, examples,
tests, workflows, sources, PDFs, CSVs, databases, caches, and local configuration.

The distribution verifier checks required/forbidden contents and metadata and
compares repeated builds. The installation verifier uses temporary isolated
environments. Artifacts are ignored local outputs until separately approved for
publication.
