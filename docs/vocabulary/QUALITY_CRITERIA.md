# Vocabulary Quality Criteria

## Purpose

Quality criteria define the minimum evidence that a future vocabulary release is internally coherent and governable. Passing a vocabulary quality gate does not validate scientific assertions, registration, safety, diagnosis, efficacy, or recommendations.

## Term-level acceptance criteria

Every future accepted term MUST have:

- a stable governed concept reference;
- a necessary, clear definition appropriate to the vocabulary scope;
- explicit inclusion/exclusion scope and category;
- exact language and script, plus region/audience where relevant;
- preferred/alternative/synonym relationship classified correctly;
- identifiable source/version and evidence for material language/meaning claims;
- provenance from proposal through review/change;
- named reviewer roles, dates, decisions, and lifecycle status;
- ambiguity, homonym, conflict, limitation, and uncertainty notes where applicable; and
- no prohibited inference that turns terminology into truth, legal permission, safety, diagnosis, or recommendation.

## Publication quality gates

Before publication, the proposed release MUST pass:

1. **Language review:** spelling, script, grammar, translation/transliteration, register, regional usage, and harmful language.
2. **Terminology review:** label classification, clarity, preferred-label uniqueness in scope, synonyms, definitions, notes, and ambiguity.
3. **Domain review:** concept meaning, category, scientific context, inclusion/exclusion, and non-conflation.
4. **Evidence review:** source identity/version, support, contradiction, provenance, and review currency.
5. **Architecture review:** separation from identity, ontology, evidence, regulation, safety, diagnosis, and recommendation plus cross-vocabulary consistency.
6. **Consistency review:** duplicate candidates, orphaned references, circular/inconsistent lexical relationships, status/replacement links, and release metadata.
7. **Regulatory/privacy/license review:** required when content or source scope creates those obligations.

A critical failure blocks publication. A non-critical exception requires owner, rationale, scope, risk, remediation, and expiry/review date in the release record.

## Consistency expectations

A future validation process SHOULD check concept references, required fields, language/script syntax, exactly one preferred label per declared context, relationship direction, lifecycle transitions, deprecation replacements, source/provenance completeness, reviewer separation, and absence of silent identity merges.

The checks are conceptual. This sprint creates no validation code, schema, shape, YAML/JSON rules, or test data.

## Quality reporting

Each future vocabulary release SHOULD publish a human-reviewable quality statement containing scope, review coverage, gate results, exceptions, unresolved ambiguities, deprecated/withdrawn changes, compatibility impact, and limitations. Metrics such as term count or coverage MAY aid review but MUST NOT substitute for semantic and language quality.
