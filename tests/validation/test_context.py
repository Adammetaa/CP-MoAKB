from dataclasses import FrozenInstanceError

import pytest

from cpmoakb.validation import InvalidValidationContextError, ValidationContext

from ._support import entity


def test_context_orders_and_resolves_supplied_records() -> None:
    later = entity(990002)
    earlier = entity(990001)
    context = ValidationContext((later, earlier))

    assert context.records == (earlier, later)
    assert context.get(earlier.identifier) is earlier
    assert context.contains(later.identifier)


def test_context_rejects_duplicate_record_identifiers() -> None:
    with pytest.raises(InvalidValidationContextError):
        ValidationContext((entity(990001), entity(990001, label_text="Other Fiction")))


def test_context_is_immutable() -> None:
    context = ValidationContext((entity(),))
    with pytest.raises(FrozenInstanceError):
        context.records = ()  # type: ignore[misc]
