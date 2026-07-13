# ADR-003: Knowledge Graph Is Conceptual, Not Yet Implemented

- Status: Accepted
- Date: 2026-07-13
- Decision owners: CP-MoAKB Product Owner and architecture governance

## Context

The long-term domain contains many-to-many, versioned, temporal, multilingual, evidence-bearing relationships across biology, management, chemistry, regulation, field observations, economics, and operations. A knowledge-graph model is useful for reasoning about those connections.

Selecting a graph database or graph API now would be premature. Identity rules, query requirements, licensing, assertion provenance, regulatory validity, privacy, scale, deployment constraints, and operational ownership have not been approved.

## Decision

The knowledge graph is the long-term conceptual integration model, but no graph database, query language, storage engine, ontology platform, or vendor is selected in this sprint.

Architecture documents may define conceptual nodes, relationships, assertion metadata, and gates. They must not claim graph persistence or runtime reasoning exists. A future physical architecture requires one or more new ADRs based on validated use cases and constraints.

## Consequences

- Teams can align domain language and provenance requirements without committing to technology.
- Current relational and in-memory implementation remains unchanged.
- Conceptual relationships must remain technology-neutral.
- Prototype or vendor work cannot become production architecture without review.
- Future selection must evaluate relational, graph, document, search, and hybrid approaches.
- Implementation timing depends on identity, source, governance, privacy, and query gates.

## Alternatives considered

### Select a graph database immediately

Rejected because requirements and operational constraints are incomplete, creating lock-in and speculative production work.

### Declare the current SQLite schema the long-term ontology

Rejected because the frozen schema serves the current IRAC pipeline and is not an approved representation of the broader conceptual domain.

### Avoid a graph model entirely

Rejected as a conceptual choice because relationships and assertion provenance are central to the long-term vision, though a non-graph physical implementation remains a valid future candidate.

## Scope

This decision governs architecture language and future technology-selection process. It does not prescribe storage, deployment, API, inference, or migration design.

## Relationship to Design Freeze

This ADR explicitly preserves the frozen schema and implementation. It authorizes no graph code, database, migration, generated dataset, or reinterpretation of the IRAC hierarchy.

Related documents: [Knowledge Graph](../KNOWLEDGE_GRAPH.md), [Domain Model](../DOMAIN_MODEL.md), and [Strategic Roadmap 2.0](../ROADMAP_2.0.md).
