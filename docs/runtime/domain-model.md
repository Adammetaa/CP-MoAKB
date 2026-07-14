# Runtime Domain Model

## Conceptual flow

```text
Source
  ↓
Evidence
  ↓
Candidate Record
  ↓
Review
  ↓
Future Canonical Record
```

This is a conceptual governance flow, not an automatic pipeline. No runtime operation currently performs promotion, and validation cannot replace human review.

## Identifiers

`CandidateIdentifier` accepts only the governed, filename-safe entity/context and relationship shapes. It validates supplied values but never allocates them. `CanonicalIdentifier` is an opaque non-empty wrapper because production syntax remains deferred; no implicit candidate-to-canonical conversion exists. `ExternalIdentifier`, `AuthorityIdentifier`, and `SourceIdentifier` retain their issuing context without constructing unknown resolver URLs.

## Labels

`Label` records explicit language, text, provenance/review status, preference, optional locale, source, editorial note, and ambiguity. `LabelSet` rejects exact duplicates and multiple preferred labels for one language/locale, then orders forms deterministically. It does not infer language from Unicode, normalize text into equivalence, or represent scientific nomenclature.

## Authorities and sources

`AuthorityReference` records identity, name, claim scope, and optional jurisdiction, version, and locator. It has no universal ranking or trust score. `SourceReference` records publication metadata, dates when known, authority references, reuse/currency notes, and scope. It performs no network access.

## Evidence

`EvidenceReference` points from a local evidence key to a source and opaque locator with a concise note, role, and optional language, uncertainty, and review status. Source metadata identifies material; evidence identifies how a portion supports, contextualizes, corroborates, or conflicts with a scoped matter. Neither model contains diagnosis or recommendation fields.

## Provenance

Creation, review, and supersession are separate immutable primitives. Aggregate `Provenance` retains source and evidence references, editorial notes, review history, supersession, and change reason without requiring personal names or collapsing history into a dictionary.

## Records and relationships

`CandidateRecord` carries common non-production metadata and rejects `Published` lifecycle status. `EntityRecord` adds optional `ScientificName` and classification references while keeping `domain_type` open and extensible. `ScientificName` is authority-governed nomenclature, not a language label.

`RelationshipRecord` requires a relationship candidate identifier, explicit subject, predicate, object, evidence-bearing common metadata, provenance, and optional context/uncertainty. Predicate text is retained as supplied; no graph, inverse, equivalence, transitivity, or causal inference is implemented.

## Validation

`ValidationIssue` contains a stable code, severity, message, and optional path, record, and remediation. `ValidationResult` sorts issues deterministically, filters by severity, combines results, and is invalid only when an Error exists. `Validator` is a format-neutral protocol accepting a typed domain object and returning a result.

## Repositories

The protocols define ports, not adapters. `RecordRepository` supports governed save, lookup, existence, iteration, and supersession without destructive deletion. `SourceRepository` and `AuthorityRepository` support typed lookup and existence checks. No filesystem, YAML, SQLite, network, or in-memory production implementation is supplied.

## Lifecycle meaning

Accepted means repository governance accepted the item at its applicable gate. Published does not mean universally true, regulator-approved, diagnostically sufficient, safe, or suitable for a recommendation. The published enum value is reserved for future canonical models and is prohibited on current candidate records.
