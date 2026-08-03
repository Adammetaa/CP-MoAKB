# CP-MoAKB Knowledge Lab Static Prototype

Status: Static fictional prototype
Version: 0.0.0-private

## Purpose

This directory makes the governed Knowledge Workspace Blueprint visible and
testable as a Thai-first, bilingual, dependency-free set of static pages. It
demonstrates future authoring, review, finding, acceptance, release-preparation,
and audit experiences. It is not the future implementation.

## Architecture

Fifteen committed HTML pages contain complete Thai fallback content. One local
stylesheet supplies responsive and accessible presentation. A small local
JavaScript enhancement switches selected interface copy between Thai and English,
changes mock role views, opens the mobile menu, and demonstrates inert actions.
Local JSON files contain paired translations and fictional interface fixtures.

There is no backend, database, API, authentication, authorization software,
workflow persistence, analytics, AI, diagnosis, recommendation, or publication
integration. `localStorage` is used only for a language preference and stores no
knowledge or workflow state. Runtime behavior and public APIs are untouched.

## Screen Map

The prototype includes Dashboard, My Tasks, Inbox, Source Candidates, Evidence,
Candidates, Candidate Detail, Review Queue, Review Detail, Finding Resolution,
Acceptance Gate, Release Package, Audit History, Governance Reference, and the
Component Library. See [information architecture](docs/information-architecture.md).

## Role Views

The role switcher demonstrates Knowledge Author, Scientific Reviewer, Evidence
Reviewer, Terminology Reviewer, Ontology Reviewer, Governance Reviewer, Release
Editor, Project Owner, and Read-only Observer views. It filters only committed
mock cards; it is not a permission, identity, authentication, or authorization
control.

## Fictional Data Boundary

Every mock object declares `fictional-placeholder`. Subject Alpha, fictional
identifiers, authority, source, evidence, claim, decisions, and audit events have
no real-world referent. They are not agricultural knowledge, real publications,
real authorities, regulations, organisms, crops, conditions, chemicals,
diagnosis, or recommendations. Uploaded PDF content was not used.

## Thai-first and No-JavaScript Behavior

Every raw page begins with `lang="th"`, Thai navigation, a Thai heading,
nonempty critical content, and a prototype boundary notice. JavaScript is an
enhancement; disabling it leaves the workspace understandable. English switching
does not create authoritative terminology. English is preserved for identifiers,
lifecycle and review codes, scientific names, standards, specifications, version
strings, IRAC, FRAC, HRAC, and BBCH where applicable.

## Static Build and Local Preview

From this directory, use an installed Node.js runtime:

```text
npm run verify
npm run verify:localization
npm run build
npm run smoke
```

The build creates the ignored `dist/knowledge-lab/` directory. The smoke test
serves that artifact only on loopback under `/CP-MoAKB/knowledge-lab/` and then
shuts down. These commands do not deploy, host, push, tag, release, or publish.

## Testing

Repository documentation tests inspect page existence, static Thai fallbacks,
links, boundaries, roles, finding classes, mock-data safety, dependencies,
subpath-safe assets, API count, and protected engineering paths. Node verification
checks the same static artifact before a build or smoke test.

## Explorer Relationship

Knowledge Lab represents the proposed unpublished write/review side. Knowledge
Explorer remains the read side for separately approved public knowledge. Lab
acceptance is not publication, and this prototype has no transfer mechanism.

## Governance Boundary

The prototype is subordinate to the Knowledge Constitution, KAS, KGS, Editorial
Handbook, Review Framework, Templates, ADR, RAS, Design Freeze, Source Policy,
Evidence Levels, Publication Boundary, and Workspace Blueprint. Static controls
do not grant competence, authority, acceptance, or publication power.
