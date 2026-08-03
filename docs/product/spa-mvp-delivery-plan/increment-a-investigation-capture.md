# Increment A — SPA Investigation Capture

Status: Active

Version: 1.0

## Objective and Value

Enable an SPA to transform an incomplete field or remote report into a
structured, traceable investigation package ready for Human Review, without
providing Diagnosis or Management Options.

## Included Capabilities

- create or open a Case and preserve Reporter, Observer, and responsible SPA roles;
- record Reported Information separately from Direct Observations;
- record crop/field context, Information States, and Information Gaps;
- manually select or adapt Question Patterns into Question Instances;
- record responses, uncertainty, skipped questions, and unavailable answers with reason;
- define Evidence Needs, attach material, and preserve source, context, and limitations;
- save incomplete work, resume it, produce a rapid bounded Case Summary, prepare
  a review package, and preserve audit/provenance.

## Excluded Capabilities

Confirmed Diagnosis, automatic question selection, Evidence acceptance,
Observation extraction, candidate ranking, Management Options, pesticide or
product recommendation, Decision support, and learning automation are excluded.

## Dependencies and Readiness

Required assets are approved intake semantics, Observation terminology subset,
Question Pattern subset, Information State/Gap definitions, Evidence Need and
capture rules, and provenance language. Required operations are privacy and
sensitive-location handling, trained pilot SPAs, safe field procedures, manual
review-package criteria, and validation/debrief instruments. Upstream authority
is the Investigation Blueprint and MVP Definition; downstream consumers are
Increment B reviewers.

## Validation and Success

Evidence includes observed SPA completion, field debrief, case artifacts,
provenance audit, recovery of incomplete work, question usefulness, capture
friction, time/cognitive burden, duplicate-entry observations, and external-tool use.
Success means an SPA can produce a reviewable package without forced certainty
or external chat/notebook for core continuity.

Failure includes report/Observation merging, lost provenance, systematic missing
context, unusable burden, leading questions, silent loss, or packages reviewers
cannot understand. Stop for privacy/safety breach, repeated layer collapse, data
loss, systematic context loss, or unacceptable field burden.

## Closure and Rollback

Increment A may close a Case as insufficient information, outside scope,
duplicate, withdrawn, or referred for review. Closure never implies Diagnosis.
Rollback may pause the pilot, narrow case scope, withdraw a pattern or content
package, require manual external review, or reopen affected cases while retaining history.

## Risks and Expansion

Risks are becoming a generic form, excessive entry, weak offline continuity,
poor terminology fit, and review packages optimized for completeness rather than
use. Expansion to B requires repeatably reviewable cases, accepted burden,
preserved boundaries, approved vertical-slice content, and available reviewers.
