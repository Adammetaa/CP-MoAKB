# Decision Map

ADR-001 and ADR-002 establish evidence-first traceability and separation among
observation, evidence, regulation, and recommendation. ADR-003 keeps the knowledge
graph conceptual. ADR-004 records a future Thailand-first regulatory context.
ADR-005 through ADR-008 order ontology, identity, vocabulary, and canonical
master-data governance. ADR-009 defines the candidate-record format used by the
constrained YAML boundary.

RAS-001 cites ADR-005 through ADR-009; RAS-003 directly applies ADR-009; RAS-004
applies the identity direction of ADR-006, ADR-008, and ADR-009. Other RAS
documents primarily extend earlier RAS contracts and do not claim a direct ADR
that is absent. See the authoritative [ADR index](../ARCHITECTURE_DECISIONS/README.md)
and [RAS index](../runtime/specifications/README.md).

The [Knowledge Constitution](../knowledge/constitution/knowledge-constitution.md)
is the highest authority within knowledge governance, and the
[KAS index](../knowledge/README.md) applies it to future authoring. Neither
authority supersedes ADRs or creates an implementation contract.

ADR-008 remains the authority for canonical master-data prerequisites and for
claim-, jurisdiction-, version-, and time-scoped source assessment; official
source authority is not universal truth. ADR-009 remains the authority for the
constrained YAML candidate-record format of the Rice pilot. The Constitution and
KAS do not duplicate that format, approve candidate content, or generalize it
into a knowledge schema. RAS-001 through RAS-015 remain the separate normative
Runtime contract family. Design Freeze, Source Policy, and the Publication
Boundary retain authority in their named scopes.
