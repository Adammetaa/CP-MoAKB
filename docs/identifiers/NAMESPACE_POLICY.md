# Namespace Policy

## Purpose

A namespace defines the authority and collision boundary for a family of identifiers. It does not imply that a physical registry, public URI, controlled vocabulary, or records exist. Namespaces MUST preserve the ontology layers and distinguish CP-MoAKB-governed identity from external source identity.

## Conceptual namespace candidates

The following candidates describe future governance scope only; they are not registered prefixes and contain no allocated identifiers.

| Area | Candidate namespaces or categories |
| --- | --- |
| Biological/domain concepts | crop, weed, insect, disease, symptom, sign, plant organ, growth stage |
| Safety and reasoning | safety, diagnostic, question |
| Field and evidence records | observation, case, evidence, source, statement |
| Decision and legal context | recommendation, regulation, jurisdiction |
| Chemistry and classification | active ingredient, Mode-of-Action classification |
| Product and application | product registration, application method, field operation |
| Economics | economics and dated cost/value scenario concepts or records |

A domain may need more than one namespace where concept and operational-record authorities differ. Conversely, physical implementation MAY share infrastructure while preserving logical namespace boundaries.

## Ownership and registration

Every future namespace MUST have a registry record identifying:

- stable namespace key and human-readable title;
- purpose, scope, included/excluded identity categories, and public/private class;
- governing authority, Namespace Owner, Identifier Registrar, and required reviewers;
- minting eligibility, key policy, collision-check process, and lifecycle rules;
- label languages and controlled-vocabulary dependencies, if applicable;
- mapping policy for source-system/external namespaces;
- privacy, retention, access, and publication constraints;
- creation, review, effective, deprecation, and supersession history; and
- resolution/URI status, explicitly including “not deployed” where applicable.

Registration requires architecture and domain-governance review. Namespace keys MUST be unique within the project authority, MUST NOT be recycled, and SHOULD avoid mutable organization names, scientific classifications, jurisdictions, release numbers, or technology names.

## Collision prevention

- Minting MUST occur through one governed authority/process per namespace.
- Candidate keys MUST be checked against active and all historical/tombstoned keys.
- Imports MUST NOT mint local identities merely by copying an external key.
- Environment/test identities MUST be isolated so they cannot collide with or be mistaken for published identities.
- Offline or distributed allocation requires an approved collision strategy before use.
- A collision or mistaken duplication creates a review case; records MUST NOT be silently overwritten or renumbered.

## Domain and source-system separation

A CP-MoAKB domain namespace expresses local governed identity. A source-system namespace expresses an identity controlled by the issuing authority. Mappings connect them without collapsing ownership.

IRAC, FRAC, HRAC, EPPO, GBIF, NCBI Taxonomy, Thai authorities, safety/legal bodies, and manufacturer source systems remain externally controlled. Mentioning a candidate authority does not claim integration, endorsement, namespace registration, currency, or permission to redistribute its data. CP-MoAKB MUST retain authority, identifier, source/version, mapping relation, and review provenance rather than presenting an external identifier as locally minted.

The current frozen IRAC codes and export identifiers retain their existing source/version-scoped meaning. This policy does not migrate them into a new namespace.

## Public and private namespace boundaries

Public curated concepts and private operational records MUST use separable identity domains and access policies.

- Private Field Vault case, observation, image/artifact, person/organization, farm, and precise-location identifiers remain access-controlled.
- Pseudonymization reduces direct identification but does not eliminate linkage or re-identification risk.
- Publication MAY mint a distinct anonymized publication identity after consent, purpose, license, privacy, and domain review.
- A public identifier MUST NOT contain or expose a private identifier, personal data, precise location, farm identity, customer/account value, confidential operation, or reversible token when that creates unacceptable linkage risk.
- Crosswalks between private and publication identities, if required, MUST remain in controlled custody and outside the public repository.
- Source-document identifiers MAY be public only when licensing, confidentiality, and source policy permit it.

## Namespace mapping and deprecation

Mappings among namespaces MUST use a reviewed relation such as exact, close, broader, narrower, related, or source-derived. Matching strings or keys are insufficient. A mapping can change without changing either endpoint identity and therefore has its own evidence, confidence/status, validity, and review history.

A namespace may be deprecated when its authority, scope, or policy is replaced. Deprecation MUST identify the reason, effective date, replacement namespace where applicable, migration/mapping guidance, and resolver/tombstone expectations. Existing identifiers MUST remain auditable and MUST NOT be reassigned.

## URI and resolution readiness

An identifier is a governed identity token; a URI is an identifier in URI syntax and may also be a network locator. Future persistent URIs SHOULD aim for durable authority, domain permanence, redirects after infrastructure change, tombstones after deprecation/withdrawal, and separation between identity and representation.

HTTP resolution, content negotiation, human-readable landing pages, and machine-readable representations are possible future capabilities. This sprint does not select a permanent public domain, create a resolver or redirects, register namespaces, or select RDF/JSON-LD. Deployment and representation choices require a future ADR and operational ownership review.
