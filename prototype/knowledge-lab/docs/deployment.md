# Knowledge Lab GitHub Pages Preview Integration

Status: Prepared preview integration; not deployed by this sprint
Version: 1.0

## Public Preview Purpose and URL

The prepared public-preview architecture adds the static Knowledge Lab beside
the existing Knowledge Explorer in one owner-controlled GitHub Pages artifact.
If an owner pushes the workflow commit and GitHub Pages deploys it successfully,
the intended URL is:

`https://adammetaa.github.io/CP-MoAKB/knowledge-lab/`

Repository presence does not mean that URL is live. This sprint does not push,
host, deploy, release, or publish.

## Explorer Relationship

The project root offers two Thai-first paths. Knowledge Explorer is the read-side
prototype. Knowledge Lab is the unpublished authoring and review prototype.
Neither is production software. Acceptance displayed in Lab is not publication,
and no automatic content transfer exists between the prototypes.

## Combined Artifact Composition

The single exact allowlist contains 40 files:

- two root files: `index.html` and `robots.txt`;
- seventeen Explorer files under `knowledge-explorer/`;
- twenty-one Lab files under `knowledge-lab/`.

The Lab portion contains fifteen HTML pages, five local assets, and one generated
`deployment.json`. It excludes source documentation, scripts, package metadata,
tests, Python packages, repository internals, caches, official reference PDFs,
uploaded source material, databases, CSV files, and source maps.

## Workflow Triggers and Architecture

The existing `.github/workflows/knowledge-explorer-pages.yml` remains the only
Pages deployment workflow. Pushes to `main` trigger it only when the workflow,
Explorer source, Lab source, or deployment tests change. An owner may also use
`workflow_dispatch`.

The build job verifies Explorer localization and behavior, verifies and builds
Lab, runs the standalone Lab subpath smoke test, assembles the combined artifact,
enforces the allowlist, and runs the combined Explorer/Lab smoke test. Only then
may the separate deploy job enter the `github-pages` environment.

The workflow uses only immutably pinned official GitHub actions. Global
permissions are `contents: read`; only the deploy job adds `pages: write` and
`id-token: write`. Checkout persistence remains disabled and no repository
secret is consumed.

## Deployment Metadata

The build reads `github.sha` through `GITHUB_SHA` and passes it as
`DEPLOY_COMMIT`. Lab metadata contains exactly `deployment_mode: preview`,
`prototype: knowledge-lab`, the 40-character commit, `package_version: 0.1.0`,
and `status: fictional-placeholder`. No local script invents a deployment SHA.

## Indexing Policy

Every Lab page carries `noindex,nofollow`. Root `robots.txt` disallows
`/CP-MoAKB/knowledge-lab/` while preserving the existing Explorer rule. The root
landing remains indexable, Thai-first, JavaScript-free, and free of redirects.

## Prototype Boundaries

Every deployed Lab page receives a visible notice stating static prototype,
fictional placeholder content, no real permissions, no workflow execution,
candidate is not accepted knowledge, acceptance is not publication, and no
diagnosis or recommendation. Demonstration controls change browser presentation
only and never perform review, acceptance, authorization, or publication.

## Local Preview and Verification

Use the repository's installed Node.js runtime. First verify and build Lab from
`prototype/knowledge-lab`, then provide actual local Git commit evidence to the
combined build from `prototype/knowledge-explorer`:

```text
node scripts/verify-prototype.mjs
node scripts/verify-localization.mjs
node scripts/build.mjs
node scripts/smoke-test.mjs

DEPLOY_COMMIT=<actual-40-character-git-sha>
BUILD_TIMESTAMP=<actual-commit-timestamp>
PACKAGE_VERSION=0.1.0
node scripts/build.mjs
node scripts/verify-pages-artifact.mjs dist/pages-root
node scripts/smoke-test.mjs
```

The smoke server binds only to loopback, checks `/CP-MoAKB/knowledge-explorer/`
and `/CP-MoAKB/knowledge-lab/`, and shuts down after verification. Build outputs
are ignored local artifacts and must not be committed.

## Required GitHub Pages Setting

An authorized repository owner controls Settings → Pages → Build and deployment
→ Source → GitHub Actions. This documentation does not claim that Pages is
enabled, that the current commit is deployed, or that repository visibility was
changed.

## Rollback and Disablement

Rollback requires an owner-authorized repository change that restores a previous
known-good workflow and artifact composition, followed by the same validation.
Disabling only the Lab preview requires removing its landing link, allowlist and
assembly entries, workflow trigger, and robots rule together while preserving
Explorer verification. Disabling the whole preview is an owner-controlled Pages
setting or workflow decision. History must not be rewritten.

## Prototype, Future Implementation, and Production

- **Prototype:** committed static HTML, local assets, fictional data, inert UI
  demonstrations, and preview metadata.
- **Future implementation:** separately authorized architecture for identity,
  permissions, persistence, workflow, governance operations, and security.
- **Production:** an independently approved, operated, monitored, secured, and
  published service. Neither this integration nor the preview is production.

## Change Control

Changes require product, localization, accessibility, security, Pages artifact,
knowledge-governance, and Publication Boundary review. Deployment remains an
explicit owner action after the local commit.
