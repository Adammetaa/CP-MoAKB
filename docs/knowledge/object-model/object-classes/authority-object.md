# Authority Object

Status: Active

Version: 1.0

## Purpose

Govern an identified body, instrument, role, or delegated scope of authority without treating institutional name as universal authority.

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

Govern an identified body, instrument, role, or delegated scope of authority without treating institutional name as universal authority.

## Canonical Responsibility

Authority identity, category, competence, scope, jurisdiction, version or effective period, delegation, limitations, and lifecycle.

## Identity Responsibility

Authority identity MUST distinguish body, instrument, role, delegation, jurisdiction, and version where applicable; names and logos MUST NOT substitute for identity.

## Version Responsibility

Change to mandate, competence, delegation, jurisdiction, effective period, or governing instrument MUST create a new Authority Version or explicit successor.

## Lifecycle Responsibility

The Governance Committee or assigned Authority custodian owns nomination, verification, active scope, amendment, expiry, revocation, supersession, retirement, and archive.

## Required Meaning

It MUST distinguish source, nomenclatural, regulatory, terminology, review, and publication authority and state claim, action, jurisdiction, version, and time scope.

## Permitted References

It MAY reference governing instruments, Sources, delegations, Claims, Evidence, Terminology, Reviews, Decisions, Publication Records, and Unresolved Issues.

## Prohibited Content

Institution name alone MUST NOT imply universal authority, truth, identity ownership, acceptance, publication permission, regulatory validity, or competence outside scope.

## Ownership

Governance Committee or explicitly delegated Authority custodian; the Project Owner retains owner-reserved authority under KGS.

## Review Requirements

Governance, legal, regulatory, source, terminology, domain, or publication competence appropriate to the authority category.

## Relationship to Knowledge Asset

Authority supports identity, Claim, Evidence, terminology, review, and publication interpretation but is not scientific meaning by itself.

## Relationship to Knowledge Package

A Package MAY reference exact Authority Versions governing membership or publication; inclusion does not broaden their scope.

## Explorer Presentation

Explorer MAY display relevant Authority category, scope, jurisdiction, effective period, and limitations.

## Knowledge Lab Presentation

Lab MAY show authority verification, delegation, expiry, conflicts, applicable object scope, and governance blockers.

## Audit Requirements

Audit MUST preserve identity, mandate, source instrument, scope, delegation, jurisdiction, effective dates, amendments, revocation, reviewers, and reliance by other objects.

## Example

Fictional Authority A-Orbit is competent only to issue one invented editorial circular during a declared fictional period. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

An institution name displayed as proof that every linked Claim is true.

## Failure Modes

Unknown mandate, expired delegation, version conflict, jurisdiction mismatch, or competence gap MUST fail closed for the affected action.

## Future Implementation Considerations

Future authority registries MAY be proposed separately; this object defines no permission service or authorization code. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
