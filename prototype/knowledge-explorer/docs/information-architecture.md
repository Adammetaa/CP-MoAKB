# Information Architecture

## Product promise

A first-time visitor should understand within 30 seconds that CP-MoAKB is a
governed, evidence-first scientific knowledge platform: it separates concepts,
evidence, authority, and lifecycle rather than offering diagnosis or advice.

## Site map

```text
Knowledge Explorer
├── Home
│   ├── Search
│   ├── Featured domains
│   ├── Governance status
│   ├── Latest placeholder concepts
│   └── Latest placeholder sources
├── Search
│   ├── Query and recent searches
│   ├── Faceted placeholder results
│   └── Result → Concept / Evidence / Source / Authority
├── Browse
│   └── Rice → Growth Stage → Plant Structure → Disease → Insect
│       → Weed → Abiotic → Pathogen → IRAC → FRAC → HRAC
├── Concept
│   ├── Definition and names
│   ├── Evidence and references
│   ├── Authority and lifecycle
│   ├── Relationships and ontology position
│   └── Related concepts
├── Evidence
├── Source
├── Authority
├── Governance
│   └── Constitution / KAS / KGS / ADR / RAS / Project Principles
├── About
│   └── Mission / Vision / Architecture / Roadmap
└── Components
```

## Knowledge navigation

Knowledge navigation begins with a question or domain and progressively reveals
meaning, provenance, authority, uncertainty, relationships, and lifecycle. A
concept is never presented as an isolated fact. Persistent breadcrumbs preserve
orientation; adjacent links connect concept, evidence, source, and authority.

## Domain navigation

Browse uses a demonstrative sequence rather than a production taxonomy. Each
domain card states that it is a placeholder and shows how a future reviewed
hierarchy could expose scope and child concepts without implying completeness.

## Cross-navigation

Every knowledge card provides typed routes: `Concept`, `Evidence`, `Source`,
`Authority`, or `Governance`. Relationship chips name the relationship instead
of relying on proximity. Backlinks expose where an item is referenced.

## Search journey

1. Enter a term or select a recent/popular placeholder query.
2. Scan grouped results with type, lifecycle, authority, and evidence facets.
3. Open a concept and verify its status before reading detail.
4. Follow evidence, source, and authority links.
5. Return to results with query and filters retained in the URL only.

## Evidence journey

`Concept → evidence summary → evidence record → source locator → authority scope`

The interface distinguishes source status, evidence level, and knowledge
acceptance. It never turns presence of evidence into diagnosis or advice.

## Authority journey

`Concept → attributed authority → authority scope → source publications → related claims`

Authority views foreground jurisdiction, version, time, competence, and limits.
Official status is not displayed as universal truth.

## Navigation principles

- Global navigation answers where the visitor is.
- Breadcrumbs answer how the visitor arrived.
- Typed links answer what kind of relationship follows.
- Status labels answer whether content is placeholder, candidate, accepted, or
  published; this prototype uses placeholder only.
- Mobile navigation preserves the same information architecture rather than
  hiding governance or evidence.
