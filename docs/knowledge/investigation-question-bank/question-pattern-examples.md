# Question Pattern Examples

Status: Active

Version: 1.0

## Use of Examples

These fictional examples illustrate architecture only. They are not production
Question Bank records, form definitions, question instances, decision trees,
diagnostic content, or collection instructions.

## Pattern One: Structural Location

**Intent:** structural location.

**Pattern wording:** On which plant structure was the feature observed?

**Scope:** observation-level and structure-level.

**Applicability:** a recorded feature lacks adequately bounded structural location.

**Possible-use trigger:** a human has assessed the relevant location as `not
recorded` or `unknown`.

**Exclusion:** do not use when reviewed structural location is already sufficient
for the investigation purpose or when “feature” would substitute a diagnostic label.

**Expected response:** controlled observation term or free description, with
`unknown`, `not recorded`, `unavailable`, and `not applicable` allowed where relevant.

**Evidence Need Reference:** may reference a need for a traceable observation
account showing structural context. It does not create an Evidence Object.

**Review:** a human decides whether to author a case-specific question. No state
automatically triggers use.

## Pattern Two: Initial Localization

**Intent:** localization and temporal history.

**Pattern wording:** Where on the leaf did the feature first become visible?

**Scope:** structure-level and temporal.

**Expected response:** spatial location with attributable timing context, or an
explicit missing-information state. The question does not assume a leaf-tip
origin, progression, cause, or Diagnosis.

## Pattern Three: Information Basis

**Intent:** provenance clarification and verification.

**Pattern wording:** Was the feature directly observed, reported, or measured?

**Expected response:** bounded selection with source and method context. The
categories retain their distinct meanings; selecting one does not determine
truth or Evidence status.

## Pattern Four: Spatial Distribution

**Intent:** spatial distribution.

**Pattern wording:** How was the pattern distributed within the observed area?

**Expected response:** free description or controlled neutral observation term
with area, method, and limitations. The response must not be generalized beyond
the observed area.

## Pattern Five: Specimen Capture

**Intent:** specimen capture.

**Pattern wording:** Was a specimen captured?

**Expected response:** yes, no, or unknown, plus capture and custody context where
available. “No record” is not converted to “no specimen,” and a captured specimen
is not automatically Evidence.

## Pattern Six: Missing-state Clarification

**Intent:** clarification and contradiction resolution.

**Pattern wording:** Is the requested information unknown, not recorded,
unavailable, or not applicable?

**Expected response:** one or more explicitly justified Information States where
the case permits conflict. This pattern does not force missing information into
false certainty.

## Follow-up Illustration

A pattern may `clarify`, `refine`, `verify`, `expand`, `resolve_conflict`,
`request_missing_context`, or `request_additional_evidence` relative to another
pattern. The relationship records meaning only. A response never executes the
related pattern or creates an automatic branch.

## Prohibited Patterns

Patterns must not ask whether a real disease is present, whether a named organism
caused a feature, which pesticide or treatment to use, whether resistance exists,
how severe a presumed infection is, or whether the respondent agrees with a
suggested answer. Patterns also must not select themselves, rank hypotheses, or
promote responses across epistemic layers.
