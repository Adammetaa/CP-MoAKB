# Question Ontology

## Purpose and boundary

The Question Ontology defines how a future system may represent questions that seek missing evidence, reduce diagnostic uncertainty, establish context, or identify a safety/regulatory gate. It does not define a chatbot, dialogue policy, user interface, automatic diagnosis, or recommendation engine.

## Core concepts

| Concept | Meaning and important relationships |
| --- | --- |
| Question | A stable, versioned prompt concept with intent, target, applicability, wording variants, and review status. |
| QuestionIntent | The evidence or decision-boundary purpose: identify, measure, verify, disambiguate, establish context, screen safety, or confirm jurisdiction/time. |
| TargetConcept | The entity, property, relationship, hypothesis, missing-evidence item, or gate the question addresses. |
| ExpectedAnswerType | A governed type such as boolean, category, quantity, date/time, location/context, text, image, specimen/result, or concept reference. |
| Unit | The required/allowed measurement unit and quantity kind for a quantitative answer. |
| AnswerOption | A versioned controlled choice with stable identity, label, meaning, applicability, and optional mapping to a concept. |
| ConditionalFollowUp | A relationship from an answer condition to another question and rationale; cycles and termination require future validation. |
| RequirementLevel | Required or optional within a named workflow and reason; “required” does not authorize collection of unnecessary personal data. |
| EvidenceContribution | How an answer could support, contradict, or leave unchanged a statement/hypothesis, including method and limitations. |
| DisambiguationPurpose | Which candidate concepts or hypotheses the question is intended to distinguish and why. |
| SafetyCriticalQuestion | A question whose missing/unsafe answer triggers deferral, warning, or authoritative escalation under a future approved workflow. |
| JurisdictionQuestion | Establishes the legal geographic/authority context needed to assess a regulatory claim. |
| TemporalQuestion | Establishes observation, onset, progression, application, effective-label, or other relevant time. |
| LocationContextQuestion | Establishes only the minimum geographic/field/production context necessary, subject to privacy controls. |
| Answer | A time-, respondent/source-, case-, and question-version-bound assertion with provenance, confidence, and review status. |
| UnansweredState | Records that no answer has been supplied; it is distinct from unknown or not applicable. |

## Answer-state semantics

Future designs MUST distinguish:

- **unanswered:** no response is recorded;
- **unknown:** the respondent cannot determine the answer or the evidence is unavailable;
- **not applicable:** the question does not apply under a recorded condition; and
- **answered:** a value is recorded, possibly with uncertainty, refusal, or qualification according to its answer type.

Unknown MUST NOT be converted to “no,” zero, absence, or not applicable. Not applicable SHOULD record the rule or answer that established it. Missing required evidence remains visible and may keep a case unresolved.

## Conceptual question categories

| Category | Typical evidence sought |
| --- | --- |
| Identification | Taxonomic or product identity features, source, specimen, or verification. |
| Crop context | Crop/cultivar/planting identity, production system, field context, and host relevance. |
| Growth stage | Crop, weed, insect, or disease stage using a cited scale or descriptive observation. |
| Symptom distribution | Affected organs, within-plant/field pattern, incidence, severity, and measurement method. |
| Onset and progression | First observation, rate/direction of change, sequence, and event relationships. |
| Field history | Prior crops, inputs, disturbances, cases, and management events with provenance. |
| Weather/environment | Relevant observed/measured conditions, source, location, time, and uncertainty. |
| Treatment history | Exact product/ingredient if known, label/use details, timing, method, and response; response does not prove diagnosis or resistance. |
| Organism evidence | Organisms, signs, samples, counts, stages, images, and confirmation methods. |
| Safety | People/receptors, exposure route/scenario, current label, protective requirements, and emergency gates. |
| Regulation | Product, crop, target, use pattern, jurisdiction, authority, label version, and effective time. |
| Economics | Dated local units, cost/value, threshold inputs, loss assumptions, and feasibility. |
| Application method | Equipment, calibration, placement, weather, timing, coverage, operator, and constraints. |
| Verification | Specimen, test, expert review, method suitability, result, quality, and limitations. |

Categories organize intent; they do not determine evidence quality or authorize a decision.

## Connection to missing evidence and uncertainty

Each question SHOULD link to one or more MissingEvidence items in a diagnostic case, the candidates it can discriminate, and the expected effect of possible answers. The link is a reasoned EvidenceContribution, not a guarantee that an answer changes confidence.

A future selection process SHOULD prioritize questions by diagnostic discrimination, safety/regulatory criticality, answer feasibility, burden, privacy, time sensitivity, and the consequences of remaining uncertain. It MUST show why a question is asked, permit unknown where truthful, and avoid collecting personal or precise-location data beyond an approved purpose.

Answers are observations or asserted statements. A human/process may interpret them into findings; the answers MUST NOT directly become diagnosis, evidence strength, regulation, or recommendation without the appropriate review layer. Safety-critical or jurisdictional uncertainty MAY block further action pending an authoritative source or qualified reviewer.

## Multilingual and lifecycle constraints

Question identity is independent of wording. Thai and English prompts, help text, answer labels, and synonyms SHOULD be governed language variants with cultural/domain review; translation MUST preserve unit, intent, and answer semantics. Version changes that alter meaning create a new version and retain prior case interpretation.

Questions and answers tied to field cases remain in the Private Field Vault or governed case environment until privacy, consent, provenance, and review gates permit promotion. This ontology does not authorize collecting or committing field answers to Git.
