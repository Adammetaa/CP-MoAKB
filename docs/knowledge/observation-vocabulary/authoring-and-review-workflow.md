# Observation Vocabulary Authoring and Review Workflow

Status: Active

Version: 1.0

## Purpose

This document defines the human-governed workflow for future observation term
candidates. It creates no candidates or publication mechanism.

## Workflow

### 1. Nomination

A nominator MUST state the proposed expression, language and locale, intended
observable meaning, source or editorial basis, and reason for inclusion.

### 2. Definition Drafting

An author MUST draft a morphology- or perception-first definition, scope,
inclusions, exclusions, context, and known language relationships.

### 3. Boundary Review

A reviewer MUST confirm that the candidate belongs to observation vocabulary
and does not redefine ontology, identity, evidence, or another governed layer.

### 4. Non-inference Review

A reviewer MUST apply the
[Neutrality and Non-inference Rules](neutrality-and-non-inference-rules.md).
Failed candidates MUST return for revision or rejection.

### 5. Terminology Review

A qualified terminology reviewer MUST assess definition quality, ambiguity,
label status, synonyms, local expressions, translation, transliteration, and
equivalence claims under [KAS-005](../KAS-005-terminology-standard.md).

### 6. Scientific Review When Applicable

Scientific review MUST occur when morphology, measurement, organism identity,
or scientific usage requires specialist judgment. Scientific review MUST NOT
convert terminology acceptance into evidence or diagnosis acceptance.

### 7. Approval

An authorized governance body MUST decide approval, revision, or rejection and
record its rationale, reviewers, conflicts, and conditions. Consensus SHOULD be
sought; unresolved conflict MUST follow existing governance escalation.

### 8. Publication Eligibility

Approval is necessary but not sufficient for publication. Eligibility MUST
confirm authority, provenance, language review, non-inference review, version
history, licensing or attribution duties, and applicable publication boundaries.

### 9. Revision, Deprecation, or Replacement

Material changes MUST repeat the relevant reviews. Deprecation MUST preserve
history and rationale. Replacement MUST state the reviewed relationship and
MUST NOT erase the superseded expression.

## Decision Separation

Nomination, editorial acceptance, scientific review, governance approval,
publication eligibility, and publication are separate decisions. No stage MUST
automatically trigger the next. No stage authorizes runtime integration,
registry insertion, or dataset population.

## Rejection and Appeal

Rejection MUST state the failed criterion. An appeal MUST identify the contested
decision and new or overlooked basis; it MUST NOT bypass required reviews.
Governance procedures remain controlled by the existing KGS authorities.

## Auditability

The workflow MUST preserve candidate origin, drafts, review comments, conflicts,
decisions, authority basis, dates, and supersession history. Tool assistance MAY
support traceability but MUST NOT replace accountable human decisions.
