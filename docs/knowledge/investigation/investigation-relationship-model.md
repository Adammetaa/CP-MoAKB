# Investigation Relationship Model

Status: Active

Version: 1.0

## Purpose

This model defines conceptual relationship meanings. Relationships are
explicitly authored assertions with scope, basis, provenance, and review; they
are not graph traversal rules, fields, predicates, or executable mappings.

## Relationship Semantics

| Relationship | Source to target meaning | Boundary |
|---|---|---|
| `investigates` | Investigation to bounded subject or situation | Does not assert a problem or cause. |
| `concerns` | Entity to declared referent, focus, or context | Does not assert identity or causality. |
| `based_on` | Authored entity to its traceable Observation or Knowledge basis | Does not mean proved by. |
| `identifies_gap` | Focus or Information State to an Information Gap | Does not manufacture missing facts. |
| `raises_question` | Gap or focus to an Investigation Question | Does not assert an answer. |
| `requires_evidence` | Gap, question, or criterion to an Evidence Need | Does not assert evidence exists. |
| `considers_hypothesis` | Case to an explicitly authored Hypothesis Candidate | Does not endorse or rank it. |
| `groups_in_differential` | Differential Set to plausible candidates | Membership order has no meaning. |
| `compared_by` | Candidates or Differential Set to Comparison Criterion | Does not select a candidate. |
| `supported_by` | Candidate or criterion to separately assessed Evidence | Support is scoped, not proof. |
| `challenged_by` | Candidate or criterion to adverse assessed Evidence | Challenge is scoped, not automatic rejection. |
| `unresolved_by` | Need, question, criterion, or candidate to material that did not resolve it | Does not mean the material is worthless. |
| `conflicts_with` | Entity to an incompatible account or assessment | Conflict remains visible pending review. |
| `reviewed_by` | Entity to accountable human review | Review does not confer downstream status. |
| `records_finding` | Investigation or case to an Investigation Finding | Finding remains within its declared category. |

## Evidence Relationship Qualification

Supporting, challenging, unresolved, and conflicting roles must identify the
precise candidate or criterion, the separately governed Evidence Object, the
scope of relevance, limitations, and human assessment. A source, image,
observation, or local label is not converted into Evidence merely by being linked.

## Composition Rules

Relationships do not compose automatically. If A is `based_on` B and B
`concerns` C, A does not thereby concern, prove, or identify C. If evidence
supports one criterion, it does not support the whole candidate. If a candidate
is grouped in a differential, it is not thereby plausible outside the bounded
case. Every additional meaning requires its own authored and reviewed assertion.

## Direction and Reciprocity

Display systems may show inverse wording for navigation, but inverse display
must not create a new semantic assertion. Repetition, adjacency, ordering,
shared terminology, or a common parent does not establish equivalence,
causality, conflict, support, or challenge.

## Review Requirements

Reviewers verify that each relationship has an authorized source and target,
uses the declared meaning, exposes its basis and limits, and does not cross an
epistemic layer. Ambiguous relationships remain unresolved or are rejected;
they are not repaired through inference.
