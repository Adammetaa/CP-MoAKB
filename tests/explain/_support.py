"""Fictional Runtime objects for explanation tests."""

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
    ReviewProvenance,
    SourceIdentifier,
    SourceReference,
    SupersessionProvenance,
)


def candidate_id(number: int) -> CandidateIdentifier:
    return CandidateIdentifier(f"CPM-CAND-E-{number:06d}")


def record(
    number: int = 993001,
    *,
    preferred: bool = True,
    with_evidence: bool = False,
    lifecycle: RecordLifecycle = RecordLifecycle.CANDIDATE,
    ambiguity_notes: tuple[str, ...] = (),
    predecessor: CandidateIdentifier | None = None,
) -> EntityRecord:
    source_id = SourceIdentifier("synthetic-explanation-source")
    evidence = (
        (
            EvidenceReference(
                identifier="fictional-evidence-1",
                source_id=source_id,
                locator="Synthetic section 7",
                note="Fictional evidence note supplied for explanation testing.",
                role=EvidenceRole.CONTEXTUAL,
                language="en",
                uncertainty_note="Synthetic uncertainty remains explicit.",
                reviewer_status="synthetic-reviewed",
            ),
        )
        if with_evidence
        else ()
    )
    source = SourceReference(
        identifier=source_id,
        title="Fictional Explanation Reference",
        issuing_organization="Synthetic Explanation Group",
        source_type="fictional-reference",
        canonical_locator="urn:synthetic:explanation-source",
        scope_note="Synthetic explanation testing only.",
    )
    supersession = (
        SupersessionProvenance(predecessor, "Synthetic replacement reason")
        if predecessor is not None
        else None
    )
    provenance = Provenance(
        creation=CreationProvenance(date(2026, 1, 1), "synthetic-creator-role"),
        source_ids=(source_id,) if with_evidence else (),
        evidence_ids=("fictional-evidence-1",) if with_evidence else (),
        reviews=(
            ReviewProvenance(
                date(2026, 1, 2),
                "synthetic-reviewer-role",
                "Synthetic review note.",
            ),
        ),
        supersession=supersession,
    )
    return EntityRecord(
        identifier=candidate_id(number),
        record_kind=RecordKind.ENTITY,
        domain_type="SyntheticExplanationConcept",
        lifecycle=lifecycle,
        labels=LabelSet(
            (
                Label(
                    language="en",
                    text="Fictional Explanation Widget",
                    status=LabelStatus.PROVISIONAL,
                    preferred=preferred,
                ),
            )
        ),
        scope_note="Synthetic entity for explanation tests.",
        source_ids=(source_id,) if with_evidence else (),
        evidence=evidence,
        provenance=provenance,
        ambiguity_notes=ambiguity_notes,
        sources=(source,) if with_evidence else (),
    )
