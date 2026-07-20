# Security Model

CP-MoAKB is a deterministic library, not a production security boundary. Its
public attack surface is limited to explicit Python imports, an injected
application facade, four existing HTTP routes, and the library-first CLI parser.
It has no default knowledge base, server executable, authentication, persistence,
telemetry, plugin discovery, or environment configuration.

Security rests on strict typed inputs, bounded text/tag/index values, fixed error
classifications, canonical JSON without arbitrary fallback, mandatory dependency
injection, exact public exports, pinned direct dependencies, immutable CI action
references, and verified artifact exclusions. Imports and composition create no
service or registry and perform no filesystem, network, or secret access.

The HTTP adapter accepts only `GET /health`, `POST /v1/query`,
`POST /v1/query-and-explain`, and `GET /openapi.json`. Interactive docs are
disabled. Pydantic strict mode forbids unknown fields and coercion. Framework-safe
responses handle malformed JSON and unsupported methods. Request-body byte limits,
rate limiting, TLS, proxy policy, and network availability are deployment duties.

The CLI accepts only bounded primitive arguments for its three existing commands.
It accepts no paths, URLs, files, YAML, arbitrary JSON, plugins, or hidden
`sys.argv`; callers inject argument vectors, service, stdout, and stderr.
