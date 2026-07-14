# Governed Registry Services

The `cpmoakb.registries` package implements [RAS-004](specifications/RAS-004-registry-contract.md) as explicit, in-memory, storage-neutral services. It provides custody and lookup, not persistence or approval.

## Candidate identifier custody

`CandidateIdentifierRegistry` accepts explicitly supplied `CandidateIdentifier` values. Reservation must precede registration. Reserved identifiers may be abandoned; registered identifiers may be rejected or superseded by a distinct registered successor. These terminal identifiers remain permanently present and cannot be reused.

Custody state is not `RecordLifecycle`: it describes control of an identifier, while record lifecycle describes governance state of content. Reservation is not publication, and registration does not promote or canonicalize a record. No allocator is implemented; automatic production allocation and production identifier syntax remain deferred.

## Source and authority identity

`SourceRegistry` and `AuthorityRegistry` use typed identifiers as their only identity keys. Full immutable domain-value equality defines compatible idempotent re-registration. Any unequal same-ID payload is a conflict. Matching titles, locators, or names never merge identities.

Source registration does not mean source approval. Authority registration creates no universal authority ranking. Neither registry fetches content, infers rights or scope, or establishes scientific correctness.

## Snapshots and errors

Each registry returns a frozen typed snapshot containing a tuple ordered by identifier string. Snapshots support equality, hashing, lookup, and comparison without exposing mutable dictionaries. Later live-registry mutations do not alter an existing snapshot.

Typed `RegistryError` subclasses distinguish missing reservation, duplicate reservation, invalid transition, incompatible payload, missing item, and invalid operation. Failed operations do not mutate registry state. No operation creates timestamps or consults global state.

## Public API and boundaries

The intentional API is exported by `cpmoakb.registries`: the three registry services, candidate custody enum and entry, snapshot types, and typed exceptions. Registries depend only on immutable domain objects and the standard library. They contain no YAML, database, filesystem, HTTP, remote-registry, query, explanation, or serialization adapter.

Registry and validation operations remain explicit and separate. The validation engine has no live-registry lookup, registry services are not placed into `ValidationContext`, and YAML loading does not register objects automatically. Tests use synthetic fictional values only and require no network access.

Registry presence does not prove scientific correctness; candidate registration does not promote a record. No real Rice identifier is authorized, production identifier syntax remains deferred, and real Rice candidate authoring remains blocked.
