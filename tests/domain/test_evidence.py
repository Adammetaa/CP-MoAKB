import pytest

from cpmoakb.domain import (
    DomainError,
    EvidenceReference,
    EvidenceRole,
    SourceIdentifier,
)


def test_evidence_is_distinct_from_source_metadata():
    evidence = EvidenceReference(
        "EV-SYN-1",
        SourceIdentifier("synthetic-source"),
        "section 2, fictional record 4",
        "Supports a synthetic structure label.",
        EvidenceRole.PRIMARY,
        language="en",
        uncertainty_note="Fictional example only.",
        reviewer_status="pending",
    )

    assert evidence.role is EvidenceRole.PRIMARY
    assert not hasattr(evidence, "diagnosis")
    assert not hasattr(evidence, "recommendation")


def test_evidence_locator_is_required_but_opaque():
    with pytest.raises(DomainError):
        EvidenceReference(
            "EV-SYN-1",
            SourceIdentifier("synthetic-source"),
            "",
            "Synthetic note.",
            EvidenceRole.CONTEXTUAL,
        )
