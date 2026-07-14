from dataclasses import FrozenInstanceError, fields

import pytest

from cpmoakb.query import QueryCriteria, QueryMatch, QueryResult, TextMatchMode

from ._support import entity


def test_result_is_immutable_and_orders_matches_deterministically() -> None:
    later = entity(992002)
    earlier = entity(992001)
    criteria = QueryCriteria()
    result = QueryResult(
        criteria,
        (
            QueryMatch(later, "record", str(later.identifier), TextMatchMode.EXACT),
            QueryMatch(earlier, "record", str(earlier.identifier), TextMatchMode.EXACT),
        ),
    )
    assert tuple(match.record for match in result.matches) == (earlier, later)
    assert result.total_count == 2
    with pytest.raises(FrozenInstanceError):
        result.matches = ()  # type: ignore[misc]


def test_result_models_have_no_implicit_timestamp_fields() -> None:
    assert all(
        "time" not in field.name and "date" not in field.name
        for model in (QueryMatch, QueryResult)
        for field in fields(model)
    )
