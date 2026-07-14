"""Claim-scoped authority references without universal rankings."""

from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urlparse

from .exceptions import DomainError
from .identifiers import AuthorityIdentifier


@dataclass(frozen=True, slots=True)
class AuthorityReference:
    identifier: AuthorityIdentifier
    name: str
    scope_note: str
    jurisdiction: str | None = None
    version: str | None = None
    canonical_locator: str | None = None

    def __post_init__(self) -> None:
        for field, value in (("name", self.name), ("scope note", self.scope_note)):
            if not value or value != value.strip():
                raise DomainError(f"authority {field} must be non-empty")
        if self.canonical_locator is not None:
            parsed = urlparse(self.canonical_locator)
            if not parsed.scheme:
                raise DomainError("authority canonical locator must be an absolute URI")
