# IRAC Official Canonical Source

IRAC Mode of Action Classification Scheme v11.5 is the canonical IRAC source for CP-MoAKB.  The official PDF remains at [`references/IRAC/IRAC_MoA_Classification_v11.5_2026.pdf`](../../../references/IRAC/IRAC_MoA_Classification_v11.5_2026.pdf); it is not moved, renamed, or duplicated in this directory.

`source_manifest.yaml` records provenance and integrity metadata for that retained PDF.  It is metadata only and is not a copy of source content or a generated dataset.

## SHA-256 Verification

From the repository root, calculate the checksum and compare it with the manifest value:

```powershell
Get-FileHash -Algorithm SHA256 references/IRAC/IRAC_MoA_Classification_v11.5_2026.pdf
```

The reported SHA-256 must match `source_manifest.yaml` exactly.  A mismatch means the source must not be processed until it is reviewed and the provenance/integrity record is explicitly updated.

## Official-Version Updates

Treat a new official IRAC version as a new source-registration review.  Retain the existing version, add a separately reviewed record for the new official PDF, verify the source and checksum, and assess compatibility with the frozen parser and schema before any approved processing.  Never silently overwrite an old version.

Parser output, CSV files, SQLite databases, and validation outputs are generated artifacts.  No generated dataset artifacts are created or committed in Sprint-007 Part-2.
