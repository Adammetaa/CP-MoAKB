from dataclasses import FrozenInstanceError

import pytest

from cpmoakb.query import InvalidQueryCriteriaError, LabelScope, QueryCriteria


def test_empty_criteria_means_list_all_and_is_immutable() -> None:
    criteria = QueryCriteria()
    assert not criteria.has_label_criteria
    with pytest.raises(FrozenInstanceError):
        criteria.label_scope = LabelScope.PREFERRED  # type: ignore[misc]


def test_label_scope_is_explicit_label_criteria() -> None:
    assert QueryCriteria(label_scope=LabelScope.PREFERRED).has_label_criteria


@pytest.mark.parametrize("field", ["domain_type", "label_text", "predicate"])
def test_whitespace_only_text_criteria_are_rejected(field: str) -> None:
    with pytest.raises(InvalidQueryCriteriaError):
        QueryCriteria(**{field: " \t "})  # type: ignore[arg-type]
