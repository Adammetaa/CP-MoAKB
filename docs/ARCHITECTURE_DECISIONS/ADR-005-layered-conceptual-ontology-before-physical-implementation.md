# ADR-005: Layered Conceptual Ontology Before Physical Implementation

- Status: Proposed
- Date: 2026-07-13
- Decision owners: CP-MoAKB Product Owner, Chief Architect, and domain governance

## Context

CP-MoAKB's future crop-protection scope spans biological entities, field observations, evidence, diagnostic reasoning, regulation, safety, recommendations, economics, and application operations. These concerns have different authority, provenance, privacy, temporal, and jurisdictional rules. Selecting a physical ontology representation before the concepts and boundaries are reviewed could embed ambiguity, collapse unlike records, or create technology lock-in.

The current IRAC pipeline and frozen SQLite schema serve a narrower implemented purpose. They are not a physical representation of the future platform ontology.

## Decision

Adopt a layered, implementation-neutral conceptual ontology foundation before designing or implementing a physical ontology. The conceptual foundation MUST preserve separate layers for domain entities; observations and cases; evidence and provenance; diagnostic reasoning; regulation; safety; recommendation; economics; and application and operational context.

Ontology domains share identity, statement, provenance, temporal, jurisdictional, uncertainty, versioning, and multilingual principles. Future physical work must trace its structures and constraints back to these reviewed concepts and boundaries.

This is explicitly **not** a decision to use RDF, OWL, SHACL, JSON-LD, Turtle, relational tables, a graph database, or any ontology framework. It does not authorize runtime implementation or data ingestion.

## Rationale

- Shared conceptual definitions allow agronomists, safety and regulatory reviewers, data architects, and engineers to review meaning before storage design.
- Layer separation prevents an observation, diagnostic hypothesis, regulatory fact, or safety rule from being mistaken for a recommendation.
- Implementation neutrality keeps credible physical alternatives open until identity, queries, interoperability, governance, privacy, licensing, and operational constraints are known.
- Statement-level evidence and provenance can be made architectural requirements rather than retrofitted metadata.

## Consequences

- Future ontology, knowledge-graph, decision-support, and API designs must preserve the documented distinctions or obtain a superseding architecture decision.
- Domain vocabularies and mappings require qualified review before becoming curated knowledge.
- A physical design may take longer to begin, but it can be evaluated against explicit semantics and acceptance constraints.
- The conceptual documents will require versioned refinement as domain review finds ambiguity or missing concepts.
- Current runtime behavior, schema, IRAC data, and release claims remain unchanged.

## Alternatives considered

### Implement an ontology framework now

Not selected because technology and operational requirements are not approved, and implementation would violate Sprint-012's documentation-only scope.

### Extend the frozen SQLite schema as the ontology

Not selected because that schema represents the current IRAC pipeline and cannot be assumed to model the broader domain. Extending it would also violate Design Freeze.

### Use one consolidated recommendation record

Not selected because it would blur source facts, observations, inference, legal status, safety constraints, context, and decision rationale, weakening auditability and change control.

### Defer all ontology work until technology selection

Not selected because storage choices need reviewed domain meaning and boundaries as inputs.

## Scope

This proposal governs conceptual architecture for the seven Sprint-012 ontology domains and their cross-domain relationships. It does not approve domain facts, controlled vocabulary content, runtime reasoning, a public field dataset, or a physical representation.

## Relationship to Design Freeze

The proposal preserves the frozen parser, exporter, schema, validation logic, official datasets, golden baseline, and tests. Any later physical implementation or mapping that affects those components requires separate approval.

Related documents: [Ontology Foundation](../ontology/README.md), [Shared Ontology Principles](../ontology/ONTOLOGY_PRINCIPLES.md), [Conceptual Domain Model](../DOMAIN_MODEL.md), [Knowledge Graph](../KNOWLEDGE_GRAPH.md), and [ADR-003](ADR-003-knowledge-graph-is-conceptual-not-yet-implemented.md).
