# KAS-001: Knowledge Authoring Principles

Status: Active

Version: 1.0

## Purpose

Apply the [Knowledge Constitution](constitution/knowledge-constitution.md) to
authoring principles that every future CP-MoAKB knowledge proposal, review
decision, publication, revision, and retirement MUST preserve.

## Scope

This standard applies to authored definitions, assertions, terminology,
relationships, evidence interpretations, and knowledge-governance decisions. It
applies before any choice of storage, serialization, interface, or tool.

## Out of Scope

This standard does not create scientific content, approve a source, define a
dataset, implement a schema, automate review, perform diagnosis, produce a
recommendation, or authorize publication.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** express
requirements. A documented exception MAY be proposed, but it has no effect until
the authority responsible for the affected knowledge scope explicitly approves
it.

## Definitions

- **Knowledge** is a reviewed, scoped, versioned assertion or definition with
  sufficient authority, evidence, provenance, and lifecycle context.
- **Author** proposes content and supplies traceability; authorship is not review
  approval.
- **Authority** is the declared organization, publication, governance body, or
  qualified review role entitled to support a specific claim within a scope.
- **Publication** is a governed act that makes an accepted knowledge version
  available in a declared release; repository presence alone is not publication.
- **Deterministic knowledge** has stable identity, meaning, evidence selection,
  ordering, and versioned inputs such that the same governed basis yields the
  same authored result.

## Governance Rules

1. **Knowledge-first.** Authors MUST define intended meaning, scope, exclusions,
   and authority before proposing representation or automation.
2. **Official Source First.** Binding classifications, regulatory facts, and
   source-owned statements MUST use the responsible official authority where one
   exists. Official status MUST NOT be generalized beyond that authority's scope.
3. **Evidence before Knowledge.** A claim MUST NOT become accepted knowledge
   until its evidence, provenance, applicability, limitations, and conflicts are
   reviewable under [KAS-003](KAS-003-evidence-standard.md).
4. **Explainability by Design.** Every material assertion MUST be explainable in
   terms of what is claimed, why it is supported, what limits it, and what remains
   unknown or disputed.
5. **Traceability by Design.** Identity, sources, citations, evidence,
   transformations, reviewers, decisions, versions, and supersession MUST remain
   connected without relying on private memory.
6. **Scientific Neutrality.** Authors MUST distinguish source statements,
   observations, evidence, interpretation, uncertainty, and governance decisions.
   They MUST preserve credible disagreement and MUST NOT write advocacy as fact.
7. **Authority Governance.** Every authority MUST be named, scoped, versioned
   where applicable, and reviewed for competence, currency, jurisdiction, and
   rights. Prestige alone is not universal authority.
8. **Separation of concepts.** Observation is not evidence; evidence is not
   knowledge; knowledge is not diagnosis; diagnosis is not recommendation; and
   recommendation is not decision or action. No lifecycle transition MAY silently
   convert one category into another.
9. **Versioned Knowledge.** Material meaning changes MUST create a new auditable
   version or successor. Historical versions MUST NOT be overwritten.
10. **Deterministic Knowledge.** Authors MUST use explicit inputs and stable
    rules. Missing information MUST remain missing or unknown, never invented.
11. **Review Before Publication.** Acceptance and publication are distinct.
    Required scientific, evidence, terminology, ontology, regulatory, rights,
    privacy, or other reviews MUST finish before the applicable publication gate.
12. **Reproducibility.** A qualified reviewer SHOULD be able to reconstruct the
    authored claim and review conclusion from retained evidence and decisions.
13. **Transparency.** Conflicts, gaps, assumptions, exceptions, uncertainty,
    corrections, deprecation, and sponsorship or conflicts of interest MUST be
    visible at the appropriate governance boundary.

## Examples

- A fictional proposal identifies a source-owned classification, quotes no
  protected content, records the exact edition, limits the claim to the issuing
  authority's classification scope, and awaits evidence and terminology review.
- Two fictional studies disagree. The author preserves both, records different
  contexts and methods, and leaves the assertion disputed pending qualified
  review.

These are governance illustrations, not knowledge records or scientific claims.

## Non-examples

- Treating repeated observations as proof of causality.
- Converting a classification into a pesticide recommendation.
- Choosing a preferred term because it appears most often on the web.
- Replacing a prior definition without version or supersession history.
- Calling a mechanically valid record scientifically accepted.

## Reviewer Notes

Reviewers SHOULD ask whether the proposal makes category boundaries explicit,
uses the right authority for each claim, preserves adverse evidence, and can be
reconstructed by someone other than the author. A well-written statement MUST be
deferred when its evidence or authority is insufficient.

## Future Considerations

Future KAS amendments may govern conflicts of interest, reviewer competence,
formal change requests, or publication collections. They MUST conform to the
Knowledge Constitution. A KAS amendment MUST NOT amend or supersede the
Constitution; constitutional change MUST follow the Constitution's separate
amendment procedure.
