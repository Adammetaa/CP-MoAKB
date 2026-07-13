# External Reference Policy

## Purpose and authority boundary

External references connect a CP-MoAKB identity or statement to an identifier, record, document, or assertion governed by another authority. A reference or matching string does not establish identity, scientific truth, legal status, safety, or recommendation validity.

Potential future authorities include IRAC, FRAC, HRAC, scientific taxonomy authorities, GBIF, NCBI Taxonomy, EPPO, Thai product-registration authorities, safety/legal authorities, and manufacturer label sources. Except for the currently registered IRAC scope documented by the repository, these are candidates—not implemented integrations. CP-MoAKB does not control their namespaces or claim their endorsement, currency, licensing, or availability.

## Reference and mapping distinctions

| Concept | Meaning |
| --- | --- |
| Local identity | A CP-MoAKB-governed concept or record identity. |
| External identifier | A token owned and defined by an external authority. |
| Exact equivalence | Reviewed claim that two identities have the same referent and scope under stated versions; the strongest relation and rarely inferred safely. |
| Close match | Substantial overlap with a meaningful distinction or unresolved scope difference. |
| Broader match | The referenced concept has broader scope than the local concept. |
| Narrower match | The referenced concept has narrower scope than the local concept. |
| Related match | Relevant association without equivalence or hierarchy. |
| Source citation | A locator showing where evidence or text comes from; it is not an identity mapping. |
| Imported assertion | A locally addressable representation of what a source states, retaining source authorship, version, scope, and transformation provenance. |

An imported assertion MUST NOT be presented as CP-MoAKB-authored fact merely because it has a local statement identifier. String equality, normalized spelling, shared code fragments, or matching labels are insufficient to assert equivalence.

## Mapping record expectations

Every future external mapping MUST retain:

- local identifier and local identity category;
- external authority and namespace;
- exact external identifier as issued;
- source URL or governed source reference/locator;
- source version where applicable;
- retrieval date and review date, kept distinct;
- mapping relation: exact, close, broader, narrower, related, or another governed type;
- evidence and rationale for the mapping;
- reviewer identity/role and mapping status;
- confidence or qualitative uncertainty, distinct from review status;
- validity period, jurisdiction, taxonomic/classification context, or regulatory effective period where applicable;
- conflicts, alternatives, supersession, and prior mapping history; and
- license, usage, redistribution, or access constraints.

Mappings are statement-level governed records. Updating an external source does not silently change the local identity or every prior mapping.

## Authority-specific constraints

- **IRAC/FRAC/HRAC:** Mode-of-Action identifiers/classifications remain source-, authority-, and version-specific. Classification does not establish target identity, susceptibility, efficacy, registration, safety, or recommendation. Sprint-013 does not add FRAC/HRAC support or alter the frozen IRAC model.
- **Taxonomy authorities, GBIF, NCBI Taxonomy, and EPPO:** mappings require rank, accepted/synonym status, authority/version, and scope review. A taxon identity is not automatically a crop-use, pest-role, disease, or field-organism identity.
- **Thai registration authorities:** a registration identifier requires the issuing authority, exact product/holder/use scope, jurisdiction, effective state, and current official source. It is not a trade name or universal permission.
- **Safety/legal sources:** references must preserve competent authority, legal/label basis, jurisdiction, version, and effective time.
- **Manufacturer label sources:** manufacturer identity and material provenance remain explicit. Such material does not replace an applicable official registration/label authority unless governance verifies that status.

## Identity resolution and deduplication

Resolution asks whether candidate records represent:

- the same concept;
- related, broader, or narrower concepts;
- different life stages or taxa;
- different crop-use concepts;
- different disease hypotheses;
- duplicate observations;
- duplicate source records; or
- separate statements about the same entity.

A future review process SHOULD:

1. preserve original records and create a resolution case;
2. normalize strings only to generate candidates, retaining originals;
3. compare scientific names with authority, rank, version, authorship, and taxonomic status;
4. compare source identifiers with issuing authority and version;
5. compare contextual identity such as crop use, organism role, life stage, jurisdiction, registration, place, time, method, and provenance;
6. collect supporting, contradicting, and missing evidence;
7. record uncertainty and credible alternative relationships;
8. obtain the required domain, evidence, regulatory, privacy, or data-steward review;
9. record the decision, rationale, reviewer, date, relationship, confidence/status, and reversible lifecycle action; and
10. retain the audit trail and losing candidates.

Automated normalization, exact-string matching, scientific-name matching, or fuzzy matching MAY propose candidates. It MUST NOT silently merge governed identities, observations, source records, statements, or regulatory identities. Conflicts remain visible until authorized resolution.

## Current IRAC boundary

Current IRAC source codes and deterministic export identifiers retain their frozen, source/version-scoped implementation meaning. This policy does not declare them equal to future local concept identifiers, create live mappings, or change parser, schema, exporter, validator, canonical data, or golden expectations.
