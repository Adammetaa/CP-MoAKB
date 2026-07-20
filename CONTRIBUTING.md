# Contributing to CP-MoAKB

Contributions are welcome when they preserve the repository's explicit contracts,
determinism, traceability, and separation between engineering infrastructure and
governed agricultural knowledge.

## Start here

1. Read the [project scope](docs/project/mission-and-scope.md) and
   [doctrine](docs/maintainers/project-doctrine.md).
2. Follow [development setup](docs/contributing/development-setup.md).
3. Classify the proposed change with the
   [change-classification guide](docs/governance/change-classification.md).
4. Read the relevant RAS and ADR before changing a governed boundary.
5. Use fictional synthetic data in tests and examples.
6. Run the verification described in [testing](docs/contributing/testing.md).

## Change boundaries

Documentation corrections and internal implementation changes may be narrow when
they do not alter behavior. Public symbols, signatures, errors, ordering, schemas,
routes, commands, package metadata, or dependency direction require contract and
compatibility review. New architectural decisions require an ADR; reusable
normative Runtime rules require a RAS amendment or new RAS. Agricultural knowledge
requires separate official-source and qualified scientific governance.

Do not bypass Design Freeze to simplify implementation. Do not add hidden data,
filesystem discovery, network fetching, persistence, dynamic plugins, diagnosis,
recommendation, ranking, confidence scoring, or scientific inference without a
separately approved scope.

## Pull requests

Keep changes focused, state which contracts are affected, list validation run,
and identify remaining limitations. Acceptance is not automatic. Reviewers use
the [pull-request review guide](docs/contributing/pull-request-review.md); security
issues follow [SECURITY.md](SECURITY.md), not public exploit discussion.

The complete contributor handbook is at [docs/contributing](docs/contributing/README.md).
