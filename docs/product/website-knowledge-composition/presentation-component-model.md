# Presentation Component Model

Status: Active

Version: 1.0

## Definition

A presentation component is a conceptual responsibility for expressing part of
an eligible Knowledge View within a Section. Components are presentation
abstractions only, not software components, schemas, content records, or Knowledge
Objects.

| Component | Presentation responsibility | Must not imply |
|---|---|---|
| Summary | bounded orientation with source View and omissions | complete knowledge or new conclusion |
| Concept | definition, scope, labels, identity, and authority | Website-defined meaning |
| Observation | context, method, result, uncertainty, and provenance | cause, Evidence, or Diagnosis |
| Investigation | governed questions, gaps, comparisons, review, and findings | active workflow or chosen explanation |
| Evidence | exact scoped role, basis, source, review, and limitations | universal proof |
| Relationship | asserted type, direction, basis, source, and target | inferred or transitive edge |
| Source | origin, citation, custody, rights, version, and use | automatic credibility or applicability |
| Review | purpose, authority, status, date, conditions, and dissent | publication or universal truth |
| Provenance | origin and relevant transformation chain | missing history has been resolved |
| Version | canonical and representation identities and compatibility | one shared Website version |
| Limitation | scope boundary, uncertainty, omission, or restriction | absence is negative evidence |
| Related Knowledge | explicitly asserted or clearly editorial navigation | scientific relationship or ranking |

## Fidelity

Component choice, truncation, order, visual emphasis, and repetition must preserve
the View's meaning, status, limits, and traceability. A component cannot authorize
content that its source View is not eligible to present.

## Implementation Boundary

No React component, HTML element, design token, event, interaction, rendering
contract, or accessibility implementation is specified here.
