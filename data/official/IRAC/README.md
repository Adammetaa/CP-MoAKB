# IRAC Official Canonical Source

IRAC Mode of Action Classification Scheme v11.5 is the registered canonical
IRAC source identity for CP-MoAKB. The copyrighted PDF is not distributed by the
repository. Developers obtain an untracked local copy by following the
[retrieval instructions](../../../references/IRAC/retrieval.md).

`source_manifest.yaml` records provenance and integrity metadata. It is metadata
only and is not a copy of source content or a generated dataset.

## SHA-256 Verification

From the repository root, verify a retrieved local copy:

```shell
python scripts/retrieve_irac_reference.py --verify-only
```

The reported SHA-256 must match `source_manifest.yaml` exactly.  A mismatch means the source must not be processed until it is reviewed and the provenance/integrity record is explicitly updated.

## Official-Version Updates

Treat a new official IRAC version as a new source-registration review. Preserve
the existing metadata and golden baseline, add a separately reviewed record,
verify source identity, and assess compatibility with the frozen parser and
schema before approved processing. Never commit or silently overwrite the
publication.

Parser output, CSV files, SQLite databases, and validation outputs are generated artifacts.  No generated dataset artifacts are created or committed in Sprint-007 Part-2.
