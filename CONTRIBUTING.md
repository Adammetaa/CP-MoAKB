# Contributing to CP-MoAKB

## Design and data boundaries

Design Freeze v1.0 protects the database schema, parser behavior, exporter behavior, semantic validation rules, official sources and manifests, golden baselines, and existing validation artifacts. If a proposed change requires modifying a frozen component, stop implementation and open an issue for explicit design review.

Canonical data must come from an identifiable official source published or supplied by the responsible organization. Do not use unofficial mirrors, summaries, scraped substitutes, inferred values, or AI-generated replacements. Never silently normalize, merge, repair, or automatically correct official data.

## Branch and pull-request workflow

1. Start from an up-to-date `main` branch and create a focused topic branch.
2. Open or reference an issue that describes the problem, scope, and Design Freeze impact.
3. Keep changes small and avoid speculative code, dependencies, abstractions, or data corrections.
4. Run the complete test suite and review the diff before opening a pull request.
5. Complete every applicable item in the pull-request template and obtain explicit design approval for any frozen-area exception.

Pull requests target `main`. Do not push unreviewed feature work directly to `main`.

## Required tests

Install the pinned development dependencies and run:

```shell
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

Tests must be deterministic and read-only. Do not run golden baseline generation, schema generation, the legacy artifact validator, or production CSV/database generation as part of CI. See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for focused test commands.

## Commit messages

Use short, imperative Conventional Commit messages where practical:

- `feat(scope): add capability`
- `fix(scope): correct behavior`
- `docs(scope): clarify guidance`
- `test(scope): cover behavior`
- `chore(scope): maintain tooling`

Keep each commit limited to one coherent change.

## Golden baseline governance

Golden baselines identify and lock the registered official source and expected parser output. Do not regenerate or modify them to make a failing test pass. A baseline change requires a proven repository inconsistency or approved official-version update, recorded source identity, explicit review, and a clearly scoped diff.

## Schema-change stop condition

If a requirement cannot be represented by the frozen schema, stop. Open an issue explaining why the schema is insufficient, which files and consumers would be affected, and why the requirement cannot be met without a design change. Do not implement the schema change before approval.

## Definition of done

A contribution is complete only when:

- its issue and scope are clear;
- official-source and Design Freeze rules are satisfied;
- no speculative code or automatic data correction was introduced;
- required tests pass locally and in CI;
- no generated CSV, SQLite, cache, or unrelated artifact is present;
- documentation is updated where needed;
- the final diff contains only reviewed, task-scoped changes; and
- any required design or baseline approval is linked from the pull request.
