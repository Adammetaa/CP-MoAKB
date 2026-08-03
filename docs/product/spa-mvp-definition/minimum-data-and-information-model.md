# Minimum Data and Information Model

Status: Active

Version: 1.0

## Interpretation

This is a semantic readiness model, not a schema, field list, form, database,
identifier, or validation contract. “Required” means required for a stated human
activity. Unknown, unavailable, and not applicable remain explicit where permitted.

## Classification Key

- **Open:** required to open a case.
- **Investigate:** required to begin the bounded investigation when material.
- **Review:** required before Human Review.
- **Options:** required before Management Options eligibility.
- **Optional:** useful but not universally required.
- **Sensitive:** needs purpose-bound handling.
- **Deferrable:** may be collected later without blocking unrelated safe work.
- **U/NA:** unavailable or not applicable is permitted with rationale.

## Case, Crop, and Field Context

| Information category | Readiness classification and boundary |
|---|---|
| case subject | Open, Review; unresolved subject may block dependent work; Sensitive; U/NA only when explicitly bounded |
| crop | Investigate, Review, Options where applicable; identity may remain unresolved but visible; Deferrable only for crop-independent intake |
| field or site | Open at bounded descriptive level; Sensitive; precision Deferrable; U/NA for non-site cases |
| responsible SPA | Open; required throughout; not unavailable once accepted |
| reporter | Open or attributable intake source; Sensitive; unknown reporter requires reviewed handling |
| observer | Investigate/Review for each Observation; may differ from reporter; U/NA when no direct Observation exists |
| time | Open approximate and Review precise enough for use; uncertainty allowed |
| location sensitivity classification | Open when location exists; Sensitive; Options/Review where disclosure matters |
| growth stage | Investigate/Review when interpretively material; Deferrable; U/NA allowed |
| variety if known | Optional, Deferrable, Sensitive where commercial; unknown allowed |
| field area | Optional/Investigate for distribution or count; Sensitive; U/NA allowed |
| planting method | Optional/Investigate when relevant; Deferrable; U/NA allowed |
| water condition | Investigate/Review when relevant; report/Observation/measurement basis distinct; U/NA allowed |
| field distribution | Investigate/Review; bounded method/context; unknown allowed |
| weather context | Optional/Review when used; exact source required; Deferrable and U/NA allowed |

## Problem and Management Context

| Information category | Readiness classification and boundary |
|---|---|
| reported concern | Open; retain reporter wording and uncertainty; Sensitive where needed |
| affected structure | Investigate/Review when material; Deferrable; unknown is not unaffected |
| onset and progression | Investigate/Review when used; Deferrable; missing history is not no progression |
| approximate severity description | Optional/Review when used; descriptive basis only, not inferred severity class |
| spatial pattern | Investigate/Review when used; bounded area and method; unknown allowed |
| prior occurrence | Optional; Deferrable; source and scope required |
| fertilizer history | Optional/Review if used; Sensitive; Deferrable; U/NA allowed |
| pesticide history | Investigate/Review/Options when relevant; Sensitive; exact report/source; no recommendation inference |
| irrigation history | Optional/Review if used; Deferrable; U/NA allowed |
| recent field operations | Optional/Review if used; Sensitive; Deferrable |
| previous action | Review when linked to Outcome; actor/source required; U/NA allowed |
| treatment response | Review when used; report/Observation basis and uncertainty required; no efficacy or resistance inference |

## Investigation and Post-investigation Content

| Information category | Readiness classification and boundary |
|---|---|
| observations and Information States | Investigate/Review; provenance and distinctions required; unavailable permitted only as an explicit gap |
| Information Gaps | Investigate/Review; open gaps may persist; never negative Observation |
| questions and responses | Investigate/Review when used; manual selection, skipped reason, uncertainty, U/NA supported |
| Evidence Needs and Evidence Objects | Review; remain distinct; source, quality, relevance, and limitations required |
| Knowledge References | Review/Options when used; explicit consultation and applicability state required |
| Hypothesis Candidates and criteria | Review; explicitly authored, provisional, alternatives/adverse evidence visible |
| review records, findings, unresolved issues | Review/Options; authority, scope, rationale, dissent, and status required |
| Management Options | Options only under future authority; Sensitive; not Recommendation or Decision |
| Decision and Action | post-review when they occur; attributable and separate; unavailable permitted |
| follow-up and Outcome | Deferrable until due; source/context required; no causal rewrite |
| Learning Candidate | Optional/Should Have; internal and review-pending; never approved Knowledge automatically |

## Minimum Principle

The product requests only information needed for the current safe purpose. It
must avoid excessive field entry, disclose why information matters, permit
incomplete saving, and never force a false value to satisfy readiness.
