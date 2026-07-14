from datetime import date

import pytest

from cpmoakb.domain import (
    CandidateIdentifier,
    CreationProvenance,
    InvalidRecordError,
    InvalidRelationshipError,
    Label,
    LabelSet,
    LabelStatus,
    Provenance,
    RecordKind,
    RecordLifecycle,
    RelationshipRecord,
)


def _synthetic_relationship(
    identifier="CPM-CAND-R-900030", predicate="synthetic:associated-with"
):
    return RelationshipRecord(
        CandidateIdentifier(identifier),
        RecordKind.RELATIONSHIP,
        "SyntheticRelationship",
        RecordLifecycle.UNDER_REVIEW,
        LabelSet(
            (Label("en", "Synthetic Association", LabelStatus.PROVISIONAL, True),)
        ),
        "Fictional relationship with no agricultural or causal meaning.",
        (),
        (),
        Provenance(CreationProvenance(date(2026, 1, 1), "synthetic-curator-role")),
        subject_id=CandidateIdentifier("CPM-CAND-E-900031"),
        predicate=predicate,
        object_id=CandidateIdentifier("CPM-CAND-E-900032"),
        uncertainty_note="Association is synthetic and unverified.",
    )


def test_relationship_requires_relationship_candidate_identifier():
    with pytest.raises(InvalidRecordError, match="kind must match"):
        _synthetic_relationship("CPM-CAND-E-900030")


def test_relationship_retains_explicit_predicate_without_causal_inference():
    relationship = _synthetic_relationship()

    assert relationship.predicate == "synthetic:associated-with"
    assert not hasattr(relationship, "causes")


def test_relationship_rejects_empty_predicate():
    with pytest.raises(InvalidRelationshipError):
        _synthetic_relationship(predicate="")
