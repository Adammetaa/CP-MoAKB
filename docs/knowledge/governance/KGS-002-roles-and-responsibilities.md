# KGS-002: Roles and Responsibilities

Status: Active

Version: 1.0

## Purpose

Define the qualifications, authority, responsibilities, limitations, and
conflict-of-interest duties of people participating in CP-MoAKB knowledge
governance.

## Scope

This standard applies to appointment and conduct of Knowledge Authors,
Scientific Reviewers, Terminology Reviewers, Ontology Reviewers, Evidence
Reviewers, Domain Editors, Managing Editors, Release Editors, Governance
Committee members, and the Project Owner.

## Out of Scope

This standard does not create employment classifications, professional licenses,
agricultural content, reviewer automation, software permissions, repository
roles, schemas, APIs, datasets, diagnosis, recommendation, or inference.

## Definitions

- **Qualification** is documented competence relevant to an assigned review
  scope; it is not merely a title or self-declaration.
- **Appointment** is an explicit, scoped, recorded assignment of a person to a
  governance role.
- **Responsibility** is work a role MUST perform.
- **Authority** is a decision a role MAY make within its appointed scope.
- **Limitation** is a decision or action the role MUST NOT take.
- **Conflict of interest** is a personal, financial, professional,
  organizational, advocacy, authorship, or other interest that could reasonably
  impair or appear to impair independent judgment.
- **Governance Committee** is a cross-board coordinating group convened for
  governance administration or a scoped multi-authority question; it is not an
  authority above the Constitution or Project Owner.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized. A person MUST NOT exercise a role without a recorded
appointment and qualification basis appropriate to the assignment.

## Governance Rules

### Common Qualification and Conduct Rules

Every appointee MUST demonstrate relevant knowledge, ability to evaluate the
assigned material, understanding of the Constitution and applicable KAS/KGS,
and capacity to document impartial reasons. Qualifications MAY arise from
education, recognized professional standing, research, curation, language,
domain, editorial, regulatory, or equivalent reviewed experience.

Appointments MUST identify scope, authority, limitations, term or review date,
and appointing authority. Reviewers MUST work from the governed record, preserve
uncertainty and disagreement, protect confidential or restricted material, and
state when an issue exceeds their competence.

### Knowledge Author

The Knowledge Author MUST state the proposed meaning and scope, supply required
sources, citations, provenance, evidence, uncertainty, conflicts, and revision
responses, and distinguish authorship from acceptance. The Author MAY explain
and revise the proposal but MUST NOT approve, independently publish, or serve as
the sole reviewer of their own work.

### Scientific Reviewer

The Scientific Reviewer MUST have demonstrable competence in the relevant
scientific discipline or methods. The reviewer MUST assess scientific neutrality,
methods, applicability, uncertainty, causal language, limitations, and competing
interpretations. The reviewer MAY approve, conditionally approve, defer, or
reject within that scope, but MUST NOT decide editorial preference, software
architecture, legal permission, or operational recommendation unless separately
appointed and independently reviewed for that role.

### Terminology Reviewer

The Terminology Reviewer MUST have relevant linguistic, nomenclatural,
translation, terminology, or vocabulary-governance competence. The reviewer MUST
assess language, script, term status, ambiguity, equivalence claims, source
ownership, and multilingual fidelity under KAS-005. The reviewer MUST NOT create
identity from label equality or redefine ontology or scientific meaning.

### Ontology Reviewer

The Ontology Reviewer MUST understand the applicable conceptual domain,
relationship semantics, and implementation-neutral ontology boundaries. The
reviewer MUST assess conceptual category, layer separation, relationship meaning,
and consistency with ADR-005 and KAS-006. The reviewer MUST NOT select a physical
schema, graph technology, Runtime representation, or API.

### Evidence Reviewer

The Evidence Reviewer MUST be competent to assess source identity, provenance,
claim support, evidence level, applicability, conflicts, limitations, currency,
and rights indicators. The reviewer MUST apply KAS-003, KAS-004, Source Policy,
and ADR-008 without treating source prestige or official status as universal
truth. The reviewer MUST NOT silently repair missing evidence or decide a domain
claim beyond their competence.

### Domain Editor

The Domain Editor MUST have reviewed knowledge of the declared domain and its
boundaries. The editor MUST coordinate domain consistency, identify required
domain reviewers, maintain scope, and ensure unresolved domain questions are
visible. The editor MAY recommend a proposal for review but MUST NOT replace
independent scientific, evidence, terminology, ontology, or publication review.

### Managing Editor

The Managing Editor MUST understand the full authoring and review lifecycle. The
editor MUST manage submissions, assignments, deadlines, revision rounds,
decision records, and handoffs while preserving reviewer independence. The
editor MAY return incomplete submissions and coordinate emergency restrictions,
but MUST NOT approve scientific truth, suppress dissent, or authorize public
publication.

### Release Editor

The Release Editor MUST understand versioning, publication records, rights,
attribution, freeze, retraction, withdrawal, and the Publication Boundary. The
editor MUST assemble an approved knowledge release, verify every gate, record
the exact released scope and version, and execute publication only after explicit
authorization. The editor MUST NOT self-authorize, alter accepted meaning, or
equate repository access with publication authority.

### Governance Committee

The Governance Committee MUST comprise appropriately appointed representatives
for every authority engaged by its charter or case. It MAY coordinate policy
interpretation, cross-board scheduling, appointments proposed to the Project
Owner, conflict handling, audits, and governance improvement. It MUST NOT
override a competent board, amend the Constitution, approve missing evidence, or
publish unless a separate standard expressly grants the decision to its members
acting in their appointed roles.

### Project Owner

The Project Owner MUST safeguard the Constitution and boundaries among
knowledge, architecture, Runtime, source, rights, and publication authorities.
The Owner MAY appoint and remove governance members, approve KGS amendments,
resolve final procedural authority questions, commission independent review,
stop work, and authorize public knowledge publication. The Owner MUST preserve
adverse expert findings and MUST NOT substitute ownership for scientific,
terminology, ontology, evidence, domain, regulatory, rights, or security
competence.

### Conflict of Interest

Every participant MUST disclose an actual, potential, or reasonably perceived
conflict before acting and whenever circumstances change. The accountable chair
MUST record the disclosure and decide recusal, mitigation, independent review,
or reassignment. A materially conflicted person MUST NOT vote, chair the
decision, select the sole reviewer, or control the record. Nondisclosure MAY
invalidate and reopen an affected decision.

No role MAY retaliate against a good-faith objection, adverse review, appeal,
correction request, or conflict disclosure.

## Examples

- A terminology specialist reviews multilingual ambiguity while a separately
  appointed Domain Editor reviews domain meaning.
- An author with relevant scientific credentials still does not approve their
  own submission; an independent Scientific Reviewer is assigned.
- A Release Editor detects missing rights approval and blocks assembly despite
  completed editorial review.

These examples assign responsibilities; they do not approve knowledge.

## Non-examples

- Treating repository write access as Release Editor authority.
- Appointing a reviewer solely because the person is senior.
- Allowing one reviewer to approve every scope without documented competence.
- Concealing sponsorship because the reviewer believes it did not affect them.
- Letting an editor rewrite a dissenting scientific finding.

## Reviewer Notes

Reviewers SHOULD examine whether each appointment is current, scoped, and
independent; whether qualifications match the actual question; and whether
limitations are enforced. Multi-role appointments SHOULD receive additional
scrutiny for self-review and concentrated authority.

## Future Work

Future work MAY define competency matrices, appointment forms, training,
succession, accessibility, and reviewer-development programs. It MUST NOT lower
independence requirements or convert a governance role into software access or
scientific authority outside its scope.
