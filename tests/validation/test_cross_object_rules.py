from cpmoakb.domain import CandidateRecord
from cpmoakb.validation import GENERIC_BATCH_PROFILE, validate_records

from ._support import candidate_id, entity, provenance, relationship


def codes(*records: CandidateRecord) -> set[str]:
    return {
        issue.code for issue in validate_records(records, GENERIC_BATCH_PROFILE).issues
    }


def test_duplicate_identifiers_are_ordinary_batch_issues() -> None:
    assert "CPM-VAL-XOBJ-001" in codes(entity(), entity(label_text="Other Fiction"))


def test_missing_relationship_references_are_reported() -> None:
    assert "CPM-VAL-XOBJ-002" in codes(relationship())


def test_relationship_to_relationship_and_self_references_are_reported() -> None:
    target = relationship(990102)
    referring = relationship(990101, subject=target.identifier)
    assert "CPM-VAL-XOBJ-003" in codes(target, referring)

    self_link = relationship(990103, subject=candidate_id(990103, "R"))
    assert "CPM-VAL-XOBJ-004" in codes(self_link)


def test_missing_supersession_predecessor_is_reported() -> None:
    record = entity(record_provenance=provenance(predecessor=candidate_id(990099)))
    assert "CPM-VAL-XOBJ-005" in codes(record)
