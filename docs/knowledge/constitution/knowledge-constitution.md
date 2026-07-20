# CP-MoAKB Knowledge Constitution

Status: Active

Version: 1.0

## Purpose and Constitutional Authority

This Constitution IS the highest normative authority within CP-MoAKB knowledge
governance. Every Knowledge Authoring Standard (KAS), knowledge policy,
handbook, template, review decision, and future knowledge publication MUST
conform to it.

This authority is scoped. The Constitution MUST NOT override an owner-approved
Architecture Decision Record (ADR), an active Runtime Architecture Specification
(RAS), Design Freeze, the Source Policy, the Publication Boundary, law, source
rights, or an authority external to CP-MoAKB. A conflict across those authority
boundaries MUST stop the affected work and MUST be resolved by the authority
competent for every affected scope.

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative when capitalized.

## Scope of Knowledge Governance

This Constitution governs how knowledge is proposed, sourced, identified,
named, conceptually distinguished, evidenced, reviewed, accepted, published,
amended, superseded, excepted, and retained. It governs definitions, assertions,
terminology, conceptual relationships, provenance, uncertainty, and knowledge
lifecycle decisions.

It MUST NOT create agricultural facts, master data, approved terminology,
ontology content, diagnosis, recommendations, inference, or regulatory
determinations. It MUST NOT select a file format, database, schema, serialization,
API, validation implementation, Runtime behavior, automation, or AI system.

## Authority Relationships

### Design Freeze

Knowledge governance documentation MAY clarify future knowledge obligations, but
MUST NOT amend frozen behavior, schemas, datasets, manifests, versions, golden
baselines, APIs, or contracts. Work that would affect a frozen component MUST
stop until a separately authorized change explicitly addresses Design Freeze.

### Architecture Decision Records

Accepted ADRs MUST remain authoritative for their architectural decisions. This
Constitution MUST be interpreted consistently with ADR-005 through ADR-009:

- ADR-005 MUST remain the authority for layered, implementation-neutral
  conceptual ontology and separation before physical implementation.
- ADR-006 MUST remain the authority for stable identity governance before
  controlled-vocabulary implementation.
- ADR-007 MUST remain the authority for controlled-vocabulary governance before
  vocabulary construction.
- ADR-008 MUST remain the authority for canonical master-data governance before
  domain dataset expansion. Its distinction between source authority and truth,
  and its claim-, jurisdiction-, version-, and time-scoped source assessment,
  MUST NOT be weakened or generalized.
- ADR-009 MUST remain the authority for the constrained YAML candidate-record
  format of the Rice pilot. This Constitution MUST NOT duplicate that format,
  transform it into a general knowledge schema, allocate candidate records or
  identifiers, or authorize pilot content or Runtime ingestion.

A KAS or subordinate policy MUST NOT duplicate, silently supersede, or broaden
an ADR decision. A proposed conflict MUST be resolved through the established
architecture process before the knowledge rule may take effect.

### Runtime Architecture Specifications

RAS-001 through RAS-015 MUST remain the normative contract family for Runtime
engineering, validation, adapters, registries, services, public compatibility,
projections, transports, packaging, security, documentation, and release audit.
This Constitution and every KAS MUST remain outside that implementation
authority. A knowledge requirement needing software support MUST enter a
separately approved engineering scope and MUST comply with every applicable ADR,
RAS, Design Freeze, compatibility, security, and release requirement.

### Source and Publication Authorities

The [Source Policy](../../SOURCE_POLICY.md) MUST govern source tiers,
registration, integrity, versioning, jurisdiction, licensing, replacement, and
source review. This Constitution establishes principles but MUST NOT register,
approve, acquire, integrate, or declare a source canonical.

The [Publication Boundary](../../release/publication-boundary.md) MUST govern
whether repository content, artifacts, packages, tags, or releases are publicly
published. Knowledge acceptance and software publication MUST remain distinct
decisions. A commit, test result, generated artifact, or accepted knowledge
review MUST NOT be treated as publication approval.

## Constitutional Principles

### Epistemic-Layer Separation

Source material, observation, evidence, knowledge, diagnostic reasoning,
regulation, safety, recommendation, decision, and action MUST remain distinct.
No author, reviewer, transformation, or publication process MAY silently convert
one layer into another. Cross-layer relationships MUST state their meaning,
scope, evidence, and review authority without implying causation or approval.

### Evidence Before Knowledge

An assertion MUST NOT become accepted knowledge until its supporting and adverse
evidence, provenance, applicability, limitations, uncertainty, and conflicts are
reviewable. Absence of evidence MUST remain absence; missing facts MUST NOT be
invented, filled by plausibility, or concealed by confident language.

### Official Source First

When a responsible official authority exists for a binding classification,
regulatory fact, or source-owned statement, authors MUST evaluate that official
source first. Official-source status MUST NOT be treated as universal truth or
extended beyond the source's claim, competence, jurisdiction, version, time, and
rights. Secondary sources MUST NOT silently replace available official authority.

### Identity Authority

Identity MUST be governed independently from labels. Every identifier family
MUST have explicit authority, ownership, scope, lifecycle, non-reuse, mapping,
and review rules before use. Label equality, translation, external identifier
reuse, or automated matching MUST NOT establish identity, equivalence, truth, or
approval. ADR-006 MUST remain authoritative for identity sequencing.

### Terminology Authority

Terminology MUST express governed language without redefining identity,
ontology, evidence, regulation, diagnosis, safety, or recommendation. Preferred,
alternative, deprecated, scientific, vernacular, translated, and ambiguous terms
MUST preserve their authority, language, scope, provenance, and review status.
ADR-007 MUST remain authoritative for vocabulary sequencing.

### Ontology Authority

Ontology authority MUST govern conceptual meaning and relationships separately
from physical representation. Conceptual layers and their boundaries MUST be
reviewed before implementation, and no terminology choice, record shape, or
storage technology MAY redefine them. ADR-005 MUST remain authoritative for
ontology sequencing and layer separation.

### Scientific Neutrality

Knowledge authors and reviewers MUST distinguish reported facts, observations,
methods, interpretations, uncertainty, hypotheses, and governance decisions.
They MUST represent the scope and limitations of evidence and MUST NOT present
advocacy, popularity, commercial interest, or institutional prestige as proof.

### Conflict Preservation

Credible conflicts MUST be preserved with separate provenance and context.
Resolution MUST record the competent reviewer, rationale, scope, date, and effect
without deleting or rewriting the losing evidence. Last-write-wins, majority
counting, and source prestige alone MUST NOT resolve scientific or regulatory
disagreement.

### Review Before Publication

Required domain, scientific, evidence, terminology, ontology, regulatory,
rights, privacy, architecture, security, and release reviews MUST be completed
before the applicable publication gate. Mechanical validity MUST NOT be treated
as knowledge acceptance, and acceptance MUST NOT be treated as publication.

## Prohibited Knowledge Transitions

### Non-Inference Boundary

Authored knowledge MUST NOT contain unstated deductions, causal conclusions,
rankings, confidence scores, predictions, or generated facts. Any future
inference capability MUST require an explicit governed scope, reviewed evidence,
qualified oversight, and separately approved architecture and implementation.

### Non-Diagnosis Boundary

Knowledge descriptions, observations, traits, symptoms, and signs MUST NOT be
presented as a diagnosis or confirmation of a cause. This Constitution MUST NOT
authorize diagnostic logic, diagnostic claims, or automated diagnosis.

### Non-Recommendation Boundary

Knowledge MUST NOT be transformed into product choice, treatment, rate, timing,
ranking, or operational advice without a separately authorized recommendation
governance process. Classification, evidence, diagnosis, regulation, and safety
context MUST NOT be treated as a recommendation.

### Regulation Boundary

Regulatory assertions MUST use the competent current official authority for the
declared jurisdiction, version, and effective period. Scientific or foreign
material MAY provide context but MUST NOT establish legal permission. Unknown,
expired, conflicting, or unavailable regulatory status MUST remain explicit and
MUST NOT be inferred.

### Official Reference Material Boundary

Official reference material MUST remain governed by source identity, integrity,
version, retrieval, jurisdiction, rights, retention, and reproducibility rules.
Repository presence MUST NOT imply unrestricted redistribution, current status,
canonical knowledge, or permission for reuse. An official file required for
deterministic development or verification MUST NOT be removed until an
alternative deterministic retrieval workflow is implemented, documented, and
verified under the applicable source, architecture, and release authorities.

## Amendment, Supersession, and Exception Governance

### Amendment Authority

Only the repository owner acting with the competent knowledge-governance
authority MAY approve a constitutional amendment. An amendment affecting
architecture, Runtime, frozen components, source rights, regulation, security,
or publication MUST also receive every separately competent approval; knowledge
governance approval MUST NOT substitute for them.

### Amendment Procedure

A proposed amendment MUST identify its sponsor, rationale, affected clauses,
authority basis, impact, conflicts, migration implications, and required
reviewers. It MUST receive documented review, explicit approval, a new version,
an effective date, and an auditable change record before taking effect. Editorial
corrections MAY retain the version only when they change no normative meaning.

### Supersession Rules

A superseding Constitution MUST identify the version superseded, preserve the
prior text and decision history, define the effective boundary, and provide
migration or disposition for affected subordinate standards. Silence, deletion,
repository movement, or a conflicting KAS MUST NOT supersede this Constitution.
Subordinate standards MUST be reconciled or marked pending; they MUST NOT be
retroactively rewritten to conceal the former rule.

### Exception Governance

An exception MUST be explicit, justified, scoped, time-bounded where applicable,
approved by every competent authority, and recorded with risks, compensating
controls, review date, and disposition. An exception MUST NOT silently become
precedent, amend this Constitution, bypass Design Freeze, waive law or source
rights, or authorize Runtime, schema, API, publication, diagnosis,
recommendation, inference, regulation, or data creation outside its approved
scope.

## Relationship to KAS-001

This Constitution defines the durable authority, boundaries, and amendment rules
for all knowledge governance. [KAS-001](../KAS-001-knowledge-authoring-principles.md)
is a subordinate operational standard that applies those constitutional rules to
authoring and review. KAS-001 MUST conform to this Constitution and MUST NOT be
described as the Constitution, amend it, or supersede it.
