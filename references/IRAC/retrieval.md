# IRAC v11.5 Reference Retrieval

The IRAC Mode of Action Classification Scheme is published by the Insecticide
Resistance Action Committee. CP-MoAKB records its identity for deterministic
parser development but does not redistribute the publication or claim reuse
permission.

## Governed identity

- Publisher: Insecticide Resistance Action Committee (IRAC)
- Publisher page: <https://irac-online.org/latest-updates-to-the-moa-classification-version-11-5/>
- Official download: <https://irac-online.org/documents/moa-classification/?ext=pdf>
- Local filename: `IRAC_MoA_Classification_v11.5_2026.pdf`
- Local directory: `references/IRAC/`
- Expected SHA-256: `74641b0f56bcfb46574fd0dc815ee136170af66385950ad61045a0692ea750d6`
- Expected size: `1480259` bytes

The local PDF is ignored by Git. Download availability does not establish a
right to redistribute it.

## Retrieval and verification

From the repository root, run:

```shell
python scripts/retrieve_irac_reference.py
python scripts/retrieve_irac_reference.py --verify-only
```

The utility uses only the fixed official URL, writes through a temporary file,
checks both the governed checksum and size, and atomically places the file only
after verification. A changed official file fails closed; do not update the
manifest, checksum, parser, or golden baseline without a separately reviewed
source-version change.

## Parser prerequisites

The parser itself accepts a caller-supplied path and performs no retrieval. The
source-dependent golden tests and `tools/generate_irac_golden_baseline.py`
require the verified local file. Repository verification that does not parse the
publication still checks the retained source identity, counts, hierarchy,
provenance, retrieval instructions, and publication boundary offline.
