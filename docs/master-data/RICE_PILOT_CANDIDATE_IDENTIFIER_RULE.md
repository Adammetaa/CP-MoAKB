# Rice Pilot Candidate Identifier Allocation Rule

- Status: Approved for Tranche A planning
- Date: 2026-07-14
- Scope: non-production review handles only

## Syntax and meaning

Candidate identifiers use exactly one of these forms:

- Entity or context: `CPM-CAND-E-NNNNNN`
- Relationship assertion: `CPM-CAND-R-NNNNNN`

The normative regular expression is `^CPM-CAND-[ER]-[0-9]{6}$`. `CPM-CAND` makes non-production status visible. `E` and `R` distinguish record granularity only. The six-digit component is registry-controlled and carries no scientific, domain, entity-type, language, or workflow meaning.

Identifiers are uppercase ASCII and compared case-sensitively. The filename is the identifier plus lowercase `.yaml`, for example the fictional, unallocated filename `CPM-CAND-E-999999.yaml`. Documentation values ending in `999999` are examples only: they are not reservations, allocations, agricultural records, or valid evidence that the number is available.

## Registry and allocation

Sprint-016 must create the allocation registry only after the entry checklist is authorized. Its governed location will be `data/candidates/rice/identifier-registry.yaml`. Sprint-015B does not create that directory or registry.

The registry maintains separate monotonic counters for `E` and `R` and an immutable row for every reservation. Allocation occurs in a pull request that:

1. reserves the next unused number for the record kind;
2. records reservation status, date, curator reference, and pull-request reference;
3. passes exact uniqueness checks across the registry, filenames, and record bodies; and
4. merges the reservation before or atomically with its first candidate file.

Concurrent requests must rebase on the current registry. CI failure, not a content-based hash or label, prevents collision. Lexicographic order equals numeric order within each kind because the numeric component is fixed-width.

## Non-reuse and history

Reserved, abandoned, rejected, withdrawn, superseded, and promoted identifiers are never reused. Their registry rows remain with disposition, date, reason, and successor or production mapping where applicable. A candidate identifier stays stable throughout review and remains in audit history after promotion; it never becomes a production identifier and is not externally resolvable.

## Prohibitions

No identifier may encode crop, organism, stage, organ, taxon, label, source, date, or mutable classification. Renaming a label or changing a scientific opinion never changes the candidate identifier. This document allocates no identifier.
