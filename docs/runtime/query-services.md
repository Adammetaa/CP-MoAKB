# Read-Only Query Services

The `cpmoakb.query` package implements [RAS-005](specifications/RAS-005-query-service-contract.md) over explicit immutable records and registry snapshots. It is an in-memory read boundary, not a database or search engine.

## Sources and public API

`ReadOnlyQueryIndex` is built explicitly from candidate records, rejects duplicate identifiers, preserves the original immutable objects, and exposes deterministic tuples. `QueryService` supports exact identifier lookup, list-all, and conjunctive `QueryCriteria`. It may be built from an explicit iterable or the read-only `iter_records()` method of a storage-neutral repository protocol.

Criteria cover record kind, domain type, lifecycle, label text/scope/language/locale, external identifier, one-edge relationship subject/object/predicate, and source or authority identifier. Empty criteria mean list-all. Required exact lookup raises `QueryItemNotFoundError`; ordinary searches with no match return an empty `QueryResult`.

`RegistrySnapshotQueryService` performs exact typed lookup and deterministic listing over separately supplied source, authority, and optional candidate-identifier snapshots. It does not make compatibility decisions, mutate live registries, approve sources, or rank authorities.

## Text semantics

- `Exact` uses unchanged Unicode equality.
- `CaseInsensitive` uses locale-independent `casefold()` only.
- `ConservativeNormalized` applies NFC, trims leading/trailing ASCII whitespace, collapses internal ASCII whitespace to one space, then casefolds.

Normalization preserves punctuation and diacritics. It does not transliterate, translate, stem, fuzzy-match, infer synonyms, or establish equivalence. Language and locale tags are compared case-insensitively as explicit tags; they are never inferred.

## Results and boundaries

Each immutable `QueryMatch` records the original record, matched field, actual matched value, match mode, and applicable language/locale. `QueryResult` retains the criteria and orders matches by record identifier, matched field, language, locale, and value. Label searches may return multiple matches for one record when multiple labels satisfy the criteria; `total_count` counts matches.

Relationship queries inspect only explicitly supplied relationship records and one edge. There is no traversal, path finding, transitive closure, inverse inference, causation, or predicate interpretation. Persistence, remote search, HTTP, databases, graph services, pagination, embeddings, and explanation generation remain deferred.

Validation remains a separate explicit operation. Query construction does not run a validation profile, and callers SHOULD validate records beforehand when required by their workflow. YAML loading does not create a query index automatically.

Tests use synthetic fictional records only. Label matching does not establish identity equivalence; results do not prove scientific correctness. Query services do not diagnose, recommend, approve sources, rank authorities, or promote candidates. Real Rice candidate authoring remains blocked.
