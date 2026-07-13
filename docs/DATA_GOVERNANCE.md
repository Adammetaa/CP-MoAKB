# Official Canonical Dataset Governance

## Canonical Dataset Policy

The canonical dataset must be derived only from official source material.  For IRAC, the repository's parser is explicitly for the official IRAC Mode of Action Classification Scheme PDF.  A source must be identifiable, retained in its approved raw location, and associated with its source version before it is treated as canonical input.

## Approved Sources and Provenance

Approved sources are primary materials published or supplied by the responsible official organization.  Record the organization, document title, version, and the repository path of the retained source.  Do not treat a filename alone as proof of provenance; retain enough review context to identify the official publication.

Prohibited sources include unofficial mirrors, blogs, vendor summaries, crowd-edited material, web scraping without an approved official source, synthetic data, and values inferred by an AI agent.

## Raw and Processed Boundaries

Raw official source files belong in `data/official/`.  IRAC raw material belongs in `data/official/IRAC/`.  Parsing creates in-memory `IRACDocument`/`IRACNode` objects; the CSV exporter creates processed output only when explicitly run.

This sprint does not generate or commit CSV files.  Existing files in `validation/` are validation artifacts from the repository's standalone validation workflow, not a destination for new canonical data.  Do not overwrite them during Sprint-007 Part-1.

## Naming and Directory Conventions

- Use `data/official/<SOURCE>/` for raw material, where `<SOURCE>` is the responsible source family (for example, `IRAC`).
- Use source-provided, version-bearing filenames where available; do not invent a version.
- Keep a source document intact; do not edit raw files to normalize their contents.
- Keep processed outputs outside raw-source directories when an approved workflow requires them.

## Validation Requirements

Before an approved export is accepted, parse the official source, verify that every class has a group parent and every ingredient has a class parent, check expected identifiers/field layouts against the frozen schema, and review duplicate or conflicting source values.  The current `tools/validate_irac.py` script checks missing names/parents, duplicate names per hierarchy level, and unresolved parsed parents; it does not independently verify provenance or perform a SQLite import.

## Duplicate and Conflict Handling

Do not silently merge, rename, discard, or invent replacements for duplicates or conflicts.  Preserve the official source value, record the conflict for review, and obtain explicit approval before a resolution that would alter the frozen parser/exporter behavior or schema.  Conflicts between source versions are versioned source facts, not grounds to overwrite prior provenance.

## Versioning, Review, and Approval

Preserve the source version detected or stated by the official document.  Treat a new official version as a new review event: verify provenance, assess validation results, and confirm compatibility with the frozen hierarchy and schema before any approved processing.

Dataset additions or replacements require review of the source, provenance, parser output, validation outcome, and final Git diff.  Approval is required for any exception to these rules, any schema implication, or any modification to frozen components.
