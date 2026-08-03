# Question Bank Concept Model

Status: Active

Version: 1.0

## Reading Rule

These are conceptual classes, not schemas, fields, runtime types, or additions
to the canonical Knowledge Object catalog. Permitted relationships are explicit
human-authored associations and never inferred links.

## Question Bank

- **Definition:** a governed collection architecture for reusable Question Patterns.
- **Purpose:** support consistent inquiry while preserving human choice and review.
- **Inclusion boundary:** patterns, classifications, relationships, reviews, and lifecycle context.
- **Exclusion boundary:** production dataset, form, decision tree, or selection engine.
- **Permitted relationships:** organizes patterns and records governance context.
- **Prohibited interpretations:** an executable questionnaire or diagnostic model.
- **Lifecycle relevance:** its architecture may be revised under governance.
- **Review implications:** coverage does not imply completeness or authority to use.
- **Future extension considerations:** localized and domain collections remain subordinate.

## Question Pattern

- **Definition:** reusable semantic and wording guidance for authoring a neutral question.
- **Purpose:** make intent, scope, applicability, response expectation, and limits reviewable.
- **Inclusion boundary:** abstract pattern content and governed relationships.
- **Exclusion boundary:** rendered instance, gap, Observation, need, Evidence,
  Claim, Hypothesis, Diagnosis, or Recommendation.
- **Permitted relationships:** expresses intent, has scope, has conditions, expects
  a response type, references a need, and may have follow-ups.
- **Prohibited interpretations:** automatically selected question or asserted answer.
- **Lifecycle relevance:** may be proposed, reviewed, approved, deprecated, replaced,
  withdrawn, or rejected.
- **Review implications:** every contextualized instance needs independent review.
- **Future extension considerations:** rendering and localization preserve semantics.

## Question Intent

- **Definition:** the neutral investigative purpose a pattern is designed to serve.
- **Purpose:** explain why a question may be relevant to an Information Gap.
- **Inclusion boundary:** one or more declared inquiry purposes from the governed taxonomy.
- **Exclusion boundary:** diagnosis target, preferred answer, or workflow command.
- **Permitted relationships:** classifies patterns and relates to gaps.
- **Prohibited interpretations:** intent automatically determines wording or use.
- **Lifecycle relevance:** classifications may be revised with rationale.
- **Review implications:** reviewers test fit, neutrality, and ambiguity.
- **Future extension considerations:** new intents require non-overlap review.

## Question Scope

- **Definition:** the conceptual boundary within which a pattern seeks information.
- **Purpose:** prevent context leakage and overgeneralization.
- **Inclusion boundary:** case, observation, structure, specimen, site, field,
  temporal, management, environmental, provenance, or review scope.
- **Exclusion boundary:** database filter, authorization scope, or crop assumption.
- **Permitted relationships:** bounds patterns, conditions, and expected responses.
- **Prohibited interpretations:** broader truth beyond the declared scope.
- **Lifecycle relevance:** scope may be refined without silently changing intent.
- **Review implications:** reviewers verify adequate and non-overlapping bounds.
- **Future extension considerations:** domain scopes remain mappings, not core replacements.

## Applicability Condition

- **Definition:** an authored statement of when a pattern may be considered relevant.
- **Purpose:** expose contextual fit before human selection.
- **Inclusion boundary:** traceable case, gap, observation, or review circumstances.
- **Exclusion boundary:** executable predicate or automatic trigger.
- **Permitted relationships:** applies to a pattern and concerns a scope or gap.
- **Prohibited interpretations:** satisfaction means the question must be asked.
- **Lifecycle relevance:** may change with reviewed knowledge or usage findings.
- **Review implications:** relevance, safety, neutrality, and authority are assessed.
- **Future extension considerations:** implementations may display but not infer it.

## Trigger Condition

- **Definition:** an explicitly authored condition supporting possible pattern use.
- **Purpose:** record why a human might consider a pattern at a given point.
- **Inclusion boundary:** reviewable contextual signals and unresolved requirements.
- **Exclusion boundary:** event handler, rule, automatic selector, or branch.
- **Permitted relationships:** concerns a pattern, gap, state, or prior response.
- **Prohibited interpretations:** occurrence executes or prioritizes a question.
- **Lifecycle relevance:** retained and revised with its rationale.
- **Review implications:** reviewers test whether it embeds inference.
- **Future extension considerations:** future automation requires separate authority.

## Exclusion Condition

- **Definition:** an authored circumstance in which a pattern should not be used.
- **Purpose:** prevent irrelevant, duplicative, unsafe, misleading, or out-of-scope use.
- **Inclusion boundary:** explicit contextual, evidentiary, safety, duplication, and scope limits.
- **Exclusion boundary:** hidden suppression rule or diagnosis-based gate.
- **Permitted relationships:** limits a pattern for a declared scope.
- **Prohibited interpretations:** proof that another pattern is correct.
- **Lifecycle relevance:** may be added or revised after review findings.
- **Review implications:** exclusions must be visible and not erase unresolved gaps.
- **Future extension considerations:** local safety requirements need proper authority.

## Expected Response Type

- **Definition:** the kind of response a pattern requests.
- **Purpose:** make answer expectations clear without supplying or interpreting an answer.
- **Inclusion boundary:** descriptive, categorical, quantitative, temporal, spatial,
  material, documentary, or judgment response forms.
- **Exclusion boundary:** actual response, Observation, Evidence, or truth status.
- **Permitted relationships:** is expected by a pattern and bounded by constraints.
- **Prohibited interpretations:** a response of that type is valid, true, or sufficient.
- **Lifecycle relevance:** may be revised when pattern meaning is preserved.
- **Review implications:** reviewers test fit and allowance for uncertainty.
- **Future extension considerations:** interface controls may not redefine meaning.

## Response Constraint

- **Definition:** a reviewed semantic limit on acceptable response form or context.
- **Purpose:** support interpretable responses without forcing false certainty.
- **Inclusion boundary:** form, context, units, uncertainty, and explicit missing states.
- **Exclusion boundary:** validator, coercion rule, scoring, or diagnostic interpretation.
- **Permitted relationships:** constrains an expected response type for a pattern.
- **Prohibited interpretations:** nonconforming means false or absent.
- **Lifecycle relevance:** revised constraints require compatibility review.
- **Review implications:** unknown and unavailable states must remain expressible.
- **Future extension considerations:** localized units and forms preserve semantics.

## Evidence Need Reference

- **Definition:** an explicit reference from a pattern to a relevant Evidence Need concept.
- **Purpose:** preserve traceability between inquiry and separately governed evidence relevance.
- **Inclusion boundary:** the relationship and its stated purpose and scope.
- **Exclusion boundary:** Evidence Need content, Evidence Object, source, or proof.
- **Permitted relationships:** connects a pattern or response expectation to an Evidence Need.
- **Prohibited interpretations:** evidence exists, is sufficient, or follows automatically.
- **Lifecycle relevance:** references may be revised or withdrawn with history.
- **Review implications:** target, relevance, and boundary must be verified.
- **Future extension considerations:** implementation identifiers remain undefined.

## Follow-up Relationship

- **Definition:** an authored semantic relationship between question patterns.
- **Purpose:** explain how one pattern may clarify, refine, verify, expand, resolve
  conflict, request missing context, or request additional evidence.
- **Inclusion boundary:** relationship meaning, rationale, scope, and review.
- **Exclusion boundary:** automatic branch, sequence, priority, or decision tree.
- **Permitted relationships:** links reviewed patterns using a declared follow-up meaning.
- **Prohibited interpretations:** an answer selects or executes the next pattern.
- **Lifecycle relevance:** may be revised, deprecated, or withdrawn independently.
- **Review implications:** reviewers reject hidden logic and diagnostic paths.
- **Future extension considerations:** visual links must not imply execution.

## Review State

- **Definition:** the declared status of accountable human review.
- **Purpose:** distinguish review progress, outcome, scope, and limitations.
- **Inclusion boundary:** reviewer, rationale, timing, dissent, and bounded disposition.
- **Exclusion boundary:** truth, publication, lifecycle, or diagnostic status.
- **Permitted relationships:** qualifies any pattern architecture entity.
- **Prohibited interpretations:** approval triggers publication or use.
- **Lifecycle relevance:** review history is preserved through change.
- **Review implications:** silence and workflow completion are not approval.
- **Future extension considerations:** system labels must preserve governance meaning.

## Lifecycle State

- **Definition:** the governed standing of a pattern through authoring and maintenance.
- **Purpose:** distinguish proposal, review, approval, eligibility, and retirement outcomes.
- **Inclusion boundary:** proposed, under review, approved, publication eligible,
  deprecated, replaced, withdrawn, and rejected.
- **Exclusion boundary:** runtime availability, automatic transition, or truth status.
- **Permitted relationships:** qualifies a pattern and records replacement where applicable.
- **Prohibited interpretations:** state order guarantees or executes transition.
- **Lifecycle relevance:** every change is an explicit authorized decision with history.
- **Review implications:** approval and publication eligibility remain separate.
- **Future extension considerations:** publication itself remains separately governed.
