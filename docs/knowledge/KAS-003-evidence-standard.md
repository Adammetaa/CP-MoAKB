# KAS-003: Evidence Standard

Status: Active

Version: 1.0

## Purpose

Govern the evidence required to support, challenge, update, or retire a
CP-MoAKB knowledge assertion while preserving provenance, uncertainty, conflict,
and applicability.

## Scope

This standard applies to evidence selected for authored definitions,
relationships, classifications, regulatory facts, scientific assertions, and
future interpretive work. It incorporates the repository's
[Evidence Levels](../EVIDENCE_LEVELS.md) as the current detailed hierarchy.

## Out of Scope

This standard does not conduct literature review, grade a real publication,
calculate confidence, infer causality, create scientific content, or authorize
diagnosis or recommendation. It does not define evidence storage or algorithms.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative. Evidence levels express the kind and authority of support; they are
not numeric truth, recommendation strength, or an automatic acceptance rule.

## Definitions

- **Evidence item** is an identifiable source unit or observation evaluated in
  relation to one precise assertion.
- **Evidence provenance** records origin, version, locator, acquisition or
  observation context, transformation, and custody.
- **Applicability** is the fit between evidence scope and the proposed assertion.
- **Completeness** is the sufficiency of the evidence set for the stated review
  question, including adverse and missing evidence.
- **Quality** is a transparent assessment of authority, method, integrity,
  relevance, independence, currency, and limitations.
- **Conflict** is material support for incompatible conclusions or scopes; it is
  not an inconvenience to be deleted.

## Governance Rules

### Evidence hierarchy

The current hierarchy MUST be interpreted as follows and in accordance with
[Evidence Levels](../EVIDENCE_LEVELS.md):

| Level | Evidence category | Constitutional boundary |
| --- | --- | --- |
| A | Official classification or binding regulatory evidence | Authoritative only for the issuing authority's fact, jurisdiction, version, and validity |
| B | Government or authoritative institutional technical evidence | Requires competence, method, scope, date, and limitation review |
| C | Peer-reviewed scientific evidence | Requires study-design, population, environment, outcome, and uncertainty review |
| D | Expert-reviewed extension or field guidance | Requires attributable expertise and bounded context |
| E | Structured field observation | Supports observation and investigation, not automatic causality |
| F | Unverified report or hypothesis | May trigger review but cannot independently establish binding or causal knowledge |

Source tier and evidence level MUST remain separate. An official publisher does
not make every statement Level A, and peer review does not make a finding
universally applicable.

### Requirements and traceability

Every evidence item MUST identify the assertion it supports, contradicts, or
qualifies. It MUST retain source identity, source version, citation/locator,
relevant dates, evidence level, source tier, scope, jurisdiction where
applicable, review status, and known limitations. Transformations or extracts
MUST trace to the source unit and method.

### Completeness and quality

Authors MUST define the review question and search/selection boundary before
claiming completeness. Material contradictory evidence, unavailable evidence,
publication bias, shared provenance, and dependence among sources MUST remain
visible. Quality assessment MUST give reasons; an unexplained score MUST NOT
replace the underlying dimensions.

### Conflicts

Conflicting evidence MUST be preserved as separately sourced positions. Review
MUST examine differences in method, terminology, time, jurisdiction, population,
context, authority, and claim granularity. Unresolved material conflict MUST
result in a disputed, qualified, or deferred assertion—not silent averaging.

### Updates and retirement

New evidence MUST trigger impact review against affected assertions, versions,
relationships, and publications. It MUST NOT silently rewrite prior review
history. Evidence MAY be deprecated or retired when superseded, withdrawn,
invalidated, outside rights, or no longer applicable, but its historical use and
reason for retirement MUST remain traceable. Retirement of one source does not
automatically decide the assertion; the full evidence set MUST be reassessed.

## Examples

- Two fictional studies support an abstract assertion under different contexts.
  The record keeps both scopes and does not generalize beyond their overlap.
- A fictional official instrument is superseded. The former evidence item is
  retained for its historical validity period and linked to the successor.

## Non-examples

- Counting citations and treating the largest count as truth.
- Assigning Level A because a document is hosted on an official website.
- Removing contradictory evidence after a preferred conclusion is selected.
- Treating one field observation as proof of cause, resistance, or efficacy.
- Retiring evidence by deleting its citation and review history.

## Reviewer Notes

Reviewers SHOULD challenge claim precision, source independence, applicability,
and omitted adverse evidence. They MUST separate mechanical completeness from
scientific sufficiency and record when qualified expertise is unavailable.

## Future Considerations

Future standards may govern systematic-search protocols, study-quality tools,
evidence synthesis, conflicts of interest, or domain-specific minimum evidence.
No future method may collapse evidence into an opaque score or bypass regulatory,
safety, privacy, or recommendation gates.
