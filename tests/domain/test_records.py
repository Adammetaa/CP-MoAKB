from dataclasses import FrozenInstanceError
from datetime import date

import pytest

from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    CandidateIdentifier,
    ClassificationReference,
    CreationProvenance,
    EntityRecord,
    InvalidRecordError,
    Label,
    LabelSet,
    LabelStatus,
    Provenance,
    RecordKind,
    RecordLifecycle,
    ScientificName,
)


def _synthetic_entity(lifecycle=RecordLifecycle.CANDIDATE):
    authority = AuthorityReference(
        AuthorityIdentifier("fictional-taxonomy"),
        "Fictional Taxonomy Office",
        "Synthetic names only.",
    )
    return EntityRecord(
        CandidateIdentifier("CPM-CAND-E-900020"),
        RecordKind.ENTITY,
        "SyntheticDomainType",
        lifecycle,
        LabelSet((Label("en", "Synthetic Entity", LabelStatus.PROVISIONAL, True),)),
        "Fictional entity used only to test generic runtime invariants.",
        (),
        (),
        Provenance(CreationProvenance(date(2026, 1, 1), "synthetic-curator-role")),
        scientific_name=ScientificName(
            "Fictitia exemplaris",
            authorship="Example",
            authority=authority,
            verification_status="synthetic_unverified",
            name_status="fictional",
        ),
        classifications=(ClassificationReference("fictional-scheme", "SYN-1"),),
    )


def test_entity_candidate_uses_extensible_domain_type_and_separate_scientific_name():
    record = _synthetic_entity()

    assert record.domain_type == "SyntheticDomainType"
    assert record.scientific_name is not None
    assert record.scientific_name.name not in {
        label.text for label in record.labels.labels
    }
    assert hash(record) == hash(_synthetic_entity())


def test_candidate_record_rejects_published_lifecycle():
    with pytest.raises(InvalidRecordError, match="cannot have published"):
        _synthetic_entity(RecordLifecycle.PUBLISHED)


def test_accepted_is_a_governance_state_not_a_truth_flag():
    record = _synthetic_entity(RecordLifecycle.ACCEPTED)
    assert record.lifecycle is RecordLifecycle.ACCEPTED
    assert not hasattr(record, "universally_true")


def test_entity_record_is_immutable():
    record = _synthetic_entity()
    with pytest.raises(FrozenInstanceError):
        record.domain_type = "Changed"  # type: ignore[misc]
