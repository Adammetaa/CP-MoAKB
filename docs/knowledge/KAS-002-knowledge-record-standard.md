# KAS-002: Knowledge Record Standard

Status: Active

Version: 1.0

## Purpose

Define the governance information required to understand and review one
knowledge record without prescribing a database, schema, file format, ontology
language, API, or Runtime model.

## Scope

This standard applies to a conceptual record that carries one governed unit of
knowledge. A collection MAY use different authoring forms, but every published
unit MUST expose the equivalent governance meaning.

## Out of Scope

This standard does not define fields, datatypes, serialization, identifiers,
storage, validation code, user interfaces, or actual agricultural content. It
does not declare that the current Runtime candidate-record model implements this
standard.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative. Section labels describe conceptual responsibilities, not physical
properties or keys.

## Definitions

- **Knowledge record** is the smallest governed unit whose meaning, support,
  review, version, and lifecycle can be evaluated independently.
- **Definition** states what the record means; it is not evidence that the
  defined assertion is true.
- **Scope** states contexts where the record is intended to apply.
- **Exclusion** states nearby meanings or contexts the record deliberately does
  not cover.
- **Ontology placement** identifies a reviewed conceptual category and
  relationships without choosing a physical ontology.
- **Review state** records progress and decisions; **lifecycle** records the
  broader status defined by [KAS-007](KAS-007-knowledge-lifecycle.md).

## Governance Rules

One knowledge record MUST make the following responsibilities reviewable:

1. **Identity.** Reference a stable governed identity, its authority, and its
   category. Labels, definitions, citations, and external identifiers MUST NOT
   silently become identity.
2. **Definition.** State one clear meaning at the granularity claimed. A
   definition MUST avoid circularity, hidden recommendation, and unsupported
   certainty.
3. **Scope.** Declare applicable domain, population or entity category, context,
   geography, jurisdiction, time, language, and audience when material.
4. **Exclusions.** Distinguish confusing neighbors, prohibited interpretations,
   and contexts not supported by the evidence.
5. **Authority.** Name the authority for identity, terminology, evidence,
   regulation, and review separately when they differ.
6. **Terminology.** Reference governed preferred and alternative expressions
   under [KAS-005](KAS-005-terminology-standard.md); terminology MUST remain
   separate from the referent.
7. **Ontology placement.** State the conceptual category and reviewed
   relationships. Placement MUST NOT imply a graph implementation or inference.
8. **References.** Provide source identities and locators conforming to
   [KAS-004](KAS-004-citation-standard.md), including edition and retrieval
   context where required.
9. **Evidence.** Link supporting, contradicting, and missing evidence under
   [KAS-003](KAS-003-evidence-standard.md). A bibliography alone is insufficient.
10. **Review state.** Record required review perspectives, decisions,
    qualifications, unresolved objections, and responsible roles.
11. **Lifecycle.** Record the current KAS-007 state and every transition needed
    to interpret publication, deprecation, retirement, or supersession.
12. **Version.** Identify the record version, validity or effective period, and
    relationship to earlier or later versions. Versions MUST NOT be reused.
13. **Notes.** Preserve usage guidance, ambiguity, assumptions, rights/privacy
    constraints, transformation history, and reviewer cautions that materially
    affect interpretation.

A record MUST remain Candidate or Draft when any required responsibility is
unknown. Unknown values MUST be explicit; authors MUST NOT fill gaps by inference
from names, neighboring records, or software defaults.

## Examples

A fictional record proposal references a stable synthetic concept, supplies a
bounded definition, states that it excludes regulatory and recommendation
meaning, links two supporting sources and one conflict, records pending
terminology review, and remains Draft. This illustrates completeness without
creating agricultural knowledge.

## Non-examples

- A label and URL presented as a complete knowledge record.
- A definition whose only support is another unsourced definition.
- A record marked Published because it was committed to Git.
- A relationship list with no semantics, evidence, scope, or review state.
- A version overwritten in place after a material definition change.

## Reviewer Notes

Reviewers SHOULD evaluate whether the proposed unit is independently meaningful,
whether it combines unlike claims, and whether each authority is competent for
the responsibility assigned. Split a record when its assertions have materially
different evidence, scope, validity, or lifecycle.

## Future Considerations

Future work may define authoring templates or implementation mappings only after
separate architecture approval. Such mappings MUST demonstrate equivalence to
these responsibilities and MUST NOT turn this conceptual list into an accidental
universal schema.
