"""Parse the official IRAC Mode of Action Classification Scheme PDF."""

from __future__ import annotations

from pathlib import Path
import re
from typing import Iterator

import pdfplumber

from .models import IRACDocument, IRACNode


_VERSION_RE = re.compile(r"\b(?:version|ver\.?|v)\s*(?P<version>\d+(?:\.\d+){0,3})\b", re.I)
_GROUP_RE = re.compile(r"^\s*(?:IRAC\s+)?(?:group\s+)?(?P<code>UN[A-Z]*|\d+(?:\.\d+)?[A-Z]?)(?:\s*[-–—:|]\s*|\s+)(?P<name>.+?)\s*$", re.I)
_CODE_RE = re.compile(r"^(?P<number>\d+)(?P<decimal>\.\d+)?(?P<suffix>[A-Z]?)$")
_CLASS_CODE_RE = re.compile(r"^(?:\d+[A-Z]|UN(?:B|E|F|M|P|V)?)\*?$")


class IRACParser:
    """Read official IRAC PDFs without relying on fixed document pagination."""

    def parse(self, pdf_path: str | Path) -> IRACDocument:
        path = Path(pdf_path)
        if not path.is_file():
            raise FileNotFoundError(f"IRAC PDF was not found: {path}")

        with pdfplumber.open(path) as pdf:
            pages = [(number, page.extract_text() or "") for number, page in enumerate(pdf.pages, 1)]
            version = next((_detect_version(text) for _, text in pages if _detect_version(text)), None)
            table_pages = [number for number, text in pages if "IRAC MoA Classification Version" in text]
            if table_pages:
                return IRACDocument(version, tuple(_parse_classification_tables(pdf, pages, table_pages)))
            return IRACDocument(version, tuple(_parse_simple_pages(pages)))


def parse_irac_pdf(pdf_path: str | Path) -> IRACDocument:
    return IRACParser().parse(pdf_path)


def _parse_classification_tables(pdf, pages, table_pages: list[int]) -> Iterator[IRACNode]:
    """Parse the v11 table by its columns, excluding narrative occurrences of codes."""
    groups = _appendix_groups(pages)
    classes: list[IRACNode] = []
    ingredients: list[IRACNode] = []
    seen_classes: set[tuple[str, str]] = set()
    seen_ingredients: set[tuple[str, str]] = set()

    group_code: str | None = None
    class_code: str | None = None
    class_name: str | None = None
    ingredient_parts: list[str] = []
    ingredient_page = 0

    def flush_ingredients() -> None:
        nonlocal ingredient_parts
        if not class_code or not ingredient_parts:
            ingredient_parts = []
            return
        for name in _split_ingredients(" ".join(ingredient_parts)):
            key = (class_code, name.casefold())
            if key not in seen_ingredients:
                seen_ingredients.add(key)
                ingredients.append(IRACNode(f"{class_code}:{_identifier_token(name)}", name, 3, class_code, ingredient_page))
        ingredient_parts = []

    def flush_class() -> None:
        nonlocal class_code, class_name
        flush_ingredients()
        if class_code and class_name:
            key = (class_code, class_name.casefold())
            if key not in seen_classes:
                seen_classes.add(key)
                classes.append(IRACNode(class_code, class_name, 2, group_code, ingredient_page))
        class_code = None
        class_name = None

    for page_number in table_pages:
        table = pdf.pages[page_number - 1].extract_table()
        if not table:
            continue
        for row in table[6:]:
            cells = [(cell or "").strip() for cell in row]
            group_cell = " ".join(cells[:2])
            class_cell = " ".join(cells[2:5])
            ingredient_cell = " ".join(cells[5:])
            candidate_group = _table_group_code(group_cell)
            group_changed = False
            if candidate_group and candidate_group != group_code:
                flush_class()
                group_code = candidate_group
                group_changed = True
            candidate_code, candidate_name = _table_class(class_cell)
            if candidate_code and candidate_code != class_code:
                flush_class()
                class_code, class_name, ingredient_page = candidate_code, candidate_name, page_number
            elif candidate_name and class_code and not class_name:
                class_name = candidate_name
            elif candidate_name and group_changed and group_code:
                class_code = f"{group_code}-{_identifier_token(candidate_name)}".upper()
                class_name, ingredient_page = candidate_name, page_number
            if ingredient_cell and class_code:
                ingredient_parts.append(ingredient_cell)
    flush_class()

    # The appendixed group descriptors are the canonical group names.  A table
    # has no group-name field for every continuation row, so do not infer names
    # from partial cell text.
    group_codes = {group.code for group in groups}
    for code in sorted({node.parent_code for node in classes if node.parent_code} - group_codes):
        groups.append(IRACNode(code, f"IRAC group {code}", 1, None, 0))
    yield from groups
    yield from classes
    yield from ingredients


def _appendix_groups(pages: list[tuple[int, str]]) -> list[IRACNode]:
    result: list[IRACNode] = []
    seen: set[str] = set()
    for page_number, text in pages:
        if "MoA group descriptors" not in text and not (24 <= page_number <= 28):
            continue
        for line in text.splitlines():
            match = re.match(r"^Group\s+(?P<code>UN[A-Z]*|\d+)\s*:\s*(?P<name>.+)$", line, re.I)
            if not match:
                continue
            code = match.group("code").upper()
            if code not in seen:
                seen.add(code)
                result.append(IRACNode(code, _normalise_name(match.group("name")), 1, None, page_number))
    return result


def _table_group_code(value: str) -> str | None:
    match = re.match(r"\s*(UN(?:B|E|F|M|P|V)?|\d+)\*?(?:\s|$)", value, re.I)
    return match.group(1).upper() if match else None


def _table_class(value: str) -> tuple[str | None, str | None]:
    lines = [_normalise_name(line) for line in value.splitlines() if _normalise_name(line)]
    if not lines:
        return None, None
    code = None
    if _CLASS_CODE_RE.match(lines[0]):
        code, lines = lines[0].rstrip("*"), lines[1:]
    if not code:
        return None, _normalise_name(" ".join(lines))
    name = _normalise_name(" ".join(line for line in lines if not _CLASS_CODE_RE.match(line))) or None
    if name:
        name = _normalise_name(re.sub(rf"\b{re.escape(code.rstrip('*'))}\b", "", name))
    return code.upper(), name


def _split_ingredients(value: str) -> Iterator[str]:
    value = re.sub(r"(?<=\w)-\s+(?=\w)", "", value)
    value = re.sub(r"\s+", " ", value).strip()
    for part in re.split(r"\s*,\s*", value):
        name = _normalise_name(part)
        if name and not name.startswith("B.t. crop proteins"):
            yield name


def _parse_simple_pages(pages: list[tuple[int, str]]) -> Iterator[IRACNode]:
    """Compatibility parser for the concise text fixtures and older exports."""
    current_class: str | None = None
    for page_number, text in pages:
        for line in text.splitlines():
            match = _GROUP_RE.match(" ".join(line.split()))
            if match:
                code, name = match.group("code").upper(), _normalise_name(match.group("name"))
                level, parent = _hierarchy_for(code)
                yield IRACNode(code, name, level, parent, page_number)
                current_class = code if level == 2 else current_class
                continue
            if current_class and line.lower().startswith("active ingredients:"):
                for name in _split_ingredients(line.split(":", 1)[1]):
                    yield IRACNode(f"{current_class}:{_identifier_token(name)}", name, 3, current_class, page_number)


def _detect_version(text: str) -> str | None:
    match = _VERSION_RE.search(text)
    return match.group("version") if match else None


def _normalise_name(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip(" -:|*")


def _identifier_token(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")


def _hierarchy_for(code: str) -> tuple[int, str | None]:
    if code.startswith("UN"):
        return 1, None
    match = _CODE_RE.match(code)
    if not match:
        return 1, None
    return (2, match.group("number")) if match.group("decimal") or match.group("suffix") else (1, None)
