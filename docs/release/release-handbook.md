# Release Handbook

A release candidate is a reviewed commit with confirmed version authorities,
compatibility, dependencies, security evidence, complete documentation, tests,
deterministic artifacts, and isolated-install evidence. Start from a clean
worktree, run the readiness checklist, and preserve the exact results in the
review record or release notes.

Do not place credentials in commands or documentation. Preparation ends after
artifact verification. Tagging, GitHub Release creation, and package publication
are external state changes requiring explicit final approval; no repository
workflow performs them automatically.
