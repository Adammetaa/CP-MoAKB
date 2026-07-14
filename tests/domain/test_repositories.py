from collections.abc import Iterable

from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    AuthorityRepository,
    CandidateIdentifier,
    CandidateRecord,
    RecordRepository,
    SourceIdentifier,
    SourceReference,
    SourceRepository,
)


class _RecordDouble:
    def save(self, record: CandidateRecord) -> None:
        pass

    def get(self, identifier: CandidateIdentifier) -> CandidateRecord:
        raise LookupError(identifier)

    def exists(self, identifier: CandidateIdentifier) -> bool:
        return False

    def iter_records(self) -> Iterable[CandidateRecord]:
        return ()

    def supersede(
        self, identifier: CandidateIdentifier, replacement: CandidateRecord
    ) -> None:
        pass


class _SourceDouble:
    def get(self, identifier: SourceIdentifier) -> SourceReference:
        raise LookupError(identifier)

    def exists(self, identifier: SourceIdentifier) -> bool:
        return False


class _AuthorityDouble:
    def get(self, identifier: AuthorityIdentifier) -> AuthorityReference:
        raise LookupError(identifier)

    def exists(self, identifier: AuthorityIdentifier) -> bool:
        return False


def test_minimal_test_doubles_conform_to_runtime_protocols():
    assert isinstance(_RecordDouble(), RecordRepository)
    assert isinstance(_SourceDouble(), SourceRepository)
    assert isinstance(_AuthorityDouble(), AuthorityRepository)


def test_record_repository_has_no_destructive_delete_contract():
    assert not hasattr(_RecordDouble(), "delete")
