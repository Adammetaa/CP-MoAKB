"""Immutable, label-independent identifier value objects."""

from __future__ import annotations

import re
from dataclasses import dataclass
from urllib.parse import urlparse

from .enums import RecordKind
from .exceptions import InvalidIdentifierError

_CANDIDATE_PATTERN = re.compile(r"^CPM-CAND-(?P<kind>[ER])-[0-9]{6}$")
_GENERIC_IDENTIFIER_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$")


def _require_nonempty(value: str, field: str) -> None:
    if not value or value != value.strip():
        raise InvalidIdentifierError(
            f"{field} must be non-empty and have no surrounding whitespace"
        )


def _require_absolute_uri(value: str, field: str) -> None:
    parsed = urlparse(value)
    if not parsed.scheme or (parsed.scheme in {"http", "https"} and not parsed.netloc):
        raise InvalidIdentifierError(f"{field} must be an absolute URI")


@dataclass(frozen=True, slots=True)
class CandidateIdentifier:
    """A canonical, filename-safe, non-production candidate handle."""

    value: str

    def __post_init__(self) -> None:
        if _CANDIDATE_PATTERN.fullmatch(self.value) is None:
            raise InvalidIdentifierError(
                "candidate identifier must match CPM-CAND-E-NNNNNN or CPM-CAND-R-NNNNNN"
            )

    @property
    def kind(self) -> RecordKind:
        match = _CANDIDATE_PATTERN.fullmatch(self.value)
        assert match is not None
        return (
            RecordKind.ENTITY if match.group("kind") == "E" else RecordKind.RELATIONSHIP
        )

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True, slots=True)
class CanonicalIdentifier:
    """An opaque future production identifier; final syntax is deferred."""

    value: str

    def __post_init__(self) -> None:
        _require_nonempty(self.value, "canonical identifier")

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True, slots=True)
class AuthorityIdentifier:
    value: str

    def __post_init__(self) -> None:
        if _GENERIC_IDENTIFIER_PATTERN.fullmatch(self.value) is None:
            raise InvalidIdentifierError(
                "authority identifier contains unsupported characters"
            )

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True, slots=True)
class SourceIdentifier:
    """A generic source-register key with no domain-specific prefix."""

    value: str

    def __post_init__(self) -> None:
        if _GENERIC_IDENTIFIER_PATTERN.fullmatch(self.value) is None:
            raise InvalidIdentifierError(
                "source identifier contains unsupported characters"
            )

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True, slots=True)
class ExternalIdentifier:
    authority: str
    value: str
    resolver_uri: str | None = None

    def __post_init__(self) -> None:
        _require_nonempty(self.authority, "external identifier authority")
        _require_nonempty(self.value, "external identifier value")
        if self.resolver_uri is not None:
            _require_absolute_uri(self.resolver_uri, "resolver URI")
