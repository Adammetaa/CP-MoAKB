"""Explicit in-memory custody for supplied candidate identifiers."""

from __future__ import annotations

from cpmoakb.domain import CandidateIdentifier

from .enums import CandidateIdentifierState
from .errors import (
    IdentifierAlreadyReservedError,
    IdentifierNotReservedError,
    IdentifierStateTransitionError,
    InvalidRegistryOperationError,
    RegistryItemNotFoundError,
)
from .snapshots import (
    CandidateIdentifierRegistryEntry,
    CandidateIdentifierRegistrySnapshot,
)


class CandidateIdentifierRegistry:
    """A non-global, storage-neutral candidate identifier custody service."""

    def __init__(self) -> None:
        self._entries: dict[CandidateIdentifier, CandidateIdentifierRegistryEntry] = {}

    @staticmethod
    def _require_identifier(identifier: CandidateIdentifier) -> None:
        if not isinstance(identifier, CandidateIdentifier):
            raise InvalidRegistryOperationError(
                "candidate registry operations require CandidateIdentifier"
            )

    def reserve(
        self,
        identifier: CandidateIdentifier,
        *,
        reservation_note: str | None = None,
        actor_role: str | None = None,
    ) -> CandidateIdentifierRegistryEntry:
        self._require_identifier(identifier)
        existing = self._entries.get(identifier)
        if existing is not None:
            if existing.state is CandidateIdentifierState.RESERVED:
                raise IdentifierAlreadyReservedError(
                    f"candidate identifier {identifier} is already reserved"
                )
            raise IdentifierStateTransitionError(
                f"candidate identifier {identifier} has permanent state "
                f"{existing.state.value} and cannot be reserved"
            )
        entry = CandidateIdentifierRegistryEntry(
            identifier=identifier,
            state=CandidateIdentifierState.RESERVED,
            reservation_note=reservation_note,
            actor_role=actor_role,
        )
        self._entries[identifier] = entry
        return entry

    def register(
        self,
        identifier: CandidateIdentifier,
        *,
        record_id: CandidateIdentifier | None = None,
        actor_role: str | None = None,
    ) -> CandidateIdentifierRegistryEntry:
        existing = self._reserved_entry(identifier)
        associated = record_id or identifier
        if associated != identifier:
            raise InvalidRegistryOperationError(
                f"record ID {associated} does not match reserved identifier {identifier}"
            )
        entry = CandidateIdentifierRegistryEntry(
            identifier=identifier,
            state=CandidateIdentifierState.REGISTERED,
            record_id=associated,
            reservation_note=existing.reservation_note,
            actor_role=actor_role or existing.actor_role,
        )
        self._entries[identifier] = entry
        return entry

    def abandon(
        self,
        identifier: CandidateIdentifier,
        *,
        change_reason: str,
        actor_role: str | None = None,
    ) -> CandidateIdentifierRegistryEntry:
        existing = self._reserved_entry(identifier)
        entry = CandidateIdentifierRegistryEntry(
            identifier=identifier,
            state=CandidateIdentifierState.ABANDONED,
            reservation_note=existing.reservation_note,
            change_reason=change_reason,
            actor_role=actor_role or existing.actor_role,
        )
        self._entries[identifier] = entry
        return entry

    def reject(
        self,
        identifier: CandidateIdentifier,
        *,
        change_reason: str,
        actor_role: str | None = None,
    ) -> CandidateIdentifierRegistryEntry:
        existing = self._registered_entry(identifier)
        entry = CandidateIdentifierRegistryEntry(
            identifier=identifier,
            state=CandidateIdentifierState.REJECTED,
            record_id=existing.record_id,
            reservation_note=existing.reservation_note,
            change_reason=change_reason,
            actor_role=actor_role or existing.actor_role,
        )
        self._entries[identifier] = entry
        return entry

    def supersede(
        self,
        identifier: CandidateIdentifier,
        *,
        superseded_by: CandidateIdentifier,
        change_reason: str,
        actor_role: str | None = None,
    ) -> CandidateIdentifierRegistryEntry:
        if identifier == superseded_by:
            raise InvalidRegistryOperationError(
                "a candidate identifier cannot supersede itself"
            )
        existing = self._registered_entry(identifier)
        successor = self.get(superseded_by)
        if successor.state is not CandidateIdentifierState.REGISTERED:
            raise IdentifierStateTransitionError(
                f"successor identifier {superseded_by} must be registered, not "
                f"{successor.state.value}"
            )
        entry = CandidateIdentifierRegistryEntry(
            identifier=identifier,
            state=CandidateIdentifierState.SUPERSEDED,
            record_id=existing.record_id,
            reservation_note=existing.reservation_note,
            change_reason=change_reason,
            superseded_by=superseded_by,
            actor_role=actor_role or existing.actor_role,
        )
        self._entries[identifier] = entry
        return entry

    def get(self, identifier: CandidateIdentifier) -> CandidateIdentifierRegistryEntry:
        self._require_identifier(identifier)
        try:
            return self._entries[identifier]
        except KeyError as error:
            raise RegistryItemNotFoundError(
                f"candidate identifier {identifier} is not registered"
            ) from error

    def state(self, identifier: CandidateIdentifier) -> CandidateIdentifierState:
        return self.get(identifier).state

    def contains(self, identifier: CandidateIdentifier) -> bool:
        self._require_identifier(identifier)
        return identifier in self._entries

    def entries(self) -> tuple[CandidateIdentifierRegistryEntry, ...]:
        return tuple(
            sorted(self._entries.values(), key=lambda entry: str(entry.identifier))
        )

    def snapshot(self) -> CandidateIdentifierRegistrySnapshot:
        return CandidateIdentifierRegistrySnapshot(self.entries())

    def _reserved_entry(
        self, identifier: CandidateIdentifier
    ) -> CandidateIdentifierRegistryEntry:
        self._require_identifier(identifier)
        existing = self._entries.get(identifier)
        if existing is None:
            raise IdentifierNotReservedError(
                f"candidate identifier {identifier} must be reserved first"
            )
        if existing.state is not CandidateIdentifierState.RESERVED:
            raise IdentifierStateTransitionError(
                f"candidate identifier {identifier} cannot transition from "
                f"{existing.state.value}; expected reserved"
            )
        return existing

    def _registered_entry(
        self, identifier: CandidateIdentifier
    ) -> CandidateIdentifierRegistryEntry:
        existing = self.get(identifier)
        if existing.state is not CandidateIdentifierState.REGISTERED:
            raise IdentifierStateTransitionError(
                f"candidate identifier {identifier} cannot transition from "
                f"{existing.state.value}; expected registered"
            )
        return existing
