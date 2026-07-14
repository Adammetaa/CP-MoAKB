from cpmoakb.domain import CandidateRecord, RecordLifecycle, SourceIdentifier
from cpmoakb.validation import GENERIC_CANDIDATE_PROFILE, validate_record

from ._support import entity, evidence, provenance


def codes(record: CandidateRecord) -> set[str]:
    return {
        issue.code
        for issue in validate_record(record, GENERIC_CANDIDATE_PROFILE).issues
    }


def test_scientific_name_must_remain_separate_from_labels() -> None:
    record = entity(
        label_text="Fictional binomial", scientific_name="Fictional binomial"
    )
    assert "CPM-VAL-DOM-001" in codes(record)


def test_evidence_and_provenance_links_are_checked() -> None:
    item = evidence()
    assert "CPM-VAL-DOM-002" in codes(entity(evidence_items=(item,)))
    linked = entity(
        evidence_items=(item,),
        source_ids=(SourceIdentifier("synthetic-source"),),
        record_provenance=provenance(evidence_ids=("missing-evidence",)),
    )
    assert "CPM-VAL-DOM-005" in codes(linked)


def test_supersession_and_inactive_lifecycle_are_checked() -> None:
    record = entity(
        990001, record_provenance=provenance(predecessor=entity(990001).identifier)
    )
    assert "CPM-VAL-DOM-003" in codes(record)
    assert "CPM-VAL-DOM-004" in codes(entity(lifecycle=RecordLifecycle.REJECTED))
