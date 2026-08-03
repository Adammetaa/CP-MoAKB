# Investigation Case Model

Status: Active

Version: 1.0

## Definition

An Investigation Case is a governed product container for a bounded crop
investigation. It connects attributable records and human work without merging
their epistemic roles. The container is not a database row, diagnosis episode,
workflow instance, or universal identity for a farm, crop, person, or problem.

## Referenced Responsibilities

A case may reference:

- case subject, crop context, site or field context;
- reporter, observer, and responsible SPA;
- intake records and separately recorded Observations;
- Information States and Information Gaps;
- manually authored Question Instances and their Question Patterns;
- Evidence Needs, candidate material, and separately governed Evidence Objects;
- governed Knowledge references;
- explicitly authored Hypothesis Candidates and Differential Sets;
- review activities, comments, unresolved issues, and Investigation Findings;
- eligible Management Options, separately recorded Decisions and Actions; and
- Outcomes and follow-up records.

These are conceptual references, not schema fields or cardinalities.

## Case Identity and Bounds

Humans establish the subject, temporal bounds, crop and site context, authority,
and reason for inquiry. Unresolved crop identity or location remains explicit
and may restrict investigation. Related reports may remain separate cases when
combining them would hide provenance, context, consent, or uncertainty.

## Minimum Opening Basis

A case may be opened when there is an attributable reporter or intake source, a
bounded subject or declared unresolved subject, a reported concern, a responsible
SPA or intake owner, sufficient contact or follow-up basis where appropriate,
and an initial safety and urgency screen. Opening records uncertainty; it does
not certify readiness to investigate.

## Case Responsibilities

The case preserves authorship, source, role, language, time, scope, review,
uncertainty, conflict, version history, sensitive-information handling, and
reason for every substantive change. Reported information remains reported until
a separately attributable observation or verification exists.

## Missing Information

A case may remain open with missing crop growth stage, distribution, management
history, environmental context, images, specimens, or other noncritical inputs.
Each absence is assessed as not recorded, unknown, unavailable, not applicable,
conflicting, or another governed Information State. Missing values are never
converted to negative Observations.

## Closure, Reopening, Withdrawal, and Rejection

Closure records that authorized case work has ended for a stated reason; it does
not certify Diagnosis, completeness, or successful Outcome. Reopening preserves
the closed history and states the new basis. Withdrawal records an authorized
end to participation or inquiry. Rejection records why the submitted matter
cannot be accepted as a governed case. None erases prior records.

## Implementation Neutrality

No identifier, storage model, schema, database, JSON, YAML, API payload, Python
class, access-control mechanism, or synchronization behavior is defined here.
