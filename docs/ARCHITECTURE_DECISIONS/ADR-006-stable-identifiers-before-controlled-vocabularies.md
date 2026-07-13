# ADR-006: Stable Identity Governance Before Controlled Vocabulary Implementation

- Status: Proposed
- Date: 2026-07-13
- Decision owners: CP-MoAKB Product Owner, Chief Architect, data governance, and domain governance

## Context

Future CP-MoAKB domains need durable identities across multilingual labels, scientific and common names, source versions, external authorities, private cases, evidence-bearing statements, regulatory records, and later controlled vocabularies. If vocabulary records are created before identity ownership and lifecycle are governed, labels can become accidental primary keys, external identifiers can be misrepresented as local authority, and duplicate or changed concepts can be merged without auditability.

The current IRAC pipeline already has frozen source codes and deterministic version-scoped export identifiers for its approved scope. Those implementation values must not be reinterpreted as the universal identity strategy.

## Decision

Define and review stable identity governance before implementing new CP-MoAKB controlled vocabularies or cross-domain identifier infrastructure.

Every future identifier family must have an authority, namespace ownership, identity category, minting control, lifecycle/non-reuse policy, label separation, mapping provenance, privacy class, and review process. Local and external identities remain distinct. Concept, instance, observation, case, source, statement, registration, and version identities may use different physical key policies.

Identifiers do not establish truth, confirmation, regulatory approval, safety, or recommendation validity. Evidence and provenance attach to assertions and mappings.

## Rationale

- Identity independent of labels supports Thai, English, scientific, historical, and local naming without redefining the referent.
- Controlled minting and non-reuse make deprecation, merge, split, correction, and audit behavior predictable.
- Explicit local/external mappings preserve source authority and prevent string equality from becoming false equivalence.
- Separating private operational identity from public curated identity supports consent, custody, and re-identification controls.
- Defining policy first gives future vocabulary, graph, relational, API, and resolver designs reviewable invariants.

## Consequences

- No controlled vocabulary or production identifier registry should be implemented until its authority, namespace, lifecycle, review, and privacy requirements are approved.
- Future implementations must preserve historical identities and mapping decisions rather than silently reusing or merging keys.
- Domain and regulatory expertise is required for meaning/equivalence decisions; a minting service cannot supply that authority.
- Different identifier categories may use different physical formats, increasing design work but avoiding a premature universal key.
- Current IRAC behavior, identifiers, data, schema, and release status remain unchanged.

## Alternatives considered

### Use labels or scientific names as identifiers

Not selected because names change, collide, vary by language/authority, and may represent different concept categories.

### Adopt one universal key format now

Not selected because public concepts, private cases, official registrations, source documents, statements, and artifacts have different authority, privacy, distribution, and lifecycle constraints.

### Use external identifiers as all local identities

Not selected because no single authority covers the platform, external scope/version can change, and CP-MoAKB must preserve local concepts plus reviewable mappings without claiming external ownership.

### Build vocabularies first and deduplicate later

Not selected because post-hoc merges lose provenance, create unstable references, and make identity errors harder to reverse.

## Explicit non-decisions

This proposal does not decide:

- a physical identifier syntax or universal separator;
- UUID-like versus sequential keys;
- numeric allocation ranges;
- a permanent public URI domain or resolver deployment;
- HTTP/content-negotiation behavior;
- graph, relational, document, RDF, OWL, JSON-LD, SHACL, or ontology technology; or
- the content or identifiers of any controlled vocabulary.

Each requires future evidence, architecture review, and—where material—a separate ADR.

## Relationship to ADR-005

[ADR-005](ADR-005-layered-conceptual-ontology-before-physical-implementation.md) is still Proposed and defines layered conceptual meaning before physical ontology implementation. ADR-006 complements that proposal by defining identity-governance prerequisites across those layers. ADR-006 neither accepts ADR-005 nor depends on a particular physical ontology; both preserve separation among entities, observations, evidence, reasoning, regulation, safety, and recommendations.

## Scope

This proposal governs future CP-MoAKB identifier, namespace, label, external-mapping, lifecycle, and versioning policy. It creates no real identifier, vocabulary record, mapping, registry, or resolution service.

## Relationship to Design Freeze

This ADR is documentation-only. It changes no parser, exporter, schema, semantic validation, source, official dataset, golden baseline, test, or generated artifact. Any physical implementation that affects frozen components requires separate explicit approval.

Related documents: [Knowledge Identifier Strategy](../identifiers/README.md), [Identifier Principles](../identifiers/IDENTIFIER_PRINCIPLES.md), [Knowledge Graph](../KNOWLEDGE_GRAPH.md), and [Ontology Foundation](../ontology/README.md).
