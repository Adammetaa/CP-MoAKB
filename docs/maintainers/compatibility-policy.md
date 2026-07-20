# Compatibility Policy

Compatibility protects public imports, signatures, return types, typed failures,
deterministic ordering, schemas, projections, envelopes, routes, CLI commands and
exit codes, dependency categories, and documented behavior. The static manifest
is the public-symbol authority.

For every proposed change, run the Runtime compatibility checklist and identify
the owning contract. Preserve old behavior or provide an explicitly governed
migration and version decision. Internal cleanup is acceptable only when contract
tests remain meaningful; weakening tests or reclassifying a symbol is itself a
compatibility change. See RAS-007 through RAS-012.
