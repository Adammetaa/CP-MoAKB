"""Parse the IRAC Mode of Action Classification Scheme PDF.

The IRAC scheme is published as a PDF whose pagination and table layout change
between releases.  This module deliberately reads every page and recognises
classification codes from their text, rather than depending on page numbers.
It does not persist anything; callers receive small, normalized value objects.
"""

from __future__ import annotations

from pathlib import Path
import re
from typing import Iterator

import pdfplumber

from .models import IRACDocument, IRACNode


_VERSION_RE = re.compile(
    r"\b(?:version|ver\.?|v)\s*(?P<version>\d+(?:\.\d+){0,3})\b",
    re.IGNORECASE,
)
_GROUP_RE = re.compile(
    r"^\s*(?:IRAC\s+)?(?:group\s+)?(?P<code>UN|\d+(?:\.\d+)?[A-Z]?)"
    r"(?:\s*[-–—:|]\s*|\s+)(?P<name>.+?)\s*$",
    re.IGNORECASE,
)
_NUMBERED_GROUP_RE = re.compile(
    r"^\s*group\s+(?P<code>UN|\d+(?:\.\d+)?[A-Z]?)\s+(?P<name>.+?)\s*$",
    re.IGNORECASE,
)
_CODE_RE = re.compile(r"^(?P<number>\d+)(?P<decimal>\.\d+)?(?P<suffix>[A-Z]?)$")
_INGREDIENTS_RE = re.compile(
    r"^\s*(?:active\s+ingredients?|iso\s+common\s+names?)\s*[:|]\s*(?P<names>.+?)\s*$",
    re.IGNORECASE,
)


class IRACParser:
    """Read an official IRAC PDF without assumptions about its pagination."""

    def parse(self, pdf_path: str | Path) -> IRACDocument:
        """Open *pdf_path*, detect its version, and extract classification nodes."""

        path = Path(pdf_path)
        if not path.is_file():
            raise FileNotFoundError(f"IRAC PDF was not found: {path}")

        version: str | None = None
        nodes: list[IRACNode] = []
        seen: set[tuple[str, str]] = set()
        current_class_code: str | None = None

        with pdfplumber.open(path) as pdf:
            for page_number, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                if version is None:
                    version = _detect_version(text)
                for line in text.splitlines():
                    for code, name in _extract_entries([line]):
                        key = (code, name.casefold())
                        if key in seen:
                            continue
                        seen.add(key)
                        level, parent_code = _hierarchy_for(code)
                        nodes.append(IRACNode(code, name, level, parent_code, page_number))
                        if level == 2:
                            current_class_code = code
                    if current_class_code:
                        for name in _extract_ingredients(line):
                            code = f"{current_class_code}:{_identifier_token(name)}"
                            key = (code, name.casefold())
                            if key not in seen:
                                seen.add(key)
                                nodes.append(IRACNode(code, name, 3, current_class_code, page_number))

        return IRACDocument(version=version, nodes=tuple(nodes))


def parse_irac_pdf(pdf_path: str | Path) -> IRACDocument:
    """Convenience function for parsing an IRAC Official PDF."""

    return IRACParser().parse(pdf_path)


def _detect_version(text: str) -> str | None:
    """Find the first version marker in page text."""

    match = _VERSION_RE.search(text)
    return match.group("version") if match else None


def _extract_entries(lines: list[str]) -> Iterator[tuple[str, str]]:
    """Yield normalized code/name pairs from headings or text-extracted tables."""

    for line in lines:
        compact = " ".join(line.split())
        match = _GROUP_RE.match(compact) or _NUMBERED_GROUP_RE.match(compact)
        if not match:
            continue
        code = match.group("code").upper()
        name = _normalise_name(match.group("name"))
        if name and not name.casefold().startswith("mode of action"):
            yield code, name


def _normalise_name(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip(" -:|")


def _extract_ingredients(line: str) -> Iterator[str]:
    """Yield ingredients from explicitly labelled IRAC table text."""

    match = _INGREDIENTS_RE.match(line)
    if not match:
        return
    for value in re.split(r"\s*[,;]\s*", match.group("names")):
        name = _normalise_name(value)
        if name:
            yield name


def _identifier_token(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")


def _hierarchy_for(code: str) -> tuple[int, str | None]:
    """Derive the stable IRAC parent relationship encoded in a group code."""

    if code == "UN":
        return 1, None
    match = _CODE_RE.match(code)
    if not match:  # Defensive: keep future IRAC code forms usable.
        return 1, None
    base = match.group("number")
    if match.group("decimal") or match.group("suffix"):
        return 2, base
    return 1, None
