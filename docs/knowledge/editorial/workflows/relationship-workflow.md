# Relationship Workflow

Status: Active
Version: 1.0

## Purpose
Govern explicit, evidenced relationship proposals without inferred edges.

## Scope
Relationship identity, source concept, predicate, target, direction, inverse,
scope, evidence, reviewer competence, uncertainty, conflict, and lifecycle.

## Out of Scope
This workflow MUST NOT traverse, infer, diagnose, recommend, or define ontology implementation.

## Authority
It applies the [handbook](../knowledge-editorial-handbook.md),
[KAS-006](../../KAS-006-relationship-standard.md), and ADR-005.

## Definitions
A **relationship candidate** is one scoped assertion; an **inverse** is a separately
governed semantic declaration, not an automatically generated fact.

## Responsibilities
Author proposes; Evidence Reviewer checks support; Scientific Reviewer checks
domain meaning; Ontology Reviewer checks predicate, direction, and layer.

## Procedure
1. Assign relationship identity and identify source and target by governed identity.
2. Declare predicate, direction, any proposed inverse, scope, uncertainty, conflict,
   evidence, lifecycle state, and required reviewer competence.
3. Treat `causes`, `prevents`, `controls`, `managed_by`, `effective_against`,
   `safe_for`, `permitted_in`, and `prohibited_in` as high risk.
4. Require explicit evidence and competent review for every high-risk proposal.
5. Preserve contradiction and reject any implicit inverse or transitive conclusion.

## Required Inputs
Governed candidate identities, predicate meaning, scope, evidence, and reviewer assignment.

## Required Outputs
One reviewable relationship candidate with disposition, limitations, conflicts, and audit links.

## Review Points
Identity, predicate meaning, direction, inverse claim, epistemic layer, scope,
evidence, competence, regulatory context, uncertainty, and conflict.

## Failure Modes
Label endpoints, inferred causation, automatic inverse, overbroad scope, hidden
uncertainty, insufficient competence, or relationship-as-recommendation.

## Examples
A fictional `associated_with` candidate MAY remain unresolved and explicitly non-causal.

## Non-examples
Two concepts appearing together MUST NOT create `causes`.

## Escalation
Semantic disputes go to Ontology Review; scientific disputes to Scientific Review;
regulatory or authority disputes follow KGS-004.

## Audit Requirements
Retain the proposal, evidence, predicate version, reviewers, recusals, decisions,
conflicts, revisions, lifecycle, and supersession.

## Change Control
Predicate or risk-control changes require KAS-006 and ADR-005 impact review.

## Future Considerations
Inference remains prohibited unless separately governed and implemented.
