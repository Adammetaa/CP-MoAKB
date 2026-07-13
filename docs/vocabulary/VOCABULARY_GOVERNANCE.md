# Vocabulary Governance

## Governance objective

Vocabulary governance ensures that future labels and definitions are understandable, consistent, multilingual-ready, sourced, reviewable, and change-controlled. It governs **how CP-MoAKB speaks about a concept**, not whether a domain assertion is true.

## Architecture rules

1. Vocabulary MUST reference stable governed identities and MUST NOT create identity from a label.
2. Vocabulary MUST NOT redefine ontology concepts or relationships.
3. Vocabulary MUST NOT substitute a term definition for evidence supporting a scientific assertion.
4. Vocabulary MUST NOT establish legal permission, regulatory status, label requirements, safety, diagnosis, efficacy, or recommendation validity.
5. Preferred labels are scoped by language, script, audience, region, and validity; they are not globally unique truth labels.
6. Synonym and translation decisions MUST be reviewed and retain provenance; spelling equality is insufficient.
7. Ambiguity, homonymy, uncertainty, disagreement, and missing evidence MUST remain visible.
8. Vocabulary records and releases MUST be versioned without changing stable concept identity silently.
9. External terminology remains owned by its source authority and is connected through reviewed mappings, not copied ownership.
10. No automated component may accept a term, merge concepts, approve a regulatory meaning, and publish a release without separated human governance.

## Conceptual governance roles

| Role | Responsibility |
| --- | --- |
| Vocabulary Steward | Coordinates proposals, completeness, workflow, audit records, and releases. |
| Terminology Reviewer | Reviews clarity, lexical relationships, usage, consistency, ambiguity, and style. |
| Language Reviewer | Reviews language, script, translation, transliteration, spelling, and cultural/regional suitability. |
| Domain Reviewer | Reviews domain meaning, scope, category, scientific-name context, and conceptual distinctions. |
| Evidence Reviewer | Reviews source/evidence sufficiency and provenance for definitions and term relationships. |
| Regulatory Reviewer | Reviews terminology that could be interpreted as jurisdictional, legal, label, registration, or safety language. |
| Architecture Governor | Reviews cross-domain consistency and boundaries with ontology, identity, evidence, and technology-neutral architecture. |
| Release Manager | Publishes approved vocabulary releases independently from software, ontology, and dataset releases. |

These roles are conceptual and are not assumed to be staffed. One person MAY hold multiple roles only under a future conflict-of-interest and separation-of-authority policy; the required review perspectives must still be explicit.

## Review workflow

```text
Draft
→ Terminology Review
→ Domain Review
→ Architecture Review
→ Accepted
→ Published
```

Language, evidence, regulatory, privacy, or other specialist review is inserted whenever applicable. A failed gate returns the proposal to Draft or records Rejected/Withdrawn status with rationale. `Accepted` is a vocabulary workflow decision, not ADR acceptance, scientific confirmation, or authorization to publish a dataset. `Published` means included in a governed vocabulary release, not that its definition is universally true.

## Governance artifacts

Future governance SHOULD retain, without prescribing storage:

- vocabulary scope and owning authority;
- term proposal and stable concept reference;
- proposed labels, definition, notes, language/script, category, and status;
- sources, evidence, provenance, and applicable external mappings;
- reviewer roles, decisions, dates, comments, conflicts, and unresolved questions;
- change request, impact assessment, migration guidance, and supersession links; and
- release decision, version, included changes, quality results, and known limitations.

This list is a conceptual record expectation, not a production template or dataset.

## Conflict and escalation

Terminology disagreements MUST preserve each proposal and rationale. Domain meaning conflicts go to qualified Domain Review; identity conflicts follow identifier governance; source/evidence conflicts follow evidence governance; legal or label ambiguity goes to Regulatory Review; cross-domain boundary conflicts go to Architecture Review. Release is deferred when a material conflict lacks the required authority or evidence.

## Current IRAC boundary

The repository's existing IRAC terms are official-source content within a frozen implementation and canonical baseline. This governance framework does not rename, normalize, correct, remap, or claim stewardship over IRAC terminology. Any future vocabulary treatment of IRAC content requires separate source, license, architecture, data, and release approval.
