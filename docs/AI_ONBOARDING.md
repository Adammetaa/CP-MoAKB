# AI Coding-Agent Onboarding

## Operating Rules

Before editing, review the whole repository: root files, source modules, tests, tools, schema, existing documentation, validation artifacts, and Git status/diff.  Base every statement and change on the checked-in implementation and the approved task; do not infer missing product behavior.

Use official sources only for canonical dataset work.  Preserve source provenance and do not substitute third-party summaries, scraped data, unverifiable copies, or model-generated values for official material.

## Design Freeze v1.0 Safeguards

Treat Design Freeze v1.0 as binding.  Do not change the database schema, IRAC parser behavior, CSV exporter behavior, hierarchy semantics, or existing tests unless explicit approval authorizes the specific change.  Do not add speculative abstractions, validators, fields, pipelines, or datasets.

The following require explicit approval before modification:

- `cpmoakb/database/schema.sql`
- `cpmoakb/parsers/irac_parser.py` and `cpmoakb/parsers/models.py`
- `cpmoakb/exporters/csv_exporter.py`
- `tools/validate_irac.py`
- Existing files in `tests/`
- Existing validation CSVs and `validation/VALIDATION_REPORT.md`

If a schema change appears necessary, stop work and explain: (1) why it is required, (2) which files would be affected, and (3) why the frozen schema cannot support the requirement.  Do not implement the schema change.

## Testing and Completion

Run the existing test suite after permitted changes.  Report the exact command and outcome.  Do not treat an unrun or unavailable test command as a pass; report the limitation accurately.

Before completion, inspect the final diff and confirm that it contains only task-scoped files, no schema/parser/exporter behavior changes, no generated CSVs for this sprint, and no generated artifacts, local databases, caches, or environment files.  Preserve unrelated user changes.

Commit only validated, task-scoped work with the requested message.  Push only after tests pass and the final diff satisfies the task rules.  The definition of done is: requested work is complete, review and tests have occurred, the diff is compliant, and commit/push status is reported truthfully.
