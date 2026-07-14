"""Immutable source metadata; source content is never fetched at runtime."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from urllib.parse import urlparse

from .exceptions import DomainError
from .identifiers import AuthorityIdentifier, SourceIdentifier


@dataclass(frozen=True, slots=True)
class SourceReference:
    identifier: SourceIdentifier
    title: str
    issuing_organization: str
    source_type: str
    canonical_locator: str
    scope_note: str
    publication_date: date | None = None
    accessed_date: date | None = None
    version: str | None = None
    authority_ids: tuple[AuthorityIdentifier, ...] = ()
    reuse_status_note: str | None = None
    archival_status: str | None = None

    def __post_init__(self) -> None:
        required = {
            "title": self.title,
            "issuing organization": self.issuing_organization,
            "source type": self.source_type,
            "canonical locator": self.canonical_locator,
            "scope note": self.scope_note,
        }
        for field, value in required.items():
            if not value or value != value.strip():
                raise DomainError(f"source {field} must be non-empty")
        if not urlparse(self.canonical_locator).scheme:
            raise DomainError("source canonical locator must be an absolute URI")
        object.__setattr__(
            self, "authority_ids", tuple(sorted(set(self.authority_ids), key=str))
        )
