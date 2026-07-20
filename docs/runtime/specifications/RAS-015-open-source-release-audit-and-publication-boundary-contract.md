# RAS-015: Open-Source Release Audit and Publication Boundary Contract

Status: Active

Version: 1.0

## Purpose and release-candidate scope

This specification governs deterministic audit and preparation of a candidate
without publishing it. Package, Runtime, schema, projection, application,
transport, and composition authorities remain independent. The current identity
is an initial open-source release candidate for package `0.1.0`; Design Freeze
`v1.0` and schema/projection `1.0` do not authorize a package or tag named v1.0.

## Audit and artifact authority

Authoritative values come from implementation constants, `pyproject.toml`, the
public API manifest, example manifest, release-readiness manifest, and this
specification chain. The release-candidate manifest is a deterministic
cross-check, never a new version authority. A candidate artifact is only the
wheel or sdist built from the approved commit and verified against RAS-012 and
RAS-013.

## Compatibility, documentation, and security requirements

Preparation MUST NOT change frozen behavior, dependencies, public symbols,
routes, commands, errors, schemas, or versions. Documentation and release notes
MUST state actual capability, alpha and non-production limitations, and
publication state. Workflows MUST retain read-only permissions, immutable action
pins, no secrets, no OIDC/package writes, and no release automation. Security
issues requiring confidential handling MUST stop public preparation.

## License and attribution requirements

The repository license expression and included license text MUST agree.
Third-party dependencies and actions retain their own licenses. Attribution MUST
come from repository evidence and MUST NOT invent people, dates, notices, or
legal conclusions. The audit is engineering evidence, not legal certification.

## Official Reference Material Boundary

CP-MoAKB governs agricultural knowledge provenance, not redistribution rights in
official publications. Without explicit documented redistribution permission,
copyrighted PDFs, Office documents, scans, spreadsheets, and archives MUST NOT be
tracked, packaged, mirrored, attached, or included in a release source state.

The repository MUST retain source identity, publisher, version, provenance,
expected filename, SHA-256, byte size where stable, parser assumptions, and
golden expectations. Retrieval instructions MUST point to the official publisher
and state the local ignored placement. A development-only retrieval tool MAY use
a fixed official URL, but MUST download through a temporary file, verify exact
identity before placement, fail closed on change, and remain outside Runtime.
Offline release verification MUST prove that metadata and expectations remain
internally consistent and that prohibited publications are absent. Full
source-dependent parser regression requires a locally retrieved verified copy;
its absence MUST be explicit and MUST NOT alter the frozen parser.

## Reproducibility and clean-room verification

Repeated builds MUST use governed inputs and compare normalized paths, metadata,
and member content. Verification MUST inspect exclusions and exercise editable,
wheel, sdist, core-only, and HTTP-extra installation without publication. Scripts
MAY use subprocesses only in development verification, with fixed argument lists,
repository-bounded paths, captured failures, and no shell execution.

## Release-note claims and publication-state model

Candidate documents MUST use `not_published` until an independently verified
external event changes state. They MUST NOT claim production readiness,
diagnosis, recommendation, ranking, confidence, scientific inference, AI/LLM,
real bundled knowledge, signing, or package-index availability. Historical tags
MUST not be reinterpreted as package versions without an owner decision.

## Explicit approval gates and boundaries

Release-candidate acceptance, version/tag terminology, Git tag creation, GitHub
Release creation, artifact upload, and package-index publication are six separate
gates. No gate implies the next. Repository preparation MUST stop before tag,
release, upload, credentials, or publication. Rollback MUST preserve evidence and
MUST NOT silently rewrite public history or move published identity.

## Deterministic verification and prohibited automation

The release verifier MUST cross-check authorities, docs, examples, security,
artifact policy, official-reference exclusion, and approval boundaries with
stable output. Write-enabled release workflows, tokens, trusted publishing,
automatic tags, automatic Releases, and automatic uploads are prohibited.

## Non-goals and relationships

This contract adds no Runtime capability, deployment, corpus, signing, legal
advice, or publication mechanism. RAS-007 protects public compatibility;
RAS-008 through RAS-012 protect projection, application, transports, packaging,
and composition; RAS-013 protects security/release readiness; RAS-014 protects
documentation and examples. RAS-015 narrows candidate audit and external action
boundaries without overriding them.

## Future amendments

A future release MAY amend versions, artifact policy, or publication method only
through an explicit reviewed contract change. Rights evidence for a reference
MUST be recorded before any redistribution exception. No future convenience may
retroactively convert a prepared candidate into an approved publication.
