# Architecture Changes

First classify whether the proposal is internal, behavioral, public-contract,
dependency-direction, packaging, security, documentation, or Knowledge Track work.
An internal refactor may not change observable behavior. A new durable choice not
covered by accepted decisions requires an ADR. Reusable normative Runtime rules
require a RAS change. Public changes require compatibility and version review.

Design Freeze protects legacy behavior, Runtime semantics, versions, public
signatures, artifacts, and governed source data. Do not route around it with an
internal import, default service, plugin hook, or undocumented fallback. Use the
[change classification](../governance/change-classification.md) and
[traceability map](../governance/traceability-map.md).
