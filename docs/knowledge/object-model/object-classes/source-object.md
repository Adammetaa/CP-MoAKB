# Source Object

Status: Active

Version: 1.0

## Purpose

Govern the identity, version, custody, provenance, access, and rights context of a nominated publication, dataset, authority document, observation record, or other source.

## Scope

This object governs its named conceptual responsibility inside or around a
Knowledge Asset and Package. It applies before any physical representation.

## Out of Scope

It defines no machine fields, data types, schema, serialization, database table,
Python class, API payload, validation code, identifier syntax, registry,
persistence, inference, diagnosis, recommendation, score, ranking, or AI.

## Authority

The [Knowledge Object Model](../knowledge-object-model.md), [Knowledge Asset
Architecture](../../architecture/README.md), Constitution, applicable KAS and
KGS, ADRs, RAS, Source Policy, Evidence Levels, Design Freeze, and Publication
Boundary retain authority. This object MUST NOT supersede them.

## Definition

Govern the identity, version, custody, provenance, access, and rights context of a nominated publication, dataset, authority document, observation record, or other source.

## Canonical Responsibility

Source identity and source history, including correction, retraction, replacement, access, redistribution status, provenance, and citation-facing references.

## Identity Responsibility

A Source Object MUST identify the source independently from Evidence items, Claims, citation displays, local file copies, and redistributed publication files.

## Version Responsibility

It MUST distinguish edition or source version, source date, retrieval evidence, correction, retraction, and replacement. A replacement MUST NOT silently reuse or overwrite the replaced Source identity.

## Lifecycle Responsibility

A Source Custodian owns nomination, registration, access review, correction linkage, retraction marking, replacement, deprecation, retirement, and archive disposition under Source Policy.

## Required Meaning

The object MUST state source kind, issuing or responsible Authority, declared scope, version context, provenance, access condition, rights and redistribution status, and known correction or replacement relationships.

## Permitted References

It MAY reference Authority, citation locators, rights evidence, provenance, Evidence derived from it, reviews, decisions, unresolved issues, and successor or predecessor Sources.

## Prohibited Content

It MUST NOT contain extracted Evidence as part of Source identity; present source statements as accepted Claims; imply universal authority; redistribute restricted files; or treat a citation string or repository copy as the Source.

## Ownership

Source Custodian; rights custody MAY be separately assigned.

## Review Requirements

Source, Evidence, rights, jurisdiction, and domain competence appropriate to the nominated source.

## Relationship to Knowledge Asset

A Source supports an Asset through references; it is not automatically part of the Asset's semantic nucleus or accepted Knowledge.

## Relationship to Knowledge Package

A Package MAY reference or include rights-permitted source material explicitly, but membership MUST NOT change Source authority or redistribution rights.

## Explorer Presentation

Explorer MAY show source identity, exact version, authority scope, citation, availability, and correction status for published traceability.

## Knowledge Lab Presentation

Lab MAY show nomination, access, rights, provenance, evidence links, correction or replacement review, and unresolved source issues.

## Audit Requirements

Audit MUST preserve nomination, custody, version assessment, integrity, access, rights, corrections, retractions, replacements, decisions, and every Evidence derivation reference.

## Example

Fictional Source S-Lantern version S2 records an invented circular, its fictional issuer, and a rights constraint without copying any claimed proposition. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A copied document named “final source” that embeds extracted Claims and is treated as universally authoritative.

## Failure Modes

Identity conflation, missing version, unavailable locator, unknown rights, silent replacement, or unrecorded correction MUST block dependent acceptance where material.

## Future Implementation Considerations

Future repositories or resolvers MAY map Source Objects only after separate architecture and rights review. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
