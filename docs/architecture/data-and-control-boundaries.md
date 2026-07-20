# Data and Control Boundaries

Callers supply every Runtime record, registry input, query criterion, service, and
stream. The YAML adapter accepts text, not a path. Query and explanation operate
in memory. Projection returns data or canonical text; it does not write a file.
Composition constructs a facade but does not construct knowledge state.

Legacy parser, exporter, loader, and SQLite builder may perform explicit I/O when
their caller invokes them. They are not implicit Runtime dependencies and must not
be used as hidden composition shortcuts. Official retained sources are repository
governance material, not an installed default knowledge base.

Control remains with the integrator: adapters do not chain validation, registries
do not launch queries, and transports do not own services. RAS-001, RAS-003,
RAS-005, RAS-009, and RAS-012 govern these boundaries.
