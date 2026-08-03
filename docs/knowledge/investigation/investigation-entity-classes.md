# Investigation Entity Classes

Status: Active

Version: 1.0

## Reading Rule

The following are conceptual classes, not canonical Knowledge Object additions
or implementation types. “Permitted” means a relationship may be explicitly
authored; it never means that the relationship can be inferred.

## Investigation

- **Definition:** the governed structure coordinating a bounded inquiry.
- **Purpose:** preserve scope, traceability, competing explanations, and review.
- **Inclusion boundary:** cases, focuses, gaps, questions, needs, candidates,
  comparisons, findings, and review context.
- **Exclusion boundary:** diagnosis, recommendation, decision, and execution.
- **Permitted relationships:** investigates a subject, organizes cases, records
  findings, and is reviewed by accountable humans.
- **Prohibited interpretations:** an automated reasoning engine or proof.
- **Lifecycle relevance:** may be scoped, revised, reviewed, closed, or reopened.
- **Review implications:** scope, basis, unresolved matters, and conflicts remain visible.
- **Future extension considerations:** localized and multi-crop views may extend
  presentation without changing meaning.

## Investigation Case

- **Definition:** a bounded unit of inquiry concerning a declared situation.
- **Purpose:** keep observations and investigation work context-specific.
- **Inclusion boundary:** explicit subject, temporal and contextual bounds, and
  related investigation content.
- **Exclusion boundary:** a patient, farm, crop, diagnosis, or case-management UI.
- **Permitted relationships:** belongs to an Investigation, concerns a subject,
  has focuses, and records findings.
- **Prohibited interpretations:** identity equivalence or diagnostic episode.
- **Lifecycle relevance:** may remain active, unresolved, closed, or reopened.
- **Review implications:** reviewers verify scope and prevent cross-case leakage.
- **Future extension considerations:** cases may support different domains without
  crop-specific structural fields.

## Investigation Focus

- **Definition:** the explicitly bounded aspect selected for inquiry.
- **Purpose:** prevent questions and comparisons from drifting beyond authority.
- **Inclusion boundary:** a neutral phenomenon, location, interval, process, or
  uncertainty relevant to recorded observations.
- **Exclusion boundary:** a preferred cause, diagnosis, or desired recommendation.
- **Permitted relationships:** concerns observations, identifies gaps, and frames questions.
- **Prohibited interpretations:** evidence that the selected concern is causal.
- **Lifecycle relevance:** may be refined or replaced with rationale preserved.
- **Review implications:** reviewers test neutrality and adequate bounds.
- **Future extension considerations:** governed domain concepts may label a focus.

## Information State

- **Definition:** the explicitly assessed epistemic status of particular information.
- **Purpose:** distinguish what is known, captured, missing, disputed, or under review.
- **Inclusion boundary:** one declared information requirement in one context.
- **Exclusion boundary:** confidence score, truth probability, or diagnosis.
- **Permitted relationships:** describes information, is based on traceable material,
  may identify a gap, and may conflict with another assessment.
- **Prohibited interpretations:** equivalent meanings among distinct states.
- **Lifecycle relevance:** may change only through recorded human assessment.
- **Review implications:** basis, assessor, scope, and prior states remain visible.
- **Future extension considerations:** translations may not merge state meanings.

## Information Gap

- **Definition:** a missing or unresolved requirement for investigation.
- **Purpose:** make incompleteness explicit and actionable as inquiry.
- **Inclusion boundary:** unavailable, unknown, conflicting, insufficiently bounded,
  or pending information relevant to the focus.
- **Exclusion boundary:** diagnosis, cause, severity, recommendation, treatment need,
  or regulatory meaning.
- **Permitted relationships:** is identified from a state, concerns a focus, raises
  questions, and requires evidence.
- **Prohibited interpretations:** negative observation or evidence of absence.
- **Lifecycle relevance:** may be open, partly addressed, unresolved, or reviewed.
- **Review implications:** closure requires explicit rationale, not field completion.
- **Future extension considerations:** domain-specific gap kinds remain subordinate.

## Investigation Question

- **Definition:** a neutral request for information relevant to a gap or comparison.
- **Purpose:** state what a reviewer seeks without presupposing an answer.
- **Inclusion boundary:** clarification, localization, measurement, count, temporal
  history, spatial distribution, specimen capture, management history,
  environmental context, comparison, or verification.
- **Exclusion boundary:** Observation, Claim, Evidence, Hypothesis, Diagnosis, or Recommendation.
- **Permitted relationships:** is raised by a gap, concerns a focus, and requires evidence.
- **Prohibited interpretations:** assertion, leading diagnostic test, or forced choice.
- **Lifecycle relevance:** may be revised, answered descriptively, deferred, or retired.
- **Review implications:** reviewers test neutrality, relevance, and answerability.
- **Future extension considerations:** translation preserves neutrality and intent.

## Evidence Need

- **Definition:** an authored description of evidence relevant to resolving a gap
  or comparing candidates.
- **Purpose:** explain what material and context would bear on a precise question.
- **Inclusion boundary:** relevance, scope, provenance, method, context, and quality
  characteristics needed for assessment.
- **Exclusion boundary:** the Evidence Object, proof, data request schema, or collection command.
- **Permitted relationships:** is required by a gap or question, concerns a
  criterion, and may later be unresolved or addressed by assessed evidence.
- **Prohibited interpretations:** evidence exists, is sufficient, or proves a candidate.
- **Lifecycle relevance:** may be open, revised, partly addressed, or retired with rationale.
- **Review implications:** reviewers assess relevance separately from obtained material.
- **Future extension considerations:** methods may vary by crop or workflow without
  altering the class.

## Hypothesis Candidate

- **Definition:** an explicitly authored, provisional explanation considered in inquiry.
- **Purpose:** make challengeable possibilities visible without asserting truth.
- **Inclusion boundary:** traceable basis in observations and knowledge, stated
  uncertainty, scope, and possible discriminating criteria.
- **Exclusion boundary:** automatically inferred result, Diagnosis, fact, or preferred answer.
- **Permitted relationships:** is considered by a case, based on observations and
  knowledge, grouped in a differential, and supported or challenged by assessed evidence.
- **Prohibited interpretations:** truth, diagnosis, rank, probability, or automatic conclusion.
- **Lifecycle relevance:** may coexist, be revised, challenged, retained, or explicitly rejected.
- **Review implications:** authorship, basis, alternatives, and challenges are mandatory.
- **Future extension considerations:** domain knowledge may inform candidates only
  through governed, cited, human-authored use.

## Differential Set

- **Definition:** a review structure grouping two or more plausible candidates where appropriate.
- **Purpose:** preserve competing explanations for explicit comparison.
- **Inclusion boundary:** candidates, criteria, and supporting, challenging,
  missing, and conflicting evidence records.
- **Exclusion boundary:** leaderboard, scoring model, automatic selector, or Diagnosis.
- **Permitted relationships:** groups candidates, uses criteria, records evidence
  relationships, and is reviewed by humans.
- **Prohibited interpretations:** ordering implies plausibility or first item wins.
- **Lifecycle relevance:** membership and criteria may change with preserved rationale.
- **Review implications:** comparison must expose unresolved and adverse material.
- **Future extension considerations:** visual comparison may not encode hidden ranking.

## Comparison Criterion

- **Definition:** an explicit, reviewable aspect used to compare candidates.
- **Purpose:** make the basis of differential comparison explainable.
- **Inclusion boundary:** a neutral distinction relevant to two or more candidates.
- **Exclusion boundary:** hidden score, weight, outcome, or diagnostic rule.
- **Permitted relationships:** compares candidates, requires evidence, and is
  supported, challenged, unresolved, or conflicted by assessed evidence.
- **Prohibited interpretations:** satisfaction selects or diagnoses automatically.
- **Lifecycle relevance:** may be added, revised, rejected, or marked unresolved.
- **Review implications:** relevance, neutrality, and knowledge basis are reviewed.
- **Future extension considerations:** domain criteria require separate authority.

## Investigation Finding

- **Definition:** an explicitly recorded descriptive, procedural, evidentiary, or
  comparative result of investigation work.
- **Purpose:** preserve what the investigation established within its limited role.
- **Inclusion boundary:** resolved or unresolved descriptions with basis and scope.
- **Exclusion boundary:** automatic Claim, Diagnosis, Recommendation, or Decision.
- **Permitted relationships:** is recorded by a case, concerns a focus, is based on
  reviewed material, and has a Review State.
- **Prohibited interpretations:** downstream authority or automatic promotion.
- **Lifecycle relevance:** may be drafted, revised, reviewed, challenged, or superseded.
- **Review implications:** category, basis, limits, dissent, and status remain explicit.
- **Future extension considerations:** downstream use needs a separate governed act.

## Review State

- **Definition:** the declared status of human review for investigation content.
- **Purpose:** distinguish unreviewed, pending, accepted-for-purpose, challenged,
  rejected, or otherwise governed review conditions.
- **Inclusion boundary:** reviewer responsibility, scope, rationale, and timing.
- **Exclusion boundary:** truth status, evidence level, diagnosis, or publication approval.
- **Permitted relationships:** qualifies any investigation entity and identifies reviewers.
- **Prohibited interpretations:** approval promotes content or resolves every gap.
- **Lifecycle relevance:** transitions require explicit authorized review and history.
- **Review implications:** conflicts, recusals, dissent, and limitations remain visible.
- **Future extension considerations:** workflow-specific labels must map without
  weakening the conceptual distinction.
