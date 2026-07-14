from dataclasses import replace

import pytest

from cpmoakb.registries import AuthorityRegistry, RegistryConflictError

from ._support import authority


def test_authority_registration_lookup_and_idempotence() -> None:
    registry = AuthorityRegistry()
    reference = authority()
    assert registry.register(reference) is reference
    assert registry.register(reference) is reference
    assert registry.contains(reference.identifier)
    assert registry.get(reference.identifier) is reference


def test_incompatible_same_identifier_fails() -> None:
    registry = AuthorityRegistry()
    original = authority()
    registry.register(original)
    with pytest.raises(RegistryConflictError):
        registry.register(replace(original, scope_note="Different synthetic scope."))


def test_matching_name_does_not_merge_distinct_authority_ids() -> None:
    registry = AuthorityRegistry()
    later = authority("synthetic-authority-b")
    earlier = authority("synthetic-authority-a")
    registry.register(later)
    registry.register(earlier)
    assert registry.entries() == (earlier, later)
    assert not hasattr(registry, "rank")
