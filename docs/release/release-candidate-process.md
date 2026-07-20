# Release Candidate Process

1. Select and review the exact candidate commit.
2. Confirm distribution and every independent contract version.
3. Review public API, compatibility, dependencies, advisories, and action pins.
4. Run lint, format, type, focused/full tests, and all repository verifiers.
5. Build wheel and sdist twice and compare governed contents.
6. Verify editable, wheel, sdist, core-only, and HTTP-extra installs.
7. Inspect release notes, license, security policy, docs, and limitations.
8. Remove generated outputs and confirm a clean worktree.
9. Stop for explicit publication approval.

The machine-readable readiness manifest records stable declarations, not transient
run identifiers or a second version authority.
