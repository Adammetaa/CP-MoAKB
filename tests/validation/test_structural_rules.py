from cpmoakb.domain import CandidateRecord
from cpmoakb.validation import GENERIC_CANDIDATE_PROFILE, validate_record

from ._support import candidate_id, entity, evidence, relationship


def codes(record: CandidateRecord) -> set[str]:
    return {
        issue.code
        for issue in validate_record(record, GENERIC_CANDIDATE_PROFILE).issues
    }


def test_structural_rules_find_constructible_invalid_shapes() -> None:
    assert "CPM-VAL-STR-001" in codes(entity(preferred=False))
    assert "CPM-VAL-STR-002" in codes(entity(ambiguity_notes=("",)))
    duplicate = evidence("duplicate-key")
    assert "CPM-VAL-STR-003" in codes(entity(evidence_items=(duplicate, duplicate)))


def test_relationship_endpoint_identifier_form_is_checked() -> None:
    record = relationship(subject=candidate_id(990199, "R"))
    assert "CPM-VAL-STR-004" in codes(record)
