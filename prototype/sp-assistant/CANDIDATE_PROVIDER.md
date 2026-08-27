# Governed Candidate and Comparison Provider

## Purpose and boundary

The Candidate Provider connects reviewed repository knowledge to Investigation
Intelligence. It answers only: **which governed concepts are reasonable to
consider, and which governed evidence relationships can help compare them?**

The provider nominates. Step C adjudicates. Nomination is not support,
confirmation, resolution, or Diagnosis. The provider never ranks Candidates,
computes a probability, selects a product, supplies a rate, creates Guidance, or
calls OpenAI.

The runtime flow is:

```text
Authoritative Investigation Bundle
  -> versioned governed Candidate Provider
  -> nominated + explicitly authored Candidates, merged by stable concept ID
  -> existing Step C support/contradiction/missing-evidence adjudication
  -> one bounded Next Best Evidence request when available
```

## Materialized production scope

[`candidate-provider-package.json`](candidate-provider-package.json) is the
small, materialized runtime package. It does not scan the repository or parse
raw sources during each assessment. Version `1.0.0` contains only relationships
already accepted for bounded internal composition in the rice insect and rice
disease corpora:

- Brown planthopper (`CO-RIC-002/v1`): basal feeding and yellow/brown patch
  observation context;
- rice blast (`CO-RDC-001/v1`): leaf-lesion morphology context;
- rice sheath blight (`CO-RDC-002/v1`): sheath lesion, waterline, and stage
  context; and
- the source-described Akiochi root-zone disorder (`CO-RDC-012/v1`):
  tillering/root-condition context.

These are sparse rules. Unsupported stages, morphologies, environmental links,
thresholds, and treatment facts remain absent. IRAC, FRAC, HRAC, product,
manufacturer, and Thai regulatory data are not Candidate-nomination inputs in
this package.

## Provider manifest and deterministic identity

The manifest records provider ID and version, crop scope, knowledge snapshot,
authority, review state, source references, validity, supersession, and
materialization time. Loading computes a canonical SHA-256 content hash over the
package. The runtime adds `loaded_at` as operational metadata without changing
the scientific content identity.

Every nomination and comparison retains its `rule_id`, rule hash, governed
concept/claim IDs, source references, authority, review state, scope, package
version, and package content hash. Step C assessment snapshots retain the full
provider manifest. A provider-version or content-hash change changes the
combined Step C rule identity, marks the prior current assessment stale, and
creates a new revision. Historical snapshots retain the manifest used when they
were created.

## Load validation

[`candidate-provider.mjs`](candidate-provider.mjs) rejects a package when:

- a source, knowledge record, Candidate concept, comparison concept, or rule ID
  is dangling or duplicated;
- a Candidate class, relation semantic, evidence relation, authority, review
  state, or schema version is invalid;
- a rule is unreviewed or has disallowed runtime authority;
- a declared content hash does not match canonical package content; or
- a scientific package contains probability, score, Diagnosis, product, active
  ingredient, rate, or Recommendation fields.

Malformed scientific rules fail closed; they are never silently skipped.

## Nomination, identity, and User hypotheses

The provider consumes the authoritative server bundle, including server
lifecycle crop context, the authoritative `StageAssessment`, structured
morphology/spatial/water Evidence, management history, and temporal
relationships. It reuses already-present facts and does not require them to be
re-entered as separate user answers.

Provider nominations use governed `concept_id` values. Case-authored Candidates
may optionally retain the same `concept_id` and identify authorship as
`EXPLICITLY_AUTHORED` or `USER_HYPOTHESIS`. Step C merges equal concept IDs into
one Candidate and preserves every nomination source. A User hypothesis without
provider support remains a valid, independently sourced hypothesis requiring
independent Evidence.

Labels never create identity. Unknown stage does not become a contradiction;
rules needing stage context simply remain inapplicable unless another governed
clause applies.

## Comparison and evidence requirements

Comparison rules identify structured evidence concepts such as
`PLANT_BASE_INSPECTION`, `LESION_MORPHOLOGY_DETAIL`, and `ROOT_COMPARISON` only
where the materialized knowledge supports the relationship. Step C converts an
applicable comparison rule into an explicit missing-evidence relationship and
selects one Next Best Evidence request through its existing deterministic
selection logic. The provider does not duplicate sufficiency, support,
contradiction, stopping, or resolution logic.

Repeated rules or Evidence references are deduplicated by semantic relation,
dimension, and authoritative Evidence identity, so repetition cannot amplify
support.

## Conflict and knowledge-gap behavior

An applicable relationship marked contested produces
`CONTESTED_RELATIONSHIP`; load order never decides the winner. Both the
Candidate and the conflict remain visible to Step C.

When no reviewed relationship applies, the provider returns no invented
Candidate and emits a structured `MISSING_CANDIDATE_RELATIONSHIP` gap. Other
supported gap codes include missing distinguishing evidence, stage, morphology,
abiotic comparison, source reference, and unreviewed rule. A knowledge gap is a
valid Investigation result, not an engine failure.

## Test-only fixture boundary

`createGoldenTestOnlyCandidateProvider()` exists solely to exercise the approved
Golden Case architecture with `WATER_ROOT_STRESS`,
`SHEATH_RELATED_PROBLEM`, and `APPLICATION_INJURY`. Its package authority is
`TEST_ONLY_FIXTURE`. Normal loading rejects that authority; tests must opt in
explicitly. It is not part of the production package, Knowledge Explorer, or any
promotion path.

## Explicit non-goals

- no broad rice disease, insect, weed, or abiotic rule authoring;
- no language extraction or questionnaire/conversation design;
- no OpenAI or other LLM Candidate generation;
- no computer vision or image interpretation;
- no Diagnosis, Guidance, Recommendation, treatment, threshold, pesticide,
  active ingredient, product, rate, resistance conclusion, or Thai legal-use
  decision; and
- no automatic knowledge promotion, publication, deployment, or release.
