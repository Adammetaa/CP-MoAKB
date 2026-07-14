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
