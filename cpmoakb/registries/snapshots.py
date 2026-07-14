"""Immutable deterministic registry entries and snapshots."""

from __future__ import annotations

from dataclasses import dataclass

from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    CandidateIdentifier,
    SourceIdentifier,
    SourceReference,
)

from .enums import CandidateIdentifierState
from .errors import InvalidRegistryOperationError, RegistryItemNotFoundError


def _optional_trimmed(value: str | None, field: str) -> None:
    if value is not None and (not value or value != value.strip()):
        raise InvalidRegistryOperationError(f"{field} must be non-empty and trimmed")


@dataclass(frozen=True, slots=True)
class CandidateIdentifierRegistryEntry:
    identifier: CandidateIdentifier
    state: CandidateIdentifierState
    record_id: CandidateIdentifier | None = None
    reservation_note: str | None = None
    change_reason: str | None = None
    superseded_by: CandidateIdentifier | None = None
    actor_role: str | None = None

    def __post_init__(self) -> None:
        _optional_trimmed(self.reservation_note, "reservation note")
        _optional_trimmed(self.change_reason, "change reason")
        _optional_trimmed(self.actor_role, "actor role")
        if self.record_id is not None and self.record_id != self.identifier:
            raise InvalidRegistryOperationError(
                "candidate registry record ID must equal its custody identifier"
            )
        if (
            self.state
            in {
                CandidateIdentifierState.RESERVED,
                CandidateIdentifierState.ABANDONED,
            }
            and self.record_id is not None
        ):
            raise InvalidRegistryOperationError(
                f"state {self.state.value} cannot have an associated candidate record ID"
            )
        if (
            self.state
            in {
                CandidateIdentifierState.REGISTERED,
                CandidateIdentifierState.REJECTED,
                CandidateIdentifierState.SUPERSEDED,
            }
            and self.record_id is None
        ):
            raise InvalidRegistryOperationError(
                f"state {self.state.value} requires an associated candidate record ID"
            )
        if (
            self.state
            in {
                CandidateIdentifierState.ABANDONED,
                CandidateIdentifierState.REJECTED,
                CandidateIdentifierState.SUPERSEDED,
            }
            and self.change_reason is None
        ):
            raise InvalidRegistryOperationError(
                f"state {self.state.value} requires an explicit change reason"
            )
        if self.state is CandidateIdentifierState.SUPERSEDED:
            if self.superseded_by is None:
                raise InvalidRegistryOperationError(
                    "superseded state requires a successor identifier"
                )
            if self.superseded_by == self.identifier:
                raise InvalidRegistryOperationError(
                    "a candidate identifier cannot supersede itself"
                )
        elif self.superseded_by is not None:
            raise InvalidRegistryOperationError(
                "a successor identifier is valid only for superseded custody"
            )


@dataclass(frozen=True, slots=True)
class CandidateIdentifierRegistrySnapshot:
    entries: tuple[CandidateIdentifierRegistryEntry, ...] = ()

    def __post_init__(self) -> None:
        ordered = tuple(sorted(self.entries, key=lambda entry: str(entry.identifier)))
        identifiers = tuple(entry.identifier for entry in ordered)
        if len(identifiers) != len(set(identifiers)):
            raise InvalidRegistryOperationError(
                "candidate identifier snapshot contains duplicate keys"
            )
        object.__setattr__(self, "entries", ordered)

    def contains(self, identifier: CandidateIdentifier) -> bool:
        return any(entry.identifier == identifier for entry in self.entries)

    def get(self, identifier: CandidateIdentifier) -> CandidateIdentifierRegistryEntry:
        for entry in self.entries:
            if entry.identifier == identifier:
                return entry
        raise RegistryItemNotFoundError(
            f"candidate identifier {identifier} is not registered"
        )


@dataclass(frozen=True, slots=True)
class SourceRegistrySnapshot:
    entries: tuple[SourceReference, ...] = ()

    def __post_init__(self) -> None:
        ordered = tuple(sorted(self.entries, key=lambda source: str(source.identifier)))
        identifiers = tuple(source.identifier for source in ordered)
        if len(identifiers) != len(set(identifiers)):
            raise InvalidRegistryOperationError(
                "source snapshot contains duplicate keys"
            )
        object.__setattr__(self, "entries", ordered)

    def contains(self, identifier: SourceIdentifier) -> bool:
        return any(source.identifier == identifier for source in self.entries)

    def get(self, identifier: SourceIdentifier) -> SourceReference:
        for source in self.entries:
            if source.identifier == identifier:
                return source
        raise RegistryItemNotFoundError(f"source {identifier} is not registered")


@dataclass(frozen=True, slots=True)
class AuthorityRegistrySnapshot:
    entries: tuple[AuthorityReference, ...] = ()

    def __post_init__(self) -> None:
        ordered = tuple(
            sorted(self.entries, key=lambda authority: str(authority.identifier))
        )
        identifiers = tuple(authority.identifier for authority in ordered)
        if len(identifiers) != len(set(identifiers)):
            raise InvalidRegistryOperationError(
                "authority snapshot contains duplicate keys"
            )
        object.__setattr__(self, "entries", ordered)

    def contains(self, identifier: AuthorityIdentifier) -> bool:
        return any(authority.identifier == identifier for authority in self.entries)

    def get(self, identifier: AuthorityIdentifier) -> AuthorityReference:
        for authority in self.entries:
            if authority.identifier == identifier:
                return authority
        raise RegistryItemNotFoundError(f"authority {identifier} is not registered")
