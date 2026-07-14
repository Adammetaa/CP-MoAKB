import pytest

from cpmoakb.domain import ExternalIdentifier, RecordKind, RecordLifecycle
from cpmoakb.query import DuplicateQueryRecordError, ReadOnlyQueryIndex

from ._support import entity, relationship


def test_index_lists_and_indexes_records_deterministically() -> None:
    later = entity(992002, domain_type="SyntheticBeta")
    earlier = entity(
        992001,
        domain_type="SyntheticAlpha",
        external_value="fictional-001",
    )
    index = ReadOnlyQueryIndex((later, earlier))
    assert index.records == (earlier, later)
    assert index.by_kind(RecordKind.ENTITY) == (earlier, later)
    assert index.by_domain_type("SyntheticAlpha") == (earlier,)
    assert index.by_lifecycle(RecordLifecycle.CANDIDATE) == (earlier, later)
    assert index.by_external_identifier(
        ExternalIdentifier("synthetic-catalog", "fictional-001")
    ) == (earlier,)


def test_index_rejects_duplicate_record_identifiers() -> None:
    with pytest.raises(DuplicateQueryRecordError):
        ReadOnlyQueryIndex((entity(992001), entity(992001, preferred_text="Other")))


def test_relationship_indexes_are_one_edge_only() -> None:
    first = entity(992001)
    second = entity(992002)
    link = relationship(992101, subject=first.identifier, object_=second.identifier)
    index = ReadOnlyQueryIndex((link, second, first))
    assert index.relationships_by_subject(first.identifier) == (link,)
    assert index.relationships_by_object(second.identifier) == (link,)
    assert index.relationships_by_predicate("synthetic_link") == (link,)
