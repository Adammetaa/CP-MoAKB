from dataclasses import replace

import pytest

from cpmoakb.registries import (
    AuthorityRegistry,
    CandidateIdentifierRegistry,
    CandidateIdentifierState,
    IdentifierStateTransitionError,
    RegistryConflictError,
    SourceRegistry,
)

from ._support import load_synthetic_record


def test_registry_transition_non_reuse_and_snapshot_isolation() -> None:
    assert tuple(state.value for state in CandidateIdentifierState) == (
        "reserved",
        "registered",
        "abandoned",
        "rejected",
        "superseded",
    )
    record = load_synthetic_record()
    registry = CandidateIdentifierRegistry()
    registry.reserve(record.identifier)
    registry.register(record.identifier)
    snapshot = registry.snapshot()
    registry.reject(record.identifier, change_reason="Synthetic contract rejection")
    assert snapshot.get(record.identifier).state is CandidateIdentifierState.REGISTERED
    assert registry.state(record.identifier) is CandidateIdentifierState.REJECTED
    with pytest.raises(IdentifierStateTransitionError):
        registry.reserve(record.identifier)


def test_source_and_authority_idempotence_and_conflict() -> None:
    record = load_synthetic_record()
    sources = SourceRegistry()
    source = record.sources[0]
    assert sources.register(source) is source
    assert sources.register(source) is source
    with pytest.raises(RegistryConflictError):
        sources.register(replace(source, title="Different Fictional Reference"))

    authorities = AuthorityRegistry()
    authority = record.authorities[0]
    assert authorities.register(authority) is authority
    assert authorities.register(authority) is authority
    with pytest.raises(RegistryConflictError):
        authorities.register(replace(authority, name="Different Fictional Authority"))
