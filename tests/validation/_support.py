"""Synthetic constructors shared only by validation tests."""

from __future__ import annotations

from datetime import date

from cpmoakb.domain import (
    CandidateIdentifier,
    CreationProvenance,
    EntityRecord,
    EvidenceReference,
    EvidenceRole,
    Label,
    LabelSet,
    LabelStatus,
    Provenance,
    RecordKind,
    RecordLifecycle,
    RelationshipRecord,
    ScientificName,
    SourceIdentifier,
    SupersessionProvenance,
)


def candidate_id(number: int, kind: str = "E") -> CandidateIdentifier:
    return CandidateIdentifier(f"CPM-CAND-{kind}-{number:06d}")


def provenance(
    *,
    evidence_ids: tuple[str, ...] = (),
    predecessor: CandidateIdentifier | None = None,
) -> Provenance:
    supersession = (
        SupersessionProvenance(predecessor, "Synthetic replacement reason")
        if predecessor is not None
        else None
    )
    return Provenance(
        creation=CreationProvenance(date(2026, 1, 1), "synthetic-role"),
        evidence_ids=evidence_ids,
        supersession=supersession,
    )


def evidence(identifier: str = "synthetic-evidence") -> EvidenceReference:
    return EvidenceReference(
        identifier=identifier,
        source_id=SourceIdentifier("synthetic-source"),
        locator="Synthetic section",
        note="Fictional evidence for mechanical testing.",
        role=EvidenceRole.CONTEXTUAL,
    )


def entity(
    number: int = 990001,
    *,
    preferred: bool = True,
    label_text: str = "Fictional Widget",
    lifecycle: RecordLifecycle = RecordLifecycle.CANDIDATE,
    evidence_items: tuple[EvidenceReference, ...] = (),
    source_ids: tuple[SourceIdentifier, ...] = (),
    record_provenance: Provenance | None = None,
    scientific_name: str | None = None,
    ambiguity_notes: tuple[str, ...] = (),
) -> EntityRecord:
    return EntityRecord(
        identifier=candidate_id(number),
        record_kind=RecordKind.ENTITY,
        domain_type="SyntheticConcept",
        lifecycle=lifecycle,
        labels=LabelSet(
            (
                Label(
                    language="en",
                    text=label_text,
                    status=LabelStatus.PROVISIONAL,
                    preferred=preferred,
                ),
            )
        ),
        scope_note="Fictional entity used only for validation tests.",
        source_ids=source_ids,
        evidence=evidence_items,
        provenance=record_provenance or provenance(),
        ambiguity_notes=ambiguity_notes,
        scientific_name=ScientificName(scientific_name) if scientific_name else None,
    )


def relationship(
    number: int = 990101,
    *,
    subject: CandidateIdentifier | None = None,
    object_: CandidateIdentifier | None = None,
    record_provenance: Provenance | None = None,
) -> RelationshipRecord:
    return RelationshipRecord(
        identifier=candidate_id(number, "R"),
        record_kind=RecordKind.RELATIONSHIP,
        domain_type="SyntheticRelation",
        lifecycle=RecordLifecycle.CANDIDATE,
        labels=LabelSet(
            (
                Label(
                    language="en",
                    text=f"Fictional relation {number}",
                    status=LabelStatus.PROVISIONAL,
                    preferred=True,
                ),
            )
        ),
        scope_note="Fictional relationship used only for validation tests.",
        source_ids=(),
        evidence=(),
        provenance=record_provenance or provenance(),
        subject_id=subject or candidate_id(990001),
        predicate="synthetic_association",
        object_id=object_ or candidate_id(990002),
    )
