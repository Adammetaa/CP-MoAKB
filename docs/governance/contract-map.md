# Contract Map

| Contract group | Governs | Primary evidence |
| --- | --- | --- |
| RAS-001–003 | Runtime rules, validation, YAML adapter | domain/adapter/validation tests |
| RAS-004–006 | registries, query, explanation | focused service and contract tests |
| RAS-007 | public Runtime compatibility | 165-entry API manifest |
| RAS-008–009 | JSON projection and application facade | serialization/application tests |
| RAS-010–011 | HTTP and CLI transports | transport tests and exact surface docs |
| RAS-012 | packaging and composition | artifact/install/composition tests |
| RAS-013 | security and release readiness | security tests and repository verifiers |
| RAS-014 | documentation, examples, knowledge transfer | documentation tests and verifiers |
| RAS-015 | release audit and publication boundary | release-candidate tests and verifier |
| Knowledge Constitution | highest authority within knowledge governance; cross-authority boundaries and amendment rules | Constitution, navigation, cross-references, and documentation verifier |
| KAS-001–007 | subordinate knowledge authoring, records, evidence, citations, terms, relationships, lifecycle | KAS index, cross-references, and documentation verifier |

Each RAS is versioned independently from Runtime and package versions. The
Knowledge Constitution governs the subordinate KAS family; KAS document versions
govern knowledge standards independently from software. ADRs and RAS retain
authority in their architecture and Runtime scopes. Their respective indexes and
the Constitution, not this summary, are authoritative for status and scope.
