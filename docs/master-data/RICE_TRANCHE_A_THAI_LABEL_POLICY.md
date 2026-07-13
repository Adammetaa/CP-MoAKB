# Tranche A Thai-Label Governance Policy

- Status: Approved policy; label approval remains role-gated
- Date: 2026-07-14
- Scope: the 18 future structural Tranche A entity candidates

## Label classes

| Class | Meaning and rule |
| --- | --- |
| Source-backed Thai preferred label | Directly present in an Approved-for-Pilot source for the same concept and scope; still requires Thai Terminology and applicable domain review. |
| Editorial Thai translation | Produced by an identified editor from an authority English label; must record source label, translator/editor reference, date, rationale, and review. It is never represented as source text. |
| Transliteration | Script conversion or phonetic rendering, stored as `transliteration`, never silently promoted to preferred or treated as translation. |
| Provisional label | A candidate form awaiting required evidence or review; visibly marked `provisional` and cannot support matching or equivalence. |
| Regional/agricultural usage variant | An alternative label with geography, community, source, and ambiguity note; not preferred solely because it is frequent. |
| Scientific name | Authority-governed nomenclatural form; language role is `scientific`, not Thai translation. |
| Framework code | BBCH code is language-neutral and retained unchanged; it is not translated or transliterated. |
| Authority-preferred English label | Preserved with its authority/source and edition; a Thai form does not overwrite it. |

## Category policy

| Category | Thai preferred-label requirement for Tranche A |
| --- | --- |
| Crop | Must be directly sourced. `ข้าว` is directly observed in RDP-SRC-016 but remains proposed until Thai Terminology and Agricultural Domain Review. |
| GrowthStageSystem | A Thai preferred label is prohibited until a reviewed editorial translation or directly sourced official label is approved. `BBCH` remains the language-neutral code/name. |
| GrowthStage | Each Thai preferred label requires either a same-framework official Thai source or a reviewed editorial translation explicitly linked to the English BBCH label and code. No current Thai stage label is approved. |
| PlantOrgan | A directly sourced term may be proposed, but the mapping to the exact PO identity must be reviewed. RDP-SRC-017 supplies observed usage for several structures, not automatic PO equivalence. |

When no official translation exists, a reviewed editorial Thai translation may become preferred only after Thai Terminology and domain reviewers approve its concept match, scope, and disambiguation. Until then the record uses an explicit `unknown` value-state object; an English label or code is not copied into the Thai preferred slot.

## Provenance and alternatives

Every Thai label records value, `th` language, `Thai` script, role, basis (`source` or `editorial_translation`), source/evidence references or explicit not-applicable state, editor/translator reference, review decisions, date, geography where relevant, and ambiguity status. Alternative forms are separate ordered label objects; they are never concatenated into one preferred value.

Ambiguous everyday terms are escalated to the Thai Terminology Reviewer and the relevant domain reviewer. The scope note must disambiguate whole structure from part, reproductive structure from harvested product, and framework stage from colloquial field condition. Scientific-name strings and BBCH codes remain outside translation review.

## Current Tranche A consequence

The policy is complete, but no named qualified Thai Language or Terminology Reviewer is authorized. Crop `ข้าว` and the observed organ terms in RDP-SRC-017 remain source-backed proposals; all stage translations and unsupported organ mappings remain blocked. Candidate authoring therefore remains blocked by staffing even where a source form is available.
