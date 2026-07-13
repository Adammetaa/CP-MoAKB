# Master Data Quality Standard

## Record and relationship gates

A future publication-ready record requires, where applicable:

- a valid governed identifier and clear entity type;
- a preferred Thai label and preferred English label where available, with explicit missing-language status;
- a scientific name only after identity and authority verification;
- a definition or structured description and declared scope;
- source and statement-level provenance, jurisdiction, and temporal metadata;
- reviewer identity/role, review status, and decision date;
- ambiguity and duplicate assessments;
- evidence for material relationships and recorded contradictions;
- no unsupported recommendation, legal claim, safety conclusion, or causal inference;
- no copied long-form source text, source image, private information, or precise private location; and
- non-destructive change history.

Automated structural validation may detect omissions and invalid shapes, but it does not replace domain, taxonomy, evidence, regulatory, rights, or release review.

## Completeness levels

| Level | Meaning |
| --- | --- |
| Structural minimum | Required identity/type/workflow fields are present; content may remain unresolved. |
| Source-backed candidate | Material candidate fields and relationships are traceable to assessed source units. |
| Domain reviewed | Qualified reviewers have accepted the intended meaning and recorded uncertainties. |
| Publication ready | Domain review plus terminology, taxonomy, evidence, rights, privacy, architecture, and release gates applicable to scope have passed. |

These levels are quality stages, not truth guarantees. A dataset-level completeness claim must name its source universe, entity types, jurisdiction, time cutoff, inclusion rules, known gaps, and measurable coverage; “complete” without those qualifiers is prohibited.
