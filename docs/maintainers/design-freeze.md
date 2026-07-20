# Design Freeze

Design Freeze preserves named behavior, schemas, datasets, manifests, versions,
and contracts for a scoped change. It prevents an apparently convenient edit from
silently expanding the product or invalidating prior evidence.

Before accepting work, compare its diff with the active sprint freeze and relevant
RAS/ADR. Reject or rescope changes that touch frozen parser/exporter/database
behavior, Runtime semantics, public signatures, contract versions, or knowledge
content without explicit authority. Documentation may clarify frozen behavior but
cannot amend it. An urgent defect still follows the hotfix process and records why
the minimum exception is necessary.
