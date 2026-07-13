# CP-MoAKB

[![CI](https://github.com/Adammetaa/CP-MoAKB/actions/workflows/ci.yml/badge.svg)](https://github.com/Adammetaa/CP-MoAKB/actions/workflows/ci.yml)

CP-MoAKB is a source-oriented pipeline for parsing and validating the official IRAC Mode of Action Classification Scheme.

## Quick Start

```python
from cpmoakb.parsers.irac_parser import parse_irac_pdf
from cpmoakb.validation import validate_irac_document

document = parse_irac_pdf("IRAC-MoA-Classification.pdf")
findings = validate_irac_document(document)
```

The parser and semantic validator operate in memory and do not write CSV or SQLite files.

## Development Setup

CP-MoAKB uses Python 3.11 and pinned open-source development dependencies. Follow the [development guide](docs/DEVELOPMENT.md) to create a virtual environment and install `requirements-dev.txt`. Contribution and data-governance rules are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Testing

Run the complete read-only test suite with:

```shell
python -m pytest -q
```

GitHub Actions runs this command for pushes to `main` and pull requests targeting `main`, then verifies that tests created no prohibited artifacts.

## Semantic Validation

`validate_irac_document(document)` applies generic deterministic semantic checks to an existing in-memory document. `validate_irac_v11_5(document)` adds canonical v11.5 count checks. See [IRAC Semantic Validation](docs/VALIDATION.md) for rules and limitations.

## IRAC parser and CSV export

The IRAC parser reads an official IRAC Mode of Action Classification Scheme PDF
without relying on fixed page numbers. It returns normalized, in-memory objects
only; it does not use SQLite or the Import Engine.

```python
from cpmoakb.exporters.csv_exporter import export_irac_csv
from cpmoakb.parsers.irac_parser import parse_irac_pdf

document = parse_irac_pdf("IRAC-MoA-Classification.pdf")
paths = export_irac_csv(document, "build/irac")
```

`paths` contains the generated `MoA_Group.csv`, `Chemical_Class.csv`, and
`Active_Ingredient.csv` paths. The CSV columns follow the frozen CP-MoAKB
knowledge model; this export does not alter the database schema.
