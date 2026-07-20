# KAS-006: Relationship Standard

Status: Active

Version: 1.0

## Purpose

Govern the meaning, evidence, direction, scope, review, and lifecycle of semantic
relationships without prescribing ontology implementation or inference.

## Scope

This standard applies when a knowledge proposal relates two governed identities
or an identity and a governed collection/context. It covers structural,
biological, observational, causal, management, regulatory, and containment
semantics at a constitutional level.

## Out of Scope

This standard does not create an ontology, approve any real relationship, define
RDF/OWL properties, database edges, inverse rules, transitivity, cardinality,
query behavior, automated reasoning, diagnosis, or recommendation.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative. Predicate labels below describe semantic review categories only; they
are not implementation tokens or a complete controlled vocabulary.

## Definitions

- **Relationship assertion** is a directional, versioned claim connecting a
  subject and object under explicit semantics, evidence, scope, and lifecycle.
- **Predicate** names the reviewed meaning of the connection.
- **Direction** distinguishes subject role from object role; reversal MUST NOT be
  assumed.
- **Qualifier** limits context such as life stage, geography, jurisdiction, time,
  method, source authority, or certainty.
- **Causal relationship** asserts that one entity or process produces an effect
  under stated conditions; association alone is insufficient.

## Governance Rules

Every relationship assertion MUST identify subject, predicate meaning, object,
direction, scope, qualifiers, evidence, citations, authority, review state,
version, lifecycle, conflicts, and provenance. The subject and object MUST have
independently governed identities. Missing qualifiers MUST NOT be supplied by
default.

### Semantic categories

| Relationship | Governed meaning and boundary |
| --- | --- |
| `is_a` | The subject concept is a narrower kind of the object concept under the same classification dimension. It MUST NOT represent instance membership or mere similarity. |
| `part_of` | The subject is a component of the object whole in a declared structural or process context. It MUST NOT be inferred from proximity. |
| `member_of` | The subject is a member/instance of a governed collection or class; it is distinct from subtype and component relations. |
| `host_of` | The subject can serve as host for the object under stated biological and contextual evidence. It does not establish disease, severity, or recommendation. |
| `vector_of` | The subject transmits or carries the object in a specified process under sufficient evidence. Presence or association alone is insufficient. |
| `causes` | The subject causally produces the object/effect within explicit conditions. This requires evidence capable of supporting causality and qualified review. |
| `associated_with` | A reviewed non-causal association exists within a declared population/context. It MUST NOT be presented as `causes`. |
| `observed_in` | The subject was observed in the object context. It records observation, not typicality, causality, identity, or universal distribution. |
| `managed_by` | A source describes a management relationship under bounded context. It is not automatically effective, legal, safe, current, or recommended. |
| `regulated_by` | The subject falls within a named instrument/authority and jurisdiction/effective period. It does not generalize across jurisdictions or dates. |
| `contains` | The subject whole or collection contains the object under a declared material, structural, or membership sense. The sense MUST be explicit. |
| `belongs_to` | A source claims membership/affiliation, but the intended dimension MUST be named. Authors SHOULD prefer a more precise reviewed predicate when available. |

Relationship names from external authorities MUST retain the authority's meaning
and version. Local mappings MUST record equivalence strength and MUST NOT silently
collapse distinct predicates. Inverse, symmetric, transitive, inherited, or
composed behavior MUST NOT be assumed unless a future approved semantic standard
defines it for the exact relationship and scope.

Conflicting relationships MUST coexist as disputed assertions until reviewed.
Changing predicate meaning or direction is a material version change and MAY
require a new relationship identity.

## Examples

- A fictional observation links a synthetic entity to a synthetic context with
  `observed_in`, while explicitly rejecting causal interpretation.
- A fictional `regulated_by` proposal records jurisdiction, instrument version,
  effective period, and issuing authority, and is deferred pending regulatory
  review.

## Non-examples

- Inferring `causes` from repeated co-occurrence.
- Treating `host_of` as evidence that every host instance is affected.
- Treating `managed_by` as a recommendation or legal-use statement.
- Assuming `part_of` is transitive across every biological scale.
- Using `belongs_to` without defining the membership dimension.

## Reviewer Notes

Reviewers SHOULD test whether a weaker or more precise predicate is required,
whether direction and qualifiers are explicit, and whether evidence supports the
semantic strength. Causal, host/vector, regulatory, safety, and management
relationships require their respective qualified review perspectives.

## Future Considerations

Future KAS documents may define predicate registries, relationship identity,
formal characteristics, interoperability mappings, or domain-specific
qualifiers. Physical ontology or inference work requires separate ADR/RAS scope
and MUST preserve the non-inference boundary of this standard.
