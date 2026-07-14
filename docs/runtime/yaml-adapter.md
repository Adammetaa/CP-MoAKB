# Constrained YAML Candidate Adapter

## Purpose and boundary

`cpmoakb.adapters.yaml` converts one synthetic candidate YAML document into an immutable `cpmoakb.domain` record. The dependency direction is strictly:

```text
YAML representation
  ↓
cpmoakb.adapters.yaml
  ↓
cpmoakb.domain
```

The domain package does not import the adapter or PyYAML. The adapter does not import the legacy parser, exporter, database, SQLite builder, semantic validator, network clients, registries, query services, or explanation services.

Parsing success does not prove scientific correctness. Mapping success does not prove source approval. Runtime Core construction does not authorize publication. Loaded candidates are not production data.

## Dependency decision

The adapter uses the single pinned runtime YAML library `PyYAML==6.0.3` and its typing-only package `types-PyYAML==6.0.12.20260518`. It uses `yaml.SafeLoader` for event scanning and node composition, then converts allowed nodes itself. It never calls `yaml.load`, constructs Python objects, or exposes loader subclasses.

## Public API

The same intentional entry points are exported by `cpmoakb.adapters` and `cpmoakb.adapters.yaml`:

- `parse_candidate_yaml(text)` and `parse_candidate_yaml_bytes(data)` return a constrained built-in mapping;
- `load_candidate_yaml(text)` and `load_candidate_yaml_bytes(data)` return one `CandidateRecord` subtype; and
- `load_candidate_yaml_file(path)` reads one explicit local `Path` as strict UTF-8.

No API scans directories, expands globs, follows URLs, searches fallback paths, writes files, caches globally, allocates identifiers, or generates timestamps.

## Schema version

Sprint-017R supports exactly the quoted string `schema_version: "1.0"`. Missing, numeric, or unsupported versions fail with `YamlSchemaVersionError` before domain mapping. There is no fallback, migration, negotiation, or best-effort conversion. Key order is not enforced; mapped tuples are deterministic regardless of mapping insertion order.

## Supported representation

Every record requires `schema_version`, `candidate_id`, `record_kind`, `domain_type`, `lifecycle`, non-empty `labels`, `scope_note`, and `provenance`.

Optional common fields are `external_identifiers`, `authorities`, `sources`, `evidence`, and `ambiguity_notes`. An entity may additionally use `scientific_name` and `classification`. A relationship instead requires `subject_id`, `predicate`, and `object_id`, and may use `context_note` and `uncertainty_note`.

Nested contracts are explicit:

- labels retain language, text, status, preferred flag, and optional locale, source, editorial, and ambiguity fields;
- external identifiers retain authority, value, and only an explicitly supplied resolver URI;
- authorities retain identifier, name, scope, and optional jurisdiction, version, and locator;
- sources retain identifiers, publication metadata, quoted ISO dates, authority identifiers, reuse/currency notes, and scope;
- evidence retains local key, source key, opaque locator, note, role, and optional language, uncertainty, and review status;
- provenance separates creation, source/evidence references, reviews, editorial note, supersession, and change reason;
- scientific names remain separate from labels and may contain a nested authority and external identifier; and
- classifications retain scheme, code, and optional label.

Optional values are omitted, never represented by null. Strings required by the schema must be non-empty without surrounding whitespace. Duplicate mapping keys and duplicate identity-bearing list items fail. Lists may be empty unless the contract requires at least one label. Exact nested key sets are enforced everywhere.

## Relationship rules

The relationship record identifier must use the relationship candidate form. Subject and object must use entity candidate forms. Embedded records, relationship arrays, nested graph structures, reference resolution, predicate interpretation, inverse generation, and causal inference are prohibited or unsupported. One document maps to one record only.

## Restricted YAML features

The parser rejects multiple documents, duplicate keys, anchors, aliases, merge keys, custom tags, Python/object tags, non-string or complex keys, recursive alias structures, binary values, YAML sets, ordered-map extensions, nulls, implicit or explicit timestamps, non-finite numbers, malformed UTF-8, and any other unsupported node or scalar type. Lowercase `true` and `false` are the only accepted boolean spellings.

SafeLoader alone does not enforce these rules. The adapter first inspects the event stream, then validates composed node tags and keys before producing built-in values.

## Unknown keys and errors

Unknown top-level or nested keys are errors, not warnings or extension data. Stable paths use forms such as `$.labels[0].language`. The public hierarchy distinguishes syntax, restrictions, unsupported YAML features, schema version, structure, domain mapping, and file access. Safe line/column data is retained where available. YAML, decoding, filesystem, and domain-construction exceptions remain available as causes.

## Determinism and round-trip direction

The adapter generates no IDs, dates, environment values, inferred resolvers, language tags, preferred labels, authority rankings, or source approvals. Runtime constructors deterministically order set-like tuples while preserving each supported semantic field. Source, evidence, provenance, labels, scientific names, and candidate/canonical identity remain separate.

A writer is deferred. Because Runtime Core collections intentionally canonicalize order and duplicates are rejected, a future writer can preserve meaning but may not reproduce the original YAML key order, comments, quoting style, or list order for set-like collections.

## Explicit value states

Plain YAML null is prohibited. Governed `unknown`, `not_applicable`, and `disputed` value-state objects are deferred because the current generic Runtime Core has no lossless value-state type. The adapter supports only fields that map without speculative domain changes; it does not collapse a value-state object into absence or an empty value.

## Security and governance limits

The adapter does not allocate identifiers, resolve references, validate source authority, fetch data, prove evidence, perform scientific review, diagnose, recommend, infer regulation or safety, persist records, or promote candidates. The fixture corpus is wholly fictional and synthetic. Real Rice candidate authoring remains blocked by the Knowledge Governance gate.

Future validation-engine work is described in [Extension Boundaries](extension-boundaries.md).
