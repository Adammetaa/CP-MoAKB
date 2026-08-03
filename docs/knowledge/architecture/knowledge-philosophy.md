# Knowledge Philosophy

Status: Active

Version: 1.0

## Purpose

Define the epistemic categories that the Knowledge Asset Architecture MUST keep
separate. These definitions describe governance meaning, not implementation
types, record fields, or storage structures.

## Authority and Scope

This philosophy is subordinate to the Knowledge Constitution and applies the
Constitution's evidence-before-knowledge, epistemic-layer, scientific-neutrality,
conflict-preservation, and non-inference boundaries. KAS remains authoritative
for authoring responsibilities; KGS remains authoritative for people and
decisions. ADR-005 remains authoritative for conceptual-layer separation.

## Definitions

### Knowledge

**Knowledge** is reviewed, scoped, versioned meaning whose exact assertions,
definitions, or relationships have sufficient evidence, provenance, authority,
limitations, and lifecycle context for a declared purpose. Knowledge MUST state
what it means, where it applies, what supports it, what conflicts with it, and
which exact version has which governance status.

Knowledge is not made true by being stored, rendered, validated, popular,
official-looking, accepted by software, or displayed in Explorer. Published
knowledge MUST remain bounded by its evidence, authority, time, jurisdiction,
uncertainty, and stated exclusions.

### What Is Not Knowledge

Unreviewed information, raw source material, an observation, a citation alone,
an unsupported statement, a candidate, a reviewer comment, a search result, a
translation, an interface view, a generated export, and an executable validation
result are not knowledge merely because they exist. Diagnosis, recommendation,
regulatory permission, and action MUST remain separate epistemic and governance
categories and MUST NOT be implied by a Knowledge Asset.

### Information

**Information** is communicated or recorded content that may be relevant to a
question. It MAY be an input to authoring or review, but it has not necessarily
received claim-scoped evidence, authority, provenance, or acceptance review.
Information MUST NOT be promoted to knowledge by copying, formatting, indexing,
or repetition.

### Evidence

**Evidence** is traceable material evaluated for how it supports, limits,
contradicts, or fails to resolve a specific claim within a declared context.
Evidence is not the claim and is not automatically knowledge. Evidence status
MUST preserve source, method, provenance, applicability, limitations, conflicts,
rights, and review disposition under KAS-003 and Source Policy.

### Claim

**Claim** is a bounded proposition capable of being supported, contradicted,
qualified, disputed, accepted, superseded, or retired. A claim MUST distinguish
the source's statement from CP-MoAKB's review decision. A candidate claim is not
accepted knowledge; an accepted claim is not automatically published.

### Concept

**Concept** is a governed unit of meaning with identity independent of its human
labels. A concept establishes what is meant and excluded; it does not establish
that every statement about the referent is true. Concepts, observations,
instances, evidence items, claims, and authorities MUST NOT collapse into one
identity category.

### Relationship

**Relationship** is a separately reviewable assertion connecting identified
subjects and objects through declared meaning, direction, context, authority,
evidence, and lifecycle. A relationship MUST NOT imply transitivity, causation,
equivalence, diagnosis, recommendation, or inference unless those meanings are
separately and explicitly governed. KAS-006 remains authoritative.

### Representation

**Representation** is a purpose- and audience-specific expression of an exact
Knowledge Asset version. Text, a screen, a machine projection, a translation,
an export, or a future service response MAY be a representation. Representation
MUST NOT create a second knowledge identity or silently alter meaning.

### Package

**Knowledge Package** is a governed assembly that declares an exact set of
Knowledge Asset versions and the reviewable context needed for a stated purpose.
A package is not a database, folder, archive format, release mechanism, or
unbounded collection. Package acceptance and package publication are separate.

### Publication

**Publication** is the explicitly authorized act of making an exact governed
knowledge release available to a declared audience through a declared channel.
Repository presence, authoring, review completion, acceptance, validation,
packaging, rendering, building, or local commit MUST NOT constitute publication.
KGS-005 and the Publication Boundary remain authoritative.

### Version

**Version** identifies a preserved state of meaning or governance on one named
version axis. Version is not merely a timestamp or filename. Material meaning
change MUST create a new Knowledge Version; changes to package membership,
representation, publication, review, or authority MUST use their own respective
version axes and MUST NOT masquerade as a Knowledge Version.

### Identity

**Identity** is the governed continuity of a referent across labels, locations,
representations, technologies, and time. Identity MUST have an owning authority,
category, namespace scope, lifecycle, non-reuse rule, and auditable mappings.
ADR-006 remains authoritative and this architecture selects no physical syntax.

### Authority

**Authority** is the competent, explicitly scoped basis by which a person, body,
source, or governance instrument may assert, review, decide, own, or publish
within a defined boundary. Authority is claim-, role-, jurisdiction-, version-,
time-, and action-sensitive. Official status or prestige MUST NOT establish
universal truth or authority beyond scope.

### Provenance

**Provenance** is the connected account of origin, custody, source version,
authoring or transformation, evidence selection, review, decision, and later
change. Provenance MUST permit reconstruction without converting a history of
actions into proof of scientific correctness.

### Lifecycle

**Lifecycle** is the governed progression and disposition of a separately
identified object over time. Candidate, review, acceptance, publication,
deprecation, supersession, retirement, retraction, withdrawal, and archive
meanings MUST remain distinct. Lifecycle transition MUST preserve prior states,
authority, rationale, exact versions, and audit history under KAS-007 and KGS.

## Category Invariants

- Information MAY inform evidence assessment; it MUST NOT become evidence
  without claim-specific evaluation.
- Evidence MAY support a claim; it MUST NOT silently become the claim.
- Review MAY accept an exact claim version; it MUST NOT publish it.
- Publication MAY expose an accepted version; it MUST NOT make that version
  universal, timeless, diagnostic, legally permissive, or recommended.
- Representation MAY change presentation; it MUST NOT change identity or
  accepted meaning.
- A package MAY assemble assets; it MUST NOT own the identities or rewrite the
  histories of the assets it includes.

## Examples

A fictional source reports a proposition about **Concept Lumen** in **Context
North**. A reviewer treats the report as information, evaluates a cited segment
as evidence for **Claim Cinder**, records a limitation, and accepts one exact
claim version. A later Explorer card is a representation of that accepted
version. None of those steps creates diagnosis, recommendation, or publication.

## Non-examples

- Calling a source document knowledge because its issuer is official.
- Treating a translated label as a new concept.
- Treating a successful validator as scientific acceptance.
- Treating an accepted package as publicly released.
- Treating two screens as two independent bodies of knowledge.

## Future Work

Future standards MAY refine governance procedures for these categories but MUST
preserve their separation. Any implementation mapping requires separate
architecture authority and MUST demonstrate semantic equivalence without turning
these definitions into an accidental schema.
