from cpmoakb.query import QueryCriteria, QueryService, TextMatchMode

from ._support import load_synthetic_record
from tests.query._support import entity, relationship


def test_query_modes_list_all_ordering_and_traceability() -> None:
    record = load_synthetic_record()
    query = QueryService.from_records((record,))
    assert query.search(QueryCriteria()).matches[0].record is record
    for text, mode in (
        ("Fictional Contract Widget", TextMatchMode.EXACT),
        ("fictional contract widget", TextMatchMode.CASE_INSENSITIVE),
        ("  fictional   contract widget ", TextMatchMode.CONSERVATIVE_NORMALIZED),
    ):
        match = query.search(QueryCriteria(label_text=text, match_mode=mode)).matches[0]
        assert match.matched_field == "labels.preferred"
        assert match.matched_value == "Fictional Contract Widget"
        assert match.match_mode is mode


def test_query_does_not_fuzzy_or_infer_synonyms() -> None:
    query = QueryService.from_records((load_synthetic_record(),))
    assert (
        query.search(QueryCriteria(label_text="Fictional Contract Widgit")).matches
        == ()
    )
    assert query.search(QueryCriteria(label_text="Equivalent Fiction")).matches == ()


def test_relationship_query_is_single_edge_only() -> None:
    first = entity(994011)
    second = entity(994012)
    third = entity(994013)
    first_edge = relationship(
        994101, subject=first.identifier, object_=second.identifier
    )
    second_edge = relationship(
        994102, subject=second.identifier, object_=third.identifier
    )
    result = QueryService.from_records((first_edge, second_edge)).search(
        QueryCriteria(relationship_subject=first.identifier)
    )
    assert tuple(match.record for match in result.matches) == (first_edge,)
