# Runtime Extension Boundaries

## Planned runtime sequence

- **Sprint-017R:** constrained YAML candidate loader, without changing domain semantics.
- **Sprint-018R:** deterministic validation engine built on `Validator` and `ValidationResult`.
- **Sprint-019R:** candidate identifier and source registries with separately governed allocation and custody.
- **Sprint-020R:** read-oriented query services over approved repository ports.
- **Sprint-021R:** explanation services that preserve evidence, uncertainty, and non-recommendation boundaries.

Each sprint requires its own architecture and Design Freeze review. This sequence does not authorize Rice authoring, production promotion, a storage technology, or implementation beyond the current sprint.

## Prohibited coupling

- Domain models must not import YAML or JSON-loading libraries.
- Domain models and repository protocols must not import SQLite, an ORM, or database adapters.
- Domain models must not depend on web clients or fetch live sources.
- Repository protocols must remain storage-neutral; adapters belong outside the domain package.
- Runtime validation must not replace scientific, terminology, taxonomy, source/rights, evidence, architecture, or Product Owner review.
- Candidate records must not be treated as production records or automatically converted to canonical identifiers.
- Labels must not be used as identity keys or automatic equivalence evidence.
- Relationships must not gain causal, diagnostic, regulatory, safety, or recommendation meaning from wording alone.

## Adapter direction

Future loaders and repositories may depend on `cpmoakb.domain`. The domain package must not depend on them. Format errors should be translated into domain values or validation issues at the adapter boundary; format-specific dictionaries must not become the primary domain model.

The existing IRAC parser/exporter pipeline remains separate. Any future integration must be explicit and must not alter frozen behavior merely to reuse the Runtime Core.
