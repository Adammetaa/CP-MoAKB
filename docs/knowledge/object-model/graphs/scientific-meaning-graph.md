# Scientific Meaning Graph

Status: Active

## Purpose

Show asserted links among scientific-meaning objects without implementing a graph.

```mermaid
flowchart LR
    C["Concept Object"] -->|has governed expression| T["Terminology Object"]
    C -->|is subject or context of| CL["Claim Object"]
    CL -->|may be expressed as explicit assertion| R["Relationship Object"]
    R -->|source Concept| C
    R -->|target Concept| C2["Concept Object"]
```

Every link is an explicit governed reference. Bidirectional navigation MUST NOT
imply symmetric meaning. No inverse, causal, transitive, equivalence, diagnostic,
or recommendation edge may be inferred. A future inferred link would require a
separate authorized inference architecture; inference remains prohibited here.

This diagram defines no graph database, ontology language, schema, or Runtime.
