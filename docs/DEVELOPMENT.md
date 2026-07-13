# Development Guide

## Supported Python version

CP-MoAKB development and continuous integration support Python 3.11 and Python 3.12. The codebase requires Python 3.10 or newer language features, but the CI matrix defines the versions continuously tested by the project.

## Clone the repository

```shell
git clone https://github.com/Adammetaa/CP-MoAKB.git
cd CP-MoAKB
```

## Create and activate a virtual environment

Windows PowerShell:

```powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```bat
py -3.12 -m venv .venv
.venv\Scripts\activate.bat
```

macOS and Linux:

```shell
python3.12 -m venv .venv
source .venv/bin/activate
```

## Install development dependencies

```shell
python -m pip install -r requirements-dev.txt
```

The development requirements contain the parser/data-frame runtime dependencies, pytest, and the Black, Ruff, mypy, and pre-commit developer tools. Versions are pinned so local and CI runs resolve the same direct dependencies.

## Run the CI checks locally

Run the same non-mutating checks and tests, in the same order as CI:

```shell
python -m ruff check .
python -m black --check tests/test_import_engine.py tests/test_sqlite_builder.py
python -m pytest -q
```

Repository-wide Black would require reformatting frozen parser, exporter, validator, test, and maintenance files. Design Freeze v1.0 prohibits that corrective rewrite, so Black currently governs only the two safely scoped import-smoke tests that already conform and require no rewrite. Ruff remains repository-wide; `ruff.toml` contains four precise per-file exceptions for pre-existing frozen code that cannot be changed in this sprint.

To run all configured free pre-commit hooks:

```shell
python -m pre_commit run --all-files
```

mypy 2.2.0 is installed for continued adoption but is deferred from CI. A repository-wide assessment using `python -m mypy --explicit-package-bases cpmoakb tests tools` reports seven existing errors in six files: missing third-party pandas stubs plus two invariant-dictionary errors in the frozen golden-baseline generator. These cannot be resolved in this corrective sprint without adding another dependency or changing frozen files, and no broad exclusions or suppressed errors are configured.

## Run focused tests

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

CI runs the same Ruff, scoped Black, and pytest commands on Python 3.11 and Python 3.12. It checks that they leave tracked and visible untracked files unchanged and rejects untracked CSV and SQLite artifacts even when their filename patterns are ignored locally.

## Design Freeze v1.0

The database schema, parser behavior, exporter behavior, semantic validation rules, official sources, manifests, golden baselines, and existing validation artifacts are frozen. Development work must not change them without an explicitly approved design review.

Do not silently normalize, repair, or automatically correct official data. If work appears to require a schema, parser, exporter, or semantic-rule change, stop and open an issue describing the requirement and its design impact before implementation.

CI and normal test runs must not execute:

- `tools/generate_irac_golden_baseline.py`
- `tools/validate_irac.py`
- `tools/generate_schema.py`
- CSV exporters or SQLite builders outside pytest temporary directories

Generated CSV and SQLite files must never be added by CI or committed as development output.
