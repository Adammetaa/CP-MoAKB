# Observation Provenance

Status: Active

Version: 1.0

## Purpose

Define the traceability needed to reconstruct an Observation's origin, custody,
context, transformations, versions, review, and later use.

## Provenance Principle

Provenance explains where an Observation account came from and what happened to
it. It MUST NOT be treated as proof that the observed Result is correct,
representative, causal, diagnostically sufficient, recommended, or a hypothesis.

## Provenance Responsibilities

Observation provenance SHOULD make reviewable:

- Observation identity and exact version;
- observer, reporter, instrument, recorder, and custodian responsibilities;
- capture time, recording time, transfer time, and review time where relevant;
- declared method, instrument or medium, context, and limitations;
- original Source identity, Source version, locator, access, integrity, and
  rights or consent status;
- every transcription, translation, unit conversion, normalization, redaction,
  privacy generalization, extraction, or other transformation;
- transformation rule and version, input, output, responsible actor or process,
  rationale, and known information loss;
- corrections, disputes, withdrawals, supersession, retirement, and archive;
- reviewer identity, competence basis, conflicts, Findings, Decisions, and dates;
  and
- later Evidence Objects, Claims, Assets, Packages, Representations, or
  Publications that relied on the Observation.

These responsibilities are conceptual and do not define fields or storage.

## Chain of Custody

Each custody transfer MUST identify the exact Observation version transferred,
the responsible parties or processes, time, authority, integrity evidence where
applicable, access boundary, and any transformation. A missing link MUST remain
an explicit provenance gap.

## Source and Evidence Separation

The Source Object governs identity and custody of the record through which an
Observation is known. The Observation Object governs the contextual descriptive
account. The Evidence Object governs how exact Source content is evaluated for a
Claim. Provenance MUST connect these objects without collapsing them.

```text
Capture responsibility
  -> Observation Object and exact version
    -> Source Object, locator, custody, and rights
      -> Evidence Object for one exact Claim
```

The sequence is traceability, not automatic promotion. Every transition requires
its own governed responsibility and human review.

## Corrections and History

Corrections MUST append or link a corrected version and rationale. Original
content and prior reliance MUST remain auditable. Withdrawal or rights restriction
MUST NOT erase the fact that an earlier review relied on the Observation, subject
to lawful privacy and access controls.

## Determinism

A reviewer using the same preserved inputs, transformation rules, and versions
MUST be able to reconstruct the same provenance chain and identify every declared
loss or unresolved gap. Provenance ordering SHOULD use event sequence and stable
identity rather than mutable filenames or display labels.

## Human Review

Competent reviewers MUST assess provenance completeness, integrity, rights,
method attribution, dependency, and transformation fidelity separately from the
scientific relevance of the Observation. Unverifiable provenance MAY block
Evidence use but MUST NOT be repaired by assumption.

## Crop Independence

Provenance roles MUST remain stable across domains. Domain-specific Sources,
methods, instruments, or terminology MAY be referenced without changing the
architecture.

## Fictional Example

Fictional Observation O-Lantern traces from Observer A-Pale through Source
S-Lantern version S2, one declared translation, and Review V-Clear. A missing
instrument-state record is preserved as a gap.

## Non-example

A copied image with no source, time, custody, rights, or transformation history
is labelled verified because it appears repeatedly. Repetition MUST NOT repair
missing provenance.

## Future Implementation Considerations

Future custody logs, integrity mechanisms, privacy controls, or provenance graphs
require separate engineering and governance approval. This document selects no
technology and authorizes no automated inference.
