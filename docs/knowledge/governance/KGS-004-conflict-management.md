# KGS-004: Conflict Management

Status: Active

Version: 1.0

## Purpose

Define fair, transparent, scoped resolution of scientific, terminology,
evidence, authority, and publication disagreements without destroying evidence,
silencing dissent, or exceeding competent authority.

## Scope

This standard applies when authors, reviewers, editors, boards, or governance
authorities reach incompatible findings or dispute ownership of a knowledge
decision.

## Out of Scope

This standard does not decide scientific truth by vote, create knowledge or
terminology, settle employment disputes, provide legal adjudication, authorize
publication, or modify software, schemas, Runtime, APIs, validation, registries,
or engineering contracts.

## Definitions

- **Conflict** is a material incompatibility among claims, interpretations,
  terms, evidence assessments, authority assertions, or publication decisions.
- **Conflict record** is the preserved statement of positions, evidence,
  authority, impact, participants, recusals, and disposition.
- **Facilitated resolution** is structured deliberation led by a neutral person
  who does not impose substantive judgment.
- **Competent authority** is the role or body qualified and appointed to decide
  the specific disputed scope.
- **Minority position** is a reasoned view not adopted in the disposition.
- **Unresolved** means the conflict remains visible and blocks only the actions
  for which resolution is required.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. Conflict MUST be preserved before any attempt to
resolve it.

## Governance Rules

### Common Conflict Controls

Any participant MAY raise a conflict in good faith. The Managing Editor MUST
record the contested question, each position, supporting and adverse evidence,
the authority claimed, affected scope, urgency, participants, and conflicts of
interest. Participants MUST receive a fair opportunity to correct the record and
respond.

The Governance Committee or Knowledge Board MUST identify the competent
authority and resolution path. It MUST separate conflicts that involve multiple
scopes rather than forcing one body to decide all of them. Existing content MUST
remain unchanged until the authorized disposition or emergency action takes
effect.

### Scientific Disagreement

Scientific disagreement MUST be referred to qualified independent Scientific
Reviewers or the Scientific Board. Review MUST compare methods, applicability,
uncertainty, assumptions, context, and competing interpretations. Credible
minority findings MUST remain visible. Consensus or voting MAY govern the
proposal's disposition but MUST NOT be described as proving an empirical fact.

When evidence cannot support resolution, the result MUST remain disputed,
qualified, deferred, or rejected rather than converted to certainty.

### Terminology Disagreement

Terminology disagreement MUST be referred to Terminology Reviewers and, where
meaning is implicated, the Domain or Ontology Board. Review MUST distinguish
labels from identities, translations from scientific names, usage frequency from
authority, and lexical preference from conceptual equivalence. Ambiguous or
regional terms MUST NOT be silently merged or forced into one preferred term.

### Evidence Disagreement

Evidence disagreement MUST be referred to Evidence Reviewers and any competent
Scientific or Domain Board needed for interpretation. Review MUST compare source
identity, claim scope, provenance, methods, currency, jurisdiction, rights,
limitations, and adverse evidence. Official-source status MUST be assessed under
Source Policy and ADR-008 and MUST NOT automatically resolve truth outside the
source's authority.

### Authority Disagreement

An authority disagreement MUST identify the exact decision and competing
authority bases. The Knowledge Board MAY resolve assignments internal to
knowledge governance. The Project Owner MAY decide final procedural ownership or
commission independent review. Questions governed by an ADR, RAS, Design Freeze,
Source Policy, Publication Boundary, law, rights holder, regulator, or external
authority MUST be referred to that competent authority and MUST NOT be decided by
KGS convenience.

### Publication Disagreement

Publication disagreement MUST be referred to the Knowledge Board for readiness
review and the Project Owner for public publication authority. A Release Editor
MAY block publication for an incomplete gate, rights problem, version mismatch,
or audit defect but MUST NOT publish over an unresolved block. The Project Owner
MAY stop or defer publication and MUST NOT override missing competent knowledge,
rights, regulatory, security, architecture, or release approval.

### Conflict Resolution

Resolution SHOULD begin with clarification and facilitated deliberation. It MAY
then use independent re-review, additional evidence review, scoped consensus, or
a permitted vote under KGS-001. The disposition MUST state what was decided,
what remains disputed, who had authority, the rationale, evidence, minority
positions, effective scope, consequences, and appeal route.

Resolution MUST NOT delete competing evidence, conceal recusal, retaliate,
misstate unanimity, or broaden beyond the question reviewed.

### Escalation

A conflict MUST escalate when the competent body lacks quorum or competence,
material conflicts of interest cannot be mitigated, authorities issue
incompatible decisions, the Constitution or an external authority is implicated,
or the potential impact exceeds the body's charter. Escalation MUST preserve the
full conflict record and MUST NOT reset the review history.

### Appeal

An appeal MUST follow KGS-001 and KGS-003. The appellant MUST identify procedural
error, overlooked material evidence, undisclosed conflict, misapplied authority,
or materially changed facts. The appeal body MUST be independent of the contested
conduct. It MAY affirm, amend, vacate, or remand the disposition, but MUST NOT
erase the original decision or manufacture missing competence.

## Examples

- Two studies support different conclusions in different environments. The
  conflict remains scoped by environment instead of being resolved by counting
  publications.
- Terminology reviewers disagree about a regional label; the record retains both
  uses and asks the Domain Board whether they refer to one concept.
- Publication is deferred because rights reviewers and editors disagree about
  permitted redistribution; the rights question goes to competent authority.

These examples illustrate conflict governance and make no scientific claims.

## Non-examples

- Selecting the view backed by the most prestigious institution without scope
  analysis.
- Removing dissent from the decision record after a vote.
- Asking an Editorial Board to decide scientific validity.
- Publishing while an authority dispute remains unresolved.
- Reopening an appeal repeatedly without new permitted grounds.

## Reviewer Notes

Reviewers SHOULD verify that the conflict record fairly states every position,
the deciding authority is competent, uncertainty is not hidden, and the remedy
is no broader than necessary. Apparent consensus reached through exclusion or
undisclosed conflict MUST be rejected.

## Future Work

Future work MAY define mediation guidance, conflict taxonomies, time targets, and
independent-review rosters. It MUST preserve conflict history and MUST NOT
automate substantive resolution, inference, diagnosis, or recommendation.
