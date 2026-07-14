from dataclasses import replace

import pytest

from cpmoakb.registries import RegistryConflictError, SourceRegistry

from ._support import source


def test_source_registration_lookup_and_idempotence() -> None:
    registry = SourceRegistry()
    reference = source()
    assert registry.register(reference) is reference
    assert registry.register(reference) is reference
    assert registry.contains(reference.identifier)
    assert registry.get(reference.identifier) is reference


def test_incompatible_same_identifier_fails_without_mutation() -> None:
    registry = SourceRegistry()
    original = source()
    registry.register(original)
    conflicting = replace(original, title="Different Fictional Title")
    with pytest.raises(RegistryConflictError) as caught:
        registry.register(conflicting)
    assert str(caught.value) == (
        "source synthetic-source-a conflicts with its registered payload"
    )
    assert registry.get(original.identifier) is original


def test_matching_title_or_locator_does_not_establish_identity() -> None:
    registry = SourceRegistry()
    first = source("synthetic-source-b")
    second = source("synthetic-source-a")
    registry.register(first)
    registry.register(second)
    assert tuple(item.identifier for item in registry.entries()) == (
        second.identifier,
        first.identifier,
    )
