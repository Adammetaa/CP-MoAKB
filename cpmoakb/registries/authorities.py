"""Exact-identity registry for immutable authority references."""

from __future__ import annotations

from cpmoakb.domain import AuthorityIdentifier, AuthorityReference

from .errors import (
    InvalidRegistryOperationError,
    RegistryConflictError,
    RegistryItemNotFoundError,
)
from .snapshots import AuthorityRegistrySnapshot


class AuthorityRegistry:
    """Register claim-scoped authorities without ranking or inference."""

    def __init__(self) -> None:
        self._entries: dict[AuthorityIdentifier, AuthorityReference] = {}

    def register(self, authority: AuthorityReference) -> AuthorityReference:
        if not isinstance(authority, AuthorityReference):
            raise InvalidRegistryOperationError(
                "authority registry requires AuthorityReference"
            )
        existing = self._entries.get(authority.identifier)
        if existing is None:
            self._entries[authority.identifier] = authority
            return authority
        if existing == authority:
            return existing
        raise RegistryConflictError(
            f"authority {authority.identifier} conflicts with its registered payload"
        )

    def get(self, identifier: AuthorityIdentifier) -> AuthorityReference:
        if not isinstance(identifier, AuthorityIdentifier):
            raise InvalidRegistryOperationError(
                "authority lookup requires AuthorityIdentifier"
            )
        try:
            return self._entries[identifier]
        except KeyError as error:
            raise RegistryItemNotFoundError(
                f"authority {identifier} is not registered"
            ) from error

    def contains(self, identifier: AuthorityIdentifier) -> bool:
        if not isinstance(identifier, AuthorityIdentifier):
            raise InvalidRegistryOperationError(
                "authority lookup requires AuthorityIdentifier"
            )
        return identifier in self._entries

    def entries(self) -> tuple[AuthorityReference, ...]:
        return tuple(
            sorted(
                self._entries.values(),
                key=lambda authority: str(authority.identifier),
            )
        )

    def snapshot(self) -> AuthorityRegistrySnapshot:
        return AuthorityRegistrySnapshot(self.entries())
