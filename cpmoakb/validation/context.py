"""Small read-only cross-object context with no lookup services."""

from __future__ import annotations

from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Mapping

from cpmoakb.domain import CandidateIdentifier, CandidateRecord

from .errors import InvalidValidationContextError


@dataclass(frozen=True, slots=True)
class ValidationContext:
    """Explicit records available to cross-object rules.

    The context stores the supplied immutable record objects and supports only
    in-memory candidate-ID lookup. It is not a service locator.
    """

    records: tuple[CandidateRecord, ...] = ()
    _records_by_id: Mapping[CandidateIdentifier, CandidateRecord] = field(
        init=False, repr=False, compare=False
    )

    def __post_init__(self) -> None:
        ordered = tuple(sorted(self.records, key=lambda record: str(record.identifier)))
        index: dict[CandidateIdentifier, CandidateRecord] = {}
        for record in ordered:
            if record.identifier in index:
                raise InvalidValidationContextError(
                    f"duplicate context record identifier {record.identifier}"
                )
            index[record.identifier] = record
        object.__setattr__(self, "records", ordered)
        object.__setattr__(self, "_records_by_id", MappingProxyType(index))

    def get(self, identifier: CandidateIdentifier) -> CandidateRecord | None:
        return self._records_by_id.get(identifier)

    def contains(self, identifier: CandidateIdentifier) -> bool:
        return identifier in self._records_by_id
