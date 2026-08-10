# Knowledge Extraction Specification

Status: Active

Version: 1.0

## Mandatory Pipeline

> Source -> Section -> Relevant Passage -> Citation -> Evidence Candidate ->
> Evidence Review -> Claim Candidate -> Claim Review -> Concept Candidate ->
> Terminology Candidate -> Relationship Candidate -> Knowledge Objects ->
> Package Membership Proposal -> Review Queue

No stage may skip another. A stage may produce zero candidates and stop; it may
not manufacture an output to keep the pipeline moving. Rejection, return,
ambiguity, and unresolved states remain recorded.

## Stage Contract

Each stage receives fixed reviewed inputs, records author role, exact versions,
scope, decisions, limitations, rights, unresolved issues, and outputs, and hands
off only through an explicit review disposition. Candidate never means accepted.

## Permanent Separations

Evidence is not Claim. Claim is not Concept. Concept is not Package. Package is
not Publication. Terminology is not identity. Relationship is not adjacency.
Observation is not Evidence, Diagnosis, or Recommendation.

## Implementation Neutrality

KES defines no fields, schema, serialization, class, API, parser, registry,
validator, workflow engine, queue implementation, AI extraction, or user interface.
