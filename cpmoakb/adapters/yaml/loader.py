"""High-level one-document candidate loading API."""

from __future__ import annotations

from pathlib import Path

from cpmoakb.domain import CandidateRecord

from .errors import YamlFileError
from .mapper import map_candidate_document
from .parser import parse_candidate_yaml, parse_candidate_yaml_bytes


def load_candidate_yaml(text: str) -> CandidateRecord:
    return map_candidate_document(parse_candidate_yaml(text))


def load_candidate_yaml_bytes(data: bytes) -> CandidateRecord:
    return map_candidate_document(parse_candidate_yaml_bytes(data))


def load_candidate_yaml_file(path: Path) -> CandidateRecord:
    """Load exactly one explicit local path without search or fallback behavior."""

    if not isinstance(path, Path):
        raise TypeError("path must be pathlib.Path")
    if str(path).startswith(("\\\\", "//")):
        raise YamlFileError("network paths are prohibited", path=str(path))
    try:
        data = path.read_bytes()
    except OSError as error:
        raise YamlFileError(
            f"could not read file: {error.strerror or error}", path=str(path)
        ) from error
    return load_candidate_yaml_bytes(data)
