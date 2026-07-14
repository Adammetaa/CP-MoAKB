from cpmoakb.query import QueryCriteria, QueryService, TextMatchMode

from ._support import entity, relationship


def test_subject_object_predicate_and_combined_relationship_queries() -> None:
    first = entity(992001)
    second = entity(992002)
    third = entity(992003)
    first_link = relationship(
        992101,
        subject=first.identifier,
        object_=second.identifier,
        predicate="Synthetic_Link",
    )
    second_link = relationship(
        992102,
        subject=second.identifier,
        object_=third.identifier,
        predicate="other_link",
    )
    query = QueryService.from_records((first, second, third, first_link, second_link))

    assert (
        query.search(QueryCriteria(relationship_subject=first.identifier))
        .matches[0]
        .record
        == first_link
    )
    assert (
        query.search(QueryCriteria(relationship_object=third.identifier))
        .matches[0]
        .record
        == second_link
    )
    combined = query.search(
        QueryCriteria(
            relationship_subject=first.identifier,
            relationship_object=second.identifier,
            predicate="synthetic_link",
            match_mode=TextMatchMode.CASE_INSENSITIVE,
        )
    )
    assert tuple(match.record for match in combined.matches) == (first_link,)


def test_relationship_query_does_not_traverse_transitively() -> None:
    first = entity(992001)
    second = entity(992002)
    third = entity(992003)
    first_link = relationship(
        992101, subject=first.identifier, object_=second.identifier
    )
    second_link = relationship(
        992102, subject=second.identifier, object_=third.identifier
    )
    result = QueryService.from_records((first_link, second_link)).search(
        QueryCriteria(relationship_subject=first.identifier)
    )
    assert tuple(match.record for match in result.matches) == (first_link,)
