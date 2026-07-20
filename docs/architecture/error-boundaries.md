# Error Boundaries

Domain, adapter, validation, registry, query, explanation, serialization, and
application packages expose typed errors appropriate to their contracts. The
application facade preserves known Runtime failures and wraps defects in injected
projection dependencies. Transports classify failures without exposing internal
exception text.

HTTP returns fixed status/code/message envelopes. CLI returns governed exit codes
and writes exactly one error document to stderr. Neither exposes tracebacks,
representations, class/module names, or local paths. Unsupported input is not
silently coerced or converted to success.

Integrators should catch the public typed error at the boundary they call and
must not parse private messages as a stable API. RAS-008 through RAS-011 and
RAS-013 define these policies; focused application, HTTP, CLI, and security tests
verify them.
