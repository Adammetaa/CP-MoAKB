# RAS-012: Runtime Packaging and Composition Contract

**Status:** Active

**Version:** 1.0

## Purpose and architectural context

This specification governs installation artifacts and the narrow boundary by
which external consumers compose the transport-neutral application facade. The
packaging layer describes and carries code; it MUST NOT own domain knowledge or
change Runtime semantics.

## Distribution and version identity

The distribution name MUST be `cp-moakb`, the import package MUST be `cpmoakb`,
and the package version MUST be `0.1.0`. Python 3.11 and 3.12 are supported. The
Apache-2.0 expression and unmodified license text are authoritative. Author and
NOTICE metadata MUST NOT be invented.

The package version is independent from Runtime API `0.1`, YAML schema `1.0`,
JSON projection `1.0`, Application API `0.1`, HTTP API `0.1`, CLI API `0.1`, and
Composition API `0.1`. Version calculation MUST be static and MUST NOT depend on
Git, dates, dirty state, branches, host names, user names, paths, or environment
variables.

## Build backend and dependency groups

The project MUST use `pyproject.toml`, PEP 517, PEP 518, PEP 621, and pinned
setuptools. Base dependencies MUST contain only the pinned libraries needed by
the packaged Runtime and retained legacy imports: pandas, pdfplumber, and PyYAML.
FastAPI MUST be in the `http` extra. HTTP test clients and build, test, lint,
format, typing, and inspection tools MUST remain in `dev`. Production server
dependencies are prohibited.

## Import and composition contract

Base, Runtime, application, serialization, CLI, and composition imports MUST work
without FastAPI. The HTTP public package MUST load FastAPI only when the injected
factory is invoked. Imports MUST NOT load data, inspect files, read secrets,
access a network, construct registries, create databases, or create Runtime
services.

`cpmoakb.composition` MUST expose only
`RUNTIME_COMPOSITION_API_VERSION` and
`create_runtime_application_service`. The factory MUST require caller-supplied
public `QueryService` and `ExplanationService` values as keyword-only arguments,
MUST return a new `RuntimeApplicationService`, and MUST delegate invalid
dependency failures to the existing application contract. It MUST NOT provide
defaults, singletons, synthetic records, mutable globals, service locators,
dynamic imports, plugins, filesystem or environment discovery, persistence, or
network behavior. Equal supplied state MUST produce equivalent behavior.

Lower layers MUST NOT import composition. Composition MUST NOT import CLI, HTTP,
packaging helpers, or private lower-layer implementations.

## Execution boundaries

No console entry point is defined because meaningful query execution requires an
explicitly composed service. `run_cli` remains library-first. HTTP execution ends
at `create_http_app(injected_service)`; no default app, server process, port
binding, host configuration, Uvicorn, or Gunicorn is permitted.

## Package-data and artifact contracts

The wheel MAY contain Python source, metadata, the license, and the retained SQL
schema required by an explicitly called legacy builder. It MUST NOT contain
tests, docs, workflows, official datasets or PDFs, references, generated CSV,
SQLite databases, caches, coverage, secrets, local configuration, notebooks,
virtual environments, or temporary files. The source distribution MUST contain
the license, README, `pyproject.toml`, manifest rules, package source, and schema
needed for an offline rebuild, and MUST apply the same forbidden-data rules.

Wheel and source-distribution builds MUST succeed through `python -m build`.
Governed verification MUST reject forbidden content, validate identity, version,
Python and dependency metadata, compare repeat-build content lists and metadata,
and produce stable failures. Archive timestamp equality is not required.

Clean verification MUST cover editable install, wheel install, source install,
HTTP-extra install, core imports with FastAPI unavailable, installed-path
resolution without source-tree leakage, and `pip check`. Verification MAY use
standard packaging subprocesses but Runtime package code MUST NOT execute them.

## Compatibility, security, and extension rules

`cpmoakb.__version__` and the two composition symbols are additive stable public
API under RAS-007. RAS-008 projections, RAS-009 application envelopes, RAS-010
HTTP contracts, and RAS-011 CLI contracts remain unchanged. Runtime API stays
`0.1`. Removing or changing these additions requires compatibility review.

Builds and imports MUST NOT evaluate strings, deserialize pickle, load plugins,
scan home directories, access secrets, embed credentials, download data, write
outside build/test environments, or leak machine paths into metadata. Packaging
MUST NOT add persistence, mutation, diagnosis, recommendation, ranking,
confidence scoring, causality, scientific inference, or real agricultural data.

Future releases, PyPI publication, tags, executable deployment, production
servers, and official data distributions require separate governance. Extension
MUST preserve explicit dependency injection and MAY NOT create a default
knowledge base or automatic loader.
