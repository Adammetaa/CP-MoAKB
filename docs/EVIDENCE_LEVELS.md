# Evidence Levels

## Purpose and separation from source tiers

Evidence levels classify the basis for a specific assertion. They are separate from source tiers in [Source Policy](SOURCE_POLICY.md): source tier describes the source category, while evidence level describes how an assertion is supported and what kind of claim it can justify.

One source can support assertions at different evidence levels. Multiple evidence records may support or contradict the same assertion. Evidence level does not automatically determine recommendation strength.

## Levels

### A — Official classification or binding regulatory evidence

Current official classification records, registrations, labels, or binding regulatory instruments within the issuing authority's scope, jurisdiction, version, and validity period.

Level A is authoritative for the official fact it states. It does not prove local biological efficacy or agronomic suitability beyond that scope.

### B — Government or authoritative institutional technical evidence

Technical evidence issued by a competent government, intergovernmental, standards, or recognized authoritative institution. Scope, method, date, jurisdiction, and stated limitations remain material.

### C — Peer-reviewed scientific evidence

Peer-reviewed research interpreted within its study design, population, environment, intervention, outcome, and uncertainty. A single study does not automatically establish generality.

### D — Expert-reviewed extension or field guidance

Guidance reviewed by identifiable experts or recognized extension organizations, with applicable crop, geography, production system, date, and assumptions.

### E — Structured field observation

A field record meeting minimum metadata, provenance, consent, and review requirements. It may support hypothesis generation, local patterns, or follow-up questions but does not automatically establish causality.

### F — Unverified report or hypothesis

An informal report, unreviewed interpretation, or explicit hypothesis. It can trigger investigation but cannot independently support a chemical recommendation, legal-use claim, causal conclusion, or safety claim.

## Interpretation rules

- Evidence level does not equal recommendation strength.
- Official classification does not prove local field efficacy.
- Registration proves legal permission under applicable label conditions, not guaranteed performance.
- Field observation can generate hypotheses but does not automatically establish causality.
- Treatment response alone does not prove the original diagnosis.
- Lack of response alone does not prove resistance.
- Conflicting evidence must be preserved, linked, and shown.
- Every assertion must have a review status.
- Applicability depends on crop, target, growth stage, environment, timing, jurisdiction, and other context in addition to evidence level.

## Review statuses

Review status is independent of evidence level and confidence.

- **unreviewed:** received but not assessed for identity, completeness, or meaning.
- **machine-extracted:** produced by an automated process and awaiting human verification.
- **human-reviewed:** checked by an identified reviewer against the source and scope.
- **domain-approved:** accepted by an authorized domain reviewer for a defined use and version.
- **deprecated:** retained for history but no longer preferred for current use.
- **superseded:** explicitly replaced by a newer version or assertion.
- **disputed:** materially challenged, with the conflict and review state preserved.

Status changes require provenance: reviewer or process identity, date, rationale, and related source versions.

## Assertion record expectations

An EvidenceAssertion should identify:

- precise claim and assertion type;
- subject, relationship, and object or value;
- source and SourceVersion;
- citation or record locator;
- evidence level;
- source tier;
- jurisdiction and validity period when applicable;
- review status and reviewer history;
- confidence method or qualitative rationale;
- scope and applicability conditions;
- supporting and contradicting evidence; and
- supersession or deprecation links.

## Combining evidence

Evidence should be synthesized transparently, not averaged into an unexplained score. A future synthesis should explain relevance, independence, consistency, study or observation limitations, source authority, recency, and applicability. Binding regulatory constraints remain gates even when other evidence favors an option.

## Recommendation boundary

A recommendation, if implemented in the future, requires more than a minimum evidence letter. It must also pass diagnosis, IPM, current registration and label, safety, environmental, operational, and economic checks described in [Decision Engine](DECISION_ENGINE.md). Missing evidence remains visible and can require deferral.
