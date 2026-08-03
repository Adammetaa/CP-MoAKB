# Observation Term Record Requirements

Status: Active

Version: 1.0

## Purpose

This document defines the conceptual information responsibilities that future
observation terminology must satisfy. It does not prescribe a record format.

## Required Responsibilities

A future term record MUST make the following reviewable:

- the governed concept with which the expression is associated;
- the preferred label, when preference has been approved;
- language, script, and locale as applicable;
- a neutral, morphology- or perception-first definition;
- scope and intended use;
- inclusion criteria;
- exclusion criteria;
- proposed broader and narrower relationships, subject to ontology authority;
- reviewed synonyms and alternative labels;
- prohibited labels or prohibited interpretations;
- an architecture-safe example;
- review status;
- authority or editorial basis;
- accountable review decisions;
- version and change history; and
- deprecation or replacement relationships when applicable.

## Definition Requirements

A definition MUST:

1. describe observable meaning without causal inference;
2. use sufficient inclusion and exclusion boundaries for repeatable review;
3. avoid circular dependence on its label or an ungoverned synonym;
4. distinguish direct perception from measurement and interpretation;
5. state meaningful context constraints; and
6. remain compatible with the
   [Neutrality and Non-inference Rules](neutrality-and-non-inference-rules.md).

## Authority and Traceability

The authority or editorial basis MUST identify why the expression is eligible
for consideration. External terminology MUST remain attributed to its external
authority. CP-MoAKB editorial acceptance MUST NOT be represented as ownership,
scientific proof, regulatory approval, or universal linguistic preference.

Every material revision MUST preserve who decided, what changed, why it changed,
which evidence or authority was considered, and which earlier status it
supersedes. Historical labels MUST remain traceable even when prohibited or
deprecated.

## Review Status

Review status MUST distinguish nomination, drafting, review, approval,
publication eligibility, publication, deprecation, and replacement as applicable.
Approval MUST NOT automatically cause publication. Publication MUST NOT imply
evidence acceptance or diagnosis authority.

## Implementation Neutrality

The responsibilities above MUST NOT be interpreted as mandatory field names,
data types, cardinalities, file structures, schemas, registry entries, API
properties, or runtime validation rules.
