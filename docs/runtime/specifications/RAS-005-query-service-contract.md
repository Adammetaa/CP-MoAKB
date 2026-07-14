# RAS-005: Query Service Contract

**Status:** Active

**Version:** 1.0

This specification governs deterministic read-only queries over explicit Runtime objects. It applies [RAS-001](RAS-001-runtime-engineering-standard.md), preserves the [validation boundary](RAS-002-validation-framework.md), and consumes immutable snapshots defined by [RAS-004](RAS-004-registry-contract.md).

## Purpose and limits

Query services MUST retrieve and filter explicitly supplied Runtime records, snapshots, or storage-neutral repository values. A match MUST NOT establish identity equivalence from labels, scientific truth, causation, diagnosis, source approval, authority ranking, regulatory status, or recommendation suitability.

Queries MUST be read-only, deterministic, side-effect free, storage-neutral, network-free, independent of current time and environment locale, and explicit about match, language, and locale semantics. Query construction SHOULD remain separate from validation; callers SHOULD validate records explicitly when their workflow requires mechanically valid inputs.

## Criteria and matching

Criteria MUST be immutable and typed. Implementations MUST NOT accept executable predicates, arbitrary dictionaries, expression languages, or SQL-like strings. Empty criteria MAY mean deterministic list-all when documented. Contradictory conjunctive criteria SHOULD return an empty result; ordinary no-match searches MUST NOT raise.

Text matching has three distinct modes:

- **Exact:** Unicode string equality with no transformation.
- **CaseInsensitive:** deterministic Unicode `casefold()` equality with no locale-sensitive casing.
- **ConservativeNormalized:** Unicode NFC normalization, leading and trailing ASCII-whitespace removal, internal ASCII-whitespace collapse to one space, then `casefold()`.

Normalization MUST NOT remove diacritics or punctuation, transliterate, translate, stem, perform fuzzy similarity, infer synonymy, merge scientific and common names, or infer taxonomy. Language and locale tags MUST be compared explicitly and without environment-locale behavior.

## Results, ordering, and traceability

Matches SHOULD identify the record, matched field, actual matched value, match mode, and applicable language and locale. Results MUST retain the criteria and immutable ordered matches and MUST NOT contain relevance or scientific-confidence scores.

Match ordering MUST use canonical record identifier, matched field, language, locale, and matched value. List-all records MUST use canonical identifier ordering. Pagination is not implemented; a future offset/limit API MAY be added only with explicit deterministic semantics.

## Source boundaries

Queries MAY operate on explicit immutable tuples, immutable registry snapshots, or `RecordRepository.iter_records()`. They MUST NOT mutate sources or registries, persist or load data, access networks, allocate identifiers, or create hidden global indexes.

Relationship queries MUST remain limited to supplied one-edge subject, object, and predicate criteria. They MUST NOT traverse paths, compute closure, infer inverse relationships or causation, or resolve predicate semantics.
