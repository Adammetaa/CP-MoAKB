# Runtime Flow

The supported end-to-end flow is explicit and each operation remains independent:

```mermaid
sequenceDiagram
    participant Caller
    participant Adapter as YAML adapter
    participant Query as QueryService
    participant Explain as ExplanationService
    participant App as RuntimeApplicationService
    participant Transport as HTTP or CLI
    Caller->>Adapter: YAML text
    Adapter-->>Caller: Candidate record
    Caller->>Query: construct from explicit records
    Caller->>App: compose Query + Explanation
    Transport->>App: typed request
    App->>Query: search(criteria)
    Query-->>App: ordered QueryResult
    App->>Explain: explain selected match
    Explain-->>App: structured Explanation
    App-->>Transport: response / canonical projection
```

Loading does not validate; validation does not register; registration does not
query; query does not explain; explanation does not recommend. The caller owns
the control flow and supplied state. See RAS-003 through RAS-011 and
`tests/contracts/test_end_to_end_pipeline.py`.
