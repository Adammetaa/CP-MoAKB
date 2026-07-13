# ADR-004: Thailand-First Regulatory Context

- Status: Accepted
- Date: 2026-07-13
- Decision owners: CP-MoAKB Product Owner and architecture governance

## Context

Product registration, approved crops and targets, labels, rates, intervals, protective equipment, and registration status are jurisdiction-specific and time-dependent. Scientific literature, international classification, manufacturer material, or authorization in another country cannot establish legal permission in Thailand.

The long-term vision includes decision support for Thai crop protection, but the current repository contains no Thai commercial product registry or label integration.

## Decision

Future product and application guidance must be jurisdiction-aware and, for Thailand, must verify current Thai registration and the current official label before presenting a legal-use recommendation.

Regulatory assertions retain jurisdiction, issuing authority, registration and label identity, source version, retrieval date, effective period, and review status. If current verification is unavailable, the system must show the gap and withhold the use recommendation. Scientific and agronomic evidence remains separately required for suitability.

## Consequences

- Jurisdiction becomes a mandatory dimension of regulatory facts and decision context.
- Thai official registration and label sources are architectural prerequisites for Thai product guidance.
- Cross-country product names or uses cannot be copied into Thai recommendations.
- Label changes, expiry, suspension, cancellation, and supersession require versioned handling.
- Recommendations may be deferred when source currency cannot be established.
- Multi-jurisdiction expansion remains possible but requires separate source and governance work.

## Alternatives considered

### Use international scientific evidence as a legal-use proxy

Rejected because scientific evidence does not create jurisdictional permission.

### Treat manufacturer material as the authoritative label record

Rejected unless it is the applicable official label representation accepted by the issuing authority and verified through approved governance.

### Build jurisdiction-neutral product advice first

Rejected for product and application guidance because omitting jurisdiction creates unacceptable legal ambiguity. Jurisdiction-neutral biological or classification knowledge may still be presented within its proper scope.

## Scope

This decision applies to future commercial product, registration, label, application, safety, and legal-use features. It does not apply a Thai legal status to the current IRAC classification hierarchy and does not claim any Thai regulatory integration exists.

## Relationship to Design Freeze

This documentation changes no source, manifest, schema, parser, exporter, validator, golden baseline, or dataset. A Thai regulatory layer requires separately approved source acquisition, licensing, domain modeling, implementation, and validation.

Related documents: [Product Vision](../PRODUCT_VISION.md), [Source Policy](../SOURCE_POLICY.md), and [Decision Engine](../DECISION_ENGINE.md).
