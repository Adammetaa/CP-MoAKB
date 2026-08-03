# Applicability and Trigger Model

Status: Active

Version: 1.0

## Applicability Condition

An Applicability Condition explains when a Question Pattern may be considered
relevant to a bounded Information Gap, Investigation Focus, prior account, or
review need. It states contextual fit and its basis. It does not automatically
trigger, select, prioritize, render, or ask the question.

## Trigger Condition

A Trigger Condition is an explicitly authored condition for possible use. It
may name an unresolved state, a conflict, a missing context, or a prior response
that gives a human reason to consider the pattern. It is not executable logic,
an event, a decision rule, or a branch. Satisfaction requires human assessment
and may still result in non-use.

## Exclusion Condition

An Exclusion Condition explains when a pattern should not be used because it may
be irrelevant, duplicative, unsafe, misleading, or outside scope. It must state
the limitation and rationale without hiding the underlying gap. An exclusion
does not prove another question appropriate, resolve the gap, or select an answer.

## Relationship to Information State

Known, reported, directly observed, measured, not observed, not recorded,
unknown, unavailable, conflicting, not applicable, pending review, and rejected
remain distinct under the Investigation Ontology. Conditions may refer to an
explicitly assessed state, but they may not infer one from an empty response,
missing field, interface behavior, or absence of a record.

## Human Consideration

Before using a pattern, a human checks:

- whether the gap and question intent remain current;
- whether scope and context satisfy applicability on a traceable basis;
- whether any exclusion applies;
- whether the question duplicates reviewed information;
- whether asking is safe, proportionate, neutral, and within authority; and
- whether the expected response and missing-state choices fit the respondent.

The outcome and rationale remain case-specific. Pattern eligibility is not
question-instance approval.

## Follow-up Boundary

A prior response may support consideration of a clarifying or verification
pattern, but no response value executes a follow-up. Relationships such as
`clarifies`, `refines`, `verifies`, `expands`, `resolves_conflict`,
`requests_missing_context`, and `requests_additional_evidence` describe meaning
only. They do not form an automatic branching decision tree.

## Future Implementation

Future systems may expose applicable-looking patterns for human browsing only
under separately approved implementation governance. This architecture defines
no matching, filtering, selection, priority, scoring, or suppression algorithm.
