# Diagnostic Ontology

## Purpose and boundary

The Diagnostic Ontology defines a reviewable chain from field context to a diagnostic conclusion while preserving observations, interpretations, hypotheses, evidence, uncertainty, and possible next actions as different concepts. It is central to future explainability, but it does not implement automated diagnosis and does not authorize agronomic, safety, or regulatory action.

## Conceptual diagnostic chain

```text
Field context
→ Observation
→ Finding
→ Symptom or sign
→ Candidate causes
→ Evidence for and against
→ Differential diagnosis
→ Confidence
→ Verification requirement
→ Diagnostic conclusion
→ Possible next action
```

Each arrow represents a typed, attributable transition, not automatic certainty. The chain may branch, loop to collect missing evidence, retain multiple candidates, or end unresolved. A PossibleNextAction can be further observation, a question, sampling, expert review, a verification method, monitoring, or deferral; it is not necessarily treatment or a recommendation.

## Core concepts

| Concept | Meaning and important relationships |
| --- | --- |
| Case | A governed container for a diagnostic investigation, its context, observations, reasoning history, privacy class, and review state. |
| FieldContext | Crop/planting, field, production system, location precision, season, environment, management history, and relevant times. |
| Observation | A time-, place-, observer-, and method-bound record of what was seen, measured, imaged, or reported. |
| Finding | A normalized, reviewable representation derived from one or more observations, retaining derivation and original values. |
| Symptom | A host response or abnormal state recorded as a finding; it may have multiple causes. |
| Sign | A finding interpreted as more direct evidence of an organism/agent, with identity and method uncertainty. |
| Measurement | A value with quantity kind, unit, method, instrument/calibration where relevant, uncertainty, and time. |
| ImageDerivedObservation | A human- or machine-derived annotation/measurement linked to the original private image, region, method/version, reviewer, and confidence. |
| FieldHistoryStatement | An asserted past event or condition with source/observer, time precision, confidence, and review status. |
| CandidateDiagnosis | A hypothesis that a cause or disease explains case findings, with applicability scope. |
| DifferentialDiagnosis | A versioned comparison of candidates using supporting, contradicting, and missing evidence plus alternative explanations. |
| SupportingEvidence | Evidence whose stated relevance favors a specific hypothesis; strength and independence remain explicit. |
| ContradictingEvidence | Evidence whose stated relevance weighs against a specific hypothesis; it is preserved, not discarded. |
| MissingEvidence | Information required or useful for discrimination/verification but not available, including why it is missing. |
| Confidence | A candidate- or conclusion-specific assessment with method/rationale and uncertainty; distinct from evidence level. |
| DiagnosticStatus | A conceptual workflow state describing assessment maturity, not a machine truth label. |
| VerificationMethod | A defined field, expert, sampling, laboratory, or other method with suitability, specimen/input, limitations, and authority. |
| VerificationRequirement | What must be checked, by which acceptable method, before a candidate can reach a specified status or action boundary. |
| DiagnosticConclusion | A reviewed conclusion selecting, ranking, rejecting, or leaving candidates unresolved with scope and rationale. |
| ConfirmedDiagnosis | A conclusion that meets a declared confirmation criterion; evidence, method, scope, and remaining limitations persist. |
| UnresolvedCase | A case closed or paused without sufficient evidence for a supported conclusion. |
| PossibleNextAction | A non-binding option generated from missing evidence or case status, subject to separate governance. |

## Conceptual statuses

| Status | Meaning |
| --- | --- |
| unassessed | Evidence has been received but no diagnostic review has occurred. |
| preliminary | An initial interpretation exists with material checks outstanding. |
| differential | Multiple candidate causes are being compared explicitly. |
| probable | One candidate is better supported within stated confidence, but the confirmation criterion is not met. |
| confirmed | A declared, appropriate verification criterion has been met and reviewed. |
| rejected | Evidence is sufficient to reject a candidate within the stated scope. |
| unresolved | Available evidence cannot support or reject candidates sufficiently. |

These are conceptual workflow examples, not automated outputs, probabilities, or agronomic approvals. Future governance must define transition criteria, authorized reviewers, reversibility, and domain-specific confirmation standards. A status change MUST retain who/what changed it, when, why, and the evidence set used.

## Reasoning and evidence rules

- **Observation** records input; it MUST preserve original wording/value and provenance.
- **Interpretation** assigns meaning to input through a named person/process and remains revisable.
- **Hypothesis** proposes an explanation and competes with alternatives.
- **Evidence** supports or contradicts a specific statement within scope; it is not the hypothesis itself.
- **Conclusion** records the reviewed outcome of reasoning with status, confidence, evidence, and limitations.
- **Recommendation** is a separate downstream decision constrained by regulation, safety, IPM, economics, and operations.

Confidence MUST be recorded per candidate and conclusion. It SHOULD consider evidence relevance, quality, independence, consistency, missing discriminators, alternative explanations, and applicability. It MUST NOT conceal contradictions in a single unexplained score.

Image similarity alone MUST NOT establish identity or cause. Co-occurrence MUST NOT establish causality. Treatment outcome MUST NOT by itself confirm the original diagnosis, and treatment failure MUST NOT by itself prove resistance. A confirmed diagnosis does not automatically establish economic significance, legal permission, product suitability, safety, or recommendation.

## Privacy and traceability

Raw cases and media remain in the Private Field Vault. Structured diagnostic statements may progress only through the governed field-knowledge lifecycle. Published or curated conclusions MUST reference privacy-safe case/evidence records, transformations, reviewer decisions, and applicable limitations without exposing personal, proprietary, precise-location, or unlicensed material.

## Cross-domain connections

The case references crop/organ context and may compare weed, insect, disease, abiotic, management, or mixed causes. [Question Ontology](QUESTION_ONTOLOGY.md) connects MissingEvidence to targeted questions. Safety- or regulation-critical uncertainty can require immediate deferral or authoritative escalation. Only a confirmed or sufficiently supported problem may be considered by a future recommendation process, and every downstream decision must retain the diagnostic version and evidence used.
