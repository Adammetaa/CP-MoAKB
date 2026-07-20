# Knowledge Explorer GitHub Pages Preview Deployment

## Status and Purpose

This document defines the prepared public-preview architecture for the static
Knowledge Explorer. It does not claim that GitHub Pages is enabled or that the
preview is live. The preview demonstrates product vision using fictional
placeholder content; it is not a production application or knowledge release.

Expected URL after owner approval, push, successful workflow completion, and
Pages enablement:

`https://adammetaa.github.io/CP-MoAKB/knowledge-explorer/`

The exact URL reported by the successful GitHub Pages deployment is
authoritative.

## Deployment Architecture

```text
prototype/knowledge-explorer source
  → deterministic static build and boundary validation
  → pages-root/index.html
  → pages-root/knowledge-explorer/
  → official upload-pages-artifact action
  → official deploy-pages action
  → github-pages environment
```

The workflow is
`.github/workflows/knowledge-explorer-pages.yml`. It uses only official GitHub
actions, pinned to immutable commit SHAs with their stable major versions
documented in comments. The build has read-only repository permission. The
deployment job alone receives `pages: write` and `id-token: write`, as required
by GitHub Pages.

The implementation follows GitHub's official
[custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and the official
[configure-pages](https://github.com/actions/configure-pages),
[upload-pages-artifact](https://github.com/actions/upload-pages-artifact), and
[deploy-pages](https://github.com/actions/deploy-pages) actions.

## Workflow Triggers

The workflow runs on:

- a push to `main` that changes the prototype, deployment tests, or the workflow;
- an explicitly started `workflow_dispatch` run.

A local commit, pull request, passing test, or uploaded non-Pages artifact does
not publish the preview.

## Artifact Boundary

The deployable artifact is allowlisted:

```text
pages-root/
├── index.html
├── robots.txt
└── knowledge-explorer/
    ├── index.html
    ├── search.html
    ├── browse.html
    ├── concept.html
    ├── evidence.html
    ├── source.html
    ├── authority.html
    ├── governance.html
    ├── about.html
    ├── components.html
    ├── deployment.json
    └── assets/
        ├── app.js
        ├── styles.css
        ├── og.png
        └── data/mock-knowledge.json
```

The verifier rejects missing or unexpected files, symbolic links, local paths,
credentials, secret expressions, private-key material, absent prototype notices,
unsafe deployment metadata, or mock data without `fictional-placeholder`
status. Repository source, Python packages, test fixtures, official references,
and internal release evidence are not copied.

## Deployment Identity

The workflow derives deployment identity from `GITHUB_SHA` and the ISO timestamp
of that exact commit. It writes `knowledge-explorer/deployment.json` with:

- deployment mode `preview`;
- prototype `knowledge-explorer`;
- the full 40-character commit SHA;
- deterministic commit timestamp;
- governed package version `0.1.0`;
- status `fictional-placeholder`.

The Explorer footer displays the short revision, timestamp, and package version.
The workflow MUST inject the real SHA; the build refuses missing, shortened, or
fabricated identity.

## Indexing Decision

The Project Owner has not authorized Explorer indexing in this sprint. Every
Explorer page therefore contains `noindex,nofollow`, and `robots.txt` disallows
`/CP-MoAKB/knowledge-explorer/`. The minimal project landing page may be crawled.
Changing this policy requires explicit owner approval and a reviewed change.

## Local Validation

Use an installed Node.js runtime and real local commit identity:

```text
DEPLOY_COMMIT=<git rev-parse HEAD>
BUILD_TIMESTAMP=<git show -s --format=%cI HEAD>
PACKAGE_VERSION=0.1.0
node scripts/build.mjs
node scripts/verify-pages-artifact.mjs dist/pages-root
node scripts/smoke-test.mjs
```

The smoke test starts a loopback-only temporary static server and requests the
artifact through `/CP-MoAKB/knowledge-explorer/`. It verifies every page, CSS,
JavaScript, social image, mock JSON, deployment metadata, internal link scope,
and placeholder status. It closes the server after the test.

## Required GitHub Pages Setting

Before the first deployment, the Project Owner MUST confirm:

`Repository → Settings → Pages → Build and deployment → Source → GitHub Actions`

Do not assume this setting is active. No custom domain, credential, paid service,
organization administration, or repository visibility change is required by the
prepared workflow. If GitHub reports otherwise, stop and obtain owner direction.

## Manual Deployment Procedure

After explicit owner approval:

1. Push the reviewed deployment commit to `main`.
2. Confirm Pages uses **GitHub Actions** as its source.
3. Allow the path-filtered push run to start, or select **Knowledge Explorer
   Pages Preview** under Actions and use **Run workflow** on `main`.
4. Confirm the build, artifact-boundary verification, subpath smoke test, upload,
   and deployment jobs succeed.
5. Use the `page_url` reported by the deploy job and verify
   `/knowledge-explorer/` plus `deployment.json` against the intended commit.
6. Only then describe the preview as live.

## Rollback and Disablement

Rollback MUST avoid destructive branch rewriting:

- revert the deployment commit and allow the resulting `main` workflow to
  deploy the prior governed content;
- where GitHub supports it, manually redeploy a prior successful Pages artifact
  after confirming its commit identity;
- disable Pages in repository settings to remove the public preview;
- remove or disable the workflow through a reviewed commit to stop future
  deployments.

For a harmful public defect, disable Pages first when necessary, preserve the
workflow and deployment records, then prepare the minimum reviewed correction.

## Preview, Release, and Production

| Term | Meaning |
| --- | --- |
| Preview | Public static product-vision interface containing fictional placeholder content. |
| Release | A separately governed repository, software, knowledge, or artifact publication event. This preview is not one. |
| Production | An operational service with approved content and service controls. No production application exists here. |

The preview MUST NOT be described as diagnosis, recommendation, real knowledge,
a production API, a package release, or evidence that future features exist.

## How to Verify the Deployed Commit

Fetch `knowledge-explorer/deployment.json` from the successful Pages URL. Confirm
that `deployment_mode` is `preview`, `status` is `fictional-placeholder`, and
`commit` equals the reviewed workflow revision. Compare the GitHub Actions run's
source SHA and environment deployment record. A mismatch requires disabling or
rolling back the preview; it MUST NOT be explained away as a cache issue without
evidence.
