"""Exact-identity registry for immutable source references."""

from __future__ import annotations

from cpmoakb.domain import SourceIdentifier, SourceReference

from .errors import (
    InvalidRegistryOperationError,
    RegistryConflictError,
    RegistryItemNotFoundError,
)
from .snapshots import SourceRegistrySnapshot


class SourceRegistry:
    """Register sources by typed identifier without merging or approval."""

    def __init__(self) -> None:
        self._entries: dict[SourceIdentifier, SourceReference] = {}

    def register(self, source: SourceReference) -> SourceReference:
        if not isinstance(source, SourceReference):
            raise InvalidRegistryOperationError(
                "source registry requires SourceReference"
            )
        existing = self._entries.get(source.identifier)
        if existing is None:
            self._entries[source.identifier] = source
            return source
        if existing == source:
            return existing
        raise RegistryConflictError(
            f"source {source.identifier} conflicts with its registered payload"
        )

    def get(self, identifier: SourceIdentifier) -> SourceReference:
        if not isinstance(identifier, SourceIdentifier):
            raise InvalidRegistryOperationError(
                "source lookup requires SourceIdentifier"
            )
        try:
            return self._entries[identifier]
        except KeyError as error:
            raise RegistryItemNotFoundError(
                f"source {identifier} is not registered"
            ) from error

    def contains(self, identifier: SourceIdentifier) -> bool:
        if not isinstance(identifier, SourceIdentifier):
            raise InvalidRegistryOperationError(
                "source lookup requires SourceIdentifier"
            )
        return identifier in self._entries

    def entries(self) -> tuple[SourceReference, ...]:
        return tuple(
            sorted(self._entries.values(), key=lambda source: str(source.identifier))
        )

    def snapshot(self) -> SourceRegistrySnapshot:
        return SourceRegistrySnapshot(self.entries())
