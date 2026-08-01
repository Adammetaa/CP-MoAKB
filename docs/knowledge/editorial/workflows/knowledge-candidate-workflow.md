# Knowledge Candidate Workflow

Status: Active
Version: 1.0

## Purpose
Prepare an evidence-backed candidate for governed review without defining a schema.

## Scope
Concept, terminology, relationship, evidence, and source candidates.

## Out of Scope
This workflow MUST NOT allocate production identity, create data formats, or promote content.

## Authority
It is subordinate to the [handbook](../knowledge-editorial-handbook.md),
[KAS-002](../../KAS-002-knowledge-record-standard.md), [KAS-007](../../KAS-007-knowledge-lifecycle.md),
and [ADR-009](../../../ARCHITECTURE_DECISIONS/ADR-009-canonical-candidate-record-format-for-rice-pilot.md).
ADR-009 governs format only where its Rice pilot applies.

## Definitions
A **concept candidate** proposes identity and meaning; **terminology candidate** a
label assertion; **relationship candidate** a semantic edge; **evidence candidate**
a bounded source interpretation; **source candidate** an identifiable work.

## Responsibilities
Author prepares; specialist reviewers assess their scopes; Domain Editor coordinates;
governance decides applicable acceptance. Notes MUST identify role, not imply authority.

## Procedure
1. Declare candidate class and label-independent candidate identity.
2. State record type, preferred and alternative terms, definition, scope,
   exclusions, disambiguation, and authority scope as applicable.
3. Link evidence references and separately nominate relationships.
4. Record unresolved issues, lifecycle status, author notes, reviewer notes, and change history.
5. Route terminology, evidence, scientific, ontology, and governance questions to competent reviews.
6. Revise without erasing rejected wording or dissent.

## Required Inputs
Candidate class, evidence items, intended meaning, identity custody, author role,
and applicable authority.

## Required Outputs
A reviewable editorial package containing the listed responsibilities and links;
the package MUST NOT be interpreted as an implementation field definition.

## Review Points
Identity, class, definition, scope, exclusions, authority, evidence, relationships,
unresolved issues, lifecycle, and history.

## Failure Modes
Label identity, mixed candidate classes, hidden uncertainty, duplicated relationship
facts, unsupported terms, invented authority, or treating validation as acceptance.

## Examples
A fictional concept candidate MAY link a separate non-causal relationship candidate.

## Non-examples
A YAML sample generalized from ADR-009 into a universal schema is prohibited.

## Escalation
Identity conflicts follow ADR-006 governance; semantic disputes go to competent
review; unresolved authority conflicts go to KGS-004.

## Audit Requirements
Preserve identity custody, evidence links, notes by role, decisions, revisions,
rejections, status changes, and supersession.

## Change Control
This workflow MAY change only without duplicating or superseding ADR-009.

## Future Considerations
Future templates require separate approval and remain implementation-neutral.
