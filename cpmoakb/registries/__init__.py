"""Intentional public API for governed, storage-neutral registries."""

from .authorities import AuthorityRegistry
from .enums import CandidateIdentifierState
from .errors import (
    IdentifierAlreadyReservedError,
    IdentifierNotReservedError,
    IdentifierStateTransitionError,
    InvalidRegistryOperationError,
    RegistryConflictError,
    RegistryError,
    RegistryItemNotFoundError,
)
from .identifiers import CandidateIdentifierRegistry
from .snapshots import (
    AuthorityRegistrySnapshot,
    CandidateIdentifierRegistryEntry,
    CandidateIdentifierRegistrySnapshot,
    SourceRegistrySnapshot,
)
from .sources import SourceRegistry

__all__ = [
    "AuthorityRegistry",
    "AuthorityRegistrySnapshot",
    "CandidateIdentifierRegistry",
    "CandidateIdentifierRegistryEntry",
    "CandidateIdentifierRegistrySnapshot",
    "CandidateIdentifierState",
    "IdentifierAlreadyReservedError",
    "IdentifierNotReservedError",
    "IdentifierStateTransitionError",
    "InvalidRegistryOperationError",
    "RegistryConflictError",
    "RegistryError",
    "RegistryItemNotFoundError",
    "SourceRegistry",
    "SourceRegistrySnapshot",
]
