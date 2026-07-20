# Extension Boundary

This example is intentionally documentation-only because the current public API
does not define a plugin, persistence, diagnosis, recommendation, or arbitrary
transport extension mechanism.

Before extending, classify the change, identify the owning RAS/ADR, and decide
whether it is internal, public, semantic, architectural, or Knowledge Track work.
Safe implementations depend on public protocols and explicit caller inputs; they
do not subclass internal helpers, discover plugins, or create default state.

See [architecture extension boundaries](../../docs/architecture/extension-boundaries.md)
and [architecture changes](../../docs/contributing/architecture-changes.md).
