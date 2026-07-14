"""Immutable multilingual labels without inferred identity equivalence."""

from __future__ import annotations

import re
from dataclasses import dataclass

from .enums import LabelStatus
from .exceptions import DuplicatePreferredLabelError, InvalidLabelError
from .identifiers import SourceIdentifier

_LANGUAGE_TAG = re.compile(r"^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$")


def _validate_tag(value: str, field: str) -> None:
    if _LANGUAGE_TAG.fullmatch(value) is None:
        raise InvalidLabelError(f"{field} must be a conservative BCP 47-compatible tag")


@dataclass(frozen=True, slots=True)
class Label:
    """One sourced or editorial language form.

    Language is explicit; it is never inferred from the script of ``text``.
    Scientific names belong in ``ScientificName``, not in this model.
    """

    language: str
    text: str
    status: LabelStatus
    preferred: bool = False
    locale: str | None = None
    source_id: SourceIdentifier | None = None
    editorial_note: str | None = None
    ambiguity_note: str | None = None

    def __post_init__(self) -> None:
        _validate_tag(self.language, "language")
        if self.locale is not None:
            _validate_tag(self.locale, "locale")
        if not self.text or self.text != self.text.strip():
            raise InvalidLabelError(
                "label text must be non-empty and have no surrounding whitespace"
            )
        if self.status is LabelStatus.SOURCED and self.source_id is None:
            raise InvalidLabelError("a sourced label requires a source reference")
        if self.status is LabelStatus.EDITORIAL and not self.editorial_note:
            raise InvalidLabelError("an editorial label requires an editorial note")

    @property
    def language_locale_key(self) -> tuple[str, str]:
        return (self.language.casefold(), (self.locale or "").casefold())


@dataclass(frozen=True, slots=True)
class LabelSet:
    """Deterministically ordered labels with one preferred form per locale."""

    labels: tuple[Label, ...]

    def __post_init__(self) -> None:
        if not self.labels:
            raise InvalidLabelError("a label set must contain at least one label")
        if len(set(self.labels)) != len(self.labels):
            raise InvalidLabelError("duplicate labels are not allowed")
        preferred: set[tuple[str, str]] = set()
        for label in self.labels:
            if label.preferred and label.language_locale_key in preferred:
                raise DuplicatePreferredLabelError(
                    "only one preferred label is allowed per language and locale"
                )
            if label.preferred:
                preferred.add(label.language_locale_key)
        ordered = tuple(sorted(self.labels, key=self._sort_key))
        object.__setattr__(self, "labels", ordered)

    @staticmethod
    def _sort_key(label: Label) -> tuple[str, str, int, str, str]:
        return (
            label.language.casefold(),
            (label.locale or "").casefold(),
            0 if label.preferred else 1,
            label.text,
            label.status.value,
        )

    @property
    def preferred(self) -> tuple[Label, ...]:
        return tuple(label for label in self.labels if label.preferred)

    @property
    def alternatives(self) -> tuple[Label, ...]:
        return tuple(label for label in self.labels if not label.preferred)
