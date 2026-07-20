# CP-MoAKB Knowledge Explorer Prototype

This dependency-free static prototype demonstrates the intended product
experience of CP-MoAKB. It is product vision, information architecture, UX, UI,
navigation, and fictional placeholder data—not production software.

## Prototype boundaries

- No backend, Runtime, database, API, authentication, login, persistence, AI,
  diagnosis, recommendation, or production server exists here.
- All concepts, authorities, sources, counts, dates, relationships, and search
  results are explicitly fictional placeholders for navigation demonstration.
- The prototype does not claim that Rice Blast or any other example is approved
  CP-MoAKB knowledge.
- Governance labels demonstrate presentation only; they do not record actual
  review, acceptance, or publication.

## Explore

Open `index.html` through a static file server. The prototype includes Home,
Search, Browse, Concept, Evidence, Source, Authority, Governance, About, and a
component-library page. Shared navigation, responsive layouts, search behavior,
filter controls, tabs, breadcrumbs, and mobile menus are implemented in static
HTML, CSS, and JavaScript.

## Product documentation

- [Information architecture](docs/information-architecture.md)
- [User personas](docs/personas.md)
- [Responsive wireframes](docs/wireframes.md)
- [Visual design system](docs/design-system.md)

## Local build

The zero-dependency build script validates required pages, mock-data boundaries,
links, accessibility landmarks, and prototype disclaimers, then copies the
static source into ignored `dist/knowledge-explorer/` output. It does not start
or create a production service.
