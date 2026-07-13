# CP-MoAKB

[![CI](https://github.com/Adammetaa/CP-MoAKB/actions/workflows/ci.yml/badge.svg)](https://github.com/Adammetaa/CP-MoAKB/actions/workflows/ci.yml)

CP-MoAKB is a source-oriented pipeline for parsing and validating the official IRAC Mode of Action Classification Scheme.

## Architecture Overview

The IRAC parser reads the retained official PDF into immutable `IRACDocument` and `IRACNode` objects. The semantic validator checks those in-memory objects without filesystem access. CSV export is an explicit, separate operation, while the SQLite builder and ZIP/XLSX import utility remain independent of the parser-validation flow.

## Repository Structure

- `cpmoakb/parsers/`: PDF parsing and immutable hierarchy models.
- `cpmoakb/validation/`: deterministic, read-only semantic validation.
- `cpmoakb/exporters/`: explicit CSV projection using the frozen layouts.
- `cpmoakb/database/` and `cpmoakb/loaders/`: separate schema/build and import utilities.
- `data/official/` and `references/`: registered source metadata and retained official material.
- `tests/`: unit, canonical golden-baseline, and semantic integration tests.
- `docs/`: governance, development, validation, and project context.

## Release Status

The current release baseline is v0.8.0. The `main` branch may contain reviewed work intended for a later release; a feature is not considered released until it is included in a published release or tag.

## Roadmap

The planned v0.9.0 line focuses on developer experience, continuous integration, and lightweight issue governance. Dataset-version, parser, exporter, validator-rule, and schema work remains subject to official-source review and Design Freeze approval. GitHub Issues and milestones are the source of truth for scoped future work.

## Knowledge Architecture

The future-facing architecture is documented in [Product Vision](docs/PRODUCT_VISION.md), [Conceptual Domain Model](docs/DOMAIN_MODEL.md), [Ontology Foundation](docs/ontology/README.md), [Knowledge Identifier Strategy](docs/identifiers/README.md), [Knowledge Graph](docs/KNOWLEDGE_GRAPH.md), [Decision-Support Workflow](docs/DECISION_ENGINE.md), [Source Policy](docs/SOURCE_POLICY.md), [Evidence Levels](docs/EVIDENCE_LEVELS.md), [Field Knowledge Policy](docs/FIELD_KNOWLEDGE_POLICY.md), and [Strategic Roadmap 2.0](docs/ROADMAP_2.0.md). These documents are conceptual and do not change current runtime capabilities. Durable decisions are indexed in [Architecture Decision Records](docs/ARCHITECTURE_DECISIONS/README.md).

## Quick Start

```python
from cpmoakb.parsers.irac_parser import parse_irac_pdf
from cpmoakb.validation import validate_irac_document

document = parse_irac_pdf("IRAC-MoA-Classification.pdf")
findings = validate_irac_document(document)
```

The parser and semantic validator operate in memory and do not write CSV or SQLite files.

## Development Setup

CP-MoAKB tests Python 3.11 and Python 3.12 with pinned open-source development dependencies. Follow the [development guide](docs/DEVELOPMENT.md) to create a virtual environment and install `requirements-dev.txt`. Contribution and data-governance rules are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Testing

Run the complete read-only test suite with:

```shell
python -m pytest -q
```

GitHub Actions runs lint, governed formatting, and this test command on Python 3.11 and Python 3.12 for pushes to `main` and pull requests targeting `main`, then verifies that no prohibited artifacts were created.

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
