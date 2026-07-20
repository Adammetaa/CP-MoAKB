# ADR and RAS Process

An ADR records a durable architectural decision, its context, consequences, and
alternatives. A RAS states reusable normative Runtime requirements and cannot
override an accepted ADR. Not every code change needs either.

Use an ADR when the repository must choose among meaningful architectural paths.
Use a RAS change when a governed cross-implementation contract changes. Link the
decision to contract, public surface, verification, and implementation where that
relationship actually exists. Do not invent an ADR relationship to make a map
look complete. Status or version changes follow existing review governance; see
the [decision map](../governance/decision-map.md).
