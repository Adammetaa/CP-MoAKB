# Canonical Knowledge Object Model

Status: Active

Version: 1.0

## Purpose

Define which conceptual object classes exist inside and around a Knowledge
Asset, their non-overlapping responsibilities, and how exact references connect
them into Packages and representations.

## Scope and Out of Scope

The model governs conceptual meaning, identity responsibility, version
responsibility, lifecycle custody, references, review, audit, and view boundaries.
It MUST NOT define machine fields, types, required keys, serialization, storage,
validation implementation, identifier syntax, API payloads, or Runtime behavior.

## Authority

The [Knowledge Asset Architecture](../architecture/README.md) defines the Asset,
Package, representation, identity, version, reference, namespace, and ownership
invariants. The Constitution, KAS, KGS, ADRs, RAS, Source Policy, Evidence Levels,
Design Freeze, and Publication Boundary remain authoritative and MUST NOT be
silently superseded by this model.

## Object Model Principles

1. **One object, one governed responsibility.** An object MUST own one coherent
   responsibility and MUST reference separately governed responsibilities.
2. **Identity independence.** Identity MUST remain independent from labels,
   filenames, folders, URLs, interfaces, and storage locations.
3. **Reference, do not duplicate.** Objects MUST reference exact governed objects
   rather than copy their identity, meaning, evidence, or decisions.
4. **Scientific meaning separation.** Concepts, Claims, Relationships, and
   Terminology MUST remain distinct from Evidence and Sources.
5. **Evidence separation.** Evidence evaluates source content for a Claim; it is
   neither the Claim nor universal truth.
6. **Claim and Concept separation.** A Concept governs identity and meaning; a
   Claim states one proposition about a scope.
7. **Explicit Relationships.** An asserted Relationship MUST be an identified,
   reviewable object and MUST NOT exist merely as navigation or an inferred edge.
8. **Review separation.** Review records governance activity against a fixed
   version and MUST NOT rewrite scientific content.
9. **Decision separation.** A Decision is a competent formal outcome; Review or
   Finding closure alone MUST NOT create it.
10. **Publication separation.** A Publication Record documents authorization and
    publication; it MUST NOT create accepted meaning.
11. **Append-only transition history.** Lifecycle Events MUST preserve prior
    history and MUST NOT substitute for current lifecycle status.
12. **Representation fidelity.** A Representation expresses an exact Asset
    version and MUST NOT automatically become a new Asset.
13. **Membership without transfer.** Package Membership selects an exact Asset
    version and MUST NOT copy or transfer Asset identity or ownership.
14. **No silent inference.** No link, score, UI path, aggregation, or generated
    output MAY create an unstated object or relationship.
15. **No hidden aggregation.** A container or view MUST expose the independent
    identities and versions it assembles.
16. **No implicit publication.** Acceptance, package inclusion, repository
    presence, validation, rendering, and public reachability are not publication.

## Object Class Catalog

| Class | Canonical responsibility | Meaning group |
| --- | --- | --- |
| Source | Identity, version, custody, and provenance of nominated source material | Evidence and provenance |
| Evidence | Claim-scoped evaluation of exact source content | Evidence and provenance |
| Claim | One scoped, attributable, reviewable proposition | Scientific meaning |
| Concept | Governed identity, definition, scope, exclusions, and disambiguation | Scientific meaning |
| Terminology | Language- and context-specific expression linked to a Concept | Scientific meaning |
| Relationship | Explicit typed assertion between identified Concepts | Scientific meaning |
| Authority | Identified competence and authority scope | Evidence and provenance |
| Review | Human review activity against fixed object versions | Review and governance |
| Finding | Specific review issue requiring disposition | Review and governance |
| Decision | Formal outcome by competent authority | Review and governance |
| Unresolved Issue | Preserved unknown, conflict, insufficiency, or blocker | Review and governance |
| Lifecycle Event | Immutable conceptual record of a governed transition | Lifecycle and publication |
| Publication Record | Record of exact authorization and publication state/event | Lifecycle and publication |
| Representation | Governed view or projection of an exact Asset version | Presentation |
| Package Membership | Explicit selection of an exact Asset version into an exact Package version | Lifecycle and publication |

## Asset and Package Composition

A Knowledge Asset's semantic nucleus MAY be formed from Concept, Claim,
Relationship, and Terminology objects. Source, Evidence, and Authority objects
support provenance and assessment. Review, Finding, Decision, and Unresolved
Issue objects govern evaluation without becoming scientific meaning. Lifecycle
Events and Publication Records preserve transitions and release history.
Representations show exact Asset versions. Package Membership connects exact
Asset and Package versions without transferring ownership.

Objects MAY exist independently when their responsibility requires independent
identity, review, correction, or reuse. Asset composition MUST NOT erase those
identities. Package composition MUST use explicit membership rather than copied
objects.

## Digital Twin Mapping

Knowledge Lab MAY render candidates, drafts, unresolved issues, reviews,
findings, responses, decisions, and proposed lifecycle actions. Knowledge
Explorer MAY render exact accepted and authorized public views with evidence,
authority, and publication traceability. A future Runtime MAY project exact
versions only after separate ADR/RAS approval. No view owns underlying meaning.

The same object identity and exact version MUST be traceable across views.
Differences in language, layout, status visibility, or interaction MAY create
Representation Versions but MUST NOT create duplicate Knowledge Objects.

## Failure Boundaries

The model fails when one object silently owns another object's responsibility,
a reference floats across material versions, a label becomes identity, evidence
becomes a Claim, review becomes acceptance, publication creates meaning, or a
view manufactures an edge. Such defects MUST block acceptance or publication
until explicitly corrected and reviewed.

## Future Implementation Considerations

Future mappings MAY use files, object stores, databases, graphs, services, or
other technologies. Each mapping MUST preserve these responsibilities and
references and requires separate architecture approval. This model is not a
machine contract.

## Change Control

Material change requires impact review across the Knowledge Asset Architecture,
Constitution, KAS, KGS, ADRs, RAS, Source Policy, Evidence Levels, Design Freeze,
and Publication Boundary, plus explicit competent approval and preserved history.
