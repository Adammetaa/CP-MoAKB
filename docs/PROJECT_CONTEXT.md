# CP-MoAKB Project Context

## Purpose

CP-MoAKB contains a small, source-oriented pipeline for the IRAC Mode of Action (MoA) Classification Scheme.  It parses an IRAC PDF into normalized in-memory objects and can export those objects as the three CSV datasets represented by the repository's SQLite schema.  The repository also contains a separate ZIP/XLSX inspection utility and a SQLite schema builder.

## Design Freeze v1.0

Sprint-007 Part-1 operates under Design Freeze v1.0.  The frozen implementation contract is the existing hierarchy, CSV field layout, database schema, parser behavior, and exporter behavior.  This sprint prepares locations and documentation for an official canonical dataset; it does not extend the model or change ingestion behavior.

## Architecture and Main Modules

- `cpmoakb/parsers/models.py` defines immutable `IRACDocument` and `IRACNode` objects.  A node has `code`, `name`, `level`, `parent_code`, and source `page`.
- `cpmoakb/parsers/irac_parser.py` reads an IRAC PDF with `pdfplumber` and returns an `IRACDocument`; it has no SQLite or import-engine dependency.
- `cpmoakb/exporters/csv_exporter.py` projects IRAC nodes into the three frozen CSV layouts.  It does not open SQLite or invoke the import engine.
- `cpmoakb/database/schema.sql` is the SQLite schema; `sqlite_builder.py` creates a database by executing it.
- `cpmoakb/loaders/import_engine.py` separately inspects ZIP files containing XLSX workbooks and writes metadata/log files beneath its output directory.  It is not part of the IRAC parser/exporter flow.
- `tools/validate_irac.py` is the repository's standalone IRAC validation script.
- `tools/generate_schema.py` can generate a SQL schema from an Excel data dictionary; it is not used by the IRAC pipeline.

## IRAC Parser Pipeline

`parse_irac_pdf()` delegates to `IRACParser.parse()`.  The parser checks that the PDF exists, extracts text from all pages, detects a version, and chooses either table parsing for pages containing `IRAC MoA Classification Version` or a simple-text compatibility parser.

The emitted hierarchy is source-oriented:

1. Level 1: MoA group (`parent_code=None`)
2. Level 2: chemical class (`parent_code` is a group code)
3. Level 3: active ingredient (`parent_code` is a class code)

For table-form PDFs, group descriptors are read from the appendix.  Classes and ingredients are collected from table columns, deduplicated by class/code or class/name pairing, and ingredients receive deterministic source-oriented codes.  The simple-text path supports concise fixtures and older-style exports.

## Export Pipeline

`export_irac_csv(document, output_dir)` partitions nodes by level and writes:

- `MoA_Group.csv`: `moa_group_id`, `group_code`, `group_name`, `source_version`
- `Chemical_Class.csv`: `chemical_class_id`, `moa_group_id`, `class_name`
- `Active_Ingredient.csv`: `active_ingredient_id`, `chemical_class_id`, `iso_common_name`

IDs are deterministic IRAC/version-scoped export values.  The exporter only writes the requested output directory and returns the three paths.

## Validation Workflow

A standalone validator exists at `tools/validate_irac.py`. After the developer
follows the governed [IRAC retrieval instructions](../references/IRAC/retrieval.md),
it locates the verified local IRAC v11.5 PDF, parses it, exports the three IRAC
CSVs to `validation/`, and writes `validation/VALIDATION_REPORT.md`. It checks
missing names/parents, duplicate names within each level, and unresolved parsed
parent references. It does not load CSVs into SQLite, enforce all database
constraints, compare against a remote source, or provide a reusable validation
API.

The tests exercise parser hierarchy/version handling and CSV export fields/IDs.  The import-engine and SQLite-builder test modules currently only import their functions; they do not invoke them.

## Database and Schema Boundaries

The frozen schema contains `organization`, `moa_group`, `chemical_class`, and `active_ingredient`.  `chemical_class.moa_group_id` references `moa_group.moa_group_id`; `active_ingredient.chemical_class_id` references `chemical_class.chemical_class_id`.  The parser/exporter hierarchy and the three exported layouts align with the latter three tables.  `organization` is outside the IRAC export.

Do not alter `cpmoakb/database/schema.sql`, use `tools/generate_schema.py` to replace it, or add fields/tables without explicit approval.  A requirement that cannot be represented by this schema is a stop condition, not a reason to infer a change.

## Repository Conventions

- Store incoming canonical source material only under `data/official/`, with IRAC material under `data/official/IRAC/`.
- Never track official reference publications without documented redistribution
  rights. Retain identity, provenance, checksums, retrieval instructions, and
  deterministic expectations instead.
- Do not commit generated databases, caches, temporary files, environment files, or generated CSVs for this sprint.
- Keep tests under `tests/`; keep maintenance scripts under `tools/`.

## Known Limitations

- The parser is designed around the current IRAC document forms.  Its appendix scan includes pages 24--28 as a fallback in addition to detecting the descriptor heading, so a materially reorganized official PDF may need approved parser work.
- If a parsed class references a group that has no appendix descriptor, the parser creates a fallback group name of `IRAC group <code>` with page `0`.
- Validation checks parsed-node relationships and names, not a database import or all source-provenance metadata.
- Source-dependent parser regression and golden regeneration require the locally
  retrieved, checksum-verified IRAC v11.5 PDF; the publication is not bundled.

## Explicitly Frozen Components

- `cpmoakb/database/schema.sql`
- `cpmoakb/parsers/irac_parser.py` and the IRAC node hierarchy in `models.py`
- `cpmoakb/exporters/csv_exporter.py` and its three CSV field layouts
- Existing tests and the validation artifact workflow, unless an approved requirement strictly requires a change
