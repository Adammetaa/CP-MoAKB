# Runtime Architecture Specifications

A Runtime Architecture Specification (RAS) is a reusable, normative contract for Runtime Engineering. An Architecture Decision Record explains an accepted architectural choice and its context; a RAS translates accepted decisions into requirements shared by multiple implementations. A RAS MUST NOT override an accepted ADR.

The terms **MUST**, **SHOULD**, and **MAY** identify mandatory, recommended, and optional requirements. Each specification has one lifecycle status: Draft, Active, Superseded, or Withdrawn. Status changes follow existing project governance; this index does not create a separate approval workflow.

Future Runtime sprints SHOULD cite the RAS documents they implement and describe only their sprint-specific delta. Implementations MUST NOT silently diverge from an Active RAS: a conflict must be documented and resolved through the established architecture process.

## Index

| Specification | Status | Scope |
| --- | --- | --- |
| [RAS-001](RAS-001-runtime-engineering-standard.md) | Active | Reusable Runtime Engineering constraints |
| [RAS-002](RAS-002-validation-framework.md) | Active | Deterministic mechanical validation framework |
| [RAS-003](RAS-003-adapter-contract.md) | Active | Representation-adapter boundary |
| [RAS-004](RAS-004-registry-contract.md) | Active | Governed identity custody and reference registries |
| [RAS-005](RAS-005-query-service-contract.md) | Active | Deterministic read-only Runtime queries |
| [RAS-006](RAS-006-explanation-service-contract.md) | Active | Structured traceable Runtime explanations |
| [RAS-007](RAS-007-runtime-api-compatibility-contract.md) | Active | Runtime 0.1 public API compatibility |
| [RAS-008](RAS-008-runtime-json-projection-contract.md) | Active | Deterministic output-only Runtime JSON projection |
| [RAS-009](RAS-009-runtime-application-service-contract.md) | Active | Transport-neutral Runtime application-service facade |
| [RAS-010](RAS-010-runtime-http-transport-contract.md) | Active | Minimal read-only Runtime HTTP transport |
