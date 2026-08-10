# Website Views and Traceability

## Website Knowledge Views

- `WV-RDW1-ORANGE-001/v1` consumes `CKP-RDW1-ORANGE-001/v1`.
- `WV-RDW1-GRASSY-STUNT-001/v1` consumes `CKP-RDW1-GRASSY-STUNT-001/v1`.

Both views are Thai-first, rights-safe, internal preview representations with
status `not_published`. They may show independently authored summaries, governed
identities, the source-attributed vector association, exact locator metadata,
review state, and limitations. Empty unsupported fields are omitted.

## Traceability

Forward example:

> PDF page 7 / printed page 1-2 / section 2.2.2 / `P7-S2.2.2-B` ->
> `EV-RDW1-001/v1` -> `CL-RDW1-001/v1` / `CL-RDW1-002/v1` ->
> canonical Concepts and `RL-RDW1-001/v1` -> `CKP-RDW1-ORANGE-001/v1` ->
> `WV-RDW1-ORANGE-001/v1` -> Knowledge Explorer

The second subject follows the equivalent path through `P7-S2.2.2-C`. Reverse
navigation resolves every Website View through its CKP member, Claim, Evidence,
Source identity, and exact locator. Batch 001 remains unchanged and valid.
