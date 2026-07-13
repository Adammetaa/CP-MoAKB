# Rice Domain Master Data Pilot Plan

## Purpose and exact proposed scope

This is a later-sprint plan, not a dataset. It tests entity, relationship, provenance, multilingual, and review governance using:

- one governed crop domain: rice;
- one selected, explicitly sourced rice growth-stage framework, without silently merging BBCH or local stages;
- 8–12 plant-organ concepts needed by the selected cases;
- 3–5 rice diseases;
- 3–5 rice insect or arthropod pests;
- 1–2 other animal pests;
- 3–5 rice-field weeds;
- 8–15 symptoms/signs directly needed by selected diseases;
- 4–8 damage mechanisms/patterns directly needed by selected pests; and
- only the host, stage, organ, causal-agent, symptom/sign, and damage relationships needed for those records.

Ranges are scope controls, not record reservations or identifiers.

## Selection and boundaries

Candidates must come from individually assessed official Rice Department pages or publications with stable references, adequate metadata, domain relevance, extraction suitability, and rights status. A scientific identity requires an additional specialist taxonomic authority. Prefer records that exercise different ambiguity and relationship cases while remaining reviewable.

Exclude recommendations, products, pesticide uses, registrations, safety conclusions, regulatory mappings, full-site coverage, unsourced scientific names, copied prose/images, inferred equivalence, private observations, and relationships outside the selected set.

## Required candidate fields

Each candidate needs proposed local type and identity rationale; Thai and available English labels; definition/structured description; source unit and version metadata; extraction/paraphrase note; jurisdiction/time/context; ambiguity, duplicate, and uncertainty notes; review status; applicable taxonomic mapping; relationship evidence; and change history. Unresolved fields use explicit status and reviewer action—never invented values or empty strings presented as confirmation.

## Reviewers and checkpoints

Required review functions are Thai terminology, rice agronomy, plant pathology, entomology, weed science, appropriate zoology, taxonomy, evidence/source governance, regulatory separation, rights/reuse, architecture, and release management.

Checkpoints are: source/scope approval; extraction sample review before scaling; identity and terminology review; domain/taxonomy review; cross-source conflict review; relationship/provenance audit; format evaluation; acceptance review; and reproducible release rehearsal.

## Acceptance and stopping criteria

Acceptance requires all selected records within bounds; required fields or explicit unresolved status; claim-level provenance; reviewed identity/duplicates; verified scientific names where used; reviewed relationship evidence; no prohibited content; declared coverage/gaps; reproducible validation; and all applicable approvals.

Stop and return to governance if reuse rights remain unresolved for intended publication, a source is materially outdated or unstable, identity/taxonomy cannot be verified, relationship evidence is inadequate, conflicts cannot be represented safely, scope exceeds the ranges, required reviewers are unavailable, or frozen/runtime changes become necessary.

## Physical-format evaluation boundary

| Candidate | Strengths to evaluate | Risks to evaluate |
| --- | --- | --- |
| CSV | Familiar review, simple diffs, broad tooling. | Weak nesting, multilingual/provenance repetition, relationship fragmentation. |
| JSON | Structured validation and nested metadata. | Noisy diffs, ordering/canonicalization, hand-edit risk. |
| YAML | Readable structured authoring. | Parser differences, implicit typing, fragile large collections. |
| SQLite | Constraints, querying, relational integrity. | Binary diffs and weaker direct review/release transparency. |
| Relational database | Integrity, scale, joins, operational tooling. | Migration/hosting complexity and separation from review artifacts. |
| Graph representation | Natural relationship/provenance traversal. | Technology/semantics complexity and premature inference expectations. |

The pilot should compare human review, diff quality, schema validation, multilingual text, provenance, relationships, scalability, and tool compatibility. A future ADR must select physical representation after the pilot specification is approved.

## Expected output options

A later pilot may produce a review package, schema proposal, validated candidate dataset, source/evidence manifest, and release report in an approved format. None is authorized by this plan.
