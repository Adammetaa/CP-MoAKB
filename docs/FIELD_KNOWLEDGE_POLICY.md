# Field Knowledge Policy

## Purpose

This policy defines how future field knowledge may be collected, protected, structured, reviewed, promoted, corrected, and published. It does not authorize current data collection or create a production dataset.

**Every field observation is a potential knowledge asset, but not every observation is validated knowledge.**

Field records are Observation concepts, distinct from scientific evidence, regulatory facts, expert interpretation, and recommendations. See [Conceptual Domain Model](DOMAIN_MODEL.md) and [ADR-002](ARCHITECTURE_DECISIONS/ADR-002-separate-observation-evidence-and-recommendation.md).

## Minimum metadata

A useful structured field observation should record, when available and lawful:

- observation identifier and provenance;
- observer role or governed pseudonymous identity;
- crop and variety;
- age or growth stage;
- observation date and relevant event dates;
- approximate location at the minimum precision necessary;
- Field identifier using farm and farmer anonymization;
- affected plant part;
- symptom in original wording and structured terms;
- direct Sign, if any;
- field and within-plant distribution pattern;
- severity or measurement with method and unit;
- management history and relevant inputs;
- weather and environmental context;
- original images and capture metadata;
- suspected cause, clearly marked as interpretation;
- confirmation method and result, if performed;
- intervention, if any;
- follow-up timing and result; and
- review status, reviewer identity, and review date.

Missing values remain explicit. They must not be invented or hidden through default values.

## Image consent, ownership, and provenance

Before collecting or publishing images, record consent, ownership or authorized-use basis, permitted uses, retention conditions, and withdrawal process where applicable. Remove or protect unnecessary personal identifiers, faces, documents, vehicle identifiers, precise coordinates, and other sensitive content.

Original images must retain provenance, including capture time when permitted, source record, file integrity, and transformations. Crops, labels, boxes, annotations, or derived image regions must link back to the original. Derived labels must retain reviewer identity, date, method, and review status.

## Location privacy and data minimization

- Collect only the spatial precision necessary for the approved purpose.
- Separate exact coordinates from published or analytical locality where possible.
- Use access controls and aggregation for sensitive farm locations.
- Minimize personal data and avoid collecting unrelated identifiers.
- Replace farm and farmer names with governed pseudonymous identifiers.
- Assess re-identification risk before sharing regional patterns or images.
- Do not publish proprietary, personal, or location-sensitive data without approval.

## Observation lifecycle

```text
raw observation
→ structured observation
→ reviewed case
→ corroborated field pattern
→ candidate knowledge assertion
→ domain approval
→ published knowledge
```

### Raw observation

The original submitted record, preserved without hidden correction. It may be incomplete, inconsistent, or unverified.

### Structured observation

The record is mapped to governed fields and candidate entity identities. Original values remain available, and transformations retain provenance.

### Reviewed case

An identified reviewer checks metadata, identity candidates, privacy, image integrity, and interpretation boundaries. Review does not automatically establish causality.

### Corroborated field pattern

Multiple sufficiently independent cases show a documented pattern under comparable conditions. Selection bias, shared sources, missing counterexamples, and geographic scope are evaluated.

### Candidate knowledge assertion

A precise, testable assertion is proposed with supporting and contradicting cases, evidence level, confidence rationale, and scope.

### Domain approval

An authorized domain reviewer evaluates the assertion against scientific, regulatory, and field evidence. Approval is versioned, attributed, and limited to a stated use.

### Published knowledge

The approved assertion is exposed with provenance, limitations, review status, version, and links to supporting and contradicting evidence. Publication never erases the underlying observations.

## Interpretation safeguards

- Observations are not automatically facts.
- Outcome after treatment does not by itself prove diagnosis.
- Absence of response does not by itself prove resistance.
- A suspected cause remains interpretation until appropriately confirmed.
- Similar images do not establish identical causes.
- Repeated reports from one source are not independent corroboration.
- Field patterns do not override current official registration or label requirements.
- Tier 4 reports cannot independently support a chemical recommendation.

## Corrections and disputes

No hidden correction of observations is allowed. Corrections create an attributed amendment that records the prior value, new value, reason, reviewer, and date. Disputed interpretations remain visible with competing evidence. Deprecation and supersession preserve historical provenance.

## Publication and access

Publication requires approval for the assertion, underlying consent and usage rights, privacy review, and appropriate aggregation. Access levels may differ for original media, precise location, farm records, reviewed cases, and published assertions. Derived datasets require separate governance and are not authorized by this sprint.

## Quality and promotion criteria

Promotion decisions should consider completeness, identity confidence, confirmation method, temporal sequence, independent corroboration, observer and reviewer competence, alternative explanations, measurement quality, contextual similarity, privacy, and conflicts of interest. A high volume of weak observations must not be presented as strong evidence by count alone.

## Relationship to future decisions

Field knowledge can help generate differential causes, discriminating questions, local monitoring priorities, and follow-up hypotheses. Any future recommendation must independently pass evidence, regulatory, label, safety, IPM, and context checks in [Decision Engine](DECISION_ENGINE.md).
