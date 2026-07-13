# Identifier Principles

## Scope and normative language

These principles govern conceptual future identities. **MUST** marks an architectural invariant, **SHOULD** marks strong guidance, and **MAY** marks an optional future choice. They do not define a runtime format.

## Core principles

1. Identity MUST be independent of display labels, spelling, language, and presentation.
2. An identifier MUST NOT encode mutable scientific, regulatory, geographic, workflow, or business meaning. It SHOULD be opaque or only minimally semantic.
3. A published identifier MUST remain stable and resolvable in its governed context after label or non-material metadata changes.
4. An identifier MUST NOT be silently reused, even after rejection, withdrawal, merge, split, or deprecation.
5. One identifier represents one governed concept or record identity. Relationships among identities remain explicit.
6. Equivalent labels do not establish equivalent concepts. A label change does not create a new identity by itself.
7. A material change of referent, defining scope, or meaning MAY require a new identity and an explicit lifecycle relationship.
8. Every identifier type MUST have a named authority, owner, minting policy, lifecycle, and audit responsibility.
9. Identifier status MUST be explicit and independent of evidence level, confidence, domain approval, legal status, and recommendation validity.
10. Identifiers SHOULD be safe for machine use and sufficiently structured for human debugging without embedding claims.
11. Local identifiers and external identifiers MUST remain distinguishable; an external mapping does not transfer authority or ownership.
12. Identifier policy MUST support multilingual labels without making Thai, English, scientific, or commercial names primary keys.
13. Assertions, mappings, and identity-resolution decisions MUST support statement-level evidence and provenance.
14. Identity resolution MUST be reviewable, uncertain states MUST remain visible, and merges MUST be auditable.
15. Minting MUST be controlled; automated components MAY propose candidates but MUST NOT publish or merge governed identities without authorized review.

## Identifier categories

| Category | Governed identity | Boundary |
| --- | --- | --- |
| Concept identifier | A reusable governed meaning such as a crop, disease, symptom, question, or plant-organ concept. | Not a particular organism, planting, observation, or assertion. |
| Instance identifier | A particular entity or occurrence such as a planted population, product instance, or operation, subject to privacy and domain policy. | Not its type/class or every statement about it. |
| Observation identifier | A record of what was reported, seen, measured, or imaged in context. | Not the observed entity, confirmed cause, or evidence conclusion. |
| Case identifier | A governed diagnostic or field investigation container. | Not a diagnosis or public concept identity. |
| Evidence-source identifier | A source organization, publication family, dataset, laboratory record, or evidence origin. | Not a source version or the assertion supported. |
| Assertion/statement identifier | One addressable claim with subject, relationship, object/value, provenance, context, validity, and review. | Not proof that the claim is true. |
| Document/source identifier | A particular source document or governed source record. | Version/edition identity may require a separate VersionIdentifier. |
| External-reference identifier | A local record of an identifier owned by another authority. | Not automatically a local identity or exact equivalence. |
| Product-registration identifier | A jurisdiction- and authority-specific registration identity. | Not a product name, ingredient, label version, or permission outside its scope. |
| Version identifier | A particular revision, edition, release, or immutable representation of another identity. | Not the enduring identity itself. |

These categories MAY use different future key policies. Public concepts, private operational cases, immutable artifacts, and official registration records have different privacy, scale, authority, and lifecycle needs; a universal physical key format is not selected.

## Conceptual identifier anatomy

```text
Project authority : Namespace : Entity category : Local key : Optional version reference
```

An environment distinction MAY be added by future governance for non-production/testing identities, but it MUST NOT leak into or collide with published identity. The anatomy is conceptual; separators, case, length, checksum, storage, and resolution remain undecided.

Illustrative, non-operational examples:

```text
CPMOAKB:CROP:000001
CPMOAKB:DISEASE:000001
CPMOAKB:OBSERVATION:<opaque-key>
CPMOAKB:CASE:<opaque-key>
CPMOAKB:STATEMENT:<opaque-key>
```

These examples reserve no values and identify no real crop, disease, observation, case, or statement.

## Key-format trade-offs

| Candidate | Strength | Risk or limitation | Conceptual guidance |
| --- | --- | --- | --- |
| Sequential numeric key | Compact, readable, easy to inspect. | Requires coordinated minting; can expose counts or ordering. | MAY suit governed public concepts after authority and allocation rules are approved. |
| UUID-like opaque key | Distributed generation and low collision risk. | Long, difficult to inspect, format/version choices remain. | MAY suit private or operational cases and observations after privacy review. |
| Human-readable slug | Convenient in interfaces. | Labels and meanings change; collisions and language bias occur. | SHOULD be an alias or route, never the primary identity. |
| Content-derived hash | Useful for integrity and byte-level artifact identity. | Content changes create new hashes; semantic equivalence is not established. | SHOULD identify artifacts/checksums, not conceptual identity. |
| Composite identifier | Can expose source/context and aid debugging. | Encoded parts become mutable and can conflate identity with attributes. | SHOULD be avoided as the enduring identity unless every component is immutable and governance justifies it. |

A likely future pattern is controlled stable local keys for curated concepts, opaque keys for operational observations/private cases, and content hashes for artifact integrity. Labels and scientific names MUST NOT be primary keys. This is guidance, not a format decision.

## Architecture invariants

1. An identifier does not prove a statement is true.
2. An identifier does not imply scientific confirmation.
3. An identifier does not imply regulatory approval.
4. An identifier does not imply safety.
5. An identifier does not imply a treatment recommendation.
6. A shared label does not prove shared identity.
7. A changed label does not automatically create a new identity.
8. Deprecated identifiers are never reassigned.
9. External identifiers remain owned by their authorities.
10. Private case identity remains separate from public curated identity.
11. Evidence and provenance belong to assertions and mappings.
12. Identity merges are auditable and reversible at the data-governance level.

## Governance roles

| Role | Conceptual responsibility |
| --- | --- |
| Architecture Governor | Owns cross-domain identity invariants and approves policy exceptions/technology proposals. |
| Namespace Owner | Defines one namespace's scope, authority, allowed categories, and stewardship. |
| Identifier Registrar | Controls minting, collision checks, status transitions, and registry audit records. |
| Domain Reviewer | Assesses concept meaning, scope, distinctions, and proposed merges/splits. |
| Evidence Reviewer | Assesses evidence and provenance for assertions and mappings. |
| Regulatory Reviewer | Assesses jurisdictional identity and legal/regulatory mappings using current official sources. |
| Data Steward | Manages quality, privacy, custody, corrections, deduplication cases, and auditability. |
| Release Manager | Versions and publishes approved vocabulary/dataset releases without redefining entity identity. |

These responsibilities do not assume the roles are currently staffed. Separation of authority is required: no single automated component may approve identity merges, regulatory equivalence, and recommendation validity.
