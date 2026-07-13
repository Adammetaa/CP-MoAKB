"""Parse the IRAC Mode of Action Classification Scheme PDF.

The IRAC scheme is published as a PDF whose pagination and table layout change
between releases.  This module deliberately reads every page and recognises
classification codes from their text, rather than depending on page numbers.
It does not persist anything; callers receive small, normalized value objects.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
from typing import Iterator

import pandas as pd
import pdfplumber


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


@dataclass(frozen=True, slots=True)
class IRACNode:
    """One normalized member of the IRAC classification hierarchy."""

    code: str
    name: str
    level: int
    parent_code: str | None
    page: int


@dataclass(frozen=True, slots=True)
class IRACDocument:
    """The parsed, versioned contents of an IRAC classification PDF."""

    version: str | None
    nodes: tuple[IRACNode, ...]

    def to_dataframe(self) -> pd.DataFrame:
        """Return nodes as a consistently ordered pandas data frame."""

        return pd.DataFrame(
            [
                {
                    "code": node.code,
                    "name": node.name,
                    "level": node.level,
                    "parent_code": node.parent_code,
                    "page": node.page,
                }
                for node in self.nodes
            ],
            columns=["code", "name", "level", "parent_code", "page"],
            dtype=object,
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

        with pdfplumber.open(path) as pdf:
            for page_number, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                if version is None:
                    version = _detect_version(text)
                for code, name in _extract_entries(text.splitlines()):
                    key = (code, name.casefold())
                    if key in seen:
                        continue
                    seen.add(key)
                    level, parent_code = _hierarchy_for(code)
                    nodes.append(IRACNode(code, name, level, parent_code, page_number))

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
