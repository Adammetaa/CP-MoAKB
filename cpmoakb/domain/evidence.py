"""Claim-level evidence references, distinct from source metadata."""

from __future__ import annotations

import re
from dataclasses import dataclass

from .enums import EvidenceRole
from .exceptions import DomainError
from .identifiers import SourceIdentifier

_EVIDENCE_KEY = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")


@dataclass(frozen=True, slots=True)
class EvidenceReference:
    identifier: str
    source_id: SourceIdentifier
    locator: str
    note: str
    role: EvidenceRole
    language: str | None = None
    uncertainty_note: str | None = None
    reviewer_status: str | None = None

    def __post_init__(self) -> None:
        if _EVIDENCE_KEY.fullmatch(self.identifier) is None:
            raise DomainError("evidence identifier contains unsupported characters")
        for field, value in (("locator", self.locator), ("note", self.note)):
            if not value or value != value.strip():
                raise DomainError(f"evidence {field} must be non-empty")
        if self.language is not None and not self.language.strip():
            raise DomainError("evidence language must be non-empty when supplied")
