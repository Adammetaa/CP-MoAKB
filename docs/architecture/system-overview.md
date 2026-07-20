# System Overview

CP-MoAKB contains two deliberately separated areas: a retained source-oriented
IRAC pipeline and the generic Runtime Core. The parser turns an explicitly named
PDF into immutable legacy objects; export and SQLite building are separately
invoked legacy operations. Runtime Core accepts explicit candidate values and
provides storage-neutral contracts for validation, custody, query, explanation,
projection, application orchestration, and injected transports.

```mermaid
flowchart TB
    subgraph Legacy["Retained source pipeline"]
      PDF["Explicit PDF"] --> Parser["IRAC parser"]
      Parser --> LegacyValidation["Legacy validation"]
      Parser --> Export["Explicit CSV export"]
    end
    subgraph Runtime["Generic Runtime Core"]
      Input["Explicit candidate value"] --> Domain["Domain"]
      Domain --> Validation["Validation"]
      Domain --> Registry["Registries"]
      Domain --> Query["Read-only query"]
      Query --> Explain["Explanation"]
      Query --> App["Application service"]
      Explain --> App
      App --> HTTP["HTTP adapter"]
      App --> CLI["CLI adapter"]
    end
```

No automatic bridge connects these areas. Packaging includes code and the frozen
SQL schema needed by an explicitly invoked legacy builder, but no database or
knowledge base. Related authority: RAS-001 and RAS-012; coverage: architecture,
contract, legacy, and packaging tests.
