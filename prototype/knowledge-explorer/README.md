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
- [GitHub Pages preview deployment](docs/deployment.md)

## Local build

The zero-dependency build script validates required pages, portable links,
indexing and mock-data boundaries, accessibility landmarks, and prototype
disclaimers. It assembles an allowlisted Pages artifact under ignored
`dist/pages-root/`; it does not start or create a production service.

Deployment identity MUST be supplied from a real Git commit. For a local build,
set `DEPLOY_COMMIT` to `git rev-parse HEAD`, `BUILD_TIMESTAMP` to that commit's
ISO commit time, and `PACKAGE_VERSION` to `0.1.0`, then run the build script with
Node.js. Run the artifact verifier and subpath smoke test afterward. The
[deployment guide](docs/deployment.md) contains platform-neutral examples and
the owner-controlled publication procedure.

The prepared workflow does not make the preview live by repository presence
alone. It requires owner approval, a push to `main`, and GitHub Pages configured
to use GitHub Actions.
