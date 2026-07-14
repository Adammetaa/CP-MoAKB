"""Storage-neutral repository ports for future adapters."""

from __future__ import annotations

from typing import Iterable, Protocol, runtime_checkable

from .authorities import AuthorityReference
from .identifiers import AuthorityIdentifier, CandidateIdentifier, SourceIdentifier
from .records import CandidateRecord
from .sources import SourceReference


@runtime_checkable
class RecordRepository(Protocol):
    """Governed candidate persistence without destructive deletion semantics."""

    def save(self, record: CandidateRecord) -> None: ...

    def get(self, identifier: CandidateIdentifier) -> CandidateRecord: ...

    def exists(self, identifier: CandidateIdentifier) -> bool: ...

    def iter_records(self) -> Iterable[CandidateRecord]: ...

    def supersede(
        self, identifier: CandidateIdentifier, replacement: CandidateRecord
    ) -> None: ...


@runtime_checkable
class SourceRepository(Protocol):
    def get(self, identifier: SourceIdentifier) -> SourceReference: ...

    def exists(self, identifier: SourceIdentifier) -> bool: ...


@runtime_checkable
class AuthorityRepository(Protocol):
    def get(self, identifier: AuthorityIdentifier) -> AuthorityReference: ...

    def exists(self, identifier: AuthorityIdentifier) -> bool: ...
