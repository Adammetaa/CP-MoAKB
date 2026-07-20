# Adding a Transport

A transport is a sibling adapter over `cpmoakb.application`. It must require an
explicit application service, expose a closed bounded input contract, map errors
without leaking internals, and preserve existing application projections.

It must not call query, explanation, registry, or serialization internals; own
data; discover configuration; persist; fetch; start a production server; or add
authentication policy incidentally. Required tests cover exact public surface,
input bounds, deterministic output, failures, dependency direction, and optional
dependency isolation. A new transport requires architecture review and its own
governed contract; RAS-009 through RAS-013 provide the current pattern.
