import pytest

from cpmoakb.registries import (
    AuthorityRegistry,
    CandidateIdentifierRegistry,
    SourceRegistry,
)
from cpmoakb.query import (
    QueryItemNotFoundError,
    RegistrySnapshotQueryService,
    UnsupportedQueryOperationError,
)

from ._support import authority_reference, candidate_id, source_reference


def test_exact_registry_snapshot_lookup_and_listing() -> None:
    sources = SourceRegistry()
    source = source_reference()
    sources.register(source)
    authorities = AuthorityRegistry()
    authority = authority_reference()
    authorities.register(authority)
    identifiers = CandidateIdentifierRegistry()
    identifier = candidate_id(992001)
    identifiers.reserve(identifier)

    query = RegistrySnapshotQueryService(
        sources=sources.snapshot(),
        authorities=authorities.snapshot(),
        candidate_identifiers=identifiers.snapshot(),
    )
    assert query.get_source(source.identifier) == source
    assert query.list_sources() == (source,)
    assert query.get_authority(authority.identifier) == authority
    assert query.list_authorities() == (authority,)
    assert query.get_candidate_identifier(identifier).identifier == identifier
    assert not hasattr(query, "rank_authorities")


def test_registry_query_missing_item_and_snapshot_are_typed() -> None:
    with pytest.raises(UnsupportedQueryOperationError):
        RegistrySnapshotQueryService().list_sources()
    sources = SourceRegistry()
    with pytest.raises(QueryItemNotFoundError):
        RegistrySnapshotQueryService(sources=sources.snapshot()).get_source(
            source_reference("synthetic-missing").identifier
        )


def test_snapshot_queries_do_not_mutate_live_registries() -> None:
    sources = SourceRegistry()
    first = source_reference("synthetic-source-a")
    sources.register(first)
    snapshot = sources.snapshot()
    query = RegistrySnapshotQueryService(sources=snapshot)
    sources.register(source_reference("synthetic-source-b"))
    assert query.list_sources() == (first,)
