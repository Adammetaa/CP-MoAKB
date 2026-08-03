# Knowledge Lab Prototype Interaction Model

Status: Static prototype documentation
Version: 1.0

## Purpose

Describe the small, reversible interactions that make the static prototype
testable without representing a real workflow system.

## Language Switching

Thai is committed as the initial HTML. Local Thai and English JSON catalogs have
matching keys. JavaScript may replace selected interface labels and retain only a
language preference. If catalogs, JavaScript, or browser storage are unavailable,
the complete Thai fallback remains visible.

## Role Views

The role selector demonstrates Knowledge Author, Scientific Reviewer, Evidence
Reviewer, Terminology Reviewer, Ontology Reviewer, Governance Reviewer, Release
Editor, Project Owner, and Read-only Observer. It hides or shows mock task cards
annotated for a role and displays a notice that permissions are not implemented.
It never changes object state or grants access.

## Conceptual Actions

Buttons for assignment, revision, finding, decision, escalation, return, and
acceptance display a live-region message stating that no change was persisted.
Decision choices are the governed labels Approve, Approve with required revision,
Return for revision, Reject, Defer, Escalate, and Recuse. No button records a
decision, closes a finding, accepts knowledge, or publishes.

## Finding and Revision Patterns

Finding cards always show identity, textual class, owner, status, required
response, closure authority, and audit history. Comparison panels preserve prior
and current versions, author response, reviewer request, accepted change, rejected
change, and unresolved change. No text merge is performed.

## Traceability

The evidence screen offers explicit links through Candidate, Claim, Evidence,
Source, Authority, Review, and Decision. Labels identify supports, contradicts,
withdrawn, rights constrained, and unresolved states. No link is generated or
treated as an inferred conclusion.

## Failure and Empty States

Static content explains blocked gates, unknown rights, pending conflict
declarations, missing authority, and empty filtered views. An empty view does not
mean no knowledge exists. JavaScript failure does not remove critical information.

## Audit Boundary

All audit items are fictional display records and conceptually append-only. No
storage, clock, identity service, event stream, or audit implementation exists.
