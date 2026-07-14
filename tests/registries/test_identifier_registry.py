import pytest

from cpmoakb.domain import CandidateIdentifier, CanonicalIdentifier
from cpmoakb.registries import (
    CandidateIdentifierRegistry,
    CandidateIdentifierState,
    IdentifierAlreadyReservedError,
    IdentifierNotReservedError,
    IdentifierStateTransitionError,
    InvalidRegistryOperationError,
)

from ._support import candidate_id


def registered(
    registry: CandidateIdentifierRegistry, number: int, kind: str = "E"
) -> CandidateIdentifier:
    identifier = candidate_id(number, kind)
    registry.reserve(identifier, reservation_note="Synthetic explicit reservation")
    registry.register(identifier, actor_role="synthetic-curator-role")
    return identifier


def test_explicit_reservation_and_registration() -> None:
    registry = CandidateIdentifierRegistry()
    identifier = candidate_id(991001)
    entry = registry.reserve(identifier, actor_role="synthetic-curator-role")
    assert entry.state is CandidateIdentifierState.RESERVED
    assert registry.contains(identifier)

    registered_entry = registry.register(identifier)
    assert registered_entry.state is CandidateIdentifierState.REGISTERED
    assert registered_entry.record_id == identifier
    assert registry.state(identifier) is CandidateIdentifierState.REGISTERED


def test_duplicate_reservation_and_unreserved_registration_fail() -> None:
    registry = CandidateIdentifierRegistry()
    identifier = candidate_id(991001)
    registry.reserve(identifier)
    with pytest.raises(IdentifierAlreadyReservedError):
        registry.reserve(identifier)
    with pytest.raises(IdentifierNotReservedError):
        registry.register(candidate_id(991002))


def test_abandoned_identifier_is_retained_and_never_reused() -> None:
    registry = CandidateIdentifierRegistry()
    identifier = candidate_id(991001)
    registry.reserve(identifier)
    registry.abandon(identifier, change_reason="Synthetic reservation withdrawn")
    assert registry.state(identifier) is CandidateIdentifierState.ABANDONED
    with pytest.raises(IdentifierStateTransitionError):
        registry.reserve(identifier)
    with pytest.raises(IdentifierStateTransitionError):
        registry.register(identifier)
    with pytest.raises(IdentifierStateTransitionError):
        registry.abandon(identifier, change_reason="Invalid terminal transition")


def test_registered_identifier_can_be_rejected_but_not_reused() -> None:
    registry = CandidateIdentifierRegistry()
    identifier = registered(registry, 991001)
    registry.reject(identifier, change_reason="Synthetic governance rejection")
    assert registry.state(identifier) is CandidateIdentifierState.REJECTED
    with pytest.raises(IdentifierStateTransitionError):
        registry.register(identifier)


def test_supersession_requires_distinct_registered_successor() -> None:
    registry = CandidateIdentifierRegistry()
    predecessor = registered(registry, 991001)
    successor = registered(registry, 991002)
    with pytest.raises(InvalidRegistryOperationError):
        registry.supersede(
            predecessor,
            superseded_by=predecessor,
            change_reason="Invalid synthetic self-reference",
        )
    entry = registry.supersede(
        predecessor,
        superseded_by=successor,
        change_reason="Synthetic replacement",
    )
    assert entry.state is CandidateIdentifierState.SUPERSEDED
    assert entry.superseded_by == successor


def test_entity_and_relationship_identifiers_sort_deterministically() -> None:
    registry = CandidateIdentifierRegistry()
    relationship = registered(registry, 991011, "R")
    entity = registered(registry, 991010, "E")
    assert tuple(entry.identifier for entry in registry.entries()) == (
        entity,
        relationship,
    )


def test_registry_rejects_non_candidate_identifier_and_has_no_allocator() -> None:
    registry = CandidateIdentifierRegistry()
    with pytest.raises(InvalidRegistryOperationError):
        registry.reserve(CanonicalIdentifier("synthetic-canonical"))  # type: ignore[arg-type]
    assert not hasattr(registry, "allocate")
