# Terminology Candidate Template

Status: Active
Version: 1.0

## Purpose
Nominate one language-specific term assertion without confusing labels and identity.
## Scope
Language, locale, term type, form, authority, usage, ambiguity, status, and review.
## Out of Scope
This template MUST NOT establish concept identity, automatic equivalence, or UI terminology authority.
## Authority
Governed by [Template Governance](../template-governance.md), KAS-005, ADR-006/007, Editorial terminology workflow, and Review Framework.
## When to Use
When proposing, reviewing, deprecating, or superseding a term for an identified concept.
## Who Completes It
Knowledge Author or Terminology contributor completes; Terminology Reviewer leads; Scientific Reviewer handles nomenclature.
## Required Inputs
Concept reference, usage evidence, language/context, proposed term type, and reviewer assignment.
## Template Fields

| Field | Purpose | Status | Permitted content | Prohibited content | Completion guidance | Reviewer | Example | Non-example |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Term candidate identity | Track nomination | Required | Governed term handle | Spelling as identity | Allocate separately | Governance | `fictional-term-1` | “Alpha” |
| Concept reference | Bind meaning | Required | Governed concept candidate identity | Label-only concept | Cite exact version | Governance | `fictional-concept-1/v2` | “blue thing” |
| Language | Identify language | Required | Reviewed language designation | Guessed language | State source | Terminology | “fictional language F” | “Asian” |
| Locale | Bound usage | Conditional | Supported locale/context | Global inference | N/A with reason | Terminology | “Imaginary Locale One” | “everywhere” |
| Term type | Classify role | Required | Preferred/common/local/etc. proposal | Machine enum | Use KAS category | Terminology | “local-name candidate” | `type=1` |
| Spelling | Record exact form | Required | Source-supported form | Normalized invention | Preserve script | Terminology | “Fictional Alpha” | Auto-corrected form |
| Transliteration | Represent script | Conditional | Documented transliteration | Translation presented as transliteration | State method/uncertainty | Terminology | “Alpha-F” | Silent conversion |
| Pronunciation note | Aid human use | Optional | Sourced/contextual note | Guessed pronunciation | Attribute source | Terminology | “fictional note P” | Phonetic invention |
| Source authority | Support usage | Required | Scoped source/authority reference | Universal language authority | State claim scope | Terminology | `fictional-source-1` | “everyone says” |
| Usage context | Bound meaning | Required | Community/domain/time context | Context-free synonymy | Cite evidence | Terminology | “fictional editorial context” | “normal usage” |
| Geographic scope | Preserve locality | Required | Supported area or N/A reason | Universalization | State evidence | Terminology | “Imaginary Region One” | “all farmers” |
| Nomenclature authority | Govern scientific name | Conditional | Applicable authority reference/status | Self-invented scientific name | N/A when not scientific | Scientific | “not applicable: synthetic object” | Fake authority |
| Ambiguity | Preserve multiple meanings | Required | Explicit risks/evidence or none identified | Hidden ambiguity | Link issues | Terminology | “also used for fictional Beta” | Blank |
| Homonym risk | Identify same-form risk | Required | Evidence-backed risk/status | Spelling implies identity | Compare identities | Terminology | “high review concern, not scored” | “same word = same concept” |
| Synonym relationship | Propose equivalence review | Conditional | Separate scoped term relationship | Automatic synonymy | Link decision | Terminology | `fictional-term-link-1` | “obviously synonymous” |
| Deprecated status | Track discouraged use | Required | Current/deprecated proposal + reason | Silent deletion | Cite lifecycle record | Governance | “not deprecated” | Missing status |
| Preferred-term proposal | Request preferred status | Conditional | Scoped proposal with evidence | Acceptance by template | State language/scope | Terminology | “preferred in fictional locale” | “official everywhere” |
| Reviewer requirements | Assign competence | Required | Language/domain/scientific scopes | Generic approval | Use review matrix | Governance | “F-language Terminology Review” | “editor check” |
| Unresolved issues | Preserve gaps | Required | Issue references/none identified | Blank uncertainty | Link issue template | Governance | `fictional-issue-2` | “later” |
| UI translation authority | Prevent promotion | Prohibited | Explicit separation note | UI copy treated accepted | Refer to localization only | Terminology | “UI label is non-authoritative” | “Used in UI, so preferred” |

## Completion Rules
Language, spelling, concept reference, usage context, ambiguity, and status MUST be explicit.
Conditional forms require applicability reasons; translation and transliteration remain separate.
## Prohibited Content
Label-based identity, automatic equivalence, machine normalization rules, and UI localization as acceptance.
## Review Requirements
Terminology Review is mandatory; Scientific and Governance Reviews apply by term type and status.
## Failure Modes
Universal local usage, silent ambiguity, invented nomenclature authority, or preferred-by-completion.
## Example
A fictional Thai-form candidate MAY remain ambiguous and deferred without being removed.
## Non-example
An app translation copied into “accepted preferred term” MUST NOT pass.
## Audit and Retention
Retain term versions, sources, contexts, ambiguity, decisions, deprecation, and successor links.
## Change Control
Field changes require KAS-005, ADR-006/007, handbook, and review-framework analysis.
