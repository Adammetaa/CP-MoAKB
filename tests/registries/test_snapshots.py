from dataclasses import FrozenInstanceError, fields

import pytest

from cpmoakb.registries import (
    AuthorityRegistry,
    CandidateIdentifierRegistry,
    CandidateIdentifierState,
    SourceRegistry,
)

from ._support import authority, candidate_id, source


def test_identifier_snapshot_is_immutable_hashable_and_isolated() -> None:
    registry = CandidateIdentifierRegistry()
    first = candidate_id(991001)
    registry.reserve(first)
    snapshot = registry.snapshot()
    original_hash = hash(snapshot)

    registry.reserve(candidate_id(991002))
    assert snapshot.contains(first)
    assert len(snapshot.entries) == 1
    assert hash(snapshot) == original_hash
    with pytest.raises(FrozenInstanceError):
        snapshot.entries[0].state = CandidateIdentifierState.REGISTERED  # type: ignore[misc]
    with pytest.raises(FrozenInstanceError):
        snapshot.entries = ()  # type: ignore[misc]


def test_snapshots_preserve_all_terminal_identifier_states() -> None:
    registry = CandidateIdentifierRegistry()
    abandoned = candidate_id(991001)
    rejected = candidate_id(991002)
    superseded = candidate_id(991003)
    successor = candidate_id(991004)
    registry.reserve(abandoned)
    registry.abandon(abandoned, change_reason="Synthetic abandonment")
    for identifier in (rejected, superseded, successor):
        registry.reserve(identifier)
        registry.register(identifier)
    registry.reject(rejected, change_reason="Synthetic rejection")
    registry.supersede(
        superseded,
        superseded_by=successor,
        change_reason="Synthetic supersession",
    )
    snapshot = registry.snapshot()
    assert snapshot.get(abandoned).state is CandidateIdentifierState.ABANDONED
    assert snapshot.get(rejected).state is CandidateIdentifierState.REJECTED
    assert snapshot.get(superseded).state is CandidateIdentifierState.SUPERSEDED


def test_identifier_entries_have_no_implicit_timestamp_fields() -> None:
    registry = CandidateIdentifierRegistry()
    identifier = candidate_id(991001)
    entry = registry.reserve(identifier)
    assert all(
        "time" not in field.name and "date" not in field.name for field in fields(entry)
    )


def test_source_and_authority_snapshots_are_isolated_and_ordered() -> None:
    sources = SourceRegistry()
    sources.register(source("synthetic-source-b"))
    source_snapshot = sources.snapshot()
    sources.register(source("synthetic-source-a"))
    assert len(source_snapshot.entries) == 1

    authorities = AuthorityRegistry()
    authorities.register(authority("synthetic-authority-b"))
    authority_snapshot = authorities.snapshot()
    authorities.register(authority("synthetic-authority-a"))
    assert len(authority_snapshot.entries) == 1
    assert hash(source_snapshot)
    assert hash(authority_snapshot)
