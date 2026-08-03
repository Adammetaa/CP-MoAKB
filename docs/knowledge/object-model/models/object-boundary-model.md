# Object Boundary Model

Status: Active

## Purpose

Define non-overlapping conceptual ownership among the fifteen object classes.

## Boundary Rules

An object MUST own only its canonical responsibility. It MAY reference another
object but MUST NOT copy that object's governed identity or substitute for its
authority. Scientific meaning, source provenance, evidence evaluation, review,
decision, lifecycle, publication, representation, and package selection MUST
remain independently inspectable.

Containment for presentation MUST NOT imply semantic ownership. Concept MUST NOT
embed copied Evidence; Evidence MUST NOT own Source identity; Review MUST NOT
edit the reviewed object; Decision MUST NOT become Publication; Representation
MUST NOT become Knowledge; Package Membership MUST NOT transfer Asset ownership.

## Forbidden Boundary Collapses

- Claim as a fieldless note inside Evidence;
- Term string as Concept identity;
- Relationship implied by adjacency or navigation;
- Finding treated as the Decision;
- Lifecycle Event treated as current state;
- Publication Record treated as scientific proof; or
- one aggregate object hiding versions and authorities of its components.

## Review and Change Control

Architecture and governance reviewers MUST reject ambiguous responsibility.
Future implementation MAY distribute or aggregate storage only if the conceptual
boundaries remain reconstructable. This model defines no schema or containment
technology and may change only through Knowledge Object Model governance.
