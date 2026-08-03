# Evidence Traceability Graph

Status: Active

## Purpose

Show how a Claim traces to evaluated Evidence, exact Source content, and scoped
Authority.

```mermaid
flowchart LR
    C["Claim Object + exact version"] -->|supported, contradicted, limited, or contextualized by| E["Evidence Object"]
    E -->|exact version and locator| S["Source Object"]
    S -->|issued or governed within scope| A["Authority Object"]
    E -->|authority assessed for claim| A
```

The arrows record asserted traceability, not truth propagation. Source authority
is claim-, jurisdiction-, version-, and time-scoped. Evidence MUST NOT inherit
universal authority, and a Claim MUST NOT be inferred from source presence.

This graph is conceptual and creates no score, ranking, extraction pipeline, or
machine edge.
