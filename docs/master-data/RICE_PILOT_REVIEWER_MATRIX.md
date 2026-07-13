# Sprint-016 Reviewer Responsibility Matrix

Roles are governance functions; no real person is assigned here. Where specialist verification is required, absence of a named qualified reviewer blocks the affected candidate and pilot release.

## Tranche A staffing register

No repository evidence or Product Owner authorization identifies a named qualified assignee. `Acting` below recognizes only the documentation work performed under the stated Sprint-015B role; it does not satisfy candidate-content approval or separation of duty.

| Function | Assignment status | Mandatory for Tranche A | Readiness consequence |
| --- | --- | --- | --- |
| Master Data Curator | **Vacant** | Yes | Blocks authoring and custody of candidate records. |
| Agricultural Domain Reviewer | **Vacant** | Yes | Blocks cultivated-rice scope, stage, and organ applicability approval. |
| Plant Anatomy or Botany Reviewer | **External Review Required** | Yes | Blocks approval of the eight PO mappings and anatomical granularity. |
| Taxonomy Reviewer | **External Review Required** | Yes | Blocks final rice taxon and plant-organ mappings despite selected authorities. |
| Thai Language or Terminology Reviewer | **External Review Required** | Yes | Blocks Thai preferred-label and translation approval. |
| Source and Rights Reviewer | **Acting** for Sprint-015B assessment only; qualified Tranche A assignee **Vacant** | Yes | Current source decisions establish boundaries; candidate extraction/sign-off remains blocked. |
| Evidence Reviewer | **Vacant** | Yes | Blocks claim-to-locator sufficiency decisions. |
| Architecture Reviewer | **Acting** for Sprint-015B documentation only; named Tranche A assignee **Vacant** | Yes | Does not replace scientific, taxonomy, evidence, or rights approval. |
| Product Owner | **Vacant** | Yes | Blocks staffing authorization and tranche release decision. |
| Plant Pathology Reviewer | **Not Required for Tranche A** | No | Tranche A contains no disease, symptom, causal-agent, or diagnosis claim. |
| Entomology Reviewer | **Not Required for Tranche A** | No | Tranche A contains no insect, arthropod, pest-role, or damage claim. |
| Weed Science Reviewer | **Not Required for Tranche A** | No | Tranche A contains no weed identity, role, or competition claim. |

`Vacant` means no authorized named assignee is recorded. `External Review Required` means specialist competence must be obtained outside currently recorded staffing. No status implies a person's identity, qualification, consent, or future availability.

## Assignment closure details

No named person, qualification, or consent is evidenced in the repository. “Acting” is limited to Sprint-015C documentation analysis and cannot approve future candidate content.

| Function | Status | Named person / qualification basis | Permitted current scope | Conflict status | Separation and escalation |
| --- | --- | --- | --- | --- | --- |
| Master Data Curator | **Vacant** | None authorized | None | Unknown until assignment | Must not be sole scientific/evidence/release approver; Product Owner assigns. |
| Agricultural Domain Reviewer | **Vacant** | None authorized | None | Unknown until assignment | Must independently review crop, stage, and rice-applicability claims; escalate science gaps to Chief Architect/Product Owner. |
| Plant Anatomy or Botany Reviewer | **External Review Required** | No qualification evidence recorded | None | Unknown until assignment | Must approve PO identity/granularity and near-neighbor exclusions independently of author; escalate ontology disputes to Taxonomy and Architecture Reviewers. |
| Taxonomy Reviewer | **External Review Required** | No qualification evidence recorded | None | Unknown until assignment | Must approve authority mappings independently of automated matching and curator; escalate unresolved concepts to Architecture Reviewer. |
| Thai Language or Terminology Reviewer | **External Review Required** | No Thai terminology qualification evidence recorded | None | Unknown until assignment | Must review preferred/alternative/editorial forms independently of translator-author; escalate domain ambiguity jointly with Agricultural Reviewer. |
| Source and Rights Reviewer | **Acting** for Sprint-015C documentation; Tranche A assignee **Vacant** | Task role supports assessment only; no legal qualification inferred | Source metadata, claim boundaries, minimal-use decisions, and blocker documentation | No conflict assessed for future records | Cannot be sole content author and sole rights approver where permission is unclear; escalate uncertain reuse to Product Owner/legal review. |
| Evidence Reviewer | **Vacant** | None authorized | None | Unknown until assignment | Must independently approve claim-to-locator support; escalate scientific sufficiency to applicable domain reviewer. |
| Architecture Reviewer | **Acting** for Sprint-015C documentation; Tranche A assignee **Vacant** | Task role supports documentation consistency only | Profile, identifier, partition, and Design Freeze review | No conflict assessed for future records | Cannot replace specialist approval; escalates exceptions to Chief Architect. |
| Product Owner | **Vacant** | No Product Owner nomination recorded | None | Unknown until assignment | Final release authority must be separate from sole author/scientific/evidence reviewer; escalates architecture exceptions to Chief Architect. |

At minimum, no one individual may be the author, sole scientific reviewer, sole evidence reviewer, and final release approver for the same record set. Combined roles require disclosed competence, consent, conflict review, and an independent second approval for every combined scope.

| Role | Responsibilities and approval authority | Prohibited assumptions | Required evidence | Escalation and separation of duty |
| --- | --- | --- | --- | --- |
| Master Data Curator | Authors candidates, records provenance/value states, runs checks; may submit but not finally approve own content. | May not infer missing facts, equivalence, causality, or source permission. | Approved source entry, exact locator, extraction/paraphrase note, audit history. | Escalates ambiguity to Data Steward/domain reviewer; cannot be sole domain, rights, architecture, and release approver. |
| Agricultural Domain Reviewer | Approves rice crop, organ, stage, production-context meaning and cross-domain plausibility. | May not approve taxonomy, rights, regulation, or diagnosis outside competence. | Item-level rice sources, scope notes, relationship context, contradictory evidence. | Escalates pathology/entomology/weed/taxonomy questions; should not approve own authored candidate. |
| Plant Anatomy or Botany Reviewer | Approves plant-structure identity, anatomical level, PO mapping, rice applicability, and near-neighbor exclusions. | May not infer exact identity from an agronomic word or approve Thai translation, rights, or taxonomy outside competence. | PO term/version, rice-specific structure evidence, hierarchy and mapping rationale, conflicts. | Escalates nomenclature to Taxonomy Reviewer and terminology ambiguity to Thai/Agricultural Reviewers. |
| Plant Pathology Reviewer | Approves disease boundaries, causal-claim scope, symptoms, signs, and pathology relationships. | May not infer causality from index grouping or treat symptoms as diagnoses. | Disease-specific evidence, causal-agent support, host/organ/stage context, alternatives/conflicts. | Escalates nomenclature to Taxonomy Reviewer and weak evidence to Architecture/Product Owner gate. |
| Entomology Reviewer | Approves insect/arthropod identity scope, contextual pest roles, damage mechanisms/patterns, and beneficial-role separation. | May not treat every organism occurrence as a pest or index placement as identity proof. | Item-level entomology evidence, crop/context support, taxonomic mapping, damage locators. | Escalates taxonomy and unresolved pest/beneficial roles; independent of curator for acceptance. |
| Weed Science Reviewer | Approves weed-role context, competition/damage descriptions, and production applicability. | May not make weed status intrinsic to a plant taxon or infer taxonomy from common name. | Item-level weed evidence, production context, taxonomic mapping, conflicts. | Escalates taxonomy and context conflicts; independent domain sign-off required. |
| Taxonomy Reviewer | Approves scientific-name form, authority mapping, rank, version, and identity uncertainty. | May not use translation or label equality as equivalence; may not approve pest role or causality by taxonomy alone. | Specialist authority record/version, mapping type, synonym history, competing concepts. | Escalates unresolved identity to Architecture Reviewer; cannot resolve it by silent merge. |
| Thai Language or Terminology Reviewer | Approves sourced and editorial Thai forms, translation provenance, usage variants, preferred status, and disambiguation. | May not treat scientific names or framework codes as translations or infer scientific/anatomical identity from word similarity. | Exact Thai source locator or editorial translation record, concept scope, alternatives, domain-review decision. | Escalates scientific and anatomical questions to Agricultural/Anatomy Reviewers and unresolved language conflicts to Product Owner. |
| Source and Rights Reviewer | Approves a source for a precise pilot claim/extraction method and records rights, currency, archive, and visual-review status. | May not infer reuse rights from public access or official-domain status. | Publisher/version/date evidence, terms/license, stable locator, visual inspection record, overlap assessment. | Escalates unclear rights to Product Owner/legal review; must be distinct from sole content author where permission is unclear. |
| Evidence Reviewer | Approves claim-level support/contradiction and appropriate uncertainty. | May not convert source authority into truth or absence of conflict into confirmation. | Exact evidence references, methods, scope/time/jurisdiction, contradictory/missing evidence. | Escalates inadequate support to domain reviewer and blocks relationship acceptance. |
| Architecture Reviewer | Approves envelope/relationship semantics, identifier boundaries, deterministic validation, partitioning, and Design Freeze compliance. | May not supply scientific, rights, regulatory, or Product Owner authority. | ADRs, validation report, diff/artifact audit, reviewer decisions, unresolved-risk register. | Escalates architecture exceptions to Chief Architect; must not waive specialist blockers. |
| Product Owner | Decides whether an architecture-approved tranche is released, deferred, reduced, or rejected. | May not substitute release priority for scientific, rights, or regulatory evidence. | Complete gate report, Chief Architect approval, scope/gap statement, all blocker dispositions. | Escalates architecture exceptions to Chief Architect and rights/legal matters to appropriate authority; no automatic promotion. |

## Separation-of-duty minimum

The curator may not be the sole approver of a candidate they authored. Taxonomic mappings require a Taxonomy Reviewer distinct from automated matching. Source rights approval cannot be inferred by a domain reviewer. Architecture approval cannot replace specialist approval. Chief Architect approval and Product Owner release decision are separate final gates. Conflicts of interest and combined roles must be disclosed in the review record.
