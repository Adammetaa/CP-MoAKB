# Architecture Extension Boundaries

Safe extensions begin with a classified requirement and the existing public
contract. Internal refactoring may proceed when observable behavior stays fixed.
New parser formats belong at an explicit parser/adapter boundary; validation rules
require stable identifiers and tests; transports must depend on the application
facade and cannot own knowledge state.

Changes to public APIs, semantics, dependency direction, schemas, routes, commands,
or artifacts require RAS and compatibility review. A durable architectural choice
not already decided requires an ADR. Agricultural records, terminology, or claims
require the separate Knowledge Track and official-source review.

There is no governed plugin system, persistence adapter, identifier allocator,
production deployment, diagnosis, or recommendation extension point. Do not
simulate one by subclassing internals. See the [contributor architecture guide](../contributing/architecture-changes.md)
and existing [Runtime extension boundaries](../runtime/extension-boundaries.md).
