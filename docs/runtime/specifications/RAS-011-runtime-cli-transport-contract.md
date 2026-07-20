# RAS-011: Runtime CLI Transport Contract

**Status:** Active

**Version:** 1.0

## Purpose and architecture

This specification governs the minimal deterministic read-only reference CLI over `RuntimeApplicationService`. It parses a closed argument contract, creates existing application requests, calls approved facade operations, and writes deterministic JSON to explicitly supplied streams without importing Runtime implementation layers.

The independent CLI API version is `0.1`, exposed as `RUNTIME_CLI_API_VERSION`. It is separate from Runtime API `0.1`, YAML schema `1.0`, projection `1.0`, Application API `0.1`, HTTP API `0.1`, and repository releases.

## Library-first execution and injection

`run_cli(argv, runtime_application_service, stdout, stderr) -> int` is the only execution entry. All dependencies are mandatory. Core execution MUST NOT read implicit process arguments or streams, environment variables, files, configuration, registries, or hidden global state. Import MUST NOT execute a command.

No approved composition root can create a meaningful service without an explicit governed query source. This version therefore has no console entry point or `main()` wrapper. Executable packaging is deferred rather than faked with hidden or synthetic data.

## Commands and arguments

- `version` emits stable CLI, Application, Runtime, projection, and HTTP versions.
- `query` calls `RuntimeApplicationService.query_and_project`.
- `query-and-explain` requires `--match-index` and calls `query_explain_and_project`.

Query options are `--domain-type`, `--label-text`, `--predicate` (1–256 characters, not ASCII-whitespace-only), `--language` and `--locale` (1–64 characters), `--label-scope` (`any`, `preferred`, `alternative`), and `--match-mode` (`exact`, `case_insensitive`, `conservative_normalized`). `--match-index` is an integer from 0 through 10,000.

Unknown options, missing commands or values, invalid choices, and out-of-range integers are rejected. There are no arbitrary key/value options, collections, JSON/YAML blobs, expressions, dynamic operations, class/module names, paths, or URLs. An argparse Namespace MUST NOT enter the facade.

## Output and canonical JSON

Success writes exactly one compact Unicode JSON document plus one trailing newline to stdout and nothing to stderr. Query commands write `ProjectedApplicationResponse.canonical_json`, preserving RAS-008 and RAS-009 behavior without importing projection functions or encoding Runtime objects. `version` uses standard-library deterministic JSON over its closed static string mapping with sorted keys and compact separators.

Failure writes exactly one compact JSON error document and trailing newline to stderr and nothing to stdout. There are no banners, logs, colors, progress output, reprs, timestamps, random IDs, machine data, paths, module names, or traceback text.

## Exit codes and errors

| Failure | Exit | Code |
| --- | ---: | --- |
| CLI argument contract | 2 | `cli-argument-error` |
| Application contract | 3 | `application-contract-error` |
| Unsupported application request | 4 | `unsupported-application-request` |
| Application dependency | 5 | `application-dependency-error` |
| Typed Query, Explanation, or Serialization failure | 6 | corresponding `runtime-*-error` |
| Unexpected failure | 70 | `internal-error` |

Argparse termination is replaced by a private typed error; `SystemExit` MUST NOT escape core execution. Application and Runtime failures use `classify_application_error`. Messages are fixed and exclude exception text. No failure returns zero.

## Dependency and security boundaries

CLI may import `cpmoakb.application` and public version constants from `runtime_api`, `serialization`, and `http_api`. It MUST NOT import Query, Explanation, projection functions or internals, Registry, Domain, Validation, YAML adapters, parsers, exporters, databases, HTTP route/framework internals, filesystem/environment/network clients, subprocess, shell, or plugin loaders. Lower layers MUST NOT import CLI.

The CLI MUST NOT execute input; use eval, exec, pickle, dynamic imports, subprocesses, or shell commands; deserialize objects; read secrets or machine state; access filesystem/network; write files; own or mutate registries; construct records; allocate identifiers; persist; diagnose; recommend; rank; score confidence; infer causality; calculate economics; or select products.

## Compatibility and extensions

Public CLI symbols MUST appear in `cpmoakb.cli.__all__`, the manifest, and static tests. This additive transport is backward compatible under RAS-007 and leaves existing versions and RAS-008 through RAS-010 contracts unchanged.

Changing commands, arguments, bounds, output/newline rules, errors, exit codes, injection, or dependency direction requires compatibility analysis. Breaking changes require a new CLI API version. Future packaging, a composition root, help behavior, or additional commands require explicit decisions and MUST NOT introduce hidden data or state.
