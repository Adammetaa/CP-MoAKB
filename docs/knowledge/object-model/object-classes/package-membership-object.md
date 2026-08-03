# Package Membership Object

Status: Active

Version: 1.0

## Purpose

Govern the explicit selection of one exact Asset version into one exact Package version for a declared purpose.

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

Govern the explicit selection of one exact Asset version into one exact Package version for a declared purpose.

## Canonical Responsibility

Membership identity, Package identity and version, Asset identity and version, purpose, inclusion authority, role, and exclusion or replacement history.

## Identity Responsibility

Membership identity MUST be distinct from Package and Asset identity and MUST NOT copy, mint, or transfer either identity.

## Version Responsibility

A change to selected Package Version, Asset Version, purpose, role, inclusion authority, exclusion, or replacement creates a new Membership version or successor.

## Lifecycle Responsibility

The Package owner governs proposed, reviewed, included, excluded, replaced, superseded, retired, and archived Membership history under package authority.

## Required Meaning

It MUST state exact Package and Asset versions, membership purpose, inclusion authority, publication role, effective boundary, and predecessor or replacement relationships.

## Permitted References

It MUST reference exact Package and Asset versions and MAY reference inclusion Decisions, Reviews, Unresolved Issues, Publication Records, Representations, and Lifecycle Events.

## Prohibited Content

Membership MUST NOT copy or transfer Asset identity, semantic ownership, review status, acceptance, publication, Evidence, or future versions.

## Ownership

Package owner for custody; Asset steward retains Asset ownership.

## Review Requirements

Package completeness, semantic compatibility, version alignment, rights, governance, and publication competence as applicable.

## Relationship to Knowledge Asset

It points to an exact Asset version without becoming part of the Asset's meaning.

## Relationship to Knowledge Package

It is the explicit connective object by which a Package version selects an Asset version and records inclusion history.

## Explorer Presentation

Explorer MAY disclose the published Package and role through which an exact Asset version is presented.

## Knowledge Lab Presentation

Lab MAY show proposed inclusion, version alignment, blockers, replacement history, review, and publication role.

## Audit Requirements

Audit MUST preserve membership identity, exact versions, purpose, inclusion authority, Decisions, dates, exclusion, replacement, publication role, and owner.

## Example

Fictional Membership M-Aurora selects exact Asset A4 into exact Package Aurora P2 for review only. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

A Package copies Asset A4 as a new local Concept and points to “latest” for publication.

## Failure Modes

Floating version, mismatched Package version, missing authority, concealed replacement, rights conflict, or transferred ownership MUST block valid membership.

## Future Implementation Considerations

Future package manifests MAY map Membership Objects only after separate architecture approval; no manifest syntax is selected. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
