# KAS-004: Citation Standard

Status: Active

Version: 1.0

## Purpose

Ensure every cited source can be identified, located, versioned, distinguished
from similar sources, and reviewed within its authority and rights boundaries.

## Scope

This standard governs citation metadata for official documents, journal papers,
books, standards, conference proceedings, government publications, web
resources, DOI-identified works, and versioned or dynamic sources.

## Out of Scope

This standard does not prescribe a visual bibliography style, copy source
content, grant redistribution rights, assess scientific quality, or make a
citation sufficient evidence by itself.

## Normative Language

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative. A citation format MAY vary, but its governed metadata and source
identity MUST remain equivalent.

## Definitions

- **Citation** is an attributed reference to a specific source or source unit.
- **Locator** identifies the relevant page, section, table, figure, record, or
  other bounded unit when available.
- **Persistent identifier** is an authority-managed identifier such as a DOI; it
  does not replace title, version, or publisher review.
- **Retrieval date** records when a mutable resource was accessed. It is distinct
  from publication, issue, revision, and effective dates.
- **Publisher** is the organization responsible for issuing the cited work, not
  necessarily the website currently hosting a copy.

## Governance Rules

Every citation MUST record enough evidence to distinguish the cited source:
responsible author or organization when available, title, publisher or issuing
authority, publication type, version/edition/revision, publication or effective
date when available, stable identifier, source locator, and language where
material. Missing metadata MUST be marked unknown, not invented.

### Source-type requirements

- **Official documents** MUST name the issuing authority, exact document title,
  declared version, effective/release date, official locator, and jurisdiction or
  authority scope. Official availability does not grant redistribution rights.
- **Journal papers** MUST identify authors, article title, journal, year, volume,
  issue or article number where applicable, pages, and DOI when assigned.
- **Books and chapters** MUST identify authors/editors, title, edition, publisher,
  year, chapter and page locator where relevant, and ISBN when useful for
  disambiguation.
- **Standards** MUST identify the standards body, complete designation, edition
  or revision, title, publication date, and amendments/corrections used. A
  standard number without edition is insufficient.
- **Conference proceedings** MUST identify authors, contribution title, event or
  proceedings title, organizer/publisher, location or event mode when material,
  dates/year, pages or paper number, and DOI or repository identifier when
  assigned.
- **Government publications** MUST name the responsible agency, jurisdiction,
  title, publication/series identifier, version, issue/effective date, and
  official source location.
- **URLs** MUST use the most authoritative stable location available. Mutable web
  content MUST include retrieval date and, when feasible, revision identity or an
  approved retained snapshot reference.
- **DOIs** MUST be normalized to a resolvable DOI form and checked against the
  work's title and publisher metadata. A DOI MUST NOT be fabricated from a URL or
  secondary citation.

### Versions, retrieval, and publishers

Authors MUST cite the version actually reviewed. A later edition MUST be a new
source-version event, not silently substituted. Retrieval dates are required for
mutable sources and dynamic databases; they MUST NOT substitute for an unknown
publication or effective date. Mirrors and aggregators SHOULD NOT replace the
original publisher when an official source is available. If only a secondary
location is available, that limitation and chain of custody MUST be recorded.

Citation metadata MUST comply with [Source Policy](../SOURCE_POLICY.md) and the
official-reference redistribution boundary in
[RAS-015](../runtime/specifications/RAS-015-open-source-release-audit-and-publication-boundary-contract.md).

## Examples

- A fictional government circular citation names the issuing agency,
  jurisdiction, circular number, revision, effective date, official URL,
  retrieval date, and exact section supporting the proposed assertion.
- A fictional journal citation includes its DOI and study-page locator, while
  evidence review separately records methods and applicability.

## Non-examples

- `Official website, accessed recently`.
- A DOI copied without checking that it resolves to the cited title.
- Citing a book title without edition or relevant page.
- Using the current URL as proof that an older effective version was reviewed.
- Committing a copyrighted publication because it has a complete citation.

## Reviewer Notes

Reviewers SHOULD resolve the citation to the intended source, verify edition and
publisher, inspect the cited unit, and distinguish source identity from evidence
quality. Rights, privacy, and access restrictions MUST be escalated rather than
inferred from technical availability.

## Future Considerations

Future work may select a citation serialization, controlled publication types,
or snapshot service through separate architecture and rights review. Any mapping
MUST preserve the metadata above and support correction without changing source
identity silently.
