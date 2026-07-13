# Development Guide

## Supported Python version

CP-MoAKB development and continuous integration use Python 3.11. The codebase requires Python 3.10 or newer language features, but Python 3.11 is the supported and continuously tested version.

## Clone the repository

```shell
git clone https://github.com/Adammetaa/CP-MoAKB.git
cd CP-MoAKB
```

## Create and activate a virtual environment

Windows PowerShell:

```powershell
py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```bat
py -3.11 -m venv .venv
.venv\Scripts\activate.bat
```

macOS and Linux:

```shell
python3.11 -m venv .venv
source .venv/bin/activate
```

## Install development dependencies

```shell
python -m pip install -r requirements-dev.txt
```

The development requirements contain only the parser/data-frame runtime dependencies and pytest. Versions are pinned so local and CI runs resolve the same direct dependencies.

## Run tests

Complete suite:

```shell
python -m pytest -q
```

Parser tests:

```shell
python -m pytest -q tests/test_irac_parser.py
```

Golden baseline tests:

```shell
python -m pytest -q tests/test_irac_golden_baseline.py
```

Semantic validation tests:

```shell
python -m pytest -q tests/test_irac_validator.py
```

## Read-only testing guarantee

The committed test suite does not write into the repository. Exporter tests write only below pytest-managed temporary directories. Golden baseline and semantic validation tests read the registered official PDF and compare or validate in-memory results; they do not invoke baseline generators, CSV generation tools, database builders, or the artifact-generating legacy validator.

CI checks that tests leave tracked and visible untracked files unchanged. It also rejects untracked CSV and SQLite artifacts even when their filename patterns are ignored locally.

## Design Freeze v1.0

The database schema, parser behavior, exporter behavior, semantic validation rules, official sources, manifests, golden baselines, and existing validation artifacts are frozen. Development work must not change them without an explicitly approved design review.

Do not silently normalize, repair, or automatically correct official data. If work appears to require a schema, parser, exporter, or semantic-rule change, stop and open an issue describing the requirement and its design impact before implementation.

CI and normal test runs must not execute:

- `tools/generate_irac_golden_baseline.py`
- `tools/validate_irac.py`
- `tools/generate_schema.py`
- CSV exporters or SQLite builders outside pytest temporary directories

Generated CSV and SQLite files must never be added by CI or committed as development output.
