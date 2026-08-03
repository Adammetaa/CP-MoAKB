# Relationship Object

Status: Active

Version: 1.0

## Purpose

Govern every asserted semantic relationship as an explicit, directed, scoped, evidenced, reviewable object.

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

Govern every asserted semantic relationship as an explicit, directed, scoped, evidenced, reviewable object.

## Canonical Responsibility

One source-Concept, predicate, target-Concept assertion with direction, scope, Evidence, assertion status, review state, lifecycle, and unresolved issues.

## Identity Responsibility

Relationship identity MUST be independent from endpoints, UI links, graph position, sentence wording, and any inverse or inferred edge.

## Version Responsibility

Material change to endpoint, predicate meaning, direction, scope, Evidence basis, qualifier, or assertion status MUST create a new Knowledge Version.

## Lifecycle Responsibility

The Relationship steward owns candidate, review, accepted, disputed, corrected, deprecated, superseded, retired, and archived history.

## Required Meaning

It MUST identify source Concept, governed predicate meaning, target Concept, direction, scope, context, Evidence, assertion status, review status, lifecycle, and unresolved issues.

## Permitted References

It MUST reference exact source and target Concept versions and MAY reference Evidence, Sources, Authority, Reviews, Findings, Decisions, and Unresolved Issues.

## Prohibited Content

It MUST NOT exist only because of UI navigation, proximity, string match, hierarchy layout, or inferred graph edge; imply inverse, transitive, causal, diagnostic, regulatory, safety, or recommendation meaning without explicit authority.

## Ownership

Relationship steward or Domain Editor under ontology governance.

## Review Requirements

Ontology and domain competence plus scientific, Evidence, regulatory, or safety competence proportional to predicate risk.

## Relationship to Knowledge Asset

Relationship is a canonical scientific-meaning carrier and MAY form part of an Asset's semantic nucleus.

## Relationship to Knowledge Package

A Package references the exact Asset and Relationship version; it MUST NOT recreate the edge from package layout.

## Explorer Presentation

Explorer MAY render asserted, reviewed Relationships with direction, scope, Evidence, status, and unresolved limitations.

## Knowledge Lab Presentation

Lab MAY show endpoint and predicate candidates, Evidence, high-risk review, Findings, disputes, and proposed lifecycle changes.

## Audit Requirements

Audit MUST preserve endpoints, predicate authority, direction, scope, Evidence, high-risk review, status, conflicts, Decisions, and version history.

## Example

Fictional Relationship R-Arc explicitly links Concept Nadir to Concept Lumen through invented predicate `illustrates_for_review`. This is an invented governance illustration with no real-world
referent or production identifier.

## Non-example

Two cards placed next to each other and interpreted as `causes` without a Relationship Object.

## Failure Modes

Predicates such as causes, prevents, controls, effective_against, safe_for, managed_by, permitted_in, and prohibited_in require explicit high-risk governance; missing competence or Evidence MUST block acceptance.

## Future Implementation Considerations

Future graph projections MAY render asserted edges but inference and graph-database implementation remain outside scope. Any mapping MUST preserve conceptual responsibility, exact identity,
versions, authority, lifecycle, references, and audit history.

## Change Control

Material change requires Knowledge Object Model, Knowledge Asset Architecture,
KAS/KGS, ADR/RAS, Design Freeze, source/evidence, and Publication Boundary impact
review, explicit competent approval, a new document version where meaning changes,
and preserved supersession history.
