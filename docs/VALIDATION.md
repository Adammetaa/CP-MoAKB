# IRAC Semantic Validation

## Purpose and stages

The semantic validation layer checks an already parsed, in-memory `IRACDocument`. It is separate from source identity checks, PDF parsing, golden regression comparison, CSV export, and database loading.

Validation has two stages:

1. `validate_irac_document(document)` applies generic hierarchy and semantic rules.
2. `validate_irac_v11_5(document)` adds the registered canonical v11.5 counts: 376 total nodes, 42 MoA groups, 64 chemical classes, and 270 active ingredients.

Both functions return a deterministically ordered list of immutable `ValidationFinding` values. A finding contains a rule identifier, severity, message, and optional affected node and parent identifiers.

## Rules

- `document.missing`, `document.nodes_missing`: required document structure is absent.
- `node.identifier_required`, `node.identifier_duplicate`: node identifiers are empty or repeated.
- `node.level_unrecognized`: a node is not at hierarchy level 1, 2, or 3.
- `parent.required`, `parent.not_found`: a class or ingredient lacks a resolvable parent.
- `parent.root_forbidden`, `parent.level_invalid`: the root or parent-child level relationship is invalid.
- `parent.self_reference`, `parent.cycle`: the parent graph contains a self-reference or cycle.
- `value.name_required`: a group, class, or ingredient name is empty.
- `semantic.group_code_duplicate`: an MoA group code is repeated.
- `semantic.class_identifier_duplicate`, `semantic.class_duplicate`: a class identifier or name is repeated within the same group.
- `semantic.ingredient_duplicate`: an ingredient name is repeated within the same class.
- `canonical.v11_5.count.*`: a registered v11.5 hierarchy count differs from its baseline.

The currently implemented rules have severity `error`. The result model also reserves `warning` for non-failing semantic concerns supported by future approved requirements.

## Read-only guarantee

Core validation has no filesystem access and does not mutate the document, repair values, normalize source data, invoke the exporter, or write validation artifacts. Findings contain no timestamps, machine paths, or process-specific values. Invalid data is reported exactly as supplied; automatic correction is prohibited.

## Known limitations

Validation operates on the frozen five-field `IRACNode` model. It does not re-evaluate PDF extraction, source provenance, golden hierarchy content, database constraints, or fields absent from that model. Duplicate semantic names are exact, case-sensitive matches scoped to their required parent; global name uniqueness is not enforced.

## Safe tests

From the repository root, run:

```powershell
python -m pytest -q
```

The canonical integration test verifies the registered manifest/golden source identity, parses the retained PDF in memory, validates semantics and counts, and writes no files.
